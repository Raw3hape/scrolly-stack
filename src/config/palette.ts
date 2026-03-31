/**
 * Brand Color Palette — Foundation Projects
 *
 * SINGLE SOURCE OF TRUTH for all hex color values.
 * Used by both CSS tokens (tokens/colors.css) and Three.js (data.ts, config.ts).
 *
 * RESKIN: Update values here AND in tokens/colors.css to rebrand.
 * AI AGENTS: Import from this file instead of hardcoding hex values.
 */

export const palette = {
  // Anchor — Trust, Authority, 'The Rock'
  anchor900: '#103740',
  anchor700: '#1A4E58',
  anchor500: '#2A6470',
  anchor300: '#3E7A88',
  anchor200: '#5A9DAB',

  // Systems — Process, Engineering, 'The Machine'
  teal700: '#1E5757',
  teal500: '#297373',
  teal300: '#3A8C8C',
  teal100: '#D0E8E8',
  tealExLight: '#5AABAB',

  // Growth — Results, Dividends, 'The Yield'
  green700: '#2E6B42',
  green500: '#3E8C59',
  green300: '#5BA374',

  // Foundation — Clarity, Canvas, 'No Fluff'
  sand300: '#DDD5C8',
  sand200: '#E8E1D6',
  sand100: '#F2EDE4',
  sand50: '#F7F4EF',
  sand25: '#FDFCFA',

  // Value — Craft, Spark, 'The Second Mile'
  gold700: '#B87A2E',
  gold500: '#D79344',
  gold300: '#E5AD6B',

  // Dark variants (used in 3D active states)
  anchorDeep: '#0A2B33',
  tealDark: '#153F3F',
  greenDark: '#1F5233',
  goldDark: '#9A6523',

  // Scene lights
  ambientLight: '#e8e8ff',
  white: '#ffffff',
  sceneBg: '#0f172a',
} as const;

export type PaletteKey = keyof typeof palette;
