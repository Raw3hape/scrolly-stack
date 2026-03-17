/**
 * ZoomController — Smooth Zoom Animation
 *
 * Per-frame lerps the camera zoom towards the target value.
 * Skips updates when delta is below `config.animation.zoom.snapThreshold`.
 *
 * Props:
 *   targetZoom — desired zoom level from useResponsiveZoom
 *
 * Must render inside `<Canvas>` (uses `useFrame`).
 */

import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { animation } from '../../../config';

export default function ZoomController({ targetZoom }: { targetZoom: number }) {
  useFrame((state, delta) => {
    if (Math.abs(state.camera.zoom - targetZoom) > animation.zoom.snapThreshold) {
      state.camera.zoom = THREE.MathUtils.lerp(
        state.camera.zoom,
        targetZoom,
        delta * animation.zoom.lerpSpeed
      );
      state.camera.updateProjectionMatrix();
      state.invalidate();
    }
  });

  return null;
}
