/**
 * Mosaic Layout — Grid positions + trajectory pre-computation
 *
 * Pure functions — no React, no side effects. Computes target positions
 * for the flat mosaic grid and arc control points for the transition.
 *
 * Single-phase: blocks fly directly from stack → grid along Bezier arcs.
 * No scatter/explode phases — clean and simple.
 *
 * VARIANT SYSTEM: accepts mosaic config as parameter (dependency injection).
 */

import type { ResolvedMosaic } from '../VariantContext';
import type { ComputedBlock } from '../types';

// =============================================================================
// GRID POSITION CALCULATOR
// =============================================================================

/**
 * Mosaic position result with per-block dimensions (to support column spans).
 */
export interface MosaicBlockPosition {
  position: [number, number, number];
  dimensions: [number, number, number];
}

/**
 * Count how many rows the mosaic grid will have for given blocks and layout.
 * Pure function — no side effects, no React dependency.
 *
 * @param blocks - Computed blocks with IDs (used for spanBlocks lookup)
 * @param cols - Number of columns in the grid
 * @param spanBlocks - Map of block ID → column span (default 1)
 * @returns Number of rows needed
 */
export function getMosaicRows(
  blocks: ComputedBlock[],
  cols: number,
  spanBlocks?: Record<number, number>,
): number {
  const spanMap = spanBlocks ?? {};
  let totalCols = 0;
  for (const block of blocks) {
    const span = Math.min(spanMap[block.id] ?? 1, cols); // clamp span to cols
    if (totalCols % cols !== 0 && (totalCols % cols) + span > cols) {
      totalCols = Math.ceil(totalCols / cols) * cols;
    }
    totalCols += span;
  }
  return Math.ceil(totalCols / cols);
}

/**
 * Calculate flat grid positions for all blocks in the mosaic.
 * Supports spanBlocks — blocks that occupy multiple columns.
 *
 * Grid is on the XZ plane (horizontal) — viewed from top-down camera.
 * All blocks at y=0, spread on x (columns) and z (rows).
 */
export function calculateMosaicPositions(
  blocks: ComputedBlock[],
  mosaicCfg: ResolvedMosaic,
): MosaicBlockPosition[] {
  const c = mosaicCfg.cols;
  const { cellSize, gap, blockHeight } = mosaicCfg;
  const spanMap = mosaicCfg.spanBlocks ?? {};

  const rows = getMosaicRows(blocks, c, mosaicCfg.spanBlocks);

  // Total grid dimensions
  const gridWidth = c * cellSize + (c - 1) * gap;
  const gridDepth = rows * cellSize + (rows - 1) * gap;

  const result: MosaicBlockPosition[] = [];
  let col = 0;
  let row = 0;

  for (const block of blocks) {
    const span = spanMap[block.id] ?? 1;

    // If this block won't fit in the current row, wrap
    if (col + span > c) {
      col = 0;
      row++;
    }

    // Block width accounts for span: span cells + (span-1) gaps
    const blockWidth = span * cellSize + (span - 1) * gap;

    // X position: center of the spanned area
    const startX = -gridWidth / 2 + cellSize / 2;
    const x = startX + col * (cellSize + gap) + (blockWidth - cellSize) / 2;
    const y = 0;
    const z = -gridDepth / 2 + cellSize / 2 + row * (cellSize + gap);

    result.push({
      position: [x, y, z],
      dimensions: [blockWidth, blockHeight, cellSize],
    });

    col += span;
    if (col >= c) {
      col = 0;
      row++;
    }
  }

  return result;
}

// =============================================================================
// ARC CONTROL POINT (simple midpoint lift)
// =============================================================================

/**
 * Calculate the Bezier arc control point between stack and mosaic positions.
 * Raises the midpoint above the straight line for a smooth arc.
 */
export function calculateArcControlPoint(
  stackPos: [number, number, number],
  mosaicPos: [number, number, number],
  mosaicCfg: ResolvedMosaic,
): [number, number, number] {
  const midX = (stackPos[0] + mosaicPos[0]) / 2;
  const midY = (stackPos[1] + mosaicPos[1]) / 2;
  const midZ = (stackPos[2] + mosaicPos[2]) / 2;

  const dx = mosaicPos[0] - stackPos[0];
  const dy = mosaicPos[1] - stackPos[1];
  const dz = mosaicPos[2] - stackPos[2];
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

  // Lift proportional to distance — longer flights = higher arcs
  const lift = 1.5 + distance * mosaicCfg.arc.heightFactor;

  return [midX, midY + lift, midZ];
}

// =============================================================================
// PRE-COMPUTED TRAJECTORIES (cached per session)
// =============================================================================

export interface BlockTrajectory {
  stackPosition: [number, number, number];
  stackDimensions: [number, number, number];
  arcControlPoint: [number, number, number];
  mosaicPosition: [number, number, number];
  mosaicDimensions: [number, number, number];
}

/**
 * Pre-compute all trajectories for all blocks.
 * Call once when blocks are set up, cache the result.
 */
export function precomputeTrajectories(
  blocks: ComputedBlock[],
  mosaicCfg: ResolvedMosaic,
): BlockTrajectory[] {
  const mosaicBlocks = calculateMosaicPositions(blocks, mosaicCfg);

  return blocks.map((block, index) => {
    const mosaic = mosaicBlocks[index];
    const arcControl = calculateArcControlPoint(block.position, mosaic.position, mosaicCfg);

    return {
      stackPosition: block.position,
      stackDimensions: block.dimensions,
      arcControlPoint: arcControl,
      mosaicPosition: mosaic.position,
      mosaicDimensions: mosaic.dimensions,
    };
  });
}
