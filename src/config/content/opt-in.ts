/**
 * Opt-In Page Content — Foundation Projects
 *
 * Lead magnet heading, body, badge, form labels, and CTA.
 *
 * Source of truth: CONTENT.md § PAGE 5B: FREEBIE OPT-IN + full client brief
 */

export const optInContent = {
  badge: 'FREE, INSTANT DOWNLOAD',
  heading: '8 Things Private Equity Has Wrong About The Roofing Industry.',
  body: 'What brokers & PE firms don\'t understand about this $60B industry — and why it\'s costing owners (and investors!) millions.',
  ctaLabel: 'Get Instant Access — FREE',
  /** Alt text for the freebie mockup image */
  mockupAlt: 'Free report: 8 Things Private Equity Has Wrong About The Roofing Industry',
  /** Path to the freebie mockup image in public/ */
  mockupSrc: '/freebie-mockup.png',
  formFields: {
    firstName: {
      label: 'First Name',
      placeholder: 'Your first name',
      required: true,
    },
    email: {
      label: 'Email',
      placeholder: 'you@company.com',
      required: true,
    },
  },
} as const;
