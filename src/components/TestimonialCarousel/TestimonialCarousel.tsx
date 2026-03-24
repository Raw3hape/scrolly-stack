/**
 * TestimonialCarousel — shared testimonial display component.
 *
 * Two visual variants:
 *   - 'standard': interactive carousel with auto-play, progress bar, arrows, swipe
 *   - 'opt-in':   scroll-driven horizontal card strip with lerp animation
 *
 * Extracted from TestimonialSection and OptInTestimonialsSection to DRY up
 * shared rendering patterns while keeping variant-specific behaviour.
 */

'use client';

import { useRef, useCallback, useEffect } from 'react';
import useCarousel from '@/hooks/useCarousel';
import './TestimonialCarousel.css';

/* ── Shared testimonial item shapes ── */

export interface StandardTestimonialItem {
  quote: string;
  author: string;
  company: string;
  avatarUrl?: string;
  badge?: string;
}

export interface OptInTestimonialItem {
  quote: string;
  role: string;
  company: string;
  verified: boolean;
}

/* ── Variant-specific props (discriminated union) ── */

interface StandardVariantProps {
  variant: 'standard';
  testimonials: StandardTestimonialItem[];
  heading?: string;
  autoPlayInterval?: number;
}

interface OptInVariantProps {
  variant: 'opt-in';
  testimonials: OptInTestimonialItem[];
  heading: string;
  subtext: string;
  pullQuote: { text: string; source: string };
}

export type TestimonialCarouselProps = StandardVariantProps | OptInVariantProps;

/** Minimum swipe distance (px) to trigger slide change */
const SWIPE_THRESHOLD = 50;

export default function TestimonialCarousel(props: TestimonialCarouselProps) {
  if (props.variant === 'standard') {
    return <StandardCarousel {...props} />;
  }
  return <OptInStrip {...props} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
 * Standard variant — interactive carousel with auto-play & manual navigation
 * ═══════════════════════════════════════════════════════════════════════════ */

function StandardCarousel({
  testimonials,
  heading,
  autoPlayInterval = 8000,
}: StandardVariantProps) {
  const {
    activeIndex,
    isAutoPlaying,
    goTo,
    next,
    prev,
    progressKey,
  } = useCarousel({
    totalSlides: testimonials.length,
    autoPlayInterval,
  });

  // Touch swipe tracking
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;

      // Only trigger if horizontal swipe is dominant
      if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) next();
        else prev();
      }
    },
    [next, prev],
  );

  const current = testimonials[activeIndex];
  if (!current) return null;

  return (
    <div className="v2-container">
      <div
        className="v2-testimonial"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left column: heading + progress bar + arrows */}
        {heading && (
          <div className="v2-testimonial__left">
            <h2 className="v2-testimonial__heading px-layer--fg">{heading}</h2>

            {/* Progress bar segments */}
            <div className="v2-testimonial__progress" role="tablist" aria-label="Testimonial navigation">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === activeIndex}
                  aria-label={`Testimonial ${i + 1}`}
                  className={`v2-testimonial__segment${i === activeIndex ? ' v2-testimonial__segment--active' : ''}`}
                  onClick={() => goTo(i)}
                >
                  {i === activeIndex && isAutoPlaying && (
                    <span
                      key={progressKey}
                      className="v2-testimonial__segment-fill"
                      style={
                        { '--testimonial-interval': `${autoPlayInterval}ms` } as React.CSSProperties
                      }
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Navigation arrows */}
            <div className="v2-testimonial__arrows">
              <button
                type="button"
                className="v2-testimonial__arrow"
                onClick={prev}
                aria-label="Previous testimonial"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                className="v2-testimonial__arrow"
                onClick={next}
                aria-label="Next testimonial"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Right column: quote card with crossfade */}
        <div className="v2-testimonial__right">
          <div className="v2-testimonial__slides" aria-live="polite">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`v2-testimonial__card px-layer--accent${
                  i === activeIndex ? ' v2-testimonial__card--active' : ''
                }`}
                data-px-from="right"
                data-px-delay="1"
                aria-hidden={i !== activeIndex}
              >
                <span className="v2-testimonial__quote-icon" aria-hidden="true">&ldquo;</span>
                <p className="v2-testimonial__quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="v2-testimonial__attribution">
                  {t.avatarUrl && (
                    <div className="v2-testimonial__avatar-wrap">
                      <img
                        className="v2-testimonial__avatar"
                        src={t.avatarUrl}
                        alt={t.author}
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div>
                    <cite className="v2-testimonial__author">{t.author}</cite>
                    <span className="v2-testimonial__company">{t.company}</span>
                  </div>
                  {t.badge && (
                    <span className="v2-testimonial__badge">{t.badge}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * Opt-in variant — scroll-driven horizontal card strip with lerp animation
 * ═══════════════════════════════════════════════════════════════════════════ */

function OptInStrip({
  testimonials,
  heading,
  subtext,
  pullQuote,
}: OptInVariantProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  /**
   * Scroll-linked horizontal translation with viscous easing.
   *
   * Architecture (two-phase):
   *   1. Scroll handler (passive) -> writes `targetX` (instant, no DOM)
   *   2. rAF lerp loop -> smoothly interpolates `currentX` toward `targetX`
   *      at LERP_FACTOR per frame, creating an elastic "chasing" effect
   */
  const isVisible = useRef(false);
  const targetX = useRef(0);
  const currentX = useRef(0);
  const rafId = useRef(0);

  const LERP_FACTOR = 0.06;

  const computeTarget = useCallback(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const vh = window.innerHeight;

    // progress: 0 -> 1 as section scrolls through viewport
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

  // rAF lerp loop -- runs while section is visible.
  // Uses a plain function inside useEffect to avoid self-referencing useCallback.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const animate = () => {
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
    };

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
  }, [handleScroll, computeTarget]);

  return (
    <div ref={sectionRef} className="v2-optin-test">
      {/* Header */}
      <div className="v2-container">
        <div className="v2-optin-test__header">
          <div className="v2-optin-test__header-left">
            <h3 className="v2-optin-test__heading">{heading}</h3>
            <p className="v2-optin-test__subtext">{subtext}</p>
          </div>
          <div className="v2-optin-test__header-right">
            <span className="v2-optin-test__pull-quote">{pullQuote.text}</span>
            <span className="v2-optin-test__pull-source">
              — {pullQuote.source}
            </span>
          </div>
        </div>
      </div>

      {/* Scroll-Driven Card Strip */}
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
