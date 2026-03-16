import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'We\'re a team of roofing industry professionals who build businesses that run clean and sell at a premium.',
};

export default function AboutPage() {
  return (
    <section className="section">
      <div className="container container--narrow">
        <h1 style={{ font: 'var(--font-h1)', marginBottom: 'var(--space-lg)' }}>About Us</h1>
        <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)' }}>
          We&apos;re a team of roofing industry professionals who build businesses that run clean and sell at a premium.
        </p>
        {/* Content will be added here — team cards, mission, PE-fund section */}
      </div>
    </section>
  );
}
