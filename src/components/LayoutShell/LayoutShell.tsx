/**
 * LayoutShell — conditionally renders v1 Header/Footer.
 *
 * Hides v1 Header + Footer on /v2/* pages so that
 * the Stitch-themed V2 layout has full control.
 */

'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

interface LayoutShellProps {
  header: ReactNode;
  footer: ReactNode;
  versionBadge: ReactNode;
  children: ReactNode;
}

export default function LayoutShell({
  header,
  footer,
  versionBadge,
  children,
}: LayoutShellProps) {
  const pathname = usePathname();
  const isV2 = pathname.startsWith('/v2');

  return (
    <>
      {!isV2 && header}
      <main id="main">{children}</main>
      {!isV2 && footer}
      {!isV2 && versionBadge}
    </>
  );
}
