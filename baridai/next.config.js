/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Allow cross-origin requests for development environment
  // This is necessary for the Instagram OAuth callback to work properly
  allowedDevOrigins: ['https://baridai.com:3003', 'https://baridai.com', 'baridai.com', '*.baridai.com'],
};

module.exports = nextConfig;
