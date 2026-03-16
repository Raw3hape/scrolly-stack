import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works — For Investors',
  description: 'Learn how Foundation Projects builds value in roofing businesses for PE firms and investors.',
};

export default function HowItWorksInvestorsPage() {
  return (
    <section className="section">
      <div className="container container--narrow">
        <h1 style={{ font: 'var(--font-h1)', marginBottom: 'var(--space-lg)' }}>How It Works — For Investors</h1>
        <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)' }}>
          See how we install operational systems that increase roofing company valuations for PE-backed portfolios.
        </p>
      </div>
    </section>
  );
}
