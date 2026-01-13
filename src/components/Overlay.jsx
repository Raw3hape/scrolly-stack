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

      {/* STEPS SECTION - Timeline Style */}
      <div className="steps-container" role="region" aria-label="Business transformation steps">
        {/* Timeline connecting line */}
        <div className="timeline-line" aria-hidden="true" />
        
        {steps.map((step, index) => {
          const isActive = currentStep === index;
          const isPrev = currentStep > index;
          const isNext = currentStep < index;
          const distance = Math.abs(currentStep - index);

          return (
            <div
              key={step.id}
              id={`step-${step.id}`}
              data-index={index}
              ref={(el) => (stepRefs.current[index] = el)}
              className={`step ${isActive ? 'step--active' : ''} ${isPrev ? 'step--prev' : ''} ${isNext ? 'step--next' : ''}`}
              style={{ 
                '--step-color': step.color,
                '--step-distance': distance,
              }}
            >
              {/* Content without card background */}
              <div
                className={`step-content ${isActive ? 'step-content--active' : 'step-content--inactive'}`}
                aria-current={isActive ? 'step' : undefined}
              >
                {/* Title row with icon-dot combo */}
                <div className="step-content__title-row">
                  {/* Timeline dot with icon inside */}
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
                  
                  {/* Title */}
                  <h3 className="step-content__title">
                    {step.tooltipTitle}
                  </h3>
                </div>

                {/* Subhead */}
                <p
                  className="step-content__subhead"
                  style={{ color: step.color }}
                >
                  {step.tooltipSubhead}
                </p>

                {/* Bullets */}
                <ul className="step-content__bullets">
                  {step.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>

                {/* Mini CTA */}
                <button
                  className={`step-content__cta ${!isActive ? 'step-content__cta--hidden' : ''}`}
                  aria-label={`Learn more about ${step.tooltipTitle}`}
                  tabIndex={isActive ? 0 : -1}
                >
                  See if I qualify
                  <span className="step-content__cta-arrow" aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
