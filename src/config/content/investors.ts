/**
 * Investors Page Content — Foundation Projects
 *
 * Hero, value props, ground floor opportunity, 3-step process,
 * stakes, why act now, and final CTA.
 *
 * Source of truth: CONTENT.md § PAGE 4: HOW IT WORKS — INVESTORS + full client brief
 */

import { ctaConfig } from '../nav';

// =============================================================================
// HERO
// =============================================================================

export const investorsHero = {
  heading: 'Invest in the Roofing Companies Going Public.',
  body: 'Roofing is a $60 billion industry that\'s never had a serious institutional platform. We\'re building it — and we\'re looking for investors who want in early.',
} as const;

// =============================================================================
// VALUE PROPS STRIP
// =============================================================================

export const investorsValueProps = [
  'Ground Floor Investing Opportunity',
  'Recession-Resistant Industry',
  'Get Paid When The Platform Goes Public',
] as const;

// =============================================================================
// GROUND FLOOR OPPORTUNITY
// =============================================================================

export const opportunity = {
  heading: 'Get In Early On A $60B Industry.',
  body: 'Most investors find out about consolidation plays in leading industries long after the value has already been created and the upside has already been distributed. Foundation Projects is at the beginning of that curve, assembling best-in-class roofing companies into a single platform with one destination: a public exit.',
} as const;

// =============================================================================
// 3-STEP PROCESS
// =============================================================================

export const investorsSteps = [
  {
    number: 1,
    title: 'Book A 30 Minute Call',
    description:
      'First, we figure out if we\'re a good fit. We\'ll look at your investing goals, and if it makes sense for both sides, we sign an NDA, agree on a Letter of Intent, and set your entry valuation.',
  },
  {
    number: 2,
    title: 'We Identify & Scale',
    description:
      'We source best-in-class roofing companies, assess fit, and bring them into the platform at entry valuations that make sense. Every company that joins strengthens the whole.',
  },
  {
    number: 3,
    title: 'We Go Public',
    description:
      'When the platform is ready, the companies combine and we take it public. That\'s where the multiple expansion happens — and where investors who got in early get paid.',
  },
] as const;

// =============================================================================
// STAKES
// =============================================================================

export const investorsStakes = {
  body: 'You\'ve spent years building your business. The window to get a return on that business is open. It won\'t stay open forever.',
  detail:
    'The roofing industry is consolidating right now. The first platforms are already forming. Owners who get in early will lock in better valuations and a bigger share of what the platform is worth when it goes public. Owners who wait will be selling into a crowded market with fewer buyers and less leverage.',
} as const;

// =============================================================================
// WHY ACT NOW
// =============================================================================

export const whyActNow = {
  heading: 'Roofing Consolidation Has Already Started. Early Investors Win.',
  subheading: 'When you work with us and get in early, here\'s what happens:',
  bullets: [
    'Get in before the multiples rise.',
    'Invest in an industry with proven, durable demand.',
    'Back a team with $1B+ in roofing revenue experience.',
    'Participate in a public exit — not a PE flip.',
  ],
  ctaLabel: ctaConfig.label,
  ctaHref: ctaConfig.href,
} as const;

// =============================================================================
// FINAL CTA
// =============================================================================

export const investorsFinalCta = {
  heading: 'Get Skin In The Game In The Roofing Industry.',
  body: 'The first institutional platforms are forming right now. The window to get in at the ground floor is open — but it won\'t stay open long. As the platform grows and the IPO gets closer, early entry becomes harder to find.',
  subheading: 'Book a 30-minute call today to see if this is a fit for your investing goals.',
  footnote: 'Spots are limited.',
  ctaLabel: ctaConfig.label,
  ctaHref: ctaConfig.href,
} as const;
