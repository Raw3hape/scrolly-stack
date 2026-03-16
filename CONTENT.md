# CONTENT.md — Foundation Projects Site Blueprint

> **AI-first content map.** This file is the single source of truth for all page
> structures, copy, and CTAs across the site. Use it alongside `AGENTS.md` (tech rules)
> when building or updating pages.

---

## Quick Reference

| Page | Route | File | Status |
|------|-------|------|--------|
| Home | `/` | `src/app/page.tsx` | ✅ Exists |
| About | `/about` | `src/app/about/page.tsx` | ✅ Exists |
| How It Works — Roofers | `/how-it-works/roofers` | `src/app/how-it-works/roofers/page.tsx` | ✅ Exists |
| How It Works — Investors | `/how-it-works/investors` | `src/app/how-it-works/investors/page.tsx` | ✅ Exists |
| Schedule A Call | `/schedule` | `src/app/schedule/page.tsx` | ✅ Exists |
| Freebie Opt-In | `/3b-opt-in` | `src/app/3b-opt-in/page.tsx` | ✅ Exists |

---

## Global Elements

### Header
- **Wordmark:** Foundation Projects
- **Nav Links:** About · How It Works · Investors
- **CTA Button:** `Book A Call` → `ctaConfig.href` (see `src/config/nav.ts`)

### Footer
- Copyright: `© {year} Foundation Projects. All rights reserved.`
- Links: repeat nav links + Schedule + Legal (TBD)

### CTA Config (centralized in `src/config/nav.ts`)
- **Label:** "Book A Call"
- **Microcopy:** "Free 15-min call"
- **Href:** TBD (currently placeholder)
- **Secondary CTA:** "See if I qualify →" (used inside 3D stack cards)

---

## PAGE 1: HOME (`/`)

### Section 1 — Hero

| Field | Content |
|-------|---------|
| **Heading** | We're building a roofing company that goes public — and we want yours in it. |
| **Subheading** | You did the hard work. You shouldn't have to hand it to a broker or a PE firm to get the exit you deserve. |
| **CTA** | `[Book A Call]` → `ctaConfig.href` |

---

### Section 2 — The Foundation OS (Interactive 3D Stack)

> **Implementation:** React Three Fiber scrollytelling experience.
> Data lives in `src/features/scrolly-experience/data.ts`.
> On click/scroll into a layer → card appears with text below.
> Every card has CTA: `[See if I qualify →]`

#### Layer 1: The Outcomes (Что владельцы получают)

| Block ID | Title | Description |
|----------|-------|-------------|
| `sales` | **Sales** | Stop relying purely on word-of-mouth. We build a predictable lead-handling and follow-up system that tracks conversions and wins more jobs. |
| `operations` | **Operations** | Smooth out your production pipeline. From scheduling crews to strict quality control, we help you run jobs clean and on time. |
| `finance` | **Finance** | Gain total financial clarity. We implement precise job costing and profit analysis so you always have real-time cash visibility. |
| `exit` | **Exit** | Get diligence-ready. We clean up your financials and provide valuation support so you exit on your terms, for maximum value. |

#### Layer 2: The "One" Approach (Как управляем)

| Block ID | Title | Description |
|----------|-------|-------------|
| `one-os` | **One Operating System** | No more disconnected tools. We unify your data into a single source of truth, connecting your entire flow from lead to review. |
| `one-team` | **One Accountable Team** | We aren't just consultants offering advice. We are your implementation partner providing ongoing, done-for-you execution. |
| `one-plan` | **One Clear Plan** | A clear roadmap from partnership to IPO. We align our goals, transform your operations, and scale together. |

#### Layer 3: The Engine (Что внедряем)

| Block ID | Title | Description |
|----------|-------|-------------|
| `lead-to-review` | **Lead-to-Review OS** | An end-to-end workflow managing demand, sales, production, and reviews seamlessly. |
| `crm-marketing` | **CRM + Marketing Engine** | Pipeline management and marketing automation that make your revenue trackable & repeatable. |
| `accounting` | **Unified Accounting** | Connect your job costing directly to your operating system for complete reporting clarity. |
| `revops` | **RevOps Controls** | Playbooks, governance, and adoption tracking to ensure your team actually uses the tools. |
| `efficiency` | **Efficiency Savings** | Standardize handoffs, cut leaks, and reduce overhead to instantly boost your margins. |
| `shared-services` | **Shared Services** | Access our dedicated support bench to maintain and optimize your tech stack. |
| `scale` | **Scale + Leverage** | Combine the power of 8–12 businesses for unified growth and massive economies of scale. |
| `exit-options` | **Institutional Exit Options** | Audit logs and clean data rooms that position your business for a premium public exit. |

---

### Section 3 — The Problem & The Stakes

| Field | Content |
|-------|---------|
| **Heading** | Most Roofing Companies Sell For Less Than They're Worth. |
| **Problem** | Brokers want 20% to list you. PE firms offer 3× and lock you in before you're ready. Going alone means 12–18 months of painful cleanup. |
| **Solution** | Foundation Projects brings best-in-class roofing companies together to take them public. Owners who get in early lock in better valuations. |
| **CTA** | `[Book A Call]` → `ctaConfig.href` |

---

## PAGE 2: ABOUT (`/about`)

### Section 1 — Hero

| Field | Content |
|-------|---------|
| **Heading** | On A Mission To Get Owners Like You A Big Exit. |
| **Body** | We built Foundation Projects because we got tired of watching good roofing owners get taken advantage of by brokers and private equity firms. |

---

### Section 2 — The Broken System vs. The Better Way

> **Layout:** Two-column comparison.

| Column | Content |
|--------|---------|
| **The Broken System** | PE firms offer you 3×, lock you in, and flip your company for 10× a few years later. That's a bad system. |
| **The Better Way** | You stay in the deal. We combine companies, scale them, and go public at 7–10×. We don't get paid until you do. |

---

### Section 3 — Meet The Team

| Field | Content |
|-------|---------|
| **Layout** | Photo cards + credentials per team member |
| **Accent stat** | $1B+ in roofing revenue experience |
| **Team data** | TBD — photos, names, bios, linkedin links |

---

## PAGE 3: HOW IT WORKS — ROOFERS (`/how-it-works/roofers`)

### Section 1 — Hero

| Field | Content |
|-------|---------|
| **Heading** | Get a Bigger Exit From Your Roofing Company. |
| **Body** | A proven 3-step process to get you 7×–10× what a PE firm would pay. |

---

### Section 2 — The 3-Step Process

| Step | Title | Description |
|------|-------|-------------|
| 1 | **Book A Call** | We look at your goals, sign an NDA, and set your entry valuation. No money changes hands — just clarity. |
| 2 | **We Scale Your Business** | We implement the Foundation OS (CRM, Unified Accounting, RevOps). You keep running your business. We just make it worth a lot more. |
| 3 | **Get A Big Exit** | We take the platform public. You keep the majority of what it's worth. We take 20% of the value we helped create. |

---

### Section 3 — What Changes For You

> **Layout:** Bullet list or icon grid.

- Stop fielding lowball emails from brokers.
- Your business runs better and is more attractive.
- Cash out at 7–10× on a public market.

**CTA:** `[Book A Call]` → `ctaConfig.href`

---

## PAGE 4: HOW IT WORKS — INVESTORS (`/how-it-works/investors`)

### Section 1 — Hero

| Field | Content |
|-------|---------|
| **Heading** | Invest in the Roofing Companies Going Public. |
| **Body** | Roofing is a $60B, recession-resistant industry. We're building the first serious institutional platform. |

---

### Section 2 — The Ground Floor Opportunity

| Field | Content |
|-------|---------|
| **Body** | Most investors find out about consolidation too late. The window to get in early on better valuations is open now, but it won't last. |

---

### Section 3 — The 3-Step Process

| Step | Title | Description |
|------|-------|-------------|
| 1 | **Book A Call** | Assess fit and your investing goals. |
| 2 | **We Identify & Scale** | We source best-in-class companies at smart entry valuations. |
| 3 | **We Go Public** | Multiple expansion happens. Early investors get paid. |

---

### Section 4 — Why Act Now

> **Layout:** Bullet list or icon grid.

- Get in before multiples rise.
- Proven, durable demand.
- Participate in a public exit, not a PE flip.

**CTA:** `[Book A Call]` → `ctaConfig.href`

---

## PAGE 5A: SCHEDULE A CALL (`/schedule`)

### Section 1 — Calendar Embed

| Field | Content |
|-------|---------|
| **Heading** | Your Next Step Is To Book A Call. |
| **Body** | Schedule below or text ROOF to XXX-XXX-XXXX ANYTIME. |
| **Widget** | Calendly embed (TBD — `<iframe>` or Calendly React SDK) |

---

## PAGE 5B: FREEBIE OPT-IN (`/3b-opt-in`)

### Section 1 — Lead Magnet

| Field | Content |
|-------|---------|
| **Visual** | 3D mockup of a PDF book/report |
| **Heading** | 8 Things Private Equity Has Wrong About The Roofing Industry. |
| **Body** | What brokers & PE firms don't understand about this $60B industry. |
| **Form fields** | First Name · Email |
| **CTA** | `[Get Instant Access — FREE]` |

---

## Content Patterns & Voice Guidelines

### Tone
- **Direct, confident, no-BS.** Speak like a trusted partner, not a salesperson.
- Second person: "you", "your business", "your exit".
- Short paragraphs, punchy sentences.

### Key Messaging Pillars
1. **You deserve more** — PE firms undersell owners. We fix that.
2. **We do the work** — not advice, implementation.
3. **Public exit** — 7–10× vs 3× PE flip.
4. **Early advantage** — get in now for better valuations.

### Numbers to reinforce
- `$60B` — roofing industry size
- `3×` — typical PE offer
- `7–10×` — Foundation Projects target exit
- `20%` — broker fee / FP success fee
- `$1B+` — team's roofing revenue experience
- `8–12` — businesses in the consolidation platform
- `12–18 months` — typical DIY cleanup timeline

---

## SEO Metadata (per page)

| Page | Title | Meta Description |
|------|-------|-----------------|
| Home | Foundation Projects — We Take Roofing Companies Public | We're building a roofing company that goes public. Get 7–10× what PE would pay. Book a call today. |
| About | About Foundation Projects — Mission & Team | On a mission to get roofing owners a bigger exit. $1B+ in roofing revenue experience. |
| Roofers | How It Works for Roofers — Foundation Projects | A proven 3-step process: book a call, we scale your business, get a big exit at 7–10×. |
| Investors | How It Works for Investors — Foundation Projects | Invest in $60B recession-resistant roofing. Get in early before multiples rise. |
| Schedule | Book A Call — Foundation Projects | Schedule a free 15-minute call to see if your roofing company qualifies. |
| Opt-In | Free Report — 8 Things PE Has Wrong About Roofing | Download the free report on what brokers & PE firms get wrong about the roofing industry. |

---

## Future Enhancements (Backlog)

- [ ] Testimonials / social proof section (Home or About)
- [ ] Case study pages (`/case-studies/[slug]`)
- [ ] Blog / insights (`/blog`)
- [ ] Legal pages: Privacy Policy, Terms (`/legal/privacy`, `/legal/terms`)
- [ ] FAQ section (Home or standalone `/faq`)
- [ ] Video explainer embed (Home hero or About)
- [ ] Team member detail pages
- [ ] Calendly webhook integration for lead tracking
- [ ] A/B test hero headlines
