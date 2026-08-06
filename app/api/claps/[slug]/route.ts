import { NextResponse } from "next/server";
import {
  CLAP_MAX_AMOUNT_PER_REQUEST,
  addClaps,
  getClapCounts,
  isValidClapSlug,
} from "@/lib/writing/claps";
import {
  getOrCreateVisitorId,
  withVisitorCookie,
} from "@/lib/writing/visitor";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (!isValidClapSlug(slug)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { visitorId, shouldSetCookie } = await getOrCreateVisitorId();
  const counts = await getClapCounts(slug, visitorId);

  return withVisitorCookie(
    NextResponse.json(counts),
    visitorId,
    shouldSetCookie,
  );
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

  const { visitorId, shouldSetCookie } = await getOrCreateVisitorId();
  const counts = await addClaps(slug, visitorId, amount);

  if (!counts) {
    return withVisitorCookie(
      NextResponse.json({ error: "Claps unavailable" }, { status: 503 }),
      visitorId,
      shouldSetCookie,
    );
  }

  return withVisitorCookie(
    NextResponse.json(counts),
    visitorId,
    shouldSetCookie,
  );
}
