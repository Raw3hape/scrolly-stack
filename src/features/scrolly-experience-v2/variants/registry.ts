/**
 * Variant Registry — Single source of truth for all available variants.
 *
 * Usage:
 *   getVariant('classic')          → StackVariant
 *   getVariant('v2-journey')       → StackVariant
 *   getVariant('nonexistent')      → falls back to classic
 *   getAllVariants()               → StackVariant[] (for selector UI)
 */

import type { StackVariant } from './types';
import { classicVariant } from './classic';
import { journeyVariant } from './v2-journey';
import { reverseVariant } from './v3-reverse';
import { exactVariant } from './v4-exact';
import { exactDownVariant } from './v5-exact-down';
import { exactFlippedVariant } from './v6-exact-flipped';

export const DEFAULT_VARIANT_ID = 'v6-exact-flipped';

const registry = new Map<string, StackVariant>([
  [classicVariant.id, classicVariant],
  [journeyVariant.id, journeyVariant],
  [reverseVariant.id, reverseVariant],
  [exactVariant.id, exactVariant],
  [exactDownVariant.id, exactDownVariant],
  [exactFlippedVariant.id, exactFlippedVariant],
]);

/**
 * Get a variant by ID. Falls back to classic if not found.
 */
export function getVariant(id: string | null | undefined): StackVariant {
  if (!id) return registry.get(DEFAULT_VARIANT_ID)!;
  return registry.get(id) ?? registry.get(DEFAULT_VARIANT_ID)!;
}

/**
 * Get all registered variants (for selector UI).
 */
export function getAllVariants(): StackVariant[] {
  return Array.from(registry.values());
}
