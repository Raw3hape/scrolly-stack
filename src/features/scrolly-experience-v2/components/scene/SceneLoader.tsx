/**
 * SceneLoader — 3D Loading Indicator
 *
 * Shows loading progress while 3D assets are loaded via `<Suspense>`.
 * Uses the shared `Spinner` component instead of inline styles.
 *
 * Must render inside `<Canvas>` (uses `useProgress` from drei and `<Html>`).
 */

import { useProgress, Html } from '@react-three/drei';
import Spinner from '@/components/Spinner/Spinner';

export default function SceneLoader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <Spinner size={48} label={`Loading 3D... ${progress.toFixed(0)}%`} />
    </Html>
  );
}
