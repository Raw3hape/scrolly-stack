/**
 * V6 Exact-Flipped Variant — Physically inverted stack, top-down scroll
 *
 * Same 19 blocks as V4-Exact but layers are physically reversed:
 *   Bottom: Crown (Exit Plan · Robotics · Growth · IPO)
 *   ...singles in reverse...
 *   Triple: Systems · Playbooks · Training
 *   Top: Data · People · Partnership
 *
 * scrollDirection: 'down' — user starts at Partnership (top), scrolls down to IPO (bottom).
 */

import { exactVariant } from './v4-exact';
import type { StackVariant } from './types';

export const exactFlippedVariant: StackVariant = {
  ...exactVariant,
  id: 'v6-exact-flipped',
  name: 'Exact ⇅',
  description: 'Flipped stack: crown at bottom, Partnership at top. Scroll ↓ top to bottom.',
  layers: [...exactVariant.layers].reverse(),
  scrollDirection: 'down',
};
