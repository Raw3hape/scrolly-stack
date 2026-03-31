Visually test a single page of the scrolly-stack site on multiple viewports.

## Route to test: $ARGUMENTS

If no argument provided, test the homepage (`/`).

## Before running:

1. Check if the dev server is running: `curl -sf http://localhost:3000 > /dev/null 2>&1`
2. If NOT running, start it: `npm run dev &` and wait until it's ready

## Test procedure:

Run a Playwright script that:

1. Navigates to the target route on **3 viewports**: desktop (1440x900), tablet (768x1024), mobile (390x844)
2. For each viewport:
   - Wait for the page to fully load (networkidle)
   - Capture a full-page screenshot to `/tmp/page-check/`
   - Check the browser console for errors (filter out known WebGL/THREE/ResizeObserver warnings)
   - Check for horizontal overflow (`document.documentElement.scrollWidth > document.documentElement.clientWidth`)
   - Check that the page has visible text content

Use this Playwright script pattern:

```bash
npx playwright test --project=desktop-1440 --project=tablet-portrait --project=iphone-14 -g "should load" e2e/pages.spec.ts
```

Or write an inline script if the route needs specific testing beyond what pages.spec.ts covers.

## Reporting:

- Show screenshots (mention file paths so I can view them with Read)
- Report: console errors found, overflow detected (yes/no), load time
- Flag any issues that need attention
