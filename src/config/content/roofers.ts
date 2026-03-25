/**
 * Roofers Page Content — Foundation Projects
 */

import type { PageContent } from '../types';
import { footerContent } from './shared';

export const roofersContent: PageContent = {
  slug: 'how-it-works/roofers',
  metadata: {
    title: 'How It Works — Roofers | Foundation Projects',
    description:
      'Discover how Foundation Projects helps roofing company owners achieve a premium exit through our public-market strategy.',
  },
  sections: [
    // ── S1: Hero (centered — Stitch: badge + heading + trust badge) ──
    {
      type: 'hero',
      id: 'roofers-hero',
      surface: 'base',
      layout: 'center',
      badge: 'FOR ROOFING FOUNDERS',
      heading:
        'Here\u2019s How You Can Get a Bigger Exit From Your Roofing Company',
      subtext:
        '3-step process proven to get 7\u00d7\u201310\u00d7 what PE would pay.',
      buttonLabel: 'Book A Call',
      trustBadge: 'No upfront costs. 30-minute fit assessment.',
      backgroundGlow: true,
      backgroundCanvas: false, // hidden — set to true to re-enable 3D grid
    },

    // ── S2: Problem — The Gap (split: image + text + bullets) ──
    {
      type: 'split',
      id: 'roofers-problem',
      surface: 'low',
      heading: 'Don\u2019t Leave Money On The Table When You Exit',
      text: 'Brokers and Private Equity firms look for distress or high-volume/low-margin operations. They want to buy your legacy for the lowest possible multiple. We take a different approach: we build architectural integrity into your business before the exit.',
      image: {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRoMJRRV0WMKNLuCiYV-djrerCmLe5gN4_7VnxcvKF2ygW7PLbi4sEe2LV_osyIVkx2s9x6il66jg_6xsZ2o0mvWbv5vwiPSHMWROJ76cK8ZQDksUHG67FkgEHliOLYDnPBuzzXVCBoVSCH_dtZUjPsSuLKNKfa57seVH9jAuBMSv07Xq3Ks6-h1kfZasfZ_ln3aP7-FVIfMmundePpt88oJ2m7WcUCbH36Sm_OrAbGJ4gZOOZ5RIaZG0yc64yRvWF19xr3Zrn9vBB',
        quote: '\u201CThe traditional exit model is broken for independent roofers.\u201D',
      },
      bullets: [
        { icon: 'cancel', text: 'Brokers take huge commissions regardless of your final valuation.' },
        { icon: 'cancel', text: 'PE firms strip culture and talent to squeeze short-term margins.' },
        { icon: 'cancel', text: 'Most founders exit at a 3\u00d7\u20134\u00d7 multiple and regret it in 24 months.' },
      ],
    },

    // ── S3: The 3-Step Process (cards variant with icons) ──
    {
      type: 'steps',
      id: 'roofers-process',
      surface: 'base',
      variant: 'cards',
      heading: 'The 3-Step Process',
      steps: [
        {
          number: '01',
          title: 'Book A 30 Minute Call',
          text: 'We start with a high-level fit assessment. If we\u2019re aligned, we sign a standard NDA and provide a Letter of Intent (LOI) within 7 days.',
          icon: 'clock',
        },
        {
          number: '02',
          title: 'We Scale Your Business',
          text: 'This is where the magic happens. We inject proprietary AI tools, systematize your operations, and optimize your roofing crew management to drive EBITDA.',
          icon: 'cog',
        },
        {
          number: '03',
          title: 'Get A Big Exit',
          text: 'We roll your company into our larger platform. By combining companies and going public, you keep majority value at an institutional multiple (7\u00d7\u201310\u00d7).',
          icon: 'building',
        },
      ],
    },

    // ── S4: Benefits Grid — "Scale Without The Stress" (dark glass cards) ──
    {
      type: 'benefits-grid',
      id: 'roofers-benefits',
      surface: 'dark',
      heading: 'Scale Without The Stress',
      text: 'Foundation Projects isn\u2019t just an acquirer; we are an architectural partner for your legacy. We build the systems so you can focus on the craft.',
      ctaLabel: 'Learn About Our Systems',
      cards: [
        {
          icon: 'lock',
          title: 'Stop Cold Emails',
          text: 'We handle the institutional lead gen so you can stop dealing with spammy brokers.',
        },
        {
          icon: 'cog',
          title: 'Business Runs Better',
          text: 'Automate the boring parts of roofing management with our proprietary software suite.',
        },
        {
          icon: 'arrow-up',
          title: 'Fast-Growing Platform',
          text: 'Join an elite network of roofing founders all moving toward a massive collective liquidity event.',
        },
        {
          icon: 'shield',
          title: 'Keep Your Legacy',
          text: 'We preserve your brand and culture while providing the institutional backing you need.',
        },
      ],
    },

    // ── S5: Final CTA ──
    {
      type: 'cta',
      id: 'roofers-cta',
      surface: 'base',
      overline: 'Ready For Your Exit?',
      heading: 'Your Big Exit Starts With A 30-Minute Call.',
      microcopy:
        'No obligations. We\u2019ll show you exactly how we\u2019re valuing roofing companies in today\u2019s market.',
      buttonLabel: 'Book A Call',
    },
  ],
  footer: footerContent,
};
