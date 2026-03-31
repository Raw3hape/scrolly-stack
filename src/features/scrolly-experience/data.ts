/**
 * Data Configuration for Scrolly-Stack
 *
 * @deprecated Use `variants/` module instead for variant-aware data.
 * This file re-exports the classic variant data for backward compatibility
 * with any consumers that still use `import { layers, steps } from './data'`.
 */

import type { LayerData, StepData } from './types';
import { classicVariant } from './variants/classic';

/** @deprecated Use useVariant() hook instead */
export const layers: LayerData[] = classicVariant.layers;

/** @deprecated Use useVariant() hook instead */
export const steps: StepData[] = classicVariant.layers.flatMap((layer) =>
  layer.blocks.map((block) => ({
    ...block,
    level: layer.level,
  })),
);

/** @deprecated Use useVariant() hook instead */
export function getStepById(id: number): StepData | undefined {
  return steps.find((step) => step.id === id);
}

/** @deprecated Use useVariant() hook instead */
export function getLayerByStepId(id: number): LayerData | undefined {
  return layers.find((layer) => layer.blocks.some((block) => block.id === id));
}
