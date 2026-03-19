import type { Metadata } from 'next';
import { Newsreader, Inter } from 'next/font/google';
import V2Header from '@/components/V2Header/V2Header';
import V2Footer from '@/components/V2Sections/V2Footer/V2Footer';
import { footerContent } from '@/config/content-v2';
import '@/styles/tokens/stitch-overrides.css';
import './v2-shared.css';

/**
 * Newsreader — editorial serif for headlines (Stitch theme)
 * Replaces DM Serif Display from the main site.
 * Sets CSS variable --font-newsreader.
 */
const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600'],
});

/**
 * Inter — clean sans-serif for body (Stitch theme)
 * Replaces Satoshi from the main site.
 * Sets CSS variable --font-inter.
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

/**
 * /v2/ pages should not be indexed by search engines (experimental).
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: {
    default: 'Foundation Projects v2 — Preview',
    template: '%s | Foundation Projects v2',
  },
};

/**
 * V2 Layout — Stitch-themed wrapper for /v2/* pages.
 *
 * - Loads Newsreader + Inter fonts (scoped to /v2/)
 * - Applies .stitch-theme class for token overrides
 * - Renders V2Header (glassmorphism + mobile drawer)
 * - Content wrapped in .v2-content-wrapper (covers sticky footer during scroll)
 * - V2Footer uses position:sticky to reveal from behind content (parallax)
 * - Font CSS variables override serif/sans in this subtree
 */
export default function V2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`stitch-theme ${newsreader.variable} ${inter.variable}`}>
      <V2Header />
      <div className="v2-content-wrapper">
        {children}
      </div>
      <V2Footer data={footerContent} />
    </div>
  );
}

