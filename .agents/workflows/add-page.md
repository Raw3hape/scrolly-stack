---
description: Add or update a standard data-driven page in the current architecture
---

# Add a Page

Use this workflow for every non-home marketing page.

## Canonical path

`src/config/content/[page].ts` → `src/config/content/index.ts` → `src/app/**/page.tsx` → `SectionRenderer`

## Steps

1. Choose the route slug and page key.
2. If the page needs a new section shape:
   - add the interface to `src/config/types.ts`
   - add it to the `Section` union
   - create the component in `src/components/V2Sections/[Name]/[Name].tsx`
   - add the `case` in `src/components/V2Sections/SectionRenderer.tsx`
3. Create `src/config/content/[page].ts` exporting a `PageContent` object with:
   - `slug`
   - `metadata`
   - `sections`
   - `footer`
4. Re-export that content object from `src/config/content/index.ts`.
5. Create the route file in `src/app/.../page.tsx` using this pattern:

```tsx
import type { Metadata } from 'next';
import { pageContentName } from '@/config/content';
import SectionRenderer from '@/components/V2Sections/SectionRenderer';

export const metadata: Metadata = {
  title: pageContentName.metadata.title,
  description: pageContentName.metadata.description,
};

export default function PageName() {
  return (
    <div className="v2-content-wrapper">
      {pageContentName.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}
```

6. Add the route to `src/config/nav.ts`.
7. Add a `navLinks` entry only if the page belongs in header navigation.
8. Keep CTA destinations in `src/config/nav.ts` via `ctaConfig.href` or `routes.*`.
9. Verify with:

```bash
npm run typecheck
npm run lint
```

## Home route exception

Do not use this workflow for `/`. Home is:

`src/app/page.tsx` → `HomeV2Client` → `ScrollyLoader` + section rendering

## Deprecated

- Do not create standalone hardcoded page markup in `page.tsx` unless the task explicitly requires a one-off route.
- Do not create pages under `src/app/v2/...`.
- Do not hardcode CTA URLs in section data or JSX.
- Do not use `src/config/content/home.ts` as a template for new pages.
