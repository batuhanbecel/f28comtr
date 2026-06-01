import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/portfolio/:id',
        destination: '/:id',
        permanent: true,
      },
      {
        source: '/ai-based/work/:id',
        destination: '/ai-based',
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/admin/(.*)',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
    ];
  },
  outputFileTracingExcludes: {
    '*': ['./public/**/*'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85, 90],
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
