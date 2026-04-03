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
import { easeOutQuart, lerp } from '../utils/easings';
import GradientShadowMaterial from './GradientShadowMaterial';
import { useTiltBatch } from '../hooks/useTiltBatch';
import { useBuildOffset } from './Stack';
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

  if (opacity <= 0) return null;

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
      maxWidth={Math.min(labelMaxWidth ?? labels.maxWidth, w - labels.padding.x * 2)}
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
  disableSlide = false,
}: BlockProps & { disableSlide?: boolean }) {
  const meshRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const invalidate = useThree((s) => s.invalidate);

  // Build offset: read per-block Y offset from Stack's spring physics (imperative, 60fps)
  const buildOffsetMap = useBuildOffset();
  const buildGroupRef = useRef<Group>(null);

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

    // IMPERATIVE: Apply per-block build offset (drop-in animation).
    // Read from shared context ref — updated by Stack.tsx at 60fps.
    if (buildGroupRef.current && blockId !== undefined) {
      const offsetY = buildOffsetMap.current[blockId] ?? 0;
      if (Math.abs(buildGroupRef.current.position.y - offsetY) > 0.0001) {
        buildGroupRef.current.position.y = offsetY;
        invalidate();
      }
    }
  });

  // Bootstrap: kick the first frame when spring targets change.
  // Also kick mid-stagger so the frame loop doesn't stall during delay.
  useEffect(() => {
    invalidate();
    // During stagger delay, spring hasn't started so onChange doesn't fire.
    // Kick invalidation partway through to bridge the gap.
    if (staggerDelay > 0) {
      const mid = setTimeout(() => invalidate(), staggerDelay * 0.5);
      const end = setTimeout(() => invalidate(), staggerDelay);
      return () => {
        clearTimeout(mid);
        clearTimeout(end);
      };
    }
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
    staggerDelay,
  ]);

  const getTargetPosition = (): [number, number, number] => {
    if (isMosaicActive) {
      return mosaicPosition;
    }

    // Pre-settle phase: mosaic is starting but blocks haven't entered mosaic
    // mode yet.  Return BASE position so springs smoothly drop any lift/slide
    // BEFORE the Bezier arc begins — this prevents the visible jerk.
    if (mosaicProgress > 0) {
      return [baseX, baseY, baseZ];
    }

    let targetX = baseX;
    let targetY = baseY;
    let targetZ = baseZ;

    if (!disableSlide) {
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
    }

    return [targetX, targetY, targetZ];
  };

  const springConfig = {
    tension: animation.spring.tension,
    friction: animation.spring.friction,
    mass: animation.spring.mass,
  };

  // ========================================================================
  // CLOSE PHASE: During early mosaic (0 → 0.25), keep springs active so
  // blocks animate smoothly back to base. Only switch to immediate (= direct
  // scroll-driven positions, no physics) once blocks have fully settled.
  // ========================================================================
  const IMMEDIATE_THRESHOLD = 0.25;

  const { springPosition } = useSpring({
    springPosition: getTargetPosition(),
    immediate: !!isMosaicActive && mosaicProgress > IMMEDIATE_THRESHOLD,
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
  // easeOutQuart: fast start (no deadzone) → smooth deceleration = physically natural
  const dimensionScale = useMemo((): [number, number, number] => {
    if (!mosaicDimensions || mosaicProgress <= 0) return [1, 1, 1];
    const target: [number, number, number] = [
      mosaicDimensions[0] / dimensions[0],
      mosaicDimensions[1] / dimensions[1],
      mosaicDimensions[2] / dimensions[2],
    ];
    const t = easeOutQuart(mosaicProgress);
    return [1 + (target[0] - 1) * t, 1 + (target[1] - 1) * t, 1 + (target[2] - 1) * t];
  }, [mosaicDimensions, mosaicProgress, dimensions]);

  // Labels + tilt use VISUAL dimensions (not geometry args) for correct positioning.
  // Smoothly interpolate between stack and mosaic dimensions so labels don't
  // jump when mosaic starts (was binary before, masked by the old fade-out).
  const progressT = easeOutQuart(mosaicProgress);
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

  // Color reveal: ENTRY = spring 0→1. EXIT = spring 1→0 (smooth fade out).
  // Exit fade runs simultaneously with buildOffsetY fly-up animation.
  const { springColorReveal } = useSpring({
    springColorReveal: opacity > 0 ? 1 : 0,
    config: {
      // Exit: softer spring for graceful fade
      tension: opacity > 0 ? animation.spring.tension : 80,
      friction: opacity > 0 ? animation.spring.friction : 16,
      mass: animation.spring.mass,
    },
    delay: isRevealed && opacity > 0 ? 0 : staggerDelay,
    onChange: () => invalidate(),
  });

  // Labels
  const revealFactor = Math.max(0, Math.min(1, (opacity - 0.3) / 0.5));
  const labelOpacity = revealFactor;
  const showLabel = !!label && labelOpacity > 0.01;

  // Visible while entering, steady, or exiting (spring still > 0 = still fading out)
  const currentReveal = springColorReveal.get();
  const isBlockVisible = opacity > 0 || currentReveal > 0.02 || mosaicProgress > 0;

  return (
    <group ref={buildGroupRef} visible={isBlockVisible}>
      <AnimatedGroup position={springPosition} scale={springScale}>
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
              labelFontSize={labelFontSize}
              labelMaxWidth={labelMaxWidth}
            />
          )}
        </group>
      </AnimatedGroup>
    </group>
  );
}
