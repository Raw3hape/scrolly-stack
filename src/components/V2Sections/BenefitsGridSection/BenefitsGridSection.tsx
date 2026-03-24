/**
 * BenefitsGridSection — dark section with 12-col grid layout.
 *
 * Matches Stitch "Benefits Grid" pattern:
 * - Left (5 cols): heading + body text + CTA button
 * - Right (7 cols): 2×2 glassmorphism card grid with icons
 *
 * Responsive:
 * - Desktop: 12-col asymmetric grid
 * - Tablet/Mobile: stacked single column
 *
 * Data-driven: receives all content via props from content-v2.ts.
 */

import Link from 'next/link';
import type { BenefitsGridSection as BenefitsGridSectionData } from '@/config/types-v2';
import { ctaConfigV2 } from '@/config/nav-v2';
import V2Icon from '../V2Icon/V2Icon';
import './BenefitsGridSection.css';

interface Props {
  data: BenefitsGridSectionData;
}

export default function BenefitsGridSection({ data }: Props) {
  return (
    <div className="v2-benefits">
      {/* Left column: text + CTA */}
      <div className="v2-benefits__content px-layer--fg">
        <h2 className="v2-benefits__heading">{data.heading}</h2>
        <p className="v2-benefits__text">{data.text}</p>
        {data.ctaLabel && (
          <Link href={ctaConfigV2.href} className="v2-benefits__cta">
            {data.ctaLabel}
          </Link>
        )}
      </div>

      {/* Right column: 2×2 glassmorphism cards */}
      <div className="v2-benefits__grid">
        {data.cards.map((card, i) => (
          <div
            key={card.title}
            className="v2-benefits__card px-layer--accent"
            data-px-delay={String(i)}
          >
            <div className="v2-benefits__card-icon">
              <V2Icon name={card.icon} size={28} />
            </div>
            <h4 className="v2-benefits__card-title">{card.title}</h4>
            <p className="v2-benefits__card-text">{card.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
