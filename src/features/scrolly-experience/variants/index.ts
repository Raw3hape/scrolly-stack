/**
 * Variants — barrel export
 */
export type { StackVariant, GeometryOverrides, MosaicOverrides } from './types';
export { classicVariant } from './classic';
export { journeyVariant } from './v2-journey';
export { getVariant, getAllVariants, DEFAULT_VARIANT_ID } from './registry';
