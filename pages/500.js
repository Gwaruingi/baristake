import React from 'react';
import Head from 'next/head';

export default function Custom500() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '0 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <Head>
        <title>500 - Server Error | Job Portal</title>
      </Head>
      
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        500 - Server Error
      </h1>
      
      <p style={{ fontSize: '1.2rem', maxWidth: '600px', marginBottom: '2rem' }}>
        We're sorry, but something went wrong on our server. Our team has been notified and is working to fix the issue.
      </p>
      
      <div>
        <button 
          onClick={() => window.location.href = '/'}
          style={{
            backgroundColor: '#0070f3',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '5px',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Go to Home Page
        </button>
      </div>
    </div>
  );
}
