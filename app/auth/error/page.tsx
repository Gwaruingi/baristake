'use client';

import { useSearchParams } from 'next/navigation';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams ? searchParams.get('error') : null;

  const errorMessages: { [key: string]: string } = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification token has expired or has already been used.",
    Default: "An error occurred during authentication.",
  };

  const errorMessage = error ? errorMessages[error] : errorMessages.Default;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        padding: '32px',
      }}>
        <div>
          <h2 style={{
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '24px',
            color: '#333'
          }}>
            Authentication Error
          </h2>
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex' }}>
              <div style={{ flexShrink: 0 }}>
                <svg style={{ height: '20px', width: '20px', color: '#ef4444' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div style={{ marginLeft: '12px' }}>
                <h3 style={{ 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#b91c1c' 
                }}>
                  {errorMessage}
                </h3>
              </div>
            </div>
          </div>
          <div style={{ 
            textAlign: 'center',
            marginTop: '24px' 
          }}>
            <a
              href="/auth/signin"
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#5e2ced',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#4a22b9'}
              onMouseOut={(e) => e.currentTarget.style.color = '#5e2ced'}
            >
              Try signing in again
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
