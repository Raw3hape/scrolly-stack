# Stitch → V2 Transfer Tracker

> **Stitch Project:** Foundation Projects - Site Map & Content PRD
> **Project ID:** `16766495084079469855`
> **Design System:** Architectural Editorial (Newsreader + Inter)
> **Last Updated:** 2026-03-19

---

## Screen Transfer Status

| # | Screen | Stitch Screen ID | Route | Status | Token Coverage | Visual Match |
|---|--------|-----------------|-------|--------|---------------|-------------|
| 1 | Home | `877e873ad33e4e9a8c6f0225c6f6b039` | `/v2` | 🟡 Partial | ~60% | ❌ Not verified |
| 2 | About | `50b47b71ff974201a54526c1a7765569` | `/v2/about` | ✅ Done | 100% | 🟡 Pending |
| 3 | How It Works (Roofers) | `e673abc0473c4a90b112665c2656e61b` | `/v2/how-it-works/roofers` | ⬜ Not started | — | — |
| 4 | How It Works (Investors) | `cb93c591f30143b98a820a044fef8e0d` | `/v2/how-it-works/investors` | ⬜ Not started | — | — |
| 5 | Freebie Opt-In | `1233597b1d3e43a4b4369d9516f2acb3` | `/v2/opt-in` | ⬜ Not started | — | — |
| 6 | Schedule A Call | `9856f1c25b8e4fccab991c7992e7bd3d` | `/v2/schedule` | ⬜ Not started | — | — |

## Shared Components Status

| Component | Status | Used By |
|-----------|--------|---------|
| V2 Header | ⬜ Not started | All pages |
| V2 Footer | 🟡 Partial (in page.tsx) | All pages → extract to component |
| V2 Button (Signature Gradient) | ⬜ Not started | Home CTA, all CTAs |
| Trust Badge | ⬜ Not started | Various |
| Section Animations (IntersectionObserver) | ⬜ Not started | All sections |

## Design System Token Coverage

| Category | Mapped | Total | Coverage |
|----------|--------|-------|----------|
| Surface colors | 5 | 8 | 63% |
| Primary/Secondary/Tertiary | 4 | 12 | 33% |
| Dark section tokens | 4 | 4 | 100% |
| Glass tokens | 4 | 4 | 100% |
| Outline tokens | 2 | 2 | 100% |
| Font overrides | 2 | 2 | 100% |
| Shadow tokens | 0 | 2 | 0% |
| Gradient tokens | 0 | 2 | 0% |
| **TOTAL** | **21** | **36** | **58%** |

## Critical Fixes Needed (Home page)

- [ ] Remove hardcoded `rgba()` values (5 instances)
- [ ] Remove hardcoded `font-size` values (1 instance)
- [ ] Remove hardcoded `transition` values (1 instance)
- [ ] Remove hardcoded `width`/`height` values (3 instances)
- [ ] Add missing tokens to `stitch-overrides.css`
- [ ] Replace emoji icons with SVG
- [ ] Add Signature Gradient for CTA button
- [ ] Extract V2 Footer as shared component
- [ ] Add responsive breakpoints (1024px, 1440px)
- [ ] Add entrance animations

## Verification Checklist Template

Use for each screen transfer:

```
Screen: [name]
Date: [date]

Structural:
- [ ] All sections from Stitch present
- [ ] Section order matches Stitch
- [ ] All text content matches
- [ ] All links functional and point to /v2/* routes

Tokens:
- [ ] Zero hardcoded rgba() in CSS
- [ ] Zero hardcoded #hex in CSS
- [ ] Zero hardcoded font-size in CSS
- [ ] Zero hardcoded transition in CSS
- [ ] All colors use design tokens

Visual:
- [ ] Desktop 1440px matches Stitch screenshot
- [ ] Tablet 1024px responsive layout correct
- [ ] Mobile 768px responsive layout correct
- [ ] Typography matches (family, size, weight)
- [ ] Spacing matches (padding, margins, gaps)
- [ ] Dark sections use correct Stitch dark palette

Code Quality:
- [ ] npm run lint passes
- [ ] npm run typecheck passes
- [ ] npm run build passes
- [ ] BEM naming convention followed
- [ ] Server/Client component split correct
```
