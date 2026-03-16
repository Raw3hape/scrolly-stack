'use client';

import dynamic from 'next/dynamic';
import Spinner from '@/components/Spinner/Spinner';

/**
 * ScrollyLoader — Client wrapper for the 3D scrolly experience.
 *
 * This wrapper exists because `dynamic({ ssr: false })` is only allowed
 * in Client Components. The parent page.tsx stays a Server Component.
 */
const ScrollyExperience = dynamic(
  () => import('@/features/scrolly-experience'),
  {
    ssr: false,
    loading: () => (
      <div style={{ minHeight: '100vh' }}>
        <Spinner size={40} label="Loading experience..." />
      </div>
    ),
  }
);

export default function ScrollyLoader() {
  return <ScrollyExperience />;
}
