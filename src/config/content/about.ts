/**
 * About Page Content — Foundation Projects
 *
 * Hero, expanded problem, comparison, team section, proof, and closing CTA.
 *
 * Source of truth: CONTENT.md § PAGE 2: ABOUT + full client brief
 */

import { ctaConfig } from '../nav';

// =============================================================================
// HERO
// =============================================================================

export const aboutHero = {
  heading: 'We\'re A Team Of Roofing Industry Professionals On A Mission To Get Owners Like You A Big Exit.',
  body: 'We\'ve spent years inside this industry. We know what your company is worth. And we built Foundation Projects because we got tired of watching good roofing owners like you get taken advantage of by brokers and private equity firms.',
} as const;

// =============================================================================
// EXPANDED PROBLEM
// =============================================================================

export const expandedProblem = {
  heading: 'Too Many Roofing Company Owners Get Taken Advantage Of When They Exit.',
  body: 'You\'d spend 10, 15, 20 years building a roofing business with strong revenue, loyal crews, and happy customers — and then a PE firm shows up and offers you 3×. Take it or leave it. Most owners take it. Then watch the buyer flip it for 10× a few years later.',
  punchline: 'That\'s not a bad deal. That\'s a bad system.',
} as const;

// =============================================================================
// COMPARISON: BROKEN SYSTEM vs BETTER WAY
// =============================================================================

export const comparison = {
  left: {
    title: 'The Broken System',
    body: 'PE firms offer you 3×, lock you in, and flip your company for 10× a few years later. That\'s a bad system.',
  },
  right: {
    title: 'The Better Way',
    body: 'Foundation Projects is a platform that brings the best roofing companies together and takes them public. Instead of selling to a buyer who captures all the upside, you stay in the deal — and get paid when the platform goes public at 7–10×.',
  },
} as const;

// =============================================================================
// TEAM
// =============================================================================

export const teamSection = {
  heading: 'Our Team Doesn\'t Get Paid Until You Do.',
  subheading: 'Meet our team of roofing industry professionals who care about your business (almost) as much as you do.',
  accentStat: '$1B+ in roofing revenue experience',
  members: [
    {
      name: 'James Mitchell',
      role: 'CEO & Co-Founder',
      bio: '20+ years in roofing operations. Scaled two companies to $50M+.',
      photo: '/team/placeholder-1.jpg',
    },
    {
      name: 'Sarah Chen',
      role: 'COO',
      bio: 'Former PE operator. Managed $200M roofing portfolio integration.',
      photo: '/team/placeholder-2.jpg',
    },
    {
      name: 'Marcus Williams',
      role: 'VP, Acquisitions',
      bio: '15 years in M&A. Closed 40+ roofing company acquisitions.',
      photo: '/team/placeholder-3.jpg',
    },
    {
      name: 'Laura Rodriguez',
      role: 'VP, Operations',
      bio: 'Built operating systems for 3 roofing roll-ups. CRM & RevOps expert.',
      photo: '/team/placeholder-4.jpg',
    },
    {
      name: 'David Park',
      role: 'CFO',
      bio: 'Former Big 4. Took two home services companies through IPO.',
      photo: '/team/placeholder-5.jpg',
    },
    {
      name: 'Rachel Foster',
      role: 'VP, Growth',
      bio: 'Grew a regional roofing company from $5M to $35M in 4 years.',
      photo: '/team/placeholder-6.jpg',
    },
  ],
} as const;

// =============================================================================
// PROOF SECTION
// =============================================================================

export const proofSection = {
  heading: 'Now, Owners Like You Get A Better Roofing Company AND The Exit They Deserve.',
  body: 'The first owners who joined the platform didn\'t just get a better exit. Their businesses got better, too — meaning they were worth more.',
  detail: 'We helped them tighten their operations, grow revenue, and found the owners who had been fielding lowball offers were suddenly sitting on a roofing company that was inherently worth a lot more.',
} as const;

// =============================================================================
// CLOSING CTA
// =============================================================================

export const aboutClosingCta = {
  heading: 'We\'re Building the Platform That Takes Roofing Public.',
  body: 'Foundation Projects is actively assembling a group of best-in-class roofing companies with one destination in mind. The window is open. And the owners who get in now will be the ones who look back and say they got in at the right time.',
  ctaLabel: ctaConfig.label,
  ctaHref: ctaConfig.href,
} as const;
