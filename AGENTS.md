# AGENTS.md — Foundation Projects

> **This file is the first thing AI agents should read when working on this project.**

## Project Overview

Foundation Projects is a marketing website for a roofing business consulting company. The site features an interactive 3D scrollytelling experience on the homepage, built with React Three Fiber, alongside standard marketing pages.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **3D:** React Three Fiber 9 + drei + postprocessing (client-only)
- **Styling:** CSS Custom Properties (design tokens) + co-located component CSS
- **Fonts:** Satoshi (self-hosted via next/font/local)
- **Deploy:** Vercel

## Critical Rules

### Server vs Client Components
- **Default is server component** — no `'use client'` directive needed
- Add `'use client'` **only** when using: React hooks, browser APIs (window, document), Three.js, event handlers
- **NEVER** import `three`, `@react-three/fiber`, `@react-three/drei`, or `@react-three/postprocessing` in a server component — they crash the server at import time
- 3D scene must always be behind `dynamic(ssr: false)` in a client wrapper

### Styling
- **Always use design tokens** — never hardcode colors, sizes, radii, or spacing
- Tokens are in `src/styles/tokens/` — this is the single source of truth for visual design
- Use semantic tokens: `var(--text-primary)` not `var(--color-slate-900)`
- Component CSS files are co-located: `Button/Button.tsx` + `Button/Button.css`
- BEM-like naming: `.component__element--modifier`

### File Structure
- Pages: `src/app/[route]/page.tsx`
- Features: `src/features/[name]/` with barrel `index.ts`
- Shared UI: `src/components/[Name]/Name.tsx`
- Config: `src/config/`
- Tokens: `src/styles/tokens/`

### Data Flow
- `currentStep` = block `.id` (NOT array index) — see `features/scrolly-experience/types.ts`
- Navigation config: `src/config/nav.ts`
- Site config: `src/config/site.ts`
- 3D scene config: `src/features/scrolly-experience/config/scene.ts`
- Content data: `src/features/scrolly-experience/config/data.ts`

## Common Tasks

### Adding a new page
1. Create `src/app/page-name/page.tsx`
2. Add `metadata` export for SEO
3. Use `<section className="section">` + `<div className="container">` for layout
4. Add nav link in `src/config/nav.ts`
5. Run `npm run build` to verify

### Changing brand colors/fonts
1. Edit `src/styles/tokens/colors.css` (semantic tokens)
2. Edit `src/styles/tokens/effects.css` (radii, shadows)
3. Replace font files in `src/fonts/` and update `src/app/layout.tsx`
4. 3D block colors: edit `src/features/scrolly-experience/config/data.ts`

### Modifying the 3D experience
1. All 3D code lives in `src/features/scrolly-experience/`
2. Scene config: `config/scene.ts` (geometry, lighting, animations)
3. Block data: `config/data.ts` (content, colors, layout)
4. **Remember:** everything in this folder is client-only

## Architecture Diagram

```
app/layout.tsx (Server)
├── Header (Client — scroll listeners)
├── <main>
│   ├── app/page.tsx (Server)
│   │   └── ScrollyExperience (Client + dynamic ssr:false)
│   │       ├── Overlay (text, IntersectionObserver)
│   │       └── Scene (Canvas, R3F, Three.js)
│   │           └── Stack → Layer → Block
│   │
│   ├── app/about/page.tsx (Server)
│   ├── app/how-it-works/*/page.tsx (Server)
│   └── ...
└── Footer (Server)
```
