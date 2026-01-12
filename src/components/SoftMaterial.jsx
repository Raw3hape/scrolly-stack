/**
 * SoftMaterial Component
 * 
 * Lightweight material with fake glow effect via emissive.
 * No real transparency - much better performance!
 * Uses gradient colors with subtle inner light simulation.
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function SoftMaterial({
  colorA = '#fce7f3',
  colorB = '#fbcfe8',
  isActive = false,
}) {
  const materialRef = useRef();
  
  // Blend the two colors for the base
  const blendedColor = useMemo(() => {
    const colorAObj = new THREE.Color(colorA);
    const colorBObj = new THREE.Color(colorB);
    return colorAObj.lerp(colorBObj, 0.5);
  }, [colorA, colorB]);
  
  // Emissive for subtle inner glow - use lighter version of base color
  const emissiveColor = useMemo(() => {
    const color = new THREE.Color(colorA);
    // Make it brighter for glow effect
    color.lerp(new THREE.Color('#ffffff'), 0.3);
    return color;
  }, [colorA]);
  
  // Subtle shimmer animation - reduced for pastel look
  useFrame((state) => {
    if (materialRef.current) {
      const time = state.clock.elapsedTime;
      // Very subtle emissive pulse for "living" effect - softer for pastels
      const pulse = Math.sin(time * 0.4) * 0.01 + 0.05;
      materialRef.current.emissiveIntensity = isActive ? pulse + 0.02 : pulse;
    }
  });
  
  return (
    <meshStandardMaterial
      ref={materialRef}
      color={blendedColor}
      
      // Slightly more matte for soft pastel look
      roughness={isActive ? 0.35 : 0.45}
      metalness={0.02}
      
      // Subtle inner glow via emissive - reduced for pastels
      emissive={emissiveColor}
      emissiveIntensity={isActive ? 0.08 : 0.05}
      
      // No transparency - solid and performant
      transparent={false}
      
      // Reduced reflections for softer appearance
      envMapIntensity={0.25}
    />
  );
}
