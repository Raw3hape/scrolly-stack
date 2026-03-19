import type { Metadata } from 'next';
import Section from '@/components/Section/Section';
import PageHeader from '@/components/PageHeader/PageHeader';
import { pageMetadata } from '@/config/content/metadata';
import { scheduleContent } from '@/config/content/schedule';
import '../../status-pages.css';

export const metadata: Metadata = pageMetadata.schedule;

/**
 * Schedule A Call Page — Foundation Projects
 *
 * Section 1: Heading + body + Calendly widget placeholder.
 */
export default function SchedulePage() {
  return (
    <Section width="narrow" centered>
      <PageHeader
        title={scheduleContent.heading}
        description={scheduleContent.body}
        align="center"
      />
      {/* Calendly embed will go here */}
      <div className="placeholder-box">
        [{scheduleContent.widgetPlaceholder}]
      </div>
    </Section>
  );
}
