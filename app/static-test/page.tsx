export default function StaticTestPage() {
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
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Static Test Page</h1>
      <p style={{ marginBottom: '2rem' }}>This is a completely static page with no client-side components.</p>
      
      <div style={{ marginBottom: '2rem' }}>
        <p>This page should load even if there are issues with client-side rendering or database connections.</p>
      </div>
      
      <div>
        <a 
          href="/"
          style={{
            backgroundColor: '#0070f3',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Go to Home
        </a>
      </div>
    </div>
  );
}
