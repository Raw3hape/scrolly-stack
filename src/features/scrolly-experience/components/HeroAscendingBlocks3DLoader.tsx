'use client';

import dynamic from 'next/dynamic';

const HeroAscendingBlocks3D = dynamic(
  () => import('./HeroAscendingBlocks3D'),
  { ssr: false },
);

export default function HeroAscendingBlocks3DLoader({ className }: { className?: string }) {
  return <HeroAscendingBlocks3D className={className} />;
}
