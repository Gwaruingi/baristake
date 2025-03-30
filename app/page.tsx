import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-reed-blue text-white">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Find Your Dream Job Today</h1>
            <p className="text-lg">Search through thousands of job listings to find your perfect match</p>
          </div>

          {/* Search Box */}
          <div className="bg-white rounded-md shadow p-6 max-w-4xl mx-auto">
            <form className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="keywords" className="block text-reed-text text-sm font-medium mb-2">
                  What
                </label>
                <input
                  type="text"
                  id="keywords"
                  placeholder="Job title, skills or keywords"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-reed-blue focus:border-reed-blue text-gray-900"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="location" className="block text-reed-text text-sm font-medium mb-2">
                  Where
                </label>
                <input
                  type="text"
                  id="location"
                  placeholder="City, region or country"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-reed-blue focus:border-reed-blue text-gray-900"
                />
              </div>
              <div className="md:self-end">
                <button
                  type="submit"
                  className="w-full md:w-auto bg-reed-blue hover:bg-reed-dark-blue text-white font-medium py-2 px-6 rounded transition duration-200 mt-6"
                >
                  Search Jobs
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Job Categories */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h2 className="text-2xl font-serif font-bold mb-8">Popular Job Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6">
          {[
            { name: "Technology", icon: "💻", count: 1240 },
            { name: "Healthcare", icon: "🏥", count: 850 },
            { name: "Finance", icon: "💰", count: 743 },
            { name: "Education", icon: "🎓", count: 632 },
            { name: "Marketing", icon: "📊", count: 521 },
            { name: "Hospitality", icon: "🏨", count: 438 },
          ].map((category, index) => (
            <Link
              href={`/jobs/category/${category.name.toLowerCase()}`}
              key={index}
              className="flex items-center gap-3 hover:text-reed-blue transition duration-200"
            >
              <span className="text-2xl">{category.icon}</span>
              <div>
                <h3 className="text-lg font-medium text-reed-blue">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.count} jobs available</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Jobs */}
      <div className="bg-reed-gray py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-serif font-bold mb-8">Featured Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Senior Software Engineer",
                company: "TechCorp",
                location: "Nairobi, Kenya",
                type: "Full-time",
                salary: "$80,000 - $120,000",
                posted: "2 days ago",
              },
              {
                title: "Marketing Manager",
                company: "Global Brands",
                location: "Remote",
                type: "Full-time",
                salary: "$65,000 - $85,000",
                posted: "1 week ago",
              },
              {
                title: "Financial Analyst",
                company: "Investment Partners",
                location: "Mombasa, Kenya",
                type: "Contract",
                salary: "$70,000 - $90,000",
                posted: "3 days ago",
              },
              {
                title: "HR Specialist",
                company: "Corporate Solutions",
                location: "Nairobi, Kenya",
                type: "Part-time",
                salary: "$45,000 - $60,000",
                posted: "5 days ago",
              },
            ].map((job, index) => (
              <div key={index} className="bg-white rounded p-5 border border-gray-200 hover:shadow-md transition duration-200">
                <h3 className="text-lg font-medium text-reed-blue mb-1">{job.title}</h3>
                <p className="text-gray-700 mb-2">{job.company}</p>
                <div className="flex flex-wrap gap-y-2 mb-3 text-sm text-gray-600">
                  <div className="w-full sm:w-1/2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {job.location}
                  </div>
                  <div className="w-full sm:w-1/2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {job.type}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-reed-blue font-medium">{job.salary}</span>
                  <span className="text-gray-500">{job.posted}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link 
                    href={`/jobs/${index}`} 
                    className="block w-full text-center bg-white hover:bg-reed-light-blue text-reed-blue font-medium py-2 px-4 rounded border border-reed-blue transition duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link 
              href="/jobs" 
              className="inline-block bg-reed-blue hover:bg-reed-dark-blue text-white font-medium py-2 px-6 rounded transition duration-200"
            >
              Browse All Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works - Simplified like reed.co.uk */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h2 className="text-2xl font-serif font-bold mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="bg-reed-light-blue w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-reed-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Search Jobs</h3>
            <p className="text-gray-600">Find the perfect job that matches your skills and experience.</p>
          </div>
          <div>
            <div className="bg-reed-light-blue w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-reed-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Apply Online</h3>
            <p className="text-gray-600">Submit your application with just a few clicks.</p>
          </div>
          <div>
            <div className="bg-reed-light-blue w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-reed-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Get Hired</h3>
            <p className="text-gray-600">Start your new career journey with your dream job.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
