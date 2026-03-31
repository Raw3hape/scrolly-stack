/**
 * useInView — lightweight IntersectionObserver hook for entrance animations.
 *
 * Usage:
 *   const ref = useInView<HTMLElement>();
 *   <section ref={ref} className="v2-reveal">...</section>
 *
 * Adds `data-visible="true"` when element enters viewport.
 * CSS handles the actual animation via `.v2-reveal[data-visible="true"]`.
 */

'use client';

import { useEffect, useRef } from 'react';

interface UseInViewOptions {
  /** IntersectionObserver threshold (0-1). Default: 0.15 */
  threshold?: number;
  /** Root margin. Default: '0px 0px -60px 0px' (trigger slightly before full visibility) */
  rootMargin?: string;
  /** If true, re-triggers animation when element leaves and re-enters. Default: false */
  repeat?: boolean;
}

export default function useInView<T extends HTMLElement>(options: UseInViewOptions = {}) {
  const { threshold = 0.15, rootMargin = '0px 0px -60px 0px', repeat = false } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute('data-visible', 'true');
          if (!repeat) observer.unobserve(el);
        } else if (repeat) {
          el.removeAttribute('data-visible');
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, repeat]);

  return ref;
}
