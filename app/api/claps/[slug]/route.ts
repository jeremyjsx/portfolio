import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  CLAP_COOKIE,
  CLAP_MAX_AMOUNT_PER_REQUEST,
  addClaps,
  getClapCounts,
  isValidClapSlug,
} from "@/lib/writing/claps";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

function createVisitorId(): string {
  return crypto.randomUUID();
}

async function getOrCreateVisitorId(): Promise<{
  visitorId: string;
  isNew: boolean;
}> {
  const jar = await cookies();
  const existing = jar.get(CLAP_COOKIE)?.value;
  if (existing) {
    return { visitorId: existing, isNew: false };
  }

  return { visitorId: createVisitorId(), isNew: true };
}

function withVisitorCookie(response: NextResponse, visitorId: string, isNew: boolean) {
  if (!isNew) {
    return response;
  }

  response.cookies.set(CLAP_COOKIE, visitorId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (!isValidClapSlug(slug)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { visitorId, isNew } = await getOrCreateVisitorId();
  const counts = await getClapCounts(slug, visitorId);

  return withVisitorCookie(NextResponse.json(counts), visitorId, isNew);
}

export async function POST(request: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (!isValidClapSlug(slug)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let amount = 1;
  try {
    const body = (await request.json()) as { amount?: unknown };
    if (typeof body.amount === "number" && Number.isFinite(body.amount)) {
      amount = body.amount;
    }
  } catch {
    amount = 1;
  }

  if (amount < 1 || amount > CLAP_MAX_AMOUNT_PER_REQUEST) {
    return NextResponse.json(
      { error: `amount must be between 1 and ${CLAP_MAX_AMOUNT_PER_REQUEST}` },
      { status: 400 },
    );
  }

  const { visitorId, isNew } = await getOrCreateVisitorId();
  const counts = await addClaps(slug, visitorId, amount);

  if (!counts) {
    return withVisitorCookie(
      NextResponse.json({ error: "Claps unavailable" }, { status: 503 }),
      visitorId,
      isNew,
    );
  }

  return withVisitorCookie(NextResponse.json(counts), visitorId, isNew);
}
