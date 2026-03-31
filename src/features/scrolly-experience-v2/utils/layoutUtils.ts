/**
 * Layer Utilities
 *
 * Shared functions for layer position calculations.
 *
 * VARIANT SYSTEM: All functions accept geometry config as a parameter
 * (dependency injection) instead of importing from ../config directly.
 * This allows different variants to use different geometry settings.
 */

import type {
  LayerData,
  GridLayer,
  RowLayer,
  FullLayer,
  ComputedBlock,
  RawBlockData,
} from '../types';
import type { ResolvedGeometry } from '../VariantContext';

/**
 * Get the total height consumed by a layer
 */
export function getLayerHeight(layer: LayerData, geo: ResolvedGeometry): number {
  const { layerHeight } = geo.stack;
  const gapV = layer.gap ?? geo.gaps.vertical;

  if (layer.layout === 'full') {
    // Full layout has stacked blocks
    return layer.blocks.length * (layerHeight + gapV);
  }

  // Grid and row layouts are single-height
  return layerHeight + gapV;
}

/**
 * Calculate block positions for a GRID layout (e.g., 2x2 quadrants)
 */
export function calculateGridPositions(
  layer: GridLayer,
  baseY: number,
  geo: ResolvedGeometry,
): ComputedBlock[] {
  const { cols, rows, blocks, gap } = layer;
  const { totalWidth, totalDepth, layerHeight } = geo.stack;
  const gapH = gap ?? geo.gaps.horizontal;

  // Calculate individual cell size
  const cellWidth = (totalWidth - gapH * (cols - 1)) / cols;
  const cellDepth = (totalDepth - gapH * (rows - 1)) / rows;

  return blocks.map((block) => {
    const [row, col] = block.gridPosition!;

    // Calculate center position for this cell
    // Grid origin is at center (0, 0), so we offset from there
    const startX = -totalWidth / 2 + cellWidth / 2;
    const startZ = -totalDepth / 2 + cellDepth / 2;

    const x = startX + col * (cellWidth + gapH);
    const z = startZ + row * (cellDepth + gapH);

    return {
      ...block,
      position: [x, baseY, z] as [number, number, number],
      dimensions: [cellWidth, layerHeight, cellDepth] as [number, number, number],
    };
  });
}

/**
 * Calculate block positions for a ROW layout (e.g., 3 buttons in a row)
 */
export function calculateRowPositions(
  layer: RowLayer,
  baseY: number,
  geo: ResolvedGeometry,
): ComputedBlock[] {
  const { cols, blocks, depth, align = 'front', gap } = layer;
  const { totalWidth, totalDepth, layerHeight } = geo.stack;
  const gapH = gap ?? geo.gaps.horizontal;

  // Calculate individual block width
  const blockWidth = (totalWidth - gapH * (cols - 1)) / cols;
  const blockDepth = depth ?? totalDepth;

  // Calculate Z offset based on alignment
  let zOffset = 0;
  if (align === 'front') {
    zOffset = totalDepth / 2 - blockDepth / 2;
  } else if (align === 'back') {
    zOffset = -totalDepth / 2 + blockDepth / 2;
  }
  // 'center' = 0

  return blocks.map((block: RawBlockData, index: number) => {
    // Calculate X position: center the row
    const startX = -totalWidth / 2 + blockWidth / 2;
    const x = startX + index * (blockWidth + gapH);

    return {
      ...block,
      position: [x, baseY, zOffset] as [number, number, number],
      dimensions: [blockWidth, layerHeight, blockDepth] as [number, number, number],
    };
  });
}

/**
 * Calculate block positions for a FULL layout (full-width tiles)
 */
export function calculateFullPositions(
  layer: FullLayer,
  baseY: number,
  geo: ResolvedGeometry,
): ComputedBlock[] {
  const { blocks, gap } = layer;
  const { totalWidth, totalDepth, layerHeight } = geo.stack;
  const gapV = gap ?? geo.gaps.vertical;

  return blocks.map((block: RawBlockData, index: number) => {
    // Each block is on its own sub-layer
    const y = baseY - index * (layerHeight + gapV);

    return {
      ...block,
      position: [0, y, 0] as [number, number, number],
      dimensions: [totalWidth, layerHeight, totalDepth] as [number, number, number],
    };
  });
}

/**
 * Calculate positions based on layout type
 */
export function calculateBlockPositions(
  layer: LayerData,
  baseY: number,
  geo: ResolvedGeometry,
): ComputedBlock[] {
  switch (layer.layout) {
    case 'grid':
      return calculateGridPositions(layer, baseY, geo);
    case 'row':
      return calculateRowPositions(layer, baseY, geo);
    case 'full':
      return calculateFullPositions(layer, baseY, geo);
    default:
      console.warn(`Unknown layout type: ${(layer as LayerData).layout}`);
      return [];
  }
}
