Run E2E tests for the scrolly-stack project using Playwright.

## Arguments: $ARGUMENTS

- **No arguments** or `smoke`: Run smoke tests only (`npm run test:e2e:smoke`)
- **`full`**: Run the full E2E suite across all viewports (`npm run test:e2e`)
- **A file path** (e.g., `e2e/home.spec.ts`): Run that specific test file (`npx playwright test <file>`)
- **`--project=<name>`** can be appended to target a specific viewport (e.g., `smoke --project=iphone-14`)

## Before running:

1. Check if the dev server is already running: `curl -sf http://localhost:3000 > /dev/null 2>&1`
2. If NOT running, start it in the background: `npm run dev &` and wait until `curl -sf http://localhost:3000` succeeds (poll every 2 seconds, max 60 seconds)

## After running:

- Parse the Playwright output
- Report: total tests, passed, failed, skipped
- For failures: show the test name, file, and error message
- If screenshots were captured (test-results/), mention their location
- Suggest fixes for common failure patterns (timeout = slow server, element not found = selector changed)
