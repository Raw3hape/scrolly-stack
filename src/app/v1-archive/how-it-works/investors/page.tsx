import type { Metadata } from 'next';
import Section from '@/components/Section/Section';
import PageHeader from '@/components/PageHeader/PageHeader';
import ValuePropsStrip from '@/components/ValuePropsStrip/ValuePropsStrip';
import StepCards from '@/components/StepCards/StepCards';
import BulletSection from '@/components/BulletSection/BulletSection';
import CtaBlock from '@/components/CtaBlock/CtaBlock';
import { pageMetadata } from '@/config/content/metadata';
import {
  investorsHero,
  investorsValueProps,
  opportunity,
  investorsSteps,
  investorsStakes,
  whyActNow,
  investorsFinalCta,
} from '@/config/content/investors';
import '../../../status-pages.css';

export const metadata: Metadata = pageMetadata.investors;

/**
 * How It Works — Investors Page
 *
 * Section 1: Hero
 * Section 2: Value Props Strip
 * Section 3: The Ground Floor Opportunity
 * Section 4: 3-Step Process (StepCards)
 * Section 5: Stakes
 * Section 6: Why Act Now (BulletSection + CTA)
 * Section 7: Final CTA
 */
export default function HowItWorksInvestorsPage() {
  return (
    <>
      {/* Section 1: Hero */}
      <Section width="narrow">
        <PageHeader
          title={investorsHero.heading}
          description={investorsHero.body}
        />
      </Section>

      {/* Section 2: Value Props Strip */}
      <Section width="default">
        <ValuePropsStrip items={investorsValueProps} />
      </Section>

      {/* Section 3: The Ground Floor Opportunity */}
      <Section width="narrow">
        <div className="status-page__block">
          <h2 className="status-page__heading">{opportunity.heading}</h2>
          <p className="status-page__body">{opportunity.body}</p>
        </div>
      </Section>

      {/* Section 4: The 3-Step Process */}
      <Section width="default">
        <h2 className="section-heading">Here&apos;s How It Works</h2>
        <StepCards steps={investorsSteps} />
      </Section>

      {/* Section 5: Stakes */}
      <Section width="narrow">
        <div className="stakes-section">
          <p className="stakes-section__lead">{investorsStakes.body}</p>
          <p className="stakes-section__detail">{investorsStakes.detail}</p>
        </div>
      </Section>

      {/* Section 6: Why Act Now */}
      <Section width="narrow">
        <BulletSection
          heading={whyActNow.heading}
          items={whyActNow.bullets}
          ctaLabel={whyActNow.ctaLabel}
          ctaHref={whyActNow.ctaHref}
        />
      </Section>

      {/* Section 7: Final CTA */}
      <Section width="default">
        <CtaBlock
          heading={investorsFinalCta.heading}
          subheading={investorsFinalCta.subheading}
          body={investorsFinalCta.body}
          footnote={investorsFinalCta.footnote}
          ctaLabel={investorsFinalCta.ctaLabel}
          ctaHref={investorsFinalCta.ctaHref}
        />
      </Section>
    </>
  );
}
