'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X } from 'lucide-react';

export default function SimpleNavbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check if viewport is mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navbarStyle = {
    backgroundColor: 'white',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    position: 'relative',
    zIndex: 10
  } as React.CSSProperties;

  const containerStyle = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0.75rem 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  } as React.CSSProperties;

  const logoStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#d71921',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center'
  } as React.CSSProperties;

  const desktopNavStyle = {
    display: isMobile ? 'none' : 'flex',
    alignItems: 'center',
    gap: '1rem'
  } as React.CSSProperties;

  const linkStyle = {
    color: '#374151',
    fontWeight: '500',
    textDecoration: 'none',
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem'
  } as React.CSSProperties;

  const buttonStyle = {
    backgroundColor: '#d71921',
    color: 'white',
    fontWeight: '500',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem'
  } as React.CSSProperties;

  const mobileMenuButtonStyle = {
    display: isMobile ? 'block' : 'none',
    backgroundColor: 'transparent',
    border: 'none',
    padding: '0.5rem',
    cursor: 'pointer'
  } as React.CSSProperties;

  const mobileMenuStyle = {
    display: isMenuOpen && isMobile ? 'block' : 'none',
    backgroundColor: 'white',
    padding: '1rem',
    borderTop: '1px solid #e5e7eb'
  } as React.CSSProperties;

  const mobileMenuItemsStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  } as React.CSSProperties;

  return (
    <nav style={navbarStyle}>
      <div style={containerStyle}>
        {/* Logo */}
        <Link href="/" style={logoStyle}>
          Job Portal
        </Link>

        {/* Desktop Navigation */}
        <div style={desktopNavStyle}>
          <Link href="/jobs" style={linkStyle}>
            Find Jobs
          </Link>

          {session ? (
            <>
              <Link href="/dashboard" style={linkStyle}>
                Dashboard
              </Link>
              <button 
                onClick={() => signOut()} 
                style={buttonStyle}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" style={{...linkStyle, marginRight: '0.5rem'}}>
                Sign in
              </Link>
              <Link href="/auth/register" style={{...buttonStyle, textDecoration: 'none'}}>
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu} 
          style={mobileMenuButtonStyle}
        >
          {isMenuOpen ? (
            <X size={24} color="#374151" />
          ) : (
            <Menu size={24} color="#374151" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div style={mobileMenuStyle}>
        <div style={mobileMenuItemsStyle}>
          <Link href="/jobs" style={linkStyle}>
            Find Jobs
          </Link>

          {session ? (
            <>
              <Link href="/dashboard" style={linkStyle}>
                Dashboard
              </Link>
              <button 
                onClick={() => signOut()} 
                style={buttonStyle}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" style={linkStyle}>
                Sign in
              </Link>
              <Link href="/auth/register" style={{...buttonStyle, textDecoration: 'none', display: 'inline-block', marginTop: '0.5rem'}}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
