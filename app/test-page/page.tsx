'use client';

import { useState } from 'react';

export default function TestPage() {
  const [count, setCount] = useState(0);
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Test Page</h1>
      <p style={{ marginBottom: '2rem' }}>This is a minimal test page to verify deployment works.</p>
      
      <div style={{ marginBottom: '2rem' }}>
        <p>Counter: {count}</p>
        <button 
          onClick={() => setCount(count + 1)}
          style={{
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Increment
        </button>
      </div>
      
      <div>
        <p>Environment: {process.env.NODE_ENV}</p>
      </div>
    </div>
  );
}
