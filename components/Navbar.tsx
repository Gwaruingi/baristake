'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import NotificationDropdown from './NotificationDropdown';
import '../app/styles/navbar.css';

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="reed-navbar">
      <div className="reed-navbar-container">
        <div className="flex items-center">
          <Link href="/" className="reed-logo">
            Job Portal
          </Link>
          <div className="reed-nav-links">
            <Link href="/jobs" className="reed-nav-link">
              Jobs
            </Link>
            {session?.user?.role === 'admin' && (
              <Link href="/admin/dashboard" className="reed-nav-link">
                Dashboard
              </Link>
            )}
            {session?.user?.role === 'jobseeker' && (
              <Link href="/dashboard" className="reed-nav-link">
                My Applications
              </Link>
            )}
          </div>
        </div>
        
        <div className="reed-auth-section">
          {session ? (
            <>
              {/* Notification Dropdown */}
              {session.user?.role === 'jobseeker' && (
                <div className="mr-4">
                  <NotificationDropdown />
                </div>
              )}
              
              <div className="reed-user-menu">
                <button
                  onClick={toggleMenu}
                  className="reed-user-button"
                  aria-expanded={isMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="reed-user-avatar">
                    {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                  </div>
                  <span>{session.user?.name || session.user?.email}</span>
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {isMenuOpen && (
                  <div className="reed-dropdown">
                    <Link
                      href="/profile"
                      className="reed-dropdown-item"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    {session.user?.role === 'jobseeker' && (
                      <Link
                        href="/dashboard"
                        className="reed-dropdown-item"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Applications
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: '/' });
                        setIsMenuOpen(false);
                      }}
                      className="reed-dropdown-button"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex space-x-4">
              <Link href="/auth/signin" className="reed-nav-link">
                Sign in
              </Link>
              <Link href="/auth/register" className="reed-button">
                Register
              </Link>
            </div>
          )}
          
          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="reed-mobile-menu-button"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="reed-mobile-menu">
          <div className="reed-mobile-menu-header">
            <Link href="/" className="reed-logo" onClick={() => setIsMobileMenuOpen(false)}>
              Job Portal
            </Link>
            <button
              onClick={toggleMobileMenu}
              className="reed-mobile-menu-close"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="reed-mobile-nav-links">
            <Link href="/jobs" className="reed-mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Jobs
            </Link>
            {session?.user?.role === 'admin' && (
              <Link href="/admin/dashboard" className="reed-mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                Dashboard
              </Link>
            )}
            {session?.user?.role === 'jobseeker' && (
              <Link href="/dashboard" className="reed-mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                My Applications
              </Link>
            )}
            {!session && (
              <>
                <Link href="/auth/signin" className="reed-mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign in
                </Link>
                <Link href="/auth/register" className="reed-mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
            {session && (
              <>
                <Link href="/profile" className="reed-mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Your Profile
                </Link>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: '/' });
                    setIsMobileMenuOpen(false);
                  }}
                  className="reed-mobile-nav-link"
                  style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none' }}
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
