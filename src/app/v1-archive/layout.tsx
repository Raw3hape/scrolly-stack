import type { Metadata } from 'next';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import VersionBadge from '@/components/VersionBadge/VersionBadge';

/**
 * V1 Archive Layout — wraps legacy pages under /v1-archive/*.
 *
 * - Renders original V1 Header + Footer
 * - noindex to prevent search engines from indexing archived content
 * - Accessible for internal review only
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: {
    default: 'Foundation Projects v1 — Archive',
    template: '%s | Foundation Projects (Archive)',
  },
};

export default function V1ArchiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <VersionBadge />
    </>
  );
}
