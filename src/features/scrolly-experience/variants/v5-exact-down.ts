/**
 * V5 Exact-Down Variant — Same as V4-Exact, scroll top→bottom
 *
 * Identical blocks/colors/geometry to Exact, but scrollDirection='down':
 * - Hero state shows TOP layer (Crown: Exit Plan · Robotics · Growth · IPO)
 * - Scrolling reveals layers downward toward Partnership at the bottom
 * - Overlay panels are in natural top-to-bottom order
 */

import { exactVariant } from './v4-exact';
import type { StackVariant } from './types';

export const exactDownVariant: StackVariant = {
  ...exactVariant,
  id: 'v5-exact-down',
  name: 'Exact ↓',
  description: 'Same stack as Exact. Scroll ↓ from IPO crown (top) to Partnership (bottom).',
  scrollDirection: 'down',
};
