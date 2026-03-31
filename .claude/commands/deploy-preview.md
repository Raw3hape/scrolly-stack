Deploy the current state of the scrolly-stack project to a Vercel preview environment.

## Arguments: $ARGUMENTS

- **No arguments**: Deploy only, return the preview URL
- **`--smoke`**: Deploy, then run smoke tests against the preview URL

## Deploy:

1. Run: `npx vercel --yes 2>&1` (uses the linked project from `.vercel/`)
2. Capture the preview URL from the output
3. Report the URL

## If `--smoke` was passed:

1. Wait 10 seconds for the deployment to propagate
2. Run smoke tests against the preview: `BASE_URL=<preview-url> npx playwright test --project=desktop-1440 e2e/pages.spec.ts e2e/navigation.spec.ts`
3. Report test results

## Reporting:

- Show the preview URL prominently
- If smoke tests ran, report pass/fail
- If deployment failed, show the error and suggest fixes (common: not logged in, project not linked)
