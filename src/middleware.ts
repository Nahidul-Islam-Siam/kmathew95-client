/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextFetchEvent } from "next/server";
import { NextResponse } from "next/server";

// Helper to decode JWT (no external deps)
function decodeToken(token: string) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(atob(payload));
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
}

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const token = request.cookies.get("accessToken")?.value;
  const url = request.nextUrl;

  // console.log("Token from cookies:", token);
  // console.log("Requested URL:", url.pathname);

  // If no token, redirect to login
  if (!token) {
    console.log("No token found, redirecting to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Decode token to get role
  const decoded = decodeToken(token);
  const role = decoded?.role?.toLowerCase();
  const userId = decoded?.userId || decoded?.id;

  if (!role || !userId) {
    console.log("Invalid token payload, missing role or userId");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Define protected paths
  if (url.pathname.startsWith("/admin")) {
    if (role !== "admin") {
      console.log("Non-admin tried to access /admin: ", role);
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (url.pathname.startsWith("/dashboard")) {
    if (role !== "trader") {
      console.log("Non-trader tried to access /dashboard: ", role);
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // For any other protected routes, you can extend logic here

  // If user is logged in but trying to access public pages (like /login), redirect them
  if (url.pathname === "/login" || url.pathname === "/register") {
    // Redirect based on role
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else if (role === "trader") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Allow access for now (extend as needed)
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protect admin and dashboard routes
    "/admin/:path*",
    "/dashboard/:path*",

  ],
};