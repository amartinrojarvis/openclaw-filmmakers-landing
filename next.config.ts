import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['100.109.96.73', 'localhost'],
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
  },
};

export default nextConfig;
