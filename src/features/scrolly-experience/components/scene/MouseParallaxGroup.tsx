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

  useFrame(() => {
    if (!groupRef.current || !mouseRef.current) return;

    const targetX = -mouseRef.current.y * animation.parallax.intensity;
    const targetY = mouseRef.current.x * animation.parallax.intensity;

    currentRotation.current.x += (targetX - currentRotation.current.x) * animation.parallax.lerpSpeed;
    currentRotation.current.y += (targetY - currentRotation.current.y) * animation.parallax.lerpSpeed;

    groupRef.current.rotation.x = currentRotation.current.x;
    groupRef.current.rotation.y = currentRotation.current.y;
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
}
