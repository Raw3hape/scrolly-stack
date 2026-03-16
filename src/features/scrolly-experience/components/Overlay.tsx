/**
 * Overlay Component
 *
 * Narrative layer: hero section + scrollytelling steps.
 * Uses IntersectionObserver to track current step by block .id.
 */

import { useEffect, useRef, useState } from 'react';
import { steps } from '../data';
import type { OverlayProps, StepData } from '../types';
import './Overlay.css';

export default function Overlay({ currentStep, setStep }: OverlayProps) {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const heroRef = useRef<HTMLElement>(null);
  const [heroOpacity, setHeroOpacity] = useState(1);

  // Scroll-based hero fade for mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepId = entry.target.getAttribute('data-step-id');
            setStep(stepId === 'hero' ? -1 : Number(stepId));
          }
        });
      },
      {
        rootMargin: '-40% 0px -50% 0px',
        threshold: 0,
      }
    );

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    if (heroRef.current) observer.observe(heroRef.current);

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
        <h1 className="hero__headline">
          Build a roofing business that runs clean—and sells at a{' '}
          <span className="hero__headline-accent">premium.</span>
        </h1>

        <p className="hero__subheadline">
          We install CRM + marketing systems, drive efficiency savings, and prepare you for an institutional-quality exit.
        </p>

        <div className="hero__cta-wrapper">
          <a
            href="https://google.com"
            className="hero__cta-button"
            aria-label="Check if you qualify for the program"
          >
            See if I qualify →
          </a>

          <p className="hero__status">
            <span className="hero__status-dot" aria-hidden="true"></span>
            Only for qualified roofers. Confidential application.
          </p>
        </div>
      </header>

      {/* STEPS SECTION */}
      <div className="steps-container" role="region" aria-label="Business transformation steps">
        <div className="timeline-line" aria-hidden="true" />

        {(steps as StepData[]).map((step, index) => {
          const isActive = currentStep === index;
          const isPrev = currentStep > index;
          const isNext = currentStep < index;
          const distance = Math.abs(currentStep - index);

          return (
            <div
              key={step.id}
              id={`step-${step.id}`}
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

                <ul className="step-content__bullets">
                  {step.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>

                <a
                  href="https://google.com"
                  className={`step-content__cta ${!isActive ? 'step-content__cta--hidden' : ''}`}
                  aria-label={`Learn more about ${step.tooltipTitle}`}
                  tabIndex={isActive ? 0 : -1}
                >
                  See if I qualify
                  <span className="step-content__cta-arrow" aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
