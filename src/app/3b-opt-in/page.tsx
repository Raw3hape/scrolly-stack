import type { Metadata } from 'next';
import Image from 'next/image';
import Section from '@/components/Section/Section';
import PageHeader from '@/components/PageHeader/PageHeader';
import { pageMetadata } from '@/config/content/metadata';
import { optInContent } from '@/config/content/opt-in';
import './opt-in.css';

export const metadata: Metadata = pageMetadata.optIn;

/**
 * Freebie Opt-In Page — Foundation Projects
 *
 * Lead magnet with badge, mockup image, and form (UI only — backend TBD).
 */
export default function ThreeBOptInPage() {
  return (
    <Section width="narrow" centered>
      <div className="opt-in">
        {/* Badge */}
        <span className="opt-in__badge">{optInContent.badge}</span>

        {/* Mockup Image */}
        <div className="opt-in__mockup">
          <Image
            src={optInContent.mockupSrc}
            alt={optInContent.mockupAlt}
            width={320}
            height={400}
            className="opt-in__mockup-image"
            priority
          />
        </div>

        <PageHeader
          title={optInContent.heading}
          description={optInContent.body}
          align="center"
        />

        {/* Lead magnet form — UI only, no backend yet */}
        <form className="opt-in__form" onSubmit={undefined} action="#">
          <div className="opt-in__field">
            <label htmlFor="firstName" className="opt-in__label">
              {optInContent.formFields.firstName.label}
            </label>
            <input
              id="firstName"
              type="text"
              className="opt-in__input"
              placeholder={optInContent.formFields.firstName.placeholder}
              required={optInContent.formFields.firstName.required}
            />
          </div>

          <div className="opt-in__field">
            <label htmlFor="email" className="opt-in__label">
              {optInContent.formFields.email.label}
            </label>
            <input
              id="email"
              type="email"
              className="opt-in__input"
              placeholder={optInContent.formFields.email.placeholder}
              required={optInContent.formFields.email.required}
            />
          </div>

          <button type="submit" className="opt-in__submit">
            {optInContent.ctaLabel}
          </button>
        </form>
      </div>
    </Section>
  );
}
