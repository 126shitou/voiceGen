/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  async rewrites() {
    return [
      {
        source: '/api/replicate/:path*',
        destination: 'https://api.replicate.com/:path*'
      }
    ];
  }
};

module.exports = nextConfig;
