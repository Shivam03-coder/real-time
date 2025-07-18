import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getSessionToken(request: NextRequest) {
  const access = request.cookies.get("accessToken")?.value;
  const refresh = request.cookies.get("refreshToken")?.value;
  console.log("accessToken:", request.cookies.get("accessToken")?.value);
  console.log("refreshToken:", request.cookies.get("refreshToken")?.value);

  return access && refresh;
}

export function middleware(request: NextRequest) {
  const hasToken = Boolean(getSessionToken(request));
  const { pathname } = request.nextUrl;

  const protectedPaths = ["/dashboard", "/products"];
  const authPaths = ["/sign-in", "/sign-up"];

  // Redirect authenticated users trying to visit sign-in or sign-up
  if (hasToken && authPaths.some((path) => pathname.startsWith(path))) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    console.log("Redirecting authenticated user from auth page to /");
    return NextResponse.redirect(url);
  }

  // Redirect unauthenticated users trying to access protected paths
  if (!hasToken && protectedPaths.some((path) => pathname.startsWith(path))) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    console.log("Redirecting unauthenticated user to sign-in");
    return NextResponse.redirect(url);
  }

  // Allow access to public pages like `/`
  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/dashboard/:path*", "/products/:path*"],
};
