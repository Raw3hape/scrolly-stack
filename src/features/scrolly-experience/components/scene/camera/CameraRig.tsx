/**
 * CameraRig — Animated Camera Controller
 *
 * Smoothly transitions the orthographic camera between hero (top-down) and
 * isometric views using per-frame lerp driven by `config.animation.camera`.
 *
 * Props:
 *   isHero — whether the camera should be in hero (top-down) position
 *
 * Must render inside `<Canvas>` (uses `useFrame`).
 */

import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { animation } from '../../../config';

export default function CameraRig({ isHero }: { isHero: boolean }) {
  useFrame((state, delta) => {
    const targetPos = isHero
      ? new THREE.Vector3(...(animation.camera.positions.hero as [number, number, number]))
      : new THREE.Vector3(...(animation.camera.positions.isometric as [number, number, number]));

    const targetUp = isHero
      ? new THREE.Vector3(...(animation.camera.upVectors.hero as [number, number, number]))
      : new THREE.Vector3(...(animation.camera.upVectors.isometric as [number, number, number]));

    state.camera.position.lerp(targetPos, delta * animation.camera.lerpSpeed);
    state.camera.up.lerp(targetUp, delta * animation.camera.lerpSpeed);
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}
