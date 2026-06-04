import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/ai-based',
        destination: '/ai-powered',
        permanent: true,
      },
      {
        source: '/ai-based/:path*',
        destination: '/ai-powered/:path*',
        permanent: true,
      },
      {
        source: '/generative-workflow',
        destination: '/ai-powered',
        permanent: true,
      },
      {
        source: '/generative-workflow/:path*',
        destination: '/ai-powered/:path*',
        permanent: true,
      },
      {
        source: '/admin/ai-based',
        destination: '/admin/ai-powered',
        permanent: true,
      },
      {
        source: '/admin/ai-based/:path*',
        destination: '/admin/ai-powered/:path*',
        permanent: true,
      },
      {
        source: '/admin/generative-workflow',
        destination: '/admin/ai-powered',
        permanent: true,
      },
      {
        source: '/admin/generative-workflow/:path*',
        destination: '/admin/ai-powered/:path*',
        permanent: true,
      },
      {
        source: '/ai-powered/work/:id',
        destination: '/ai-powered',
        permanent: false,
      },
      {
        source: '/portfolio/:id',
        destination: '/:id',
        permanent: true,
      },
      {
        source: '/admin',
        destination: '/studio',
        permanent: false,
      },
      {
        source: '/admin/:path*',
        destination: '/studio',
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
          // Sanity Studio (same-origin under /studio) needs to embed the
          // site in its Presentation Tool iframe — SAMEORIGIN allows that.
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/studio/:path*',
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
        hostname: 'cdn.sanity.io',
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
