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
    // ── S1: Problem Statement (3 cards) ──
    {
      type: 'cards',
      id: 'problem-statement',
      surface: 'base',
      flush: true,
      heading: 'Most Roofing Companies Sell For Less Than They\u2019re Worth',
      subtext:
        'The industry is fragmented, undervalued, and ripe for consolidation. Most owners leave millions on the table because they don\u2019t have the right exit strategy.',
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
      heading: 'Foundation Projects is assembling a platform\u2026',
      headingAccent: 'not to flip, but to take public.',
      steps: [
        {
          icon: 'shield',
          title: 'Institutional Backbone',
          text: 'We provide the legal, financial, and operational systems to transform a trade business into an investment-grade asset.',
        },
        {
          icon: 'arrow-up',
          title: 'Public Market Arbitrage',
          text: 'By aggregating high-performing roofing companies, we unlock the massive valuation multiples only available on the public exchange.',
        },
      ],
      quote: {
        text: '\u201CThe Architectural Difference\u201D',
        body: 'We don\u2019t buy your company to change your culture. We buy it to architect its financial future while you keep doing what you do best.',
        label: 'Our Philosophy',
      },
      backgroundUrl: '/images/mission-roofing-bg.jpg',
    },

    // ── S3: Three Steps — "The Path To Permanent Capital" ──
    {
      type: 'steps',
      id: 'path-to-capital',
      surface: 'low',
      heading: 'The Path To Permanent Capital',
      subtext: 'A three-step architecture for your business\u2019s legacy.',
      steps: [
        {
          number: '01',
          title: 'Book A 30 Minute Call',
          text: 'We perform a high-level audit of your financials and market position to see if your company fits the Foundation blueprint.',
          icon: 'clock',
          ctaLabel: 'Book A Call',
        },
        {
          number: '02',
          title: 'We Scale Your Business',
          text: 'Upon acceptance, we inject institutional capital and systems to maximize your EBITDA and prepare for the public rollup.',
          icon: 'arrow-up',
        },
        {
          number: '03',
          title: 'Get A Big Exit',
          text: 'Cash out at a valuation significantly higher than any individual sale could ever achieve, with equity in the public entity.',
          icon: 'dollar',
          ctaLabel: 'Start Your Exit',
        },
      ],
    },

    // ── S4: Urgency Block (dark card + image) ──
    {
      type: 'urgency',
      id: 'urgency',
      surface: 'base',
      heading: 'The window to get a return…',
      headingAccent: 'won\u2019t stay open forever.',
      text: 'Consolidation is happening across the roofing sector. Those who join the Foundation Projects platform now will capture the highest upside of the initial public offering. Delaying means settling for local multiples in a saturated market.',
      ctaLabel: 'Reserve Your Valuation Audit',
      image: '/images/urgency-building.png',
    },

    // ── S5: Final CTA ──
    {
      type: 'cta',
      id: 'final-cta',
      surface: 'base',
      overline: 'Ready To Build The Exit?',
      heading: 'Your Big Exit Starts With A 30-Minute Call.',
      microcopy: 'No commitments. Just a strategic conversation about your legacy.',
      buttonLabel: 'Book A Call',
    },
  ],
  footer: footerContent,
};
