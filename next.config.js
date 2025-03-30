/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    appDir: true,
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
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
  },
  // Add output configuration for Vercel
  output: 'standalone',
  // Ensure trailing slashes are handled correctly
  trailingSlash: false
};

module.exports = nextConfig;
