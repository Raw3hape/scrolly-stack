/**
 * TransitionLoader — Fullscreen loading overlay.
 *
 * Covers entire viewport (including Header/Footer) while
 * the 3D scene loads behind it. Fades out when `visible` turns false.
 *
 * ARCHITECTURE: Always renders to DOM (for CSS transition), but becomes
 * invisible + pointer-events:none when hidden. Unmounts via onTransitionEnd
 * after the fade-out completes.
 */

'use client';

import { useState, useCallback } from 'react';
import './TransitionLoader.css';

interface TransitionLoaderProps {
  /** When false, triggers the fade-out transition */
  visible: boolean;
}

export default function TransitionLoader({ visible }: TransitionLoaderProps) {
  const [mounted, setMounted] = useState(true);

  const handleTransitionEnd = useCallback(() => {
    if (!visible) {
      setMounted(false);
    }
  }, [visible]);

  if (!mounted) return null;

  return (
    <div
      className={`transition-loader ${visible ? '' : 'transition-loader--hidden'}`}
      onTransitionEnd={handleTransitionEnd}
      aria-hidden={!visible}
      aria-label="Loading experience"
    >
      <span className="transition-loader__brand">Foundation Projects</span>
      <div className="transition-loader__dots">
        <span className="transition-loader__dot" />
        <span className="transition-loader__dot" />
        <span className="transition-loader__dot" />
      </div>
    </div>
  );
}
