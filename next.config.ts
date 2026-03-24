import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  async redirects() {
    return [
      {
        source: '/portfolio/:id',
        destination: '/:id',
        permanent: true,
      },
    ];
  },
  outputFileTracingExcludes: {
    '*': ['./public/**/*'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85, 90, 95],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '*.private.blob.vercel-storage.com',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    viewTransition: true,
    optimizePackageImports: ['next/image'],
    optimizeCss: true,
  },
};

export default nextConfig;
