/**
 * CtaSection — full-width CTA matching Stitch design.
 *
 * Layout (top to bottom):
 *   1. Overline (uppercase, tracked)
 *   2. Heading (display-size serif italic) — scroll-driven letter-by-letter reveal
 *   3. Buttons: primary + optional secondary (ghost)
 *   4. Microcopy (small, muted, below buttons)
 *
 * Animations:
 *   - Heading uses ScrollTypewriter for per-character reveal tied to scroll
 *   - Supporting elements (overline, microcopy, buttons) use CSS-only stagger
 *     driven by --px-progress from the parent SectionRenderer
 *
 * Supports dark variant via surface='dark' (dark teal bg, light text).
 * Background: BlueprintGrid canvas (architectural grid with mouse-driven glow).
 */

import Link from 'next/link';
import type { CtaSection as CtaSectionData } from '@/config/types';
import { ctaConfig } from '@/config/nav';
import ScrollTypewriter from '@/components/ScrollTypewriter/ScrollTypewriter';
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
          <span
            className="v2-cta__overline v2-cta__reveal"
            style={{ '--reveal-order': 0 } as React.CSSProperties}
          >
            {data.overline}
          </span>
        )}

        {/* Scroll-driven letter-by-letter heading reveal */}
        <ScrollTypewriter
          text={data.heading}
          as="h2"
          className="v2-cta__heading"
          completionFactor={0.55}
        />

        {data.microcopy && (
          <p
            className="v2-cta__microcopy v2-cta__reveal"
            style={{ '--reveal-order': 1 } as React.CSSProperties}
          >
            {data.microcopy}
          </p>
        )}

        <div
          className="v2-cta__buttons v2-cta__reveal"
          style={{ '--reveal-order': 2 } as React.CSSProperties}
        >
          <Link href={ctaConfig.href} className="v2-cta__button">
            {data.buttonLabel ?? ctaConfig.label} <span aria-hidden="true">→</span>
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
