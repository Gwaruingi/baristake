// import { NextResponse, NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";

// // This is a simplified middleware that should work with Vercel Edge Runtime
// export async function middleware(req: NextRequest) {
//   const path = req.nextUrl.pathname;

//   // Use getToken to check for session in an Edge-compatible way
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//   // Define protected routes
//   const isProtectedRoute = 
//     path.startsWith("/admin") ||
//     path.startsWith("/jobs/apply") ||
//     path.startsWith("/profile") ||
//     path.startsWith("/company");

//   // Handle protected routes
//   if (isProtectedRoute && !token) {
//     // Create a new URL for redirection
//     const url = req.nextUrl.clone();
//     url.pathname = "/auth/signin";
//     url.searchParams.set("callbackUrl", req.nextUrl.pathname);
//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }

// // Limit middleware to specific paths to avoid issues
// export const config = {
//   matcher: [
//     '/admin/:path*',
//     '/jobs/apply/:path*',
//     '/profile/:path*',
//     '/company/:path*'
//   ]
// };
