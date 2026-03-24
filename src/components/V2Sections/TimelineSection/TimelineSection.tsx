/**
 * TimelineSection — Interactive scroll-driven vertical timeline.
 *
 * Architecture:
 *   - Per-step IntersectionObserver tracks which steps are in viewport
 *   - Scroll progress drives the center-line height via CSS custom prop
 *   - Sequential staggered reveal: number → title → text → KPI card
 *   - Step numbers run a brief counter animation (00 → target)
 *
 * All timing/spacing values come from design tokens (effects.css, motion.css).
 * Gracefully degrades: `prefers-reduced-motion` skips all animations.
 *
 * Data-driven: receives content via props from content.ts.
 */

'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import type { TimelineSection as TimelineSectionData } from '@/config/types';
import V2Icon from '../V2Icon/V2Icon';
import './TimelineSection.css';

// ─── Configurable thresholds ──────────────────────────────────
/** Viewport fraction from bottom where a step activates (0.35 = 35% from bottom) */
const ACTIVATION_THRESHOLD = 0.35;
/** Counter animation frame count */
const COUNTER_FRAMES = 24;
/** Counter animation total duration in ms */
const COUNTER_DURATION_MS = 900;

interface Props {
  data: TimelineSectionData;
}

// ─── useCounterAnimation ──────────────────────────────────────
/** Animates a number element from 0 → target using rAF. */
function useCounterAnimation(
  elementRef: React.RefObject<HTMLSpanElement | null>,
  target: number,
  isActive: boolean,
  hasAnimated: React.MutableRefObject<Set<number>>,
  stepIndex: number,
) {
  useEffect(() => {
    const el = elementRef.current;
    if (!el || !isActive || hasAnimated.current.has(stepIndex)) return;

    // Check reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hasAnimated.current.add(stepIndex);
      return;
    }

    hasAnimated.current.add(stepIndex);

    const frameDuration = COUNTER_DURATION_MS / COUNTER_FRAMES;
    let frame = 0;

    const suffix = el.textContent?.replace(/\d+/, '') ?? '.';

    const tick = () => {
      frame++;
      const progress = frame / COUNTER_FRAMES;
      // Ease-out cubic for natural deceleration feel
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = `${String(current).padStart(2, '0')}${suffix}`;

      if (frame < COUNTER_FRAMES) {
        setTimeout(tick, frameDuration);
      }
    };

    // Start from 00
    el.textContent = `00${suffix}`;
    setTimeout(tick, frameDuration);
  }, [elementRef, target, isActive, hasAnimated, stepIndex]);
}

// ─── CounterNumber (sub-component) ────────────────────────────
function CounterNumber({
  number,
  isActive,
  hasAnimated,
  stepIndex,
}: {
  number: string;
  isActive: boolean;
  hasAnimated: React.MutableRefObject<Set<number>>;
  stepIndex: number;
}) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const numericValue = parseInt(number, 10);

  useCounterAnimation(spanRef, numericValue, isActive, hasAnimated, stepIndex);

  return (
    <span ref={spanRef} className="v2-timeline__number">
      {number}
    </span>
  );
}

// ─── Main component ──────────────────────────────────────────
export default function TimelineSection({ data }: Props) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeSteps, setActiveSteps] = useState<Set<number>>(new Set());
  const [lineProgress, setLineProgress] = useState(0);
  const counterAnimated = useRef<Set<number>>(new Set());

  // ─── Assign step ref ─────────────────────────────────────
  const setStepRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      stepRefs.current[index] = el;
    },
    [],
  );

  // ─── IntersectionObserver for step activation ─────────────
  useEffect(() => {
    // Reduced motion: show everything immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActiveSteps(new Set(data.steps.map((_, i) => i)));
      setLineProgress(1);
      return;
    }

    const observers: IntersectionObserver[] = [];

    stepRefs.current.forEach((el, index) => {
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSteps((prev) => {
              if (prev.has(index)) return prev;
              const next = new Set(prev);
              next.add(index);
              return next;
            });
          }
        },
        {
          rootMargin: `0px 0px -${ACTIVATION_THRESHOLD * 100}% 0px`,
          threshold: 0,
        },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((o) => o.disconnect());
    };
  }, [data.steps]);

  // ─── Scroll-driven line progress ─────────────────────────
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rafId: number | null = null;

    const updateLineProgress = () => {
      const timelineEl = timelineRef.current;
      if (!timelineEl) return;

      const steps = stepRefs.current.filter(Boolean) as HTMLDivElement[];
      if (steps.length === 0) return;

      const firstStep = steps[0];
      const lastStep = steps[steps.length - 1];

      const firstRect = firstStep.getBoundingClientRect();
      const lastRect = lastStep.getBoundingClientRect();
      const vh = window.visualViewport?.height ?? window.innerHeight;

      const triggerLine = vh * (1 - ACTIVATION_THRESHOLD);
      const timelineTop = firstRect.top + firstRect.height / 2;
      const timelineBottom = lastRect.top + lastRect.height / 2;
      const totalDistance = timelineBottom - timelineTop;

      if (totalDistance <= 0) {
        setLineProgress(1);
        return;
      }

      const scrolled = triggerLine - timelineTop;
      const progress = Math.max(0, Math.min(1, scrolled / totalDistance));
      setLineProgress(progress);
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        updateLineProgress();
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="v2-container v2-timeline__container">
      {/* Header */}
      <div className="v2-timeline__header">
        <h2 className="v2-timeline__heading px-layer--fg">{data.heading}</h2>
        <div className="v2-timeline__divider px-layer--bg" aria-hidden="true" />
      </div>

      {/* Timeline body */}
      <div ref={timelineRef} className="v2-timeline">
        {/* Center line — background track */}
        <div className="v2-timeline__line" aria-hidden="true" />

        {/* Center line — active progress */}
        <div
          className="v2-timeline__line-active"
          aria-hidden="true"
          style={{
            '--tl-line-progress': lineProgress,
          } as React.CSSProperties}
        />

        {data.steps.map((step, i) => {
          const isEven = i % 2 === 0;
          const isActive = activeSteps.has(i);

          return (
            <div
              key={step.number}
              ref={setStepRef(i)}
              className={[
                'v2-timeline__step',
                !isEven && 'v2-timeline__step--reverse',
                isActive && 'v2-timeline__step--active',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {/* Content side — sequential stagger: number → title → text */}
              <div
                className={[
                  'v2-timeline__content',
                  isEven && 'v2-timeline__content--right-align',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div
                  className="v2-timeline__reveal-item v2-timeline__reveal-item--number"
                  data-revealed={isActive || undefined}
                >
                  <CounterNumber
                    number={step.number}
                    isActive={isActive}
                    hasAnimated={counterAnimated}
                    stepIndex={i}
                  />
                </div>
                <div
                  className="v2-timeline__reveal-item v2-timeline__reveal-item--title"
                  data-revealed={isActive || undefined}
                >
                  <h4 className="v2-timeline__title">{step.title}</h4>
                </div>
                <div
                  className="v2-timeline__reveal-item v2-timeline__reveal-item--text"
                  data-revealed={isActive || undefined}
                >
                  <p className="v2-timeline__text">{step.text}</p>
                </div>
              </div>

              {/* KPI card side */}
              <div className="v2-timeline__kpi-wrapper">
                <div
                  className="v2-timeline__kpi-card"
                  data-revealed={isActive || undefined}
                  data-reveal-from={isEven ? 'left' : 'right'}
                >
                  <div className="v2-timeline__kpi-icon">
                    <V2Icon name={step.icon} />
                  </div>
                  <p className="v2-timeline__kpi-label">{step.kpiLabel}</p>
                  <p className="v2-timeline__kpi-value">{step.kpiValue}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
