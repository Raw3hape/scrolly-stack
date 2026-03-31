import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, expect, it } from 'vitest';
import { palette } from '@/config/palette';

const ROOT = resolve(__dirname, '../..');
const colorsCSS = readFileSync(resolve(ROOT, 'src/styles/tokens/colors.css'), 'utf-8');

describe('palette sync', () => {
  it('palette.ts has no empty values', () => {
    for (const [key, value] of Object.entries(palette)) {
      expect(value, `palette.${key} is empty`).toBeTruthy();
    }
  });

  it('all palette hex values are valid', () => {
    for (const [key, value] of Object.entries(palette)) {
      expect(value, `palette.${key} is not a valid hex`).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('key palette colors exist in colors.css', () => {
    // Check a representative subset — the full sync check is done by check-palette-sync.mjs
    const spotChecks = ['anchor900', 'teal500', 'green500', 'sand100', 'gold500'] as const;
    for (const key of spotChecks) {
      const hex = palette[key].toLowerCase();
      expect(colorsCSS.toLowerCase(), `${key} (${hex}) not found in colors.css`).toContain(hex);
    }
  });
});
