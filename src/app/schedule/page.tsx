import type { Metadata } from 'next';
import Section from '@/components/Section/Section';
import PageHeader from '@/components/PageHeader/PageHeader';

export const metadata: Metadata = {
  title: 'Schedule A Call',
  description: 'Book a free 15-minute consultation with Foundation Projects to see if you qualify.',
};

export default function SchedulePage() {
  return (
    <Section width="narrow" centered>
      <PageHeader
        title="Schedule A Call"
        description="Schedule a call below or text ROOF to XXX-XXX-XXXX ANYTIME."
        align="center"
      />
      {/* Calendly embed will go here */}
      <div style={{
        padding: 'var(--space-2xl)',
        border: '2px dashed var(--border-default)',
        borderRadius: 'var(--radius-xl)',
        color: 'var(--text-muted)',
        font: 'var(--font-body)',
      }}>
        [Calendly Widget — Coming Soon]
      </div>
    </Section>
  );
}
