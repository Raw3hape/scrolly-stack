/**
 * useResponsiveZoom — Responsive Camera Zoom Hook
 *
 * Returns the correct zoom level based on viewport width, hero state,
 * and mosaic transition progress.
 *
 * During mosaic transition, interpolates between normal zoom and
 * mosaic-specific zoom levels (pullback → final).
 */

import { useState, useEffect, useCallback } from 'react';
import { animation, mosaic as mosaicConfig } from '../../../config';
import { isHeroStep } from '../../../utils/stepNavigation';
import { lerp, smoothProgress } from '../../../utils/easings';

export default function useResponsiveZoom(currentStep: number, mosaicProgress: number = 0): number {
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

  // Hero state zoom
  if (isHero) {
    return isMobile ? animation.zoom.heroMobile : animation.zoom.heroDesktop;
  }

  // Mosaic transition zoom: pullback during explode, then settle to final
  if (mosaicProgress > 0) {
    const transitionProgress = smoothProgress(
      mosaicProgress,
      mosaicConfig.motion.viewStart,
      mosaicConfig.motion.viewEnd,
    );

    if (transitionProgress <= 0) {
      return baseZoom;
    }

    const { pullbackZoom, finalZoom } = mosaicConfig.camera;
    // First half: pull back (zoom out)
    // Second half: zoom to final
    if (transitionProgress < 0.5) {
      // 0→0.5 maps to baseZoom→pullbackZoom
      const t = transitionProgress / 0.5;
      return lerp(baseZoom, pullbackZoom, t);
    } else {
      // 0.5→1.0 maps to pullbackZoom→finalZoom
      const t = (transitionProgress - 0.5) / 0.5;
      return lerp(pullbackZoom, finalZoom, t);
    }
  }

  return baseZoom;
}
