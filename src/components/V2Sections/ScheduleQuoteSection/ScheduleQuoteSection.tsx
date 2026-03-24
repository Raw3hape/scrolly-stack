/**
 * ScheduleQuoteSection — Dark testimonial quote with background image.
 *
 * Server component — purely presentational.
 */

import type { ScheduleQuoteSection as ScheduleQuoteSectionData } from '@/config/types';
import './ScheduleQuoteSection.css';

interface Props {
  data: ScheduleQuoteSectionData;
}

export default function ScheduleQuoteSection({ data }: Props) {
  return (
    <div className="v2-schedule-quote">
      {/* Background image (right side, low opacity) */}
      {data.backgroundUrl && (
        <div
          className="v2-schedule-quote__bg"
          style={{ backgroundImage: `url(${data.backgroundUrl})` }}
          aria-hidden="true"
        />
      )}

      <div className="v2-schedule-quote__inner">
        {/* Quote icon */}
        <svg
          className="v2-schedule-quote__icon px-layer--fg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
        </svg>

        <p className="v2-schedule-quote__text px-layer--fg" data-px-delay="1">
          &ldquo;{data.quote}&rdquo;
        </p>

        <div className="v2-schedule-quote__author px-layer--fg" data-px-delay="2">
          {data.avatarUrl && (
            <div className="v2-schedule-quote__avatar">
              <img src={data.avatarUrl} alt={data.author} />
            </div>
          )}
          <div>
            <div className="v2-schedule-quote__name">{data.author}</div>
            <div className="v2-schedule-quote__role">{data.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
