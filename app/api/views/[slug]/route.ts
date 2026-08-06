import { NextResponse } from "next/server";
import { isValidClapSlug } from "@/lib/writing/claps";
import {
  getOrCreateVisitorId,
  withVisitorCookie,
} from "@/lib/writing/visitor";
import { recordUniqueDailyView } from "@/lib/writing/views";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

/** Quiet unique-visitor-per-day view counter. No UI yet. */
export async function POST(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (!isValidClapSlug(slug)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { visitorId, shouldSetCookie } = await getOrCreateVisitorId();
  const result = await recordUniqueDailyView(slug, visitorId);

  if (!result) {
    return withVisitorCookie(
      new NextResponse(null, { status: 204 }),
      visitorId,
      shouldSetCookie,
    );
  }

  return withVisitorCookie(
    NextResponse.json(result),
    visitorId,
    shouldSetCookie,
  );
}
