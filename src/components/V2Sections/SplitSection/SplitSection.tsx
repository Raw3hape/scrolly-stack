/**
 * SplitSection — two-column layout: image + text with bullet list.
 *
 * Matches Stitch "Problem: The Gap" pattern:
 * - Left: image (4:5 aspect, rounded, gradient overlay, italic quote)
 * - Right: heading + body text + bullet list (cancel/check icons)
 *
 * Responsive:
 * - Desktop: 2-col grid
 * - Tablet/Mobile: stacked (image → text)
 *
 * Data-driven: receives all content via props from content.ts.
 */

import type { SplitSection as SplitSectionData } from '@/config/types';
import './SplitSection.css';

interface Props {
  data: SplitSectionData;
}

export default function SplitSection({ data }: Props) {
  return (
    <div className="v2-container">
      <div className={`v2-split${data.reverse ? ' v2-split--reverse' : ''}`}>
        {/* Image column */}
        <div className="v2-split__image-col px-layer--bg" data-px-from="left">
          <div className="v2-split__image-wrapper">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="v2-split__image"
              src={data.image.url}
              alt=""
              loading="lazy"
            />
            <div className="v2-split__image-overlay" aria-hidden="true" />
            {data.image.quote && (
              <div className="v2-split__image-quote">
                <p className="v2-split__image-quote-text">{data.image.quote}</p>
              </div>
            )}
          </div>
        </div>

        {/* Text column */}
        <div className="v2-split__content px-layer--fg">
          <h2 className="v2-split__heading">{data.heading}</h2>
          <p className="v2-split__text">{data.text}</p>

          {/* Bullet list */}
          <ul className="v2-split__bullets">
            {data.bullets.map((bullet) => (
              <li key={bullet.text} className="v2-split__bullet">
                <span
                  className={`v2-split__bullet-icon v2-split__bullet-icon--${bullet.icon}`}
                  aria-hidden="true"
                >
                  {bullet.icon === 'cancel' ? '✕' : '✓'}
                </span>
                <span className="v2-split__bullet-text">{bullet.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
