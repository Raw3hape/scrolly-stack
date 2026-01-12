/**
 * VibrantMaterial Component
 * 
 * Uses meshStandardMaterial for REAL shadow support between layers.
 * Saturated colors with emissive glow.
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function VibrantMaterial({
  colorA = '#f9a8d4',
  isActive = false,
}) {
  const materialRef = useRef();
  
  // Use colorA directly for saturated colors (no blending!)
  const mainColor = useMemo(() => new THREE.Color(colorA), [colorA]);
  
  // Emissive color for inner glow - slightly lighter
  const emissiveColor = useMemo(() => {
    const color = new THREE.Color(colorA);
    color.lerp(new THREE.Color('#ffffff'), 0.2);
    return color;
  }, [colorA]);
  
  // Animate emissive for subtle glow effect
  useFrame((state) => {
    if (materialRef.current) {
      const time = state.clock.elapsedTime;
      // Subtle pulse
      const pulse = Math.sin(time * 0.6) * 0.02 + 0.08;
      materialRef.current.emissiveIntensity = isActive ? pulse + 0.04 : pulse;
    }
  });
  
  return (
    <meshStandardMaterial
      ref={materialRef}
      color={mainColor}
      
      // Material properties - slightly glossy
      roughness={isActive ? 0.2 : 0.3}
      metalness={0.02}
      
      // Emissive for inner glow effect
      emissive={emissiveColor}
      emissiveIntensity={isActive ? 0.1 : 0.06}
      
      // Environment reflections
      envMapIntensity={0.4}
    />
  );
}
