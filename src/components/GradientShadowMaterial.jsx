/**
 * GradientShadowMaterial Component
 * 
 * CLEAN PASTEL version - subtle linear gradient, minimal effects
 * Inspired by frosted glass reference with pure, airy pastels
 */

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { animation } from '../config';

let materialVersion = 0;

export default function GradientShadowMaterial({
  colorA = '#f9a8d4',
  colorB = '#fce7f3',
  isActive = false,
  isHovered = false,
  isHeroState = false,  // NEW: hero state for saturated colors
  animatedColorReveal = null,  // react-spring animated value: 0=white, 1=real colors
}) {
  const shaderRef = useRef(null);
  const materialRef = useRef(null);
  // Smooth hover transition refs
  const currentHoverRef = useRef(0);
  const targetHoverRef = useRef(0);
  // Smooth saturation transition refs
  const currentSaturationRef = useRef(1.0);
  
  const materialKey = useMemo(() => {
    materialVersion++;
    return `mat-${colorA}-${colorB}-${materialVersion}`;
  }, [colorA, colorB]);
  
  const material = useMemo(() => {
    const colA = new THREE.Color(colorA);
    const colB = new THREE.Color(colorB);
    
    const mat = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: isActive ? 0.25 : 0.35,
      metalness: 0.0,
      envMapIntensity: 0.3,
    });
    
    mat.customProgramCacheKey = () => materialKey;
    
    mat.onBeforeCompile = (shader) => {
      shaderRef.current = shader;
      
      shader.uniforms.uColorA = { value: colA };
      shader.uniforms.uColorB = { value: colB };
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uIsHovered = { value: 0.0 };
      shader.uniforms.uColorReveal = { value: 1.0 };  // 0=white, 1=real colors
      shader.uniforms.uSaturationBoost = { value: 1.0 };  // 1.0=normal, >1=saturated (hero)
      
      // Vertex shader
      shader.vertexShader = shader.vertexShader.replace(
        'void main() {',
        `
        varying vec3 vLocalPos;
        varying vec3 vLocalNorm;
        void main() {
          vLocalPos = position;
          vLocalNorm = normal;
        `
      );
      
      // Fragment shader
      shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform float uTime;
        uniform float uColorReveal;
        uniform float uIsHovered;
        uniform float uSaturationBoost;
        varying vec3 vLocalPos;
        varying vec3 vLocalNorm;
        
        // Helper function to boost saturation
        vec3 adjustSaturation(vec3 color, float saturation) {
          float grey = dot(color, vec3(0.2126, 0.7152, 0.0722));
          return mix(vec3(grey), color, saturation);
        }
        
        void main() {
        `
      );
      
      // SIMPLE, CLEAN gradient - no aggressive effects
      shader.fragmentShader = shader.fragmentShader.replace(
        'vec4 diffuseColor = vec4( diffuse, opacity );',
        `
        // ═══════════════════════════════════════════════════════════════════
        // INVERTED DIAGONAL GRADIENT - saturated color faces camera
        // ═══════════════════════════════════════════════════════════════════
        
        // INVERTED: now colorA (saturated) is on camera-facing side
        float gradientMix = 1.0 - (vLocalPos.x + vLocalPos.z + 4.0) * 0.18;
        gradientMix = clamp(gradientMix, 0.0, 1.0);
        
        // Depth gradient also inverted
        float depthMix = 1.0 - (vLocalPos.z + 3.5) * 0.15;
        depthMix = clamp(depthMix, 0.0, 0.3);
        
        gradientMix = clamp(gradientMix - depthMix * 0.3, 0.0, 1.0);
        
        // Gentle shimmer
        float shimmer = sin(uTime * 0.3 + vLocalPos.x * 0.6) * 0.03;
        gradientMix = clamp(gradientMix + shimmer, 0.0, 1.0);
        
        // Smooth blend
        gradientMix = smoothstep(0.0, 1.0, gradientMix);
        
        // Mix colors: A (lighter) → B (richer)
        vec3 baseColor = mix(uColorA, uColorB, gradientMix);
        
        // ═══════════════════════════════════════════════════════════════════
        // SUBTLE FACE SHADING (sides slightly darker)
        // ═══════════════════════════════════════════════════════════════════
        
        float isTop = smoothstep(0.7, 1.0, vLocalNorm.y);
        
        // Sides: slightly darker (15%) and pushed toward colorB
        float sideFactor = 1.0 - isTop;
        baseColor = mix(baseColor, uColorB, sideFactor * 0.15); // Push to richer color
        baseColor *= (1.0 - sideFactor * 0.08); // Subtle darken
        
        // Gentle normal-based variation
        float normalShade = 1.0 - abs(vLocalNorm.x) * 0.05 - abs(vLocalNorm.z) * 0.03;
        baseColor *= normalShade;
        
        // ═══════════════════════════════════════════════════════════════════
        // SLIGHT TOP BRIGHTNESS (clean, no white overlay)
        // ═══════════════════════════════════════════════════════════════════
        
        baseColor *= (1.0 + isTop * 0.05);
        
        // ═══════════════════════════════════════════════════════════════════
        // HOVER EFFECT: boost saturation toward colorA
        // ═══════════════════════════════════════════════════════════════════
        
        baseColor = mix(baseColor, uColorA, uIsHovered * 0.25); // Push toward saturated
        baseColor *= (1.0 + uIsHovered * 0.1); // Slight brightness boost
        
        // ═══════════════════════════════════════════════════════════════════
        // COLOR REVEAL: interpolate between white and real colors
        // ═══════════════════════════════════════════════════════════════════
        
        vec3 hiddenColor = vec3(0.973, 0.980, 0.988);  // #f8fafc - matches background
        baseColor = mix(hiddenColor, baseColor, uColorReveal);
        
        // ═══════════════════════════════════════════════════════════════════
        // SATURATION BOOST FOR HERO STATE
        // ═══════════════════════════════════════════════════════════════════
        
        baseColor = adjustSaturation(baseColor, uSaturationBoost);
        
        baseColor = min(baseColor, vec3(1.0));
        
        vec4 diffuseColor = vec4(baseColor, 1.0);
        `
      );
    };
    
    materialRef.current = mat;
    return mat;
  }, [colorA, colorB, isActive, materialKey]);
  
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.needsUpdate = true;
    }
  }, [colorA, colorB]);
  
  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Smooth hover transition using lerp
      targetHoverRef.current = isHovered ? 1.0 : 0.0;
      const lerpSpeed = animation.hover?.lerpSpeed || 0.12;
      currentHoverRef.current += (targetHoverRef.current - currentHoverRef.current) * lerpSpeed;
      
      // Clamp to avoid floating point artifacts
      if (Math.abs(targetHoverRef.current - currentHoverRef.current) < 0.001) {
        currentHoverRef.current = targetHoverRef.current;
      }
      
      shaderRef.current.uniforms.uIsHovered.value = currentHoverRef.current;
      
      // Smooth saturation transition (hero=1.55, scroll=1.0)
      const targetSaturation = isHeroState ? 1.55 : 1.0;
      const satLerpSpeed = 0.06;  // Slower for smooth transition
      currentSaturationRef.current += (targetSaturation - currentSaturationRef.current) * satLerpSpeed;
      
      if (Math.abs(targetSaturation - currentSaturationRef.current) < 0.001) {
        currentSaturationRef.current = targetSaturation;
      }
      
      shaderRef.current.uniforms.uSaturationBoost.value = currentSaturationRef.current;
      
      // Update color reveal from animated spring value
      if (animatedColorReveal) {
        shaderRef.current.uniforms.uColorReveal.value = animatedColorReveal.get();
      }
    }
  });
  
  return <primitive object={material} attach="material" />;
}
