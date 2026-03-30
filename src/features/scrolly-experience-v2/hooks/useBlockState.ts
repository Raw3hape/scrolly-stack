/**
 * useBlockState — Block State Management
 *
 * Computes which blocks are active, revealed, and above-active based on
 * the current step, scroll direction, and mosaic progress. Centralizes
 * all block-state logic that was previously inline in Stack.tsx.
 *
 * ARCHITECTURE: Pure derived state — no side effects. Returns stable
 * memoized arrays that drive Layer/Block rendering props.
 */

import { useMemo } from 'react';
import { isHeroStep, HERO_STEP } from '../utils/stepNavigation';
import type { LayerData, StepData } from '../types';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * VARIANT-SAFE: Uses layer indices.
 * scrollDirection='down': layers with LOWER index = "already seen" (above)
 * scrollDirection='up':   layers with HIGHER index = "already seen" (below, seen first)
 */
function calculateBlocksAboveActive(
  currentStep: number,
  layers: LayerData[],
  _steps: StepData[],
  scrollDirection: 'down' | 'up',
): number[] {
  if (isHeroStep(currentStep)) return [];

  const activeLayerIndex = layers.findIndex(layer =>
    layer.blocks.some(block => block.id === currentStep)
  );
  if (activeLayerIndex < 0) return [];

  const aboveIds: number[] = [];

  layers.forEach((layer, layerIndex) => {
    const isAlreadySeen = scrollDirection === 'up'
      ? layerIndex > activeLayerIndex   // bottom-to-top: higher index = seen first
      : layerIndex < activeLayerIndex;  // top-to-bottom: lower index = seen first

    if (isAlreadySeen) {
      layer.blocks.forEach(block => aboveIds.push(block.id));
    } else if (layerIndex === activeLayerIndex) {
      // Use array index (not block ID) to determine reveal order within a layer.
      // Block IDs may not be sequential after reordering (e.g. reversed crown).
      const activeBlockIndex = layer.blocks.findIndex(b => b.id === currentStep);
      layer.blocks.forEach((block, blockIndex) => {
        if (block.id !== currentStep) {
          const isBlockAlreadySeen = scrollDirection === 'up'
            ? blockIndex > activeBlockIndex
            : blockIndex < activeBlockIndex;
          if (isBlockAlreadySeen) {
            aboveIds.push(block.id);
          }
        }
      });
    }
  });

  return aboveIds;
}

// =============================================================================
// HOOK
// =============================================================================

export interface BlockStateResult {
  /** Effective step: HERO_STEP when mosaic is active, real step otherwise */
  effectiveStep: number;
  /** Block IDs that are "above" the active block (already seen) */
  blocksAboveActive: number[];
  /** Lift direction multiplier: +1 (up, forward) or -1 (down, reverse) */
  aboveLiftSign: number;
  /** Block IDs of not-yet-seen layers above active (reverse scroll only) */
  blocksNotYetSeenAbove: number[];
  /** Whether blocks should be in their revealed (visible) state */
  isRevealed: boolean;
}

/**
 * Compute block state from current step, scroll direction, and mosaic progress.
 *
 * @param currentStep - The real current step ID
 * @param mosaicProgress - Mosaic transition progress (0 = stack, >0 = transitioning)
 * @param layers - All layer data from variant config
 * @param steps - All step data from variant config
 * @param scrollDirection - 'down' or 'up'
 */
export function useBlockState(
  currentStep: number,
  mosaicProgress: number,
  layers: LayerData[],
  steps: StepData[],
  scrollDirection: 'down' | 'up',
  buildMode: 'instant' | 'progressive' = 'instant',
): BlockStateResult {
  // When mosaicProgress > 0, ALL blocks must return to their base positions
  // (no slide, no lift) BEFORE the Bezier arc begins. Setting effectiveStep
  // = HERO_STEP makes isActive = false and isAboveActive = [] for every block.
  const effectiveStep = mosaicProgress > 0 ? HERO_STEP : currentStep;

  const blocksAboveActive = useMemo(
    () => calculateBlocksAboveActive(effectiveStep, layers, steps, scrollDirection),
    [effectiveStep, layers, steps, scrollDirection]
  );

  // Lift direction: forward(down) = UP (+1), reverse(up) = DOWN (-1)
  const aboveLiftSign = scrollDirection === 'up' ? -1 : 1;

  // For reverse: layers ABOVE active haven't been seen yet but occlude it.
  // They must lift UP to make room, mirroring how forward lifts already-seen layers.
  const blocksNotYetSeenAbove = useMemo(() => {
    if (scrollDirection !== 'up' || isHeroStep(effectiveStep)) return [];
    const activeLayerIndex = layers.findIndex(layer =>
      layer.blocks.some(block => block.id === effectiveStep)
    );
    if (activeLayerIndex < 0) return [];
    const ids: number[] = [];
    layers.forEach((layer, idx) => {
      if (idx < activeLayerIndex) {
        layer.blocks.forEach(b => ids.push(b.id));
      }
    });
    return ids;
  }, [scrollDirection, effectiveStep, layers]);

  // Keep real step — blocks stay visible during mosaic.
  // Progressive mode: always revealed (layers animate in individually via opacity).
  const isRevealed = buildMode === 'progressive' ? true : !isHeroStep(currentStep);

  return {
    effectiveStep,
    blocksAboveActive,
    aboveLiftSign,
    blocksNotYetSeenAbove,
    isRevealed,
  };
}
