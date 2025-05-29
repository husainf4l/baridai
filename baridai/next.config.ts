import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Next.js does not support devServer directly, we need to use CLI args instead
  // Port is set via the "dev" script in package.json
  // Allow cross-origin requests for development environment
  // This is necessary for the Instagram OAuth callback to work properly
  allowedDevOrigins: ['https://baridai.com:3003', 'https://baridai.com', 'baridai.com', 'baridai.com/api', '*.baridai.com'],
};

export default nextConfig;
