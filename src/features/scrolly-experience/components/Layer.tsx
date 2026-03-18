/**
 * Layer Component
 *
 * Renders a layer of blocks based on layout configuration.
 * Uses layout utilities for position calculations.
 * Passes through mosaic data to blocks when transitioning.
 */

import Block from './Block';
import { calculateBlockPositions } from '../utils/layoutUtils';
import { useVariant } from '../VariantContext';
import { animation } from '../config';
import type { LayerProps, ComputedBlock } from '../types';
import type { MosaicBlockDataMap } from './Stack';

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
  mosaicProgress = 0,
  mosaicBlockData,
  aboveLiftSign,
  allBlocksNotYetSeenAbove = [],
}: Omit<LayerProps, 'mosaicBlockData'> & { mosaicBlockData?: MosaicBlockDataMap; aboveLiftSign?: number }) {
  const { geometry } = useVariant();
  const blocks: ComputedBlock[] = calculateBlockPositions(layer, baseY, geometry);

  return (
    <group>
      {blocks.map((block, blockIndex) => {
        const isActive = currentStep === block.id;
        const isAboveActive = allBlocksAboveActive.includes(block.id);
        const isNotYetSeenAbove = allBlocksNotYetSeenAbove.includes(block.id);
        const blockStagger = staggerDelay + (blockIndex * 30);

        // Get mosaic data for this specific block (Record lookup, not Map.get)
        const blockMosaic = mosaicBlockData?.[block.id];

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
            aboveLiftSign={aboveLiftSign}
            isNotYetSeenAbove={isNotYetSeenAbove}
            onClick={onBlockClick}
            onHoverChange={onBlockHover}
            blockData={block}
            blockId={block.id}
            opacity={opacity}
            staggerDelay={blockStagger}
            isRevealed={isRevealed}
            mosaicProgress={mosaicProgress}
            mosaicPosition={blockMosaic?.position}
            mosaicDimensions={blockMosaic?.dimensions}
          />
        );
      })}
    </group>
  );
}
