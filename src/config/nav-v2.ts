/**
 * Navigation configuration — Foundation Projects (Stitch edition)
 *
 * Defines header nav links, CTA button, and brand settings.
 * RESKIN: Update links, labels, and CTA target here.
 */

/** Route definitions */
export const routesV2 = {
  home: '/',
  about: '/about',
  howItWorksRoofers: '/how-it-works/roofers',
  howItWorksInvestors: '/how-it-works/investors',
  schedule: '/schedule',
  optIn: '/opt-in',
} as const;

/** Header navigation links — matches Stitch header exactly */
export const navLinksV2 = [
  { label: 'About', href: routesV2.about },
  { label: 'Roofers', href: routesV2.howItWorksRoofers },
  { label: 'Investors', href: routesV2.howItWorksInvestors },
  { label: 'Process', href: routesV2.optIn },
] as const;

/** CTA button configuration */
export const ctaConfigV2 = {
  label: 'Book A Call',
  href: routesV2.schedule,
  microcopy: 'Free 15-min call',
} as const;

/** Brand configuration */
export const brandConfigV2 = {
  wordmark: 'Foundation Projects',
  tagline: 'We Take Roofing Companies Public',
  logo: '/FoundationProjects_Logo_Main.svg',
  scrollToTopOnLogoClick: true,
} as const;

