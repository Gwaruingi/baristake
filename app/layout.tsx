import type { Metadata } from 'next';
import './globals.css';
import SimpleNavbar from '@/components/SimpleNavbar';
import ClientProviders from '@/components/providers/ClientProviders';

export const metadata: Metadata = {
  title: 'Job Portal',
  description: 'Find your next job',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ 
        margin: 0, 
        padding: 0, 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <ClientProviders>
          <SimpleNavbar />
          <main style={{ flexGrow: 1 }}>
            {children}
          </main>
        </ClientProviders>
      </body>
    </html>
  );
}
