'use client';

import dynamic from 'next/dynamic';

const HeroExplodedGrid3D = dynamic(
  () => import('./HeroExplodedGrid3D'),
  { ssr: false },
);

export default function HeroExplodedGrid3DLoader({ className }: { className?: string }) {
  return <HeroExplodedGrid3D className={className} />;
}
