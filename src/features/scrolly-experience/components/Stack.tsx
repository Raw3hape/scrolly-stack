/**
 * Stack Component
 *
 * Data-driven container that renders all layers.
 * Reads layer configurations from data.ts and calculates "above active" logic.
 */

import { useMemo } from 'react';
import Layer from './Layer';
import { getLayerHeight } from '../utils/layoutUtils';
import { layers, steps } from '../data';
import type { StackProps, LayerData, StepData } from '../types';

/** Calculate which blocks should be in "above active" state */
function calculateBlocksAboveActive(currentStep: number): number[] {
  if (currentStep === -1) return [];

  const activeStep = (steps as StepData[]).find((s) => s.id === currentStep);
  if (!activeStep) return [];

  const activeLevel = activeStep.level;
  const aboveIds: number[] = [];

  (steps as StepData[]).forEach((step) => {
    if (step.id === currentStep) return;

    const stepLevel = step.level;

    if (activeLevel === 'C') {
      if (stepLevel === 'A' || stepLevel === 'B') {
        aboveIds.push(step.id);
      }
      if (stepLevel === 'C' && step.id < currentStep) {
        aboveIds.push(step.id);
      }
    } else if (activeLevel === 'B') {
      if (stepLevel === 'A') {
        aboveIds.push(step.id);
      }
    }
  });

  return aboveIds;
}

/** Calculate layer Y positions */
function calculateLayerPositions(): Array<{ layer: LayerData; baseY: number }> {
  let totalHeight = 0;
  (layers as LayerData[]).forEach((layer) => {
    totalHeight += getLayerHeight(layer);
  });

  const positions: Array<{ layer: LayerData; baseY: number }> = [];
  let currentY = totalHeight / 2;

  for (const layer of layers as LayerData[]) {
    positions.push({ layer, baseY: currentY });
    currentY -= getLayerHeight(layer);
  }

  return positions;
}

/** Calculate opacity for each layer based on current step */
function calculateLayerOpacity(layer: LayerData, currentStep: number): number {
  if (currentStep === -1) {
    return layer.level === 'A' ? 1 : 0;
  }
  return 1;
}

/** Stack Component */
export default function Stack({ currentStep, onBlockClick, onBlockHover }: StackProps) {
  const blocksAboveActive = useMemo(
    () => calculateBlocksAboveActive(currentStep),
    [currentStep]
  );

  const layerPositions = useMemo(() => calculateLayerPositions(), []);

  const isRevealed = currentStep !== -1;

  return (
    <group position={[0, -1, 0]}>
      {layerPositions.map(({ layer, baseY }, index) => {
        const opacity = calculateLayerOpacity(layer, currentStep);
        const staggerDelay = index * 100;

        return (
          <Layer
            key={layer.id}
            layer={layer}
            baseY={baseY}
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
