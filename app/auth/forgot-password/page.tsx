'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.replace("/");
    } else if (status !== "loading") {
      setIsLoading(false);
    }
  }, [session, status, router]);

  // Styles
  const pageStyle = {
    minHeight: 'calc(100vh - 60px)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    backgroundColor: '#f9fafb'
  };

  const loadingContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 60px)',
    backgroundColor: '#f9fafb'
  };

  const loadingSpinnerStyle = {
    width: '2.5rem',
    height: '2.5rem',
    border: '0.25rem solid #f3f3f3',
    borderTop: '0.25rem solid #d71921',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  if (isLoading) {
    return (
      <div style={loadingContainerStyle}>
        <div style={loadingSpinnerStyle}></div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <ForgotPasswordForm />
    </div>
  );
}
