/**
 * V7 Progressive Variant — Layers build one at a time during scroll
 *
 * Same 19 blocks as V4-Exact, same layer order (Partnership at bottom, Crown at top).
 * Difference: buildMode='progressive' — layers appear one at a time as the user scrolls,
 * creating a bottom-up building effect.
 *
 * Layer order (bottom → top, same as v4-exact):
 *   Partnership · People · Data
 *   Systems · Playbooks · Training (triple)
 *   Sales · Production · Marketing · Automation · Finance · Intelligence · AI Agents · Procurement · ESO
 *   Exit Plan · Robotics · Growth · IPO (crown)
 *
 * scrollDirection: 'down' — user scrolls down to add layers.
 * buildMode: 'progressive' — layers appear one at a time.
 */

import { exactVariant } from './v4-exact';
import type { StackVariant } from './types';

export const progressiveVariant: StackVariant = {
  ...exactVariant,
  id: 'v7-progressive',
  name: 'Progressive',
  description: 'Layers build one at a time. Scroll ↓ from Partnership (bottom) to IPO crown (top).',
  scrollDirection: 'down',
  buildMode: 'progressive',
};
