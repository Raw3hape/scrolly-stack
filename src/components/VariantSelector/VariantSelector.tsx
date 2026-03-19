/**
 * VariantSelector — Light splash screen for choosing a cube variant.
 *
 * Displays before the site loads. Clean, light design with tall uniform cards.
 * Each card has an icon, name, description, and stats.
 */

'use client';

import { useState, useCallback, type ReactNode } from 'react';
import { getAllVariants } from '@/features/scrolly-experience/variants/registry';
import type { StackVariant } from '@/features/scrolly-experience/variants/types';
import './VariantSelector.css';

interface VariantSelectorProps {
  onSelect: (variantId: string) => void;
}

/** SVG cube icons for each variant concept */
const variantIcons: Record<string, ReactNode> = {
  classic: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  'v2-journey': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <path d="M12 8v-2" strokeDasharray="2 2" />
      <path d="M12 18v-2" strokeDasharray="2 2" />
    </svg>
  ),
  'v3-reverse': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
      <path d="M12 18l-3-3m3 3l3-3" />
    </svg>
  ),
  'v4-exact': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
      <path d="M12 6l-3 3m3-3l3 3" />
      <path d="M9 15h6" strokeWidth="2" />
    </svg>
  ),
  'v5-exact-down': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
      <path d="M12 18l-3-3m3 3l3-3" />
      <path d="M9 9h6" strokeWidth="2" />
    </svg>
  ),
  'v6-exact-flipped': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
      <path d="M12 6l-3 3m3-3l3 3" />
      <path d="M12 18l-3-3m3 3l3-3" />
    </svg>
  ),
};

export default function VariantSelector({ onSelect }: VariantSelectorProps) {
  const variants = getAllVariants();
  const selectedDefault = variants[0]?.id ?? 'classic';
  const [selectedId, setSelectedId] = useState<string>(selectedDefault);

  const handleEnter = useCallback(() => {
    onSelect(selectedId);
  }, [selectedId, onSelect]);

  return (
    <div className="variant-selector">
      <div className="variant-selector__content">
        <h1 className="variant-selector__title">Choose Your Experience</h1>
        <p className="variant-selector__subtitle">
          Select a stack variant to explore
        </p>

        <div className="variant-selector__cards">
          {variants.map((variant: StackVariant, index: number) => {
            const blockCount = variant.layers.reduce(
              (acc, layer) => acc + layer.blocks.length,
              0
            );
            const layerCount = variant.layers.length;
            const isSelected = selectedId === variant.id;

            return (
              <button
                key={variant.id}
                className={`variant-card ${isSelected ? 'variant-card--selected' : ''}`}
                onClick={() => setSelectedId(variant.id)}
                type="button"
              >
                <span className="variant-card__number">{index + 1}</span>

                <div className="variant-card__icon">
                  {variantIcons[variant.id] ?? variantIcons.classic}
                </div>

                <h3 className="variant-card__name">{variant.name}</h3>
                <p className="variant-card__description">{variant.description}</p>

                <div className="variant-card__stats">
                  <div className="variant-card__stat">
                    <span className="variant-card__stat-value">{blockCount}</span>
                    <span className="variant-card__stat-label">blocks</span>
                  </div>
                  <div className="variant-card__stat-divider" />
                  <div className="variant-card__stat">
                    <span className="variant-card__stat-value">{layerCount}</span>
                    <span className="variant-card__stat-label">layers</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <button
          className="variant-selector__enter"
          onClick={handleEnter}
          type="button"
        >
          Enter Experience
          <svg
            className="variant-selector__arrow"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
}
