'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import "./styles/custom.css";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <div className="reed-container py-20 text-center">
        <h2 className="reed-section-title text-red-600">Error Loading Content</h2>
        <p className="mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="reed-button"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="reed-container py-20 text-center">
        <h2 className="reed-section-title">Loading...</h2>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="reed-header">
        <div className="reed-container">
          <h1 className="reed-title">Find Your Dream Job Today</h1>
          <p className="reed-subtitle">Search through thousands of job listings to find your perfect match</p>

          {/* Search Box */}
          <div className="reed-search-box">
            <form className="reed-search-form">
              <div className="reed-form-group">
                <label htmlFor="keywords" className="reed-label">What</label>
                <input
                  type="text"
                  id="keywords"
                  placeholder="Job title, skills or keywords"
                  className="reed-input"
                />
              </div>
              <div className="reed-form-group">
                <label htmlFor="location" className="reed-label">Where</label>
                <input
                  type="text"
                  id="location"
                  placeholder="City, region or country"
                  className="reed-input"
                />
              </div>
              <button type="submit" className="reed-button">Search Jobs</button>
            </form>
          </div>
        </div>
      </div>

      {/* Job Categories */}
      <div className="reed-container">
        <h2 className="reed-section-title">Popular Job Categories</h2>
        <div className="reed-categories">
          {[
            { name: "Technology", icon: "💻", count: 1240 },
            { name: "Healthcare", icon: "🏥", count: 850 },
            { name: "Finance", icon: "💰", count: 743 },
            { name: "Education", icon: "🎓", count: 632 },
            { name: "Marketing", icon: "📊", count: 521 },
            { name: "Hospitality", icon: "🏨", count: 438 },
            { name: "Engineering", icon: "🔧", count: 395 },
          ].map((category, index) => (
            <div key={index} className="reed-category-card">
              <div className="reed-category-icon">{category.icon}</div>
              <h3 className="reed-category-name">{category.name}</h3>
              <p className="reed-category-count">{category.count} jobs</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Jobs Section */}
      <div className="reed-container">
        <h2 className="reed-section-title">Featured Jobs</h2>
        <div className="reed-jobs-grid">
          {[
            {
              title: "Senior Software Engineer",
              company: "TechCorp",
              location: "San Francisco, CA",
              salary: "$120,000 - $150,000",
              type: "Full-time"
            },
            {
              title: "Marketing Manager",
              company: "Brand Solutions",
              location: "New York, NY",
              salary: "$80,000 - $95,000",
              type: "Full-time"
            },
            {
              title: "Data Analyst",
              company: "Analytics Inc",
              location: "Chicago, IL",
              salary: "$70,000 - $85,000",
              type: "Full-time"
            },
            {
              title: "UX/UI Designer",
              company: "Creative Studio",
              location: "Remote",
              salary: "$90,000 - $110,000",
              type: "Contract"
            },
          ].map((job, index) => (
            <div key={index} className="reed-job-card">
              <h3 className="reed-job-title">{job.title}</h3>
              <p className="reed-job-company">{job.company}</p>
              <p className="reed-job-location">{job.location}</p>
              <p className="reed-job-salary">{job.salary}</p>
              <div className="reed-job-footer">
                <span className="reed-job-type">{job.type}</span>
                <Link href="/jobs/1" className="reed-job-link">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="reed-container">
        <h2 className="reed-section-title">Why Choose Our Job Portal</h2>
        <div className="reed-features">
          {[
            {
              title: "Thousands of Jobs",
              description: "Access thousands of job listings from top companies around the world."
            },
            {
              title: "Verified Employers",
              description: "All employers on our platform are verified to ensure legitimate job opportunities."
            },
            {
              title: "Easy Application",
              description: "Apply to multiple jobs with just a few clicks using your saved profile."
            },
            {
              title: "Career Resources",
              description: "Access resume tips, interview guides, and career advice from industry experts."
            }
          ].map((feature, index) => (
            <div key={index} className="reed-feature-card">
              <h3 className="reed-feature-title">{feature.title}</h3>
              <p className="reed-feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
