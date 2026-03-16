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
  label: string;
  tooltipTitle: string;
  tooltipSubhead: string;
  bullets: string[];
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
}

/** BlockLabel sub-component props */
export interface BlockLabelProps {
  text: string;
  dimensions: [number, number, number];
  color?: string;
  opacity?: number;
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
  slideDirection?: [number, number];
  onClick?: (blockId: number) => void;
  onHoverChange?: (blockData: RawBlockData | null, isHovered: boolean, mousePos: MousePosition | null) => void;
  blockData?: RawBlockData;
  blockId?: number;
  opacity?: number;
  staggerDelay?: number;
  isRevealed?: boolean;
}

/** Layer component props */
export interface LayerProps {
  layer: LayerData;
  baseY: number;
  currentStep: number;
  allBlocksAboveActive: number[];
  onBlockClick?: (blockId: number) => void;
  onBlockHover?: (blockData: RawBlockData | null, isHovered: boolean, mousePos: MousePosition | null) => void;
  opacity?: number;
  staggerDelay?: number;
  isRevealed?: boolean;
}

/** Stack component props */
export interface StackProps {
  currentStep: number;
  onBlockClick?: (blockId: number) => void;
  onBlockHover?: (blockData: RawBlockData | null, isHovered: boolean, mousePos: MousePosition | null) => void;
}

/** HoverTooltip component props */
export interface HoverTooltipProps {
  hoveredBlock: RawBlockData | null;
  mousePosition: MousePosition | null;
}

/** Scene component props */
export interface SceneProps {
  currentStep: number;
  onBlockClick?: (blockId: number) => void;
}

/** Overlay component props */
export interface OverlayProps {
  currentStep: number;
  setStep: (step: number) => void;
}
