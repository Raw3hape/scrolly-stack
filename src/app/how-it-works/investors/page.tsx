import type { Metadata } from 'next';
import Section from '@/components/Section/Section';
import PageHeader from '@/components/PageHeader/PageHeader';

export const metadata: Metadata = {
  title: 'How It Works — For Investors',
  description: 'Learn how Foundation Projects builds value in roofing businesses for PE firms and investors.',
};

export default function HowItWorksInvestorsPage() {
  return (
    <Section width="narrow">
      <PageHeader
        title="How It Works — For Investors"
        description="See how we install operational systems that increase roofing company valuations for PE-backed portfolios."
      />
    </Section>
  );
}
