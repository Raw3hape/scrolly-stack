/**
 * ZoomController — Smooth Zoom Animation
 *
 * ARCHITECTURE: During mosaic transition, zoom is set INSTANTLY from progress
 * (pure function, no time-lag). Hero↔Iso retains time-lerp.
 */

import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { animation, mosaic as mosaicConfig } from '../../../config';
import { smoothProgress } from '../../../utils/easings';

interface ZoomControllerProps {
  targetZoom: number;
  mosaicProgress?: number;
}

export default function ZoomController({ targetZoom, mosaicProgress = 0 }: ZoomControllerProps) {
  useFrame((state, delta) => {
    const transitionProgress = smoothProgress(
      mosaicProgress,
      mosaicConfig.motion.viewStart,
      mosaicConfig.motion.viewEnd,
    );

    if (transitionProgress > 0) {
      // INSTANT SET — pure function of scroll, no time-lag
      if (Math.abs(state.camera.zoom - targetZoom) > 0.01) {
        state.camera.zoom = targetZoom;
        state.camera.updateProjectionMatrix();
        state.invalidate();
      }
    } else {
      // Hero/Iso — frame-rate-independent damp for smooth feel
      if (Math.abs(state.camera.zoom - targetZoom) > animation.zoom.snapThreshold) {
        state.camera.zoom = THREE.MathUtils.damp(
          state.camera.zoom,
          targetZoom,
          animation.zoom.lerpSpeed,
          delta
        );
        state.camera.updateProjectionMatrix();
        state.invalidate();
      }
    }
  });

  return null;
}
