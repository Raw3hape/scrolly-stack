/**
 * Home Page Page Content — Foundation Projects
 */

import type { PageContent } from '../types';
import { footerContent } from './shared';

export const homeContent: PageContent = {
  slug: 'home',
  metadata: {
    title: 'Foundation Projects — We Take Roofing Companies Public',
    description:
      'We\'re building a roofing company that goes public. Best-in-class operators get 7–10× what PE would pay.',
  },
  sections: [
    // ── S0: Value Props (Timeline) ──
    {
      type: 'timeline',
      id: 'value-props',
      surface: 'base',
      heading: 'Why Foundation Projects',
      steps: [
        {
          number: '01.',
          title: 'Get A Bigger Exit',
          icon: 'chart-bar',
          kpiLabel: 'Your Advantage',
          kpiValue: 'Public-Market Multiples vs. PE Discount',
        },
        {
          number: '02.',
          title: 'Stay In The Deal',
          icon: 'shield',
          kpiLabel: 'Your Advantage',
          kpiValue: 'Ownership Continuity & Equity Retention',
        },
        {
          number: '03.',
          title: 'We Only Get Paid When You Do',
          icon: 'dollar',
          kpiLabel: 'Your Advantage',
          kpiValue: 'Aligned Incentives & Zero Upfront Cost',
        },
      ],
    },

    // ── S1: Problem Statement (3 cards) ──
    {
      type: 'cards',
      id: 'problem-statement',
      surface: 'base',
      flush: true,
      heading: 'Most Roofing Companies Sell For Less Than They\u2019re Worth',
      subtext:
        'You get 10 emails a week from people offering to buy your business. Brokers want 20\u0025 to list you. PE firms want to lock you in before you\u2019re ready. And if you try to go it alone, you\u2019re spending 12-18 months on due diligence, cleanup, and systems you should have built years ago.',
      cards: [
        {
          icon: 'chart-bar',
          title: 'Fragmented Market',
          text: 'Local operators lack the scale to command public-market multiples, leaving millions on the table.',
        },
        {
          icon: 'lock',
          title: 'Asset Illiquidity',
          text: 'Finding the right buyer takes years, and most deals fall through during the grueling due diligence phase.',
        },
        {
          icon: 'cog',
          title: 'Operational Drag',
          text: 'Without institutional systems, your value is tied to your daily presence. We decouple you from the day-to-day.',
        },
      ],
    },

    // ── S2: Mission Block (dark) ──
    {
      type: 'mission',
      id: 'mission-block',
      surface: 'dark',
      heading: 'Foundation Projects is assembling a platform of best-in-class roofing companies \u2014',
      headingAccent: 'not to flip them to private equity, but to take them public.',
      steps: [
        {
          icon: 'shield',
          title: 'Aligned Partnership',
          text: 'We don\u2019t buy your company to change your culture. We partner with you to build the systems, operations, and scale that make your business worth more.',
        },
        {
          icon: 'arrow-up',
          title: 'Public Market Path',
          text: 'By combining high-performing roofing companies into one platform, we unlock the valuations only available on the public exchange \u2014 and you keep the majority.',
        },
      ],
      quote: {
        text: '\u201COur Promise\u201D',
        body: 'You keep running your business. We just make it worth a lot more.',
        label: 'Our Philosophy',
      },
      backgroundUrl: '/images/mission-roofing-bg.jpg',
    },

    // ── S3: Three Steps — "Here's How It Works" ──
    {
      type: 'steps',
      id: 'path-to-capital',
      surface: 'low',
      heading: 'Here\u2019s How It Works',
      steps: [
        {
          number: '01',
          title: 'Book A 30 Minute Call',
          text: 'First, we figure out if we\u2019re a good fit. We\u2019ll look at your roofing business, talk through your goals, and if it makes sense for both sides, we sign an NDA, agree on a Letter of Intent, and set your entry valuation.',
          footnote: 'You don\u2019t owe us anything at this stage. No money changes hands \u2014 just clarity.',
          icon: 'clock',
          ctaLabel: 'Book A Call',
        },
        {
          number: '02',
          title: 'We Scale Your Business',
          text: 'Once you\u2019re in, we come in and help fix and build the things that make a company worth more \u2014 like better systems, cleaner operations, AI tools that save time, and training for your team.',
          footnote: 'You keep running your business. We just make it worth a lot more.',
          icon: 'arrow-up',
        },
        {
          number: '03',
          title: 'Get A Big Exit',
          text: 'The companies combine and we take it public. You keep the majority of what your company is worth. We take 20\u0025 of the value we helped create \u2014 nothing until then.',
          footnote: 'Other companies give you 3X and sell at 10X. We only get paid when you do.',
          icon: 'dollar',
          ctaLabel: 'Book A Call',
        },
      ],
    },

    // ── S4: Urgency Block (dark card + image) ──
    {
      type: 'urgency',
      id: 'urgency',
      surface: 'base',
      heading: 'You\u2019ve spent years building your business. The window to get a return on that business is open.',
      headingAccent: 'It won\u2019t stay open forever.',
      text: 'The roofing industry is consolidating right now. The first platforms are already forming. Owners who get in early will lock in better valuations and a bigger share of what the platform is worth when it goes public. Owners who wait will be selling into a crowded market with fewer buyers and less leverage.',
      ctaLabel: 'Book A Call',
      image: '/images/urgency-building.png',
    },

    // ── S5: Final CTA ──
    {
      type: 'cta',
      id: 'final-cta',
      surface: 'base',
      heading: 'Your Big Exit Starts With A 30-Minute Call. Book Your Call Today.',
      microcopy: 'We\u2019ll learn about your business, share how the platform works, and tell you honestly whether we think it\u2019s a good match.',
      buttonLabel: 'Book A Call',
    },
  ],
  footer: footerContent,
};
