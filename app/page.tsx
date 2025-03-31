'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Job {
  _id: string;
  title: string;
  company: string;
  companyName?: string;
  location: string;
  description: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  type: string;
  jobType?: string;
  status: string;
  createdAt: string;
}

export default function HomePage() {
  const router = useRouter();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Use absolute URL for API calls to ensure it works in all environments
        const baseUrl = window.location.origin;
        const response = await fetch(`${baseUrl}/api/jobs?status=active&limit=5`, {
          // Add cache control to prevent stale data
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        setJobs(data.jobs || []);
      } catch (err) {
        setError('Error loading jobs. Please try again later.');
        console.error('Error fetching jobs:', err);
        // Set empty array to ensure UI renders even if API fails
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Get only active jobs and limit to 5 recent ones
  const recentJobs = jobs
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL with search parameters
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (location) params.set('location', location);
    
    router.push(`/jobs?${params.toString()}`);
  };

  const formatSalary = (salary: any) => {
    if (!salary || (!salary.min && !salary.max)) return 'Competitive';
    
    const currency = salary.currency || '£';
    if (salary.min && salary.max) {
      return `${currency}${salary.min.toLocaleString()} - ${currency}${salary.max.toLocaleString()}`;
    } else if (salary.min) {
      return `${currency}${salary.min.toLocaleString()}+`;
    } else if (salary.max) {
      return `Up to ${currency}${salary.max.toLocaleString()}`;
    }
    
    return 'Competitive';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Styles
  const pageStyle = {
    minHeight: '100vh',
    backgroundColor: '#f9fafb'
  };

  const heroStyle = {
    backgroundColor: '#d71921',
    padding: '1.5rem 0'
  };

  const containerStyle = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1rem'
  };

  const headingStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold' as const,
    color: 'white',
    marginBottom: '1rem'
  };

  const formStyle = {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '0.25rem'
  };

  const formGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '0.5rem'
  };

  const inputContainerStyle = {
    position: 'relative' as const
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '0.25rem',
    border: '1px solid #d1d5db',
    fontSize: '0.875rem'
  };

  const buttonStyle = {
    backgroundColor: '#d71921',
    color: 'white',
    fontWeight: '600' as const,
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem'
  };

  const jobCardStyle = {
    backgroundColor: 'white',
    borderRadius: '0.25rem',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    marginBottom: '1rem',
    borderLeft: '4px solid #d71921',
    padding: '1rem'
  };

  const jobTitleStyle = {
    fontSize: '1.125rem',
    fontWeight: '600' as const,
    color: '#d71921',
    marginBottom: '0.25rem',
    textDecoration: 'none'
  };

  const companyStyle = {
    color: '#374151',
    fontWeight: '500' as const,
    marginBottom: '0.5rem',
    fontSize: '0.875rem'
  };

  const jobMetaStyle = {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '1rem',
    fontSize: '0.75rem',
    color: '#6b7280',
    marginBottom: '0.75rem'
  };

  const jobDescriptionStyle = {
    color: '#4b5563',
    marginBottom: '1rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
    fontSize: '0.875rem'
  };

  const salaryStyle = {
    fontSize: '1rem',
    fontWeight: '600' as const,
    color: '#d71921',
    marginBottom: '0.5rem'
  };

  const viewJobButtonStyle = {
    display: 'inline-block',
    backgroundColor: '#d71921',
    color: 'white',
    fontWeight: '500' as const,
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    textDecoration: 'none',
    fontSize: '0.875rem'
  };

  const sectionTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: '1rem',
    marginTop: '2rem'
  };

  const featuresContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem',
    marginBottom: '2rem'
  };

  const featureCardStyle = {
    backgroundColor: 'white',
    borderRadius: '0.25rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const
  };

  const featureTitleStyle = {
    fontSize: '1.125rem',
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: '0.5rem',
    marginTop: '1rem'
  };

  const featureDescriptionStyle = {
    color: '#6b7280',
    fontSize: '0.875rem',
    lineHeight: '1.5'
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={heroStyle}>
          <div style={containerStyle}>
            <h1 style={headingStyle}>Find your perfect job</h1>
            <div style={{...formStyle, height: '4rem'}}></div>
          </div>
        </div>
        <div style={{...containerStyle, paddingTop: '1rem'}}>
          <div style={{display: 'flex', flexDirection: 'column' as const, gap: '1rem'}}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{...jobCardStyle, height: '8rem'}}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={pageStyle}>
        <div style={heroStyle}>
          <div style={containerStyle}>
            <h1 style={headingStyle}>Find your perfect job</h1>
          </div>
        </div>
        <div style={{...containerStyle, paddingTop: '1rem'}}>
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fee2e2',
            color: '#b91c1c',
            padding: '0.75rem 1rem',
            borderRadius: '0.25rem'
          }}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      {/* Hero search section */}
      <div style={heroStyle}>
        <div style={containerStyle}>
          <h1 style={headingStyle}>Find your perfect job</h1>
          
          <form onSubmit={handleSearch} style={formStyle}>
            <div style={formGridStyle}>
              <div style={inputContainerStyle}>
                <input
                  type="text"
                  placeholder="Job title, skills or keywords"
                  style={inputStyle}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div style={inputContainerStyle}>
                <input
                  type="text"
                  placeholder="Location"
                  style={inputStyle}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              <button type="submit" style={buttonStyle}>
                Search Jobs
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div style={{...containerStyle, paddingTop: '1rem'}}>
        {/* Recent Jobs Section */}
        <h2 style={sectionTitleStyle}>Recent Job Openings</h2>
        
        {recentJobs.length > 0 ? (
          <div>
            {recentJobs.map((job) => (
              <div key={job._id} style={jobCardStyle}>
                <Link href={`/jobs/${job._id}`} style={jobTitleStyle}>
                  {job.title}
                </Link>
                
                <div style={companyStyle}>
                  {job.companyName || job.company}
                </div>
                
                <div style={jobMetaStyle}>
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.type || job.jobType}</span>
                  <span>•</span>
                  <span>Posted {formatDate(job.createdAt)}</span>
                </div>
                
                <div style={jobDescriptionStyle}>
                  {job.description}
                </div>
                
                <div style={salaryStyle}>
                  {formatSalary(job.salary)}
                </div>
                
                <Link href={`/jobs/${job._id}`} style={viewJobButtonStyle}>
                  View Job
                </Link>
              </div>
            ))}
            
            <div style={{ textAlign: 'center', marginTop: '1.5rem', marginBottom: '2rem' }}>
              <Link href="/jobs" style={{
                ...buttonStyle,
                textDecoration: 'none',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem'
              }}>
                View All Jobs
              </Link>
            </div>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '0.25rem',
            padding: '2rem',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <p style={{ marginBottom: '1rem' }}>No job listings available at the moment.</p>
            <Link href="/jobs" style={{
              ...buttonStyle,
              textDecoration: 'none',
              display: 'inline-block'
            }}>
              Check All Jobs
            </Link>
          </div>
        )}
        
        {/* Features Section */}
        <h2 style={sectionTitleStyle}>Why Choose Our Job Portal</h2>
        
        <div style={featuresContainerStyle}>
          <div style={featureCardStyle}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d71921" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
              <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
              <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            <h3 style={featureTitleStyle}>Diverse Job Listings</h3>
            <p style={featureDescriptionStyle}>
              Browse through thousands of job opportunities across various industries and locations.
            </p>
          </div>
          
          <div style={featureCardStyle}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d71921" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <polyline points="17 11 19 13 23 9"></polyline>
            </svg>
            <h3 style={featureTitleStyle}>Easy Application</h3>
            <p style={featureDescriptionStyle}>
              Apply to jobs with just a few clicks and track your applications in one place.
            </p>
          </div>
          
          <div style={featureCardStyle}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d71921" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            <h3 style={featureTitleStyle}>Company Profiles</h3>
            <p style={featureDescriptionStyle}>
              Research potential employers with detailed company information and reviews.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
