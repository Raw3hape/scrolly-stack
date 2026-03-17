'use client';

import dynamic from 'next/dynamic';

/**
 * ScrollyLoader — Client wrapper for the 3D scrolly experience.
 *
 * Loading placeholder matches the final layout dimensions to eliminate
 * the flash/jump when the experience loads.
 */
const ScrollyExperience = dynamic(
  () => import('@/features/scrolly-experience'),
  {
    ssr: false,
    loading: () => (
      <div
        className="layout-container"
        style={{ opacity: 0.5 }}
        aria-busy="true"
        aria-label="Loading 3D experience"
      />
    ),
  }
);

export default function ScrollyLoader() {
  return <ScrollyExperience />;
}

