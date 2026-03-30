'use client';

import dynamic from 'next/dynamic';

/**
 * ScrollyLoader — Client wrapper for the 3D scrolly experience.
 *
 * Loading placeholder matches the final layout dimensions to eliminate
 * the flash/jump when the experience loads.
 *
 * VARIANT SYSTEM: Accepts variantId prop and passes it to ScrollyExperience.
 * READY SIGNAL: onReady fires when the 3D scene is fully initialized.
 */
const ScrollyExperience = dynamic(
  () => import('@/features/scrolly-experience-v2'),
  {
    ssr: false,
    loading: () => (
      <div
        className="layout-container"
        style={{ opacity: 0 }}
        aria-busy="true"
        aria-label="Loading 3D experience"
      />
    ),
  }
);

interface ScrollyLoaderProps {
  variantId?: string;
  onReady?: () => void;
  sceneReady?: boolean;
}

export default function ScrollyLoader({ variantId, onReady, sceneReady }: ScrollyLoaderProps) {
  return <ScrollyExperience variantId={variantId} onReady={onReady} sceneReady={sceneReady} />;
}
