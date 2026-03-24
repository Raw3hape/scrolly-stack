/**
 * OptInTestimonialsSection — Scroll-driven horizontal testimonial card strip.
 *
 * Architecture:
 *   - IntersectionObserver tracks section visibility (entry ratio → progress 0→1)
 *   - Vertical scroll progress drives horizontal `translateX` on the card track
 *   - Cards always overflow edges (never see the end)
 *   - CSS gradient masks fade cards at left/right edges
 *   - Mobile: same scroll-driven behavior, smaller cards
 *
 * Performance:
 *   - Uses CSS custom property `--scroll-x` set from rAF (no React re-renders)
 *   - `will-change: transform` on track for GPU compositing
 *   - Cleans up observer + scroll listener on unmount
 */

'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { OptInTestimonialsSection as OptInTestimonialsSectionData } from '@/config/types';
import './OptInTestimonialsSection.css';

interface Props {
  data: OptInTestimonialsSectionData;
}

export default function OptInTestimonialsSection({ data }: Props) {
  const { testimonials } = data;
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  /**
   * Scroll-linked horizontal translation with viscous easing.
   *
   * Architecture (two-phase):
   *   1. Scroll handler (passive) → writes `targetX` (instant, no DOM)
   *   2. rAF lerp loop → smoothly interpolates `currentX` toward `targetX`
   *      at LERP_FACTOR per frame, creating an elastic "chasing" effect
   *
   * This decouples the scroll input (60–120 Hz) from the visual output,
   * producing a luxuriously smooth, organic feel.
   */
  const isVisible = useRef(false);
  const targetX = useRef(0);
  const currentX = useRef(0);
  const rafId = useRef(0);

  const LERP_FACTOR = 0.06; // lower = more viscous / delayed

  const computeTarget = useCallback(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const vh = window.innerHeight;

    // progress: 0 → 1 as section scrolls through viewport
    const progress = Math.max(0, Math.min(1,
      (vh - rect.top) / (vh + rect.height)
    ));

    const trackWidth = trackRef.current.scrollWidth;
    const visibleWidth = sectionRef.current.offsetWidth;
    const maxOffset = trackWidth - visibleWidth;

    targetX.current = -(progress * maxOffset * 0.85);
  }, []);

  const handleScroll = useCallback(() => {
    if (!isVisible.current) return;
    computeTarget();
  }, [computeTarget]);

  // rAF lerp loop — runs while section is visible
  const animate = useCallback(() => {
    const dx = targetX.current - currentX.current;

    // Only update DOM when delta is meaningful (> 0.5px)
    if (Math.abs(dx) > 0.5) {
      currentX.current += dx * LERP_FACTOR;
      trackRef.current?.style.setProperty(
        '--scroll-x',
        `${currentX.current}px`,
      );
    }

    if (isVisible.current) {
      rafId.current = requestAnimationFrame(animate);
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          computeTarget();
          rafId.current = requestAnimationFrame(animate);
        } else {
          cancelAnimationFrame(rafId.current);
        }
      },
      { threshold: 0, rootMargin: '100px 0px' },
    );

    observer.observe(section);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial
    computeTarget();
    rafId.current = requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [handleScroll, computeTarget, animate]);

  return (
    <div ref={sectionRef} className="v2-optin-test">
      {/* ── Header ── */}
      <div className="v2-container">
        <div className="v2-optin-test__header">
          <div className="v2-optin-test__header-left">
            <h3 className="v2-optin-test__heading">{data.heading}</h3>
            <p className="v2-optin-test__subtext">{data.subtext}</p>
          </div>
          <div className="v2-optin-test__header-right">
            <span className="v2-optin-test__pull-quote">{data.pullQuote.text}</span>
            <span className="v2-optin-test__pull-source">
              — {data.pullQuote.source}
            </span>
          </div>
        </div>
      </div>

      {/* ── Scroll-Driven Card Strip ── */}
      <div className="v2-optin-test__bleed">
        <div ref={trackRef} className="v2-optin-test__track">
          {testimonials.map((t, i) => (
            <article
              key={i}
              className="v2-optin-test__card"
            >
              {/* Verified badge */}
              {t.verified && (
                <div className="v2-optin-test__verified">
                  <svg
                    className="v2-optin-test__verified-icon"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="14"
                    height="14"
                    aria-hidden="true"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  <span className="v2-optin-test__verified-text">Verified Member</span>
                </div>
              )}

              {/* Quote */}
              <p className="v2-optin-test__quote">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Attribution */}
              <div className="v2-optin-test__attribution">
                <div className="v2-optin-test__avatar">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="20"
                    height="20"
                    aria-hidden="true"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div className="v2-optin-test__author-info">
                  <span className="v2-optin-test__role">{t.role}</span>
                  <span className="v2-optin-test__company">{t.company}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
