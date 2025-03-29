import { Resend } from 'resend';

// Initialize Resend only when needed to avoid issues during build
let resendInstance: Resend | null = null;

/**
 * Get the Resend client instance
 * This function lazily initializes the Resend client only when needed
 * to avoid issues during build time
 */
export function getResend(): Resend | null {
  // Only initialize in a browser or server runtime environment, not during build
  if (typeof window === 'undefined' && !resendInstance && process.env.RESEND_API_KEY) {
    // Server-side initialization
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  } else if (typeof window !== 'undefined' && !resendInstance && process.env.NEXT_PUBLIC_RESEND_API_KEY) {
    // Client-side initialization (if needed)
    resendInstance = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);
  }
  
  return resendInstance;
}
