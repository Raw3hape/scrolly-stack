/**
 * ZoomController — Smooth Zoom Animation
 *
 * ARCHITECTURE: Crossfade between damped (hero↔iso) and scroll-driven
 * (mosaic) zoom. Uses UNIFIED_LAMBDA shared with CameraRig for
 * perfectly synchronized camera + zoom motion.
 *
 * - At mosaicProgress=0 → 100% damped zoom (physical feel)
 * - At mosaicProgress=1 → 100% target zoom (scroll-driven)
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import { mosaic as mosaicConfig } from '../../../config';
import { lerp, smoothProgress } from '../../../utils/easings';

/** Must match CameraRig.UNIFIED_LAMBDA for synchronized motion */
const UNIFIED_LAMBDA = 4;

interface ZoomControllerProps {
  targetZoom: number;
  mosaicProgress?: number;
}

export default function ZoomController({ targetZoom, mosaicProgress = 0 }: ZoomControllerProps) {
  const dampedZoomRef = useRef(targetZoom);

  useFrame((state, delta) => {
    const transitionProgress = smoothProgress(
      mosaicProgress,
      mosaicConfig.motion.viewStart,
      mosaicConfig.motion.viewEnd,
    );

    // 1. Always compute damped zoom (frame-rate independent damp)
    dampedZoomRef.current = MathUtils.damp(
      dampedZoomRef.current,
      targetZoom,
      UNIFIED_LAMBDA,
      delta,
    );

    // 2. Crossfade: damped → target by transitionProgress
    const finalZoom = lerp(dampedZoomRef.current, targetZoom, transitionProgress);

    if (Math.abs(state.camera.zoom - finalZoom) > 0.01) {
      state.camera.zoom = finalZoom;
      state.camera.updateProjectionMatrix();
      state.invalidate();
    }
  });

  return null;
}
