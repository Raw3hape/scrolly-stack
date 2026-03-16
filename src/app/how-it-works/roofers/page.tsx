import type { Metadata } from 'next';
import Section from '@/components/Section/Section';
import PageHeader from '@/components/PageHeader/PageHeader';

export const metadata: Metadata = {
  title: 'How It Works — For Roofers',
  description: 'See how Foundation Projects installs CRM, marketing, and ops systems to scale your roofing business.',
};

export default function HowItWorksRoofersPage() {
  return (
    <Section width="narrow">
      <PageHeader
        title="How It Works — For Roofers"
        description="Discover our step-by-step process for transforming your roofing business into a scalable, sellable operation."
      />
    </Section>
  );
}
