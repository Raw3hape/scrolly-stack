/**
 * Home Page Source Of Truth — Foundation Projects
 *
 * Homepage copy currently has two rendering surfaces:
 * - `homeContent.sections`: server-rendered V2 sections below the scrolly hero
 * - `homeScrollyOverlayContent`: client-only hero/step overlay used by the scrolly experience
 *
 * Keep both surfaces in this file so homepage edits stay coordinated.
 */

import type { PageContent } from '../types';
import { ctaConfig } from '../nav';

export const heroContent = {
  eyebrow: 'Get A Big Exit From Your Roofing Company',
  headline: 'We\'re building a roofing company that goes public — and we want yours',
  headlineAccent: 'in it.',
  subheadline:
    'You did the hard work to grow your business. You shouldn\'t have to hand it to a broker or a PE firm to finally get the exit you deserve. With us, you won\'t have to.',
  ctaLabel: 'Book A Call',
  ctaHref: ctaConfig.href,
  ctaAriaLabel: 'Book a call to discuss your roofing business exit',
  statusText: 'Free 30-min call · NDA on day one',
} as const;

export const stepCta = {
  label: 'See if I qualify',
  arrowText: '→',
  ariaLabel: (stepTitle: string) => `Learn more about ${stepTitle}`,
} as const;

export const noscriptContent = {
  headline: `${heroContent.headline} ${heroContent.headlineAccent}`,
  description: heroContent.subheadline,
  ctaLabel: heroContent.ctaLabel,
  ctaHref: heroContent.ctaHref,
} as const;

export const homeValueProps = [
  'Get A Bigger Exit',
  'Stay In The Deal',
  'We Only Get Paid When You Do',
] as const;

export const problemStakesContent = {
  heading: 'Most Roofing Companies Sell For Less Than They’re Worth',
  problem:
    'You get 10 emails a week from people offering to buy your business. Brokers want 20% to list you. PE firms want to lock you in before you’re ready. And if you try to go it alone, you’re spending 12-18 months on due diligence, cleanup, and systems you should have built years ago.',
  solution:
    'Foundation Projects is assembling a platform of best-in-class roofing companies — not to flip them to private equity, but to take them public.',
  ctaLabel: ctaConfig.label,
  ctaHref: ctaConfig.href,
} as const;

export const homeHowItWorks = {
  heading: 'Here’s How It Works',
  steps: [
    {
      number: 1,
      title: 'Book A 30 Minute Call',
      description:
        'First, we figure out if we’re a good fit. We’ll look at your roofing business, talk through your goals, and if it makes sense for both sides, we sign an NDA, agree on a Letter of Intent, and set your entry valuation.',
      footnote: 'You don’t owe us anything at this stage. No money changes hands — just clarity.',
    },
    {
      number: 2,
      title: 'We Scale Your Business',
      description:
        'Once you’re in, we come in and help fix and build the things that make a company worth more — like better systems, cleaner operations, AI tools that save time, and training for your team.',
      footnote: 'You keep running your business. We just make it worth a lot more.',
    },
    {
      number: 3,
      title: 'Get A Big Exit',
      description:
        'The companies combine and we take it public. You keep the majority of what your company is worth. We take 20% of the value we helped create — nothing until then.',
      footnote: 'Other companies give you 3X and sell at 10X. We only get paid when you do.',
    },
  ],
} as const;

export const stakesContent = {
  body: 'You’ve spent years building your business. The window to get a return on that business is open.',
  accent: 'It won’t stay open forever.',
  detail:
    'The roofing industry is consolidating right now. The first platforms are already forming. Owners who get in early will lock in better valuations and a bigger share of what the platform is worth when it goes public. Owners who wait will be selling into a crowded market with fewer buyers and less leverage.',
} as const;

export const homeFinalCta = {
  heading: 'Your Big Exit Starts With A 30-Minute Call.',
  subheading: 'Book Your Call Today.',
  body:
    'We’ll learn about your business, share how the platform works, and tell you honestly whether we think it’s a good match.',
  ctaLabel: ctaConfig.label,
  ctaHref: ctaConfig.href,
} as const;

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
          title: homeValueProps[0],
          icon: 'chart-bar',
          kpiLabel: 'Your Advantage',
          kpiValue: 'Public-Market Multiples vs. PE Discount',
        },
        {
          number: '02.',
          title: homeValueProps[1],
          icon: 'shield',
          kpiLabel: 'Your Advantage',
          kpiValue: 'Ownership Continuity & Equity Retention',
        },
        {
          number: '03.',
          title: homeValueProps[2],
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
      heading: problemStakesContent.heading,
      subtext: problemStakesContent.problem,
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
      heading: 'Foundation Projects is assembling a platform of best-in-class roofing companies —',
      headingAccent: 'not to flip them to private equity, but to take them public.',
      steps: [
        {
          icon: 'shield',
          title: 'Aligned Partnership',
          text: 'We don’t buy your company to change your culture. We partner with you to build the systems, operations, and scale that make your business worth more.',
        },
        {
          icon: 'arrow-up',
          title: 'Public Market Path',
          text: 'By combining high-performing roofing companies into one platform, we unlock the valuations only available on the public exchange — and you keep the majority.',
        },
      ],
      quote: {
        text: '“Our Promise”',
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
      heading: homeHowItWorks.heading,
      steps: [
        {
          number: '01',
          title: homeHowItWorks.steps[0].title,
          text: homeHowItWorks.steps[0].description,
          footnote: homeHowItWorks.steps[0].footnote,
          icon: 'clock',
          ctaLabel: 'Book A Call',
        },
        {
          number: '02',
          title: homeHowItWorks.steps[1].title,
          text: homeHowItWorks.steps[1].description,
          footnote: homeHowItWorks.steps[1].footnote,
          icon: 'arrow-up',
        },
        {
          number: '03',
          title: homeHowItWorks.steps[2].title,
          text: homeHowItWorks.steps[2].description,
          footnote: homeHowItWorks.steps[2].footnote,
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
      heading: stakesContent.body,
      headingAccent: stakesContent.accent,
      text: stakesContent.detail,
      ctaLabel: 'Book A Call',
      image: '/images/urgency-building.png',
    },

    // ── S5: Final CTA ──
    {
      type: 'cta',
      id: 'final-cta',
      surface: 'base',
      heading: `${homeFinalCta.heading} ${homeFinalCta.subheading}`,
      microcopy: homeFinalCta.body,
      buttonLabel: homeFinalCta.ctaLabel,
    },
  ],
};

export const homeScrollyOverlayContent = {
  hero: heroContent,
  stepCta,
  noscript: noscriptContent,
} as const;

/**
 * Canonical homepage bundle for agents and future refactors.
 * Prefer importing from `home-page.ts`; `home.ts` remains a compatibility shim.
 */
export const homePageSourceOfTruth = {
  page: homeContent,
  overlay: homeScrollyOverlayContent,
} as const;
