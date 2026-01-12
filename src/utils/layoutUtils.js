/**
 * Layer Utilities
 * 
 * Shared functions for layer position calculations.
 */

import { geometry } from '../config';

/**
 * Get the total height consumed by a layer
 */
export function getLayerHeight(layer) {
  const { layerHeight } = geometry.stack;
  const gapV = layer.gap ?? geometry.gaps.vertical;
  
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
export function calculateGridPositions(layer, baseY) {
  const { cols, rows, blocks, gap } = layer;
  const { totalWidth, totalDepth, layerHeight } = geometry.stack;
  const gapH = gap ?? geometry.gaps.horizontal;
  
  // Calculate individual cell size
  const cellWidth = (totalWidth - gapH * (cols - 1)) / cols;
  const cellDepth = (totalDepth - gapH * (rows - 1)) / rows;
  
  return blocks.map(block => {
    const [row, col] = block.gridPosition;
    
    // Calculate center position for this cell
    // Grid origin is at center (0, 0), so we offset from there
    const startX = -totalWidth / 2 + cellWidth / 2;
    const startZ = -totalDepth / 2 + cellDepth / 2;
    
    const x = startX + col * (cellWidth + gapH);
    const z = startZ + row * (cellDepth + gapH);
    
    return {
      ...block,
      position: [x, baseY, z],
      dimensions: [cellWidth, layerHeight, cellDepth],
    };
  });
}

/**
 * Calculate block positions for a ROW layout (e.g., 3 buttons in a row)
 */
export function calculateRowPositions(layer, baseY) {
  const { cols, blocks, depth, align = 'front', gap } = layer;
  const { totalWidth, totalDepth, layerHeight } = geometry.stack;
  const gapH = gap ?? geometry.gaps.horizontal;
  
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
  
  return blocks.map((block, index) => {
    // Calculate X position: center the row
    const startX = -totalWidth / 2 + blockWidth / 2;
    const x = startX + index * (blockWidth + gapH);
    
    return {
      ...block,
      position: [x, baseY, zOffset],
      dimensions: [blockWidth, layerHeight, blockDepth],
    };
  });
}

/**
 * Calculate block positions for a FULL layout (full-width tiles)
 */
export function calculateFullPositions(layer, baseY) {
  const { blocks, gap } = layer;
  const { totalWidth, totalDepth, layerHeight } = geometry.stack;
  const gapV = gap ?? geometry.gaps.vertical;
  
  return blocks.map((block, index) => {
    // Each block is on its own sub-layer
    const y = baseY - index * (layerHeight + gapV);
    
    return {
      ...block,
      position: [0, y, 0],
      dimensions: [totalWidth, layerHeight, totalDepth],
    };
  });
}

/**
 * Calculate positions based on layout type
 */
export function calculateBlockPositions(layer, baseY) {
  switch (layer.layout) {
    case 'grid':
      return calculateGridPositions(layer, baseY);
    case 'row':
      return calculateRowPositions(layer, baseY);
    case 'full':
      return calculateFullPositions(layer, baseY);
    default:
      console.warn(`Unknown layout type: ${layer.layout}`);
      return [];
  }
}
