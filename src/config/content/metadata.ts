/**
 * SEO Metadata — Foundation Projects
 *
 * Centralized title + description for every page.
 * Pages import from here instead of hardcoding `export const metadata`.
 *
 * Source of truth: CONTENT.md § SEO Metadata
 */

export const pageMetadata = {
  home: {
    title: 'Foundation Projects — We Take Roofing Companies Public',
    description:
      'We\'re building a roofing company that goes public. Get 7–10× what PE would pay. Book a call today.',
  },
  about: {
    title: 'About Foundation Projects — Mission & Team',
    description:
      'On a mission to get roofing owners a bigger exit. $1B+ in roofing revenue experience.',
  },
  roofers: {
    title: 'How It Works for Roofers — Foundation Projects',
    description:
      'A proven 3-step process: book a call, we scale your business, get a big exit at 7–10×.',
  },
  investors: {
    title: 'How It Works for Investors — Foundation Projects',
    description:
      'Invest in $60B recession-resistant roofing. Get in early before multiples rise.',
  },
  schedule: {
    title: 'Book A Call — Foundation Projects',
    description:
      'Schedule a free 15-minute call to see if your roofing company qualifies.',
  },
  optIn: {
    title: 'Free Report — 8 Things PE Has Wrong About Roofing',
    description:
      'Download the free report on what brokers & PE firms get wrong about the roofing industry.',
  },
} as const;
