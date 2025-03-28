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
  },
  // Add webpack configuration to handle Node.js modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs', 'net', 'tls', 'dns' modules on the client side
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        perf_hooks: false,
      };
    }
    return config;
  }
};

module.exports = nextConfig;
