/**
 * Layer Component
 *
 * Renders a layer of blocks based on layout configuration.
 * Uses layout utilities for position calculations.
 */

import Block from './Block';
import { calculateBlockPositions } from '../utils/layoutUtils';
import { animation } from '../config';
import type { LayerProps, ComputedBlock } from '../types';

export default function Layer({
  layer,
  baseY,
  currentStep,
  allBlocksAboveActive,
  onBlockClick,
  onBlockHover,
  opacity = 1,
  staggerDelay = 0,
  isRevealed = true,
}: LayerProps) {
  const blocks: ComputedBlock[] = calculateBlockPositions(layer, baseY);

  return (
    <group>
      {blocks.map((block, blockIndex) => {
        const isActive = currentStep === block.id;
        const isAboveActive = allBlocksAboveActive.includes(block.id);
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
            slideDirection={(block.slideDirection ?? animation.active.slideDirection) as [number, number]}
            onClick={onBlockClick}
            onHoverChange={onBlockHover}
            blockData={block}
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
