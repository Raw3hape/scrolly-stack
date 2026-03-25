'use client';

import dynamic from 'next/dynamic';

const HeroPyramid3D = dynamic(
  () => import('./HeroPyramid3D'),
  { ssr: false },
);

export default function HeroPyramid3DLoader({ className }: { className?: string }) {
  return <HeroPyramid3D className={className} />;
}
