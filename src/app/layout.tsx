import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import '@/styles/index.css';

/**
 * Satoshi font — self-hosted via next/font/local
 * Sets CSS variable --font-family used throughout the design system.
 * RESKIN: Replace font files in src/fonts/ and update paths here.
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
 * Default metadata for the entire site.
 * Individual pages can override via their own `metadata` export.
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://foundationprojects.com'),
  title: {
    default: 'Foundation Projects — Build a Roofing Business That Sells at a Premium',
    template: '%s | Foundation Projects',
  },
  description: 'We install CRM, marketing, and ops systems that transform roofing companies into premium sellable businesses.',
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
    <html lang="en" className={satoshi.variable}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
