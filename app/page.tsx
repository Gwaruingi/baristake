export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px', fontFamily: 'serif' }}>Find Your Dream Job Today</h1>
      <p style={{ marginBottom: '20px' }}>Search through thousands of job listings to find your perfect match</p>
      
      <div style={{ marginBottom: '30px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="keywords" style={{ display: 'block', marginBottom: '5px' }}>What</label>
          <input
            type="text"
            id="keywords"
            placeholder="Job title, skills or keywords"
            style={{ width: '300px', padding: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="location" style={{ display: 'block', marginBottom: '5px' }}>Where</label>
          <input
            type="text"
            id="location"
            placeholder="City, region or country"
            style={{ width: '300px', padding: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <button
          type="submit"
          style={{ padding: '5px 15px', backgroundColor: '#f0f0f0', border: '1px solid #ccc' }}
        >
          Search Jobs
        </button>
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', fontFamily: 'serif' }}>Popular Job Categories</h2>
      
      <div>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '24px', marginRight: '10px', display: 'inline-block', width: '30px' }}>💻</span>
          <div>
            <a href="/jobs/category/technology" style={{ color: 'blue', textDecoration: 'underline', fontWeight: 'bold', display: 'block' }}>Technology</a>
            <p style={{ margin: '0' }}>1240 jobs available</p>
          </div>
        </div>
        
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '24px', marginRight: '10px', display: 'inline-block', width: '30px' }}>🏥</span>
          <div>
            <a href="/jobs/category/healthcare" style={{ color: 'blue', textDecoration: 'underline', fontWeight: 'bold', display: 'block' }}>Healthcare</a>
            <p style={{ margin: '0' }}>850 jobs available</p>
          </div>
        </div>
        
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '24px', marginRight: '10px', display: 'inline-block', width: '30px' }}>💰</span>
          <div>
            <a href="/jobs/category/finance" style={{ color: 'blue', textDecoration: 'underline', fontWeight: 'bold', display: 'block' }}>Finance</a>
            <p style={{ margin: '0' }}>743 jobs available</p>
          </div>
        </div>
      </div>
    </div>
  );
}
