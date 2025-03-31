/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Configure rewrites to ensure auth routes use the Pages Router
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: '/api/auth/:path*',
      }
    ];
  },
};

module.exports = nextConfig;
