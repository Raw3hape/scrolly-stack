/**
 * TestimonialSection — interactive carousel with auto-play & manual navigation.
 *
 * Left column: section heading + animated progress bar + nav arrows.
 * Right column: quote card with crossfade transition between slides.
 *
 * Data-driven: receives all content via props from content-v2.ts.
 * Uses useCarousel hook for state management.
 */

'use client';

import { useRef, useCallback } from 'react';
import type { TestimonialSection as TestimonialSectionData } from '@/config/types-v2';
import useCarousel from '@/hooks/useCarousel';
import './TestimonialSection.css';

interface Props {
  data: TestimonialSectionData;
}

/** Minimum swipe distance (px) to trigger slide change */
const SWIPE_THRESHOLD = 50;

export default function TestimonialSection({ data }: Props) {
  const { testimonials, autoPlayInterval = 8000 } = data;

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
        {data.heading && (
          <div className="v2-testimonial__left">
            <h2 className="v2-testimonial__heading px-layer--fg">{data.heading}</h2>

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
                      {/* eslint-disable-next-line @next/next/no-img-element */}
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
