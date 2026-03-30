/**
 * Variants — barrel export
 */
export type { StackVariant, GeometryOverrides, MosaicOverrides } from './types';
export { classicVariant } from './classic';
export { journeyVariant } from './v2-journey';
export { exactVariant } from './v4-exact';
export { exactDownVariant } from './v5-exact-down';
export { exactFlippedVariant } from './v6-exact-flipped';
export { getVariant, getAllVariants, DEFAULT_VARIANT_ID } from './registry';
