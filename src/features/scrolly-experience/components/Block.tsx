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
import type { Group } from 'three';
import { geometry, animation, labels } from '../config';
import { easeOutCubic, lerp } from '../utils/easings';
import GradientShadowMaterial from './GradientShadowMaterial';
import { useTiltBatch } from '../hooks/useTiltBatch';
import type { BlockProps, BlockLabelProps, MousePosition } from '../types';

const AnimatedGroup = animated.group;

// Tilt config from centralized config
const TILT_MAX = animation.hover?.tilt?.maxAngle ?? 0.35;
const TILT_FALLOFF = animation.hover?.tilt?.proximityFalloff ?? 0.25;
const TILT_PROX_MAX = animation.hover?.tilt?.proximityMax ?? 0.7;
const TILT_LERP = animation.hover?.tilt?.lerpSpeed ?? 0.12;
const TILT_RESET_LERP = animation.hover?.tilt?.resetLerpSpeed ?? 0.08;

/** Label Component for block text */
function BlockLabel({
  text,
  dimensions,
  color = labels.color,
  opacity = 1,
  labelFontSize,
  labelMaxWidth,
}: BlockLabelProps) {
  const [w, h, d] = dimensions;

  // Always mount Text — avoid WebGL shader recompile and texture atlas upload
  // that happens on mount/unmount. Use visible + fillOpacity to hide instead.
  return (
    <Text
      position={[-w / 2 + labels.padding.x, h / 2 + labels.padding.y, d / 2 - labels.padding.z]}
      rotation={[-Math.PI / 2, 0, 0]}
      fontSize={labelFontSize ?? labels.fontSize}
      font={labels.font}
      anchorX="left"
      anchorY="bottom"
      color={color}
      fillOpacity={opacity}
      visible={opacity > 0}
      maxWidth={labelMaxWidth ?? labels.maxWidth}
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
  labelFontSize,
  labelMaxWidth,
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
  const tiltGroupRef = useRef<Group>(null);
  /** Current interpolated tilt angles (lerped toward target each frame) */
  const tiltCurrentRef = useRef({ x: 0, z: 0 });

  // Read batched cursor position from Stack (one raycaster per frame instead of 19)
  const tiltBatch = useTiltBatch();

  // Animate tilt smoothly each frame — PROXIMITY WAVE
  // Raycaster computation is batched in Stack — we only do distance+lerp math here
  useFrame(() => {
    if (!tiltGroupRef.current) return;

    // Early return during transition — saves 19 distance calcs per frame
    if (isMosaicTransitioning) return;

    let targetX = 0;
    let targetZ = 0;

    const hit = tiltBatch.cursorWorldPos;
    if (isMosaicSettled && hit) {
      // Block's current world position (from spring)
      const pos = springPosition.get();
      const blockX = pos[0];
      const blockZ = pos[2];

      const dx = hit.x - blockX;
      const dz = hit.z - blockZ;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const intensity = 1 / (1 + Math.pow(dist * TILT_FALLOFF, 2));
      const len = dist || 1;
      const dirX = dx / len;
      const dirZ = dz / len;

      const effectiveIntensity = isHovered ? intensity : intensity * TILT_PROX_MAX;

      targetX = dirZ * effectiveIntensity;
      targetZ = -dirX * effectiveIntensity;
    }

    const current = tiltCurrentRef.current;
    const isActive = targetX !== 0 || targetZ !== 0;
    const speed = isActive ? TILT_LERP : TILT_RESET_LERP;

    current.x += (targetX - current.x) * speed;
    current.z += (targetZ - current.z) * speed;

    if (Math.abs(current.x) < 0.0001 && Math.abs(current.z) < 0.0001 && !isActive) {
      current.x = 0;
      current.z = 0;
    }

    const rotX = current.x * TILT_MAX;
    const rotZ = current.z * TILT_MAX;

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
  }, [
    isActive,
    isAboveActive,
    opacity,
    isRevealed,
    baseX,
    baseY,
    baseZ,
    mosaicProgress,
    invalidate,
  ]);

  // SMOOTH BLEND: During settle phase (0→0.18), fade out active animations
  // (lift/slide) with easeOut curve matching scale/position easing.
  // Prevents the "sinking" artifact from linear fade vs easeOut scale.
  const SETTLE_THRESHOLD = 0.18;
  const rawBlend =
    mosaicProgress <= 0
      ? 1
      : mosaicProgress >= SETTLE_THRESHOLD
        ? 0
        : 1 - mosaicProgress / SETTLE_THRESHOLD;
  const activeBlend = rawBlend * rawBlend; // quadratic easeOut shape

  const getTargetPosition = (): [number, number, number] => {
    if (isMosaicActive) {
      return mosaicPosition;
    }

    let targetX = baseX;
    let targetY = baseY;
    let targetZ = baseZ;

    if (isActive) {
      targetX = baseX + slideX * animation.active.slideDistance * activeBlend;
      targetZ = baseZ + slideZ * animation.active.slideDistance * activeBlend;
      targetY = baseY + animation.active.liftHeight * activeBlend;
    } else if (isAboveActive) {
      targetY = baseY + animation.aboveActive.liftHeight * aboveLiftSign * activeBlend;
    } else if (isNotYetSeenAbove) {
      targetY = baseY + animation.aboveActive.liftHeight * activeBlend;
    }

    return [targetX, targetY, targetZ];
  };

  const springConfig = {
    tension: animation.spring.tension,
    friction: animation.spring.friction,
    mass: animation.spring.mass,
  };

  // ========================================================================
  // MOSAIC POSITION: immediate as soon as mosaic is active — the quadratic
  // settle ramp in useMosaicTransition already provides smooth easing, so
  // springs aren't needed as a bridge. This eliminates the velocity
  // discontinuity that occurred at the old IMMEDIATE_THRESHOLD boundary.
  // ========================================================================
  const { springPosition } = useSpring({
    springPosition: getTargetPosition(),
    immediate: !!isMosaicActive,
    config: springConfig,
    onChange: () => invalidate(),
  });

  const { springScale } = useSpring({
    springScale: isHovered && !isMosaicTransitioning ? animation.hover?.scale || 1.025 : 1,
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
  // easeOutCubic: fast start (no deadzone) → smooth deceleration = physically natural
  const dimensionScale = useMemo((): [number, number, number] => {
    if (!mosaicDimensions || mosaicProgress <= 0) return [1, 1, 1];
    const target: [number, number, number] = [
      mosaicDimensions[0] / dimensions[0],
      mosaicDimensions[1] / dimensions[1],
      mosaicDimensions[2] / dimensions[2],
    ];
    const t = easeOutCubic(mosaicProgress);
    return [1 + (target[0] - 1) * t, 1 + (target[1] - 1) * t, 1 + (target[2] - 1) * t];
  }, [mosaicDimensions, mosaicProgress, dimensions]);

  // Labels + tilt use VISUAL dimensions (not geometry args) for correct positioning.
  // Smoothly interpolate between stack and mosaic dimensions so labels don't
  // jump when mosaic starts (was binary before, masked by the old fade-out).
  const progressT = easeOutCubic(mosaicProgress);
  const visualDimensions: [number, number, number] =
    isMosaicActive && mosaicDimensions
      ? [
          lerp(dimensions[0], mosaicDimensions[0], progressT),
          lerp(dimensions[1], mosaicDimensions[1], progressT),
          lerp(dimensions[2], mosaicDimensions[2], progressT),
        ]
      : dimensions;

  const currentColorA = isActive ? activeColor : color;
  const currentColorB = isActive ? activeGradientColorB || activeColor : gradientColorB || color;

  const handlePointerOver = useCallback(
    (e: {
      stopPropagation: () => void;
      clientX?: number;
      clientY?: number;
      nativeEvent?: { clientX?: number; clientY?: number };
    }) => {
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
    },
    [onHoverChange, blockData, isMosaicTransitioning],
  );

  const handlePointerOut = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      document.body.style.cursor = 'auto';
      setIsHovered(false);
      if (onHoverChange) {
        onHoverChange(null, false, null);
      }
    },
    [onHoverChange],
  );

  const handleClick = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      if (onClick && blockId !== undefined) {
        onClick(blockId);
      }
    },
    [onClick, blockId],
  );

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

  return (
    <AnimatedGroup position={springPosition} scale={springScale}>
      {/* Tilt wrapper — rotation driven by useFrame for 60fps smoothness */}
      <group ref={tiltGroupRef}>
        {/* Dimension morph wrapper — scale instead of args change */}
        {/* visible gate — skip rendering entirely when invisible,
             but keep castShadow/receiveShadow stable to avoid shadow map recomputation flicker */}
        <group scale={dimensionScale} visible={opacity > 0.01}>
          <RoundedBox
            ref={meshRef}
            args={geometryArgs}
            radius={geometry.stack.borderRadius}
            smoothness={geometry.stack.smoothness}
            castShadow
            receiveShadow
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

        {/* Labels OUTSIDE scale group — always mounted to avoid WebGL flicker */}
        {label && (
          <BlockLabel
            text={label}
            dimensions={visualDimensions}
            color={textColor}
            opacity={labelOpacity}
            labelFontSize={labelFontSize}
            labelMaxWidth={labelMaxWidth}
          />
        )}
      </group>
    </AnimatedGroup>
  );
}
