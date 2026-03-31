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
  exit: number; // 0→1: grid exits upward
}

const INITIAL: ScrollProgress = { mosaic: 0, exit: 0 };

export default function useScrollProgress(
  triggerRef: RefObject<HTMLDivElement | null>,
): ScrollProgress {
  const [progress, setProgress] = useState<ScrollProgress>(INITIAL);

  const update = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    // Use window.innerHeight for entry/exit detection only.
    // Phase boundaries are derived from DOM element height (below),
    // NOT from viewport height — eliminates CSS↔JS mismatch on iOS
    // where visualViewport.height changes when address bar hides.
    const viewportHeight = window.innerHeight;

    // Zone hasn't entered viewport yet
    if (rect.top >= viewportHeight) {
      setProgress((prev) => (prev.mosaic === 0 && prev.exit === 0 ? prev : INITIAL));
      return;
    }

    // Zone has fully passed
    if (rect.bottom <= 0) {
      setProgress((prev) => (prev.mosaic === 1 && prev.exit === 1 ? prev : { mosaic: 1, exit: 1 }));
      return;
    }

    // Total scroll distance through the zone
    const scrolledIn = viewportHeight - rect.top; // How far zone top has entered
    const totalHeight = rect.height;

    // Phase boundaries as proportions of the actual DOM height.
    // Config values like '80vh' are treated as ratios (80:20:50).
    // This guarantees phases always match the CSS-defined scroll distance,
    // regardless of which vh unit CSS uses or what visualViewport reports.
    const aVal = parseFloat(mosaicConfig.assemblyHeight);
    const hVal = parseFloat(mosaicConfig.holdHeight);
    const eVal = parseFloat(mosaicConfig.exitHeight);
    const totalVal = aVal + hVal + eVal;
    const assemblyPx = totalHeight * (aVal / totalVal);
    const holdPx = totalHeight * (hVal / totalVal);
    const exitPx = totalHeight * (eVal / totalVal);

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
      const newM = mosaic <= 0 ? 0 : mosaic >= 1 ? 1 : mDelta >= STEP ? mosaic : prev.mosaic;
      const newE = exit <= 0 ? 0 : exit >= 1 ? 1 : eDelta >= STEP ? exit : prev.exit;

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

    // visualViewport.resize listener removed — phase boundaries are now
    // derived from DOM element height, not viewport height. Address bar
    // show/hide no longer affects phase calculation.

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
