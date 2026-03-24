import type { Metadata } from 'next';
import { scheduleContent } from '@/config/content-v2';
import SectionRenderer from '@/components/V2Sections/SectionRenderer';

export const metadata: Metadata = {
  title: scheduleContent.metadata.title,
  description: scheduleContent.metadata.description,
};

/**
 * SchedulePage — Book A Call
 *
 * Data-driven: all content from content-v2.ts → SectionRenderer.
 * Sections: schedule-hero + schedule-booking (modular calendar) +
 * schedule-quote + CTA.
 */
export default function SchedulePage() {
  return (
    <div className="v2-content-wrapper">
      {scheduleContent.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}
