/**
 * BackgroundEffects Component
 * 
 * Just the dot grid with parallax scrolling effect.
 * No gradient orbs - clean minimalist design.
 */

import { useEffect, useRef } from 'react';
import './BackgroundEffects.css';

export default function BackgroundEffects() {
  const gridRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (gridRef.current) {
        const scrollY = window.scrollY;
        // Subtle parallax: grid moves at 10% of scroll speed
        gridRef.current.style.transform = `translateY(${scrollY * 0.1}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-effects" aria-hidden="true">
      {/* Dot grid overlay with parallax */}
      <div ref={gridRef} className="bg-effects__grid" />
    </div>
  );
}
