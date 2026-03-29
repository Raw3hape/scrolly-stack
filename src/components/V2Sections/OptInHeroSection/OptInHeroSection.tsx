/**
 * OptInHeroSection — 3D Book + Lead Magnet Form.
 *
 * Layout: 12-column grid
 *   - Left (5 cols): Interactive 3D book + trust badge
 *   - Right (7 cols): Overline, heading, subtext, form card, value props
 *
 * Mobile: single column, form first (order reversed).
 *
 * Client component — contains form interactions and 3D canvas.
 */

'use client';

import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import type { OptInHeroSection as OptInHeroSectionData } from '@/config/types';
import V2Icon from '../V2Icon/V2Icon';
import './OptInHeroSection.css';

const FreebieBook3D = dynamic(
  () => import('@/features/scrolly-experience/heroes').then((module) => module.FreebieBook3D),
  {
    ssr: false,
    loading: () => (
      <div className="v2-optin__book-canvas" aria-label="Loading 3D book preview" />
    ),
  },
);

interface Props {
  data: OptInHeroSectionData;
}

export default function OptInHeroSection({ data }: Props) {
  const [formState, setFormState] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = useCallback((name: string, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      // UI-only for now — backend TBD
      setSubmitted(true);
    },
    [],
  );

  return (
    <div className="v2-container">
      <div className="v2-optin">
        {/* ── Left Column: 3D Book + Trust Badge ── */}
        <div className="v2-optin__book-col">
          <FreebieBook3D
            className="v2-optin__book-canvas"
            title={data.book.title}
            subtitle={data.book.subtitle}
          />

          {/* Trust badge */}
          <div className="v2-optin__trust">
            <span className="v2-optin__trust-badge">
              <svg
                className="v2-optin__trust-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="14"
                height="14"
                aria-hidden="true"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              {data.trustBadge.text}
            </span>
            <span className="v2-optin__trust-metric">{data.trustBadge.metric}</span>
          </div>
        </div>

        {/* ── Right Column: Content + Form ── */}
        <div className="v2-optin__content-col">
          {/* Overline */}
          <span className="v2-optin__overline">{data.overline}</span>

          {/* Heading */}
          <h1 className="v2-optin__heading">{data.heading}</h1>

          {/* Subtext */}
          <p className="v2-optin__subtext">{data.subtext}</p>

          {/* Form Card */}
          <div className="v2-optin__form-card">
            {/* Decorative circle */}
            <div className="v2-optin__form-decor" aria-hidden="true" />

            {submitted ? (
              <div className="v2-optin__success" role="status">
                <svg
                  className="v2-optin__success-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <h3 className="v2-optin__success-heading">Check your inbox!</h3>
                <p className="v2-optin__success-text">
                  Your free report is on its way. Look for an email from Foundation Projects.
                </p>
              </div>
            ) : (
              <form
                className="v2-optin__form"
                onSubmit={handleSubmit}
              >
                {data.form.fields.map((field) => (
                  <div key={field.name} className="v2-optin__field">
                    <label
                      htmlFor={`optin-${field.name}`}
                      className="v2-optin__label"
                    >
                      {field.label}
                    </label>
                    <input
                      id={`optin-${field.name}`}
                      className="v2-optin__input"
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={formState[field.name] ?? ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                    />
                  </div>
                ))}
                <div className="v2-optin__submit-wrap">
                  <button type="submit" className="v2-optin__submit">
                    {data.form.submitLabel}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                  <p className="v2-optin__disclaimer">{data.form.disclaimer}</p>
                </div>
              </form>
            )}
          </div>

          {/* Value Props Grid */}
          <div className="v2-optin__props">
            {data.valueProps.map((prop) => (
              <div key={prop.title} className="v2-optin__prop">
                <div className="v2-optin__prop-icon">
                  <V2Icon name={prop.icon} size={20} />
                </div>
                <h4 className="v2-optin__prop-title">{prop.title}</h4>
                <p className="v2-optin__prop-text">{prop.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
