/**
 * Stack Component
 * 
 * Data-driven container that renders all layers.
 * Reads layer configurations from data.js and calculates "above active" logic.
 */

import { useMemo } from 'react';
import Layer from './Layer';
import { getLayerHeight } from '../utils/layoutUtils';
import { layers, steps } from '../data';

/**
 * Calculate which blocks should be in "above active" state
 */
function calculateBlocksAboveActive(currentStep) {
  if (currentStep === -1) return [];
  
  const activeStep = steps.find(s => s.id === currentStep);
  if (!activeStep) return [];
  
  const activeLevel = activeStep.level;
  const aboveIds = [];
  
  steps.forEach(step => {
    // Skip if it's the active step itself
    if (step.id === currentStep) return;
    
    const stepLevel = step.level;
    
    // Level hierarchy: A (top) > B > C (bottom)
    if (activeLevel === 'C') {
      // If active is in C, levels A and B are always above
      if (stepLevel === 'A' || stepLevel === 'B') {
        aboveIds.push(step.id);
      }
      // Within C, blocks with lower ID are physically above (built top-down)
      if (stepLevel === 'C' && step.id < currentStep) {
        aboveIds.push(step.id);
      }
    } else if (activeLevel === 'B') {
      // Level A is above Level B
      if (stepLevel === 'A') {
        aboveIds.push(step.id);
      }
    }
    // If active is in A, nothing is above
  });
  
  return aboveIds;
}

/**
 * Calculate layer Y positions
 */
function calculateLayerPositions() {
  // Calculate total stack height
  let totalHeight = 0;
  layers.forEach(layer => {
    totalHeight += getLayerHeight(layer);
  });
  
  // Build positions array from top to bottom
  const positions = [];
  let currentY = totalHeight / 2;
  
  for (const layer of layers) {
    positions.push({
      layer,
      baseY: currentY,
    });
    currentY -= getLayerHeight(layer);
  }
  
  return positions;
}

/**
 * Calculate opacity for each layer based on current step
 * Simple binary: hero state hides lower layers, any scroll reveals all
 */
function calculateLayerOpacity(layer, currentStep) {
  // Hero state (no active step) - only show Level A
  if (currentStep === -1) {
    return layer.level === 'A' ? 1 : 0;
  }
  
  // Any scroll happened - all layers visible
  return 1;
}

/**
 * Stack Component
 */
export default function Stack({ currentStep, onBlockClick, onBlockHover }) {
  // Calculate which blocks are above the active one
  const blocksAboveActive = useMemo(
    () => calculateBlocksAboveActive(currentStep),
    [currentStep]
  );
  
  // Calculate layer positions (memoized, doesn't change)
  const layerPositions = useMemo(() => calculateLayerPositions(), []);
  
  // Is the stack revealed (any scroll has happened)?
  const isRevealed = currentStep !== -1;
  
  return (
    <group position={[0, -1, 0]}>
      {layerPositions.map(({ layer, baseY }, index) => {
        // Calculate opacity - hidden layers still rendered for animation
        const opacity = calculateLayerOpacity(layer, currentStep);
        
        // Only use collapsed position for INITIAL state (before any reveal)
        // When collapsing back, keep layers at their expanded position and just fade
        // This avoids z-fighting when layers converge to same point
        const targetY = baseY; // Always use expanded position
        
        // Stagger delay based on layer index (deeper = later reveal)
        const staggerDelay = index * 100; // 100ms per layer
        
        return (
          <Layer
            key={layer.id}
            layer={layer}
            baseY={targetY}
            currentStep={currentStep}
            allBlocksAboveActive={blocksAboveActive}
            onBlockClick={onBlockClick}
            onBlockHover={onBlockHover}
            opacity={opacity}
            staggerDelay={staggerDelay}
            isRevealed={isRevealed}
          />
        );
      })}
    </group>
  );
}


