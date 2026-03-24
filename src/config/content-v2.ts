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
      backgroundUrl: '/images/cinematic-roofing-bg.jpg',
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
      autoPlayInterval: 8000,
      testimonials: [
        {
          quote:
            'I was about to sign a 4\u00d7 multiple with a PE firm. Foundation showed me how my company was actually a 10\u00d7 asset if we partnered for a public exit. My family\u2019s wealth changed overnight.',
          author: 'Robert Vance',
          company: 'Former Owner, Vance Professional Roofing',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCyvr30AJ3qoJuO0iI17pQyOXQmaQ_STGrJVjtCPwvUaodE0KvCurSxL1oPuSHx1MnPsDv5m9CrAe179XIxOaQazlMgn7UjvWII0SxTfMNYUymQ5MvFdk6eC-rqIYo72r13U9Tklwqc-OQfR1UDwf0ONO5KrA-PfI5L0KukV2NKcMOMH2_wAYMvj3EYclS1bJ7yZSonxRCEI1OsZNdSP65qF1Vz8mkAfJDTWgp6sSK_yOes2v3341eLWD3VBU-kp6goVef-g7X7cpiY',
          badge: 'Verified Exit',
        },
        {
          quote:
            'After 30 years on rooftops, I thought selling to a national chain was my only option. Foundation\u2019s public-market approach gave me 3\u00d7 what the highest PE offer was \u2014 and I still run my crew.',
          author: 'Linda Hargrove',
          company: 'Founder, Hargrove & Sons Roofing',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuC0j8BmRbEtuXQsNUFFoveZxyrXXfv6JxVhdiDS1mzjNcpiMGfn2HgRaaOMMM2LZzlByf7-3Es3jexlvYlIW_J8BLy2yhFvLXfjPYKAylw1nXfIzTnX7S3QYFSlnt70z0j1F_ODwRoalvydCyQdUT2egt_WSSjgHRafmW6s-pQ793Bw2tIbu4QPa7tb1xmB9oSk8EaqZghWNptYgXx0DVSM9iE8tt7wXmjCttw2bLLF7rRjRDCQqYZW9JF0kCfHld_lkonDGb_gJLKV',
          badge: 'Verified Exit',
        },
        {
          quote:
            'The due diligence alone would have cost me a year with a traditional broker. Foundation\u2019s team had our financials structured and investor-ready in 8 weeks. We closed at a 7.2\u00d7 multiple.',
          author: 'Marcus Delgado',
          company: 'CEO, Pinnacle Roofing Group',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAkZjRjQOH0ikNMTjOqDzXqe4gBYg2YzjlJ0kUbGAlVCqm8D4myhpSk94Ru9PIQzc9i79ARsPG6pzBRIMskToUcMt6eWE6QIAy09rdlTkL4-jvpDkmvA-8UhOJiQnnCnoHxS12bycszbNj-JVMHzdY8qR7yh76HLRXovzLNsvbpE2Jie-B4yUJZGYmn6kJwHjR_HzVl0Oyo_eTrCitRCLMPY5MTEqH0WscDfDpCT3KKemztBYkgUDFfJQrMCTIMZ6jiGfHMCL1dhwpT',
          badge: 'Verified Exit',
        },
      ],
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

// =============================================================================
// ROOFERS PAGE — HOW IT WORKS
// =============================================================================

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

// =============================================================================
// INVESTORS PAGE — HOW IT WORKS
// =============================================================================

export const investorsContent: PageContent = {
  slug: 'how-it-works/investors',
  metadata: {
    title: 'How It Works \u2014 Investors | Foundation Projects',
    description:
      'The architectural blueprint for institutional-grade returns in the roofing asset class. Precision deployment, strategic acquisition, public-market exit.',
  },
  sections: [
    // ── S1: Hero — "The Equity of Structure" ──
    {
      type: 'hero',
      id: 'investors-hero',
      surface: 'base',
      layout: 'editorial',
      overline: 'Investment Framework',
      heading: 'The Equity of\nStructure.',
      subtext:
        'Transitioning roofing from a fragmented trade into a high-yield institutional asset class. We provide the capital, the technology, and the governance.',
      stat: {
        value: '18.4%',
        label: 'Target IRR',
      },
    },

    // ── S2: Cinematic — "Precision Deployment" ──
    {
      type: 'cinematic',
      id: 'precision-deployment',
      surface: 'dark',
      chapterLabel: 'The Model',
      chapterSubtitle: 'Precision Deployment',
      heading: 'Built Like A Blueprint',
      card: {
        title: 'Precision Deployment',
        text: 'Our model is built on the same principles as a blueprint: rigorous planning, material integrity, and a focus on longevity. We acquire established roofing operations and scale them through centralized efficiency.',
        footnote: 'Read Whitepaper',
      },
      backgroundUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBui31Eggs0Rm1wRiKwLI_X5vBhN91BmL3LefpCWc1rUVEYh__JDhoFp-MC9wV3gIjXCn9GIcWHud17_Zx0BC3P7IDW6ub0rWdabnG4voXOWm1Z5OTlUxnTS7OIG-T8jGkJKL9Qg-Ks8lSdY0IFtnU4kV-ShdVSJigGwgrfnqTRgW8r9jiaFv-NUfu3yeOvEjDjZxiZXaV1pg1O8ZmdHHmsseh7fvRB3OGqSF0eAkMeiZaQL_XTXY020uY9froPiVvXbst36HpsmaAr',
    },

    // ── S3: Timeline — "Our Investment Lifecycle" ──
    {
      type: 'timeline',
      id: 'investment-lifecycle',
      surface: 'base',
      heading: 'Our Investment Lifecycle',
      steps: [
        {
          number: '01.',
          title: 'Strategic Acquisition',
          text: 'Identifying high-performing regional roofing contractors with a minimum 10-year track record and strong community reputation.',
          icon: 'search',
          kpiLabel: 'KPI Focus',
          kpiValue: 'EBITDA Stability & Safety Rating',
        },
        {
          number: '02.',
          title: 'Operational Overhaul',
          text: 'Implementing our proprietary logistics and CRM engine to reduce waste and improve field team communication by 40%.',
          icon: 'cog',
          kpiLabel: 'KPI Focus',
          kpiValue: 'Tech Stack Integration & Margin Expansion',
        },
        {
          number: '03.',
          title: 'Portfolio Aggregation',
          text: 'Bundling regional leaders into a national infrastructure asset, creating diversified risk profiles and economies of scale.',
          icon: 'building',
          kpiLabel: 'KPI Focus',
          kpiValue: 'Aggregate Yield & Geographic Resilience',
        },
      ],
    },

    // ── S4: Bento Grid — Core Thesis + Stats ──
    {
      type: 'bento',
      id: 'bento-thesis',
      surface: 'base',
      feature: {
        overline: 'Core Thesis',
        heading: 'Roofing is the ultimate infrastructure annuity.',
        text: 'Unlike traditional real estate, roofing is a non-discretionary capital expenditure. Weather and age make it a perpetual requirement.',
        bullets: [
          'Non-cyclical demand driven by weather and building age',
          'Recession-resistant: roofs must be maintained regardless of economy',
          'Fragmented market with 80,000+ operators creates consolidation opportunity',
        ],
      },
      linkCard: {
        title: 'Investor Portal',
        text: 'Real-time portfolio performance tracking.',
        href: routesV2.schedule,
        icon: 'chart-bar',
      },
      highlight: {
        value: '18.4',
        label: 'Target IRR',
        context: 'Across 10+ active regional portfolios',
      },
      stats: [
        { value: '10', suffix: '+', label: 'Active Markets' },
        { value: '450', prefix: '$', suffix: 'M', label: 'Asset Value Managed' },
        { value: '7.2', suffix: '×', label: 'Average Exit Multiple' },
        { value: '96', suffix: '%', label: 'Operator Retention Rate' },
      ],
    },

    // ── S5: Trust — "Governed by integrity" ──
    {
      type: 'trust',
      id: 'trust-partners',
      surface: 'base',
      badge: 'Verified Institutional Partner',
      heading: 'Governed by integrity, built for performance.',
      partners: [
        'Goldman & Co.',
        'Vanguard Group',
        'Architectural Digest',
        'REIT Journal',
      ],
    },

    // ── S6: Final CTA ──
    {
      type: 'cta',
      id: 'investors-cta',
      surface: 'dark',
      overline: 'Deploy Capital',
      heading: 'Deploy Capital Into Roofing\u2019s Public Moment.',
      microcopy:
        'Schedule a confidential institutional briefing. No commitments \u2014 just the blueprint.',
      buttonLabel: 'Schedule Briefing',
      secondaryButtonLabel: 'View Our Process',
      secondaryHref: routesV2.howItWorksRoofers,
    },
  ],
  footer: footerContent,
};

// =============================================================================
// OPT-IN PAGE — Freebie Lead Magnet
// =============================================================================

export const optInContent: PageContent = {
  slug: 'opt-in',
  metadata: {
    title: 'Free Report \u2014 8 Things PE Has Wrong | Foundation Projects',
    description:
      'Download our free report revealing what brokers & PE firms don\u2019t understand about the $60B roofing industry \u2014 and why it\u2019s costing owners millions.',
  },
  sections: [
    // \u2500\u2500 S1: Opt-In Hero (3D Book + Form) \u2500\u2500
    {
      type: 'opt-in-hero',
      id: 'optin-hero',
      surface: 'base',
      overline: 'Foundation Insights Series',
      heading:
        'FREE, INSTANT DOWNLOAD: What brokers & PE firms don\u2019t understand about this $60B industry.',
      subtext:
        'The roofing sector is being aggressively targeted by outside capital. Most founders are leaving millions on the table because they follow the wrong playbook.',
      book: {
        title: '8 Things Private Equity Has Wrong',
        subtitle: 'Foundation Projects Architecture',
        coverUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuB5e1C1cLPMEhOxLTQK-CSgouRPZ8vuAJBfLUwmj2-qkiQIPpKRi8nUTR6eetBAtvmSml_qrOKY6qGv_NQEBNrcyUZKO9bLFUHPtL-Rzmk9vKp48hDCz9XO5Jrct_uLuyKXHtPaTi8TVkce_7qhCdHZXs-ZAYB139tTl-0-s53Od7yFZwS5llv17r2tCTQf9bq9ZD6Br_Lc-sN0XKb2p0WdBFXF1PuYziL_JK3vobzu4YFNrYaeLzIPCJ8uA9SlNPV1YtdFlp_jTidD',
      },
      trustBadge: {
        text: 'Industry Verified',
        metric: 'Over 500+ Copies Distributed to Owners',
      },
      form: {
        fields: [
          {
            name: 'firstName',
            label: 'First Name',
            placeholder: 'Jane Doe',
            type: 'text',
            required: true,
          },
          {
            name: 'email',
            label: 'Work Email',
            placeholder: 'jane@company.com',
            type: 'email',
            required: true,
          },
        ],
        submitLabel: 'Get Instant Access \u2014 FREE',
        disclaimer:
          'Your data is secure. Architectural integrity in everything we do.',
      },
      valueProps: [
        {
          icon: 'chart-bar',
          title: 'Valuation Gaps',
          text: 'Why current brokerage models are costing roofing owners millions in realized value.',
        },
        {
          icon: 'users',
          title: 'Founder Exclusion',
          text: 'How standard PE deal structures systematically sideline the original founders post-sale.',
        },
        {
          icon: 'shield',
          title: 'The Debt Trap',
          text: 'The hidden risk of leverage-heavy acquisitions in a cyclical $60B industry.',
        },
      ],
    },

    // \u2500\u2500 S2: Testimonials (horizontal bleed scroll) \u2500\u2500
    {
      type: 'opt-in-testimonials',
      id: 'optin-testimonials',
      surface: 'low',
      heading:
        'The industry is changing. Don\u2019t be the last to know the new rules.',
      subtext:
        'We\u2019ve spent a decade analyzing roofing assets from the inside. This guide is the synthesis of that architectural perspective.',
      pullQuote: {
        text: '\u201CUnparalleled clarity.\u201D',
        source: 'Modern Roofing Journal',
      },
      testimonials: [
        {
          quote:
            'Finally, someone addresses the debt-load issue in PE rollups. A must-read for any owner over $10M.',
          role: 'CEO',
          company: 'Northeast Roofing Group',
          verified: true,
        },
        {
          quote:
            'Foundation Projects understands that roofing is about people, not just spreadsheets.',
          role: 'Founder',
          company: 'Heritage Exteriors',
          verified: true,
        },
        {
          quote:
            'The section on broker incentives was eye-opening. We almost made a huge mistake.',
          role: 'Managing Partner',
          company: 'Skyline Labs',
          verified: true,
        },
        {
          quote:
            'Clear, authoritative, and actionable. Best free resource I\u2019ve seen this year.',
          role: 'Principal',
          company: 'Capstone Partners',
          verified: true,
        },
        {
          quote:
            'An architectural approach to business that was missing in our sector.',
          role: 'Managing Director',
          company: 'Summit Exteriors',
          verified: true,
        },
        {
          quote:
            'Changed our entire exit strategy overnight. The data on public-market valuations is unmatched.',
          role: 'Owner',
          company: 'Pacific Coast Roofing',
          verified: true,
        },
        {
          quote:
            'We were about to sign with a broker. This report saved us from leaving millions on the table.',
          role: 'President',
          company: 'Ironclad Systems',
          verified: true,
        },
        {
          quote:
            'The only guide that treats roofing as a legitimate asset class. Refreshingly honest.',
          role: 'CFO',
          company: 'Ridgeline Holdings',
          verified: true,
        },
        {
          quote:
            'Shared this with every owner in my network. It\u2019s the kind of insight you usually pay consultants for.',
          role: 'VP Operations',
          company: 'Granite Shield Roofing',
          verified: true,
        },
      ],
    },

    // ── S3: Final CTA (dark, same style as homepage) ──
    {
      type: 'cta',
      id: 'optin-cta',
      surface: 'dark',
      overline: 'Ready To Build The Exit?',
      heading: 'Your Big Exit Starts With A 30-Minute Call.',
      microcopy: 'No commitments. Just a strategic conversation about your legacy.',
      buttonLabel: 'Book A Call',
    },
  ],
  footer: footerContent,
};

// =============================================================================
// SCHEDULE PAGE — Book A Call
// =============================================================================

export const scheduleContent: PageContent = {
  slug: 'schedule',
  metadata: {
    title: 'Schedule A Call \u2014 Foundation Projects',
    description:
      'Book a free 30-minute strategy session with Foundation Projects. Discover how we help roofing company owners achieve premium exits through our public-market strategy.',
  },
  sections: [
    // ── S1: Hero ──
    {
      type: 'schedule-hero',
      id: 'schedule-hero',
      surface: 'base',
      heading: 'Your Next Step Is To Book A Call',
      subtext:
        'If you\u2019re serious about cashing in on a $60B industry \u2014 booking a call is the right choice.',
      smsBadge: {
        text: 'Schedule a call below or text',
        keyword: 'ROOF',
        phone: 'XXX-XXX-XXXX',
      },
    },

    // ── S2: Booking Widget (sidebar + calendar) ──
    {
      type: 'schedule-booking',
      id: 'schedule-booking',
      surface: 'base',
      flush: true,
      provider: 'built-in',
      sidebar: {
        heading: 'What to expect',
        items: [
          {
            icon: 'clock',
            title: '30 min call',
            text: 'A focused session to evaluate alignment and potential.',
          },
          {
            icon: 'target',
            title: 'Clarity',
            text: 'We break down the architectural integrity of our investment model.',
          },
          {
            icon: 'shield',
            title: 'No obligation',
            text: 'High-level conversation. You decide if we move forward.',
          },
        ],
        trustBadge: {
          label: 'Direct Access',
          text: 'You will be speaking directly with our lead structural strategist.',
        },
      },
      widget: {
        label: 'Select Date & Time',
        title: 'Strategy Session',
        timezone: 'Eastern Standard Time (EST)',
        timeSlots: ['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM', '4:00 PM'],
        submitLabel: 'Next Step',
      },
    },

    // ── S3: Testimonial Quote ──
    {
      type: 'schedule-quote',
      id: 'schedule-quote',
      surface: 'dark',
      quote:
        'The calls we have are the pivot point. It\u2019s where the vision for a permanent roofing asset meets the execution of the architectural plan.',
      author: 'Julian Vance',
      role: 'Managing Partner, Foundation Projects',
      avatarUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAKeVPf5NXaFE5Fv34zBCkEo8z0RI3TS0Eqysjute0rNYknk4K_APwkN50pa7vZxDlBMT8qbeC77l68TXWDrVxW5Bnjvz23Be063qzrkwsCdRzmejWW35qu336_J98HtDG1vzQLFuSknyIkpfZ2Ek-JuO__MpMvcetJ6EkdPBac6W8sQSP0TngPs6gHon_q6HTarBoS1vt_bypiMFd6YlZ-0Oacadp1mHlYTqZhQzEZfvqzVST8BtoE06EW8di1rULeaTXJiKtXpt6t',
      backgroundUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC1uN36zRMO7vTpPWW9EPZYxGof3KIjExoy7PugBT7CvyedXr4UXVc-PP5sZ5YhcxTkjE0FIO5oaxAE8ahMEC_0PTA2C8kv5CVAGUbwrIbYp6-pF5ox6jeUIYAPKoiGlVGKPfu7KzyK8E295aOmubDR2N1Psto4wCEG072-kLF2bfTRC7fqAkzGl0QEbot4k3rvjit3_Jg-unRUBbKOyHxgjaYO5vUrT4vOZxmSsdFdlFXZ-a52rWfxPFXMKeXKMM66ysChkyO3sBuP',
    },

    // ── S4: Final CTA (dark) ──
    {
      type: 'cta',
      id: 'schedule-cta',
      surface: 'dark',
      overline: 'Ready To Build The Exit?',
      heading: 'Your Big Exit Starts With A 30-Minute Call.',
      microcopy:
        'No commitments. Just a strategic conversation about your legacy.',
      buttonLabel: 'Book A Call',
    },
  ],
  footer: footerContent,
};
