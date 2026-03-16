---
description: How to add a new step/block to the 3D scrolly-experience
---

# Add a Scroll Step

Use this workflow when adding a new block to the 3D scrollytelling experience on the homepage.

## Steps

1. **Open the data file**: `src/features/scrolly-experience/data.ts`

2. **Add a new block to the appropriate layer** in the `layers` array:
   - Layer A (level 'A'): `layout: 'grid'` — needs `gridPosition: [row, col]`
   - Layer B (level 'B'): `layout: 'row'` — auto-positioned by column
   - Layer C (level 'C'): `layout: 'full'` — stacked vertically

3. **Block data shape** (see `types.ts` → `RawBlockData`):
   ```ts
   {
     id: <next sequential number>,
     label: 'Block Name',
     tooltipTitle: 'Card Title',
     tooltipSubhead: 'Subtitle text',
     bullets: ['Feature 1', 'Feature 2', 'Feature 3'],
     color: '#hexcolor',            // inactive state
     gradientColorB: '#hexcolor',   // gradient end
     activeColor: '#hexcolor',      // active state
     activeGradientColorB: '#hex',  // active gradient end
     textColor: '#ffffff',
     icon: 'M3 3v18h18V3H3z...',   // SVG path string (not a file reference)
   }
   ```

4. **Verify the `id` is unique** — `currentStep` uses block `.id`, not array index

5. **Check types compile**: `npm run typecheck`

6. **Check the layout**: `npm run dev` → scroll through all steps to verify positioning

7. **Run build**: `npm run build` to ensure no SSR issues

## Important Notes

- **Never modify `types.ts` without checking** — `LayerData` is a discriminated union, adding new layout types requires updating the union
- **Color palette**: Follow the existing pattern — soft pastels, no greens. See palette comment in `data.ts`
- **IDs must be sequential** from 0 for the `currentStep` tracking to work correctly
- All files in `scrolly-experience/` are **client-only** — no server imports allowed
