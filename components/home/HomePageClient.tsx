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

export default function HomePageClient() {
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
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            padding: '2rem' 
          }}>
            <div style={{ 
              display: 'inline-block', 
              width: '40px', 
              height: '40px', 
              border: '4px solid rgba(215, 25, 33, 0.3)', 
              borderRadius: '50%', 
              borderTopColor: '#d71921', 
              animation: 'spin 1s linear infinite' 
            }}></div>
            <style jsx>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : error ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem', 
            backgroundColor: 'white', 
            borderRadius: '0.5rem', 
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' 
          }}>
            <p style={{ color: '#ef4444' }}>{error}</p>
            <Link href="/jobs" style={{ 
              display: 'inline-block', 
              marginTop: '1rem', 
              color: '#d71921', 
              textDecoration: 'none', 
              fontWeight: '500' 
            }}>
              View All Jobs
            </Link>
          </div>
        ) : recentJobs.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem', 
            backgroundColor: 'white', 
            borderRadius: '0.5rem', 
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' 
          }}>
            <p>No job openings available at the moment.</p>
            <Link href="/jobs" style={{ 
              display: 'inline-block', 
              marginTop: '1rem', 
              color: '#d71921', 
              textDecoration: 'none', 
              fontWeight: '500' 
            }}>
              View All Jobs
            </Link>
          </div>
        ) : (
          <div>
            {recentJobs.map((job) => (
              <div 
                key={job._id} 
                style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '0.5rem', 
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
                  padding: '1.5rem', 
                  marginBottom: '1.5rem',
                  borderLeft: '4px solid #d71921'
                }}
              >
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  marginBottom: '0.5rem',
                  color: '#d71921'
                }}>
                  {job.title}
                </h3>
                <p style={{ 
                  fontSize: '1rem', 
                  color: '#4b5563', 
                  marginBottom: '0.5rem' 
                }}>
                  {job.companyName || job.company}
                </p>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.5rem', 
                  marginBottom: '1rem' 
                }}>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280', 
                    display: 'flex', 
                    alignItems: 'center' 
                  }}>
                    {job.location}
                  </span>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280', 
                    display: 'flex', 
                    alignItems: 'center' 
                  }}>
                    •
                  </span>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280', 
                    display: 'flex', 
                    alignItems: 'center' 
                  }}>
                    {job.jobType || job.type}
                  </span>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280', 
                    display: 'flex', 
                    alignItems: 'center' 
                  }}>
                    •
                  </span>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280', 
                    display: 'flex', 
                    alignItems: 'center' 
                  }}>
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#4b5563', 
                  marginBottom: '1.5rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {job.description}
                </p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end' 
                }}>
                  <Link 
                    href={`/jobs/${job._id}`}
                    style={{ 
                      backgroundColor: 'white', 
                      color: '#d71921', 
                      fontWeight: '600', 
                      padding: '0.5rem 1rem', 
                      borderRadius: '0.375rem', 
                      border: '1px solid #d71921', 
                      textDecoration: 'none',
                      display: 'inline-block'
                    }}
                  >
                    View Job
                  </Link>
                </div>
              </div>
            ))}
            <div style={{ 
              textAlign: 'center', 
              marginTop: '2rem' 
            }}>
              <Link 
                href="/jobs"
                style={{ 
                  backgroundColor: '#d71921', 
                  color: 'white', 
                  fontWeight: '600', 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '0.375rem', 
                  border: 'none', 
                  textDecoration: 'none',
                  display: 'inline-block'
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
                title: "Extensive Job Database", 
                icon: "🔍", 
                description: "Access thousands of job listings from top companies across various industries." 
              },
              { 
                title: "Easy Application Process", 
                icon: "📝", 
                description: "Apply to multiple jobs with just a few clicks using your saved profile information." 
              },
              { 
                title: "Career Resources", 
                icon: "📚", 
                description: "Get access to resume tips, interview guides, and career advice from industry experts." 
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
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{feature.icon}</div>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  marginBottom: '1rem',
                  color: '#d71921'
                }}>{feature.title}</h3>
                <p style={{ color: '#4b5563' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
