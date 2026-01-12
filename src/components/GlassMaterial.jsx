/**
 * GlassMaterial Component
 * 
 * Premium glass material using MeshPhysicalMaterial with:
 * - Transmission for see-through glass effect
 * - Thickness for light refraction
 * - Iridescence for rainbow reflections
 * - Gradient color tinting
 * 
 * Optimized for performance while achieving premium aesthetics.
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function GlassMaterial({
  colorA = '#fce7f3',
  colorB = '#fbcfe8',
  isActive = false,
  // Glass properties
  transmission = 0.4,      // How see-through (0-1)
  thickness = 0.8,         // Refraction depth
  roughness = 0.15,        // Surface smoothness
  ior = 1.45,              // Index of refraction (glass = 1.5)
  // Iridescence (rainbow effect)
  iridescence = 0.3,
  iridescenceIOR = 1.3,
  // Glow properties
  emissiveIntensity = 0.08,
}) {
  const materialRef = useRef();
  
  // Blend the two colors for the base
  const blendedColor = useMemo(() => {
    const colorAObj = new THREE.Color(colorA);
    const colorBObj = new THREE.Color(colorB);
    return colorAObj.lerp(colorBObj, 0.5);
  }, [colorA, colorB]);
  
  // Slight emissive for inner glow effect
  const emissiveColor = useMemo(() => {
    const color = new THREE.Color(colorA);
    color.multiplyScalar(0.5); // Darker version for subtle glow
    return color;
  }, [colorA]);
  
  // Subtle animation for shimmer effect
  useFrame((state) => {
    if (materialRef.current) {
      // Animate iridescence slightly for living effect
      const time = state.clock.elapsedTime;
      materialRef.current.iridescence = iridescence + Math.sin(time * 0.5) * 0.05;
      
      // Subtle emissive pulse
      materialRef.current.emissiveIntensity = emissiveIntensity + Math.sin(time * 0.8) * 0.02;
    }
  });
  
  // Adjust properties when active
  const activeTransmission = isActive ? transmission * 0.7 : transmission;
  const activeEmissive = isActive ? emissiveIntensity * 1.5 : emissiveIntensity;
  const activeRoughness = isActive ? roughness * 0.5 : roughness;
  
  return (
    <meshPhysicalMaterial
      ref={materialRef}
      color={blendedColor}
      
      // Glass properties
      transmission={activeTransmission}
      thickness={thickness}
      roughness={activeRoughness}
      ior={ior}
      
      // Reflectivity
      metalness={0.0}
      reflectivity={0.5}
      
      // Iridescence for rainbow shimmer
      iridescence={iridescence}
      iridescenceIOR={iridescenceIOR}
      iridescenceThicknessRange={[100, 400]}
      
      // Inner glow via emissive
      emissive={emissiveColor}
      emissiveIntensity={activeEmissive}
      
      // Sheen for soft highlights
      sheen={0.3}
      sheenRoughness={0.4}
      sheenColor={new THREE.Color('#ffffff')}
      
      // Clearcoat for extra glossy layer
      clearcoat={0.3}
      clearcoatRoughness={0.2}
      
      // Make transparent
      transparent={true}
      opacity={0.95}
      
      // Enable for proper transparency
      depthWrite={true}
      side={THREE.FrontSide}
    />
  );
}
