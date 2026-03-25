/**
 * HeroSection — full-width hero with two layout variants.
 *
 * Variants:
 * - 'center' (default): centered text + CTA, dark background
 * - 'editorial': left-aligned text (8 cols) + decorative image (4 cols), light background
 *
 * Data-driven: receives all content via props from content.ts.
 */

import type { HeroSection as HeroSectionData } from '@/config/types';
import { ctaConfig } from '@/config/nav';
import LinkButton from '@/components/LinkButton/LinkButton';
import HeroPyramid3DLoader from '@/features/scrolly-experience/components/HeroPyramid3DLoader';
import HeroRubiksCube3DLoader from '@/features/scrolly-experience/components/HeroRubiksCube3DLoader';
import HeroExplodedGrid3DLoader from '@/features/scrolly-experience/components/HeroExplodedGrid3DLoader';
import HeroAscendingBlocks3DLoader from '@/features/scrolly-experience/components/HeroAscendingBlocks3DLoader';
import './HeroSection.css';

const HERO_3D_MAP = {
  'pyramid': HeroPyramid3DLoader,
  'rubiks-cube': HeroRubiksCube3DLoader,
  'exploded-grid': HeroExplodedGrid3DLoader,
  'ascending-blocks': HeroAscendingBlocks3DLoader,
} as const;

interface Props {
  data: HeroSectionData;
}

export default function HeroSection({ data }: Props) {
  const Hero3D = data.hero3dModel ? HERO_3D_MAP[data.hero3dModel] : null;
  const isEditorial = data.layout === 'editorial';
  const isLeft = data.layout === 'left';

  const layoutClass = isEditorial
    ? ' v2-hero--editorial'
    : isLeft
      ? ' v2-hero--left'
      : '';

  return (
    <div className="v2-container">
      <div className={`v2-hero${layoutClass}`}>
        {/* Editorial: grid wrapper for vertical centering */}
        {isEditorial ? (
          <>
            <div className="v2-hero__grid">

              <div className="v2-hero__content" data-hero-text>
                {data.overline && (
                  <span className="v2-hero__overline">{data.overline}</span>
                )}
                <h1 className="v2-hero__heading px-layer--fg">
                  {data.heading.split('\n').map((line, i, arr) => (
                    <span key={i} className={i > 0 ? 'v2-hero__heading-accent' : undefined}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </span>
                  ))}
                </h1>
                {data.subtext && (
                  <p className="v2-hero__subtext px-layer--fg" data-px-delay="1">{data.subtext}</p>
                )}
                {data.buttonLabel && (
                  <div className="v2-hero__actions px-layer--fg" data-px-delay="2">
                    <LinkButton href={ctaConfig.href} variant="primary" arrow>
                      {data.buttonLabel}
                    </LinkButton>
                  </div>
                )}
              </div>

              {!Hero3D && data.imageUrl ? (
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
              ) : null}

              {/* Stat display (investors hero) */}
              {data.stat && !data.imageUrl && (
                <div className="v2-hero__stat-col px-layer--bg" data-px-from="right">
                  <div className="v2-hero__stat-block">
                    <span className="v2-hero__stat-value">{data.stat.value}</span>
                    <span className="v2-hero__stat-label">{data.stat.label}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 3D backdrop — spans full hero, model offset to right in world space */}
            {Hero3D && (
              <div className="v2-hero__3d-col px-layer--bg" data-px-from="right">
                <Hero3D className="v2-hero__3d-canvas" />
              </div>
            )}

            {/* Elegant scroll indicator */}
            <div className="v2-hero__scroll-hint" aria-hidden="true">
              <span className="v2-hero__scroll-hint__label">Scroll</span>
              <span className="v2-hero__scroll-hint__line" />
            </div>
          </>
        ) : (
          /* Default centered / left layout */
          <div className={Hero3D && isLeft ? 'v2-hero__split' : undefined}>
            <div data-hero-text>
              {data.badge && (
                <span className="v2-hero__badge">{data.badge}</span>
              )}
              <h1 className="v2-hero__heading px-layer--fg">{data.heading}</h1>
              {data.subtext && (
                <p className="v2-hero__subtext px-layer--fg" data-px-delay="1">{data.subtext}</p>
              )}
              <div className="v2-hero__actions">
                <LinkButton href={ctaConfig.href} variant="primary" arrow>
                  {data.buttonLabel ?? ctaConfig.label}
                </LinkButton>
                {data.trustBadge && !data.trustBadges && (
                  <span className="v2-hero__trust">
                    <svg className="v2-hero__trust-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                    </svg>
                    {data.trustBadge}
                  </span>
                )}
              </div>
              {data.trustBadges && (
                <div className="v2-hero__trust-pills">
                  {data.trustBadges.map((label) => (
                    <span key={label} className="v2-hero__trust-pill">
                      <svg className="v2-hero__trust-pill-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {Hero3D && isLeft && (
              <div className="v2-hero__3d-col">
                <Hero3D className="v2-hero__3d-canvas" />
              </div>
            )}

            {/* Elegant scroll indicator (left layout) */}
            {isLeft && (
              <div className="v2-hero__scroll-hint" aria-hidden="true">
                <span className="v2-hero__scroll-hint__label">Scroll</span>
                <span className="v2-hero__scroll-hint__line" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Optional background glow */}
      {data.backgroundGlow && (
        <div className="v2-hero__glow" aria-hidden="true" />
      )}
    </div>
  );
}
