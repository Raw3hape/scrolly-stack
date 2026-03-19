import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Schedule A Call',
  description: 'Book a free 15-minute strategy call with Foundation Projects to discuss your roofing company exit.',
};

export default function SchedulePage() {
  return (
    <section className="v2-section v2-section--fullscreen" style={{ textAlign: 'center' }}>
      <div className="v2-container">
        <h1 style={{ fontFamily: 'var(--font-family-serif)', marginBottom: 'var(--space-md)' }}>
          Schedule A Call
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '36rem', margin: '0 auto' }}>
          This page is currently under construction.
          We&apos;re crafting something exceptional — check back soon.
        </p>
      </div>
    </section>
  );
}
