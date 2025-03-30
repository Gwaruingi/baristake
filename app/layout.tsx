import type { Metadata } from "next";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import "./styles/custom.css"; 
import Navbar from "../components/Navbar";
import { Toaster } from "@/components/ui/toast";
import ToastProvider from "@/components/ToastProvider";
import { ErrorBoundary } from "../components/ErrorBoundary";

// comments

export const metadata: Metadata = {
  title: "Job Portal - Find Your Next Career Opportunity",
  description: "A modern job portal connecting talented professionals with great companies",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Wrap auth in try/catch to prevent 500 errors if auth fails
  let session = null;
  try {
    session = await auth();
  } catch (error) {
    console.error("Authentication error:", error);
    // Continue with null session - the app will still render
  }
  
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          {/* Navbar is included here but will be loaded client-side */}
          <Navbar />
          <div className="min-h-screen">
            <ErrorBoundary>
              <main>
                {children}
              </main>
            </ErrorBoundary>
          </div>
          <Toaster />
          <ToastProvider />
        </SessionProvider>
      </body>
    </html>
  );
}
