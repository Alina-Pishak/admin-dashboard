import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_SESSION_COOKIE_NAME } from "./lib/auth-cookie";

function hasValidSessionCookie(request: NextRequest): boolean {
  const token = request.cookies.get(AUTH_SESSION_COOKIE_NAME)?.value;
  return typeof token === "string" && token.length >= 8;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = hasValidSessionCookie(request);

  if (pathname.startsWith("/login")) {
    if (hasSession) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!hasSession) {
    const login = new URL("/login", request.url);
    login.searchParams.set("from", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
