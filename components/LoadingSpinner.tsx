import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
}

export default function LoadingSpinner({ className = '' }: LoadingSpinnerProps) {
  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-red-600 ${className || 'h-4 w-4'}`} style={{ borderColor: '#d71921' }}></div>
    </div>
  );
}
