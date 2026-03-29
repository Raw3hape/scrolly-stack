# AGENT_INDEX — Canonical Agent Entry Map

Use this file as a fast machine-readable-ish index before editing code.

## Canonical docs

- Primary onboarding + rules: `AGENTS.md`
- Design/token policy: `DESIGN_SYSTEM.md`
- Route/nav/CTA source: `src/config/nav.ts`
- Section contracts: `src/config/types.ts`
- Page content barrel: `src/config/content/index.ts`

## Canonical edit paths

- Add/update a standard marketing page:
  - `src/config/content/[page].ts`
  - `src/app/**/page.tsx`
  - `src/components/V2Sections/ServerSectionRenderer.tsx` (server-safe) or `ClientSectionRenderer.tsx` (needs hooks/browser APIs)
- Homepage content:
  - `src/config/content/home-page.ts` (canonical)
  - `src/config/content/home.ts` (compatibility re-export only)
- Scrolly 3D data:
  - `src/features/scrolly-experience/variants/*`
  - `src/features/scrolly-experience/data.ts` is compatibility-only

## Public API boundaries

- Import 3D feature from `@/features/scrolly-experience` barrel (core: `ScrollyExperience`, `ScrollyLoader`) or `@/features/scrolly-experience/heroes` (hero 3D components — separate entry point for code splitting).
- Do not import `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing` outside `src/features/scrolly-experience/`.

## Shared hotspots (merge-conflict risk)

- `src/config/nav.ts`
- `src/config/types.ts`
- `src/components/V2Sections/SectionRenderer.tsx`
- `src/components/V2Sections/ServerSectionRenderer.tsx`
- `src/components/V2Sections/ClientSectionRenderer.tsx`
- `src/config/content/index.ts`

## Deprecated / do-not-start-here

- `src/config/content/home.ts` (legacy compatibility shim)
- `src/features/scrolly-experience/data.ts` (legacy compatibility shim)
- Any docs mentioning `/v2/*` route namespace or `nav-v2.ts`

## Verification matrix

- If you touch `src/` app/component/config code:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run build`
- If you touch token palette values:
  - `npm run check:palette`
- If you touch navigation/routing smoke paths:
  - `npm run test:e2e:smoke`

