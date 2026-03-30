/**
 * Layer Component
 *
 * Renders a layer of blocks based on layout configuration.
 * Uses layout utilities for position calculations.
 * Passes through mosaic data to blocks when transitioning.
 *
 * PROGRESSIVE MODE: Per-block opacity is controlled by visibleBlockIds.
 * buildOffsetY is applied imperatively by Block.tsx via BuildOffsetContext.
 */

import Block from './Block';
import { calculateBlockPositions } from '../utils/layoutUtils';
import { useVariant } from '../VariantContext';
import { animation } from '../config';
import type { LayerProps, ComputedBlock } from '../types';
import type { MosaicBlockDataMap } from './Stack';

interface LayerExtraProps {
  mosaicBlockData?: MosaicBlockDataMap;
  aboveLiftSign?: number;
  /** Set of block IDs that should be visible (progressive mode) */
  visibleBlockIds?: Set<number>;
}

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
  labelFontSize,
  labelMaxWidth,
  visibleBlockIds,
}: Omit<LayerProps, 'mosaicBlockData'> & LayerExtraProps) {
  const { geometry, buildMode } = useVariant();
  const blocks: ComputedBlock[] = calculateBlockPositions(layer, baseY, geometry);
  const disableSlide = buildMode === 'progressive';
  const isProgressive = buildMode === 'progressive';

  // Progressive mode: Layer is always visible — each Block controls its own
  // visibility via visible={false} on its buildGroupRef. This allows exit
  // animations to play (block flies up) without the parent cutting them off.
  // Instant mode: Layer controls visibility at layer level.
  const isLayerVisible = isProgressive ? true : (opacity > 0 || mosaicProgress > 0);

  return (
    <group visible={isLayerVisible}>
      {blocks.map((block, blockIndex) => {
        const isActive = currentStep === block.id;
        const isAboveActive = allBlocksAboveActive.includes(block.id);
        const isNotYetSeenAbove = allBlocksNotYetSeenAbove.includes(block.id);
        const blockStagger = staggerDelay + (blockIndex * 30);

        // Per-block opacity: progressive mode checks visibleBlockIds
        const blockOpacity = isProgressive
          ? (visibleBlockIds?.has(block.id) ? 1 : 0)
          : opacity;

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
            opacity={blockOpacity}
            staggerDelay={blockStagger}
            isRevealed={isRevealed}
            mosaicProgress={mosaicProgress}
            mosaicPosition={blockMosaic?.position}
            mosaicDimensions={blockMosaic?.dimensions}
            labelFontSize={labelFontSize}
            labelMaxWidth={labelMaxWidth}
            disableSlide={disableSlide}
          />
        );
      })}
    </group>
  );
}
