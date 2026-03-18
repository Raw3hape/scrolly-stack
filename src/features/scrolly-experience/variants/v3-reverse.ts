/**
 * V3 Reverse Variant — Same content as Journey, scroll bottom→top
 *
 * Identical blocks/colors/geometry to Journey, but scrollDirection='up':
 * - Hero state shows BOTTOM layer (Partnership)
 * - Scrolling reveals layers upward toward IPO at the top
 * - Overlay panels are reversed so bottom blocks appear first
 */

import { journeyVariant } from './v2-journey';
import type { StackVariant } from './types';

export const reverseVariant: StackVariant = {
  ...journeyVariant,
  id: 'v3-reverse',
  name: 'Reverse',
  description: 'Bottom → Top: start at Partnership, scroll upward to IPO.',
  scrollDirection: 'up',
};
