/**
 * StepsSection — numbered steps grid.
 * Data-driven: receives all content via props from content-v2.ts.
 */

import type { StepsSection as StepsSectionData } from '@/config/types-v2';
import './StepsSection.css';

interface Props {
  data: StepsSectionData;
}

export default function StepsSection({ data }: Props) {
  return (
    <div className="v2-container">
      <div className="v2-steps-header">
        <div>
          <h2 className="v2-steps-header__heading">{data.heading}</h2>
        </div>
        {data.subtext && (
          <p className="v2-steps-header__subtext">{data.subtext}</p>
        )}
      </div>

      <div className="v2-steps-grid">
        {data.steps.map((step) => (
          <div key={step.number} className="v2-step">
            <div className="v2-step__number">{step.number}</div>
            <h3 className="v2-step__title">{step.title}</h3>
            <p className="v2-step__text">{step.text}</p>
            <div className="v2-step__bar">
              <div className="v2-step__bar-fill" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
