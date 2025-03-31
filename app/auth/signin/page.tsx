import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";

export default async function SignInPage() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

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

  return (
    <div style={pageStyle}>
      <AuthForm />
    </div>
  );
}
