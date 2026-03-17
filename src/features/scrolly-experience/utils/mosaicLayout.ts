/**
 * Mosaic Layout — Grid positions + trajectory pre-computation
 *
 * Pure functions — no React, no side effects. Computes target positions
 * for the flat mosaic grid and arc control points for the transition.
 *
 * Single-phase: blocks fly directly from stack → grid along Bezier arcs.
 * No scatter/explode phases — clean and simple.
 */

import { mosaic } from '../config';
import type { ComputedBlock } from '../types';

// =============================================================================
// GRID POSITION CALCULATOR
// =============================================================================

/**
 * Calculate flat grid positions for all blocks in the mosaic.
 * Returns centered [x, y, z] for each block index.
 *
 * Grid is on the XZ plane (horizontal) — viewed from top-down camera.
 * All blocks at y=0, spread on x (columns) and z (rows).
 */
export function calculateMosaicPositions(
  totalBlocks: number,
  cols?: number,
): [number, number, number][] {
  const c = cols ?? mosaic.cols;
  const rows = Math.ceil(totalBlocks / c);
  const { cellSize, gap } = mosaic;

  // Total grid dimensions
  const gridWidth = c * cellSize + (c - 1) * gap;
  const gridDepth = rows * cellSize + (rows - 1) * gap;

  const positions: [number, number, number][] = [];

  for (let i = 0; i < totalBlocks; i++) {
    const col = i % c;
    const row = Math.floor(i / c);

    // Center the grid: origin at center, spread on X and Z
    const x = -gridWidth / 2 + cellSize / 2 + col * (cellSize + gap);
    const y = 0; // flat on the horizontal plane
    const z = -gridDepth / 2 + cellSize / 2 + row * (cellSize + gap);

    positions.push([x, y, z]);
  }

  return positions;
}

/**
 * Get uniform mosaic block dimensions (square tiles on XZ plane, thin Y).
 */
export function getMosaicDimensions(): [number, number, number] {
  return [mosaic.cellSize, mosaic.blockHeight, mosaic.cellSize];
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
): [number, number, number] {
  const midX = (stackPos[0] + mosaicPos[0]) / 2;
  const midY = (stackPos[1] + mosaicPos[1]) / 2;
  const midZ = (stackPos[2] + mosaicPos[2]) / 2;

  const dx = mosaicPos[0] - stackPos[0];
  const dy = mosaicPos[1] - stackPos[1];
  const dz = mosaicPos[2] - stackPos[2];
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

  // Lift proportional to distance — longer flights = higher arcs
  const lift = 1.5 + distance * mosaic.arc.heightFactor;

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
): BlockTrajectory[] {
  const totalBlocks = blocks.length;
  const mosaicPositions = calculateMosaicPositions(totalBlocks);
  const mosaicDims = getMosaicDimensions();

  return blocks.map((block, index) => {
    const arcControl = calculateArcControlPoint(
      block.position,
      mosaicPositions[index],
    );

    return {
      stackPosition: block.position,
      stackDimensions: block.dimensions,
      arcControlPoint: arcControl,
      mosaicPosition: mosaicPositions[index],
      mosaicDimensions: mosaicDims,
    };
  });
}
