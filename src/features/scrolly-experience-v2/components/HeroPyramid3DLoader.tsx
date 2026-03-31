'use client';

import { useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { PAGE_READY_EVENT } from '@/config/dom-contracts';

const HeroPyramid3D = dynamic(() => import('./HeroPyramid3D'), { ssr: false });

export default function HeroPyramid3DLoader({ className }: { className?: string }) {
  const [ready, setReady] = useState(false);
  const reducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  const handleReady = useCallback(() => {
    setReady(true);
    window.dispatchEvent(new Event(PAGE_READY_EVENT));
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
      <HeroPyramid3D className={className} onReady={handleReady} />
    </div>
  );
}
