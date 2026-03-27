---
description: Port a Stitch screen into the current data-driven page architecture
---

# Stitch Transfer

Use this workflow when the user asks to recreate a Stitch screen inside this repo.

## First principles

- Target the current architecture, not the old `/v2/*` namespace.
- Prefer existing section types and section components.
- Keep business copy intact unless the user explicitly asks to rewrite it.
- Treat Stitch as a visual/content source, not as HTML to paste into the app.

## Canonical implementation path

`Stitch source` → `section mapping` → `src/config/content/[page].ts` → `SectionRenderer` → optional new `V2Sections` component

## Steps

1. Get the Stitch source of truth:
   - screenshot
   - exported HTML/CSS if available
   - screen title and intended route
2. Break the screen into sections and map each section to:
   - an existing section type in `src/config/types.ts`, or
   - a new section type only if reuse is not realistic
3. Decide whether this is:
   - a new page
   - an update to an existing page content file
   - a homepage-below-the-scrolly update
4. Add or update page data in `src/config/content/[page].ts`.
5. Re-export from `src/config/content/index.ts` if it is a new content file.
6. If a new visual section is required:
   - add the type to `src/config/types.ts`
   - create `src/components/V2Sections/[Name]/[Name].tsx`
   - create the co-located CSS file
   - add the renderer case in `SectionRenderer.tsx`
7. Create or update the route in `src/app/**/page.tsx` using the standard data-driven pattern.
8. Update `src/config/nav.ts` if the route, nav label, or CTA target changes.
9. Map all styling to existing tokens first. If a value is truly missing:
   - add a semantic token in `colors.css`, `spacing.css`, `motion.css`, `effects.css`, or `z-index.css`
   - use `stitch-overrides.css` only for global Stitch-theme deltas
10. Verify with:

```bash
npm run typecheck
npm run lint
```

## Home page rule

Homepage hero is owned by:

`src/app/page.tsx` → `HomeV2Client` → `ScrollyLoader` → `ScrollyExperience`

If the Stitch screen is for home:

- by default, port only the sections below the 3D scrolly intro
- change the scrolly hero itself only if the user explicitly asks for that

## Deprecated

- Do not create pages under `src/app/v2/...`.
- Do not refer to `nav-v2.ts`; use `src/config/nav.ts`.
- Do not paste raw Stitch HTML into route files.
- Do not treat `src/config/content/home.ts` as the current home page source.
- Do not implement new scrolly content through `src/features/scrolly-experience/data.ts`.
