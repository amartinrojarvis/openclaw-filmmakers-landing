import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['100.109.96.73', 'localhost'],
  
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Reduce bundle size
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ml9srjqqzazi.i.optimole.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tufotoyvideopromocional.es',
        pathname: '/**',
      },
    ],
    unoptimized: true,
    formats: ['image/webp'],
  },
  
  // Headers for performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
