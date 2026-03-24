/**
 * useCarousel — reusable hook for carousel/slider logic.
 *
 * Architecture:
 * - State: `activeIndex` (slide), `manualOverride` counter (triggers resume effect)
 * - Auto-play managed by a single useEffect that owns the interval lifecycle
 * - Manual nav bumps `manualOverride` which triggers pauseAndResume via useEffect
 * - No timer side-effects inside state updaters or callbacks
 * - Respects prefers-reduced-motion
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

/** Time (ms) to wait after manual interaction before resuming auto-play */
const RESUME_DELAY = 12_000;

interface UseCarouselOptions {
  /** Total number of slides */
  totalSlides: number;
  /** Auto-play interval in ms. 0 = disabled. Default 8000 */
  autoPlayInterval?: number;
}

interface UseCarouselReturn {
  activeIndex: number;
  isAutoPlaying: boolean;
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  progressKey: number;
}

export default function useCarousel({
  totalSlides,
  autoPlayInterval = 8000,
}: UseCarouselOptions): UseCarouselReturn {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  // Manual override counter — bumped on every user interaction.
  // The auto-play effect reacts to this to pause + schedule resume.
  const [manualOverride, setManualOverride] = useState(0);

  // Whether auto-play is paused by user interaction
  const [paused, setPaused] = useState(false);

  // Refs for latest values (avoids stale closures in setInterval)
  const totalSlidesRef = useRef(totalSlides);
  totalSlidesRef.current = totalSlides;

  // Reduced motion
  const prefersReducedMotion = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // ── Auto-play effect ──
  // Owns the interval. Restarts when paused state changes.
  useEffect(() => {
    if (
      autoPlayInterval <= 0 ||
      prefersReducedMotion.current ||
      paused
    ) {
      return;
    }

    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlidesRef.current);
      setProgressKey((k) => k + 1);
    }, autoPlayInterval);

    return () => clearInterval(id);
  }, [autoPlayInterval, paused]);

  // ── Resume effect ──
  // When manualOverride bumps, pause auto-play and schedule resume.
  // Skip the initial render (manualOverride === 0).
  useEffect(() => {
    if (manualOverride === 0) return;

    setPaused(true);

    if (autoPlayInterval <= 0 || prefersReducedMotion.current) return;

    const id = setTimeout(() => {
      setPaused(false);
    }, RESUME_DELAY);

    return () => clearTimeout(id);
  }, [manualOverride, autoPlayInterval]);

  // ── Navigation callbacks — pure state updates, no timer logic ──
  const goTo = useCallback((index: number) => {
    const total = totalSlidesRef.current;
    const clamped = ((index % total) + total) % total;
    setActiveIndex(clamped);
    setProgressKey((k) => k + 1);
    setManualOverride((c) => c + 1);
  }, []);

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalSlidesRef.current);
    setProgressKey((k) => k + 1);
    setManualOverride((c) => c + 1);
  }, []);

  const prev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalSlidesRef.current) % totalSlidesRef.current);
    setProgressKey((k) => k + 1);
    setManualOverride((c) => c + 1);
  }, []);

  const isAutoPlaying = !paused && autoPlayInterval > 0;

  return { activeIndex, isAutoPlaying, goTo, next, prev, progressKey };
}
