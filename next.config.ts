import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Turbopack is default in Next.js 16 for dev
  // No special config needed for R3F - handled by dynamic(ssr:false)

  // Disable the floating "N" dev indicator in bottom-left corner
  devIndicators: false,

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
