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
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-family)',
        }}
      >
        Loading experience...
      </div>
    ),
  }
);

export default function HomePage() {
  return (
    <>
      {/* Section 1: Interactive 3D scrollytelling experience */}
      <ScrollyExperience />

      {/* 
        Section 2+: Standard marketing sections (server components)
        Add sections here: social proof, testimonials, FAQ, etc.
      */}
    </>
  );
}
