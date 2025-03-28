import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import Navbar from "../components/Navbar";
import { Toaster } from "@/components/ui/toast";
import ToastProvider from "@/components/ToastProvider";

// comments

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Job Portal - Find Your Next Career Opportunity",
  description: "A modern job portal connecting talented professionals with great companies",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable} font-sans`}>
      <body className="antialiased min-h-screen flex flex-col">
        <SessionProvider session={session}>
          {/* Navbar is included here but will be loaded client-side */}
          <Navbar />
          <div className="flex-grow flex flex-col">
            <main className="flex-grow">
              {children}
            </main>
          </div>
          <Toaster />
          <ToastProvider />
        </SessionProvider>
      </body>
    </html>
  );
}
