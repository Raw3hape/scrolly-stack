/**
 * StepCards — Foundation Projects
 *
 * Numbered step cards for process sections (used on Roofers and Investors pages).
 * Server component — no client-side JS needed.
 */

import './StepCards.css';

interface Step {
  number: number;
  title: string;
  description: string;
  footnote?: string;
}

interface StepCardsProps {
  steps: readonly Step[];
}

/** Renders numbered step cards in a responsive grid */
export default function StepCards({ steps }: StepCardsProps) {
  return (
    <div className="step-cards">
      {steps.map((step) => (
        <article key={step.number} className="step-card">
          <div className="step-card__number" aria-hidden="true">
            {step.number}
          </div>
          <h3 className="step-card__title">{step.title}</h3>
          <p className="step-card__description">{step.description}</p>
          {step.footnote && (
            <p className="step-card__footnote">{step.footnote}</p>
          )}
        </article>
      ))}
    </div>
  );
}
