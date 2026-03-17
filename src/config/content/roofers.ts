/**
 * Roofers Page Content — Foundation Projects
 *
 * Hero, value props, problem, 3-step process, what changes, and final CTA.
 *
 * Source of truth: CONTENT.md § PAGE 3: HOW IT WORKS — ROOFERS + full client brief
 */

import { ctaConfig } from '../nav';

// =============================================================================
// HERO
// =============================================================================

export const roofersHero = {
  heading: 'Here\'s How You Can Get a Bigger Exit From Your Roofing Company.',
  body: 'We take roofing companies through a 3-step process proven to get you 7×–10× what a Private Equity firm would have paid you.',
} as const;

// =============================================================================
// VALUE PROPS STRIP
// =============================================================================

export const roofersValueProps = [
  'Get A Bigger Exit',
  'Stay In The Deal',
  'We Only Get Paid When You Do',
] as const;

// =============================================================================
// PROBLEM SECTION
// =============================================================================

export const roofersProb = {
  heading: 'Don\'t Leave Money On The Table When You Exit.',
  body: 'Brokers take 20% to list you. PE firms offer 3× and lock you in before you\'re ready. And if you try to sell on your own, you\'re looking at 12–18 months of due diligence and cleanup. Every path leaves money on the table — and most of it ends up in someone else\'s pocket.',
} as const;

// =============================================================================
// 3-STEP PROCESS
// =============================================================================

export const roofersSteps = [
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
] as const;

// =============================================================================
// WHAT CHANGES FOR YOU
// =============================================================================

export const whatChanges = {
  heading: 'Let\'s Get You The Exit You Deserve',
  subheading: 'When you work with us, here\'s what happens:',
  bullets: [
    'You stop fielding cold emails from brokers and PE firms trying to buy your business for less than what it\'s worth.',
    'Your business runs better than it ever has and is more attractive when you exit.',
    'You\'re part of a platform that\'s growing fast and worth a lot more than any single company.',
    'You go public and cash out at 7–10× what a PE firm would have paid you.',
    'You kept the upside and got the exit you deserve.',
  ],
  ctaLabel: ctaConfig.label,
  ctaHref: ctaConfig.href,
} as const;

// =============================================================================
// FINAL CTA
// =============================================================================

export const roofersFinalCta = {
  heading: 'Your Big Exit Starts With A 30-Minute Call.',
  subheading: 'Book Your Call Today.',
  body:
    'We\'ll learn about your business, share how the platform works, and tell you honestly whether we think it\'s a good match.',
  ctaLabel: ctaConfig.label,
  ctaHref: ctaConfig.href,
} as const;
