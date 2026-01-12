/**
 * Block Component
 * 
 * Individual 3D block with spring animations and premium glass material.
 * Features transmission, iridescence, and inner glow effects.
 * All parameters driven by config.js.
 */

import { useRef, useCallback, useState } from 'react';
import { animated, useSpring } from '@react-spring/three';
import { RoundedBox, Text } from '@react-three/drei';
import { geometry, animation, labels } from '../config';
import GradientShadowMaterial from './GradientShadowMaterial';

// Animated versions of Three.js elements
const AnimatedGroup = animated.group;

/**
 * Label Component for block text
 */
function BlockLabel({ text, dimensions, color = labels.color, opacity = 1 }) {
  const [w, h, d] = dimensions;
  
  // Don't render if invisible
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

/**
 * Main Block Component
 */
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
  slideDirection = animation.active.slideDirection,
  onClick,
  blockId,
  opacity = 1,
  staggerDelay = 0,    // NEW: Stagger delay for accordion effect
  isRevealed = true,   // NEW: Whether stack is revealed
}) {
  const meshRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  
  const [baseX, baseY, baseZ] = position;
  const [slideX, slideZ] = slideDirection;
  
  // Calculate target positions based on state
  const getTargetPosition = () => {
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
  
  // Spring animation for position only
  const { springPosition } = useSpring({
    springPosition: getTargetPosition(),
    config: {
      tension: animation.spring.tension,
      friction: animation.spring.friction,
      mass: animation.spring.mass,
    },
  });
  
  // Current colors (solid or gradient)
  const currentColorA = isActive ? activeColor : color;
  const currentColorB = isActive 
    ? (activeGradientColorB || activeColor) 
    : (gradientColorB || color);
  
  // Hover handlers
  const handlePointerOver = useCallback((e) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    setIsHovered(true);
  }, []);
  
  const handlePointerOut = useCallback((e) => {
    e.stopPropagation();
    document.body.style.cursor = 'auto';
    setIsHovered(false);
  }, []);
  
  // Click handler
  const handleClick = useCallback((e) => {
    e.stopPropagation();
    if (onClick && blockId !== undefined) {
      onClick(blockId);
    }
  }, [onClick, blockId]);
  
  // Color transition: 0 = white (hidden), 1 = real colors (revealed)
  const { springColorReveal } = useSpring({
    springColorReveal: opacity, // reuse opacity value for color transition
    config: {
      tension: isRevealed ? animation.spring.tension : animation.spring.tension * 0.8,
      friction: animation.spring.friction,
      mass: animation.spring.mass,
    },
    delay: isRevealed ? staggerDelay : staggerDelay * 0.3,
  });
  
  return (
    <AnimatedGroup position={springPosition}>
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


