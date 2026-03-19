'use client';

/**
 * V2Footer — shared footer for /v2/ pages.
 * Data-driven: receives content from content-v2.ts FooterContent.
 *
 * Features:
 * - Real SVG logo from brandConfigV2
 * - Email subscription input with submit button
 * - Link columns (Company, Legal)
 * - Bottom bar with copyright + tagline
 * - Scroll-synced inner content parallax (--footer-reveal CSS var)
 */

import { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { FooterContent } from '@/config/types-v2';
import { brandConfigV2, routesV2 } from '@/config/nav-v2';
import { siteConfig } from '@/config/site';
import './V2Footer.css';

interface Props {
  data: FooterContent;
}

export default function V2Footer({ data }: Props) {
  const footerRef = useRef<HTMLElement>(null);

  /**
   * Drive --footer-reveal (0→1) based on how much of the footer is
   * "uncovered" by the content wrapper above. Tied to the scroll
   * position of the .v2-content-wrapper's bottom edge.
   */
  const updateReveal = useCallback(() => {
    const el = footerRef.current;
    if (!el) return;

    const wrapper = document.querySelector('.v2-content-wrapper');
    if (!wrapper) {
      el.style.setProperty('--footer-reveal', '1');
      return;
    }

    const wrapperRect = wrapper.getBoundingClientRect();
    const vh = window.innerHeight;
    const footerHeight = el.offsetHeight;

    // wrapperBottom starts at vh (footer fully covered) and decreases
    // as user scrolls. When wrapperBottom = vh - footerHeight, footer
    // is fully revealed. Normalize by footerHeight so progress always
    // reaches 1.0 regardless of viewport size.
    const progress = footerHeight > 0
      ? Math.max(0, Math.min(1, (vh - wrapperRect.bottom) / footerHeight))
      : 1;
    el.style.setProperty('--footer-reveal', String(progress));
  }, []);

  useEffect(() => {
    updateReveal();
    window.addEventListener('scroll', updateReveal, { passive: true });
    window.addEventListener('resize', updateReveal, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateReveal);
      window.removeEventListener('resize', updateReveal);
    };
  }, [updateReveal]);

  return (
    <footer className="v2-footer" ref={footerRef}>
      <div className="v2-footer__grid">
        {/* Brand column — logo + description */}
        <div className="v2-footer__brand">
          <Link href={routesV2.home} className="v2-footer__logo-link">
            <Image
              src={brandConfigV2.logo}
              alt={brandConfigV2.wordmark}
              width={160}
              height={40}
              className="v2-footer__logo"
            />
          </Link>
          <p className="v2-footer__brand-desc">{data.brandDescription}</p>
        </div>

        {/* Link columns */}
        {data.columns.map((col) => (
          <div key={col.title}>
            <h4 className="v2-footer__col-title">{col.title}</h4>
            <ul className="v2-footer__links">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Subscribe column — email input */}
        {data.subscribeText && (
          <div className="v2-footer__subscribe-col">
            <h4 className="v2-footer__col-title">
              {data.subscribeTitle ?? 'Stay Informed'}
            </h4>
            <p className="v2-footer__subscribe-text">{data.subscribeText}</p>
            <form
              className="v2-footer__subscribe-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                className="v2-footer__subscribe-input"
                placeholder={data.subscribePlaceholder ?? 'Email Address'}
                aria-label={data.subscribePlaceholder ?? 'Email Address'}
                required
              />
              <button
                type="submit"
                className="v2-footer__subscribe-btn"
                aria-label="Subscribe"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1 8h14M9 2l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="v2-footer__bottom">
        <p className="v2-footer__copyright">{siteConfig.copyright}</p>
        {data.copyrightTagline && (
          <p className="v2-footer__tagline">{data.copyrightTagline}</p>
        )}
      </div>
    </footer>
  );
}
