import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works — For Roofers',
  description: 'See how Foundation Projects installs CRM, marketing, and ops systems to scale your roofing business.',
};

export default function HowItWorksRoofersPage() {
  return (
    <section className="section">
      <div className="container container--narrow">
        <h1 style={{ font: 'var(--font-h1)', marginBottom: 'var(--space-lg)' }}>How It Works — For Roofers</h1>
        <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)' }}>
          Discover our step-by-step process for transforming your roofing business into a scalable, sellable operation.
        </p>
      </div>
    </section>
  );
}
