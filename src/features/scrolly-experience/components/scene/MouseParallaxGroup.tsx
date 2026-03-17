/**
 * MouseParallaxGroup — Subtle Mouse-Driven Rotation
 *
 * ARCHITECTURE: Keeps parallax strongest in the hero state, tones it down in
 * the stack, and fades it out early in the mosaic morph.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { animation, mosaic as mosaicConfig } from '../../config';
import { smoothProgress } from '../../utils/easings';

export interface MouseParallaxGroupProps {
  children: React.ReactNode;
  mouseRef: React.RefObject<{ x: number; y: number }>;
  isHero?: boolean;
  /** Continuous 0→1 progress for smooth fadeout (replaces binary disabled) */
  mosaicProgress?: number;
}

export default function MouseParallaxGroup({
  children,
  mouseRef,
  isHero = false,
  mosaicProgress = 0,
}: MouseParallaxGroupProps) {
  const groupRef = useRef<THREE.Group>(null);
  const currentRotation = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!groupRef.current || !mouseRef.current) return;

    const fadeOut = smoothProgress(
      mosaicProgress,
      0,
      mosaicConfig.motion.parallaxFadeEnd,
    );
    const stackMultiplier = isHero ? 1 : animation.parallax.stackIntensityMultiplier;
    const intensity = animation.parallax.intensity * stackMultiplier * (1 - fadeOut);

    const targetX = -mouseRef.current.y * intensity;
    const targetY = mouseRef.current.x * intensity;

    currentRotation.current.x = THREE.MathUtils.damp(
      currentRotation.current.x,
      targetX,
      animation.parallax.damping,
      delta,
    );
    currentRotation.current.y = THREE.MathUtils.damp(
      currentRotation.current.y,
      targetY,
      animation.parallax.damping,
      delta,
    );

    if (Math.abs(currentRotation.current.x) < 0.0001 && Math.abs(targetX) < 0.0001) {
      currentRotation.current.x = 0;
    }

    if (Math.abs(currentRotation.current.y) < 0.0001 && Math.abs(targetY) < 0.0001) {
      currentRotation.current.y = 0;
    }

    groupRef.current.rotation.x = currentRotation.current.x;
    groupRef.current.rotation.y = currentRotation.current.y;
    state.invalidate();
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
}
