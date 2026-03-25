'use client';

import { useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';

const HeroRubiksCube3D = dynamic(
  () => import('./HeroRubiksCube3D'),
  { ssr: false },
);

export default function HeroRubiksCube3DLoader({ className }: { className?: string }) {
  const [ready, setReady] = useState(false);
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const handleReady = useCallback(() => {
    setReady(true);
    window.dispatchEvent(new Event('page:ready'));
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        opacity: ready ? 1 : 0,
        transition: reducedMotion.current ? 'none' : 'opacity 0.6s ease-out',
      }}
    >
      <HeroRubiksCube3D className={className} onReady={handleReady} />
    </div>
  );
}
