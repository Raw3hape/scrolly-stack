import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Foundation Projects — our mission, team, and approach to taking roofing companies public.',
};

export default function AboutPage() {
  return (
    <section className="v2-section v2-section--fullscreen" style={{ textAlign: 'center' }}>
      <div className="v2-container">
        <h1 style={{ fontFamily: 'var(--font-family-serif)', marginBottom: 'var(--space-md)' }}>
          About Us
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '36rem', margin: '0 auto' }}>
          This page is currently under construction.
          We&apos;re crafting something exceptional — check back soon.
        </p>
      </div>
    </section>
  );
}
