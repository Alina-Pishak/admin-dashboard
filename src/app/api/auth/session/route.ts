import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_SESSION_COOKIE_NAME } from "@/lib/auth-cookie";

const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const token =
    body &&
    typeof body === "object" &&
    "token" in body &&
    typeof (body as { token: unknown }).token === "string"
      ? (body as { token: string }).token
      : "";
  if (!token || token.length < 8) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const jar = await cookies();
  jar.set(AUTH_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete(AUTH_SESSION_COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
