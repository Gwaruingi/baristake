/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    appDir: true,
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Explicitly exclude the conflicting files
  excludeFiles: [
    'app/api/auth/[...nextauth]/route.ts',
    'app/page.tsx'
  ],
  // Configure rewrites to ensure auth routes use the Pages Router
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: '/api/auth/:path*',
      }
    ];
  }
};

module.exports = nextConfig;
