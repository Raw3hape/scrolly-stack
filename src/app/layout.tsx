import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { DM_Serif_Display } from 'next/font/google';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import VersionBadge from '@/components/VersionBadge/VersionBadge';
import '@/styles/index.css';

/**
 * Satoshi — sans-serif body font (self-hosted)
 * Sets CSS variable --font-family used for body text, UI, buttons.
 */
const satoshi = localFont({
  src: [
    { path: '../fonts/Satoshi-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/Satoshi-Medium.woff2',  weight: '500', style: 'normal' },
    { path: '../fonts/Satoshi-Bold.woff2',    weight: '700', style: 'normal' },
  ],
  variable: '--font-family',
  display: 'swap',
});

/**
 * DM Serif Display — editorial serif for headlines
 * Sets CSS variable --font-family-serif used for h1-h3, hero display.
 * Brand adjacencies: Kinfolk, Architectural Digest, Four Seasons.
 */
const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-family-serif',
  display: 'swap',
});

/**
 * Default metadata for the entire site.
 * Individual pages can override via their own `metadata` export.
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://foundationprojects.com'),
  title: {
    default: 'Foundation Projects — We Take Roofing Companies Public',
    template: '%s | Foundation Projects',
  },
  description: 'We\'re building a roofing company that goes public. Best-in-class operators get 7–10× what PE would pay.',
  openGraph: {
    type: 'website',
    siteName: 'Foundation Projects',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

/**
 * Root layout — wraps all pages.
 * Provides: font, Header, Footer, global CSS.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${satoshi.variable} ${dmSerif.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <VersionBadge />
      </body>
    </html>
  );
}
