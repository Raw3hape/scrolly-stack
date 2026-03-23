/**
 * useParallax — Scroll-driven parallax progress hook.
 *
 * Tracks how far a section has scrolled through the viewport and writes
 * the progress (0→1) as a CSS custom property `--px-progress` on the element.
 *
 * Inner elements use `.px-layer--bg / --fg / --accent` CSS classes that read
 * `--px-progress` via `calc()` to derive their own transform/opacity.
 *
 * Performance:
 *   - IntersectionObserver gates the scroll listener (zero cost when offscreen)
 *   - rAF-throttled scroll handler (max 1 recalc per frame)
 *   - Only writes `style.setProperty` when value actually changes
 *   - Uses `will-change: transform, opacity` on layer elements (CSS side)
 *
 * Accessibility:
 *   - Respects `prefers-reduced-motion: reduce` → sets progress=1 immediately
 *   - Also sets `data-visible="true"` for legacy selectors / fallback
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseParallaxOptions {
  /** IO threshold to consider "entered". Default: 0 (any pixel visible). */
  threshold?: number;
  /** IO root margin. Default: '100px 0px' (pre-activate 100px before enter). */
  rootMargin?: string;
}

/**
 * Quantize to 3 decimal places to avoid excessive style writes.
 * 0.001 precision is visually indistinguishable but prevents
 * setting the same property 60× per second.
 */
function quantize(v: number): number {
  return Math.round(v * 1000) / 1000;
}

export default function useParallax<T extends HTMLElement>(
  options: UseParallaxOptions = {},
) {
  const { threshold = 0, rootMargin = '100px 0px' } = options;
  const ref = useRef<T>(null);

  // Mutable flag — avoids re-renders for visibility tracking
  const isVisibleRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const lastValueRef = useRef<number>(-1);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const vh = window.visualViewport?.height ?? window.innerHeight;

    // progress:
    //   0 = element's top edge arrives at the bottom of the viewport
    //   1 = element's top edge reaches ~55% from the top
    //
    // "completionTarget" controls how early elements finish animating.
    // 0.45*vh means full opacity is reached when the top of the section
    // has crossed 45% of the viewport — well before the section center.
    // This prevents the "semi-transparent in the middle" problem.
    const completionTarget = vh * 0.45;
    const scrolled = vh - rect.top;          // how far the top edge has entered
    const raw = scrolled / completionTarget;
    const progress = quantize(Math.max(0, Math.min(1, raw)));

    if (progress !== lastValueRef.current) {
      lastValueRef.current = progress;
      el.style.setProperty('--px-progress', String(progress));

      // Set data-visible for legacy CSS selectors / IO fallback
      if (progress > 0.05) {
        if (!el.hasAttribute('data-visible')) {
          el.setAttribute('data-visible', 'true');
        }
      }
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // --- Reduced motion: show everything immediately ---
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      el.style.setProperty('--px-progress', '1');
      el.setAttribute('data-visible', 'true');
      return;
    }

    // --- Scroll handler (rAF-throttled) ---
    const handleScroll = () => {
      if (!isVisibleRef.current) return;
      if (rafIdRef.current !== null) return;
      rafIdRef.current = requestAnimationFrame(() => {
        update();
        rafIdRef.current = null;
      });
    };

    // --- IntersectionObserver gates the scroll listener ---
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          // Initial calc on enter
          handleScroll();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);

    window.addEventListener('scroll', handleScroll, { passive: true });
    // iOS Safari: address bar show/hide
    const vv = window.visualViewport;
    if (vv) vv.addEventListener('resize', handleScroll);

    // Initial calculation
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (vv) vv.removeEventListener('resize', handleScroll);
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [threshold, rootMargin, update]);

  return ref;
}
