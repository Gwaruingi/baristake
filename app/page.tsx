import Link from "next/link";
import "./styles/custom.css";

export default function Home() {
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
            { name: "Creative Arts", icon: "🎨", count: 287 },
          ].map((category, index) => (
            <Link
              href={`/jobs/category/${category.name.toLowerCase()}`}
              key={index}
              className="reed-category"
            >
              <div className="reed-category-icon">{category.icon}</div>
              <h3 className="reed-category-title">{category.name}</h3>
              <p className="reed-category-count">{category.count} jobs available</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Jobs */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Senior Software Engineer",
                company: "TechCorp",
                location: "Nairobi, Kenya",
                type: "Full-time",
                salary: "$80,000 - $120,000",
                posted: "2 days ago",
                logo: "/placeholder-logo.png",
              },
              {
                title: "Marketing Manager",
                company: "Global Brands",
                location: "Remote",
                type: "Full-time",
                salary: "$65,000 - $85,000",
                posted: "1 week ago",
                logo: "/placeholder-logo.png",
              },
              {
                title: "Financial Analyst",
                company: "Investment Partners",
                location: "Mombasa, Kenya",
                type: "Contract",
                salary: "$70,000 - $90,000",
                posted: "3 days ago",
                logo: "/placeholder-logo.png",
              },
            ].map((job, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                    {/* Placeholder for company logo */}
                    <span className="text-lg font-bold text-gray-500">{job.company.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{job.title}</h3>
                    <p className="text-gray-700 mb-2">{job.company}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-sm text-gray-500 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        {job.location}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {job.type}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-600 font-medium">{job.salary}</span>
                      <span className="text-xs text-gray-500">{job.posted}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link 
                    href={`/jobs/${index}`} 
                    className="block w-full text-center bg-white hover:bg-gray-50 text-blue-600 font-medium py-2 px-4 rounded-md border border-blue-600 transition duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link 
              href="/jobs" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition duration-200"
            >
              Browse All Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Search Jobs</h3>
            <p className="text-gray-600">Find the perfect job that matches your skills and experience.</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Apply Online</h3>
            <p className="text-gray-600">Submit your application with just a few clicks.</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Hired</h3>
            <p className="text-gray-600">Start your new career journey with your dream job.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
