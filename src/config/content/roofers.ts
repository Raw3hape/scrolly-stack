/**
 * Roofers Page Content — Foundation Projects
 */

import type { PageContent } from '../types';

export const roofersContent: PageContent = {
  slug: 'how-it-works/roofers',
  metadata: {
    title: 'How It Works — Roofers | Foundation Projects',
    description:
      'Discover how Foundation Projects helps roofing company owners achieve a premium exit through our public-market strategy.',
  },
  sections: [
    // ── S1: Hero (centered — Stitch: badge + heading + trust badges) ──
    {
      type: 'hero',
      id: 'roofers-hero',
      surface: 'base',
      layout: 'left',
      badge: 'FOR ROOFING FOUNDERS',
      heading: 'Here\u2019s How You Can Get a Bigger Exit From Your Roofing Company',
      subtext:
        'We take roofing companies through a 3-step process proven to get you 7x\u201310x what a Private Equity firm would have paid you.',
      buttonLabel: 'Book A Call',
      trustBadges: ['Get A Bigger Exit', 'Stay In The Deal', 'We Only Get Paid When You Do'],
      backgroundGlow: true,
      hero3dModel: 'pyramid' as const,
    },

    // ── S2: Problem — The Gap (split: image + text + bullets) ──
    {
      type: 'split',
      id: 'roofers-problem',
      surface: 'low',
      heading: 'Don\u2019t Leave Money On The Table When You Exit',
      text: 'Brokers take 20% to list you. PE firms offer 3x and lock you in before you\u2019re ready. And if you try to sell on your own, you\u2019re looking at 12\u201318 months of due diligence and cleanup. Every path leaves money on the table \u2014 and most of it ends up in someone else\u2019s pocket.',
      image: {
        url: '/images/estate-pool-pasture-fixed.png',
        quote: '\u201CThe traditional exit model is broken for independent roofers.\u201D',
      },
      bullets: [
        {
          icon: 'cancel',
          text: 'Brokers take huge commissions regardless of your final valuation.',
        },
        {
          icon: 'cancel',
          text: 'PE firms strip culture and talent to squeeze short-term margins.',
        },
        {
          icon: 'cancel',
          text: 'Most founders exit at a 3\u00d7\u20134\u00d7 multiple and regret it in 24 months.',
        },
      ],
    },

    // ── S3: The 3-Step Process (cards variant with icons) ──
    {
      type: 'steps',
      id: 'roofers-process',
      surface: 'base',
      variant: 'cards',
      heading: 'Here\u2019s How It Works',
      steps: [
        {
          number: '01',
          title: 'Book A 30 Minute Call',
          text: 'First, we figure out if we\u2019re a good fit. We\u2019ll look at your roofing business, talk through your goals, and if it makes sense for both sides, we sign an NDA, agree on a Letter of Intent, and set your entry valuation.\n\nYou don\u2019t owe us anything at this stage. No money changes hands \u2014 just clarity.',
          icon: 'clock',
        },
        {
          number: '02',
          title: 'We Scale Your Business',
          text: 'Once you\u2019re in, we come in and help fix and build the things that make a company worth more \u2014 better systems, cleaner operations, AI tools that save time, and training for your team.\n\nYou keep running your business. We just make it worth a lot more.',
          icon: 'cog',
        },
        {
          number: '03',
          title: 'Get A Big Exit',
          text: 'The companies combine and we take it public. You keep the majority of what your company is worth. We take 20% of the value we helped create \u2014 nothing until then.\n\nOther companies give you 3X and sell at 10X. We only get paid when you do.',
          icon: 'building',
        },
      ],
    },

    // ── S4: Benefits Grid — "Let's Get You The Exit You Deserve" (dark glass cards) ──
    {
      type: 'benefits-grid',
      id: 'roofers-benefits',
      surface: 'dark',
      heading: 'Let\u2019s Get You The Exit You Deserve',
      text: 'When you work with us, here\u2019s what happens:',
      cards: [
        {
          icon: 'lock',
          title: 'No More Lowball Offers',
          text: 'You stop fielding cold emails from brokers and PE firms trying to buy your business for less than what it\u2019s worth.',
        },
        {
          icon: 'cog',
          title: 'Business Runs Better',
          text: 'Your business runs better than it ever has \u2014 and is more attractive when you exit.',
        },
        {
          icon: 'arrow-up',
          title: 'Fast-Growing Platform',
          text: 'You\u2019re part of a platform that\u2019s growing fast and worth a lot more than any single company.',
        },
        {
          icon: 'shield',
          title: 'Cash Out at 7\u201310x',
          text: 'You go public and cash out at 7\u201310x what a PE firm would have paid you. You kept the upside and got the exit you deserve.',
        },
      ],
    },

    // ── S5: Final CTA ──
    {
      type: 'cta',
      id: 'roofers-cta',
      surface: 'base',
      overline: 'Ready For Your Exit?',
      heading: 'Your Big Exit Starts With A 30-Minute Call. Book Your Call Today.',
      microcopy:
        'We\u2019ll learn about your business, share how the platform works, and tell you honestly whether we think it\u2019s a good match.',
      buttonLabel: 'Book A Call',
    },
  ],
};
