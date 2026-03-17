/**
 * Home Page Content — Foundation Projects
 *
 * Hero, value props, step CTA, noscript fallback, Problem & Stakes,
 * How It Works, Stakes/Urgency, and Final CTA.
 *
 * Source of truth: CONTENT.md § PAGE 1: HOME + full client brief
 */

import { ctaConfig } from '../nav';

// =============================================================================
// HERO SECTION
// =============================================================================

export const heroContent = {
  headline: 'We\'re building a roofing company that goes public — and we want yours',
  headlineAccent: 'in it.',
  subheadline:
    'You did the hard work to grow your business. You shouldn\'t have to hand it to a broker or a PE firm to finally get the exit you deserve. With us, you won\'t have to.',
  ctaLabel: 'Book A Call',
  ctaHref: ctaConfig.href,
  ctaAriaLabel: 'Book a call to discuss your roofing business exit',
  statusText: 'Free 15-min call · NDA on day one',
} as const;

// =============================================================================
// VALUE PROPS STRIP (3 columns)
// =============================================================================

export const homeValueProps = [
  'Get A Bigger Exit',
  'Stay In The Deal',
  'We Only Get Paid When You Do',
] as const;

// =============================================================================
// STEP CTA (per-step call to action inside the scrolly experience)
// =============================================================================

export const stepCta = {
  label: 'See if I qualify',
  arrowText: '→',
  /** Generates aria-label for a given step title */
  ariaLabel: (stepTitle: string) => `Learn more about ${stepTitle}`,
} as const;

// =============================================================================
// NOSCRIPT FALLBACK (for crawlers / no-JS users)
// =============================================================================

export const noscriptContent = {
  headline: heroContent.headline + ' ' + heroContent.headlineAccent,
  description: heroContent.subheadline,
  ctaLabel: heroContent.ctaLabel,
  ctaHref: heroContent.ctaHref,
} as const;

// =============================================================================
// SECTION 3 — PROBLEM & STAKES
// =============================================================================

export const problemStakesContent = {
  heading: 'Most Roofing Companies Sell For Less Than They\'re Worth.',
  problem:
    'You get 10 emails a week from people offering to buy your business. Brokers want 20% to list you. PE firms want to lock you in before you\'re ready. And if you try to go it alone, you\'re spending 12–18 months on due diligence, cleanup, and systems you should have built years ago.',
  solution:
    'Foundation Projects is assembling a platform of best-in-class roofing companies — not to flip them to private equity, but to take them public.',
  ctaLabel: ctaConfig.label,
  ctaHref: ctaConfig.href,
} as const;

// =============================================================================
// HOW IT WORKS — 3 STEPS
// =============================================================================

export const homeHowItWorks = {
  heading: 'Here\'s How It Works',
  steps: [
    {
      number: 1,
      title: 'Book A 30 Minute Call',
      description:
        'First, we figure out if we\'re a good fit. We\'ll look at your roofing business, talk through your goals, and if it makes sense for both sides, we sign an NDA, agree on a Letter of Intent, and set your entry valuation.',
      footnote: 'You don\'t owe us anything at this stage. No money changes hands — just clarity.',
    },
    {
      number: 2,
      title: 'We Scale Your Business',
      description:
        'Once you\'re in, we come in and help fix and build the things that make a company worth more — like better systems, cleaner operations, AI tools that save time, and training for your team.',
      footnote: 'You keep running your business. We just make it worth a lot more.',
    },
    {
      number: 3,
      title: 'Get A Big Exit',
      description:
        'The companies combine and we take it public. You keep the majority of what your company is worth. We take 20% of the value we helped create — nothing until then.',
      footnote: 'Other companies give you 3× and sell at 10×. We only get paid when you do.',
    },
  ],
} as const;

// =============================================================================
// STAKES / URGENCY
// =============================================================================

export const stakesContent = {
  body: 'You\'ve spent years building your business. The window to get a return on that business is open. It won\'t stay open forever.',
  detail:
    'The roofing industry is consolidating right now. The first platforms are already forming. Owners who get in early will lock in better valuations and a bigger share of what the platform is worth when it goes public. Owners who wait will be selling into a crowded market with fewer buyers and less leverage.',
} as const;

// =============================================================================
// FINAL CTA BLOCK
// =============================================================================

export const homeFinalCta = {
  heading: 'Your Big Exit Starts With A 30-Minute Call.',
  subheading: 'Book Your Call Today.',
  body:
    'We\'ll learn about your business, share how the platform works, and tell you honestly whether we think it\'s a good match.',
  ctaLabel: ctaConfig.label,
  ctaHref: ctaConfig.href,
} as const;
