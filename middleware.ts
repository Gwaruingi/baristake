import { NextResponse, NextRequest } from "next/server";
// import { auth } from "@/auth"; // Cannot reliably use auth() from v4 in Edge middleware

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Determine session cookie name based on environment (presence of NEXTAUTH_URL)
  // Default to secure prefix
  const cookieName = process.env.NEXTAUTH_URL?.startsWith('https://') 
    ? '__Secure-next-auth.session-token' 
    : 'next-auth.session-token';

  const sessionCookie = req.cookies.get(cookieName);

  // Define protected routes
  const isProtectedRoute = 
    path.startsWith("/admin") ||
    path.startsWith("/jobs/apply") ||
    path.startsWith("/profile") ||
    path.startsWith("/company");

  // Handle protected routes
  if (isProtectedRoute) {
    // If no session cookie, redirect to sign in
    if (!sessionCookie) {
      const callbackUrl = encodeURIComponent(req.nextUrl.pathname);
      // Use req.nextUrl.origin for the base URL to construct the redirect URL
      const signInUrl = new URL(`/auth/signin?callbackUrl=${callbackUrl}`, req.nextUrl.origin);
      return NextResponse.redirect(signInUrl);
    }
    // IMPORTANT: Role checks (admin, company, etc.) must now be done
    // within the specific page/layout Server Components or API routes
    // using the auth() helper or getServerSession.
  }

  // Handle logged-in user redirection from home page ("/")
  // This redirection based on role CANNOT happen reliably here anymore.
  // It should be handled on the home page component itself.
  /* 
  if (path === "/" && sessionCookie) {
    // Cannot access token.role here. Logic moved to page.
  }
  */

  return NextResponse.next();
  // Removed try/catch as the main source of error (auth() call) is gone.
  // Basic cookie check is less likely to throw.
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
    // Include root path explicitly if needed, although the above pattern should cover it
    // '/',
  ],
};
