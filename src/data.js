/**
 * Data Configuration for Scrolly-Stack
 * 
 * COLOR PALETTE: Soft pastels with cohesive flow
 * Inspired by frosted glass reference - muted but not washed out
 * Flow: Blue/Cyan → Lavender/Violet → Pink → Coral/Peach
 * NO greens!
 */

export const layers = [
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
      // CYAN (top-left) - cool blue
      {
        id: 0,
        gridPosition: [0, 0],
        label: 'Sales',
        color: '#67e8f9',           // Cyan 300 - distinct cyan
        gradientColorB: '#a5f3fc',  // Cyan 200
        activeColor: '#22d3ee',
        activeGradientColorB: '#67e8f9',
        textColor: '#155e75',
        slideDirection: [0, 0],
        tooltipTitle: 'Sales',
        tooltipSubhead: 'Win more jobs',
        bullets: ['Lead handling', 'Follow-up system', 'Conversion tracking'],
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
    depth: 6.5,
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
      // Soft fuchsia
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
      },
      // Soft pink
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
      },
      // Soft rose
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
      },
      // Soft coral
      {
        id: 10,
        label: 'RevOps',
        color: '#fca5a5',           // Red 300 (coral)
        gradientColorB: '#fecaca',  // Red 200
        activeColor: '#f87171',
        activeGradientColorB: '#fca5a5',
        textColor: '#7f1d1d',
        tooltipTitle: 'RevOps Controls',
        tooltipSubhead: 'System becomes behavior',
        bullets: ['Governance', 'Playbooks', 'Adoption tracking'],
      },
      // Soft peach
      {
        id: 11,
        label: 'Savings',
        color: '#fdba74',           // Orange 300
        gradientColorB: '#fed7aa',  // Orange 200
        activeColor: '#fb923c',
        activeGradientColorB: '#fdba74',
        textColor: '#7c2d12',
        tooltipTitle: 'Efficiency Savings',
        tooltipSubhead: 'Cut leaks',
        bullets: ['Reduce overhead', 'Smoother handoffs', 'Standardization'],
      },
      // Soft amber
      {
        id: 12,
        label: 'Services',
        color: '#fcd34d',           // Amber 300
        gradientColorB: '#fde68a',  // Amber 200
        activeColor: '#fbbf24',
        activeGradientColorB: '#fcd34d',
        textColor: '#78350f',
        tooltipTitle: 'Shared Services',
        tooltipSubhead: 'Dedicated bench',
        bullets: ['Build support', 'Maintenance', 'Keep stack running'],
      },
      // Back to soft pink (loop)
      {
        id: 13,
        label: 'Scale',
        color: '#f9a8d4',           // Pink 300
        gradientColorB: '#fbcfe8',  // Pink 200
        activeColor: '#f472b6',
        activeGradientColorB: '#f9a8d4',
        textColor: '#831843',
        tooltipTitle: 'Scale + Leverage',
        tooltipSubhead: 'Group power',
        bullets: ['8-12 businesses', 'Leverage economies', 'Unified growth'],
      },
      // Soft lavender (final)
      {
        id: 14,
        label: 'Exit',
        color: '#d8b4fe',           // Purple 300
        gradientColorB: '#e9d5ff',  // Purple 200
        activeColor: '#c084fc',
        activeGradientColorB: '#d8b4fe',
        textColor: '#581c87',
        tooltipTitle: 'Institutional Exit Options',
        tooltipSubhead: 'Premium exit positioning',
        bullets: ['Audit logs', 'Data room', 'Transferability'],
      },
    ],
  },
];

// =============================================================================
// DERIVED DATA
// =============================================================================

export const steps = layers.flatMap(layer => 
  layer.blocks.map(block => ({
    ...block,
    level: layer.level,
  }))
);

export function getStepById(id) {
  return steps.find(step => step.id === id);
}

export function getLayerByStepId(id) {
  return layers.find(layer => 
    layer.blocks.some(block => block.id === id)
  );
}
