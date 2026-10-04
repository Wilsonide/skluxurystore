import { NextRequest, NextResponse } from "next/server";

const adminRoutes = ["/admin"];
const protectedRoutes = ["/checkout", "/orders", "/profile"];

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const refreshToken = req.cookies.get("refreshToken");

  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // ❌ NOT logged in → block protected + admin routes
  if ((isProtectedRoute || isAdminRoute) && !refreshToken) {
    const loginUrl = new URL("/login", req.url);

    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/profile/:path*",
  ],
};
