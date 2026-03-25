import type { Metadata, Viewport } from 'next';

/**
 * Viewport — enables safe-area-inset env variables on notched iOS devices.
 * Without viewport-fit: cover, env(safe-area-inset-*) always resolves to 0.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};
import { Newsreader, Inter } from 'next/font/google';
import Header from '@/components/Header/Header';
import Footer from '@/components/V2Sections/Footer/Footer';
import { footerContent } from '@/config/content';
import NavigationTracker from '@/components/NavigationTracker';
import '@/styles/index.css';
import '@/styles/tokens/stitch-overrides.css';
import './v2-shared.css';
import '@/styles/v2-parallax.css';

/**
 * Newsreader — editorial serif for headlines (Stitch theme)
 * Sets CSS variable --font-newsreader, mapped to --font-family-serif
 * via stitch-overrides.css.
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
 * Sets CSS variable --font-inter, mapped to --font-family
 * via stitch-overrides.css.
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
 * Provides: Newsreader + Inter fonts, Header, Footer, stitch-theme.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable}`}>
      <body className="stitch-theme">
        {/* Reset scroll on reload — disable browser scroll restoration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `history.scrollRestoration='manual';window.scrollTo(0,0);`,
          }}
        />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <NavigationTracker />
        <Header />
        <main id="main">{children}</main>
        <Footer data={footerContent} />
      </body>
    </html>
  );
}
