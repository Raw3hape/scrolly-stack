/**
 * TestimonialSection — two-column "Proof Of The Model" layout.
 *
 * Left column: section heading + decorative progress dots.
 * Right column: quote card with avatar + verified badge.
 *
 * Data-driven: receives all content via props from content-v2.ts.
 */

import type { TestimonialSection as TestimonialSectionData } from '@/config/types-v2';
import './TestimonialSection.css';

interface Props {
  data: TestimonialSectionData;
}

export default function TestimonialSection({ data }: Props) {
  return (
    <div className="v2-container">
      <div className="v2-testimonial">
        {/* Left column: heading + decorative dots */}
        {data.heading && (
          <div className="v2-testimonial__left">
            <h2 className="v2-testimonial__heading px-layer--fg">{data.heading}</h2>
            <div className="v2-testimonial__dots" aria-hidden="true">
              <div className="v2-testimonial__dot v2-testimonial__dot--active" />
              <div className="v2-testimonial__dot" />
              <div className="v2-testimonial__dot" />
            </div>
          </div>
        )}

        {/* Right column: quote card */}
        <div className="v2-testimonial__right">
          <div className="v2-testimonial__card px-layer--accent" data-px-from="right" data-px-delay="1">
            <span className="v2-testimonial__quote-icon" aria-hidden="true">&ldquo;</span>
            <p className="v2-testimonial__quote">&ldquo;{data.quote}&rdquo;</p>
            <div className="v2-testimonial__attribution">
              {data.avatarUrl && (
                <div className="v2-testimonial__avatar-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="v2-testimonial__avatar"
                    src={data.avatarUrl}
                    alt={data.author}
                    loading="lazy"
                  />
                </div>
              )}
              <div>
                <cite className="v2-testimonial__author">{data.author}</cite>
                <span className="v2-testimonial__company">{data.company}</span>
              </div>
              {data.badge && (
                <span className="v2-testimonial__badge">{data.badge}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
