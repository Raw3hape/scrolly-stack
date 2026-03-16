/**
 * Block Component
 *
 * Individual 3D block with spring animations and premium glass material.
 * All parameters driven by config.
 */

import { useRef, useCallback, useState } from 'react';
import { animated, useSpring } from '@react-spring/three';
import { RoundedBox, Text } from '@react-three/drei';
import { geometry, animation, labels } from '../config';
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
}: BlockProps) {
  const meshRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const [baseX, baseY, baseZ] = position;
  const [slideX, slideZ] = slideDirection;

  const getTargetPosition = (): [number, number, number] => {
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

  const { springPosition } = useSpring({
    springPosition: getTargetPosition(),
    config: {
      tension: animation.spring.tension,
      friction: animation.spring.friction,
      mass: animation.spring.mass,
    },
  });

  const { springScale } = useSpring({
    springScale: isHovered ? (animation.hover?.scale || 1.025) : 1,
    config: { tension: 300, friction: 20, mass: 0.5 },
  });

  const currentColorA = isActive ? activeColor : color;
  const currentColorB = isActive
    ? (activeGradientColorB || activeColor)
    : (gradientColorB || color);

  const handlePointerOver = useCallback((e: { stopPropagation: () => void; clientX?: number; clientY?: number; nativeEvent?: { clientX?: number; clientY?: number } }) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    setIsHovered(true);
    if (onHoverChange && blockData) {
      const mousePos: MousePosition = {
        x: e.clientX || e.nativeEvent?.clientX || 0,
        y: e.clientY || e.nativeEvent?.clientY || 0,
      };
      onHoverChange(blockData, true, mousePos);
    }
  }, [onHoverChange, blockData]);

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
      tension: isRevealed ? animation.spring.tension : animation.spring.tension * 0.8,
      friction: animation.spring.friction,
      mass: animation.spring.mass,
    },
    delay: isRevealed ? staggerDelay : staggerDelay * 0.3,
  });

  return (
    <AnimatedGroup
      position={springPosition}
      scale={springScale}
    >
      <RoundedBox
        ref={meshRef}
        args={dimensions}
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
        />
      </RoundedBox>

      {label && opacity > 0.5 && (
        <BlockLabel
          text={label}
          dimensions={dimensions}
          color={textColor}
          opacity={opacity}
        />
      )}
    </AnimatedGroup>
  );
}
