import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

function Error({ statusCode }) {
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
        <title>{statusCode ? `${statusCode} Error` : 'Error'} | Job Portal</title>
      </Head>
      
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        {statusCode ? `${statusCode} - Server Error` : 'An Error Occurred'}
      </h1>
      
      <p style={{ fontSize: '1.2rem', maxWidth: '600px', marginBottom: '2rem' }}>
        {statusCode
          ? 'Sorry, there was a problem with the server. We\'re working on fixing it!'
          : 'Sorry, there was a problem with your request.'}
      </p>
      
      <div>
        <Link href="/" passHref>
          <a style={{
            backgroundColor: '#0070f3',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '5px',
            textDecoration: 'none',
            fontWeight: 'bold',
            display: 'inline-block'
          }}>
            Go to Home Page
          </a>
        </Link>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
