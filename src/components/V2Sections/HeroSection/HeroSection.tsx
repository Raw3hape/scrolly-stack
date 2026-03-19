/**
 * HeroSection — full-width dark hero with large serif heading + CTA.
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
  return (
    <div className="v2-container">
      <div className="v2-hero">
        <h1 className="v2-hero__heading">{data.heading}</h1>
        {data.subtext && (
          <p className="v2-hero__subtext">{data.subtext}</p>
        )}
        <Link href={ctaConfigV2.href} className="v2-hero__cta">
          {data.buttonLabel ?? ctaConfigV2.label}
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
