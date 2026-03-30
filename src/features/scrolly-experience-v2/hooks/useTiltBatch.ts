/**
 * Tilt Batch System — One raycaster per frame for all blocks
 *
 * Without batching, each Block runs its own raycaster.setFromCamera() +
 * intersectPlane() every frame — 19 identical computations.
 * This context computes the cursor world position ONCE per frame and shares it.
 */

import { createContext, useContext } from 'react';

export interface TiltBatchData {
  /** Cursor world position on the tilt plane, or null if no hit / disabled */
  cursorWorldPos: { x: number; y: number; z: number } | null;
}

/**
 * Shared mutable ref — updated once per frame by TiltBatchProvider (in Stack).
 * Blocks read from this in their own useFrame.
 * Using a mutable object (not React state) avoids re-renders.
 */
export const TiltBatchContext = createContext<TiltBatchData | null>(null);

export function useTiltBatch(): TiltBatchData {
  const ctx = useContext(TiltBatchContext);
  if (!ctx) throw new Error('useTiltBatch must be used inside TiltBatchContext.Provider');
  return ctx;
}
