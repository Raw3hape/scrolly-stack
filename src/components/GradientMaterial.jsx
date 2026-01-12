/**
 * GradientMaterial Component
 * 
 * Custom shader material that creates smooth, glassy gradient effects.
 * Designed for soft pastel aesthetics with subtle shimmer animation.
 */

import { shaderMaterial } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════════════
// GRADIENT SHADER MATERIAL - Soft Pastel Glass Effect
// ═══════════════════════════════════════════════════════════════════════════════

const GradientShaderMaterial = shaderMaterial(
  // Uniforms
  {
    uColorA: new THREE.Color('#fce7f3'),
    uColorB: new THREE.Color('#ddd6fe'),
    uTime: 0,
    uOpacity: 0.95,
    uGlassiness: 0.3,
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
  
  // Fragment Shader - Soft Pastel Glass Effect
  `
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uTime;
    uniform float uOpacity;
    uniform float uGlassiness;
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    
    void main() {
      // Diagonal gradient based on position
      float gradientFactor = (vPosition.x + vPosition.z) * 0.3 + 0.5;
      gradientFactor = clamp(gradientFactor, 0.0, 1.0);
      
      // Subtle animated shimmer
      float shimmer = sin(uTime * 0.8 + vPosition.x * 3.0 + vPosition.z * 2.0) * 0.03;
      gradientFactor = clamp(gradientFactor + shimmer, 0.0, 1.0);
      
      // Smooth color interpolation
      vec3 gradientColor = mix(uColorA, uColorB, gradientFactor);
      
      // Soft lighting for glassy look
      vec3 lightDir = normalize(vec3(0.5, 1.0, 0.8));
      float diffuse = max(dot(vNormal, lightDir), 0.0);
      float ambient = 0.7; // High ambient for soft look
      
      vec3 litColor = gradientColor * (ambient + diffuse * 0.4);
      
      // Fresnel effect for glass edges
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.0);
      
      // Add subtle white shine on edges
      vec3 edgeGlow = vec3(1.0) * fresnel * uGlassiness * 0.5;
      
      // Soft specular highlight
      vec3 halfDir = normalize(lightDir + viewDir);
      float specular = pow(max(dot(vNormal, halfDir), 0.0), 64.0);
      vec3 specularColor = vec3(1.0) * specular * 0.2;
      
      vec3 finalColor = litColor + edgeGlow + specularColor;
      
      // Slight transparency at edges
      float alpha = uOpacity - fresnel * 0.1;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

// Extend Three.js with our custom material
extend({ GradientShaderMaterial });


// ═══════════════════════════════════════════════════════════════════════════════
// GRADIENT MATERIAL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function GradientMaterial({
  colorA = '#fce7f3',
  colorB = '#ddd6fe',
  animated = true,
  opacity = 0.95,
  glassiness = 0.3,
}) {
  const materialRef = useRef();
  
  // Convert colors to THREE.Color
  const colorAThree = useMemo(() => new THREE.Color(colorA), [colorA]);
  const colorBThree = useMemo(() => new THREE.Color(colorB), [colorB]);
  
  // Animate time uniform for subtle shimmer effect
  useFrame((state) => {
    if (materialRef.current && animated) {
      materialRef.current.uTime = state.clock.elapsedTime;
    }
  });
  
  return (
    <gradientShaderMaterial
      ref={materialRef}
      uColorA={colorAThree}
      uColorB={colorBThree}
      uOpacity={opacity}
      uGlassiness={glassiness}
      transparent={true}
      side={THREE.FrontSide}
    />
  );
}
