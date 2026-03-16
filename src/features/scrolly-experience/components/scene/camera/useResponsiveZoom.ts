/**
 * useResponsiveZoom — Responsive Camera Zoom Hook
 *
 * Returns the correct zoom level based on viewport width and hero state.
 * Listens to window resize with debounce from `config.animation.viewport`.
 *
 * Args:
 *   isHero — whether the camera is in hero (top-down) state
 *
 * Returns:
 *   zoom level (number) for the orthographic camera
 */

import { useState, useEffect, useCallback } from 'react';
import { animation } from '../../../config';
import { isHeroStep } from '../../../utils/stepNavigation';

export default function useResponsiveZoom(currentStep: number): number {
  const [baseZoom, setBaseZoom] = useState(() => {
    if (typeof window === 'undefined') return animation.zoom.desktop;
    return window.innerWidth < animation.zoom.mobileBreakpoint
      ? animation.zoom.mobile
      : animation.zoom.desktop;
  });

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    setBaseZoom(
      width < animation.zoom.mobileBreakpoint
        ? animation.zoom.mobile
        : animation.zoom.desktop
    );
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, animation.viewport.resizeDebounceMs);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [handleResize]);

  const isHero = isHeroStep(currentStep);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < animation.zoom.mobileBreakpoint;

  if (isHero) {
    return isMobile ? animation.zoom.heroMobile : animation.zoom.heroDesktop;
  }

  return baseZoom;
}
