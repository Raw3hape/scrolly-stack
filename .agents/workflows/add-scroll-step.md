---
description: Add or update a block in the current scrolly variant system
---

# Add a Scroll Step

Use this workflow when changing the homepage 3D stack.

## Canonical path

1. Find the active variant from `src/app/page.tsx` and `src/app/HomeV2Client.tsx`.
2. Edit the real variant source in `src/features/scrolly-experience/variants/`.

Current home default:

- `HomeV2Client` passes `variantId="v6-exact-flipped"`
- `v6-exact-flipped.ts` is derived from `v4-exact.ts`
- Structural block changes usually belong in `v4-exact.ts`, not in the deprecated `data.ts` shim

## Steps

1. Identify the target variant file.
2. If that variant spreads another variant, edit the source variant that owns the `layers` data.
3. Add or update the block inside the correct `LayerData` entry.
4. Keep the block shape aligned with `src/features/scrolly-experience/types.ts`:

```ts
{
  id: 12,
  slug: 'example',
  label: 'Example',
  tooltipTitle: 'Example Title',
  tooltipSubhead: 'Example subhead',
  bullets: [],
  description: 'Optional long copy',
  color: palette.anchor500,
  gradientColorB: palette.anchor300,
  activeColor: palette.anchor700,
  activeGradientColorB: palette.anchor500,
  textColor: palette.sand100,
  icon: icons.example,
}
```

5. For `layout: 'grid'` blocks, also set `gridPosition`.
6. Ensure every block `id` is unique within the variant.
7. If you add a brand-new variant, register it in `src/features/scrolly-experience/variants/registry.ts`.
8. Verify:

```bash
npm run typecheck
npm run lint
npm run dev
```

## Important notes

- `currentStep` tracks real block IDs, not array indexes.
- IDs do not need to be sequential from `0`; they do need to be unique and stable.
- `HERO_STEP` is the only sentinel step value and lives in `src/features/scrolly-experience/utils/stepNavigation.ts`.
- New 3D data belongs in `variants/`, not `src/features/scrolly-experience/data.ts`.

## Deprecated

- Do not edit `src/features/scrolly-experience/data.ts` for new work unless the task is explicitly about backward compatibility.
- Do not assume the active home variant is `classic`.
- Do not rely on array order as the public step identity.
