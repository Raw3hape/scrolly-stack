/**
 * CtaSection — full-width CTA matching Stitch design exactly.
 *
 * Layout (top to bottom):
 *   1. Overline (uppercase, tracked)
 *   2. Heading (display-size serif italic)
 *   3. Button (large, centered, no arrow by default)
 *   4. Microcopy (small, muted, below button)
 *
 * Background: BlueprintGrid canvas (architectural grid with mouse-driven glow).
 */

import Link from 'next/link';
import type { CtaSection as CtaSectionData } from '@/config/types-v2';
import { ctaConfigV2 } from '@/config/nav-v2';
import BlueprintGrid from './BlueprintGrid';
import './CtaSection.css';

interface Props {
  data: CtaSectionData;
}

export default function CtaSection({ data }: Props) {
  return (
    <div className="v2-cta__wrapper">
      {/* Interactive architectural grid background */}
      <BlueprintGrid />

      <div className="v2-container v2-cta__layout">
        {data.overline && (
          <span className="v2-cta__overline">{data.overline}</span>
        )}

        <h2 className="v2-cta__heading">{data.heading}</h2>

        <Link href={ctaConfigV2.href} className="v2-cta__button">
          {data.buttonLabel ?? ctaConfigV2.label} <span aria-hidden="true">→</span>
        </Link>

        {data.microcopy && (
          <p className="v2-cta__microcopy">{data.microcopy}</p>
        )}
      </div>
    </div>
  );
}
