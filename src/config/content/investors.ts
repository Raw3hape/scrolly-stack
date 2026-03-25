/**
 * Investors Page Content — Foundation Projects
 */

import type { PageContent } from '../types';
import { footerContent } from './shared';
import { routes } from '../nav';

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
        href: routes.schedule,
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
      secondaryHref: routes.howItWorksRoofers,
    },
  ],
  footer: footerContent,
};
