'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function PasswordResetRequest() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      toast.error('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/password/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSuccess(true);
      toast.success('Password reset link sent to your email');
      router.push('/auth/signin');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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
              marginBottom: '16px',
              color: '#333'
            }}>
              Password Reset Requested
            </h2>
            <p style={{
              textAlign: 'center',
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '24px'
            }}>
              If an account exists with this email, you will receive a reset link shortly.
              Please check your email inbox (and spam folder) for the reset instructions.
            </p>
          </div>

          <div style={{ marginTop: '24px' }}>
            <button
              onClick={() => router.push('/auth/signin')}
              style={{
                position: 'relative',
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
                padding: '12px',
                backgroundColor: '#5e2ced',
                color: 'white',
                fontSize: '15px',
                fontWeight: '500',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4a22b9'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#5e2ced'}
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            marginBottom: '16px',
            color: '#333'
          }}>
            Reset Your Password
          </h2>
          <p style={{
            textAlign: 'center',
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '24px'
          }}>
            Enter your email address to receive a password reset link.
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form style={{ marginTop: '24px' }} onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <div>
              <Label 
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
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
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
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              style={{
                position: 'relative',
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
                padding: '12px',
                backgroundColor: '#5e2ced',
                color: 'white',
                fontSize: '15px',
                fontWeight: '500',
                borderRadius: '6px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'background-color 0.2s',
              }}
              disabled={loading}
              onMouseOver={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#4a22b9';
              }}
              onMouseOut={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#5e2ced';
              }}
            >
              {loading ? (
                <LoadingSpinner className="w-4 h-4" />
              ) : (
                'Send Reset Link'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
