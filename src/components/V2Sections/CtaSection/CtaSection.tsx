/**
 * CtaSection — full-width CTA matching Stitch design.
 *
 * Layout (top to bottom):
 *   1. Overline (uppercase, tracked)
 *   2. Heading (display-size serif italic)
 *   3. Buttons: primary + optional secondary (ghost)
 *   4. Microcopy (small, muted, below buttons)
 *
 * Supports dark variant via surface='dark' (dark teal bg, light text).
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

      {/* Decorative 12-column architectural lines (Stitch fidelity) */}
      <div className="v2-cta__arch-lines" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="v2-cta__arch-col" />
        ))}
      </div>

      {/* Inner decorative frame border */}
      <div className="v2-cta__inner-frame" aria-hidden="true" />

      <div className="v2-container v2-cta__layout">
        {data.overline && (
          <span className="v2-cta__overline px-layer--fg">{data.overline}</span>
        )}

        <h2 className="v2-cta__heading px-layer--fg" data-px-delay="1">{data.heading}</h2>

        {data.microcopy && (
          <p className="v2-cta__microcopy">{data.microcopy}</p>
        )}

        <div className="v2-cta__buttons px-layer--accent" data-px-delay="2">
          <Link href={ctaConfigV2.href} className="v2-cta__button">
            {data.buttonLabel ?? ctaConfigV2.label} <span aria-hidden="true">→</span>
          </Link>
          {data.secondaryButtonLabel && (
            <Link
              href={data.secondaryHref ?? '#'}
              className="v2-cta__button v2-cta__button--secondary"
            >
              {data.secondaryButtonLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
