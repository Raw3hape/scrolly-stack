/**
 * Investors Page Content — Foundation Projects
 */

import type { PageContent } from '../types';

export const investorsContent: PageContent = {
  slug: 'how-it-works/investors',
  metadata: {
    title: 'Invest in Roofing Companies Going Public | Foundation Projects',
    description:
      'Invest early in the first institutional roofing platform heading to a public exit. Ground floor opportunity in a $60B recession-resistant industry.',
  },
  sections: [
    // ── S1: Hero — "Invest in the Roofing Companies Going Public" ──
    {
      type: 'hero',
      id: 'investors-hero',
      surface: 'base',
      layout: 'left',
      badge: 'FOR INVESTORS',
      heading:
        'Invest in the Roofing Companies Going Public',
      subtext:
        'Roofing is a $60 billion industry that\u2019s never had a serious institutional platform. We\u2019re building it \u2014 and we\u2019re looking for investors who want in early.',
      buttonLabel: 'Book A Call',
      trustBadges: [
        'Ground Floor Opportunity',
        'Recession-Resistant',
        'Paid At IPO',
      ],
      backgroundGlow: true,
      hero3dModel: 'ascending-blocks' as const,
    },

    // ── S2: Narrative — "Get In Early On A $60B Industry" ──
    {
      type: 'urgency',
      id: 'investors-narrative',
      surface: 'base',
      heading: 'Get In Early On A $60B Industry',
      text: 'Most investors find out about consolidation plays in leading industries long after the value has already been created and the upside has already been distributed.\n\nFoundation Projects is at the beginning of that curve, assembling best-in-class roofing companies into a single platform with one destination: a public exit.',
    },

    // ── S3: Process — "Here's How It Works" (vertical scroll timeline) ──
    {
      type: 'timeline',
      id: 'investors-process',
      surface: 'base',
      heading: 'Here\u2019s How It Works',
      steps: [
        {
          number: '01.',
          title: 'Book A 30 Minute Call',
          text: 'First, we figure out if we\u2019re a good fit. We\u2019ll look at your roofing business, talk through your goals, and if it makes sense for both sides, we sign an NDA, agree on a Letter of Intent, and set your entry valuation.',
          icon: 'clock',
          kpiLabel: 'What You Get',
          kpiValue: 'Fit Assessment & Entry Valuation',
        },
        {
          number: '02.',
          title: 'We Identify & Scale',
          text: 'We source best-in-class roofing companies, assess fit, and bring them into the platform at entry valuations that make sense. Every company that joins strengthens the whole.',
          icon: 'search',
          kpiLabel: 'The Result',
          kpiValue: 'Best-in-Class Platform Growth',
        },
        {
          number: '03.',
          title: 'We Go Public',
          text: 'When the platform is ready, the companies combine and we take it public. That\u2019s where the multiple expansion happens \u2014 and where investors who got in early get paid.',
          icon: 'building',
          kpiLabel: 'The Payoff',
          kpiValue: 'Multiple Expansion & Early Returns',
        },
      ],
    },

    // ── S4: Window — centered text on light background ──
    {
      type: 'cta',
      id: 'investors-window',
      surface: 'base',
      minimal: true,
      heading: 'The Window Is Open.',
      headingAccent: 'It Won\u2019t Stay Open Forever.',
      microcopy:
        'You\u2019ve spent years building your business. The window to get a return on that business is open. It won\u2019t stay open forever.\n\nThe roofing industry is consolidating right now. The first platforms are already forming. Owners who get in early will lock in better valuations and a bigger share of what the platform is worth when it goes public. Owners who wait will be selling into a crowded market with fewer buyers and less leverage.',
      buttonLabel: 'Book A Call',
    },

    // ── S5: Benefits — "Roofing Consolidation Has Already Started" ──
    {
      type: 'benefits-grid',
      id: 'investors-benefits',
      surface: 'dark',
      heading: 'Roofing Consolidation Has Already Started. Early Investors Win.',
      text: 'When you work with us and get in early, here\u2019s what happens:',
      cards: [
        {
          icon: 'arrow-up',
          title: 'Get In Before The Multiples Rise',
          text: 'Early entry means lower valuations and bigger upside when the platform goes public.',
        },
        {
          icon: 'shield',
          title: 'Proven, Durable Demand',
          text: 'Roofing is recession-resistant \u2014 roofs must be maintained regardless of the economy.',
        },
        {
          icon: 'users',
          title: '$1B+ In Roofing Revenue Experience',
          text: 'Back a team that has built and scaled roofing operations at massive scale.',
        },
        {
          icon: 'chart-bar',
          title: 'A Public Exit \u2014 Not A PE Flip',
          text: 'Participate in a public-market exit where early investors capture the multiple expansion.',
        },
      ],
    },

    // ── S6: Final CTA ──
    {
      type: 'cta',
      id: 'investors-cta',
      surface: 'base',
      overline: 'Limited Spots',
      heading: 'Get Skin In The Game In The Roofing Industry',
      microcopy:
        'The first institutional platforms are forming right now. The window to get in at the ground floor is open \u2014 but it won\u2019t stay open long. As the platform grows and the IPO gets closer, early entry becomes harder to find.\n\nBook a 30-minute call today to see if this is a fit for your investing goals. Spots are limited.',
      buttonLabel: 'Book A Call',
    },
  ],
};
