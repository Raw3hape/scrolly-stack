/**
 * Types for the scrolly-experience feature module.
 *
 * Central type definitions — imported by all components.
 * Keep in sync with data.js structure.
 */

import type { SpringValue } from '@react-spring/three';

// =============================================================================
// DATA TYPES (mirrors data.js structure)
// =============================================================================

/** Individual block within a layer */
export interface BlockData {
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
  level: 'A' | 'B' | 'C';
  slideDirection?: [number, number];
}

/** Layer (A, B, or C) containing multiple blocks */
export interface LayerData {
  id: string;
  level: 'A' | 'B' | 'C';
  layout: string;
  blocks: BlockData[];
}

/** Step derived from block data for the Overlay */
export interface StepData extends BlockData {
  // steps = blocks with additional derived fields from data.js
}

/** Computed block position from layoutUtils */
export interface ComputedBlock extends BlockData {
  position: [number, number, number];
  dimensions: [number, number, number];
}

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
  onHoverChange?: (blockData: BlockData | null, isHovered: boolean, mousePos: MousePosition | null) => void;
  blockData?: BlockData;
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
  onBlockHover?: (blockData: BlockData | null, isHovered: boolean, mousePos: MousePosition | null) => void;
  opacity?: number;
  staggerDelay?: number;
  isRevealed?: boolean;
}

/** Stack component props */
export interface StackProps {
  currentStep: number;
  onBlockClick?: (blockId: number) => void;
  onBlockHover?: (blockData: BlockData | null, isHovered: boolean, mousePos: MousePosition | null) => void;
}

/** HoverTooltip component props */
export interface HoverTooltipProps {
  hoveredBlock: BlockData | null;
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
