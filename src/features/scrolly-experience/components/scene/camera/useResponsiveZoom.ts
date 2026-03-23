/**
 * useResponsiveZoom — Responsive Camera Zoom Hook
 *
 * Returns the correct zoom level based on viewport width, hero state,
 * and mosaic transition progress.
 *
 * During mosaic transition, interpolates between normal zoom and
 * mosaic-specific zoom levels.
 *
 * maxIsoZoom: adaptive cap computed from stack height + viewport so the
 * isometric cube never clips behind the header. When undefined, baseZoom
 * is uncapped (fallback to config.animation.zoom.desktop).
 */

import { useState, useEffect, useCallback } from 'react';
import { animation, mosaic as defaultMosaic } from '../../../config';
import { isHeroStep } from '../../../utils/stepNavigation';
import { lerp, smoothProgress } from '../../../utils/easings';

export default function useResponsiveZoom(
  currentStep: number,
  mosaicProgress: number = 0,
  mosaicFinalZoom?: number,
  maxIsoZoom?: number,
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

  // Derive isMobile from debounced baseZoom to prevent flicker when
  // iOS Safari's URL bar toggles — avoids reading raw window.innerWidth
  // which can temporarily disagree with the debounced state.
  const isMobile = baseZoom === animation.zoom.mobile;

  const isHero = isHeroStep(currentStep);

  if (isHero) {
    return isMobile ? animation.zoom.heroMobile : animation.zoom.heroDesktop;
  }

  // Apply adaptive cap: on desktop, limit iso zoom so cube fits below header.
  // On mobile, maxIsoZoom is typically not provided (mobile zoom is already small).
  const cappedBaseZoom = maxIsoZoom != null
    ? Math.min(baseZoom, maxIsoZoom)
    : baseZoom;

  // Mosaic transition zoom: desktop lerps cappedBaseZoom → finalZoom.
  // On mobile, grid layout uses animation.zoom.mobile — camera stays at baseZoom.
  if (mosaicProgress > 0) {
    // On mobile, don't zoom in to finalZoom — grid is sized for mobile zoom
    if (isMobile) {
      return cappedBaseZoom;
    }

    const finalZoom = mosaicFinalZoom ?? defaultMosaic.camera.finalZoom;
    const transitionProgress = smoothProgress(
      mosaicProgress,
      defaultMosaic.motion.viewStart,
      defaultMosaic.motion.viewEnd,
    );

    if (transitionProgress <= 0) {
      return cappedBaseZoom;
    }

    return lerp(cappedBaseZoom, finalZoom, transitionProgress);
  }

  return cappedBaseZoom;
}

