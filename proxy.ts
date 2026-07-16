// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Role } from "@/models/authentication/user"; // adjust import

const AUTH_ROUTES = ["/signin", "/signup", "/forgot-password"];

const ROLE_ACCESS: Record<string, Role[]> = {
  "/events": ["admin", "accountant", "inventory_manager", "employee"],
  "/inventory": ["admin", "accountant", "inventory_manager"],
  "/accounts": ["admin", "accountant"],
  "/employees": ["admin", "accountant", "employee"],
  "/settings": ["admin"],
};

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // 0. "/" pe koi bhi aaye — seedha /events pe fek do, na yaha ruko na sochne do
  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/events", request.url));
    }
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 1. Authenticated user trying to visit signin/signup/forgot-password → bhaga do dashboard pe
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/events", request.url));
  }

  // 2. Unauthenticated user trying to visit anything OTHER than auth routes → signin pe bhej
  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 3. Role-based protection (sirf authenticated users ke liye relevant)
  if (token) {
    const matchedRoute = Object.keys(ROLE_ACCESS).find((route) => pathname.startsWith(route));
    if (matchedRoute) {
      const allowedRoles = ROLE_ACCESS[matchedRoute];
      const userRole = token.role as Role;
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/events", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};