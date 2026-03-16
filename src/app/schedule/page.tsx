import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Schedule A Call',
  description: 'Book a free 15-minute consultation with Foundation Projects to see if you qualify.',
};

export default function SchedulePage() {
  return (
    <section className="section">
      <div className="container container--narrow" style={{ textAlign: 'center' }}>
        <h1 style={{ font: 'var(--font-h1)', marginBottom: 'var(--space-lg)' }}>Schedule A Call</h1>
        <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
          Schedule a call below or text ROOF to XXX-XXX-XXXX ANYTIME.
        </p>
        {/* Calendly embed will go here */}
        <div style={{
          padding: 'var(--space-2xl)',
          border: '2px dashed var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          color: 'var(--text-muted)',
          font: 'var(--font-body)',
        }}>
          [Calendly Widget — Coming Soon]
        </div>
      </div>
    </section>
  );
}
