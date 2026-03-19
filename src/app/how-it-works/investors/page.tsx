import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works — Investors',
  description: 'Learn how Foundation Projects creates institutional-grade returns for investors through roofing industry consolidation.',
};

export default function HowItWorksInvestorsPage() {
  return (
    <section className="v2-section v2-section--fullscreen" style={{ textAlign: 'center' }}>
      <div className="v2-container">
        <h1 style={{ fontFamily: 'var(--font-family-serif)', marginBottom: 'var(--space-md)' }}>
          How It Works — Investors
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '36rem', margin: '0 auto' }}>
          This page is currently under construction.
          We&apos;re crafting something exceptional — check back soon.
        </p>
      </div>
    </section>
  );
}
