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
      surface: 'base',
      layout: 'editorial',
      heading:
        'We\u2019re A Team Of Roofing Industry Professionals On A Mission To Get Owners Like You A Big Exit',
      subtext:
        'We know what your company is worth. We built Foundation Projects to avoid brokers and PE taking advantage.',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBX2APLOJ_83bZdQwQ0rn9FyZ0Bfw21mUceg6Oj-5orhoFeDrTp5mX_EoSFUXZ2geGn2hVLnZpT0L1fs2lxrtSKSD65UXYjmCTzPL4Z_OBQLnuCibAFXfAzxlIQQ-5xGfYWf72uEOoCG6ttQRdRwlWdqDKobT8LQOgEfd8sAvmm1i6j-OwLXXSifdv6_Fzy8dAVgXG_vzEOzQ3IICFAtgpBawFy-Ab_en3WxHSWSAxwHnG8-s87aIWCp8k6A-U_Mb3LapV41dabzV7u',
    },

    // ── S2: The PE Trap (Chapter I — cinematic fullscreen) ──
    {
      type: 'cinematic',
      id: 'pe-trap',
      surface: 'dark',
      chapterLabel: 'Chapter I',
      chapterSubtitle: 'The Trap',
      heading: 'The \u2018PE Trap\u2019 Costing Owners Millions',
      card: {
        title: 'The 3\u00d7 vs 10\u00d7 Flip',
        text: 'Too many owners get taken advantage of when they exit. Private Equity firms buy your legacy at a 3\u00d7 multiple, only to bundle it and flip it for 10\u00d7 within twenty-four months. You built the value; they keep the profit.',
        footnote: 'The standard broker model is broken for roofers.',
      },
      backgroundUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAtZOkjOvEBTWZ6eAEKyTAhaUbZjetOkSp-gXyPlmzB04ujdDvRQop0t-rAQ0qFQMEMQOPioLFwQUUbNdk7c2X3JMJLtcjOTu1hrVlgxvVlMX0jzgyr2PdhPFZz7wVJvVIqEopxZ_bJD5h7Y3i-pA08tyWXhtiVNxLJVSd1fTSLXOv8PPc56CIfBBtsVVe2-D_ufxXT4zpq8Zj5KCIWk8N4sgQNt0KPykzoGbWsFpbUVGu9V3Jjuz2cs5sWltxoZFE6qfuYPGqFVI9-',
    },

    // ── S3: Solution + Quote (Chapter II style) ──
    {
      type: 'mission',
      id: 'solution',
      surface: 'base',
      layout: 'vertical',
      chapterLabel: 'Chapter II',
      heading: '\u2018So We Built a Better One\u2019',
      headingAccent:
        'We aren\u2019t brokers looking for a quick commission. We are builders creating a platform for public exit. By aggregating industry-leading roofing firms, we allow you to participate in the real upside.',
      steps: [
        {
          icon: 'building',
          title: 'Public Market Liquidity',
          text: 'Exit at institutional multiples, not local fire-sale prices.',
        },
        {
          icon: 'shield',
          title: 'Legacy Protection',
          text: 'Your team remains, your name stays, your culture thrives.',
        },
        {
          icon: 'target',
          title: 'Architectural Integrity',
          text: 'We focus on quality and structure, ensuring long-term value creation.',
        },
      ],
      quote: {
        text: '\u201CThe goal isn\u2019t just to sell. The goal is to be part of the most valuable roofing entity ever built.\u201D',
        body: '',
        label: 'Our Founding Principle',
      },
    },

    // ── S4: Team (Chapter III — The Curators) ──
    {
      type: 'team',
      id: 'team',
      surface: 'high',
      chapterLabel: 'The Curators',
      heading: 'The Curators',
      subtext:
        'Founded and led by veterans who have spent decades on rooftops, in boardrooms, and at the closing table.',
      members: [
        {
          name: 'Marcus Thorne',
          role: 'Operations Principal',
          bio: '25 years in roofing operations. Formerly scaled three regional outfits to $50M+ exits.',
          imageUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCmedK40XHbRbxaxM4RyZN15OBzrmPMvwKgCS47vRKu_jZkpWgJW2S_a3ZP-pqbY9eZgwWVS6x9yQSUjG9-vO1s0EHNM0LjaPKC36rKwX-YzvZCJF2Rwl9HilEI412TrnB4uWFzawz__TvZ6510Yo1ScdDjtWiHeuyBphMpfOTV5uNHNcc27A6Ew43pL5DmWZ2vK_4sdHlrH3V-2mHc4KCR_Ww8no8rBPbfNlwvu8Qsa7DKBLL5E6tk8YcSuedCzMPvbb1J_ErepYib',
        },
        {
          name: 'Elena Rodriguez',
          role: 'M&A Strategy',
          bio: 'Specialist in construction roll-ups. Expert in finding the hidden value in your balance sheet.',
          imageUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuC0j8BmRbEtuXQsNUFFoveZxyrXXfv6JxVhdiDS1mzjNcpiMGfn2HgRaaOMMM2LZzlByf7-3Es3jexlvYlIW_J8BLy2yhFvLXfjPYKAylw1nXfIzTnX7S3QYFSlnt70z0j1F_ODwRoalvydCyQdUT2egt_WSSjgHRafmW6s-pQ793Bw2tIbu4QPa7tb1xmB9oSk8EaqZghWNptYgXx0DVSM9iE8tt7wXmjCttw2bLLF7rRjRDCQqYZW9JF0kCfHld_lkonDGb_gJLKV',
        },
        {
          name: 'Jacob Sterling',
          role: 'Founder',
          bio: 'Started Foundation Projects after watching his father\u2019s 40-year company sold for pennies.',
          imageUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAkZjRjQOH0ikNMTjOqDzXqe4gBYg2YzjlJ0kUbGAlVCqm8D4myhpSk94Ru9PIQzc9i79ARsPG6pzBRIMskToUcMt6eWE6QIAy09rdlTkL4-jvpDkmvA-8UhOJiQnnCnoHxS12bycszbNj-JVMHzdY8qR7yh76HLRXovzLNsvbpE2Jie-B4yUJZGYmn6kJwHjR_HzVl0Oyo_eTrCitRCLMPY5MTEqH0WscDfDpCT3KKemztBYkgUDFfJQrMCTIMZ6jiGfHMCL1dhwpT',
        },
        {
          name: 'Laura Rodriguez',
          role: 'VP, Operations',
          bio: 'Built operating systems for 3 roofing roll-ups. CRM & RevOps expert.',
        },
        {
          name: 'David Park',
          role: 'CFO',
          bio: 'Former Big 4. Took two home services companies through IPO.',
        },
        {
          name: 'Rachel Foster',
          role: 'VP, Growth',
          bio: 'Grew a regional roofing company from $5M to $35M in 4 years.',
        },
      ],
    },

    // ── S5: Testimonial (Proof Of The Model) ──
    {
      type: 'testimonial',
      id: 'proof',
      surface: 'base',
      heading: 'Proof Of The Model',
      quote:
        'I was about to sign a 4\u00d7 multiple with a PE firm. Foundation showed me how my company was actually a 10\u00d7 asset if we partnered for a public exit. My family\u2019s wealth changed overnight.',
      author: 'Robert Vance',
      company: 'Former Owner, Vance Professional Roofing',
      avatarUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCyvr30AJ3qoJuO0iI17pQyOXQmaQ_STGrJVjtCPwvUaodE0KvCurSxL1oPuSHx1MnPsDv5m9CrAe179XIxOaQazlMgn7UjvWII0SxTfMNYUymQ5MvFdk6eC-rqIYo72r13U9Tklwqc-OQfR1UDwf0ONO5KrA-PfI5L0KukV2NKcMOMH2_wAYMvj3EYclS1bJ7yZSonxRCEI1OsZNdSP65qF1Vz8mkAfJDTWgp6sSK_yOes2v3341eLWD3VBU-kp6goVef-g7X7cpiY',
      badge: 'Verified Exit',
    },

    // ── S6: Final CTA (dark variant) ──
    {
      type: 'cta',
      id: 'about-cta',
      surface: 'dark',
      overline: 'Join Us',
      heading: 'Building the platform that takes roofing public.',
      microcopy:
        'Don\u2019t leave your legacy to chance or predatory brokers. Let\u2019s see what your company is actually worth in a public environment.',
      buttonLabel: 'Book A Call',
      secondaryButtonLabel: 'View Our Process',
      secondaryHref: '/how-it-works/roofers',
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
