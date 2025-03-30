import { useEffect } from 'react';
import { useRouter } from 'next/router';

// This is a simple redirect page to ensure compatibility with Vercel
export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the App Router home page
    router.replace('/');
  }, [router]);
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <h1>Redirecting to Job Portal...</h1>
      <p>Please wait while we redirect you to the main application.</p>
    </div>
  );
}
