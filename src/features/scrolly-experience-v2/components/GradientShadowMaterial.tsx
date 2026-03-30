/**
 * GradientShadowMaterial Component
 *
 * CLEAN PASTEL version - subtle linear gradient, minimal effects
 * Inspired by frosted glass reference with pure, airy pastels
 */

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, MeshPhysicalMaterial } from 'three';
import type { MeshPhysicalMaterial as MeshPhysicalMaterialType } from 'three';
import { animation, materials } from '../config';
import { palette } from '@/config/palette';
import { getIOSGpuOverrides } from '../utils/iosGpuProfile';
import type { GradientShadowMaterialProps } from '../types';


export default function GradientShadowMaterial({
  colorA = palette.sand200,
  colorB = palette.sand100,
  isActive = false,
  isHovered = false,
  isHeroState = false,
  animatedColorReveal = null,
  isMosaicTransitioning = false,
}: GradientShadowMaterialProps) {
  // Shader type not exported by @types/three, define inline
  const shaderRef = useRef<{ uniforms: Record<string, { value: unknown }> } | null>(null);
  const materialRef = useRef<MeshPhysicalMaterialType | null>(null);
  const currentHoverRef = useRef(0);
  const targetHoverRef = useRef(0);
  const currentSaturationRef = useRef(1.0);
  const frameCountRef = useRef(0);

  // Stable cache key: shader code is identical for all blocks.
  // Only isActive changes material props (roughness, envMapIntensity).
  // Colors differ per block but are passed through uniforms, not compiled into the shader.
  const materialKey = isActive ? 'gradient-active' : 'gradient-normal';

  const material = useMemo(() => {
    const colA = new Color(colorA);
    const colB = new Color(colorB);

    // iOS: disable expensive shader features that hit compilation limits
    const iosOverrides = getIOSGpuOverrides();
    const iosMat = iosOverrides?.materialOverrides;

    const mat = new MeshPhysicalMaterial({
      color: palette.white,
      transparent: true,
      depthWrite: true,       // Dynamically toggled in useFrame when fading
      roughness: isActive ? materials.active.roughness : materials.block.roughness,
      metalness: isActive ? materials.active.metalness : materials.block.metalness,
      envMapIntensity: isActive ? materials.active.envMapIntensity : materials.block.envMapIntensity,
      // Physical glass effects
      transmission: materials.physical.transmission,
      ior: materials.physical.ior,
      thickness: materials.physical.thickness,
      iridescence: iosMat ? iosMat.iridescence : materials.physical.iridescence,
      iridescenceIOR: materials.physical.iridescenceIOR,
      clearcoat: iosMat ? iosMat.clearcoat : materials.physical.clearcoat,
      clearcoatRoughness: materials.physical.clearcoatRoughness,
      // Sheen (velvet highlight)
      sheen: iosMat ? iosMat.sheen : materials.physical.sheen,
      sheenRoughness: materials.physical.sheenRoughness,
      sheenColor: new Color(materials.physical.sheenColor),
    });

    mat.customProgramCacheKey = () => materialKey;

    mat.onBeforeCompile = (shader) => {
      shaderRef.current = shader;

      shader.uniforms.uColorA = { value: colA };
      shader.uniforms.uColorB = { value: colB };
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uIsHovered = { value: 0.0 };
      shader.uniforms.uColorReveal = { value: 1.0 };
      shader.uniforms.uSaturationBoost = { value: 1.0 };
      shader.uniforms.uFresnelPower = { value: 2.5 };  // Rim light falloff

      shader.vertexShader = shader.vertexShader.replace(
        'void main() {',
        `
        varying vec3 vLocalPos;
        varying vec3 vLocalNorm;
        varying vec3 vWorldNormal;
        varying vec3 vViewDir;
        void main() {
          vLocalPos = position;
          vLocalNorm = normal;
          vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vViewDir = normalize(cameraPosition - worldPos.xyz);
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform float uTime;
        uniform float uColorReveal;
        uniform float uIsHovered;
        uniform float uSaturationBoost;
        uniform float uFresnelPower;
        varying vec3 vLocalPos;
        varying vec3 vLocalNorm;
        varying vec3 vWorldNormal;
        varying vec3 vViewDir;

        vec3 adjustSaturation(vec3 color, float saturation) {
          float grey = dot(color, vec3(0.2126, 0.7152, 0.0722));
          return mix(vec3(grey), color, saturation);
        }

        void main() {
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        'vec4 diffuseColor = vec4( diffuse, opacity );',
        `
        float gradientMix = 1.0 - (vLocalPos.x + vLocalPos.z + 4.0) * 0.18;
        gradientMix = clamp(gradientMix, 0.0, 1.0);

        float depthMix = 1.0 - (vLocalPos.z + 3.5) * 0.15;
        depthMix = clamp(depthMix, 0.0, 0.3);

        gradientMix = clamp(gradientMix - depthMix * 0.3, 0.0, 1.0);

        float shimmer = sin(uTime * 0.3 + vLocalPos.x * 0.6) * 0.03 * uColorReveal;
        gradientMix = clamp(gradientMix + shimmer, 0.0, 1.0);

        gradientMix = smoothstep(0.0, 1.0, gradientMix);

        vec3 baseColor = mix(uColorA, uColorB, gradientMix);

        float isTop = smoothstep(0.7, 1.0, vLocalNorm.y);

        float sideFactor = (1.0 - isTop) * uColorReveal;
        baseColor = mix(baseColor, uColorB, sideFactor * 0.15);
        baseColor *= (1.0 - sideFactor * 0.08);

        float normalShade = 1.0 - (abs(vLocalNorm.x) * 0.05 + abs(vLocalNorm.z) * 0.03) * uColorReveal;
        baseColor *= normalShade;

        baseColor *= (1.0 + isTop * 0.05 * uColorReveal);

        baseColor = mix(baseColor, uColorA, uIsHovered * 0.25);
        baseColor *= (1.0 + uIsHovered * 0.1);

        baseColor = adjustSaturation(baseColor, uSaturationBoost);

        // Fresnel rim light — subtle glow at edges
        float fresnel = pow(1.0 - max(dot(vViewDir, vWorldNormal), 0.0), uFresnelPower);
        baseColor += fresnel * 0.12 * uColorReveal;

        baseColor = min(baseColor, vec3(1.0));

        // Alpha = colorReveal: blocks fade from invisible (0) to fully opaque (1).
        // No hiddenColor — blocks are truly transparent when not revealed.
        vec4 diffuseColor = vec4(baseColor, uColorReveal);
        `
      );
    };

    materialRef.current = mat;
    return mat;
  }, [colorA, colorB, isActive, materialKey]);

  // Update uniform colors when props change (no shader recompilation needed)
  useEffect(() => {
    if (shaderRef.current) {
      (shaderRef.current.uniforms.uColorA.value as Color).set(colorA);
      (shaderRef.current.uniforms.uColorB.value as Color).set(colorB);
    }
  }, [colorA, colorB]);

  // REMOVED: needsUpdate = true was triggering full shader recompilation
  // on every color change. Uniforms are updated directly above — no recompile needed.

  useFrame((state, delta) => {
    // STABILITY FIX: Don't freeze ALL useFrame work during mosaic.
    // uTime and saturation always update — prevents color pop.
    // Only hover-lerp is skipped (15 blocks × lerp/frame = performance saving).
    frameCountRef.current++;

    if (shaderRef.current) {
      // uTime — throttle to every 3rd frame (shimmer = sin(t*0.3), very slow)
      if (frameCountRef.current % 3 === 0) {
        shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      }

      // Hover lerp — skip during mosaic transition only
      if (!isMosaicTransitioning) {
        targetHoverRef.current = isHovered ? 1.0 : 0.0;
        const lerpSpeed = animation.hover?.lerpSpeed || 0.12;
        currentHoverRef.current += (targetHoverRef.current - currentHoverRef.current) * lerpSpeed;

        if (Math.abs(targetHoverRef.current - currentHoverRef.current) < 0.001) {
          currentHoverRef.current = targetHoverRef.current;
        } else {
          state.invalidate();
        }

        shaderRef.current.uniforms.uIsHovered.value = currentHoverRef.current;
      }

      // Saturation — ALWAYS update (prevents saturation jump)
      const targetSaturation = isHeroState ? 1.15 : 1.0;
      const satLambda = 5;
      const satDt = Math.max(delta, 1 / 120);
      const satDecay = 1 - Math.exp(-satLambda * satDt);
      currentSaturationRef.current += (targetSaturation - currentSaturationRef.current) * satDecay;

      if (Math.abs(targetSaturation - currentSaturationRef.current) < 0.001) {
        currentSaturationRef.current = targetSaturation;
      } else {
        state.invalidate();
      }

      shaderRef.current.uniforms.uSaturationBoost.value = currentSaturationRef.current;

      if (animatedColorReveal) {
        const val = animatedColorReveal.get();
        const prev = shaderRef.current.uniforms.uColorReveal.value as number;
        if (Math.abs(val - prev) > 0.001) {
          shaderRef.current.uniforms.uColorReveal.value = val;
          state.invalidate();
        }

        // Dynamic depthWrite: ON when fully opaque, OFF when fading.
        // Prevents semi-transparent blocks from clipping each other via depth buffer.
        if (materialRef.current) {
          const shouldWriteDepth = val > 0.99;
          if (materialRef.current.depthWrite !== shouldWriteDepth) {
            materialRef.current.depthWrite = shouldWriteDepth;
          }
        }
      }
    }
  });

  return <primitive object={material} attach="material" />;
}
