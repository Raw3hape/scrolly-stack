/**
 * V2 Page Content — Foundation Projects (Stitch edition)
 *
 * Single source of truth for ALL text content on /v2/ pages.
 * Content sourced from Google Stitch project «Foundation Projects - Site Map & Content PRD»
 *
 * TO EDIT CONTENT: Change strings in this file → hot-reload updates the page.
 * TO ADD A SECTION: Add an object to the `sections` array with the correct `type`.
 * TO REMOVE A SECTION: Delete the object from the array.
 * TO REORDER: Move objects within the array.
 */

import type { PageContent, FooterContent } from './types-v2';
import { routesV2 } from './nav-v2';

// =============================================================================
// SHARED FOOTER (used across all V2 pages)
// =============================================================================

export const footerContent: FooterContent = {
  brandDescription:
    'Redefining roofing as an institutional-grade asset class. Building permanent value through architectural excellence.',
  columns: [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: routesV2.about },
        { label: 'Investor Relations', href: routesV2.howItWorksInvestors },
        { label: 'Partnerships', href: routesV2.howItWorksRoofers },
        { label: 'Contact', href: routesV2.schedule },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Compliances', href: '#' },
      ],
    },
  ],
  subscribeText: 'Quarterly insights on the roofing asset class.',
  subscribeTitle: 'Stay Informed',
  subscribePlaceholder: 'Email Address',
  copyrightTagline: 'Architectural Integrity in Roofing.',
};

// =============================================================================
// HOME PAGE
// =============================================================================

// =============================================================================
// ABOUT PAGE
// =============================================================================

export const aboutContent: PageContent = {
  slug: 'about',
  metadata: {
    title: 'About — Foundation Projects',
    description:
      'We\u2019re a team of roofing industry professionals on a mission to get owners like you a big exit. No brokers, no PE traps.',
  },
  sections: [
    // ── S1: Hero ──
    {
      type: 'hero',
      id: 'about-hero',
      surface: 'dark',
      heading:
        'We\u2019re A Team Of Roofing Industry Professionals On A Mission To Get Owners Like You A Big Exit',
      subtext:
        'We know what your company is worth. We built Foundation Projects to avoid brokers and PE taking advantage.',
    },

    // ── S2: The PE Trap (problem statement) ──
    {
      type: 'cards',
      id: 'pe-trap',
      surface: 'base',
      heading: 'The \u2018PE Trap\u2019 Costing Owners Millions',
      subtext:
        'Too many owners get taken advantage of when they exit. Private Equity firms buy your legacy at a 3\u00d7 multiple, only to bundle it and flip it for 10\u00d7 within twenty-four months. You built the value; they keep the profit.',
      cards: [
        {
          icon: 'chart-bar',
          title: 'The 3\u00d7 vs 10\u00d7 Flip',
          text: 'PE buys your company at 3\u00d7 EBITDA, bundles it, and sells the platform at 10\u00d7 within two years. The upside was always yours\u2014they just took it.',
        },
        {
          icon: 'lock',
          title: 'Earn-Outs \u0026 Clawbacks',
          text: 'Most PE deals tie you to years of earn-outs, restrictive non-competes, and performance clawbacks that dilute your payout.',
        },
        {
          icon: 'cog',
          title: 'Culture Destruction',
          text: 'PE strips your brand, replaces your people, and turns your life\u2019s work into a line item on their portfolio.',
        },
      ],
    },

    // ── S3: Solution + Quote (reuse Mission pattern) ──
    {
      type: 'mission',
      id: 'solution',
      surface: 'dark',
      heading: 'So We Built a Better One.',
      headingAccent:
        'We aren\u2019t brokers looking for a quick commission. We are builders creating a platform for public exit.',
      steps: [
        {
          icon: 'arrow-up',
          title: 'Public Market Liquidity',
          text: 'Exit at institutional multiples, not local fire-sale prices. By aggregating industry-leading roofing firms, we unlock real value.',
        },
        {
          icon: 'shield',
          title: 'Legacy Protection',
          text: 'Your team remains, your name stays, your culture thrives. We acquire to empower, not to strip.',
        },
      ],
      quote: {
        text: '\u201CThe goal isn\u2019t just to sell.\u201D',
        body: 'The goal is to be part of the most valuable roofing entity ever built.',
        label: 'Our Founding Principle',
      },
    },

    // ── S4: Team ──
    {
      type: 'team',
      id: 'team',
      surface: 'base',
      heading: 'Our Team Doesn\u2019t Get Paid Until You Do',
      subtext:
        'Founded and led by veterans who have spent decades on rooftops, in boardrooms, and at the closing table.',
      members: [
        {
          name: 'Jacob Sterling',
          role: 'Founder',
          bio: 'Started Foundation Projects after watching his father\u2019s 40-year company sold for pennies.',
        },
        {
          name: 'Marcus Thorne',
          role: 'Operations Principal',
          bio: '25 years in roofing operations. Formerly scaled three regional outfits to $50M+ exits.',
        },
        {
          name: 'Elena Rodriguez',
          role: 'M\u0026A Strategy',
          bio: 'Specialist in construction roll-ups. Expert in finding the hidden value in your balance sheet.',
        },
      ],
    },

    // ── S5: Testimonial ──
    {
      type: 'testimonial',
      id: 'proof',
      surface: 'low',
      quote:
        'I was about to sign a 4\u00d7 multiple with a PE firm. Foundation showed me how my company was actually a 10\u00d7 asset if we partnered for a public exit. My family\u2019s wealth changed overnight.',
      author: 'Robert Vance',
      company: 'Former Owner, Vance Professional Roofing',
    },

    // ── S6: Final CTA ──
    {
      type: 'cta',
      id: 'about-cta',
      surface: 'base',
      overline: 'Join Us',
      heading: 'Building the platform that takes roofing public.',
      microcopy:
        'Don\u2019t leave your legacy to chance or predatory brokers. Let\u2019s see what your company is actually worth in a public environment.',
      buttonLabel: 'Book A Call',
    },
  ],
  footer: footerContent,
};

// =============================================================================
// HOME PAGE
// =============================================================================

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
        },
        {
          number: '02',
          title: 'We Scale Your Business',
          text: 'Upon acceptance, we inject institutional capital and systems to maximize your EBITDA and prepare for the public rollup.',
        },
        {
          number: '03',
          title: 'Get A Big Exit',
          text: 'Cash out at a valuation significantly higher than any individual sale could ever achieve, with equity in the public entity.',
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
