/**
 * Variant System Types
 *
 * Defines the shape of a stack variant — data + optional geometry/mosaic overrides.
 * Each variant is a self-contained configuration that can be swapped at runtime.
 */

import type { LayerData } from '../types';

// =============================================================================
// GEOMETRY OVERRIDES — variant-specific tweaks to config.ts defaults
// =============================================================================

export interface GeometryOverrides {
  /** Height of each layer block (default: from config.ts geometry.stack.layerHeight) */
  layerHeight?: number;
  /** Vertical gap between layers */
  gapVertical?: number;
  /** Horizontal gap between blocks in a layer */
  gapHorizontal?: number;
}

export interface MosaicOverrides {
  /** Number of columns in the flat mosaic grid */
  cols: number;
  /** Camera zoom when mosaic is fully assembled */
  finalZoom: number;
  /** Map of block ID → column span (default 1). Use to make blocks wider in mosaic. */
  spanBlocks?: Record<number, number>;
}

// =============================================================================
// STACK VARIANT — the main type
// =============================================================================

export interface StackVariant {
  /** Unique identifier used in URL ?variant= */
  id: string;
  /** Human-readable name for UI */
  name: string;
  /** Short description for variant selector */
  description: string;
  /** Layer data — ordered top-to-bottom geometrically */
  layers: LayerData[];
  /** Optional geometry overrides (merged with config.ts defaults) */
  geometryOverrides?: GeometryOverrides;
  /** Optional mosaic overrides (merged with config.ts defaults) */
  mosaicOverrides?: MosaicOverrides;
  /**
   * Scroll traversal direction through the stack.
   * - 'down' (default): start at top layer, scroll reveals downward
   * - 'up': start at bottom layer, scroll reveals upward toward top
   */
  scrollDirection?: 'down' | 'up';
}
