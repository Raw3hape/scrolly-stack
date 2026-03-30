/**
 * V2 Journey Variant — Adam's 19-block stack (Partnership → IPO)
 *
 * Narrative: bottom = Partnership (foundation), top = IPO (destination).
 * Scroll direction: user scrolls down the page, but traverses bottom → top of stack.
 *
 * 19 blocks arranged in 12 rows:
 *   Row 1  [grid 2×2]  Partnership · People · Data · Systems
 *   Row 2  [row ×3]    Playbooks · Training · Sales
 *   Row 3  [single]    Production
 *   Row 4  [single]    Marketing
 *   Row 5  [single]    Automation
 *   Row 6  [single]    Finance
 *   Row 7  [single]    Intelligence
 *   Row 8  [single]    AI Agents
 *   Row 9  [row ×3]    Procurement · ESO · Exit Planning
 *   Row 10 [single]    Robotics
 *   Row 11 [single]    Growth
 *   Row 12 [single]    IPO
 *
 * Colors: gradient from Anchor (foundation) → Systems (process) → Growth (results) → Value (craft)
 */

import type { LayerData } from '../types';
import type { StackVariant } from './types';
import { icons } from '../icons';
import { palette } from '@/config/palette';

const layers: LayerData[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // ROW 1: FOUNDATION QUADRANTS — grid 2×2
  // Partnership · People · Data · Systems
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'journey-r1',
    level: 'A',
    layout: 'grid',
    cols: 2,
    rows: 2,
    blocks: [
      // Anchor dark (top-left) — trust, authority
      {
        id: 0,
        slug: 'partnership',
        gridPosition: [0, 0],
        label: 'Partnership',
        color: palette.anchor300,
        gradientColorB: palette.anchor200,
        activeColor: palette.teal500,
        activeGradientColorB: palette.anchor300,
        textColor: palette.sand100,
        slideDirection: [0, 0],
        tooltipTitle: 'Partnership Alignment',
        tooltipSubhead: 'Roofer-Centric from the Start',
        bullets: [],
        description: 'We partner with owners who want an aligned operator, durable wealth building, and a roofer-led public path.',
        icon: icons.partnership,
      },
      // Value / Gold (top-right) — warmth, craft
      {
        id: 1,
        slug: 'people',
        gridPosition: [0, 1],
        label: 'People',
        color: palette.gold500,
        gradientColorB: palette.gold300,
        activeColor: palette.gold700,
        activeGradientColorB: palette.gold500,
        textColor: palette.anchor900,
        slideDirection: [0, 0],
        tooltipTitle: 'People & Culture',
        tooltipSubhead: 'Culture Beats Talent',
        bullets: [],
        description: 'Map your culture scientifically, reinforce what works, and build a succession bench without blowing up your crew.',
        icon: icons.people,
      },
      // Systems teal (bottom-left) — process, precision
      {
        id: 2,
        slug: 'data',
        gridPosition: [1, 0],
        label: 'Data',
        color: palette.teal500,
        gradientColorB: palette.teal300,
        activeColor: palette.teal700,
        activeGradientColorB: palette.teal500,
        textColor: palette.sand100,
        slideDirection: [0, 0],
        tooltipTitle: 'Unified Data Model',
        tooltipSubhead: 'One Language to Rule',
        bullets: [],
        description: 'Cleansing old data and creating a unified standard for leads, margin, and lifecycle stages so every scoreboard reads the same across the platform.',
        icon: icons.data,
      },
      // Growth green (bottom-right) — results, yield
      {
        id: 3,
        slug: 'systems',
        gridPosition: [1, 1],
        label: 'Systems',
        color: palette.green500,
        gradientColorB: palette.green300,
        activeColor: palette.green700,
        activeGradientColorB: palette.green500,
        textColor: palette.sand100,
        slideDirection: [0, 0],
        tooltipTitle: 'Systems Implementation',
        tooltipSubhead: 'Lead-to-Review Operating System',
        bullets: [],
        description: 'Wire the CRM, job management, and accounting into one operating backbone so work completes and records itself once.',
        icon: icons.system,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // ROW 2: PROCESS STRIP — row ×3
  // Playbooks · Training · Sales
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'journey-r2',
    level: 'B',
    layout: 'row',
    cols: 3,
    depth: 5.5,
    align: 'center',
    blocks: [
      {
        id: 4,
        slug: 'playbooks',
        label: 'Playbooks',
        color: palette.teal700,
        gradientColorB: palette.teal500,
        activeColor: palette.tealDark,
        activeGradientColorB: palette.teal700,
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
        description: 'Role-based training, certification tracks, and coaching loops so every crew works to the same standard.',
        icon: icons.training,
      },
      {
        id: 6,
        slug: 'sales-v2',
        label: 'Sales',
        color: palette.teal300,
        gradientColorB: palette.tealExLight,
        activeColor: palette.teal500,
        activeGradientColorB: palette.teal300,
        textColor: palette.anchor900,
        slideDirection: [0, 0],
        tooltipTitle: 'Pod Sales',
        tooltipSubhead: 'Close More Roofs',
        bullets: [],
        description: 'Build hunter-closer pods with SLAs, objection scripts, and pipeline reviews that turn leads into booked revenue.',
        icon: icons.sales,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // ROWS 3–8: OPERATIONAL SINGLES — full width tiles
  // Production · Marketing · Automation · Finance · Intelligence · AI Agents
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'journey-r3',
    level: 'C',
    layout: 'full',
    blocks: [
      {
        id: 7,
        slug: 'production',
        label: 'Production',
        color: palette.anchor900,
        gradientColorB: palette.anchor700,
        activeColor: palette.anchorDeep,
        activeGradientColorB: palette.anchor900,
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
    id: 'journey-r4',
    level: 'C',
    layout: 'full',
    blocks: [
      {
        id: 8,
        slug: 'marketing',
        label: 'Marketing',
        color: palette.anchor700,
        gradientColorB: palette.anchor500,
        activeColor: palette.anchor900,
        activeGradientColorB: palette.anchor700,
        textColor: palette.sand100,
        tooltipTitle: 'Marketing Accountability',
        tooltipSubhead: 'Fuel Demand',
        bullets: [],
        description: 'See every dollar\'s impact, police agency performance, and scale reviews, referrals, and media as one demand engine.',
        icon: icons.marketing,
      },
    ],
  },
  {
    id: 'journey-r5',
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
    id: 'journey-r6',
    level: 'C',
    layout: 'full',
    blocks: [
      {
        id: 10,
        slug: 'finance-v2',
        label: 'Finance',
        color: palette.green700,
        gradientColorB: palette.green500,
        activeColor: palette.greenDark,
        activeGradientColorB: palette.green700,
        textColor: palette.sand100,
        tooltipTitle: 'Finance Ops',
        tooltipSubhead: 'Never Outgrow Quality or Cashflow',
        bullets: [],
        description: 'Enterprise-grade controllers, tax strategy, and reporting teams professionalize your books and hand you real-time cash clarity.',
        icon: icons.finance,
      },
    ],
  },
  {
    id: 'journey-r7',
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
        description: 'Executive-grade dashboards surface opportunities, unlock shareholder value, and show exactly where to push next.',
        icon: icons.intelligence,
      },
    ],
  },
  {
    id: 'journey-r8',
    level: 'C',
    layout: 'full',
    blocks: [
      {
        id: 12,
        slug: 'ai-agents',
        label: 'AI Agents',
        color: palette.teal500,
        gradientColorB: palette.teal300,
        activeColor: palette.teal700,
        activeGradientColorB: palette.teal500,
        textColor: palette.sand100,
        tooltipTitle: 'Agentic Workforce',
        tooltipSubhead: 'Hybrid Human Centric Leverage',
        bullets: [],
        description: 'AI copilots clear the grunt work—permitting, clicks, reconciliations—so humans stay human and 10× their impact.',
        icon: icons.aiAgents,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // ROW 9: SCALE STRIP — row ×3
  // Procurement · ESO · Exit Planning
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'journey-r9',
    level: 'C',
    layout: 'row',
    cols: 3,
    depth: 5.5,
    align: 'center',
    blocks: [
      {
        id: 13,
        slug: 'procurement',
        label: 'Procure',
        color: palette.gold700,
        gradientColorB: palette.gold500,
        activeColor: palette.goldDark,
        activeGradientColorB: palette.gold700,
        textColor: palette.anchor900,
        slideDirection: [0, 0],
        tooltipTitle: 'Procurement Leverage',
        tooltipSubhead: 'National Buying Power',
        bullets: [],
        description: 'Materials, storm response, health plans, payment processing, and shared specialists negotiated once so every partner wins.',
        icon: icons.procurement,
      },
      {
        id: 14,
        slug: 'eso',
        label: 'ESO',
        color: palette.gold500,
        gradientColorB: palette.gold300,
        activeColor: palette.gold700,
        activeGradientColorB: palette.gold500,
        textColor: palette.anchor900,
        slideDirection: [0, 0],
        tooltipTitle: 'Employee Stock Ownership',
        tooltipSubhead: 'Legacy Protected Growth Insurance',
        bullets: [],
        description: 'Give your second-row leaders true upside so you can announce the exit proudly and keep the team motivated for decades.',
        icon: icons.eso,
      },
      {
        id: 15,
        slug: 'exit-planning',
        label: 'Exit Plan',
        color: palette.gold300,
        gradientColorB: palette.gold500,
        activeColor: palette.gold700,
        activeGradientColorB: palette.gold300,
        textColor: palette.anchor900,
        slideDirection: [0, 0],
        tooltipTitle: 'Exit Planning',
        tooltipSubhead: 'IPO Committee',
        bullets: [],
        description: 'Bankers, auditors, filings, plus founder life-design—sell, stay, or reinvent with a plan so post-exit shock never hits.',
        icon: icons.exitReady,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // ROWS 10–12: DESTINATION SINGLES — culmination
  // Robotics · Growth · IPO
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'journey-r10',
    level: 'C',
    layout: 'full',
    blocks: [
      {
        id: 16,
        slug: 'robotics',
        label: 'Robotics',
        color: palette.green700,
        gradientColorB: palette.green500,
        activeColor: palette.greenDark,
        activeGradientColorB: palette.green700,
        textColor: palette.sand100,
        tooltipTitle: 'Robotics Integration',
        tooltipSubhead: 'Human + Machine Future',
        bullets: [],
        description: 'We\'re the beta lab for VC-backed roof robotics—roofers share the upside, robots learn our playbooks, everyone wins.',
        icon: icons.robotics,
      },
    ],
  },
  {
    id: 'journey-r11',
    level: 'C',
    layout: 'full',
    blocks: [
      {
        id: 17,
        slug: 'growth-v2',
        label: 'Growth',
        color: palette.green500,
        gradientColorB: palette.green300,
        activeColor: palette.green700,
        activeGradientColorB: palette.green500,
        textColor: palette.sand100,
        tooltipTitle: 'Growth by Design',
        tooltipSubhead: 'Scale With Purpose',
        bullets: [],
        description: 'Expansion roadmaps, greenfield launches, and knowledge transfer that unlock shareholder value and attract fresh capital.',
        icon: icons.growth,
      },
    ],
  },
  {
    id: 'journey-r12',
    level: 'C',
    layout: 'full',
    blocks: [
      {
        id: 18,
        slug: 'ipo',
        label: 'IPO',
        color: palette.gold700,
        gradientColorB: palette.gold500,
        activeColor: palette.goldDark,
        activeGradientColorB: palette.gold700,
        textColor: palette.anchor900,
        tooltipTitle: 'IPO',
        tooltipSubhead: 'Ring The Bell',
        bullets: [],
        description: 'The first roofer-built public company—owners keep 80%, confetti flies, and a brand-new asset class is born.',
        icon: icons.ipo,
      },
    ],
  },
];

export const journeyVariant: StackVariant = {
  id: 'v2-journey',
  name: 'Journey',
  description: 'Partnership → IPO: 19 blocks tracing the path from foundation to public listing.',
  layers,
  geometryOverrides: {
    layerHeight: 0.38,
    gapVertical: 0.30,
  },
  mosaicOverrides: {
    cols: 5,
    finalZoom: 65,
    spanBlocks: { 18: 2 },  // IPO spans 2 columns → fills last row gap
  },
};
