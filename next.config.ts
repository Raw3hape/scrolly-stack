import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Turbopack is default in Next.js 16 for dev
  // No special config needed for R3F - handled by dynamic(ssr:false)
};

export default nextConfig;
