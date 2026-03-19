/**
 * Navigation configuration — Foundation Projects /v2/ (Stitch edition)
 *
 * Mirrors nav.ts but with /v2/ prefixed routes.
 * RESKIN: Update links, labels, and CTA target here.
 */

/** Route definitions — /v2/ namespace */
export const routesV2 = {
  home: '/v2',
  about: '/v2/about',
  howItWorksRoofers: '/v2/how-it-works/roofers',
  howItWorksInvestors: '/v2/how-it-works/investors',
  schedule: '/v2/schedule',
  optIn: '/v2/opt-in',
} as const;

/** Header navigation links for /v2/ — matches Stitch header exactly */
export const navLinksV2 = [
  { label: 'About', href: routesV2.about },
  { label: 'Roofers', href: routesV2.howItWorksRoofers },
  { label: 'Investors', href: routesV2.howItWorksInvestors },
  { label: 'Process', href: routesV2.optIn },
] as const;

/** CTA button configuration for /v2/ */
export const ctaConfigV2 = {
  label: 'Book A Call',
  href: routesV2.schedule,
  microcopy: 'Free 15-min call',
} as const;

/** Brand configuration (same as main) */
export const brandConfigV2 = {
  wordmark: 'Foundation Projects',
  tagline: 'We Take Roofing Companies Public',
  logo: '/FoundationProjects_Logo_Main.svg',
  scrollToTopOnLogoClick: true,
} as const;
