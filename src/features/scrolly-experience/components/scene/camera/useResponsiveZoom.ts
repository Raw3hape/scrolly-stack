/**
 * useResponsiveZoom — Responsive Camera Zoom Hook
 *
 * Returns the correct zoom level based on viewport width, hero state,
 * and mosaic transition progress.
 *
 * During mosaic transition, interpolates between normal zoom and
 * mosaic-specific zoom levels.
 *
 * BUG FIX: `mosaicFinalZoom` is now a parameter (from VariantContext),
 * not imported from config.ts — ensures variant overrides actually apply.
 */

import { useState, useEffect, useCallback } from 'react';
import { animation, mosaic as defaultMosaic } from '../../../config';
import { isHeroStep } from '../../../utils/stepNavigation';
import { lerp, smoothProgress } from '../../../utils/easings';

export default function useResponsiveZoom(
  currentStep: number,
  mosaicProgress: number = 0,
  mosaicFinalZoom?: number,
): number {
  const [baseZoom, setBaseZoom] = useState(() => {
    if (typeof window === 'undefined') return animation.zoom.desktop;
    return window.innerWidth <= animation.zoom.mobileBreakpoint
      ? animation.zoom.mobile
      : animation.zoom.desktop;
  });

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    setBaseZoom(
      width <= animation.zoom.mobileBreakpoint
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
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= animation.zoom.mobileBreakpoint;

  // Hero state zoom
  if (isHero) {
    return isMobile ? animation.zoom.heroMobile : animation.zoom.heroDesktop;
  }

  // Mosaic transition zoom: desktop lerps baseZoom → finalZoom.
  // On mobile, grid layout uses animation.zoom.mobile — camera stays at baseZoom.
  if (mosaicProgress > 0) {
    // On mobile, don't zoom in to finalZoom — grid is sized for mobile zoom
    if (isMobile) {
      return baseZoom;
    }

    const finalZoom = mosaicFinalZoom ?? defaultMosaic.camera.finalZoom;
    const transitionProgress = smoothProgress(
      mosaicProgress,
      defaultMosaic.motion.viewStart,
      defaultMosaic.motion.viewEnd,
    );

    if (transitionProgress <= 0) {
      return baseZoom;
    }

    return lerp(baseZoom, finalZoom, transitionProgress);
  }

  return baseZoom;
}

