/**
 * MissionSection — dark block with heading, steps, and a quote card.
 *
 * Supports two layout variants:
 * - 'horizontal' (default): 2-column grid (heading+steps left, quote right)
 *   Used on Home page.
 * - 'vertical': centered header → 3-col bordered grid → quote below
 *   Matches Stitch "About - Creative Variation 2", Chapter II.
 *
 * Data-driven: receives all content via props from content-v2.ts.
 */

import type { MissionSection as MissionSectionData } from '@/config/types-v2';
import V2Icon from '../V2Icon/V2Icon';
import ScrollTypewriter from '@/components/ScrollTypewriter/ScrollTypewriter';
import InteractiveGrid from '@/components/InteractiveGrid/InteractiveGrid';
import './MissionSection.css';

interface Props {
  data: MissionSectionData;
}

export default function MissionSection({ data }: Props) {
  const isVertical = data.layout === 'vertical';

  if (isVertical) {
    return (
      <div className="v2-container">
        <div className="v2-mission v2-mission--vertical">
          {/* Centered header with chapter label */}
          <div className="v2-mission--vertical__header">
            {data.chapterLabel && (
              <span className="v2-mission--vertical__chapter">{data.chapterLabel}</span>
            )}
            <h2 className="v2-mission--vertical__heading px-layer--fg">{data.heading}</h2>
            {data.headingAccent && (
              <p className="v2-mission--vertical__subtext">{data.headingAccent}</p>
            )}
          </div>

          {/* 3-column bordered grid */}
          <div className="v2-mission--vertical__grid">
            {data.steps.map((step, i) => (
              <div
                key={step.title}
                className={`v2-mission--vertical__item px-layer--accent${
                  i < data.steps.length - 1 ? ' v2-mission--vertical__item--bordered' : ''
                }`}
                data-px-delay={String(i)}
              >
                <div className="v2-mission--vertical__item-icon">
                  <V2Icon name={step.icon} />
                </div>
                <h4 className="v2-mission--vertical__item-title">{step.title}</h4>
                <p className="v2-mission--vertical__item-text">{step.text}</p>
              </div>
            ))}
          </div>

          {/* Quote card — below, centered, dark bg */}
          <div className="v2-mission--vertical__quote px-layer--accent" data-px-delay="3">
            <div className="v2-mission--vertical__quote-inner">
              <InteractiveGrid cols={8} rows={5} glowRadius={2.5} glowIntensity={0.07} />
              <div className="v2-mission--vertical__quote-border" aria-hidden="true" />
              <ScrollTypewriter
                text={data.quote.text}
                className="v2-mission--vertical__quote-text"
                completionFactor={0.55}
              />
              <p className="v2-mission--vertical__quote-label">{data.quote.label}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Default: horizontal 2-col layout (unchanged, used by Home page) ── */
  return (
    <div className={`v2-mission${data.backgroundUrl ? ' v2-mission--cinematic' : ''}`}>
      {/* Optional background layer — cinematic mode */}
      {data.backgroundUrl && (
        <div className="v2-mission__bg" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="v2-mission__bg-photo"
            src={data.backgroundUrl}
            alt=""
            loading="lazy"
          />
          <div className="v2-mission__bg-overlay" />
        </div>
      )}

      <div className="v2-container">
        <div className="v2-mission__inner">
          <div>
            <h2 className="v2-mission__heading px-layer--fg">
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

          <div className="v2-mission__quote-card" data-px-delay="2">
            <p className="v2-mission__quote-text">{data.quote.text}</p>
            <p className="v2-mission__quote-body">{data.quote.body}</p>
            <div className="v2-mission__quote-line">
              <div className="v2-mission__quote-bar" />
              <span className="v2-mission__quote-label">{data.quote.label}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
