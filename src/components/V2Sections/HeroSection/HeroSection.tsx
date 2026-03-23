/**
 * HeroSection — full-width hero with two layout variants.
 *
 * Variants:
 * - 'center' (default): centered text + CTA, dark background
 * - 'editorial': left-aligned text (8 cols) + decorative image (4 cols), light background
 *
 * Data-driven: receives all content via props from content-v2.ts.
 */

import Link from 'next/link';
import type { HeroSection as HeroSectionData } from '@/config/types-v2';
import { ctaConfigV2 } from '@/config/nav-v2';
import './HeroSection.css';

interface Props {
  data: HeroSectionData;
}

export default function HeroSection({ data }: Props) {
  const isEditorial = data.layout === 'editorial';

  return (
    <div className="v2-container">
      <div className={`v2-hero${isEditorial ? ' v2-hero--editorial' : ''}`}>
        <div className={isEditorial ? 'v2-hero__content' : undefined}>
          <h1 className="v2-hero__heading px-layer--fg">{data.heading}</h1>
          {data.subtext && (
            <p className="v2-hero__subtext px-layer--fg" data-px-delay="1">{data.subtext}</p>
          )}
          {!isEditorial && (
            <Link href={ctaConfigV2.href} className="v2-hero__cta">
              {data.buttonLabel ?? ctaConfigV2.label}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>

        {isEditorial && data.imageUrl && (
          <div className="v2-hero__image-col px-layer--bg" data-px-from="right">
            <div className="v2-hero__image-wrapper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="v2-hero__image"
                src={data.imageUrl}
                alt="Modern architectural detail of a premium roof line"
                loading="eager"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
