---
description: How to transfer a Stitch screen design into the /v2/ namespace with pixel-accurate fidelity
---

# Stitch → V2 Transfer Workflow

// turbo-all

> **Use this workflow when the user says:** "перенеси экран X из Stitch", "stitch transfer", "/stitch-transfer"
>
> **Stitch Project ID:** `16766495084079469855` (Foundation Projects - Site Map & Content PRD)

---

## Phase 1: EXTRACT — Pull design data from Stitch MCP

1. **Get screen metadata** — call `mcp_stitch_get_screen` with the target screen ID from the project. Note the `title`, `width`, `height`, and `htmlCode.downloadUrl`.

2. **Download the HTML source** — call `read_url_content` on the `htmlCode.downloadUrl` to get the full generated HTML/CSS. Save to `/tmp/stitch-screen-{slug}.html` for reference.

3. **Capture visual reference** — call `read_url_content` on the `screenshot.downloadUrl` to get the visual. Note this is the **ground truth** for how the design should look.

4. **Extract the Stitch Design System** — the project's `designMd` field contains the full design specification. Parse the following into a structured analysis:
   - Color palette with hex values
   - Typography rules (fonts, sizes, weights, spacing)
   - Surface hierarchy (Level 0/1/2)
   - Component patterns (buttons, cards, inputs)
   - Do's and Don'ts

## Phase 2: ANALYZE — Decompose screen into components

5. **Parse HTML structure** — from the downloaded HTML, identify:
   - All `<section>` blocks (numbered S1, S2, …)
   - Navigation/header pattern
   - Footer pattern
   - Repeating component patterns (cards, steps, lists)
   - Images/assets used

6. **Create Section Map** — document each section:
   ```
   S1: Hero — [description, key elements]
   S2: Problem Statement — [3 cards layout]
   S3: Mission Block — [dark bg, quote card]
   ...
   ```

7. **Identify reusable components** — mark sections that share patterns across screens.

## Phase 3: MAP — Token mapping from Stitch → Project tokens

8. **Color mapping** — for every color value found in Stitch HTML/CSS:
   ```
   Stitch: #fef9f0 → Token: var(--surface-base) [via stitch-overrides.css]
   Stitch: #103740 → Token: var(--stitch-dark-bg)
   Stitch: #ffb86a → Token: var(--stitch-dark-accent)
   ```
   
   If no matching token exists → **ADD IT FIRST** to `src/styles/tokens/stitch-overrides.css`, then reference.

9. **Typography mapping** — map every font-size/weight/family from Stitch:
   ```
   Stitch: Newsreader 48px → Token: var(--font-h1) + var(--font-family-serif)
   Stitch: Inter 16px/1.6 → Token: var(--font-body) + var(--leading-relaxed)
   ```

10. **Spacing mapping** — map all padding/margin/gap values:
    ```
    Stitch: 64px → Token: var(--space-2xl)
    Stitch: 24px → Token: var(--space-lg)
    ```

11. **Check zero-hardcode compliance** — verify the mapping leaves ZERO:
    - `rgba(...)` values → use tokens
    - `#hex` values → use tokens
    - Hardcoded `font-size` → use font tokens
    - Hardcoded `transition` → use transition tokens

## Phase 4: IMPLEMENT — Write production code

12. **Create/update the page file** — `src/app/v2/{page-name}/page.tsx`:
    - Server Component by default
    - Export `metadata` with title + description
    - Use `<section className="v2-section v2-section--{variant}">` pattern
    - All CTA `href` values from `nav-v2.ts` config

13. **Create co-located CSS** — `src/app/v2/{page-name}/{page-name}.css`:
    - BEM naming: `.v2-{page}__{element}--{modifier}`
    - ONLY token references (no hardcoded values)
    - Include responsive breakpoints: 768px, 1024px, 1440px
    - Add entrance animations with `@keyframes` + IntersectionObserver classes

14. **Create Client component if needed** — `{PageName}Client.tsx`:
    - Only if interactive elements (forms, animations, observers) are needed
    - Mark `'use client'` at top
    - Keep logic minimal — presentational component

15. **Update nav-v2.ts** — add route if not already present.

16. **Replace placeholder content** — no emoji icons, no `href="#"`, no lorem ipsum.

## Phase 5: VERIFY — Compare Stitch vs Implementation

17. **Lint check:**
    ```bash
    npm run lint
    ```

18. **Type check:**
    ```bash
    npm run typecheck
    ```

19. **Build check:**
    ```bash
    npm run build
    ```

20. **Visual comparison** — open `http://localhost:3000/v2/{page-name}` in browser and compare with Stitch screenshot. Check:
    - [ ] Overall layout matches
    - [ ] Colors match (use DevTools color picker on both)
    - [ ] Typography matches (font family, size, weight, line-height)
    - [ ] Spacing matches (padding, margins, gaps)
    - [ ] Responsive at 768px (mobile)
    - [ ] Responsive at 1024px (tablet)
    - [ ] All links point to correct /v2/* routes
    - [ ] No hardcoded values in CSS (grep for `rgba\(`, `#[0-9a-f]`, `px` without `var`)

21. **Hardcode audit** — run this grep to catch violations:
    ```bash
    grep -nE 'rgba\(|#[0-9a-fA-F]{3,8}[;\s]' src/app/v2/{page-name}/*.css | grep -v '/\*'
    ```

22. **Update master tracker** — mark the screen as transferred in `.agents/stitch-transfer-tracker.md`

---

## Master Tracker Location

The state of all transfers is tracked in:
`.agents/stitch-transfer-tracker.md`

This file contains:
- All Stitch screens with IDs
- Transfer status per screen (not started / in progress / done / verified)
- Token coverage percentage
- Visual comparison results
