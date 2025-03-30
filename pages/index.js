import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// This is a simple redirect page to ensure compatibility with Vercel
export default function Home() {
  const router = useRouter();
  const [error, setError] = useState(null);
  
  useEffect(() => {
    try {
      // Redirect to the App Router home page
      router.replace('/');
    } catch (err) {
      console.error('Navigation error:', err);
      setError('Failed to redirect. Please click the button below to go to the home page.');
    }
  }, [router]);
  
  const handleManualRedirect = () => {
    window.location.href = '/';
  };
  
  return (
    <>
      <Head>
        <title>Job Portal - Redirecting</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1>Job Portal</h1>
        {error ? (
          <>
            <p style={{ color: 'red' }}>{error}</p>
            <button 
              onClick={handleManualRedirect}
              style={{
                backgroundColor: '#0070f3',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '20px'
              }}
            >
              Go to Home Page
            </button>
          </>
        ) : (
          <p>Redirecting to Job Portal... Please wait.</p>
        )}
      </div>
    </>
  );
}
