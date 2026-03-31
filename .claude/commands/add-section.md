Add a new section to a page in the scrolly-stack project following the data-driven architecture.

## What to add: $ARGUMENTS

The argument describes the section to add (e.g., "FAQ section to the about page" or "new testimonial section on the roofers page").

## Architecture reference:

Read `.agents/workflows/add-page.md` for the canonical workflow. Key files:

- **Section types**: `src/config/types.ts` (discriminated union)
- **Content configs**: `src/config/content/[page].ts`
- **Content barrel**: `src/config/content/index.ts`
- **Section renderers**: `src/components/V2Sections/SectionRenderer.tsx`, `ServerSectionRenderer.tsx`, `ClientSectionRenderer.tsx`
- **Design tokens**: `src/styles/tokens/` (use `var(--token)`, never hardcode)

## Steps:

1. **Determine section type**: Check if an existing type in `src/config/types.ts` fits. Only create a new type if truly needed.

2. **If new section type needed**:
   a. Add the interface to `src/config/types.ts`
   b. Add it to the `Section` union
   c. Create component + CSS in `src/components/V2Sections/NewSection/`
   d. Add the rendering case to `SectionRenderer.tsx` (and `ServerSectionRenderer.tsx` or `ClientSectionRenderer.tsx`)

3. **Add content**: Add the section data to the appropriate `src/config/content/[page].ts` file

4. **Validate**: Run `npm run typecheck` and `npm run lint` to verify

## Rules:

- Server component by default; only use `'use client'` if hooks/events are needed
- All styling via CSS custom properties from `src/styles/tokens/`
- No hardcoded colors, font sizes, or transitions
- All CTA hrefs from `src/config/nav.ts` (ctaConfig.href)
- Section IDs must be unique within the page
