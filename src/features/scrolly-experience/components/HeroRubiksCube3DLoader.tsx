'use client';

import dynamic from 'next/dynamic';

const HeroRubiksCube3D = dynamic(
  () => import('./HeroRubiksCube3D'),
  { ssr: false },
);

export default function HeroRubiksCube3DLoader({ className }: { className?: string }) {
  return <HeroRubiksCube3D className={className} />;
}
