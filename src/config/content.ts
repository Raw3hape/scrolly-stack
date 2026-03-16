/**
 * Content configuration — Foundation Projects
 *
 * Single source of truth for all marketing copy.
 * RESKIN: Update text, headlines, and CTAs here — no need to touch components.
 */

import { ctaConfig } from './nav';

// =============================================================================
// HERO SECTION
// =============================================================================

export const heroContent = {
  headline: 'Build a roofing business that runs clean—and sells at a',
  headlineAccent: 'premium.',
  subheadline:
    'We install CRM + marketing systems, drive efficiency savings, and prepare you for an institutional-quality exit.',
  ctaLabel: 'See if I qualify →',
  ctaHref: ctaConfig.href,
  ctaAriaLabel: 'Check if you qualify for the program',
  statusText: 'Only for qualified roofers. Confidential application.',
} as const;

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
