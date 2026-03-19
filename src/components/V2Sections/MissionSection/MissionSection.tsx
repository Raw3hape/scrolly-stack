/**
 * MissionSection — dark block with heading, steps, and a quote card.
 * Data-driven: receives all content via props from content-v2.ts.
 */

import type { MissionSection as MissionSectionData } from '@/config/types-v2';
import V2Icon from '../V2Icon/V2Icon';
import './MissionSection.css';

interface Props {
  data: MissionSectionData;
}

export default function MissionSection({ data }: Props) {
  return (
    <div className="v2-container">
      <div className="v2-mission">
        <div>
          <h2 className="v2-mission__heading">
            {data.heading}{' '}
            {data.headingAccent && (
              <span className="v2-mission__accent">{data.headingAccent}</span>
            )}
          </h2>

          <div className="v2-mission__steps">
            {data.steps.map((step) => (
              <div key={step.title} className="v2-mission__step">
                <div className="v2-mission__step-icon">
                  <V2Icon name={step.icon} />
                </div>
                <div>
                  <h3 className="v2-mission__step-title">{step.title}</h3>
                  <p className="v2-mission__step-text">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="v2-mission__quote-card">
          <p className="v2-mission__quote-text">{data.quote.text}</p>
          <p className="v2-mission__quote-body">{data.quote.body}</p>
          <div className="v2-mission__quote-line">
            <div className="v2-mission__quote-bar" />
            <span className="v2-mission__quote-label">{data.quote.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
