/**
 * MouseParallaxGroup — Subtle Mouse-Driven Rotation
 *
 * Wraps children in a `<group>` that rotates slightly based on mouse position.
 * Uses `useRef` + `useFrame` for zero-rerender performance.
 *
 * Props:
 *   mouseRef — ref containing normalised mouse coords { x: -1..1, y: -1..1 }
 *   children — R3F elements to rotate
 *
 * Must render inside `<Canvas>` (uses `useFrame`).
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { animation } from '../../config';

export interface MouseParallaxGroupProps {
  children: React.ReactNode;
  mouseRef: React.RefObject<{ x: number; y: number }>;
}

export default function MouseParallaxGroup({ children, mouseRef }: MouseParallaxGroupProps) {
  const groupRef = useRef<THREE.Group>(null);
  const currentRotation = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!groupRef.current || !mouseRef.current) return;

    const targetX = -mouseRef.current.y * animation.parallax.intensity;
    const targetY = mouseRef.current.x * animation.parallax.intensity;

    const dx = targetX - currentRotation.current.x;
    const dy = targetY - currentRotation.current.y;

    if (Math.abs(dx) > 0.0001 || Math.abs(dy) > 0.0001) {
      currentRotation.current.x += dx * animation.parallax.lerpSpeed;
      currentRotation.current.y += dy * animation.parallax.lerpSpeed;

      groupRef.current.rotation.x = currentRotation.current.x;
      groupRef.current.rotation.y = currentRotation.current.y;

      state.invalidate();
    }
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
}
