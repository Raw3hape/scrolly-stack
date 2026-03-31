/**
 * CameraRig — Animated Camera Controller
 *
 * Smoothly transitions the orthographic camera between:
 * - Hero (top-down) view
 * - Isometric (scrolly stack) view
 * - Mosaic (top-down grid) view
 *
 * ARCHITECTURE: Crossfade between damped (hero↔iso) and scroll-driven
 * (iso→mosaic) positions, blended by transitionProgress.
 *
 * - At mosaicProgress=0 → 100% damped = physical feel preserved
 * - At mosaicProgress=1 → 100% scroll-driven = precise, no drift
 * - Transition is smooth — no threshold-based jump
 *
 * HEADER CENTERING: camera.lookAt targets the effective viewport center
 * below the header, not the origin. This shifts the entire view so the
 * stack appears vertically centered in the visible area.
 *
 * SYNC: Uses UNIFIED_LAMBDA (shared with ZoomController) so camera
 * and zoom move at exactly the same speed — no desync.
 *
 * PERFORMANCE: Vector3 instances are cached in refs — zero GC per frame.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, MathUtils } from 'three';
import { animation, mosaic as mosaicConfig } from '../../../config';
import { smoothProgress } from '../../../utils/easings';

/** Shared lambda — must match ZoomController for synchronized motion */
const UNIFIED_LAMBDA = 6;

interface CameraRigProps {
  isHero: boolean;
  mosaicProgress?: number;
}

export default function CameraRig({ isHero, mosaicProgress = 0 }: CameraRigProps) {
  // Damped state (persists between frames for smooth hero↔iso transitions)
  const dampedPosRef = useRef(
    new Vector3(...(animation.camera.positions.hero as [number, number, number])),
  );
  const dampedUpRef = useRef(
    new Vector3(...(animation.camera.upVectors.hero as [number, number, number])),
  );

  // Scratch vectors for intermediate calculations (no GC)
  const basePosRef = useRef(new Vector3());
  const baseUpRef = useRef(new Vector3());
  const instantPosRef = useRef(new Vector3());
  const instantUpRef = useRef(new Vector3());
  const isoPosRef = useRef(new Vector3());
  const isoUpRef = useRef(new Vector3());
  const mosaicPosRef = useRef(new Vector3());
  const mosaicUpRef = useRef(new Vector3());

  // Track previous camera position for conditional invalidate
  const prevCamPosRef = useRef(new Vector3());
  // Damped blend factor — prevents jarring direction flip when scroll reverses
  // during crossfade. The blend "catches up" to transitionProgress smoothly.
  const blendRef = useRef(0);

  useFrame((state, delta) => {
    const d = MathUtils.damp;

    const transitionProgress = smoothProgress(
      mosaicProgress,
      mosaicConfig.motion.viewStart,
      mosaicConfig.motion.viewEnd,
    );

    // Damp the blend factor so it follows scroll direction with momentum
    blendRef.current = d(blendRef.current, transitionProgress, UNIFIED_LAMBDA, delta);
    const blend = blendRef.current;

    // --- 1. Compute DAMPED position (hero↔iso, physical feel) ---
    if (isHero) {
      basePosRef.current.set(...(animation.camera.positions.hero as [number, number, number]));
      baseUpRef.current.set(...(animation.camera.upVectors.hero as [number, number, number]));
    } else {
      basePosRef.current.set(...(animation.camera.positions.isometric as [number, number, number]));
      baseUpRef.current.set(...(animation.camera.upVectors.isometric as [number, number, number]));
    }

    dampedPosRef.current.x = d(dampedPosRef.current.x, basePosRef.current.x, UNIFIED_LAMBDA, delta);
    dampedPosRef.current.y = d(dampedPosRef.current.y, basePosRef.current.y, UNIFIED_LAMBDA, delta);
    dampedPosRef.current.z = d(dampedPosRef.current.z, basePosRef.current.z, UNIFIED_LAMBDA, delta);
    dampedUpRef.current.x = d(dampedUpRef.current.x, baseUpRef.current.x, UNIFIED_LAMBDA, delta);
    dampedUpRef.current.y = d(dampedUpRef.current.y, baseUpRef.current.y, UNIFIED_LAMBDA, delta);
    dampedUpRef.current.z = d(dampedUpRef.current.z, baseUpRef.current.z, UNIFIED_LAMBDA, delta);

    // --- 2. Compute INSTANT position (iso→mosaic, scroll-driven) ---
    isoPosRef.current.set(...(animation.camera.positions.isometric as [number, number, number]));
    isoUpRef.current.set(...(animation.camera.upVectors.isometric as [number, number, number]));
    mosaicPosRef.current.set(...mosaicConfig.camera.position);
    mosaicUpRef.current.set(...mosaicConfig.camera.upVector);

    instantPosRef.current.lerpVectors(isoPosRef.current, mosaicPosRef.current, blend);
    instantUpRef.current.lerpVectors(isoUpRef.current, mosaicUpRef.current, blend);

    // --- 3. CROSSFADE: blend damped ↔ instant by damped blend factor ---
    // Using damped blend instead of raw transitionProgress prevents jarring
    // direction flips when scroll reverses during the crossfade.
    state.camera.position.lerpVectors(dampedPosRef.current, instantPosRef.current, blend);
    state.camera.up.lerpVectors(dampedUpRef.current, instantUpRef.current, blend);

    // --- 4. LOOK AT ORIGIN ---
    state.camera.lookAt(0, 0, 0);

    // --- 5. CONDITIONAL INVALIDATE ---
    // Only re-render if camera actually moved. When damping settles,
    // WebGL goes idle = massive GPU savings during static hero view.
    const camPos = state.camera.position;
    const dx = camPos.x - prevCamPosRef.current.x;
    const dy = camPos.y - prevCamPosRef.current.y;
    const dz = camPos.z - prevCamPosRef.current.z;
    if (dx * dx + dy * dy + dz * dz > 1e-8) {
      state.invalidate();
    }
    prevCamPosRef.current.copy(camPos);
  });

  return null;
}
