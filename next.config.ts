import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Turbopack is default in Next.js 16 for dev
  // No special config needed for R3F - handled by dynamic(ssr:false)

  // Disable the floating "N" dev indicator in bottom-left corner
  devIndicators: false,

  // Image optimization: serve AVIF/WebP at same visual quality
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Better tree-shaking for three.js (ESM source entry)
  turbopack: {
    resolveAlias: {
      'three': 'three/src/Three.js',
    },
  },

  // Redirect old /v2 URLs to root
  async redirects() {
    return [
      {
        source: '/v2',
        destination: '/',
        permanent: true,
      },
      {
        source: '/v2/about',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/v2/:path*',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
