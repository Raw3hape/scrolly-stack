'use client';

/**
 * FpsCounter — Lightweight FPS Monitor
 *
 * Small unobtrusive counter in bottom-right corner.
 * Uses requestAnimationFrame for accurate measurement.
 * Only renders in client-side (no SSR).
 */

import { useEffect, useRef, useState } from 'react';
import './FpsCounter.css';

export default function FpsCounter() {
  const [fps, setFps] = useState(0);
  const framesRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    lastTimeRef.current = performance.now();

    const tick = () => {
      framesRef.current++;
      const now = performance.now();
      const delta = now - lastTimeRef.current;

      if (delta >= 1000) {
        setFps(Math.round((framesRef.current * 1000) / delta));
        framesRef.current = 0;
        lastTimeRef.current = now;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="fps-counter" aria-hidden="true">
      <span className="fps-counter__value">{fps}</span>
      <span className="fps-counter__label">FPS</span>
    </div>
  );
}
