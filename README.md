# Foundation Projects

Marketing site for a roofing business consulting company. The homepage combines a client-only 3D scrollytelling intro with data-driven marketing sections rendered through the same section system as the rest of the site.

## Tech Stack

- Next.js 16 App Router
- TypeScript strict mode
- React Three Fiber 9 + drei + postprocessing
- CSS custom properties + co-located component CSS
- Newsreader + Inter via `next/font/google`
- Vercel deploy target

## Quick Start

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (`--max-warnings=0`) |
| `npm run typecheck` | `tsc --noEmit` |

## Current Architecture

### Standard pages

Data lives in `src/config/content/*.ts`, is re-exported from `src/config/content/index.ts`, and is rendered by route files in `src/app/**/page.tsx` through `src/components/V2Sections/SectionRenderer.tsx`.

Route pattern:

```tsx
import type { Metadata } from 'next';
import { aboutContent } from '@/config/content';
import SectionRenderer from '@/components/V2Sections/SectionRenderer';

export const metadata: Metadata = {
  title: aboutContent.metadata.title,
  description: aboutContent.metadata.description,
};

export default function AboutPage() {
  return (
    <div className="v2-content-wrapper">
      {aboutContent.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}
```

### Home route

Home is the only special route:

`src/app/page.tsx` → `src/app/HomeV2Client.tsx` → `src/features/scrolly-experience/ScrollyLoader.tsx` → `ScrollyExperience`

Everything below the 3D intro is still data-driven via `homeContent.sections`.

### Navigation and CTAs

- Routes, header nav, CTA target, and brand config live in `src/config/nav.ts`
- CTA labels may vary by section
- CTA `href` values must come from `ctaConfig.href` or `routes.*`

### 3D scrolly

- Live 3D code is in `src/features/scrolly-experience/`
- Variants live in `src/features/scrolly-experience/variants/`
- The default home variant is selected via `variantId` on `HomeV2Client`

## Project Structure

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── HomeV2Client.tsx
│   ├── about/page.tsx
│   ├── how-it-works/roofers/page.tsx
│   ├── how-it-works/investors/page.tsx
│   ├── opt-in/page.tsx
│   └── schedule/page.tsx
├── components/
│   ├── Header/
│   └── V2Sections/
├── config/
│   ├── nav.ts
│   ├── types.ts
│   └── content/
├── features/
│   └── scrolly-experience/
└── styles/
    └── tokens/
```

## Deprecated / Legacy

- `src/config/content/home.ts` is legacy content-fragment data. Do not use it for new work; use `src/config/content/home-page.ts`.
- `src/features/scrolly-experience/data.ts` is a deprecated compatibility shim. New scrolly changes belong in `src/features/scrolly-experience/variants/`.
- Old docs that mention `/v2/*` routes or `nav-v2.ts` are obsolete in this repo.

## For AI Agents

Read `AGENTS.md` first.
For a compact canonical map + verification matrix, use `AGENT_INDEX.md`.

Useful workflows:

- `.agents/workflows/add-page.md`
- `.agents/workflows/add-scroll-step.md`
- `.agents/workflows/stitch-transfer.md`
