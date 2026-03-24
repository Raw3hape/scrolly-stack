/**
 * BentoSection — Premium Architectural Data Dashboard.
 *
 * Client component: uses IntersectionObserver for scroll-driven reveal
 * and requestAnimationFrame for animated stat counters.
 *
 * Grid layout:
 *   Desktop (12-col): feature(7) | highlight(5) top row
 *                     feature     | link(5) middle
 *                     stats(3 each) bottom row
 *   Mobile: single column, stats in 2-col sub-grid.
 *
 * Data-driven: receives all content via props from content.ts.
 */

'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import type { BentoSection as BentoSectionData } from '@/config/types';
import { ctaConfig } from '@/config/nav';
import './BentoSection.css';

// ── Animated Counter Hook ──────────────────────────────────────────────────
// Smoothly animates a numeric value from 0 → target using rAF + cubic ease-out.
// Returns the formatted string to render. Only starts when `isVisible` is true.
function useAnimatedCounter(
  target: number,
  isVisible: boolean,
  duration = 1200,
  decimals = 0,
): string {
  const [value, setValue] = useState('0');
  const rafRef = useRef<number>(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isVisible || hasStarted.current) return;
    hasStarted.current = true;

    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic — fast start, gentle deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      setValue(current.toFixed(decimals));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isVisible, target, duration, decimals]);

  return value;
}

// ── Animated Value (reusable for highlight & stat cards) ───────────────────
function AnimatedValue({
  rawValue,
  prefix,
  suffix,
  isVisible,
  className,
}: {
  rawValue: string;
  prefix?: string;
  suffix?: string;
  isVisible: boolean;
  className?: string;
}) {
  const numericTarget = parseFloat(rawValue);
  const hasDecimal = rawValue.includes('.');
  const animated = useAnimatedCounter(
    numericTarget,
    isVisible,
    1200,
    hasDecimal ? 1 : 0,
  );

  return (
    <span className={className}>
      {prefix && <span className="v2-bento__stat-prefix">{prefix}</span>}
      {animated}
      {suffix && <span className="v2-bento__stat-suffix">{suffix}</span>}
    </span>
  );
}

// ── Stat Card (animated) ───────────────────────────────────────────────────
function StatCard({
  value,
  label,
  prefix,
  suffix,
  index,
  isVisible,
}: {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
  index: number;
  isVisible: boolean;
}) {
  return (
    <div
      className="v2-bento__stat"
      style={{ '--bento-i': index + 3 } as React.CSSProperties}
    >
      <div className="v2-bento__stat-accent" aria-hidden="true" />
      <AnimatedValue
        rawValue={value}
        prefix={prefix}
        suffix={suffix}
        isVisible={isVisible}
        className="v2-bento__stat-value"
      />
      <span className="v2-bento__stat-label">{label}</span>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
interface Props {
  data: BentoSectionData;
}

export default function BentoSection({ data }: Props) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0]?.isIntersecting) setIsVisible(true);
  }, []);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  return (
    <div className="v2-container">
      <div
        ref={gridRef}
        className="v2-bento"
        data-visible={isVisible || undefined}
      >
        {/* ── Feature card ── */}
        <div
          className="v2-bento__feature"
          style={{ '--bento-i': 0 } as React.CSSProperties}
        >
          <div className="v2-bento__feature-mesh" aria-hidden="true" />
          <div className="v2-bento__feature-bracket v2-bento__feature-bracket--tl" aria-hidden="true" />
          <div className="v2-bento__feature-bracket v2-bento__feature-bracket--br" aria-hidden="true" />

          <div className="v2-bento__feature-content">
            <span className="v2-bento__feature-overline">{data.feature.overline}</span>
            <h3 className="v2-bento__feature-heading">{data.feature.heading}</h3>
          </div>

          <div className="v2-bento__feature-body">
            <p className="v2-bento__feature-text">{data.feature.text}</p>
            {data.feature.bullets && (
              <ul className="v2-bento__feature-bullets">
                {data.feature.bullets.map((b) => (
                  <li key={b} className="v2-bento__feature-bullet">
                    <span className="v2-bento__bullet-check" aria-hidden="true">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Highlight card (gold accent, animated counter) ── */}
        {data.highlight && (
          <div
            className="v2-bento__highlight"
            style={{ '--bento-i': 1 } as React.CSSProperties}
          >
            <div className="v2-bento__highlight-glow" aria-hidden="true" />
            <AnimatedValue
              rawValue={data.highlight.value}
              suffix={data.highlight.value.includes('%') ? undefined : '%'}
              isVisible={isVisible}
              className="v2-bento__highlight-value"
            />
            <span className="v2-bento__highlight-label">{data.highlight.label}</span>
            {data.highlight.context && (
              <span className="v2-bento__highlight-context">{data.highlight.context}</span>
            )}
          </div>
        )}

        {/* ── Link card ── */}
        {data.linkCard && (
          <Link
            href={data.linkCard.href ?? ctaConfig.href}
            className="v2-bento__link-card"
            style={{ '--bento-i': 2 } as React.CSSProperties}
          >
            <div className="v2-bento__link-content">
              <h4 className="v2-bento__link-title">{data.linkCard.title}</h4>
              <p className="v2-bento__link-text">{data.linkCard.text}</p>
            </div>
            <span className="v2-bento__link-arrow" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </span>
          </Link>
        )}

        {/* ── Stat cards ── */}
        <div className="v2-bento__stats-grid">
          {data.stats.map((stat, i) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              prefix={stat.prefix}
              suffix={stat.suffix}
              index={i}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
