/**
 * Data Configuration for Scrolly-Stack
 *
 * COLOR PALETTE: Soft pastels with cohesive flow
 * Inspired by frosted glass reference - muted but not washed out
 * Flow: Blue/Cyan → Lavender/Violet → Pink → Coral/Peach
 * NO greens!
 */

import type { LayerData, StepData } from './types';
import { icons } from './icons';

export const layers: LayerData[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // LEVEL A: TOP QUADRANTS - Cool blues with one warm accent (orange)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'layer-a',
    level: 'A',
    layout: 'grid',
    cols: 2,
    rows: 2,
    blocks: [
      // BLUE (top-left) - true blue, not cyan
      {
        id: 0,
        gridPosition: [0, 0],
        label: 'Sales',
        color: '#93c5fd',           // Blue 300 - true blue
        gradientColorB: '#bfdbfe',  // Blue 200
        activeColor: '#60a5fa',
        activeGradientColorB: '#93c5fd',
        textColor: '#1e3a5f',
        slideDirection: [0, 0],
        tooltipTitle: 'Sales',
        tooltipSubhead: 'Win more jobs',
        bullets: ['Lead handling', 'Follow-up system', 'Conversion tracking'],
        icon: icons.sales,
      },
      // ORANGE/PEACH (top-right) - warm accent
      {
        id: 1,
        gridPosition: [0, 1],
        label: 'Ops',
        color: '#fdba74',           // Orange 300
        gradientColorB: '#fed7aa',  // Orange 200
        activeColor: '#fb923c',
        activeGradientColorB: '#fdba74',
        textColor: '#7c2d12',
        slideDirection: [0, 0],
        tooltipTitle: 'Operations',
        tooltipSubhead: 'Run jobs clean',
        bullets: ['Schedule crews', 'Track production', 'Quality control'],
        icon: icons.ops,
      },
      // VIOLET (bottom-left) - purple-ish, distinct from cyan
      {
        id: 2,
        gridPosition: [1, 0],
        label: 'Finance',
        color: '#a78bfa',           // Violet 400 - more saturated
        gradientColorB: '#c4b5fd',  // Violet 300
        activeColor: '#8b5cf6',
        activeGradientColorB: '#a78bfa',
        textColor: '#4c1d95',
        slideDirection: [0, 0],
        tooltipTitle: 'Finance',
        tooltipSubhead: 'Know your numbers',
        bullets: ['Job costing', 'Cash visibility', 'Profit analysis'],
        icon: icons.finance,
      },
      // PINK (bottom-right) - warm pink, distinct from violet
      {
        id: 3,
        gridPosition: [1, 1],
        label: 'Exit',
        color: '#f9a8d4',           // Pink 300 - distinct pink
        gradientColorB: '#fbcfe8',  // Pink 200
        activeColor: '#f472b6',
        activeGradientColorB: '#f9a8d4',
        textColor: '#831843',
        slideDirection: [0, 0],
        tooltipTitle: 'Exit',
        tooltipSubhead: 'Exit on your terms',
        bullets: ['Clean financials', 'Diligence-ready', 'Valuation support'],
        icon: icons.exit,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // LEVEL B: MIDDLE STRIPS - Transition from blue to purple
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'layer-b',
    level: 'B',
    layout: 'row',
    cols: 3,
    depth: 5.5,  // Reduced to match stack dimensions
    align: 'center',
    blocks: [
      // Soft indigo (left)
      {
        id: 4,
        label: 'OS',
        color: '#a5b4fc',           // Indigo 300
        gradientColorB: '#c7d2fe',  // Indigo 200
        activeColor: '#818cf8',
        activeGradientColorB: '#a5b4fc',
        textColor: '#312e81',
        slideDirection: [0, 0],
        tooltipTitle: 'One Operating System',
        tooltipSubhead: 'Everything connects',
        bullets: ['Lead → Review flow', 'Unified data', 'Single source of truth'],
        icon: icons.system,
      },
      // Soft violet (center)
      {
        id: 5,
        label: 'Team',
        color: '#c4b5fd',           // Violet 300
        gradientColorB: '#ddd6fe',  // Violet 200
        activeColor: '#a78bfa',
        activeGradientColorB: '#c4b5fd',
        textColor: '#4c1d95',
        slideDirection: [0, 0],
        tooltipTitle: 'One Accountable Team',
        tooltipSubhead: 'Done-for-you execution',
        bullets: ['Not just advice', 'Implementation partner', 'Ongoing support'],
        icon: icons.team,
      },
      // Soft purple (right)
      {
        id: 6,
        label: 'Plan',
        color: '#d8b4fe',           // Purple 300
        gradientColorB: '#e9d5ff',  // Purple 200
        activeColor: '#c084fc',
        activeGradientColorB: '#d8b4fe',
        textColor: '#581c87',
        slideDirection: [0, 0],
        tooltipTitle: 'One Clear Plan',
        tooltipSubhead: 'Partner → Exit',
        bullets: ['Align', 'Transform', 'Scale'],
        icon: icons.plan,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // LEVEL C: BOTTOM TILES - Warm gradient: purple → pink → coral
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'layer-c',
    level: 'C',
    layout: 'full',
    blocks: [
      // Fuchsia/pink (balanced saturation)
      {
        id: 7,
        label: 'Lead OS',
        color: '#f0abfc',           // Fuchsia 300
        gradientColorB: '#f5d0fe',  // Fuchsia 200
        activeColor: '#e879f9',
        activeGradientColorB: '#f0abfc',
        textColor: '#701a75',
        tooltipTitle: 'Lead-to-Review OS',
        tooltipSubhead: 'End-to-end workflow',
        bullets: ['Demand', 'Sales', 'Production', 'Review'],
        icon: icons.flow,
      },
      // Pink (balanced saturation)
      {
        id: 8,
        label: 'CRM',
        color: '#f9a8d4',           // Pink 300
        gradientColorB: '#fbcfe8',  // Pink 200
        activeColor: '#f472b6',
        activeGradientColorB: '#f9a8d4',
        textColor: '#831843',
        tooltipTitle: 'CRM + Marketing Engine',
        tooltipSubhead: 'Trackable & repeatable',
        bullets: ['CRM installation', 'Pipeline management', 'Marketing auto'],
        icon: icons.contact,
      },
      // Rose (balanced saturation)
      {
        id: 9,
        label: 'Acct',
        color: '#fda4af',           // Rose 300
        gradientColorB: '#fecdd3',  // Rose 200
        activeColor: '#fb7185',
        activeGradientColorB: '#fda4af',
        textColor: '#881337',
        tooltipTitle: 'Unified Accounting',
        tooltipSubhead: 'Financial clarity',
        bullets: ['Job costing', 'Reporting', 'Operating system link'],
        icon: icons.ledger,
      },
      // Orange/peach (balanced saturation)
      {
        id: 10,
        label: 'RevOps',
        color: '#fdba74',           // Orange 300
        gradientColorB: '#fed7aa',  // Orange 200
        activeColor: '#fb923c',
        activeGradientColorB: '#fdba74',
        textColor: '#7c2d12',
        tooltipTitle: 'RevOps Controls',
        tooltipSubhead: 'System becomes behavior',
        bullets: ['Governance', 'Playbooks', 'Adoption tracking'],
        icon: icons.control,
      },
      // Amber (balanced saturation)
      {
        id: 11,
        label: 'Savings',
        color: '#fcd34d',           // Amber 300
        gradientColorB: '#fde68a',  // Amber 200
        activeColor: '#fbbf24',
        activeGradientColorB: '#fcd34d',
        textColor: '#78350f',
        tooltipTitle: 'Efficiency Savings',
        tooltipSubhead: 'Cut leaks',
        bullets: ['Reduce overhead', 'Smoother handoffs', 'Standardization'],
        icon: icons.savings,
      },
      // Rose/pink (balanced, no green)
      {
        id: 12,
        label: 'Services',
        color: '#fda4af',           // Rose 300
        gradientColorB: '#fecdd3',  // Rose 200
        activeColor: '#fb7185',
        activeGradientColorB: '#fda4af',
        textColor: '#881337',
        tooltipTitle: 'Shared Services',
        tooltipSubhead: 'Dedicated bench',
        bullets: ['Build support', 'Maintenance', 'Keep stack running'],
        icon: icons.services,
      },
      // Purple/violet (balanced)
      {
        id: 13,
        label: 'Scale',
        color: '#d8b4fe',           // Purple 300
        gradientColorB: '#e9d5ff',  // Purple 200
        activeColor: '#c084fc',
        activeGradientColorB: '#d8b4fe',
        textColor: '#581c87',
        tooltipTitle: 'Scale + Leverage',
        tooltipSubhead: 'Group power',
        bullets: ['8-12 businesses', 'Leverage economies', 'Unified growth'],
        icon: icons.growth,
      },
      // Deep violet (back to cool, completing the arc)
      {
        id: 14,
        label: 'Exit',
        color: '#c4b5fd',           // Violet 300 - soft lavender
        gradientColorB: '#ddd6fe',  // Violet 200
        activeColor: '#a78bfa',
        activeGradientColorB: '#c4b5fd',
        textColor: '#4c1d95',
        tooltipTitle: 'Institutional Exit Options',
        tooltipSubhead: 'Premium exit positioning',
        bullets: ['Audit logs', 'Data room', 'Transferability'],
        icon: icons.exitReady,
      },
    ],
  },
];

// =============================================================================
// DERIVED DATA
// =============================================================================

export const steps: StepData[] = layers.flatMap(layer =>
  layer.blocks.map(block => ({
    ...block,
    level: layer.level,
  }))
);

export function getStepById(id: number): StepData | undefined {
  return steps.find(step => step.id === id);
}

export function getLayerByStepId(id: number): LayerData | undefined {
  return layers.find(layer =>
    layer.blocks.some(block => block.id === id)
  );
}
