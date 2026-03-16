import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shadow Local',
  description: 'Shadow Local program by Foundation Projects.',
};

export default function ShadowLocalPage() {
  return (
    <section className="section">
      <div className="container container--narrow">
        <h1 style={{ font: 'var(--font-h1)', marginBottom: 'var(--space-lg)' }}>Shadow Local</h1>
        <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)' }}>
          Content coming soon.
        </p>
      </div>
    </section>
  );
}
