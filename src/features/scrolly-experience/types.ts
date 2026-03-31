/**
 * Types for the scrolly-experience feature module.
 *
 * Central type definitions — imported by all components.
 * Single source of truth for data shapes used by data.ts, config.ts, and components.
 */

import type { SpringValue } from '@react-spring/three';

// =============================================================================
// LEVEL TYPE
// =============================================================================

export type Level = 'A' | 'B' | 'C';

// =============================================================================
// DATA TYPES — matches data.ts structure exactly
// =============================================================================

/** Individual block as stored in data.ts (no level — that lives on the layer) */
export interface RawBlockData {
  id: number;
  /** URL-safe identifier matching CONTENT.md block IDs (e.g. 'sales', 'operations') */
  slug?: string;
  label: string;
  tooltipTitle: string;
  tooltipSubhead: string;
  bullets: string[];
  /** Full description from CONTENT.md — used for SEO, noscript, future detail views */
  description?: string;
  color: string;
  gradientColorB: string;
  activeColor: string;
  activeGradientColorB: string;
  textColor: string;
  icon: string;
  slideDirection?: [number, number];
  /** Only present on grid layout blocks (Layer A) */
  gridPosition?: [number, number];
}

/**
 * Block with level — produced by flatMap in data.ts.
 * Used by Overlay, HoverTooltip, and any consumer that needs level context.
 */
export interface BlockData extends RawBlockData {
  level: Level;
}

/** Alias for clarity — blocks after flatMap are steps */
export type StepData = BlockData;

/** Computed block position from layoutUtils */
export interface ComputedBlock extends RawBlockData {
  position: [number, number, number];
  dimensions: [number, number, number];
}

// =============================================================================
// LAYER TYPES — discriminated union by layout
// =============================================================================

interface LayerBase {
  id: string;
  level: Level;
  gap?: number;
}

export interface GridLayer extends LayerBase {
  layout: 'grid';
  cols: number;
  rows: number;
  blocks: RawBlockData[];
}

export interface RowLayer extends LayerBase {
  layout: 'row';
  cols: number;
  depth?: number;
  align?: 'front' | 'center' | 'back';
  blocks: RawBlockData[];
}

export interface FullLayer extends LayerBase {
  layout: 'full';
  blocks: RawBlockData[];
}

/** Any layer — use in arrays and generic handlers */
export type LayerData = GridLayer | RowLayer | FullLayer;

// =============================================================================
// COMPONENT PROP TYPES
// =============================================================================

/** Mouse position for tooltips */
export interface MousePosition {
  x: number;
  y: number;
}

/** GradientShadowMaterial props */
export interface GradientShadowMaterialProps {
  colorA?: string;
  colorB?: string;
  isActive?: boolean;
  isHovered?: boolean;
  isHeroState?: boolean;
  animatedColorReveal?: SpringValue<number> | null;
  /** When true, skip useFrame computations for performance during mosaic transition */
  isMosaicTransitioning?: boolean;
}

/** BlockLabel sub-component props */
export interface BlockLabelProps {
  text: string;
  dimensions: [number, number, number];
  color?: string;
  opacity?: number;
  /** Adaptive font size — scaled proportionally to cellSize by useAdaptiveMosaic */
  labelFontSize?: number;
  /** Adaptive max width — scaled proportionally to cellSize by useAdaptiveMosaic */
  labelMaxWidth?: number;
}

/** Block component props */
export interface BlockProps {
  position: [number, number, number];
  dimensions: [number, number, number];
  color: string;
  gradientColorB: string;
  activeColor: string;
  activeGradientColorB: string;
  textColor?: string;
  label: string;
  isActive: boolean;
  isAboveActive: boolean;
  /** Direction multiplier for already-seen block lift: 1 = up (forward), -1 = down (reverse) */
  aboveLiftSign?: number;
  /** True when the block is in a not-yet-seen layer above active (reverse only) — lifts UP to make room */
  isNotYetSeenAbove?: boolean;
  slideDirection?: [number, number];
  onClick?: (blockId: number) => void;
  onHoverChange?: (
    blockData: RawBlockData | null,
    isHovered: boolean,
    mousePos: MousePosition | null,
  ) => void;
  blockData?: RawBlockData;
  blockId?: number;
  opacity?: number;
  staggerDelay?: number;
  isRevealed?: boolean;
  /** Mosaic override: interpolated position from Stack orchestrator */
  mosaicPosition?: [number, number, number];
  /** Mosaic override: interpolated dimensions from Stack orchestrator */
  mosaicDimensions?: [number, number, number];
  /** Mosaic transition progress (0 = stack, >0 = transitioning) */
  mosaicProgress?: number;
  /** Adaptive label font size from useAdaptiveMosaic */
  labelFontSize?: number;
  /** Adaptive label max width from useAdaptiveMosaic */
  labelMaxWidth?: number;
}

/** Layer component props */
export interface LayerProps {
  layer: LayerData;
  baseY: number;
  currentStep: number;
  allBlocksAboveActive: number[];
  /** Direction multiplier for already-seen block lift: 1 = up (forward), -1 = down (reverse) */
  aboveLiftSign?: number;
  /** Block IDs of not-yet-seen layers above active (reverse only) — these lift UP */
  allBlocksNotYetSeenAbove?: number[];
  onBlockClick?: (blockId: number) => void;
  onBlockHover?: (
    blockData: RawBlockData | null,
    isHovered: boolean,
    mousePos: MousePosition | null,
  ) => void;
  opacity?: number;
  staggerDelay?: number;
  isRevealed?: boolean;
  /** Mosaic transition progress (0 = stack, >0 = transitioning) */
  mosaicProgress?: number;
  /** Pre-computed mosaic positions/dimensions per block id */
  mosaicBlockData?: Map<
    number,
    { position: [number, number, number]; dimensions: [number, number, number] }
  >;
  /** Adaptive label font size from useAdaptiveMosaic */
  labelFontSize?: number;
  /** Adaptive label max width from useAdaptiveMosaic */
  labelMaxWidth?: number;
}

/** Stack component props */
export interface StackProps {
  currentStep: number;
  mosaicProgress: number;
  onBlockClick?: (blockId: number) => void;
  onBlockHover?: (
    blockData: RawBlockData | null,
    isHovered: boolean,
    mousePos: MousePosition | null,
  ) => void;
}

/** HoverTooltip component props */
export interface HoverTooltipProps {
  hoveredBlock: RawBlockData | null;
  mousePosition: MousePosition | null;
}

/** Scene component props */
export interface SceneProps {
  currentStep: number;
  mosaicProgress: number;
  onBlockClick?: (blockId: number) => void;
}

/** Overlay component props */
export interface OverlayProps {
  currentStep: number;
  setStep: (step: number) => void;
  mosaicTriggerRef: React.RefObject<HTMLDivElement | null>;
}
