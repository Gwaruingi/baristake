'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
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
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            Something went wrong!
          </h1>
          
          <p style={{ fontSize: '1.2rem', maxWidth: '600px', marginBottom: '2rem' }}>
            We apologize for the inconvenience. Our team has been notified and is working to fix the issue.
          </p>
          
          <div>
            <button
              onClick={reset}
              style={{
                backgroundColor: '#0070f3',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '5px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Try again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                backgroundColor: '#f0f0f0',
                color: '#333',
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
      </body>
    </html>
  )
}
