/**
 * ScheduleHeroSection — centered hero with heading + SMS pill badge.
 *
 * Server component — no interactivity needed.
 */

import type { ScheduleHeroSection as ScheduleHeroSectionData } from '@/config/types';
import './ScheduleHeroSection.css';

interface Props {
  data: ScheduleHeroSectionData;
}

export default function ScheduleHeroSection({ data }: Props) {
  return (
    <div className="v2-container">
      <div className="v2-schedule-hero">
        <h1 className="v2-schedule-hero__heading px-layer--fg">{data.heading}</h1>
        <p className="v2-schedule-hero__subtext px-layer--fg" data-px-delay="1">{data.subtext}</p>

        <div className="v2-schedule-hero__badge px-layer--accent" data-px-delay="2">
          <svg
            className="v2-schedule-hero__badge-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z" />
          </svg>
          <span>
            {data.smsBadge.text}{' '}
            <span className="v2-schedule-hero__badge-keyword">
              {data.smsBadge.keyword}
            </span>{' '}
            to {data.smsBadge.phone} ANYTIME.
          </span>
        </div>
      </div>
    </div>
  );
}
