import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getUserData } from "./lib/cookie";
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getAuthToken();
  const user = token ? await getUserData() : null;

  const isPublic =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forget-password") ||
    pathname.startsWith("/reset-password");

  // Block unauthenticated access
  if (!token && pathname.startsWith("/user")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Prevent logged-in users from visiting auth pages
  if (token && isPublic) {
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  // Role protection
  if (token && pathname.startsWith("/admin") && user?.role !== "admin") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // what routes to protect/match
    "/admin/:path*",
    "/user/:path*",
  ],
};
