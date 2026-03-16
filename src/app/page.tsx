'use client';

import dynamic from 'next/dynamic';

/**
 * HomePage — Foundation Projects
 *
 * The 3D scrollytelling experience is loaded client-side only (no SSR).
 * Additional marketing sections can be added below as server components.
 */
const ScrollyExperience = dynamic(
  () => import('@/features/scrolly-experience'),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-family)',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--border-muted, #e2e8f0)',
            borderTopColor: 'var(--brand-primary, #8b5cf6)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <p style={{ fontSize: '0.875rem' }}>Loading experience...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    ),
  }
);

export default function HomePage() {
  return (
    <>
      {/* Section 1: Interactive 3D scrollytelling experience */}
      <ScrollyExperience />

      {/* Fallback hero for no-JS / search engine crawlers */}
      <noscript>
        <section style={{ padding: '4rem 2rem', maxWidth: '600px' }}>
          <h1>Build a roofing business that runs clean—and sells at a premium.</h1>
          <p>
            We install CRM + marketing systems, drive efficiency savings,
            and prepare you for an institutional-quality exit.
          </p>
          <a href="https://google.com">See if I qualify →</a>
        </section>
      </noscript>

      {/*
        Section 2+: Standard marketing sections (server components)
        Add sections here: social proof, testimonials, FAQ, etc.
      */}
    </>
  );
}
