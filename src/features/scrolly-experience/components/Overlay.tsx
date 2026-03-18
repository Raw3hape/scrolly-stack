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
      const scrollY = window.scrollY;
      const fadeStart = 50;
      const fadeEnd = 250;

      if (scrollY <= fadeStart) {
        setHeroOpacity(1);
      } else if (scrollY >= fadeEnd) {
        setHeroOpacity(0);
      } else {
        const progress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
        setHeroOpacity(1 - progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let rafId: number | null = null;

    const scheduleUpdate = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        const targetY = window.innerHeight * 0.45;
        const candidates = [heroRef.current, ...stepRefs.current]
          .filter((element): element is HTMLElement => Boolean(element))
          .map((element) => {
            const rect = element.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;

            return {
              element,
              isVisible,
              distance: Math.abs(centerY - targetY),
            };
          })
          .filter((candidate) => candidate.isVisible);

        if (candidates.length > 0) {
          const best = candidates.reduce((closest, candidate) =>
            candidate.distance < closest.distance ? candidate : closest,
          );
          const stepId = best.element.getAttribute('data-step-id');
          setStep(stepId === 'hero' ? HERO_STEP : Number(stepId));
        }

        rafId = null;
      });
    };

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    scheduleUpdate();

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
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
            {heroContent.ctaLabel}
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
                      fill="white"
                      className="timeline-dot__icon"
                      aria-hidden="true"
                    >
                      <path d={step.icon} />
                    </svg>
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
          marginBottom: `calc(-1 * ${mosaicConfig.exitHeight})`,
        }}
        aria-hidden="true"
      />
    </div>
  );
}
