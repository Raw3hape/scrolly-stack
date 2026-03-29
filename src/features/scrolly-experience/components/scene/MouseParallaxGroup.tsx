/**
 * MouseParallaxGroup — Subtle Mouse-Driven Rotation
 *
 * ARCHITECTURE: Keeps parallax strongest in the hero state, tones it down in
 * the stack, and fades it out early in the mosaic morph.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import type { Group } from 'three';
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
  const groupRef = useRef<Group>(null);
  const currentRotation = useRef({ x: 0, y: 0 });

  // Detect touch device once (no mouse → no parallax needed)
  const isTouchRef = useRef(
    typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  );

  useFrame((state, delta) => {
    if (!groupRef.current || !mouseRef.current) return;

    // Touch devices: skip parallax entirely — zero GPU cost
    if (isTouchRef.current) return;

    const fadeOut = smoothProgress(
      mosaicProgress,
      0,
      mosaicConfig.motion.parallaxFadeEnd,
    );
    const stackMultiplier = isHero ? 1 : animation.parallax.stackIntensityMultiplier;
    const intensity = animation.parallax.intensity * stackMultiplier * (1 - fadeOut);

    const targetX = -mouseRef.current.y * intensity;
    const targetY = mouseRef.current.x * intensity;

    currentRotation.current.x = MathUtils.damp(
      currentRotation.current.x,
      targetX,
      animation.parallax.damping,
      delta,
    );
    currentRotation.current.y = MathUtils.damp(
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

    // Only invalidate if rotation is non-zero (settled → no re-render)
    if (Math.abs(currentRotation.current.x) > 1e-5 || Math.abs(currentRotation.current.y) > 1e-5) {
      state.invalidate();
    }
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
}
