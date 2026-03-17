/**
 * Navigation configuration — Foundation Projects
 * 
 * Defines header nav links, CTA button, and brand settings.
 * RESKIN: Update links, labels, and CTA target here.
 */

/** Route definitions — type-safe navigation */
export const routes = {
  home: '/',
  about: '/about',
  howItWorksRoofers: '/how-it-works/roofers',
  howItWorksInvestors: '/how-it-works/investors',
  schedule: '/schedule',
  shadowLocal: '/shadow-local',
  optIn: '/3b-opt-in',
} as const;

/** Header navigation links */
export const navLinks = [
  { label: 'About', href: routes.about },
  { label: 'How It Works', href: routes.howItWorksRoofers },
  { label: 'Investors', href: routes.howItWorksInvestors },
] as const;

/** CTA button configuration */
export const ctaConfig = {
  label: 'Book A Call',
  /** Temporary: links to google.com. Replace with routes.schedule or Calendly URL */
  href: 'https://google.com',
  arrowIcon: true,
  microcopy: 'Free 15-min call',
} as const;

/** Brand configuration */
export const brandConfig = {
  wordmark: 'Foundation Projects',
  tagline: 'We Take Roofing Companies Public',
  /** Logo SVG path relative to public/ — vector for crisp rendering at any size */
  logo: '/FoundationProjects_Logo_Main.svg',
  scrollToTopOnLogoClick: true,
} as const;

/** Header behavior */
export const headerBehavior = {
  hideOnScrollDown: true,
  showOnScrollUp: true,
  scrollThreshold: 50,
  glassmorphism: true,
} as const;
