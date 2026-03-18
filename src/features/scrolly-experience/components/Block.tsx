/**
 * Block Component
 *
 * Individual 3D block with spring animations and premium glass material.
 * All parameters driven by config.
 *
 * Supports two modes:
 * 1. STACK mode (default): position/dimensions from layout, spring-animated
 * 2. MOSAIC mode: position/dimensions driven by mosaicProgress (direct, no spring)
 *
 * HOVER TILT: When mosaic is settled, blocks tilt toward the cursor position
 * for a physical "press" feel. Uses useFrame + ref for 60fps smoothness
 * without React re-renders.
 *
 * PERFORMANCE CRITICAL:
 * - RoundedBox `args` are FIXED (never change during transition).
 *   Visual size morph is done via `scale` transform — zero geometry rebuilds.
 * - Position uses `immediate: true` during mosaic — zero spring computation.
 * - Tilt uses useRef + useFrame — zero React re-renders during mousemove.
 */

import { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import { animated, useSpring } from '@react-spring/three';
import { useThree, useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { geometry, animation, labels } from '../config';
import { easeOutQuart, lerp } from '../utils/easings';
import GradientShadowMaterial from './GradientShadowMaterial';
import type { BlockProps, BlockLabelProps, MousePosition } from '../types';

const AnimatedGroup = animated.group;

// Tilt config from centralized config
const TILT_MAX = animation.hover?.tilt?.maxAngle ?? 0.35;
const TILT_FALLOFF = animation.hover?.tilt?.proximityFalloff ?? 0.25;
const TILT_PROX_MAX = animation.hover?.tilt?.proximityMax ?? 0.7;
const TILT_LERP = animation.hover?.tilt?.lerpSpeed ?? 0.12;
const TILT_RESET_LERP = animation.hover?.tilt?.resetLerpSpeed ?? 0.08;
const TILT_MOBILE_BP = animation.hover?.tilt?.mobileBreakpoint ?? 768;

/** Shared plane for raycaster intersection (y = 0.15, top of blocks) */
const TILT_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.15);
const _planeIntersect = new THREE.Vector3();

/** Label Component for block text */
function BlockLabel({ text, dimensions, color = labels.color, opacity = 1 }: BlockLabelProps) {
  const [w, h, d] = dimensions;

  if (opacity <= 0) return null;

  return (
    <Text
      position={[
        -w / 2 + labels.padding.x,
        h / 2 + labels.padding.y,
        d / 2 - labels.padding.z,
      ]}
      rotation={[-Math.PI / 2, 0, 0]}
      fontSize={labels.fontSize}
      font={labels.font}
      anchorX="left"
      anchorY="bottom"
      color={color}
      fillOpacity={opacity}
      maxWidth={labels.maxWidth}
      lineHeight={labels.lineHeight}
      characters="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+"
    >
      {text}
    </Text>
  );
}

/** Main Block Component */
export default function Block({
  position,
  dimensions,
  color,
  gradientColorB,
  activeColor,
  activeGradientColorB,
  textColor = 'white',
  label,
  isActive,
  isAboveActive,
  slideDirection = animation.active.slideDirection as [number, number],
  onClick,
  onHoverChange,
  blockData,
  blockId,
  opacity = 1,
  staggerDelay = 0,
  isRevealed = true,
  // Mosaic override props
  mosaicPosition,
  mosaicDimensions,
  mosaicProgress = 0,
  aboveLiftSign = 1,
  isNotYetSeenAbove = false,
}: BlockProps) {
  const meshRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const invalidate = useThree((s) => s.invalidate);

  const [baseX, baseY, baseZ] = position;
  const [slideX, slideZ] = slideDirection;

  // Determine effective position/dimensions based on mosaic state
  const isMosaicActive = mosaicProgress > 0 && mosaicPosition && mosaicDimensions;
  // Settled = fully assembled (hover + tilt OK)
  const isMosaicSettled = isMosaicActive && mosaicProgress >= 1;
  // Transitioning = mid-animation (no hover/tilt)
  const isMosaicTransitioning = isMosaicActive && mosaicProgress < 1;

  // ========================================================================
  // PROXIMITY TILT — physical "wave" effect
  //
  // ALL blocks react to cursor position (not just the hovered one).
  // Closer blocks tilt more, farther blocks less. Creates a "magnetic field"
  // effect where the entire grid subtly responds to the cursor.
  //
  // Uses raycaster plane intersection to get cursor world position,
  // then computes direction + distance for each block in useFrame.
  // ========================================================================
  const tiltGroupRef = useRef<THREE.Group>(null);
  /** Current interpolated tilt angles (lerped toward target each frame) */
  const tiltCurrentRef = useRef({ x: 0, z: 0 });
  /** Whether tilt is enabled (disabled on mobile) */
  const tiltEnabledRef = useRef(true);

  // Check mobile breakpoint once
  useEffect(() => {
    const check = () => {
      tiltEnabledRef.current = window.innerWidth >= TILT_MOBILE_BP;
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Animate tilt smoothly each frame — PROXIMITY WAVE
  useFrame((state) => {
    if (!tiltGroupRef.current) return;

    let targetX = 0;
    let targetZ = 0;

    // Only compute tilt when mosaic is settled and tilt is enabled
    if (isMosaicSettled && tiltEnabledRef.current) {
      // Project mouse NDC to world-space plane at block top height
      state.raycaster.setFromCamera(state.pointer, state.camera);
      const hit = state.raycaster.ray.intersectPlane(TILT_PLANE, _planeIntersect);

      if (hit) {
        // Block's current world position (from spring)
        const pos = springPosition.get();
        const blockX = pos[0];
        const blockZ = pos[2];

        // Direction from block center to cursor
        const dx = hit.x - blockX;
        const dz = hit.z - blockZ;

        // Distance from cursor to block center
        const dist = Math.sqrt(dx * dx + dz * dz);

        // Falloff: intensity = 1 / (1 + (dist * falloff)²)
        // At dist=0: intensity=1, at dist=4 (with falloff=0.25): intensity=0.5
        const intensity = 1 / (1 + Math.pow(dist * TILT_FALLOFF, 2));

        // Normalize direction (avoid division by zero)
        const len = dist || 1;
        const dirX = dx / len;
        const dirZ = dz / len;

        // Tilt TOWARD cursor (press down): block tilts in the direction of the cursor
        // rotX = forward/back tilt controlled by Z-direction
        // rotZ = left/right tilt controlled by X-direction  
        const effectiveIntensity = isHovered
          ? intensity  // Full effect on hovered block
          : intensity * TILT_PROX_MAX;  // Capped for neighbors

        targetX = dirZ * effectiveIntensity;   // Z direction → X rotation
        targetZ = -dirX * effectiveIntensity;  // X direction → Z rotation (inverted)
      }
    }

    const current = tiltCurrentRef.current;

    // Choose lerp speed: faster convergence when active, slower return
    const isActive = targetX !== 0 || targetZ !== 0;
    const speed = isActive ? TILT_LERP : TILT_RESET_LERP;

    current.x += (targetX - current.x) * speed;
    current.z += (targetZ - current.z) * speed;

    // Snap to zero when close enough
    if (Math.abs(current.x) < 0.0001 && Math.abs(current.z) < 0.0001 && !isActive) {
      current.x = 0;
      current.z = 0;
    }

    const rotX = current.x * TILT_MAX;
    const rotZ = current.z * TILT_MAX;

    // Only update when there's meaningful change
    const prevRotX = tiltGroupRef.current.rotation.x;
    const prevRotZ = tiltGroupRef.current.rotation.z;
    if (Math.abs(rotX - prevRotX) > 0.00001 || Math.abs(rotZ - prevRotZ) > 0.00001) {
      tiltGroupRef.current.rotation.set(rotX, 0, rotZ);
      invalidate();
    }
  });

  // Bootstrap: kick the first frame when spring targets change.
  useEffect(() => {
    invalidate();
  }, [isActive, isAboveActive, opacity, isRevealed, baseX, baseY, baseZ,
      mosaicProgress, invalidate]);

  const getTargetPosition = (): [number, number, number] => {
    if (isMosaicActive) {
      return mosaicPosition;
    }

    let targetX = baseX;
    let targetY = baseY;
    let targetZ = baseZ;

    if (isActive) {
      targetX = baseX + slideX * animation.active.slideDistance;
      targetZ = baseZ + slideZ * animation.active.slideDistance;
      targetY = baseY + animation.active.liftHeight;
    } else if (isAboveActive) {
      targetY = baseY + animation.aboveActive.liftHeight * aboveLiftSign;
    } else if (isNotYetSeenAbove) {
      // Reverse only: layers above active haven't been seen yet but occlude it.
      // Lift them UP so the active block is visible.
      targetY = baseY + animation.aboveActive.liftHeight;
    }

    return [targetX, targetY, targetZ];
  };

  const springConfig = {
    tension: animation.spring.tension,
    friction: animation.spring.friction,
    mass: animation.spring.mass,
  };

  const { springPosition } = useSpring({
    springPosition: getTargetPosition(),
    // During mosaic: set positions instantly from scroll (no spring lag = no FPS drop)
    immediate: !!isMosaicActive,
    config: springConfig,
    onChange: () => invalidate(),
  });

  const { springScale } = useSpring({
    springScale: isHovered && !isMosaicTransitioning ? (animation.hover?.scale || 1.025) : 1,
    config: { tension: 300, friction: 20, mass: 0.5 },
    onChange: () => invalidate(),
  });

  // ========================================================================
  // PERFORMANCE FIX #1: geometry args NEVER change during transition.
  // Visual size morph uses `scale` transform instead.
  //
  // RoundedBox args = stack dimensions (constant per block).
  // dimensionScale = mosaicDimensions / stackDimensions (smooth morph via scale).
  //
  // This eliminates 900 geometry rebuilds/sec → 0.
  // ========================================================================
  const geometryArgs = dimensions; // FIXED — never changes during transition

  // Scale to achieve desired visual size during mosaic
  // STABILITY FIX: interpolate by mosaicProgress (was binary jump [1,1,1] → target)
  // easeOutQuart: fast start (no deadzone) → smooth deceleration = physically natural
  const dimensionScale = useMemo((): [number, number, number] => {
    if (!mosaicDimensions || mosaicProgress <= 0) return [1, 1, 1];
    const target: [number, number, number] = [
      mosaicDimensions[0] / dimensions[0],
      mosaicDimensions[1] / dimensions[1],
      mosaicDimensions[2] / dimensions[2],
    ];
    const t = easeOutQuart(mosaicProgress);
    return [
      1 + (target[0] - 1) * t,
      1 + (target[1] - 1) * t,
      1 + (target[2] - 1) * t,
    ];
  }, [mosaicDimensions, mosaicProgress, dimensions]);

  // Labels + tilt use VISUAL dimensions (not geometry args) for correct positioning.
  // Smoothly interpolate between stack and mosaic dimensions so labels don't
  // jump when mosaic starts (was binary before, masked by the old fade-out).
  const progressT = easeOutQuart(mosaicProgress);
  const visualDimensions: [number, number, number] = isMosaicActive && mosaicDimensions
    ? [
        lerp(dimensions[0], mosaicDimensions[0], progressT),
        lerp(dimensions[1], mosaicDimensions[1], progressT),
        lerp(dimensions[2], mosaicDimensions[2], progressT),
      ]
    : dimensions;

  const currentColorA = isActive ? activeColor : color;
  const currentColorB = isActive
    ? (activeGradientColorB || activeColor)
    : (gradientColorB || color);

  const handlePointerOver = useCallback((e: { stopPropagation: () => void; clientX?: number; clientY?: number; nativeEvent?: { clientX?: number; clientY?: number } }) => {
    e.stopPropagation();
    if (isMosaicTransitioning) return;
    document.body.style.cursor = 'pointer';
    setIsHovered(true);
    if (onHoverChange && blockData) {
      const mousePos: MousePosition = {
        x: e.clientX || e.nativeEvent?.clientX || 0,
        y: e.clientY || e.nativeEvent?.clientY || 0,
      };
      onHoverChange(blockData, true, mousePos);
    }
  }, [onHoverChange, blockData, isMosaicTransitioning]);

  const handlePointerOut = useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    document.body.style.cursor = 'auto';
    setIsHovered(false);
    if (onHoverChange) {
      onHoverChange(null, false, null);
    }
  }, [onHoverChange]);

  const handleClick = useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (onClick && blockId !== undefined) {
      onClick(blockId);
    }
  }, [onClick, blockId]);

  const { springColorReveal } = useSpring({
    springColorReveal: opacity,
    config: {
      tension: isRevealed ? animation.spring.tension : animation.spring.tension * 0.6,
      friction: isRevealed ? animation.spring.friction : animation.spring.friction * 1.4,
      mass: animation.spring.mass,
    },
    delay: isRevealed ? 0 : staggerDelay,
    onChange: () => invalidate(),
  });

  // Labels stay visible through the entire mosaic morph.
  // Only the initial reveal is animated (opacity ramp from data-driven stagger).
  const revealFactor = Math.max(0, Math.min(1, (opacity - 0.3) / 0.5));
  const labelOpacity = revealFactor;
  const showLabel = !!label && labelOpacity > 0.01;

  return (
    <AnimatedGroup
      position={springPosition}
      scale={springScale}
    >
      {/* Tilt wrapper — rotation driven by useFrame for 60fps smoothness */}
      <group ref={tiltGroupRef}>
        {/* Dimension morph wrapper — scale instead of args change */}
        <group scale={dimensionScale}>
          <RoundedBox
            ref={meshRef}
            args={geometryArgs}
            radius={geometry.stack.borderRadius}
            smoothness={geometry.stack.smoothness}
            castShadow={opacity > 0.01}
            receiveShadow={opacity > 0.01}
            onClick={handleClick}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
          >
            <GradientShadowMaterial
              colorA={currentColorA}
              colorB={currentColorB}
              isActive={isActive}
              isHovered={isHovered}
              isHeroState={!isRevealed}
              animatedColorReveal={springColorReveal}
              isMosaicTransitioning={isMosaicTransitioning}
            />
          </RoundedBox>
        </group>

        {/* Labels OUTSIDE scale group — use visual dimensions for uniform positioning */}
        {showLabel && (
          <BlockLabel
            text={label}
            dimensions={visualDimensions}
            color={textColor}
            opacity={labelOpacity}
          />
        )}
      </group>
    </AnimatedGroup>
  );
}
