import { NextResponse, NextRequest } from "next/server";

// This is a simplified middleware that should work with Vercel Edge Runtime
export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Check for session cookie - try both secure and non-secure versions
  const hasSessionCookie = 
    req.cookies.has('next-auth.session-token') || 
    req.cookies.has('__Secure-next-auth.session-token');

  // Define protected routes
  const isProtectedRoute = 
    path.startsWith("/admin") ||
    path.startsWith("/jobs/apply") ||
    path.startsWith("/profile") ||
    path.startsWith("/company");

  // Handle protected routes
  if (isProtectedRoute && !hasSessionCookie) {
    // Create a new URL for redirection
    const url = req.nextUrl.clone();
    url.pathname = "/auth/signin";
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Limit middleware to specific paths to avoid issues
export const config = {
  matcher: [
    '/admin/:path*',
    '/jobs/apply/:path*',
    '/profile/:path*',
    '/company/:path*'
  ]
};
