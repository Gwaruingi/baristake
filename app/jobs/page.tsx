'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

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

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState(searchParams?.get('search') || '');
  const [location, setLocation] = useState(searchParams?.get('location') || '');
  const [companyFilter, setCompanyFilter] = useState(searchParams?.get('company') || '');
  const [typeFilter, setTypeFilter] = useState(searchParams?.get('type') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams?.get('status') || 'active');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/jobs');
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        setJobs(data.jobs || []);
      } catch (err) {
        setError('Error loading jobs. Please try again later.');
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    return (
      (companyFilter === '' || job.company === companyFilter || job.companyName === companyFilter) &&
      (typeFilter === '' || job.type === typeFilter || job.jobType === typeFilter) &&
      (statusFilter === '' || job.status === statusFilter) &&
      (searchTerm === '' || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        job.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (location === '' || 
        job.location.toLowerCase().includes(location.toLowerCase()))
    );
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL with search parameters
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (location) params.set('location', location);
    if (companyFilter) params.set('company', companyFilter);
    if (typeFilter) params.set('type', typeFilter);
    if (statusFilter) params.set('status', statusFilter);
    
    router.push(`/jobs?${params.toString()}`);
  };

  // Get unique companies and job types for filters
  const companies = Array.from(new Set(jobs.map(job => job.company || job.companyName))).filter(Boolean);
  const jobTypes = Array.from(new Set(jobs.map(job => job.type || job.jobType))).filter(Boolean);

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

  const filtersContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    flexWrap: 'wrap' as const,
    gap: '0.5rem'
  };

  const filtersStyle = {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap' as const
  };

  const selectStyle = {
    padding: '0.5rem',
    borderRadius: '0.25rem',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
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

  const jobCountStyle = {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '1rem'
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
        {/* Filters */}
        <div style={filtersContainerStyle}>
          <div style={filtersStyle}>
            <div>
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                style={selectStyle}
              >
                <option value="">All Companies</option>
                {companies.map((company, index) => (
                  <option key={index} value={company as string}>
                    {company}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                style={selectStyle}
              >
                <option value="">All Types</option>
                {jobTypes.map((type, index) => (
                  <option key={index} value={type as string}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={selectStyle}
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Job count */}
        <div style={jobCountStyle}>
          {filteredJobs.length} jobs found
        </div>
        
        {/* Job listings */}
        {filteredJobs.length > 0 ? (
          <div>
            {filteredJobs.map((job) => (
              <div key={job._id} style={jobCardStyle}>
                <Link href={`/jobs/${job._id}`} style={{ textDecoration: 'none' }}>
                  <h2 style={jobTitleStyle}>{job.title}</h2>
                </Link>
                <p style={companyStyle}>{job.company || job.companyName}</p>
                
                <div style={jobMetaStyle}>
                  <span>{job.location}</span>
                  <span>{job.type || job.jobType}</span>
                  <span>{formatDate(job.createdAt)}</span>
                </div>
                
                <p style={jobDescriptionStyle}>{job.description}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={salaryStyle}>{formatSalary(job.salary)}</p>
                  
                  <Link href={`/jobs/${job._id}`} style={viewJobButtonStyle}>
                    View Job
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            backgroundColor: '#f3f4f6',
            padding: '2rem',
            borderRadius: '0.25rem',
            textAlign: 'center' as const
          }}>
            <p style={{ color: '#6b7280' }}>No jobs found matching your criteria. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
