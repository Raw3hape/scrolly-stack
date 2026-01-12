/**
 * Layer Component
 * 
 * Renders a layer of blocks based on layout configuration.
 * Uses layout utilities for position calculations.
 */

import Block from './Block';
import { calculateBlockPositions } from '../utils/layoutUtils';
import { animation } from '../config';

/**
 * Layer Component
 */
export default function Layer({
  layer,
  baseY,
  currentStep,
  allBlocksAboveActive,
  onBlockClick,
  opacity = 1,
  staggerDelay = 0,    // NEW: Stagger delay for accordion effect
  isRevealed = true,   // NEW: Whether stack is revealed
}) {
  const blocks = calculateBlockPositions(layer, baseY);
  
  return (
    <group>
      {blocks.map((block, blockIndex) => {
        const isActive = currentStep === block.id;
        const isAboveActive = allBlocksAboveActive.includes(block.id);
        
        // Additional per-block stagger within the layer
        const blockStagger = staggerDelay + (blockIndex * 30);
        
        return (
          <Block
            key={block.id}
            position={block.position}
            dimensions={block.dimensions}
            color={block.color}
            gradientColorB={block.gradientColorB}
            activeColor={block.activeColor}
            activeGradientColorB={block.activeGradientColorB}
            textColor={block.textColor}
            label={block.label}
            isActive={isActive}
            isAboveActive={isAboveActive}
            slideDirection={block.slideDirection ?? animation.active.slideDirection}
            onClick={onBlockClick}
            blockId={block.id}
            opacity={opacity}
            staggerDelay={blockStagger}
            isRevealed={isRevealed}
          />
        );
      })}
    </group>
  );
}

