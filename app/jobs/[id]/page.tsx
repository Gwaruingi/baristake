'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Briefcase, 
  MapPin, 
  Calendar,
  DollarSign,
  ArrowLeft,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';

interface Job {
  _id: string;
  title: string;
  companyId: string;
  companyName: string;
  jobType: string;
  location: string;
  salary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  applyMethod: {
    type: 'email' | 'link' | 'internal';
    email?: string;
    applyLink?: string;
  };
  applicationDeadline: string;
  status: 'active' | 'closed';
  createdAt: string;
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError('Error loading job details. Please try again later.');
        console.error('Error fetching job:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [params.id]);

  const isDeadlinePassed = () => {
    if (!job) return false;
    const deadline = new Date(job.applicationDeadline);
    const today = new Date();
    return deadline < today;
  };

  const handleApply = () => {
    if (!session) {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(`/jobs/${params.id}`)}`);
      return;
    }

    // Redirect to internal application form
    router.push(`/apply/${params.id}`);
  };

  // Styles
  const pageStyle = {
    backgroundColor: '#f9fafb',
    minHeight: 'calc(100vh - 60px)',
    paddingBottom: '2rem'
  };

  const containerStyle = {
    maxWidth: '1200px', 
    margin: '0 auto', 
    padding: '1.5rem 1rem'
  };

  const backLinkStyle = {
    color: '#d71921', 
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    width: 'fit-content',
    marginBottom: '1.5rem',
    fontSize: '0.875rem',
    fontWeight: '500' as const
  };

  const alertStyle = {
    padding: '1rem', 
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'flex-start',
    borderRadius: '0.25rem'
  };

  const errorAlertStyle = {
    ...alertStyle,
    backgroundColor: '#fef2f2', 
    borderLeft: '4px solid #f87171'
  };

  const warningAlertStyle = {
    ...alertStyle,
    backgroundColor: '#fffbeb', 
    borderLeft: '4px solid #fbbf24'
  };

  const jobCardStyle = {
    backgroundColor: 'white', 
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
    borderRadius: '0.25rem',
    overflow: 'hidden',
    borderLeft: '4px solid #d71921'
  };

  const jobHeaderStyle = {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    borderBottom: '1px solid #e5e7eb'
  };

  const jobTitleStyle = {
    fontSize: '1.5rem', 
    fontWeight: 'bold' as const, 
    color: '#d71921',
    marginBottom: '0.5rem'
  };

  const jobCompanyStyle = {
    fontSize: '1rem', 
    color: '#374151',
    marginBottom: '1rem',
    fontWeight: '500' as const
  };

  const jobMetaStyle = {
    display: 'flex', 
    gap: '1rem',
    flexWrap: 'wrap' as const,
    marginBottom: '1rem'
  };

  const jobMetaItemStyle = {
    display: 'inline-flex', 
    alignItems: 'center', 
    fontSize: '0.875rem', 
    color: '#6b7280'
  };

  const jobBodyStyle = {
    padding: '1.5rem'
  };

  const sectionStyle = {
    marginBottom: '1.5rem'
  };

  const sectionTitleStyle = {
    fontSize: '1.125rem',
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: '0.75rem'
  };

  const listStyle = {
    listStyleType: 'disc' as const,
    paddingLeft: '1.5rem',
    marginBottom: '1rem'
  };

  const listItemStyle = {
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    color: '#4b5563'
  };

  const paragraphStyle = {
    fontSize: '0.875rem',
    color: '#4b5563',
    lineHeight: '1.5',
    marginBottom: '1rem'
  };

  const buttonStyle = {
    backgroundColor: '#d71921',
    color: 'white',
    fontWeight: '600' as const,
    padding: '0.75rem 1.5rem',
    borderRadius: '0.25rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    display: 'inline-block',
    textDecoration: 'none',
    textAlign: 'center' as const
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed'
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: 'calc(100vh - 120px)' 
          }}>
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div style={errorAlertStyle}>
            <AlertCircle size={20} style={{ color: '#ef4444', marginRight: '0.75rem', flexShrink: 0 }} />
            <p style={{ fontSize: '0.875rem', color: '#b91c1c' }}>{error || 'Job not found'}</p>
          </div>
          <Link href="/jobs" style={backLinkStyle}>
            <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
            Back to all jobs
          </Link>
        </div>
      </div>
    );
  }

  const deadlinePassed = isDeadlinePassed();
  const isJobClosed = job.status === 'closed' || deadlinePassed;

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <Link href="/jobs" style={backLinkStyle}>
          <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
          Back to all jobs
        </Link>
        
        {isJobClosed && (
          <div style={warningAlertStyle}>
            <AlertTriangle size={20} style={{ color: '#f59e0b', marginRight: '0.75rem', flexShrink: 0 }} />
            <p style={{ fontSize: '0.875rem', color: '#92400e' }}>
              {job.status === 'closed' 
                ? 'This job posting has been closed by the employer.' 
                : 'The application deadline for this job has passed.'}
            </p>
          </div>
        )}
        
        <div style={jobCardStyle}>
          <div style={jobHeaderStyle}>
            <h1 style={jobTitleStyle}>{job.title}</h1>
            <p style={jobCompanyStyle}>{job.companyName}</p>
            
            <div style={jobMetaStyle}>
              <span style={jobMetaItemStyle}>
                <MapPin size={16} style={{ marginRight: '0.25rem' }} />
                {job.location}
              </span>
              <span style={jobMetaItemStyle}>
                <Briefcase size={16} style={{ marginRight: '0.25rem' }} />
                {job.jobType}
              </span>
              <span style={jobMetaItemStyle}>
                <DollarSign size={16} style={{ marginRight: '0.25rem' }} />
                {job.salary}
              </span>
              <span style={jobMetaItemStyle}>
                <Calendar size={16} style={{ marginRight: '0.25rem' }} />
                Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
              </span>
            </div>
            
            {!isJobClosed && (
              <button 
                onClick={handleApply} 
                style={buttonStyle}
              >
                Apply Now
              </button>
            )}
            
            {isJobClosed && (
              <button 
                disabled 
                style={disabledButtonStyle}
              >
                Applications Closed
              </button>
            )}
          </div>
          
          <div style={jobBodyStyle}>
            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Job Description</h2>
              <p style={paragraphStyle}>{job.description}</p>
            </div>
            
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>Responsibilities</h2>
                <ul style={listStyle}>
                  {job.responsibilities.map((item, index) => (
                    <li key={index} style={listItemStyle}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {job.requirements && job.requirements.length > 0 && (
              <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>Requirements</h2>
                <ul style={listStyle}>
                  {job.requirements.map((item, index) => (
                    <li key={index} style={listItemStyle}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>How to Apply</h2>
              {job.applyMethod.type === 'internal' ? (
                <p style={paragraphStyle}>
                  Click the "Apply Now" button above to submit your application through our portal.
                </p>
              ) : job.applyMethod.type === 'email' ? (
                <p style={paragraphStyle}>
                  Please send your resume and cover letter to{' '}
                  <a href={`mailto:${job.applyMethod.email}`} style={{ color: '#d71921' }}>
                    {job.applyMethod.email}
                  </a>
                </p>
              ) : (
                <p style={paragraphStyle}>
                  Please apply through the employer's website:{' '}
                  <a href={job.applyMethod.applyLink} target="_blank" rel="noopener noreferrer" style={{ color: '#d71921' }}>
                    Apply Here
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
