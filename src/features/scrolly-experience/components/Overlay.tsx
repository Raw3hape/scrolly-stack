/**
 * Overlay Component
 *
 * Narrative layer: hero section + scrollytelling steps.
 * Tracks the active step by measuring which section is closest to the viewport focus line.
 * Includes mosaic trigger zone for the grid transition.
 */

import { useEffect, useRef, useState } from 'react';
import { useVariant } from '../VariantContext';
import { heroContent, stepCta } from '@/config/content/home';
import { BREAKPOINTS } from '@/config/breakpoints';
import { HERO_STEP, getStepElementId } from '../utils/stepNavigation';
import { mosaic as mosaicConfig } from '../config';
import type { OverlayProps, StepData } from '../types';
import './Overlay.css';

export default function Overlay({ currentStep, setStep, mosaicTriggerRef }: OverlayProps) {
  const { steps, scrollDirection } = useVariant();

  // For 'up' scroll, reverse the DOM order so bottom layers appear first
  const orderedSteps = scrollDirection === 'up'
    ? (steps as StepData[]).slice().reverse()
    : (steps as StepData[]);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const heroRef = useRef<HTMLElement>(null);
  const [heroOpacity, setHeroOpacity] = useState(1);

  // Scroll-based hero fade for mobile
  useEffect(() => {
    const isMobile = window.innerWidth < BREAKPOINTS.md;
    if (!isMobile) return;

    const handleScroll = () => {
      const vh = window.innerHeight;
      const fadeStart = vh * 0.06;  // ~40px on 667px, ~56px on 926px
      const fadeEnd = vh * 0.45;    // ~300px on 667px, ~380px on 844px (matches larger hero zone)
      const y = window.scrollY;

      if (y <= fadeStart) {
        setHeroOpacity(1);
      } else if (y >= fadeEnd) {
        setHeroOpacity(0);
      } else {
        const progress = (y - fadeStart) / (fadeEnd - fadeStart);
        setHeroOpacity(1 - progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Step tracking via IntersectionObserver — zero layout recalc during scroll.
  // IO runs on a separate browser thread, fires callbacks only when visibility
  // changes at threshold crossings. Entry.boundingClientRect is pre-computed.
  useEffect(() => {
    const elements = [heroRef.current, ...stepRefs.current]
      .filter((el): el is HTMLElement => Boolean(el));
    if (elements.length === 0) return;

    // Track which elements are currently visible (Set, not Map).
    // We call fresh getBoundingClientRect() when comparing — avoids using
    // stale snapshot rects from different scroll positions (IO fires at
    // threshold crossings, not every frame).
    const visibleSet = new Set<HTMLElement>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            visibleSet.add(el);
          } else {
            visibleSet.delete(el);
          }
        }

        // Pick element closest to 45% viewport height
        if (visibleSet.size > 0) {
          const targetY = window.innerHeight * 0.45;
          let best: HTMLElement | null = null;
          let bestDist = Infinity;

          for (const el of visibleSet) {
            // Fresh rect — all comparisons use the same scroll position
            const rect = el.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const dist = Math.abs(centerY - targetY);
            if (dist < bestDist) {
              bestDist = dist;
              best = el;
            }
          }

          if (best) {
            const stepId = best.getAttribute('data-step-id');
            setStep(stepId === 'hero' ? HERO_STEP : Number(stepId));
          }
        }
      },
      {
        // 21 thresholds (every 5%) — reduces step-switch latency at hero↔step1
        // boundary where elements are tall and 20% increments miss early crossings
        threshold: Array.from({ length: 21 }, (_, i) => i / 20),
        rootMargin: '0px',
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [setStep]);

  return (
    <div className="overlay">
      {/* HERO SECTION */}
      <header
        ref={heroRef}
        data-step-id="hero"
        className="hero"
        role="banner"
        style={{ opacity: heroOpacity }}
      >
        <p className="hero__eyebrow">Opportunity</p>

        <h1 className="hero__headline">
          {heroContent.headline}{' '}
          <span className="hero__headline-accent">{heroContent.headlineAccent}</span>
        </h1>

        <p className="hero__subheadline">
          {heroContent.subheadline}
        </p>

        <div className="hero__cta-wrapper">
          <a
            href={heroContent.ctaHref}
            className="hero__cta-button"
            aria-label={heroContent.ctaAriaLabel}
          >
            {heroContent.ctaLabel} <span aria-hidden="true">→</span>
          </a>

          <p className="hero__status">
            <span className="hero__status-dot" aria-hidden="true"></span>
            {heroContent.statusText}
          </p>
        </div>
      </header>

      {/* STEPS SECTION */}
      <div className="steps-container" role="region" aria-label="Business transformation steps">
        <div className="timeline-line" aria-hidden="true" />

        {orderedSteps.map((step, index) => {
          const isActive = currentStep === step.id;
          const currentIndex = orderedSteps.findIndex(s => s.id === currentStep);
          const isPrev = currentIndex >= 0 && currentIndex > index;
          const isNext = currentIndex >= 0 && currentIndex < index;
          const distance = currentIndex >= 0 ? Math.abs(currentIndex - index) : index;

          return (
            <div
              key={step.id}
              id={getStepElementId(step.id)}
              data-step-id={step.id}
              ref={(el) => { stepRefs.current[index] = el; }}
              className={`step ${isActive ? 'step--active' : ''} ${isPrev ? 'step--prev' : ''} ${isNext ? 'step--next' : ''}`}
              style={{
                '--step-color': step.color,
                '--step-distance': distance,
              } as React.CSSProperties}
            >
              <div
                className={`step-content ${isActive ? 'step-content--active' : 'step-content--inactive'}`}
                aria-current={isActive ? 'step' : undefined}
              >
                <div className="step-content__title-row">
                  <div
                    className={`timeline-dot ${isActive ? 'timeline-dot--active' : ''}`}
                    style={{ backgroundColor: step.color }}
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="timeline-dot__icon"
                      aria-hidden="true"
                      dangerouslySetInnerHTML={{ __html: step.icon }}
                    />
                  </div>

                  <h3 className="step-content__title">
                    {step.tooltipTitle}
                  </h3>
                </div>

                <p
                  className="step-content__subhead"
                  style={{ color: step.color }}
                >
                  {step.tooltipSubhead}
                </p>

                <div className={`step-content__description-wrapper ${isActive ? 'step-content__description-wrapper--open' : ''}`}>
                  <div className="step-content__description-inner">
                    <p className="step-content__description">
                      {step.description}
                    </p>
                  </div>
                </div>

                <a
                  href={heroContent.ctaHref}
                  className={`step-content__cta ${!isActive ? 'step-content__cta--hidden' : ''}`}
                  aria-label={stepCta.ariaLabel(step.tooltipTitle)}
                  tabIndex={isActive ? 0 : -1}
                >
                  {stepCta.label}
                  <span className="step-content__cta-arrow" aria-hidden="true">{stepCta.arrowText}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* MOSAIC TRIGGER ZONE — invisible scroll driver for the mosaic transition */}
      {/* Height covers 3 phases: assembly + hold + exit */}
      {/* Negative marginBottom pulls next content up so it appears as the grid exits */}
      <div
        ref={mosaicTriggerRef}
        className="mosaic-trigger-zone"
        style={{
          height: `calc(${mosaicConfig.assemblyHeight} + ${mosaicConfig.holdHeight} + ${mosaicConfig.exitHeight})`,
          marginBottom: `calc(-1 * (${mosaicConfig.exitHeight} + ${mosaicConfig.contentOverlap}))`,
        }}
        aria-hidden="true"
      />
    </div>
  );
}
