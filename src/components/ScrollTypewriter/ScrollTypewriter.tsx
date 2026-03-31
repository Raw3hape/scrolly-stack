/**
 * ScrollTypewriter — Scroll-driven letter-by-letter text reveal.
 *
 * Architecture:
 *   - Uses `useParallax` to write `--px-progress` (0→1) on the container
 *   - Each character is a `<span>` with `--char-index` and `--char-total`
 *   - CSS `clamp()` + `calc()` computes opacity per character — zero JS
 *     per-frame overhead beyond the single CSS variable update
 *   - Spaces render as `&nbsp;` with permanent `opacity: 1`
 *
 * Performance:
 *   - JS: 1 scroll handler → 1 CSS variable write per frame (via useParallax)
 *   - CSS: browser natively resolves calc() for all characters
 *   - `will-change: opacity` on characters, removed after full reveal
 *
 * Props:
 *   - text:      The string to animate
 *   - className: Additional CSS class(es) to merge (for typography styles)
 *   - as:        HTML element to render ('p' | 'blockquote' | 'span')
 *   - completionFactor: How far user must scroll for full reveal (0-1)
 */

'use client';

import { createElement, useMemo } from 'react';
import useParallax from '@/hooks/useParallax';
import './ScrollTypewriter.css';

interface ScrollTypewriterProps {
  /** The text content to reveal letter-by-letter */
  text: string;
  /** Additional CSS class(es), merged with scroll-typewriter */
  className?: string;
  /** HTML element to render. Default: 'p' */
  as?: 'p' | 'blockquote' | 'span' | 'h2';
  /**
   * Controls how far the section's top edge must travel into the viewport
   * for all characters to be revealed. Lower = faster reveal.
   * Default: 0.35 (tuned for quote-length text).
   */
  completionFactor?: number;
}

export default function ScrollTypewriter({
  text,
  className,
  as: Tag = 'p',
  completionFactor = 0.35,
}: ScrollTypewriterProps) {
  const ref = useParallax<HTMLElement>({
    threshold: 0,
    rootMargin: '60px 0px',
    completionFactor,
  });

  // Split text into characters, count non-space chars for indexing
  const chars = useMemo(() => {
    const characters = Array.from(text);
    let nonSpaceIndex = 0;
    const totalNonSpace = characters.filter((ch) => ch !== ' ' && ch !== '\u00A0').length;

    return characters.map((char) => {
      const isSpace = char === ' ' || char === '\u00A0';
      const entry = {
        char,
        isSpace,
        index: isSpace ? -1 : nonSpaceIndex,
        total: totalNonSpace,
      };
      if (!isSpace) nonSpaceIndex++;
      return entry;
    });
  }, [text]);

  const combinedClassName = ['scroll-typewriter', className].filter(Boolean).join(' ');

  return createElement(
    Tag,
    {
      ref,
      className: combinedClassName,
      'aria-label': text,
    },
    chars.map((entry, i) =>
      entry.isSpace ? (
        <span key={i} className="scroll-typewriter__space">
          {' '}
        </span>
      ) : (
        <span
          key={i}
          className="scroll-typewriter__char"
          style={
            {
              '--char-index': entry.index,
              '--char-total': entry.total,
            } as React.CSSProperties
          }
          aria-hidden="true"
        >
          {entry.char}
        </span>
      ),
    ),
  );
}
