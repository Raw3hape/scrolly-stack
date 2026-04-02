/**
 * V2Icon — simple SVG icon component for V2 sections.
 *
 * Replaces emoji placeholders with clean SVG icons.
 * Icons are based on Stitch "Architectural Editorial" design language.
 */

import type { V2Icon as V2IconName } from '@/config/types';

interface Props {
  name: V2IconName;
  size?: number;
}

/* Pod Sales uses multiple paths for the compound icon */
const POD_SALES_PATHS = [
  'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20', // outer circle
  'M12 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5', // center person head
  'M8.5 19c0-2.2 1.6-4 3.5-4s3.5 1.8 3.5 4', // center person body
  'M6 12.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3', // left person head
  'M3.5 18c0-1.7 1.1-3 2.5-3s2.5 1.3 2.5 3', // left person body
  'M18 12.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3', // right person head
  'M15.5 18c0-1.7 1.1-3 2.5-3s2.5 1.3 2.5 3', // right person body
];

const paths: Record<V2IconName, string> = {
  'chart-bar': 'M3 20h18M5 20V10h3v10M10 20V4h3v16M17 20V8h3v12',
  lock: 'M7 11V7a5 5 0 0 1 10 0v4M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z',
  cog: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35',
  dollar: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  building:
    'M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 21v-4h6v4M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  'arrow-up': 'M12 19V5M5 12l7-7 7 7',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
  users:
    'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  target:
    'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  'pod-sales': '', // rendered via POD_SALES_PATHS
};

export default function V2Icon({ name, size = 24 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === 'pod-sales' ? (
        POD_SALES_PATHS.map((d, i) => <path key={i} d={d} />)
      ) : (
        <path d={paths[name]} />
      )}
    </svg>
  );
}
