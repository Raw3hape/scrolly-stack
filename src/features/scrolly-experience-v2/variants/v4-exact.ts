/**
 * V4 Exact Variant — Precise JSON match from Adam's spv-stack-v2.json
 *
 * 19 blocks in 14 layers, bottom-to-top:
 *   Layer 1–3   [single]   Partnership · People · Data
 *   Layer 4     [row ×3]   Systems · Playbooks · Training  (triple stack)
 *   Layer 5–13  [single]   Sales · Production · Marketing · Automation ·
 *                          Finance · Intelligence · AI Agents · Procurement · ESO
 *   Layer 14    [grid 2×2] Exit Plan · Robotics · Growth · IPO  (crown)
 *
 * scrollDirection: 'up' — user starts at Partnership (bottom), scrolls to IPO (top).
 */

import type { LayerData } from '../types';
import type { StackVariant } from './types';
import { icons } from '../icons';
import { palette } from '@/config/palette';

const layers: LayerData[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // LAYER 1: PARTNERSHIP — foundation (position 1, bottom)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'exact-01',
    level: 'C',
    layout: 'full',
    blocks: [
      {
        id: 0,
        slug: 'partnership',
        label: 'Partnership',
        color: palette.anchor200,
        gradientColorB: palette.anchor300,
        activeColor: palette.teal500,
        activeGradientColorB: palette.anchor200,
        textColor: palette.sand100,
        tooltipTitle: 'Partnership Alignment',
        tooltipSubhead: 'Roofer-Centric from the Start',
        bullets: [],
        description: 'We partner with owners who want an aligned operator, durable wealth building, and a roofer-led public path.',
        icon: icons.partnership,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // LAYER 2: PEOPLE (position 2)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'exact-02',
    level: 'C',
    layout: 'full',
    blocks: [
      {
        id: 1,
        slug: 'people',
        label: 'People',
        color: palette.anchor300,
        gradientColorB: palette.anchor200,
        activeColor: palette.anchor500,
        activeGradientColorB: palette.anchor300,
        textColor: palette.sand100,
        tooltipTitle: 'People & Culture',
        tooltipSubhead: 'Culture Beats Talent',
        bullets: [],
        description: 'Map your culture scientifically, reinforce what works, and build a succession bench without blowing up your crew.',
        icon: icons.people,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // LAYER 3: DATA (position 3)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'exact-03',
    level: 'C',
    layout: 'full',
    blocks: [
      {
        id: 2,
        slug: 'data',
        label: 'Data',
        color: palette.teal500,
        gradientColorB: palette.teal300,
        activeColor: palette.teal700,
        activeGradientColorB: palette.teal500,
        textColor: palette.sand100,
        tooltipTitle: 'Unified Data Model',
        tooltipSubhead: 'One Language to Rule',
        bullets: [],
        description: 'Cleansing old data and creating a unified standard for leads, margin, and lifecycle stages so every scoreboard reads the same across the platform.',
        icon: icons.data,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // LAYER 4: TRIPLE STACK — Systems · Playbooks · Training (position 4)
  // "The logic of the triple stack is they all go at the same time"
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'exact-04-triple',
    level: 'B',
    layout: 'row',
    cols: 3,
    depth: 5.5,
    align: 'center',
    blocks: [
      {
        id: 3,
        slug: 'systems',
        label: 'Systems',
        color: palette.teal700,
        gradientColorB: palette.teal500,
        activeColor: palette.tealDark,
        activeGradientColorB: palette.teal700,
        textColor: palette.sand100,
        slideDirection: [0, 0],
        tooltipTitle: 'Systems Implementation',
        tooltipSubhead: 'Lead-to-Review Operating System',
        bullets: [],
        description: 'Wire the CRM, job management, and accounting into one operating backbone so work completes and records itself once. A single source of truth to operate from with a modern home owner experience!',
        icon: icons.system,
      },
      {
        id: 4,
        slug: 'playbooks',
        label: 'Playbooks',
        color: palette.teal500,
        gradientColorB: palette.teal300,
        activeColor: palette.teal700,
        activeGradientColorB: palette.teal500,
        textColor: palette.sand100,
        slideDirection: [0, 0],
        tooltipTitle: 'Process Playbooks',
        tooltipSubhead: 'Proven Frameworks',
        bullets: [],
        description: 'Proven operating frameworks, SOPs, and accountability cadences distilled from 500+ roofing engagements, ready to deploy.',
        icon: icons.playbooks,
      },
      {
        id: 5,
        slug: 'training',
        label: 'Training',
        color: palette.teal500,
        gradientColorB: palette.teal300,
        activeColor: palette.teal700,
        activeGradientColorB: palette.teal500,
        textColor: palette.sand100,
        slideDirection: [0, 0],
        tooltipTitle: 'Training Engine',
        tooltipSubhead: 'Adoption That Sticks',
        bullets: [],
        description: 'Role-based training, certification tracks, and coaching loops so every crew works to the same standard. A battle tested team with years of experience to support you.',
        icon: icons.training,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // LAYERS 5–13: SINGLES — operational blocks (positions 5–13)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'exact-05',
    level: 'C',
    layout: 'full',
    blocks: [
      {
        id: 6,
        slug: 'sales-v4',
        label: 'Sales',
        color: palette.anchor500,
        gradientColorB: palette.anchor300,
        activeColor: palette.anchor700,
        activeGradientColorB: palette.anchor500,
        textColor: palette.sand100,
        tooltipTitle: 'Pod Sales',
        tooltipSubhead: 'Close More Roofs',
        bullets: [],
        description: 'Build hunter-closer pods with SLAs, objection scripts, and pipeline reviews that turn leads into booked revenue.',
        icon: icons.sales,
      },
    ],
  },
  {
    id: 'exact-06',
    level: 'C',
    layout: 'full',
    blocks: [
      {
        id: 7,
        slug: 'production',
        label: 'Production',
        color: palette.anchor700,
        gradientColorB: palette.anchor500,
        activeColor: palette.anchor900,
        activeGradientColorB: palette.anchor700,
        textColor: palette.sand100,
        tooltipTitle: 'Production Frameworks',
        tooltipSubhead: 'Flawless Installs drive Customer Acquisition',
        bullets: [],
        description: 'Site supervisors, referral scripts, crew pay plans, and coordination hubs that deliver clean installs and spark new connections.',
        icon: icons.production,
      },
    ],
  },
  {
    id: 'exact-07',
    level: 'C',
    layout: 'full',
    blocks: [
      {
        id: 8,
        slug: 'marketing',
        label: 'Marketing',
        color: palette.anchor900,
        gradientColorB: palette.anchor700,
        activeColor: palette.anchorDeep,
        activeGradientColorB: palette.anchor900,
        textColor: palette.sand100,
        tooltipTitle: 'Marketing Accountability',
        tooltipSubhead: 'Fuel Demand',
        bullets: [],
        description: "See every dollar's impact, police agency performance, and scale reviews, referrals, and media as one demand engine.",
        icon: icons.marketing,
      },
    ],
  },
  {
    id: 'exact-08',
    level: 'C',
    layout: 'full',
    blocks: [
      {
        id: 9,
        slug: 'automation',
        label: 'Automation',
        color: palette.teal700,
        gradientColorB: palette.teal500,
        activeColor: palette.tealDark,
        activeGradientColorB: palette.teal700,
        textColor: palette.sand100,
        tooltipTitle: 'Workflow Automation',
        tooltipSubhead: 'Zero Toggle Tax',
        bullets: [],
        description: 'Kill duplicate entry, rogue spreadsheets, and "do the thing, then tell the system you did the thing" busywork.',
        icon: icons.automation,
      },
    ],
  },
  {
    id: 'exact-09',
    level: 'C',
    layout: 'full',
    blocks: [
      {
        id: 10,
        slug: 'finance-v4',
        label: 'Finance',
        color: palette.teal500,
        gradientColorB: palette.teal300,
        activeColor: palette.teal700,
        activeGradientColorB: palette.teal500,
        textColor: palette.sand100,
        tooltipTitle: 'Finance Ops',
        tooltipSubhead: 'Never Outgrow Quality or Cashflow',
        bullets: [],
        description: 'Enterprise-grade controllers, tax strategy, and reporting teams professionalize your books and hand you real-time cash clarity. We bring you a team of professionals.',
        icon: icons.finance,
      },
    ],
  },
  {
    id: 'exact-10',
    level: 'C',
    layout: 'full',
    blocks: [
      {
        id: 11,
        slug: 'intelligence',
        label: 'Intelligence',
        color: palette.green500,
        gradientColorB: palette.green300,
        activeColor: palette.green700,
        activeGradientColorB: palette.green500,
        textColor: palette.sand100,
        tooltipTitle: 'Data Intelligence',
        tooltipSubhead: 'Better Data, Better Decisions',
        bullets: [],
        description: 'Executive-grade dashboards surface opportunities, unlock shareholder value, and show exactly where to push next. Move from hindsight, to insight, to foresight.',
        icon: icons.intelligence,
      },
    ],
  },
  {
    id: 'exact-11',
    level: 'C',
    layout: 'full',
    blocks: [
      {
        id: 12,
        slug: 'ai-agents',
        label: 'AI Agents',
        color: palette.green500,
        gradientColorB: palette.green300,
        activeColor: palette.green700,
        activeGradientColorB: palette.green500,
        textColor: palette.sand100,
        tooltipTitle: 'Agentic Workforce',
        tooltipSubhead: 'Hybrid Human Centric Leverage',
        bullets: [],
        description: 'AI copilots clear the grunt work—permitting, clicks, reconciliations—so humans stay human and 10× their impact, and growth goals while keeping culture intact.',
        icon: icons.aiAgents,
      },
    ],
  },
  {
    id: 'exact-12',
    level: 'C',
    layout: 'full',
    blocks: [
      {
        id: 13,
        slug: 'procurement',
        label: 'Procurement',
        color: palette.gold700,
        gradientColorB: palette.gold500,
        activeColor: palette.goldDark,
        activeGradientColorB: palette.gold700,
        textColor: palette.anchor900,
        tooltipTitle: 'Procurement Leverage',
        tooltipSubhead: 'National Buying Power',
        bullets: [],
        description: 'Materials, storm response, health plans, payment processing, and shared specialists negotiated once so every partner wins.',
        icon: icons.procurement,
      },
    ],
  },
  {
    id: 'exact-13',
    level: 'C',
    layout: 'full',
    blocks: [
      {
        id: 14,
        slug: 'eso',
        label: 'ESO',
        color: palette.gold500,
        gradientColorB: palette.gold300,
        activeColor: palette.gold700,
        activeGradientColorB: palette.gold500,
        textColor: palette.anchor900,
        tooltipTitle: 'Employee Stock Ownership',
        tooltipSubhead: 'Legacy Protected Growth Insurance',
        bullets: [],
        description: 'We Give your second-row leaders true upside so you can announce the exit proudly and keep the team motivated for decades. Long term Life changing outcomes drive competitive performance and legacy.',
        icon: icons.eso,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // LAYER 14: CROWN — 4 tiles at the top (position 14)
  // "The crown are all the final steps — IPO is the final step"
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'exact-14-crown',
    level: 'A',
    layout: 'grid',
    cols: 2,
    rows: 2,
    blocks: [
      {
        id: 18,
        slug: 'ipo',
        gridPosition: [1, 1],
        label: 'IPO',
        color: palette.teal300,
        gradientColorB: palette.teal100,
        activeColor: palette.teal500,
        activeGradientColorB: palette.teal300,
        textColor: palette.sand100,
        slideDirection: [0, 0],
        tooltipTitle: 'IPO',
        tooltipSubhead: 'Ring The Bell',
        bullets: [],
        description: 'The first roofer-built public company—owners keep 80%, confetti flies, and a brand-new asset class is born.',
        icon: icons.ipo,
      },
      {
        id: 17,
        slug: 'growth-v4',
        gridPosition: [1, 0],
        label: 'Growth',
        color: palette.green500,
        gradientColorB: palette.green300,
        activeColor: palette.green700,
        activeGradientColorB: palette.green500,
        textColor: palette.sand100,
        slideDirection: [0, 0],
        tooltipTitle: 'Growth by Design',
        tooltipSubhead: 'Scale With Purpose',
        bullets: [],
        description: 'Expansion roadmaps, greenfield launches, and knowledge transfer that unlock shareholder value and attract fresh capital.',
        icon: icons.growth,
      },
      {
        id: 16,
        slug: 'robotics',
        gridPosition: [0, 1],
        label: 'Robotics',
        color: palette.anchor900,
        gradientColorB: palette.anchor700,
        activeColor: palette.anchorDeep,
        activeGradientColorB: palette.anchor900,
        textColor: palette.sand100,
        slideDirection: [0, 0],
        tooltipTitle: 'Robotics Integration',
        tooltipSubhead: 'Human + Machine Future',
        bullets: [],
        description: "We're the beta lab for VC-backed roof robotics—roofers share the upside, robots learn our playbooks, everyone wins. We will be first to market with an equitable plan to build the spatial model for robotic team mates.",
        icon: icons.robotics,
      },
      {
        id: 15,
        slug: 'exit-planning',
        gridPosition: [0, 0],
        label: 'Exit Plan',
        color: palette.gold500,
        gradientColorB: palette.gold300,
        activeColor: palette.gold700,
        activeGradientColorB: palette.gold500,
        textColor: palette.anchor900,
        slideDirection: [0, 0],
        tooltipTitle: 'Exit Planning',
        tooltipSubhead: 'IPO Committee',
        bullets: [],
        description: 'Bankers, auditors, filings, plus founder life-design—sell, stay, or reinvent with a plan so post-exit shock and regret never hits.',
        icon: icons.exitReady,
      },
    ],
  },
];

export const exactVariant: StackVariant = {
  id: 'v4-exact',
  name: 'Exact',
  description: 'JSON-spec stack. Scroll ↑ from Partnership (bottom) to IPO crown (top).',
  layers,
  scrollDirection: 'up',
  geometryOverrides: {
    layerHeight: 0.38,
    gapVertical: 0.30,
  },
  mosaicOverrides: {
    cols: 5,
    finalZoom: 72,               // Fills viewport with header clearance
    spanBlocks: { 18: 2 },  // IPO spans 2 columns in mosaic
  },
};
