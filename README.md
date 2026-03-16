# Foundation Projects — Marketing Website

Interactive 3D scrollytelling marketing site for Foundation Projects, a roofing business consulting company.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (strict mode)
- **3D:** React Three Fiber 9 + drei + postprocessing
- **Styling:** CSS Custom Properties (design tokens)
- **Fonts:** Satoshi (self-hosted via next/font/local)

## Quick Start

```bash
npm install
npm run dev      # → http://localhost:3000
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript check |

## Project Structure

```
src/
├── app/                     # Pages (App Router)
│   ├── layout.tsx           # Root layout (font, Header, Footer)
│   ├── page.tsx             # Home (3D scrolly experience)
│   ├── about/               # About page
│   ├── how-it-works/        # Roofers & Investors pages
│   ├── schedule/            # CTA → Calendly (coming soon)
│   ├── shadow-local/
│   └── 3b-opt-in/
├── features/                # Feature modules
│   └── scrolly-experience/  # 3D scrollytelling (client-only)
├── components/              # Shared UI (Header, Footer, etc.)
├── styles/                  # Design system
│   ├── tokens/              # Colors, typography, spacing, motion, effects
│   ├── base/                # Reset, globals
│   └── utilities.css        # .container, .section, .grid, .glass
├── config/                  # Site & navigation config
└── fonts/                   # Self-hosted Satoshi + Inter
```

## Reskinning

To change the entire visual identity, edit only the token files:

| What to change | File |
|---|---|
| Colors & gradients | `src/styles/tokens/colors.css` |
| Typography & fonts | `src/styles/tokens/typography.css` |
| Spacing | `src/styles/tokens/spacing.css` |
| Animations | `src/styles/tokens/motion.css` |
| Shadows, radii | `src/styles/tokens/effects.css` |
| 3D block colors | `src/features/scrolly-experience/config/data.js` |
| Font files | `src/fonts/` + update `src/app/layout.tsx` |

## For AI Agents

Read `AGENTS.md` in the project root first. It contains:
- Critical rules for server vs client components
- File structure conventions
- Data flow architecture
- Common task instructions

Workflows: `.agents/workflows/add-page.md`, `.agents/workflows/add-component.md`

## Deploy

Optimized for Vercel. Push to main to deploy.
