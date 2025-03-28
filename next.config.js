/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    appDir: true,
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Explicitly exclude the conflicting file
  excludeFiles: ['app/api/auth/[...nextauth]/route.ts']
};

module.exports = nextConfig;
