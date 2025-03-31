'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Application {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    companyName: string;
    location: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
  notificationRead: boolean;
  statusHistory?: Array<{
    status: string;
    date: string;
    notes?: string;
  }>;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  relatedId?: string;
  createdAt: string;
}

export default function Dashboard() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightedAppId = searchParams ? searchParams.get('application') : null;
  const statusFilter = searchParams ? searchParams.get('status') || 'all' : 'all';
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  
  // Fetch applications and notifications when component mounts
  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      fetchApplications();
      fetchNotifications();
    } else if (sessionStatus === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard');
    }
  }, [sessionStatus, router]);
  
  // Highlight application if ID is in URL
  useEffect(() => {
    if (highlightedAppId && applications.length > 0) {
      const app = applications.find(app => app._id === highlightedAppId);
      if (app) {
        setSelectedApplication(app);
        setIsHistoryModalOpen(true);
        
        // Mark application notification as read if it's not already
        if (!app.notificationRead) {
          markApplicationNotificationAsRead(app._id);
        }
      }
    }
  }, [highlightedAppId, applications]);
  
  // Fetch applications from API
  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/applications');
      
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      
      const data = await response.json();
      setApplications(data);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load your applications. Please try again later.');
      toast.error('Failed to load your applications');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications?limit=10');
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      const data = await response.json();
      setNotifications(data.notifications);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      // Don't show error toast for notifications to avoid multiple errors
    }
  };
  
  // Mark application notification as read
  const markApplicationNotificationAsRead = async (applicationId: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationRead: true }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app._id === applicationId ? { ...app, notificationRead: true } : app
        )
      );
    } catch (err) {
      console.error('Error marking application notification as read:', err);
    }
  };
  
  // Mark notification as read
  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: notificationId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
      toast.error('Failed to mark notification as read');
    }
  };
  
  // Open history modal for an application
  const openHistoryModal = (application: Application) => {
    setSelectedApplication(application);
    setIsHistoryModalOpen(true);
    
    // Mark application notification as read if it's not already
    if (!application.notificationRead) {
      markApplicationNotificationAsRead(application._id);
    }
    
    // Update URL with application ID without refreshing the page
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('application', application._id);
    window.history.pushState({}, '', newUrl.toString());
  };
  
  // Close history modal
  const closeHistoryModal = () => {
    setIsHistoryModalOpen(false);
    setSelectedApplication(null);
    
    // Remove application ID from URL without refreshing the page
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('application');
    window.history.pushState({}, '', newUrl.toString());
  };
  
  // Helper function for status colors
  function getStatusBgColor(status: string) {
    switch (status) {
      case 'pending':
        return '#fef9c3';
      case 'reviewed':
        return '#dbeafe';
      case 'shortlisted':
        return '#e0e7ff';
      case 'interview':
        return '#f3e8ff';
      case 'hired':
        return '#dcfce7';
      case 'rejected':
        return '#fee2e2';
      default:
        return '#f3f4f6';
    }
  }

  function getStatusTextColor(status: string) {
    switch (status) {
      case 'pending':
        return '#854d0e';
      case 'reviewed':
        return '#1e40af';
      case 'shortlisted':
        return '#3730a3';
      case 'interview':
        return '#6b21a8';
      case 'hired':
        return '#166534';
      case 'rejected':
        return '#b91c1c';
      default:
        return '#4b5563';
    }
  }

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

  const headingStyle = {
    fontSize: '1.5rem',
    fontWeight: '700' as const,
    marginBottom: '1.5rem',
    color: '#111827'
  };

  const subHeadingStyle = {
    fontSize: '1.25rem',
    fontWeight: '600' as const,
    marginBottom: '1rem',
    color: '#111827'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '0.25rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    marginBottom: '1.5rem'
  };

  const cardHeaderStyle = {
    padding: '1rem',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb'
  };

  const cardBodyStyle = {
    padding: '1rem'
  };

  const emptyStateStyle = {
    backgroundColor: 'white',
    borderRadius: '0.25rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    padding: '1.5rem',
    textAlign: 'center' as const,
    color: '#6b7280'
  };

  const filterContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
    marginBottom: '1rem'
  };

  const filterButtonStyle = {
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    borderRadius: '0.25rem',
    border: '1px solid #e5e7eb',
    backgroundColor: 'white',
    cursor: 'pointer'
  };

  const activeFilterButtonStyle = {
    ...filterButtonStyle,
    backgroundColor: '#d71921',
    color: 'white',
    borderColor: '#d71921'
  };

  const notificationItemStyle = {
    padding: '1rem',
    borderBottom: '1px solid #e5e7eb',
    transition: 'background-color 0.2s'
  };

  const unreadNotificationStyle = {
    ...notificationItemStyle,
    backgroundColor: '#f0f9ff',
    borderLeft: '4px solid #d71921'
  };

  const notificationTitleStyle = {
    fontSize: '0.875rem',
    fontWeight: '500' as const,
    marginBottom: '0.25rem',
    color: '#111827'
  };

  const notificationMessageStyle = {
    fontSize: '0.875rem',
    color: '#4b5563',
    marginBottom: '0.25rem'
  };

  const notificationDateStyle = {
    fontSize: '0.75rem',
    color: '#6b7280'
  };

  const applicationCardStyle = {
    backgroundColor: 'white',
    borderRadius: '0.25rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    marginBottom: '1rem',
    overflow: 'hidden',
    borderLeft: '4px solid #d71921'
  };

  const applicationHeaderStyle = {
    padding: '1rem',
    borderBottom: '1px solid #e5e7eb'
  };

  const applicationTitleStyle = {
    fontSize: '1rem',
    fontWeight: '600' as const,
    color: '#d71921',
    marginBottom: '0.25rem'
  };

  const applicationCompanyStyle = {
    fontSize: '0.875rem',
    color: '#4b5563',
    marginBottom: '0.5rem'
  };

  const applicationMetaStyle = {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
    marginBottom: '0.5rem'
  };

  const applicationMetaItemStyle = {
    fontSize: '0.75rem',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center'
  };

  const applicationStatusStyle = (status: string) => ({
    display: 'inline-block',
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500' as const,
    backgroundColor: getStatusBgColor(status),
    color: getStatusTextColor(status)
  });

  const buttonStyle = {
    backgroundColor: '#d71921',
    color: 'white',
    fontWeight: '500' as const,
    padding: '0.5rem 0.75rem',
    borderRadius: '0.25rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    textDecoration: 'none'
  };

  const secondaryButtonStyle = {
    backgroundColor: 'white',
    color: '#374151',
    fontWeight: '500' as const,
    padding: '0.5rem 0.75rem',
    borderRadius: '0.25rem',
    border: '1px solid #d1d5db',
    cursor: 'pointer',
    fontSize: '0.875rem',
    textDecoration: 'none'
  };

  const modalOverlayStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    borderRadius: '0.25rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto'
  };

  const modalHeaderStyle = {
    padding: '1rem',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const modalBodyStyle = {
    padding: '1rem'
  };

  const modalFooterStyle = {
    padding: '1rem',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem'
  };

  const timelineStyle = {
    position: 'relative' as const,
    marginLeft: '1rem',
    paddingLeft: '1.5rem',
    borderLeft: '2px solid #e5e7eb'
  };

  const timelineItemStyle = {
    position: 'relative' as const,
    paddingBottom: '1.5rem'
  };

  const timelineDotStyle = (status: string) => ({
    position: 'absolute' as const,
    left: '-1.625rem',
    top: 0,
    width: '1rem',
    height: '1rem',
    borderRadius: '50%',
    backgroundColor: getStatusBgColor(status),
    border: `2px solid ${getStatusTextColor(status)}`
  });

  const loadingSpinnerStyle = {
    width: '2.5rem',
    height: '2.5rem',
    border: '0.25rem solid #f3f3f3',
    borderTop: '0.25rem solid #d71921',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };
  
  // If session is loading, show loading state
  if (sessionStatus === 'loading') {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <h1 style={headingStyle}>My Applications</h1>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '200px'
          }}>
            <div style={loadingSpinnerStyle}></div>
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      </div>
    );
  }
  
  // If user is not authenticated, they will be redirected
  if (sessionStatus === 'unauthenticated') {
    return null;
  }
  
  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={headingStyle}>My Applications</h1>
        
        {/* Notifications Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={subHeadingStyle}>Recent Notifications</h2>
          {notifications.length === 0 ? (
            <div style={emptyStateStyle}>
              No notifications yet.
            </div>
          ) : (
            <div style={cardStyle}>
              {notifications.slice(0, 5).map((notification) => (
                <div 
                  key={notification._id} 
                  style={notification.read ? notificationItemStyle : unreadNotificationStyle}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start'
                  }}>
                    <div>
                      <h3 style={notificationTitleStyle}>{notification.title}</h3>
                      <p style={notificationMessageStyle}>{notification.message}</p>
                      <p style={notificationDateStyle}>
                        {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => markNotificationAsRead(notification._id)}
                        style={secondaryButtonStyle}
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Applications Section */}
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h2 style={subHeadingStyle}>My Job Applications</h2>
            <Link href="/jobs" style={buttonStyle}>
              Browse More Jobs
            </Link>
          </div>
          
          {/* Filters */}
          <div style={filterContainerStyle}>
            <button 
              onClick={() => {
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.set('status', 'all');
                window.history.pushState({}, '', newUrl.toString());
                router.push(`/dashboard?status=all`);
              }}
              style={statusFilter === 'all' ? activeFilterButtonStyle : filterButtonStyle}
            >
              All
            </button>
            <button 
              onClick={() => {
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.set('status', 'pending');
                window.history.pushState({}, '', newUrl.toString());
                router.push(`/dashboard?status=pending`);
              }}
              style={statusFilter === 'pending' ? activeFilterButtonStyle : filterButtonStyle}
            >
              Pending
            </button>
            <button 
              onClick={() => {
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.set('status', 'reviewed');
                window.history.pushState({}, '', newUrl.toString());
                router.push(`/dashboard?status=reviewed`);
              }}
              style={statusFilter === 'reviewed' ? activeFilterButtonStyle : filterButtonStyle}
            >
              Reviewed
            </button>
            <button 
              onClick={() => {
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.set('status', 'interview');
                window.history.pushState({}, '', newUrl.toString());
                router.push(`/dashboard?status=interview`);
              }}
              style={statusFilter === 'interview' ? activeFilterButtonStyle : filterButtonStyle}
            >
              Interview
            </button>
            <button 
              onClick={() => {
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.set('status', 'hired');
                window.history.pushState({}, '', newUrl.toString());
                router.push(`/dashboard?status=hired`);
              }}
              style={statusFilter === 'hired' ? activeFilterButtonStyle : filterButtonStyle}
            >
              Hired
            </button>
            <button 
              onClick={() => {
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.set('status', 'rejected');
                window.history.pushState({}, '', newUrl.toString());
                router.push(`/dashboard?status=rejected`);
              }}
              style={statusFilter === 'rejected' ? activeFilterButtonStyle : filterButtonStyle}
            >
              Rejected
            </button>
          </div>
          
          {/* Loading state */}
          {isLoading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              padding: '2rem'
            }}>
              <div style={loadingSpinnerStyle}></div>
              <style jsx>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : error ? (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fee2e2',
              color: '#b91c1c',
              padding: '1rem',
              borderRadius: '0.25rem',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          ) : applications.length === 0 ? (
            <div style={emptyStateStyle}>
              <p style={{ marginBottom: '1rem' }}>You haven't applied to any jobs yet.</p>
              <Link href="/jobs" style={buttonStyle}>
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div>
              {applications
                .filter(app => statusFilter === 'all' || app.status === statusFilter)
                .map(application => (
                  <div key={application._id} style={applicationCardStyle}>
                    <div style={applicationHeaderStyle}>
                      <h3 style={applicationTitleStyle}>{application.jobId.title}</h3>
                      <p style={applicationCompanyStyle}>{application.jobId.companyName}</p>
                      
                      <div style={applicationMetaStyle}>
                        <span style={applicationMetaItemStyle}>{application.jobId.location}</span>
                        <span style={applicationMetaItemStyle}>
                          Applied on {format(new Date(application.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginTop: '0.5rem'
                      }}>
                        <span style={applicationStatusStyle(application.status)}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                        
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => openHistoryModal(application)}
                            style={secondaryButtonStyle}
                          >
                            View History
                          </button>
                          <Link 
                            href={`/jobs/${application.jobId._id}`}
                            style={buttonStyle}
                          >
                            View Job
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Application History Modal */}
      {isHistoryModalOpen && selectedApplication && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={modalHeaderStyle}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: '#111827'
              }}>
                Application History
              </h3>
              <button 
                onClick={closeHistoryModal}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  color: '#6b7280'
                }}
              >
                &times;
              </button>
            </div>
            
            <div style={modalBodyStyle}>
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  color: '#d71921',
                  marginBottom: '0.25rem'
                }}>
                  {selectedApplication.jobId.title}
                </h4>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#4b5563',
                  marginBottom: '0.5rem'
                }}>
                  {selectedApplication.jobId.companyName} • {selectedApplication.jobId.location}
                </p>
                <p style={{ 
                  fontSize: '0.75rem', 
                  color: '#6b7280'
                }}>
                  Applied on {format(new Date(selectedApplication.createdAt), 'MMMM d, yyyy')}
                </p>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '600', 
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>
                  Current Status
                </h4>
                <span style={applicationStatusStyle(selectedApplication.status)}>
                  {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                </span>
              </div>
              
              {selectedApplication.statusHistory && selectedApplication.statusHistory.length > 0 && (
                <div>
                  <h4 style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    Status Timeline
                  </h4>
                  
                  <div style={timelineStyle}>
                    {selectedApplication.statusHistory.map((history, index) => (
                      <div key={index} style={timelineItemStyle}>
                        <div style={timelineDotStyle(history.status)}></div>
                        <div>
                          <p style={{ 
                            fontSize: '0.875rem', 
                            fontWeight: '500', 
                            color: '#111827',
                            marginBottom: '0.25rem'
                          }}>
                            {history.status.charAt(0).toUpperCase() + history.status.slice(1)}
                          </p>
                          <p style={{ 
                            fontSize: '0.75rem', 
                            color: '#6b7280',
                            marginBottom: '0.25rem'
                          }}>
                            {format(new Date(history.date), 'MMMM d, yyyy h:mm a')}
                          </p>
                          {history.notes && (
                            <p style={{ 
                              fontSize: '0.875rem', 
                              color: '#4b5563',
                              backgroundColor: '#f3f4f6',
                              padding: '0.5rem',
                              borderRadius: '0.25rem'
                            }}>
                              {history.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div style={modalFooterStyle}>
              <button 
                onClick={closeHistoryModal}
                style={secondaryButtonStyle}
              >
                Close
              </button>
              <Link 
                href={`/jobs/${selectedApplication.jobId._id}`}
                style={buttonStyle}
              >
                View Job Details
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
