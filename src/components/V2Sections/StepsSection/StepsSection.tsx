/**
 * StepsSection — Scroll-driven numbered steps.
 *
 * Activation strategy:
 *   - Scroll position of the section maps to active step index
 *   - Forward scroll: step 1 → 2 → 3 activate sequentially
 *   - Backward scroll: step 3 → 2 → 1 deactivate (reversible)
 *   - The full animation plays within the section's viewport transit
 *   - Click/tap overrides to jump to a specific step
 *   - Optional icon (V2Icon) and CTA per step
 *   - Responsive: 3-col grid → vertical stack on mobile
 *
 * Data-driven: receives all content via props from content.ts.
 */

'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import type { StepsSection as StepsSectionData } from '@/config/types';
import { ctaConfig } from '@/config/nav';
import V2Icon from '../V2Icon/V2Icon';
import './StepsSection.css';

interface Props {
  data: StepsSectionData;
}

/**
 * Maps scroll progress (0→1) to step index.
 * Distributes steps evenly across the progress range,
 * with some padding at start/end so no step activates at 0%.
 */
function progressToIndex(progress: number, count: number): number {
  // Start activating step 0 at 15%, finish at 85%
  const start = 0.15;
  const end = 0.85;
  const clamped = Math.max(0, Math.min(1, (progress - start) / (end - start)));
  // -1 means no step active yet
  if (clamped <= 0) return -1;
  return Math.min(count - 1, Math.floor(clamped * count));
}

export default function StepsSection({ data }: Props) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [userOverride, setUserOverride] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastProgressRef = useRef(-1);
  const overrideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Scroll-driven: map scroll position to active step */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Reduced motion: show everything immediately
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setActiveIndex(data.steps.length - 1);
      return;
    }

    const update = () => {
      if (userOverride) return;

      const rect = el.getBoundingClientRect();
      const vh = window.visualViewport?.height ?? window.innerHeight;

      // Progress: 0 = section top at viewport bottom, 1 = section bottom at viewport top
      const sectionH = rect.height;
      const traveled = vh - rect.top;
      const totalTravel = vh + sectionH;
      const raw = traveled / totalTravel;
      const progress = Math.max(0, Math.min(1, raw));

      // Quantize to avoid excessive state updates
      const quantized = Math.round(progress * 100) / 100;
      if (quantized === lastProgressRef.current) return;
      lastProgressRef.current = quantized;

      const idx = progressToIndex(progress, data.steps.length);
      setActiveIndex(idx);
    };

    const handleScroll = () => {
      if (!isVisibleRef.current) return;
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        update();
        rafRef.current = null;
      });
    };

    // IO gates the scroll listener
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) handleScroll();
      },
      { threshold: 0, rootMargin: '100px 0px' },
    );

    observer.observe(el);
    window.addEventListener('scroll', handleScroll, { passive: true });
    const vv = window.visualViewport;
    if (vv) vv.addEventListener('resize', handleScroll);

    // Initial calc
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (vv) vv.removeEventListener('resize', handleScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [data.steps.length, userOverride]);

  /** Click/tap override — temporarily pauses scroll-driven activation */
  const handleStepClick = useCallback((index: number) => {
    setUserOverride(true);
    setActiveIndex(index);

    // Clear previous timer
    if (overrideTimerRef.current) clearTimeout(overrideTimerRef.current);

    // Resume scroll-driven after 3s of no clicks
    overrideTimerRef.current = setTimeout(() => {
      setUserOverride(false);
    }, 3000);
  }, []);

  // Cleanup override timer
  useEffect(() => {
    return () => {
      if (overrideTimerRef.current) clearTimeout(overrideTimerRef.current);
    };
  }, []);

  const ctaHref = data.ctaHref ?? ctaConfig.href;

  return (
    <div className="v2-container v2-steps-root" ref={sectionRef}>
      {/* Header */}
      <div className="v2-steps-header">
        <div>
          <h2 className="v2-steps-header__heading px-layer--fg">{data.heading}</h2>
        </div>
        {data.subtext && (
          <p className="v2-steps-header__subtext">{data.subtext}</p>
        )}
      </div>

      {/* Steps grid */}
      <div className="v2-steps-grid" role="tablist" aria-label={data.heading}>
        {data.steps.map((step, i) => {
          const isActive = i <= activeIndex;
          const isCurrent = i === activeIndex;
          const barWidth = isActive ? 100 : 0;

          return (
            <div
              key={step.number}
              className={`v2-step${isActive ? ' v2-step--active' : ''}${isCurrent ? ' v2-step--current' : ''}`}
              data-step-index={i}
              onClick={() => handleStepClick(i)}
              role="tab"
              tabIndex={0}
              aria-selected={isCurrent}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleStepClick(i);
                }
              }}
            >
              {/* Mobile timeline dot */}
              <div className="v2-step__dot" aria-hidden="true" />

              {/* Icon + Number */}
              <div className="v2-step__header">
                {step.icon && (
                  <div className="v2-step__icon">
                    <V2Icon name={step.icon} size={18} />
                  </div>
                )}
                <span className="v2-step__number">{step.number}</span>
              </div>

              <h3 className="v2-step__title">{step.title}</h3>
              <p className="v2-step__text">{step.text}</p>
              {step.footnote && (
                <p className="v2-step__footnote">{step.footnote}</p>
              )}

              {/* Progress bar */}
              <div className="v2-step__bar" aria-hidden="true">
                <div
                  className="v2-step__bar-fill"
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              {/* Contextual CTA */}
              {isCurrent && step.ctaLabel && (
                <a
                  href={ctaHref}
                  className="v2-step__cta"
                  onClick={(e) => e.stopPropagation()}
                >
                  {step.ctaLabel}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
