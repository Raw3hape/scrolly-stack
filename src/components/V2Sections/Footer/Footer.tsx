'use client';

/**
 * Footer — shared site footer.
 * Data-driven: receives content from content.ts FooterContent.
 *
 * Features:
 * - Real SVG logo from brandConfig
 * - Email subscription input with submit button
 * - Link columns (Company, Legal)
 * - Bottom bar with copyright + tagline
 * - Scroll-synced inner content parallax (--footer-reveal CSS var)
 */

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { FooterContent } from '@/config/types';
import { brandConfig, routes } from '@/config/nav';
import { siteConfig } from '@/config/site';
import { SELECTOR_CONTENT_WRAPPER } from '@/config/dom-contracts';
import './Footer.css';

interface Props {
  data: FooterContent;
}

export default function Footer({ data }: Props) {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    // Cache wrapper reference once — avoid querySelector on every scroll frame
    const wrapper = document.querySelector(SELECTOR_CONTENT_WRAPPER);
    let rafId: number | null = null;

    const updateReveal = () => {
      if (!wrapper) {
        el.style.setProperty('--footer-reveal', '1');
        return;
      }
      const wrapperRect = wrapper.getBoundingClientRect();
      const vh = window.innerHeight;
      const footerHeight = el.offsetHeight;
      const progress = footerHeight > 0
        ? Math.max(0, Math.min(1, (vh - wrapperRect.bottom) / footerHeight))
        : 1;
      el.style.setProperty('--footer-reveal', String(progress));
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        updateReveal();
        rafId = null;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <footer className="footer" ref={footerRef}>
      <div className="footer__grid">
        {/* Brand column — logo + description */}
        <div className="footer__brand">
          <Link href={routes.home} className="footer__logo-link">
            <Image
              src={brandConfig.logo}
              alt={brandConfig.wordmark}
              width={160}
              height={40}
              className="footer__logo"
            />
          </Link>
          <p className="footer__brand-desc">{data.brandDescription}</p>
        </div>

        {/* Link columns */}
        {data.columns.map((col) => (
          <div key={col.title}>
            <h4 className="footer__col-title">{col.title}</h4>
            <ul className="footer__links">
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
          <div className="footer__subscribe-col">
            <h4 className="footer__col-title">
              {data.subscribeTitle ?? 'Stay Informed'}
            </h4>
            <p className="footer__subscribe-text">{data.subscribeText}</p>
            <form
              className="footer__subscribe-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                className="footer__subscribe-input"
                placeholder={data.subscribePlaceholder ?? 'Email Address'}
                aria-label={data.subscribePlaceholder ?? 'Email Address'}
                required
              />
              <button
                type="submit"
                className="footer__subscribe-btn"
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
      <div className="footer__bottom">
        <p className="footer__copyright">{siteConfig.copyright}</p>
        {data.copyrightTagline && (
          <p className="footer__tagline">{data.copyrightTagline}</p>
        )}
      </div>
    </footer>
  );
}
