'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle, 
  AlertTriangle, 
  Upload, 
  FileText 
} from 'lucide-react';

interface Salary {
  min: number;
  max: number;
  currency: string;
}

interface Job {
  _id: string;
  title: string;
  companyName: string;
  location: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary: string;
  jobType: string;
  status: 'active' | 'closed';
  applicationDeadline: string;
  createdAt: string;
}

interface Profile {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  resume?: string;
  skills: string[];
  education: any[];
  experience: any[];
}

export default function JobApplicationPage({ params }: { params: { jobId: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [cvRequired, setCvRequired] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(`/apply/${params.jobId}`)}`);
      return;
    }

    // Only fetch data if authenticated
    if (status === 'authenticated') {
      const fetchData = async () => {
        try {
          setLoading(true);
          
          // Fetch job details
          const jobResponse = await fetch(`/api/jobs/${params.jobId}`);
          if (!jobResponse.ok) {
            throw new Error('Failed to fetch job details');
          }
          const jobData = await jobResponse.json();
          
          // Check if job is active
          if (jobData.status !== 'active') {
            router.push(`/jobs/${params.jobId}?error=closed`);
            return;
          }
          
          // Check if application deadline has passed
          const deadline = new Date(jobData.applicationDeadline);
          const today = new Date();
          if (deadline < today) {
            router.push(`/jobs/${params.jobId}?error=deadline`);
            return;
          }
          
          setJob(jobData);
          
          // Fetch user profile
          const profileResponse = await fetch('/api/profile');
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            if (profileData.exists) {
              setProfile(profileData.profile);
              // Set CV as required if profile doesn't have a resume
              setCvRequired(!profileData.profile.resume);
            } else {
              // No profile found - redirect to profile page
              router.push(`/profile?redirect=${encodeURIComponent(`/apply/${params.jobId}`)}`);
              return;
            }
          } else {
            // Error fetching profile - redirect to profile page
            router.push(`/profile?redirect=${encodeURIComponent(`/apply/${params.jobId}`)}`);
            return;
          }
        } catch (err) {
          console.error('Error fetching data:', err);
          setError('Failed to load application data. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [status, params.jobId, router]);

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Check file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a PDF, DOC, or DOCX file');
        return;
      }
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit');
        return;
      }
      setCvFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session || !job) {
      return;
    }
    
    // Validate CV upload if required
    if (cvRequired && !cvFile) {
      setError('Please upload a CV to apply for this job since you don\'t have a resume in your profile.');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // Upload CV if provided
      let cvUrl = null;
      if (cvFile) {
        const formData = new FormData();
        formData.append('file', cvFile);
        formData.append('type', 'cv');
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload CV');
        }
        
        const uploadData = await uploadResponse.json();
        cvUrl = uploadData.filePath;
      }
      
      // Submit application
      const applicationData: any = {
        jobId: job._id,
      };
      
      if (cvUrl) {
        applicationData.cv = cvUrl;
      }
      
      if (coverLetter.trim()) {
        applicationData.coverLetter = coverLetter.trim();
      }
      
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit application');
      }
      
      setSuccess('Application submitted successfully!');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard?status=success');
      }, 2000);
    } catch (err: any) {
      console.error('Error submitting application:', err);
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 'calc(100vh - 60px)' 
      }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!job) {
    return (
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '24px 16px' 
      }}>
        <div style={{ 
          backgroundColor: '#FEF2F2', 
          borderLeft: '4px solid #F87171', 
          padding: '16px', 
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'flex-start'
        }}>
          <AlertCircle size={20} style={{ color: '#F87171', marginRight: '12px', flexShrink: 0 }} />
          <p style={{ fontSize: '14px', color: '#B91C1C' }}>Job not found or no longer available.</p>
        </div>
        <Link href="/jobs" style={{ 
          color: '#DC2626', 
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          width: 'fit-content'
        }}>
          <ArrowLeft size={16} style={{ marginRight: '8px' }} />
          Back to all jobs
        </Link>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '24px 16px' 
    }}>
      <Link href={`/jobs/${job._id}`} style={{ 
        color: '#DC2626', 
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        width: 'fit-content',
        marginBottom: '24px'
      }}>
        <ArrowLeft size={16} style={{ marginRight: '8px' }} />
        Back to job details
      </Link>
      
      <div style={{ 
        backgroundColor: 'white', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '20px 24px',
          borderBottom: '1px solid #E5E7EB'
        }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#111827',
            marginBottom: '8px'
          }}>Apply for {job.title}</h1>
          <p style={{ 
            fontSize: '14px', 
            color: '#6B7280'
          }}>{job.companyName} • {job.location}</p>
        </div>
        
        {error && (
          <div style={{ 
            backgroundColor: '#FEF2F2', 
            borderLeft: '4px solid #F87171', 
            padding: '16px', 
            margin: '0 24px 16px',
            display: 'flex',
            alignItems: 'flex-start'
          }}>
            <AlertCircle size={20} style={{ color: '#F87171', marginRight: '12px', flexShrink: 0 }} />
            <p style={{ fontSize: '14px', color: '#B91C1C' }}>{error}</p>
          </div>
        )}
        
        {success && (
          <div style={{ 
            backgroundColor: '#F0FDF4', 
            borderLeft: '4px solid #34D399', 
            padding: '16px', 
            margin: '0 24px 16px',
            display: 'flex',
            alignItems: 'flex-start'
          }}>
            <CheckCircle size={20} style={{ color: '#34D399', marginRight: '12px', flexShrink: 0 }} />
            <p style={{ fontSize: '14px', color: '#047857' }}>{success}</p>
          </div>
        )}
        
        <div style={{ padding: '24px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ 
                fontSize: '18px', 
                fontWeight: '500', 
                color: '#111827', 
                marginBottom: '8px' 
              }}>Your Information</h2>
              <p style={{ 
                fontSize: '14px', 
                color: '#6B7280',
                marginBottom: '16px'
              }}>
                This information will be used from your profile.
              </p>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '16px',
                marginBottom: '16px'
              }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#374151',
                    marginBottom: '4px'
                  }}>Name</label>
                  <div style={{ 
                    padding: '8px 12px', 
                    border: '1px solid #D1D5DB', 
                    borderRadius: '4px', 
                    backgroundColor: '#F9FAFB',
                    fontSize: '14px'
                  }}>
                    {profile?.name || session?.user?.name || 'Not available'}
                  </div>
                </div>
                
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#374151',
                    marginBottom: '4px'
                  }}>Email</label>
                  <div style={{ 
                    padding: '8px 12px', 
                    border: '1px solid #D1D5DB', 
                    borderRadius: '4px', 
                    backgroundColor: '#F9FAFB',
                    fontSize: '14px'
                  }}>
                    {profile?.email || session?.user?.email || 'Not available'}
                  </div>
                </div>
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151',
                  marginBottom: '4px'
                }}>Resume from Profile</label>
                <div style={{ marginTop: '4px' }}>
                  {profile?.resume ? (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center'
                    }}>
                      <CheckCircle size={16} style={{ color: '#10B981', marginRight: '8px' }} />
                      <span style={{ 
                        fontSize: '14px', 
                        color: '#374151'
                      }}>Resume available from your profile</span>
                    </div>
                  ) : (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center'
                    }}>
                      <AlertTriangle size={16} style={{ color: '#FBBF24', marginRight: '8px' }} />
                      <span style={{ 
                        fontSize: '14px', 
                        color: '#374151'
                      }}>
                        No resume in your profile. <strong>You must upload a CV below to apply.</strong>
                      </span>
                      <Link href="/profile" style={{ 
                        marginLeft: '8px', 
                        fontSize: '12px', 
                        color: '#DC2626',
                        textDecoration: 'none'
                      }}>
                        Update Profile
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ 
                fontSize: '18px', 
                fontWeight: '500', 
                color: '#111827', 
                marginBottom: '8px' 
              }}>Additional Information</h2>
              
              <div style={{ marginBottom: '16px' }}>
                <label htmlFor="cv" style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151',
                  marginBottom: '4px'
                }}>
                  Upload CV {cvRequired ? '(Required)' : '(Optional)'}
                </label>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '24px',
                  border: '2px dashed #D1D5DB',
                  borderRadius: '4px',
                  marginTop: '4px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <Upload size={40} style={{ 
                      color: '#9CA3AF', 
                      margin: '0 auto 12px' 
                    }} />
                    <div style={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}>
                      <label htmlFor="cv-upload" style={{ 
                        color: '#DC2626',
                        fontWeight: '500',
                        cursor: 'pointer',
                        marginBottom: '8px'
                      }}>
                        Upload a file
                      </label>
                      <input
                        id="cv-upload"
                        name="cv"
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleCvChange}
                        style={{ 
                          width: '0.1px',
                          height: '0.1px',
                          opacity: 0,
                          overflow: 'hidden',
                          position: 'absolute',
                          zIndex: -1
                        }}
                      />
                      <p style={{ 
                        fontSize: '12px', 
                        color: '#6B7280'
                      }}>
                        PDF, DOC, or DOCX up to 5MB
                      </p>
                    </div>
                    {cvFile && (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '16px',
                        padding: '8px 12px',
                        backgroundColor: '#F3F4F6',
                        borderRadius: '4px'
                      }}>
                        <FileText size={16} style={{ color: '#4B5563', marginRight: '8px' }} />
                        <span style={{ 
                          fontSize: '14px', 
                          color: '#4B5563'
                        }}>{cvFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="coverLetter" style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151',
                  marginBottom: '4px'
                }}>
                  Cover Letter (Optional)
                </label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  rows={6}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Write a brief cover letter explaining why you're a good fit for this position..."
                  style={{ 
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '4px',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              marginTop: '32px'
            }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  backgroundColor: submitting ? '#F3F4F6' : '#DC2626',
                  color: submitting ? '#9CA3AF' : 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                  width: '100%',
                  maxWidth: '300px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
