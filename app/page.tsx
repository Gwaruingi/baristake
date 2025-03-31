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

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb' 
    }}>
      {/* Hero Section */}
      <div style={{ 
        backgroundColor: '#d71921', 
        color: 'white' 
      }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: '4rem 1rem', 
        }}>
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '2rem' 
          }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem' 
            }}>Find Your Dream Job Today</h1>
            <p style={{ 
              fontSize: '1.25rem' 
            }}>Search through thousands of job listings to find your perfect match</p>
          </div>

          {/* Search Box */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '0.5rem', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
            padding: '1.5rem', 
            maxWidth: '900px', 
            margin: '0 auto' 
          }}>
            <form 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '1rem' 
              }}
              onSubmit={handleSearch}
            >
              <div>
                <label htmlFor="keywords" style={{ 
                  display: 'block', 
                  color: '#374151', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  marginBottom: '0.5rem' 
                }}>
                  What
                </label>
                <input
                  type="text"
                  id="keywords"
                  placeholder="Job title, skills or keywords"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.375rem', 
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' 
                  }}
                />
              </div>
              <div>
                <label htmlFor="location" style={{ 
                  display: 'block', 
                  color: '#374151', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  marginBottom: '0.5rem' 
                }}>
                  Where
                </label>
                <input
                  type="text"
                  id="location"
                  placeholder="City, region or country"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.375rem', 
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' 
                  }}
                />
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-end' 
              }}>
                <button
                  type="submit"
                  style={{ 
                    width: '100%', 
                    backgroundColor: '#d71921', 
                    color: 'white', 
                    fontWeight: '600', 
                    padding: '0.75rem 1rem', 
                    borderRadius: '0.375rem', 
                    border: 'none', 
                    cursor: 'pointer',
                    marginTop: '1.5rem'
                  }}
                >
                  Search Jobs
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Recent Job Openings */}
      <div style={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: '4rem 1rem' 
      }}>
        <h2 style={{ 
          fontSize: '1.875rem', 
          fontWeight: 'bold', 
          marginBottom: '2rem', 
          textAlign: 'center',
          color: '#1f2937'
        }}>Recent Job Openings</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading jobs...</p>
          </div>
        ) : error ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem', 
            color: '#ef4444',
            backgroundColor: '#fee2e2',
            borderRadius: '0.5rem'
          }}>
            <p>{error}</p>
          </div>
        ) : recentJobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No jobs found. Check back soon for new opportunities!</p>
          </div>
        ) : (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem' 
          }}>
            {recentJobs.map((job) => (
              <div 
                key={job._id} 
                style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '0.5rem', 
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
                  padding: '1.5rem', 
                  borderLeft: '4px solid #d71921' 
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '0.5rem'
                }}>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '600', 
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    {job.title}
                  </h3>
                  <span style={{ 
                    backgroundColor: '#f3f4f6', 
                    color: '#4b5563', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '9999px', 
                    fontSize: '0.75rem', 
                    fontWeight: '500' 
                  }}>
                    {job.type || job.jobType || 'Full-time'}
                  </span>
                </div>
                <p style={{ 
                  color: '#4b5563', 
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem'
                }}>
                  {job.companyName || job.company} • {job.location}
                </p>
                <p style={{ 
                  color: '#6b7280', 
                  marginBottom: '1rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {job.description.length > 150 
                    ? `${job.description.substring(0, 150)}...` 
                    : job.description}
                </p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}>
                  <p style={{ 
                    color: '#6b7280', 
                    fontSize: '0.875rem' 
                  }}>
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                  <Link 
                    href={`/jobs/${job._id}`}
                    style={{ 
                      backgroundColor: '#d71921', 
                      color: 'white', 
                      fontWeight: '500', 
                      padding: '0.5rem 1rem', 
                      borderRadius: '0.375rem', 
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                      display: 'inline-block'
                    }}
                  >
                    View Job
                  </Link>
                </div>
              </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link 
                href="/jobs"
                style={{ 
                  display: 'inline-block',
                  backgroundColor: 'white', 
                  color: '#d71921', 
                  border: '1px solid #d71921',
                  fontWeight: '500', 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '0.375rem', 
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                View All Jobs
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Why Choose Us */}
      <div style={{ backgroundColor: '#f3f4f6', padding: '4rem 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <h2 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 'bold', 
            marginBottom: '2rem', 
            textAlign: 'center',
            color: '#1f2937'
          }}>Why Choose Our Job Portal</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            {[
              { 
                title: "Verified Employers", 
                icon: "🔍", 
                description: "All employers on our platform are verified to ensure you're applying to legitimate opportunities." 
              },
              { 
                title: "Personalized Job Alerts", 
                icon: "🔔", 
                description: "Get notified about new job postings that match your skills and preferences." 
              },
              { 
                title: "Application Tracking", 
                icon: "📊", 
                description: "Easily track all your job applications in one place and never miss an opportunity." 
              },
            ].map((feature, index) => (
              <div 
                key={index}
                style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '0.5rem', 
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
                  padding: '2rem', 
                  textAlign: 'center',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{feature.icon}</div>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  marginBottom: '0.75rem',
                  color: '#d71921'
                }}>{feature.title}</h3>
                <p style={{ color: '#6b7280' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}