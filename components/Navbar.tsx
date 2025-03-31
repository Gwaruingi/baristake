'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Menu, X, User, ChevronDown, LogOut, Briefcase, Bell } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

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
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center text-xl font-bold text-[#d71921]">
              <span className="sr-only">Job Portal</span>
              <Briefcase className="h-8 w-8 mr-2" />
              <span>Job Portal</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link href="/jobs" className="text-gray-700 hover:text-[#d71921] px-3 py-2 rounded-md text-sm font-medium">
                Find Jobs
              </Link>
              {session?.user?.role === 'admin' && (
                <Link href="/admin/dashboard" className="text-gray-700 hover:text-[#d71921] px-3 py-2 rounded-md text-sm font-medium">
                  Admin Dashboard
                </Link>
              )}
              {session?.user?.role === 'jobseeker' && (
                <Link href="/dashboard" className="text-gray-700 hover:text-[#d71921] px-3 py-2 rounded-md text-sm font-medium">
                  My Applications
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            {session ? (
              <div className="flex items-center">
                {/* Notification Dropdown */}
                {session.user?.role === 'jobseeker' && (
                  <div className="mr-4">
                    <NotificationDropdown />
                  </div>
                )}
                
                <div className="relative ml-3">
                  <div>
                    <button
                      onClick={toggleMenu}
                      className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d71921]"
                      id="user-menu"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-[#d71921] flex items-center justify-center text-white">
                        {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                      </div>
                      <span className="ml-2 text-gray-700">{session.user?.name || session.user?.email}</span>
                      <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                  
                  {isMenuOpen && (
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu"
                    >
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Your Profile
                      </Link>
                      {session.user?.role === 'jobseeker' && (
                        <Link
                          href="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Briefcase className="h-4 w-4 mr-2" />
                          My Applications
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          signOut({ callbackUrl: '/' });
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex md:space-x-4">
                <Link
                  href="/auth/signin"
                  className="text-gray-700 hover:text-[#d71921] px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-[#d71921] text-white hover:bg-[#b5141b] px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                >
                  Register
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="flex md:hidden ml-4">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#d71921] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#d71921]"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/jobs"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#d71921] hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Find Jobs
            </Link>
            {session?.user?.role === 'admin' && (
              <Link
                href="/admin/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#d71921] hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            {session?.user?.role === 'jobseeker' && (
              <Link
                href="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#d71921] hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Applications
              </Link>
            )}
            {!session && (
              <>
                <Link
                  href="/auth/signin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#d71921] hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-[#d71921] text-white hover:bg-[#b5141b]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
