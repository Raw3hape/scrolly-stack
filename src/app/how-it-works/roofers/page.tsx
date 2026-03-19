import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works — Roofers',
  description: 'Discover how Foundation Projects helps roofing company owners achieve a premium exit through our public-market strategy.',
};

export default function HowItWorksRoofersPage() {
  return (
    <section className="v2-section v2-section--fullscreen" style={{ textAlign: 'center' }}>
      <div className="v2-container">
        <h1 style={{ fontFamily: 'var(--font-family-serif)', marginBottom: 'var(--space-md)' }}>
          How It Works — Roofers
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '36rem', margin: '0 auto' }}>
          This page is currently under construction.
          We&apos;re crafting something exceptional — check back soon.
        </p>
      </div>
    </section>
  );
}
