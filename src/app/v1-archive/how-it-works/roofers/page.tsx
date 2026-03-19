import type { Metadata } from 'next';
import Section from '@/components/Section/Section';
import PageHeader from '@/components/PageHeader/PageHeader';
import ValuePropsStrip from '@/components/ValuePropsStrip/ValuePropsStrip';
import StepCards from '@/components/StepCards/StepCards';
import BulletSection from '@/components/BulletSection/BulletSection';
import CtaBlock from '@/components/CtaBlock/CtaBlock';
import { pageMetadata } from '@/config/content/metadata';
import {
  roofersHero,
  roofersValueProps,
  roofersProb,
  roofersSteps,
  whatChanges,
  roofersFinalCta,
} from '@/config/content/roofers';
import '../../../status-pages.css';

export const metadata: Metadata = pageMetadata.roofers;

/**
 * How It Works — Roofers Page
 *
 * Section 1: Hero
 * Section 2: Value Props Strip
 * Section 3: Problem
 * Section 4: 3-Step Process (StepCards)
 * Section 5: What Changes For You (BulletSection + CTA)
 * Section 6: Final CTA
 */
export default function HowItWorksRoofersPage() {
  return (
    <>
      {/* Section 1: Hero */}
      <Section width="narrow">
        <PageHeader
          title={roofersHero.heading}
          description={roofersHero.body}
        />
      </Section>

      {/* Section 2: Value Props Strip */}
      <Section width="default">
        <ValuePropsStrip items={roofersValueProps} />
      </Section>

      {/* Section 3: Problem */}
      <Section width="narrow">
        <div className="status-page__block">
          <h2 className="status-page__heading">{roofersProb.heading}</h2>
          <p className="status-page__body">{roofersProb.body}</p>
        </div>
      </Section>

      {/* Section 4: The 3-Step Process */}
      <Section width="default">
        <h2 className="section-heading">Here&apos;s How It Works</h2>
        <StepCards steps={roofersSteps} />
      </Section>

      {/* Section 5: What Changes For You */}
      <Section width="narrow">
        <BulletSection
          heading={whatChanges.heading}
          items={whatChanges.bullets}
          ctaLabel={whatChanges.ctaLabel}
          ctaHref={whatChanges.ctaHref}
        />
      </Section>

      {/* Section 6: Final CTA */}
      <Section width="default">
        <CtaBlock
          heading={roofersFinalCta.heading}
          subheading={roofersFinalCta.subheading}
          body={roofersFinalCta.body}
          ctaLabel={roofersFinalCta.ctaLabel}
          ctaHref={roofersFinalCta.ctaHref}
        />
      </Section>
    </>
  );
}
