/**
 * GlowGradientMaterial Component
 * 
 * Custom shader material with:
 * - Visible gradient across the surface (not just blended)
 * - White rim/edge glow via Fresnel effect
 * - Emissive for inner glow feel
 * - Lightweight and performant
 */

import { shaderMaterial } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════════════
// GLOW GRADIENT SHADER
// ═══════════════════════════════════════════════════════════════════════════════

const GlowGradientShaderMaterial = shaderMaterial(
  {
    uColorA: new THREE.Color('#f9a8d4'),
    uColorB: new THREE.Color('#fce7f3'),
    uTime: 0,
    uRimPower: 2.5,
    uRimIntensity: 0.4,
    uEmissiveIntensity: 0.15,
    uIsActive: 0.0,
  },
  
  // Vertex Shader
  `
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    
    void main() {
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  
  // Fragment Shader
  `
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uTime;
    uniform float uRimPower;
    uniform float uRimIntensity;
    uniform float uEmissiveIntensity;
    uniform float uIsActive;
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    
    void main() {
      // ═══════════════════════════════════════════════════════════════════════
      // SOFT DIAGONAL GRADIENT (subtle transition)
      // ═══════════════════════════════════════════════════════════════════════
      
      // Create gradient based on position (diagonal from corner to corner)
      float gradientFactor = (vPosition.x + vPosition.z + 1.5) * 0.25;
      gradientFactor = clamp(gradientFactor, 0.0, 1.0);
      
      // Very subtle animation (slower, more subtle)
      float shimmer = sin(uTime * 0.3 + vPosition.x * 1.5) * 0.015;
      gradientFactor = clamp(gradientFactor + shimmer, 0.0, 1.0);
      
      // Mix colors with soft gradient - use smoothstep for softer blend
      float smoothGradient = smoothstep(0.0, 1.0, gradientFactor);
      vec3 gradientColor = mix(uColorA, uColorB, smoothGradient);
      
      // ═══════════════════════════════════════════════════════════════════════
      // DEEP INNER SHADOWS (simulated ambient occlusion)
      // ═══════════════════════════════════════════════════════════════════════
      
      // Darker on sides (based on normal direction)
      float sideShade = 1.0 - abs(vNormal.x) * 0.25 - abs(vNormal.z) * 0.15;
      
      // Darker towards bottom edges
      float bottomShade = mix(0.7, 1.0, smoothstep(-0.5, 0.5, vNormal.y));
      
      // Edge darkening (pseudo-AO)
      float edgeDarken = 1.0 - pow(1.0 - abs(vUv.x - 0.5) * 2.0, 2.0) * 0.12;
      edgeDarken *= 1.0 - pow(1.0 - abs(vUv.y - 0.5) * 2.0, 2.0) * 0.12;
      
      float innerShadow = sideShade * bottomShade * edgeDarken;
      
      // ═══════════════════════════════════════════════════════════════════════
      // FRESNEL RIM GLOW (soft white edges)
      // ═══════════════════════════════════════════════════════════════════════
      
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), uRimPower);
      
      // Soft white glow on edges (reduced intensity for pastel look)
      vec3 rimColor = vec3(1.0, 1.0, 1.0) * fresnel * uRimIntensity * 0.7;
      
      // ═══════════════════════════════════════════════════════════════════════
      // SOFT LIGHTING
      // ═══════════════════════════════════════════════════════════════════════
      
      vec3 lightDir1 = normalize(vec3(0.5, 1.0, 0.5));
      vec3 lightDir2 = normalize(vec3(-0.3, 0.8, -0.3));
      
      float diffuse1 = max(dot(vNormal, lightDir1), 0.0);
      float diffuse2 = max(dot(vNormal, lightDir2), 0.0) * 0.4;
      
      // Higher ambient for softer look
      float ambient = 0.55;
      float lighting = ambient + diffuse1 * 0.35 + diffuse2 * 0.15;
      
      // ═══════════════════════════════════════════════════════════════════════
      // SUBTLE INNER GLOW (reduced for pastel aesthetic)
      // ═══════════════════════════════════════════════════════════════════════
      
      // Use lighter color for subtle glow
      vec3 emissive = mix(uColorA, vec3(1.0), 0.3);
      float emissivePulse = uEmissiveIntensity * 0.5 + sin(uTime * 0.5) * 0.01;
      
      // Slight boost when active
      emissivePulse += uIsActive * 0.04;
      
      // ═══════════════════════════════════════════════════════════════════════
      // FINAL COLOR with inner shadows
      // ═══════════════════════════════════════════════════════════════════════
      
      vec3 litColor = gradientColor * lighting * innerShadow;
      vec3 finalColor = litColor + rimColor + (emissive * emissivePulse);
      
      // Soft clamp to prevent overexposure while keeping softness
      finalColor = min(finalColor, vec3(0.98));
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

extend({ GlowGradientShaderMaterial });


// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function GlowGradientMaterial({
  colorA = '#f9a8d4',
  colorB = '#fce7f3',
  isActive = false,
  rimPower = 2.5,
  rimIntensity = 0.4,
  emissiveIntensity = 0.15,
}) {
  const materialRef = useRef();
  
  const colorAThree = useMemo(() => new THREE.Color(colorA), [colorA]);
  const colorBThree = useMemo(() => new THREE.Color(colorB), [colorB]);
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
      materialRef.current.uIsActive = isActive ? 1.0 : 0.0;
    }
  });
  
  return (
    <glowGradientShaderMaterial
      ref={materialRef}
      uColorA={colorAThree}
      uColorB={colorBThree}
      uRimPower={rimPower}
      uRimIntensity={rimIntensity}
      uEmissiveIntensity={emissiveIntensity}
    />
  );
}
