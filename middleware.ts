import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
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
    const callbackUrl = encodeURIComponent(req.nextUrl.pathname);
    const signInUrl = new URL(`/auth/signin?callbackUrl=${callbackUrl}`, req.nextUrl.origin);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (authentication routes like signin, signout)
     * - assets (public assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth|assets).*)',
  ],
};
