import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '3B Opt-In',
  description: '3B Opt-In program by Foundation Projects.',
};

export default function ThreeBOptInPage() {
  return (
    <section className="section">
      <div className="container container--narrow">
        <h1 style={{ font: 'var(--font-h1)', marginBottom: 'var(--space-lg)' }}>3B Opt-In</h1>
        <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)' }}>
          Content coming soon.
        </p>
      </div>
    </section>
  );
}
