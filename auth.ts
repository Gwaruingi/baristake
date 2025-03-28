import { getServerSession } from "next-auth/next";
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";
import { authOptions } from "./pages/api/auth/[...nextauth]";
import { NextAuthOptions } from "next-auth";

// Compatibility layer for NextAuth v4 to work with App Router components
export const auth = async () => {
  return await getServerSession(authOptions as NextAuthOptions);
};

export const signIn = nextAuthSignIn;
export const signOut = nextAuthSignOut;

// Mock handlers for compatibility with existing code
export const handlers = {
  GET: async (req: Request) => {
    return new Response("Auth API route handled by Pages Router", { status: 200 });
  },
  POST: async (req: Request) => {
    return new Response("Auth API route handled by Pages Router", { status: 200 });
  }
};
