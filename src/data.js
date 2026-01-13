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
        icon: 'M3 3v18h18V3H3zm16 16H5V5h14v14zM7 7h4v4H7V7zm0 6h10v2H7v-2zm6-6h4v2h-4V7zm0 3h4v2h-4v-2z', // Chart/Dashboard
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
        icon: 'M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.44.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.48-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z', // Gear/Settings
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
        icon: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z', // Dollar sign
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
        icon: 'M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z', // Exit door
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
        icon: 'M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z', // Devices/System
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
        icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z', // People/Team
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
        icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z', // Chart/Plan
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
        icon: 'M22 12l-4-4v3H3v2h15v3l4-4z', // Arrow flow
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
        icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z', // Person/Contact
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
        icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z', // Document/Ledger
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
        icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z', // Checkmark/Control
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
        icon: 'M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z', // Tag/Savings
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
        icon: 'M22 9V7h-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2h-2V9h2zm-4 10H4V5h14v14zM6 13h5v4H6zm6-6h4v3h-4zm0 4h4v6h-4zM6 7h5v5H6z', // Grid/Services
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
        icon: 'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z', // Growth chart
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
        icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z', // Question/Exit ready
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
