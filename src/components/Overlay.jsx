import { useEffect, useRef } from 'react';
import { steps } from '../data';
import './Overlay.css';

export default function Overlay({ currentStep, setStep }) {
  const stepRefs = useRef([]);
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setStep(index);
          }
        });
      },
      {
        rootMargin: '-45% 0px -45% 0px',
        threshold: 0,
      }
    );

    // Observe Steps
    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    // Observe Hero
    if (heroRef.current) observer.observe(heroRef.current);

    return () => observer.disconnect();
  }, [setStep]);

  return (
    <div className="overlay">
      {/* HERO SECTION */}
      <header
        ref={heroRef}
        data-index="-1"
        className="hero"
        role="banner"
      >
        {/* Eyebrow */}
        <p className="hero__eyebrow">
          For founder-led roofing companies planning a succession path
        </p>

        {/* Headline */}
        <h1 className="hero__headline">
          Build a roofing business that runs clean—and sells at a premium.
        </h1>

        {/* Subheadline */}
        <p className="hero__subheadline">
          We install CRM + marketing systems, drive efficiency savings, and prepare you for an institutional-quality exit (target 7–10× EBITDA).
        </p>

        {/* CTA + Fear Reducer */}
        <div className="hero__cta-wrapper">
          <button
            className="hero__cta-button"
            aria-label="Check if you qualify for the program"
          >
            See if I qualify
          </button>

          <p className="hero__status">
            <span className="hero__status-dot" aria-hidden="true"></span>
            Only for qualified roofers. Confidential application.
          </p>
        </div>

        <div className="hero__scroll-hint">
          <p>Scroll to explore the stack ↓</p>
        </div>
      </header>

      {/* STEPS SECTION */}
      <div className="steps-container" role="region" aria-label="Business transformation steps">
        {steps.map((step, index) => {
          const isActive = currentStep === index;

          return (
            <div
              key={step.id}
              id={`step-${step.id}`}
              data-index={index}
              ref={(el) => (stepRefs.current[index] = el)}
              className="step"
            >
              {/* TOOLTIP / CARD STYLE */}
              <div
                className={`step-card ${isActive ? 'step-card--active' : 'step-card--inactive'}`}
                style={{ '--step-color': step.color }}
                aria-current={isActive ? 'step' : undefined}
              >
                {/* Tooltip Title */}
                <h3 className="step-card__title">
                  {step.tooltipTitle}
                </h3>

                {/* Tooltip Subhead */}
                <p
                  className="step-card__subhead"
                  style={{ color: step.color === '#1f2937' ? 'var(--color-text-secondary)' : step.color }}
                >
                  {step.tooltipSubhead}
                </p>

                {/* Bullets */}
                <ul className="step-card__bullets">
                  {step.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>

                {/* Mini CTA */}
                <button
                  className={`step-card__cta ${!isActive ? 'step-card__cta--hidden' : ''}`}
                  aria-label={`Learn more about ${step.tooltipTitle}`}
                  tabIndex={isActive ? 0 : -1}
                >
                  See if I qualify
                  <span className="step-card__cta-arrow" aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
