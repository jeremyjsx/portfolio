import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const VISITOR_COOKIE = "visitor_id";

function createVisitorId(): string {
  return crypto.randomUUID();
}

export async function getOrCreateVisitorId(): Promise<{
  visitorId: string;
  shouldSetCookie: boolean;
}> {
  const jar = await cookies();
  const current = jar.get(VISITOR_COOKIE)?.value;
  if (current) {
    return { visitorId: current, shouldSetCookie: false };
  }

  return { visitorId: createVisitorId(), shouldSetCookie: true };
}

export function withVisitorCookie(
  response: NextResponse,
  visitorId: string,
  shouldSetCookie: boolean,
) {
  if (!shouldSetCookie) {
    return response;
  }

  response.cookies.set(VISITOR_COOKIE, visitorId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
