/**
 * useScrollProgress — 3-Phase Scroll Progress Hook
 *
 * Tracks scroll through the mosaic trigger zone and returns TWO values:
 *   - mosaic: 0→1 (assembly animation)
 *   - exit:   0→1 (grid slides upward and out of viewport)
 *
 * The trigger zone is divided into 3 phases:
 *   1. Assembly (assemblyHeight):  mosaic goes 0→1
 *   2. Hold (holdHeight):          mosaic stays 1, exit stays 0
 *   3. Exit (exitHeight):          exit goes 0→1
 *
 * Uses rAF-throttled scroll listener for smooth 60fps updates.
 */

import { useState, useEffect, useCallback, type RefObject } from 'react';
import { clamp } from './easings';
import { mosaic as mosaicConfig } from '../config';

export interface ScrollProgress {
  mosaic: number; // 0→1: assembly animation
  exit: number;   // 0→1: grid exits upward
}

const INITIAL: ScrollProgress = { mosaic: 0, exit: 0 };

/**
 * Parse CSS height value to pixels.
 * Supports 'vh' units and 'px'.
 */
function cssHeightToPx(value: string): number {
  if (value.endsWith('vh')) {
    return (parseFloat(value) / 100) * window.innerHeight;
  }
  return parseFloat(value);
}

export default function useScrollProgress(
  triggerRef: RefObject<HTMLDivElement | null>,
): ScrollProgress {
  const [progress, setProgress] = useState<ScrollProgress>(INITIAL);

  const update = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Zone hasn't entered viewport yet
    if (rect.top >= viewportHeight) {
      setProgress((prev) =>
        prev.mosaic === 0 && prev.exit === 0 ? prev : INITIAL,
      );
      return;
    }

    // Zone has fully passed
    if (rect.bottom <= 0) {
      setProgress((prev) =>
        prev.mosaic === 1 && prev.exit === 1
          ? prev
          : { mosaic: 1, exit: 1 },
      );
      return;
    }

    // Total scroll distance through the zone
    const scrolledIn = viewportHeight - rect.top; // How far zone top has entered
    const totalHeight = rect.height;

    // Phase boundaries in pixels
    const assemblyPx = cssHeightToPx(mosaicConfig.assemblyHeight);
    const holdPx = cssHeightToPx(mosaicConfig.holdHeight);
    const exitPx = cssHeightToPx(mosaicConfig.exitHeight);

    // Clamp scroll position to total zone
    const s = clamp(scrolledIn, 0, totalHeight);

    // Phase 1: Assembly (0 → assemblyPx)
    const rawMosaic = s / assemblyPx;
    // Snap to boundaries when very close — prevents hover being blocked by
    // floating-point near-misses (e.g. 0.999 never reaching 1.0).
    const SNAP = 0.005;
    const mosaic = rawMosaic <= SNAP ? 0 : rawMosaic >= 1 - SNAP ? 1 : clamp(rawMosaic, 0, 1);

    // Phase 2: Hold (assemblyPx → assemblyPx + holdPx) — nothing changes
    // Phase 3: Exit (assemblyPx + holdPx → assemblyPx + holdPx + exitPx)
    const exitStart = assemblyPx + holdPx;
    const rawExit = (s - exitStart) / exitPx;
    const exit = rawExit <= SNAP ? 0 : rawExit >= 1 - SNAP ? 1 : clamp(rawExit, 0, 1);

    // Keep progress precise enough for smooth motion without spamming state updates.
    const STEP = 0.001;
    setProgress((prev) => {
      const mDelta = Math.abs(mosaic - prev.mosaic);
      const eDelta = Math.abs(exit - prev.exit);

      // Snap to boundary values
      const newM =
        mosaic <= 0 ? 0 : mosaic >= 1 ? 1 : mDelta >= STEP ? mosaic : prev.mosaic;
      const newE =
        exit <= 0 ? 0 : exit >= 1 ? 1 : eDelta >= STEP ? exit : prev.exit;

      if (newM === prev.mosaic && newE === prev.exit) return prev;
      return { mosaic: newM, exit: newE };
    });
  }, [triggerRef]);

  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        update();
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    rafId = requestAnimationFrame(() => {
      update();
      rafId = null;
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [update]);

  return progress;
}
