import { useState } from 'react';

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      setStatus('idle');
      setMessage('');

      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to process request');
      }

      setStatus('success');
      setMessage('Password reset instructions have been sent to your email');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          marginBottom: '16px',
          color: '#111827'
        }}>
          Reset your password
        </h2>
        <p style={{
          textAlign: 'center',
          fontSize: '14px',
          color: '#6b7280',
          marginBottom: '24px'
        }}>
          Enter your email address and we'll send you instructions to reset your password.
        </p>
      </div>

      {status !== 'idle' && (
        <div
          style={{
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '14px',
            backgroundColor: status === 'success' ? '#f0fdf4' : '#fee2e2',
            color: status === 'success' ? '#166534' : '#b91c1c',
            borderLeft: status === 'success' ? '4px solid #22c55e' : '4px solid #d71921'
          }}
        >
          {message}
        </div>
      )}

      <form style={{ marginTop: '24px' }} onSubmit={handleSubmit}>
        <div style={{ marginBottom: '24px' }}>
          <label 
            htmlFor="email" 
            style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#333'
            }}
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '15px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              position: 'relative',
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '12px',
              backgroundColor: '#d71921',
              color: 'white',
              fontSize: '15px',
              fontWeight: '500',
              borderRadius: '6px',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = '#b91c1c';
            }}
            onMouseOut={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = '#d71921';
            }}
          >
            {isLoading ? 'Sending...' : 'Send reset instructions'}
          </button>
        </div>
      </form>

      <div style={{ 
        marginTop: '24px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#4b5563'
      }}>
        <a
          href="/auth/signin"
          style={{
            fontWeight: '500',
            color: '#d71921',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = '#b91c1c'}
          onMouseOut={(e) => e.currentTarget.style.color = '#d71921'}
        >
          Back to sign in
        </a>
      </div>
    </div>
  );
}
