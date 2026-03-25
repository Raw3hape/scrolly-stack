# AGENTS.md — Foundation Projects

> **This file is the first thing AI agents should read when working on this project.**

## Project Overview

Foundation Projects is a marketing website for a roofing business consulting company. The site features an interactive 3D scrollytelling experience on the homepage, built with React Three Fiber, alongside standard marketing pages.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode, `allowJs: false`)
- **3D:** React Three Fiber 9 + drei + postprocessing (client-only)
- **Styling:** CSS Custom Properties (design tokens) + co-located component CSS — see `DESIGN_SYSTEM.md`
- **Fonts:** Newsreader (headlines, via `next/font/google`) + Inter (body, via `next/font/google`)
- **Deploy:** Vercel
- **Lint:** ESLint 9 (flat config) + `--max-warnings=0`
- **Types:** `tsc --noEmit` via `npm run typecheck`

## Critical Rules

### Server vs Client Components
- **Default is server component** — no `'use client'` directive needed
- Add `'use client'` **only** when using: React hooks, browser APIs (window, document), Three.js, event handlers
- **NEVER** import `three`, `@react-three/fiber`, `@react-three/drei`, or `@react-three/postprocessing` in a server component — they crash the server at import time
- **ESLint enforces this** via `no-restricted-imports` — Three.js imports outside `src/features/scrolly-experience/` will cause lint errors
- `dynamic(ssr: false)` is **only allowed in Client Components** — use a client wrapper like `ScrollyLoader.tsx`
- 3D scene: `page.tsx` (Server) → `ScrollyLoader.tsx` (Client, `dynamic ssr:false`) → `ScrollyExperience`

### CTA / URLs
- **All CTA URLs must come from `src/config/nav.ts`** (`ctaConfig.href`) — never hardcode URLs
- CTA text labels can differ per surface (header vs hero vs steps)

### Styling
- **Always use design tokens** — never hardcode colors, sizes, radii, spacing, or transitions
- **Zero hardcode policy:** component CSS must contain 0 `rgba(...)`, 0 `#hex`, 0 hardcoded `font-size`, 0 hardcoded `transition` values
- Tokens are in `src/styles/tokens/` — single source of truth for visual design
- Use semantic tokens: `var(--text-primary)` not `var(--color-anchor-900)`
- If you need a new size/effect — **add a token first**, then use `var(--token)` in the component
- Component CSS files are co-located: `Header/Header.tsx` + `Header/Header.css`
- BEM-like naming: `.component__element--modifier`
- Full token reference: **`DESIGN_SYSTEM.md`** in project root

### File Structure
- Pages: `src/app/[route]/page.tsx`
- Features: `src/features/[name]/` with barrel `index.ts`
- Shared UI: `src/components/[Name]/Name.tsx`
- Section components: `src/components/V2Sections/[Name]/Name.tsx` — data-driven via `SectionRenderer`
- Config: `src/config/`
- Page content: `src/config/content/[page].ts` — one file per page, barrel at `index.ts`
- Section types: `src/config/types.ts` — discriminated union of 19 section types
- Navigation: `src/config/nav.ts` — routes, nav links, CTA config
- Tokens: `src/styles/tokens/`

### Data Flow
- **Page content:** `src/config/content/[page].ts` → `page.tsx` → `SectionRenderer` (switch by `section.type`) → section component
- **Section types:** `src/config/types.ts` — discriminated union, add new type here first
- **Navigation:** `src/config/nav.ts` — `routes`, `navLinks`, `ctaConfig`, `brandConfig`
- **3D scene:** `src/features/scrolly-experience/config.ts` (geometry), `data.ts` (blocks), `types.ts` (LayerData union)
- `currentStep` = block `.id` (NOT array index) — see `features/scrolly-experience/types.ts`

## Common Tasks

### Adding a new page (data-driven)
1. Add section type interface to `src/config/types.ts` (if new section type needed)
2. Add the type to the `Section` union in `src/config/types.ts`
3. Create section component in `src/components/V2Sections/[Name]/Name.tsx` + `Name.css`
4. Add `case` to `src/components/V2Sections/SectionRenderer.tsx`
5. Create content file `src/config/content/[page].ts` with page sections array
6. Add re-export to `src/config/content/index.ts`
7. Create `src/app/page-name/page.tsx` — import content, map sections via `<SectionRenderer>`
8. Add route to `src/config/nav.ts`
9. Run `npm run typecheck && npm run lint` to verify

### Changing brand colors/fonts
1. Edit `src/styles/tokens/colors.css` — palette hex values + semantic tokens
2. Edit `src/styles/tokens/effects.css` — shadows, glass, glow (rgba values)
3. For fonts: update `next/font` imports in `src/app/layout.tsx`
4. 3D block colors: edit `src/features/scrolly-experience/data.ts` (15 blocks × 4 colors)
5. **See `DESIGN_SYSTEM.md`** for full rebrand checklist and token reference

### Modifying the 3D experience
1. All 3D code lives in `src/features/scrolly-experience/`
2. Scene config: `config.ts` (geometry, lighting, animations)
3. Block data: `data.ts` (content, colors, layout)
4. Types: `types.ts` — `LayerData` is a discriminated union (`GridLayer | RowLayer | FullLayer`)
5. **Remember:** everything in this folder is client-only

## Architecture Diagram

```
app/layout.tsx (Server)
├── Header (Client — scroll listeners)
├── <main>
│   ├── app/page.tsx (Server)
│   │   └── ScrollyLoader (Client wrapper, dynamic ssr:false)
│   │       └── ScrollyExperience
│   │           ├── Overlay (text, IntersectionObserver)
│   │           └── Scene (Canvas, R3F, Three.js)
│   │               └── Stack → Layer → Block
│   │
│   ├── app/about/page.tsx (Server)
│   ├── app/how-it-works/*/page.tsx (Server)
│   └── ...
└── Footer (Server)
```
