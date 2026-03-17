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
 * PERFORMANCE CRITICAL:
 * - RoundedBox `args` are FIXED (never change during transition).
 *   Visual size morph is done via `scale` transform — zero geometry rebuilds.
 * - Position uses `immediate: true` during mosaic — zero spring computation.
 * - Labels hidden during transition — zero troika-text layout recomputation.
 */

import { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import { animated, useSpring } from '@react-spring/three';
import { useThree } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import { geometry, animation, labels } from '../config';
import { easeOutQuart } from '../utils/easings';
import GradientShadowMaterial from './GradientShadowMaterial';
import type { BlockProps, BlockLabelProps, MousePosition } from '../types';

const AnimatedGroup = animated.group;

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
}: BlockProps) {
  const meshRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const invalidate = useThree((s) => s.invalidate);

  const [baseX, baseY, baseZ] = position;
  const [slideX, slideZ] = slideDirection;

  // Determine effective position/dimensions based on mosaic state
  const isMosaicActive = mosaicProgress > 0 && mosaicPosition && mosaicDimensions;
  // Transitioning = mid-animation (no hover). Settled = fully assembled (hover OK)
  const isMosaicTransitioning = isMosaicActive && mosaicProgress < 1;

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

  // Keep labels readable through the morph; only the initial reveal is animated.
  const revealFactor = Math.max(0, Math.min(1, (opacity - 0.3) / 0.5));
  // During mosaic flight (0 < progress < 0.9): hide labels (they're useless mid-flight).
  // When mosaic settles (0.9 → 1.0): smooth fadeIn return.
  const mosaicLabelFade = mosaicProgress <= 0 ? 1
    : mosaicProgress >= 1 ? 1
    : Math.max(0, (mosaicProgress - 0.9) / 0.1);
  const labelOpacity = revealFactor * mosaicLabelFade;
  const showLabel = !!label && labelOpacity > 0.01;

  // Labels use VISUAL dimensions (not geometry args) for correct positioning
  // This ensures uniform label placement regardless of block's original proportions
  const visualDimensions: [number, number, number] = isMosaicActive && mosaicDimensions
    ? mosaicDimensions
    : dimensions;

  return (
    <AnimatedGroup
      position={springPosition}
      scale={springScale}
    >
      {/* Dimension morph wrapper — scale instead of args change */}
      <group scale={dimensionScale}>
        <RoundedBox
          ref={meshRef}
          args={geometryArgs}
          radius={geometry.stack.borderRadius}
          smoothness={geometry.stack.smoothness}
          castShadow={opacity > 0.5}
          receiveShadow={opacity > 0.5}
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
    </AnimatedGroup>
  );
}
