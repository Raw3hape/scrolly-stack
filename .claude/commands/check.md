Run the full pre-commit validation pipeline for the scrolly-stack project. Execute each step sequentially and **stop on the first failure** — do not continue to the next step if the current one fails.

## Steps (run in order):

1. **Format check**: `npm run format:check`
2. **Lint**: `npm run lint`
3. **TypeScript**: `npm run typecheck`
4. **Palette sync**: `npm run check:palette`
5. **Unit tests**: `npm run test`
6. **Production build**: `npm run build`

## Reporting:

- For each step, report: step name, pass/fail, and duration
- If a step fails, show the relevant error output and suggest a fix
- At the end, show a summary table of all steps with their status
- If all steps pass, confirm the code is ready to commit
