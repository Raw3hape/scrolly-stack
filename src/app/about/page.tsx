import type { Metadata } from 'next';
import Section from '@/components/Section/Section';
import PageHeader from '@/components/PageHeader/PageHeader';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'We\'re a team of roofing industry professionals who build businesses that run clean and sell at a premium.',
};

export default function AboutPage() {
  return (
    <Section width="narrow">
      <PageHeader
        title="About Us"
        description="We're a team of roofing industry professionals who build businesses that run clean and sell at a premium."
      />
      {/* Content will be added here — team cards, mission, PE-fund section */}
    </Section>
  );
}
