/**
 * VariantContext — React Context for the active stack variant.
 *
 * Replaces direct `import { layers, steps } from '../data'` in Stack.tsx and Overlay.tsx.
 * Components call `useVariant()` to get layers, steps, and resolved geometry/mosaic config.
 *
 * Resolves geometry/mosaic overrides: variant overrides are merged on top of config.ts defaults.
 */

'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { getVariant } from './variants/registry';
import { geometry as defaultGeometry, mosaic as defaultMosaic } from './config';
import type { StackVariant } from './variants/types';
import type { LayerData, StepData } from './types';

// =============================================================================
// RESOLVED CONFIG TYPES
// =============================================================================

export interface ResolvedGeometry {
  stack: {
    totalWidth: number;
    totalDepth: number;
    layerHeight: number;
    borderRadius: number;
    smoothness: number;
  };
  gaps: {
    horizontal: number;
    vertical: number;
  };
}

export interface ResolvedMosaic {
  cols: number;
  cellSize: number;
  gap: number;
  blockHeight: number;
  arc: { heightFactor: number };
  motion: { viewStart: number; viewEnd: number; parallaxFadeEnd: number };
  sceneOffset: { stackY: number; mosaicY: number };
  camera: {
    position: [number, number, number];
    upVector: [number, number, number];
    pullbackZoom: number;
    finalZoom: number;
  };
  assemblyHeight: string;
  holdHeight: string;
  exitHeight: string;
  /** Map of block ID → column span in mosaic grid (default 1) */
  spanBlocks?: Record<number, number>;
}

// =============================================================================
// CONTEXT VALUE
// =============================================================================

export interface VariantContextValue {
  variant: StackVariant;
  layers: LayerData[];
  steps: StepData[];
  geometry: ResolvedGeometry;
  mosaicConfig: ResolvedMosaic;
  scrollDirection: 'down' | 'up';
  buildMode: 'instant' | 'progressive';
}

const VariantContext = createContext<VariantContextValue | null>(null);

// =============================================================================
// HOOK
// =============================================================================

/**
 * Access the active variant's data and resolved configuration.
 * Must be called within a <VariantProvider>.
 */
export function useVariant(): VariantContextValue {
  const ctx = useContext(VariantContext);
  if (!ctx) {
    throw new Error('useVariant() must be used within <VariantProvider>');
  }
  return ctx;
}

// =============================================================================
// PROVIDER
// =============================================================================

interface VariantProviderProps {
  variantId?: string | null;
  children: ReactNode;
}

export function VariantProvider({ variantId, children }: VariantProviderProps) {
  const value = useMemo<VariantContextValue>(() => {
    const variant = getVariant(variantId);

    // Derive steps from layers (same flatMap as original data.ts)
    const steps: StepData[] = variant.layers.flatMap(layer =>
      layer.blocks.map(block => ({
        ...block,
        level: layer.level,
      }))
    );

    // Merge geometry: config.ts defaults + variant overrides
    const geo = variant.geometryOverrides;
    const resolvedGeometry: ResolvedGeometry = {
      stack: {
        totalWidth: defaultGeometry.stack.totalWidth,
        totalDepth: defaultGeometry.stack.totalDepth,
        layerHeight: geo?.layerHeight ?? defaultGeometry.stack.layerHeight,
        borderRadius: defaultGeometry.stack.borderRadius,
        smoothness: defaultGeometry.stack.smoothness,
      },
      gaps: {
        horizontal: geo?.gapHorizontal ?? defaultGeometry.gaps.horizontal,
        vertical: geo?.gapVertical ?? defaultGeometry.gaps.vertical,
      },
    };

    // Merge mosaic: config.ts defaults + variant overrides
    const mos = variant.mosaicOverrides;
    const resolvedMosaic: ResolvedMosaic = {
      ...defaultMosaic,
      cols: mos?.cols ?? defaultMosaic.cols,
      camera: {
        ...defaultMosaic.camera,
        finalZoom: mos?.finalZoom ?? defaultMosaic.camera.finalZoom,
      },
      spanBlocks: mos?.spanBlocks,
    };

    return {
      variant,
      layers: variant.layers,
      steps,
      geometry: resolvedGeometry,
      mosaicConfig: resolvedMosaic,
      scrollDirection: variant.scrollDirection ?? 'down',
      buildMode: variant.buildMode ?? 'instant',
    };
  }, [variantId]);

  return (
    <VariantContext.Provider value={value}>
      {children}
    </VariantContext.Provider>
  );
}
