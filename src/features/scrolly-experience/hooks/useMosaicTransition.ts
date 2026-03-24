/**
 * useMosaicTransition — Mosaic Trajectory Precomputation & Interpolation
 *
 * Precomputes Bezier arc trajectories from stack positions to mosaic grid
 * positions, and interpolates block positions/dimensions based on mosaic
 * progress. Encapsulates all mosaic transition math that was previously
 * inline in Stack.tsx.
 *
 * ARCHITECTURE: Called once per variant/geometry change to precompute
 * trajectories, then interpolates per-frame via mosaicProgress.
 * Returns a MosaicBlockDataMap (flat Record keyed by block ID) or
 * undefined when the transition hasn't started.
 */

import { useMemo } from 'react';
import { getLayerHeight, calculateBlockPositions } from '../utils/layoutUtils';
import type { ResolvedGeometry } from '../VariantContext';
import {
  precomputeTrajectories,
  type BlockTrajectory,
} from '../utils/mosaicLayout';
import {
  easeInOutCubic,
  lerpV3,
  quadraticBezierV3,
} from '../utils/easings';
import type { LayerData, ComputedBlock } from '../types';
import type { AdaptiveMosaicResult } from './useAdaptiveMosaic';

// =============================================================================
// TYPES
// =============================================================================

export interface MosaicBlockDatum {
  position: [number, number, number];
  dimensions: [number, number, number];
}

/** Block data lookup keyed by block ID */
export type MosaicBlockDataMap = Record<number, MosaicBlockDatum>;

// =============================================================================
// LAYOUT HELPERS
// =============================================================================

export function calculateLayerPositions(
  layers: LayerData[],
  geo: ResolvedGeometry,
): Array<{ layer: LayerData; baseY: number }> {
  let totalHeight = 0;
  layers.forEach((layer) => {
    totalHeight += getLayerHeight(layer, geo);
  });

  const positions: Array<{ layer: LayerData; baseY: number }> = [];
  let currentY = totalHeight / 2;

  for (const layer of layers) {
    positions.push({ layer, baseY: currentY });
    currentY -= getLayerHeight(layer, geo);
  }

  return positions;
}

export function collectAllBlocks(
  layerPositions: Array<{ layer: LayerData; baseY: number }>,
  geo: ResolvedGeometry,
): ComputedBlock[] {
  const allBlocks: ComputedBlock[] = [];
  for (const { layer, baseY } of layerPositions) {
    const blocks = calculateBlockPositions(layer, baseY, geo);
    allBlocks.push(...blocks);
  }
  return allBlocks;
}

// =============================================================================
// TRAJECTORY HELPERS
// =============================================================================

function computeArcControl(
  stack: [number, number, number],
  grid: [number, number, number],
): [number, number, number] {
  const midX = (stack[0] + grid[0]) / 2;
  const midY = (stack[1] + grid[1]) / 2;
  const midZ = (stack[2] + grid[2]) / 2;

  const dx = grid[0] - stack[0];
  const dy = grid[1] - stack[1];
  const dz = grid[2] - stack[2];
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

  const lift = 1.5 + distance * 0.5;

  return [midX, midY + lift, midZ];
}

/**
 * PERFORMANCE FIX #6: Returns a flat Record<blockId, data> instead of 2 Maps.
 * Eliminates 2 Map allocations per frame -> simple object keyed by ID.
 */
function interpolateMosaicPositions(
  progress: number,
  trajectories: BlockTrajectory[],
  allBlocks: ComputedBlock[],
): MosaicBlockDataMap {
  const t = easeInOutCubic(progress);
  const result: MosaicBlockDataMap = {};

  for (let i = 0; i < trajectories.length; i++) {
    const traj = trajectories[i];

    const pos = quadraticBezierV3(
      traj.stackPosition,
      traj.arcControlPoint,
      traj.mosaicPosition,
      t,
    );

    const dims = lerpV3(
      traj.stackDimensions,
      traj.mosaicDimensions,
      t,
    ) as [number, number, number];

    result[allBlocks[i].id] = { position: pos, dimensions: dims };
  }

  return result;
}

// =============================================================================
// HOOK
// =============================================================================

export interface MosaicTransitionResult {
  /** Pre-computed Bezier arc trajectories for all blocks */
  trajectories: BlockTrajectory[];
  /** Interpolated mosaic positions/dimensions, or undefined before transition starts */
  mosaicBlockData: MosaicBlockDataMap | undefined;
}

/**
 * Precompute mosaic trajectories and interpolate block positions during transition.
 *
 * @param allBlocks - All blocks with computed world positions and dimensions
 * @param adaptedMosaic - Viewport-adaptive mosaic configuration
 * @param mosaicProgress - Mosaic transition progress (0 = stack, 1 = full mosaic)
 * @param settleThreshold - Progress threshold before mosaic override kicks in
 */
export function useMosaicTransition(
  allBlocks: ComputedBlock[],
  adaptedMosaic: AdaptiveMosaicResult,
  mosaicProgress: number,
  settleThreshold: number,
): MosaicTransitionResult {
  const trajectories = useMemo(
    () => {
      const trajs = precomputeTrajectories(allBlocks, adaptedMosaic);
      return trajs.map((traj) => ({
        ...traj,
        arcControlPoint: computeArcControl(traj.stackPosition, traj.mosaicPosition),
      }));
    },
    [allBlocks, adaptedMosaic],
  );

  // Settle phase: delay mosaic override until viewStart threshold.
  // During 0 -> viewStart, springs return blocks to base positions (drop lift/slide).
  // This prevents the visible jerk when blocks teleport from lifted to mosaic start.
  const mosaicBlockData = useMemo((): MosaicBlockDataMap | undefined => {
    if (mosaicProgress <= settleThreshold) return undefined;
    return interpolateMosaicPositions(mosaicProgress, trajectories, allBlocks);
  }, [mosaicProgress, settleThreshold, trajectories, allBlocks]);

  return {
    trajectories,
    mosaicBlockData,
  };
}
