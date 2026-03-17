/**
 * CameraRig — Animated Camera Controller
 *
 * Smoothly transitions the orthographic camera between:
 * - Hero (top-down) view
 * - Isometric (scrolly stack) view
 * - Mosaic (top-down grid) view
 *
 * ARCHITECTURE: During mosaic transition, camera position is set INSTANTLY
 * from mosaicProgress (pure function, no time-lag). Stop scrolling = camera stops.
 * Hero↔Iso transition retains time-lerp for smooth feel.
 *
 * PERFORMANCE: Vector3 instances are cached in refs — zero GC per frame.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { animation, mosaic as mosaicConfig } from '../../../config';
import { smoothProgress } from '../../../utils/easings';

interface CameraRigProps {
  isHero: boolean;
  mosaicProgress?: number;
}

export default function CameraRig({ isHero, mosaicProgress = 0 }: CameraRigProps) {
  const targetPosRef = useRef(new THREE.Vector3());
  const targetUpRef = useRef(new THREE.Vector3());
  const isoPosRef = useRef(new THREE.Vector3());
  const isoUpRef = useRef(new THREE.Vector3());
  const mosaicPosRef = useRef(new THREE.Vector3());
  const mosaicUpRef = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const targetPos = targetPosRef.current;
    const targetUp = targetUpRef.current;
    const transitionProgress = smoothProgress(
      mosaicProgress,
      mosaicConfig.motion.viewStart,
      mosaicConfig.motion.viewEnd,
    );

    if (transitionProgress > 0) {
      // Interpolate from isometric → mosaic top-down based on mosaicProgress
      isoPosRef.current.set(...(animation.camera.positions.isometric as [number, number, number]));
      isoUpRef.current.set(...(animation.camera.upVectors.isometric as [number, number, number]));
      mosaicPosRef.current.set(...mosaicConfig.camera.position);
      mosaicUpRef.current.set(...mosaicConfig.camera.upVector);

      targetPos.lerpVectors(isoPosRef.current, mosaicPosRef.current, transitionProgress);
      targetUp.lerpVectors(isoUpRef.current, mosaicUpRef.current, transitionProgress);

      // INSTANT SET — pure function of scroll, no time-lag
      // Stop scrolling = camera stops immediately
      state.camera.position.copy(targetPos);
      state.camera.up.copy(targetUp);
      state.camera.lookAt(0, 0, 0);
      state.invalidate();
    } else {
      // Hero / Isometric — frame-rate-independent damp for smooth feel
      if (isHero) {
        targetPos.set(...(animation.camera.positions.hero as [number, number, number]));
        targetUp.set(...(animation.camera.upVectors.hero as [number, number, number]));
      } else {
        targetPos.set(...(animation.camera.positions.isometric as [number, number, number]));
        targetUp.set(...(animation.camera.upVectors.isometric as [number, number, number]));
      }

      const lambda = animation.camera.lerpSpeed;
      const posDelta = state.camera.position.distanceTo(targetPos);
      const upDelta = state.camera.up.distanceTo(targetUp);

      if (posDelta > 0.05 || upDelta > 0.05) {
        const d = THREE.MathUtils.damp;
        state.camera.position.x = d(state.camera.position.x, targetPos.x, lambda, delta);
        state.camera.position.y = d(state.camera.position.y, targetPos.y, lambda, delta);
        state.camera.position.z = d(state.camera.position.z, targetPos.z, lambda, delta);
        state.camera.up.x = d(state.camera.up.x, targetUp.x, lambda, delta);
        state.camera.up.y = d(state.camera.up.y, targetUp.y, lambda, delta);
        state.camera.up.z = d(state.camera.up.z, targetUp.z, lambda, delta);
        state.camera.lookAt(0, 0, 0);
        state.invalidate();
      }
    }
  });

  return null;
}
