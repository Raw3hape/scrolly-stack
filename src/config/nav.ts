/**
 * Navigation configuration — Foundation Projects (Stitch edition)
 *
 * Defines header nav links, CTA button, and brand settings.
 * RESKIN: Update links, labels, and CTA target here.
 */

/** Route definitions */
export const routes = {
  home: '/',
  about: '/about',
  howItWorksRoofers: '/how-it-works/roofers',
  howItWorksInvestors: '/how-it-works/investors',
  schedule: '/schedule',
  optIn: '/opt-in',
} as const;

/** Header navigation links — matches Stitch header exactly */
export const navLinks = [
  { label: 'About', href: routes.about },
  { label: 'Roofers', href: routes.howItWorksRoofers },
  { label: 'Investors', href: routes.howItWorksInvestors },
  { label: 'Process', href: routes.optIn },
] as const;

/** CTA button configuration */
export const ctaConfig = {
  label: 'Book A Call',
  href: routes.schedule,
  microcopy: 'Free 15-min call',
} as const;

/** Brand configuration */
export const brandConfig = {
  wordmark: 'Foundation Projects',
  tagline: 'We Take Roofing Companies Public',
  logo: '/FoundationProjects_Logo_Main.svg',
  scrollToTopOnLogoClick: true,
} as const;
