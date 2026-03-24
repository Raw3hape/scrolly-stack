/**
 * CinematicSection — fullscreen cinematic block with background photo + glassmorphism card.
 *
 * Layout (from Stitch "About - Creative Variation 2", Chapter I):
 *   - Background: fullscreen photo (grayscale, dimmed) + teal overlay
 *   - Content: staggered 12-col grid
 *     - Chapter label + subtitle (overline)
 *     - Large heading (8/12 cols)
 *     - Glassmorphism card (6/12 cols, offset right)
 *
 * Data-driven: receives all content via props from content.ts.
 */

import type { CinematicSection as CinematicSectionData } from '@/config/types';
import './CinematicSection.css';

interface Props {
  data: CinematicSectionData;
}

export default function CinematicSection({ data }: Props) {
  return (
    <div className="v2-cinematic">
      {/* Background layer: photo + teal overlay */}
      <div className="v2-cinematic__bg" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="v2-cinematic__bg-photo"
          src={data.backgroundUrl}
          alt=""
          loading="lazy"
        />
        <div className="v2-cinematic__bg-overlay" />
      </div>

      {/* Content layer */}
      <div className="v2-cinematic__content">
        {/* Chapter label */}
        {data.chapterLabel && (
          <div className="v2-cinematic__chapter">
            <span className="v2-cinematic__chapter-label px-layer--fg">{data.chapterLabel}</span>
            {data.chapterSubtitle && (
              <h3 className="v2-cinematic__chapter-subtitle">{data.chapterSubtitle}</h3>
            )}
          </div>
        )}

        {/* Staggered grid: heading wide + card offset */}
        <div className="v2-cinematic__grid">
          <h2 className="v2-cinematic__heading px-layer--fg" data-px-delay="1">{data.heading}</h2>

          <div className="v2-cinematic__card" data-px-delay="2">
            <h3 className="v2-cinematic__card-title">{data.card.title}</h3>
            <p className="v2-cinematic__card-text">{data.card.text}</p>
            {data.card.footnote && (
              <div className="v2-cinematic__card-footnote">
                <svg
                  className="v2-cinematic__card-footnote-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                  <polyline points="17 18 23 18 23 12" />
                </svg>
                <span>{data.card.footnote}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
