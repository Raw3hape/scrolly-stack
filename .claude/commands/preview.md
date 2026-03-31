Capture screenshots of all pages in the scrolly-stack site for visual review.

## Before running:

1. Check if the dev server is running: `curl -sf http://localhost:3000 > /dev/null 2>&1`
2. If NOT running, start it: `npm run dev &` and wait until it's ready

## Pages to capture:

All routes defined in `src/config/nav.ts`:

- `/` (Home)
- `/home-v2` (Home V2)
- `/about` (About)
- `/how-it-works/roofers` (Roofers)
- `/how-it-works/investors` (Investors)
- `/opt-in` (Opt-in)
- `/schedule` (Schedule)

## Viewports:

Capture each page on **2 viewports**:

- Desktop: 1440x900
- Mobile: 390x844 (iPhone 14)

## Method:

Write a quick Node.js script using Playwright to:

1. Launch chromium
2. For each route × viewport: navigate, wait for networkidle, take a full-page screenshot
3. Save screenshots to `/tmp/site-preview/` with naming: `{route-slug}-{viewport}.png`

## Reporting:

- List all screenshot file paths
- Report total pages captured and any errors encountered
- Mention any pages that failed to load or had console errors
- Offer to open specific screenshots with the Read tool for visual inspection
