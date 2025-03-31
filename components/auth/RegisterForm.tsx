'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingSpinner from '@/components/LoadingSpinner';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  role: z.enum(['jobseeker', 'company']),
  companyName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.role === 'company' && !data.companyName) {
    return false;
  }
  return true;
}, {
  message: "Company name is required for company registration",
  path: ["companyName"]
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'jobseeker',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      if (data.role === 'company') {
        router.push('/company/profile');
      } else {
        router.push('/auth/signin');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '500px',
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
          Create your account
        </h2>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#b91c1c',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '16px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      <form style={{ marginTop: '24px' }} onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <Label htmlFor="name" style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#333'
            }}>
              Full Name
            </Label>
            <Input
              {...register('name')}
              type="text"
              placeholder="John Doe"
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
            {errors.name && (
              <p style={{
                marginTop: '4px',
                fontSize: '13px',
                color: '#e11d48'
              }}>
                {errors.name.message}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <Label htmlFor="email" style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#333'
            }}>
              Email address
            </Label>
            <Input
              {...register('email')}
              type="email"
              placeholder="you@example.com"
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
            {errors.email && (
              <p style={{
                marginTop: '4px',
                fontSize: '13px',
                color: '#e11d48'
              }}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <Label htmlFor="password" style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#333'
            }}>
              Password
            </Label>
            <Input
              {...register('password')}
              type="password"
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
            {errors.password && (
              <p style={{
                marginTop: '4px',
                fontSize: '13px',
                color: '#e11d48'
              }}>
                {errors.password.message}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <Label htmlFor="confirmPassword" style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#333'
            }}>
              Confirm Password
            </Label>
            <Input
              {...register('confirmPassword')}
              type="password"
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
            {errors.confirmPassword && (
              <p style={{
                marginTop: '4px',
                fontSize: '13px',
                color: '#e11d48'
              }}>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <Label htmlFor="role" style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#333'
            }}>
              Account Type
            </Label>
            <select
              {...register('role')}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '15px',
                backgroundColor: 'white',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            >
              <option value="jobseeker">Job Seeker</option>
              <option value="company">Company</option>
            </select>
            {errors.role && (
              <p style={{
                marginTop: '4px',
                fontSize: '13px',
                color: '#e11d48'
              }}>
                {errors.role.message}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <Label htmlFor="companyName" style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#333'
            }}>
              Company Name
            </Label>
            <Input
              {...register('companyName')}
              type="text"
              placeholder="TechCorp"
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
            {errors.companyName && (
              <p style={{
                marginTop: '4px',
                fontSize: '13px',
                color: '#e11d48'
              }}>
                {errors.companyName.message}
              </p>
            )}
          </div>
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
              padding: '12px',
              backgroundColor: '#5e2ced',
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
              if (!isLoading) e.currentTarget.style.backgroundColor = '#4a22b9';
            }}
            onMouseOut={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = '#5e2ced';
            }}
          >
            {isLoading ? <LoadingSpinner /> : 'Create account'}
          </button>
        </div>
      </form>

      <div style={{ 
        marginTop: '24px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#4b5563'
      }}>
        <p>
          Already have an account?{' '}
          <a 
            href="/auth/signin" 
            style={{
              fontWeight: '500',
              color: '#5e2ced',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#4a22b9'}
            onMouseOut={(e) => e.currentTarget.style.color = '#5e2ced'}
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
