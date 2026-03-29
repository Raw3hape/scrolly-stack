/**
 * TeamSection — horizontal photo gallery (Stitch "The Curators" style).
 *
 * Each card shows a photo on top (3:4 aspect ratio, grayscale → color on hover)
 * with a left-bordered info block below. Scrollable carousel with snap + nav arrows.
 *
 * Data-driven: receives content via props from content.ts.
 */

'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import type { TeamSection as TeamSectionData } from '@/config/types';
import './TeamSection.css';

interface Props {
  data: TeamSectionData;
}

/** Extract initials from a full name, e.g. "Jacob Sterling" → "JS" */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function TeamSection({ data }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const tolerance = 2;
    setCanScrollLeft(el.scrollLeft > tolerance);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - tolerance);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();

    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons, { passive: true });

    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [updateScrollButtons]);

  const scroll = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;

    const card = el.querySelector<HTMLElement>('.v2-team-card');
    if (!card) return;
    const cardStyle = window.getComputedStyle(el);
    const gap = parseFloat(cardStyle.gap) || 0;
    const scrollAmount = card.offsetWidth + gap;

    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }, []);

  return (
    <>
      {/* Header row: title left + nav arrows right */}
      <div className="v2-container">
        <div className="v2-team-header">
          <div>
            {data.chapterLabel && (
              <span className="v2-team-header__chapter">{data.chapterLabel}</span>
            )}
            <h2 className="v2-team-header__heading px-layer--fg">{data.heading}</h2>
          </div>
          <div className="v2-team-header__arrows">
            <button
              type="button"
              className={`v2-team-arrow${canScrollLeft ? '' : ' v2-team-arrow--hidden'}`}
              onClick={() => scroll('left')}
              aria-label="Previous team members"
              disabled={!canScrollLeft}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              className={`v2-team-arrow${canScrollRight ? '' : ' v2-team-arrow--hidden'}`}
              onClick={() => scroll('right')}
              aria-label="Next team members"
              disabled={!canScrollRight}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable track — full bleed (no container) for edge-to-edge scroll */}
      <div className="v2-team-track px-layer--accent" data-px-delay="2" ref={scrollRef}>
        {data.members.map((member) => (
          <div key={member.name} className="v2-team-card">
            {/* Photo or fallback initials */}
            <div className="v2-team-card__photo-wrap">
              {member.imageUrl ? (
                <Image
                  className="v2-team-card__photo"
                  src={member.imageUrl}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 280px"
                />
              ) : (
                <div className="v2-team-card__avatar" aria-hidden="true">
                  {getInitials(member.name)}
                </div>
              )}
            </div>

            {/* Info block with left border accent */}
            <div className="v2-team-card__info">
              <span className="v2-team-card__role">{member.role}</span>
              <h3 className="v2-team-card__name">{member.name}</h3>
              <p className="v2-team-card__bio">{member.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
