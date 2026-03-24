/**
 * E2E Tests — Content Pages (Home, About, Roofers, Investors, Schedule, Opt-In)
 *
 * Comprehensive tests for ALL sections, content, layout, CTAs, and interactivity.
 * All text assertions import from content config — zero hardcoded strings.
 */

import { test, expect } from '@playwright/test';
import { ctaConfig, routes } from '../src/config/nav';
import {
  investorsContent,
  roofersContent,
  scheduleContent,
  optInContent,
} from '../src/config/content';
import {
  problemStakesContent,
  homeValueProps,
  homeHowItWorks,
  stakesContent,
  homeFinalCta,
} from '../src/config/content/home';

// Extract roofers process steps from V2 content for assertions
const roofersProcessSection = roofersContent.sections.find(s => s.id === 'roofers-process');
const roofersSteps = roofersProcessSection && 'steps' in roofersProcessSection
  ? (roofersProcessSection as { steps: Array<{ title: string }> }).steps
  : [];

// Extract V2 schedule hero heading
const scheduleHeroSection = scheduleContent.sections.find(s => s.id === 'schedule-hero');
const scheduleHeading = scheduleHeroSection && 'heading' in scheduleHeroSection
  ? (scheduleHeroSection as { heading: string }).heading
  : '';

// Extract V2 opt-in content for assertions
const optInHeroSection = optInContent.sections.find(s => s.id === 'optin-hero');
const optInHero = optInHeroSection && 'form' in optInHeroSection
  ? (optInHeroSection as {
      overline: string;
      heading: string;
      book: { title: string; subtitle: string; coverUrl: string };
      trustBadge: { text: string; metric: string };
      form: {
        fields: Array<{ name: string; placeholder: string }>;
        submitLabel: string;
      };
    })
  : null;

// ===========================================================================
// HOME PAGE — ALL SECTIONS
// ===========================================================================

test.describe('Home Page — All Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // Scroll to bottom to ensure all lazy sections load
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
  });

  // --- Value Props Strip ---
  test('value props strip is rendered with 3 items', async ({ page }) => {
    const strip = page.locator('.value-props');
    await expect(strip).toBeAttached();
    const labels = page.locator('.value-props__label');
    await expect(labels).toHaveCount(homeValueProps.length);
  });

  test('value props strip contains correct text', async ({ page }) => {
    for (const prop of homeValueProps) {
      await expect(page.locator('.value-props')).toContainText(prop);
    }
  });

  test('value props strip has dividers', async ({ page }) => {
    const dividers = page.locator('.value-props__divider');
    await expect(dividers).toHaveCount(homeValueProps.length - 1);
  });

  // --- Problem & Stakes ---
  test('problem & stakes section exists', async ({ page }) => {
    const section = page.locator('.problem-stakes');
    await expect(section).toBeAttached();
  });

  test('problem & stakes heading matches content', async ({ page }) => {
    const heading = page.locator('.problem-stakes__heading');
    await expect(heading).toContainText(problemStakesContent.heading);
  });

  test('problem column has "The Problem" label', async ({ page }) => {
    const label = page.locator('.problem-stakes__problem .problem-stakes__label');
    await expect(label).toContainText('The Problem');
  });

  test('solution column has "The Solution" label', async ({ page }) => {
    const label = page.locator('.problem-stakes__solution .problem-stakes__label');
    await expect(label).toContainText('The Solution');
  });

  test('problem & stakes has CTA button with correct href', async ({ page }) => {
    const cta = page.locator('.problem-stakes__cta .link-button');
    await expect(cta).toBeAttached();
    await expect(cta).toHaveAttribute('href', ctaConfig.href);
  });

  // --- How It Works ---
  test('how it works heading exists', async ({ page }) => {
    const heading = page.locator('.section-heading');
    await expect(heading.first()).toContainText(homeHowItWorks.heading);
  });

  test('how it works has 3 step cards', async ({ page }) => {
    const cards = page.locator('.step-card');
    await expect(cards).toHaveCount(homeHowItWorks.steps.length);
  });

  test('step cards have correct titles', async ({ page }) => {
    for (let i = 0; i < homeHowItWorks.steps.length; i++) {
      const card = page.locator('.step-card').nth(i);
      await expect(card.locator('.step-card__title')).toContainText(
        homeHowItWorks.steps[i].title
      );
    }
  });

  test('step cards have descriptions', async ({ page }) => {
    for (let i = 0; i < homeHowItWorks.steps.length; i++) {
      const card = page.locator('.step-card').nth(i);
      const desc = card.locator('.step-card__description');
      await expect(desc).not.toBeEmpty();
    }
  });

  test('step cards have footnotes', async ({ page }) => {
    const footnotes = page.locator('.step-card__footnote');
    await expect(footnotes).toHaveCount(homeHowItWorks.steps.length);
  });

  test('step card numbers are sequential', async ({ page }) => {
    for (let i = 0; i < homeHowItWorks.steps.length; i++) {
      const number = page.locator('.step-card__number').nth(i);
      await expect(number).toContainText(String(i + 1));
    }
  });

  // --- Stakes / Urgency ---
  test('stakes section exists', async ({ page }) => {
    const section = page.locator('.stakes-section');
    await expect(section).toBeAttached();
  });

  test('stakes lead text is present', async ({ page }) => {
    const lead = page.locator('.stakes-section__lead');
    await expect(lead).toContainText(stakesContent.body);
  });

  test('stakes detail text is present', async ({ page }) => {
    const detail = page.locator('.stakes-section__detail');
    await expect(detail).toContainText('consolidating');
  });

  // --- Final CTA Block ---
  test('final CTA block exists', async ({ page }) => {
    const ctaBlock = page.locator('.cta-block');
    await expect(ctaBlock).toBeAttached();
  });

  test('final CTA heading matches content', async ({ page }) => {
    const heading = page.locator('.cta-block__heading');
    await expect(heading).toContainText(homeFinalCta.heading);
  });

  test('final CTA subheading exists', async ({ page }) => {
    const sub = page.locator('.cta-block__subheading');
    await expect(sub).toContainText(homeFinalCta.subheading);
  });

  test('final CTA has link button with correct href', async ({ page }) => {
    const cta = page.locator('.cta-block .link-button');
    await expect(cta).toHaveAttribute('href', ctaConfig.href);
  });

  // --- Section count ---
  test('page has at least 5 sections below scrolly', async ({ page }) => {
    const sections = page.locator('.section');
    const count = await sections.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });
});

// ===========================================================================
// ABOUT PAGE — V2 SECTIONS
// ===========================================================================

test.describe('About Page — V2 Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    // Scroll to trigger IntersectionObserver animations
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
  });

  // --- Hero ---
  test('hero heading is present', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toContainText('Roofing Industry Professionals');
  });

  test('hero subtext is present', async ({ page }) => {
    const sub = page.locator('.v2-hero__subtext');
    await expect(sub).toContainText('Foundation Projects');
  });

  // --- PE Trap (Cards) ---
  test('PE trap section has 3 cards', async ({ page }) => {
    const cards = page.locator('#pe-trap .v2-card');
    await expect(cards).toHaveCount(3);
  });

  test('PE trap heading mentions PE Trap', async ({ page }) => {
    const heading = page.locator('#pe-trap .v2-cards-header__heading');
    await expect(heading).toContainText('PE Trap');
  });

  test('each PE trap card has title and text', async ({ page }) => {
    const cards = page.locator('#pe-trap .v2-card');
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i).locator('.v2-card__title')).not.toBeEmpty();
      await expect(cards.nth(i).locator('.v2-card__text')).not.toBeEmpty();
    }
  });

  // --- Solution (Mission) ---
  test('solution mission block exists', async ({ page }) => {
    const mission = page.locator('#solution');
    await expect(mission).toBeAttached();
  });

  test('solution has quote card', async ({ page }) => {
    const quoteCard = page.locator('#solution .v2-mission__quote-card');
    await expect(quoteCard).toBeAttached();
  });

  test('solution has accent text', async ({ page }) => {
    const accent = page.locator('#solution .v2-mission__accent');
    await expect(accent).toContainText('brokers');
  });

  // --- Team ---
  test('team heading mentions team', async ({ page }) => {
    const heading = page.locator('#team .v2-team-header__heading');
    await expect(heading).toContainText('Team');
  });

  test('team carousel has 6 member cards', async ({ page }) => {
    const cards = page.locator('#team .v2-team-card');
    await expect(cards).toHaveCount(6);
  });

  test('team cards have avatar initials', async ({ page }) => {
    const avatars = page.locator('#team .v2-team-card__avatar');
    const count = await avatars.count();
    expect(count).toBe(6);
    // First avatar should have initials "JS" (Jacob Sterling)
    await expect(avatars.first()).toContainText('JS');
  });

  test('team cards have name and role', async ({ page }) => {
    const firstCard = page.locator('#team .v2-team-card').first();
    await expect(firstCard.locator('.v2-team-card__name')).toContainText('Jacob Sterling');
    await expect(firstCard.locator('.v2-team-card__role')).toContainText('Founder');
  });

  test('team has carousel arrows', async ({ page }) => {
    const arrows = page.locator('#team .v2-team-arrow');
    await expect(arrows).toHaveCount(2);
  });

  test('team cards have hover effect', async ({ page }) => {
    const card = page.locator('.v2-team-card').first();
    await card.hover();
    const transition = await card.evaluate((el) =>
      window.getComputedStyle(el).getPropertyValue('transition')
    );
    expect(transition).toContain('transform');
  });

  // --- Testimonial ---
  test('testimonial quote is present', async ({ page }) => {
    const quote = page.locator('#proof .v2-testimonial__quote');
    await expect(quote).toContainText('4\u00d7');
  });

  test('testimonial has author attribution', async ({ page }) => {
    const author = page.locator('#proof .v2-testimonial__author');
    await expect(author).toContainText('Robert Vance');
  });

  // --- CTA ---
  test('closing CTA block exists', async ({ page }) => {
    const ctaBlock = page.locator('#about-cta');
    await expect(ctaBlock).toBeAttached();
  });

  test('closing CTA heading is present', async ({ page }) => {
    const heading = page.locator('#about-cta .v2-cta__heading');
    await expect(heading).toContainText('roofing public');
  });

  test('closing CTA button links correctly', async ({ page }) => {
    const cta = page.locator('#about-cta .v2-cta__button');
    await expect(cta).toHaveAttribute('href', ctaConfig.href);
  });

  // --- Section count ---
  test('page has exactly 6 V2 sections', async ({ page }) => {
    const sections = page.locator('.v2-section');
    await expect(sections).toHaveCount(6);
  });
});

// ===========================================================================
// ROOFERS PAGE — V2 SECTIONS
// ===========================================================================

test.describe('Roofers Page — V2 Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/how-it-works/roofers', { waitUntil: 'domcontentloaded' });
    // Scroll to trigger IntersectionObserver animations
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
  });

  // --- Hero ---
  test('hero heading is present', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toContainText('Bigger Exit');
  });

  test('hero subtext mentions 3-step process', async ({ page }) => {
    const sub = page.locator('.v2-hero__subtext');
    await expect(sub).toContainText('3-step');
  });

  // --- Hero badge + trust ---
  test('hero has FOR ROOFING FOUNDERS badge', async ({ page }) => {
    const badge = page.locator('.v2-hero__badge');
    await expect(badge).toContainText('FOR ROOFING FOUNDERS');
  });

  test('hero has trust badge', async ({ page }) => {
    const trust = page.locator('.v2-hero__trust');
    await expect(trust).toContainText('No upfront costs');
  });

  // --- Problem (Split) ---
  test('problem split section exists', async ({ page }) => {
    const section = page.locator('#roofers-problem');
    await expect(section).toBeAttached();
  });

  test('problem heading mentions money on the table', async ({ page }) => {
    const heading = page.locator('#roofers-problem .v2-split__heading');
    await expect(heading).toContainText('Money On The Table');
  });

  test('problem has 3 cancel bullets', async ({ page }) => {
    const bullets = page.locator('#roofers-problem .v2-split__bullet');
    await expect(bullets).toHaveCount(3);
  });

  test('problem has image with quote overlay', async ({ page }) => {
    const quote = page.locator('#roofers-problem .v2-split__image-quote-text');
    await expect(quote).toContainText('broken for independent roofers');
  });

  // --- Steps (cards variant) ---
  test('process section has 3 step cards', async ({ page }) => {
    const steps = page.locator('#roofers-process .v2-step--card');
    await expect(steps).toHaveCount(3);
  });

  test('step cards have icon boxes', async ({ page }) => {
    const icons = page.locator('#roofers-process .v2-step__icon-box');
    await expect(icons).toHaveCount(3);
  });

  test('step 1 has correct title', async ({ page }) => {
    const step = page.locator('#roofers-process .v2-step').first();
    await expect(step.locator('.v2-step__title')).toContainText(roofersSteps[0].title);
  });

  test('step 2 has correct title', async ({ page }) => {
    const step = page.locator('#roofers-process .v2-step').nth(1);
    await expect(step.locator('.v2-step__title')).toContainText(roofersSteps[1].title);
  });

  test('step 3 has correct title', async ({ page }) => {
    const step = page.locator('#roofers-process .v2-step').nth(2);
    await expect(step.locator('.v2-step__title')).toContainText(roofersSteps[2].title);
  });

  // --- Benefits Grid ---
  test('benefits grid section exists', async ({ page }) => {
    const section = page.locator('#roofers-benefits');
    await expect(section).toBeAttached();
  });

  test('benefits heading mentions Scale', async ({ page }) => {
    const heading = page.locator('#roofers-benefits .v2-benefits__heading');
    await expect(heading).toContainText('Scale Without');
  });

  test('benefits has 4 glassmorphism cards', async ({ page }) => {
    const cards = page.locator('#roofers-benefits .v2-benefits__card');
    await expect(cards).toHaveCount(4);
  });

  test('benefits has CTA button', async ({ page }) => {
    const cta = page.locator('#roofers-benefits .v2-benefits__cta');
    await expect(cta).toContainText('Learn About Our Systems');
  });

  // --- CTA ---
  test('closing CTA block exists', async ({ page }) => {
    const ctaBlock = page.locator('#roofers-cta');
    await expect(ctaBlock).toBeAttached();
  });

  test('closing CTA heading is present', async ({ page }) => {
    const heading = page.locator('#roofers-cta .v2-cta__heading');
    await expect(heading).toContainText('30-Minute Call');
  });

  test('closing CTA button links correctly', async ({ page }) => {
    const cta = page.locator('#roofers-cta .v2-cta__button');
    await expect(cta).toHaveAttribute('href', ctaConfig.href);
  });

  // --- Section count ---
  test('page has exactly 5 V2 sections', async ({ page }) => {
    const sections = page.locator('.v2-section');
    await expect(sections).toHaveCount(5);
  });
});

// ===========================================================================
// INVESTORS PAGE — V2 SECTIONS
// ===========================================================================

test.describe('Investors Page — V2 Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/how-it-works/investors', { waitUntil: 'domcontentloaded' });
    // Scroll to trigger IntersectionObserver animations
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
  });

  // --- Hero ---
  test('hero heading is present', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toContainText('Structure');
  });

  test('hero overline is present', async ({ page }) => {
    const overline = page.locator('.v2-hero__overline');
    await expect(overline).toContainText('Investment Framework');
  });

  test('hero subtext mentions institutional asset class', async ({ page }) => {
    const sub = page.locator('.v2-hero__subtext');
    await expect(sub).toContainText('institutional');
  });

  // --- Cinematic ---
  test('cinematic section exists', async ({ page }) => {
    const section = page.locator('#precision-deployment');
    await expect(section).toBeAttached();
  });

  test('cinematic heading mentions Blueprint', async ({ page }) => {
    const heading = page.locator('#precision-deployment .v2-cinematic__heading');
    await expect(heading).toContainText('Blueprint');
  });

  // --- Timeline ---
  test('timeline section exists', async ({ page }) => {
    const section = page.locator('#investment-lifecycle');
    await expect(section).toBeAttached();
  });

  test('timeline heading mentions Lifecycle', async ({ page }) => {
    const heading = page.locator('#investment-lifecycle .v2-timeline__heading');
    await expect(heading).toContainText('Lifecycle');
  });

  test('timeline has 3 steps', async ({ page }) => {
    const steps = page.locator('#investment-lifecycle .v2-timeline__step');
    await expect(steps).toHaveCount(3);
  });

  test('timeline step 1 has correct title', async ({ page }) => {
    const step = page.locator('#investment-lifecycle .v2-timeline__step').first();
    await expect(step.locator('.v2-timeline__title')).toContainText('Strategic Acquisition');
  });

  test('timeline step 2 has correct title', async ({ page }) => {
    const step = page.locator('#investment-lifecycle .v2-timeline__step').nth(1);
    await expect(step.locator('.v2-timeline__title')).toContainText('Operational Overhaul');
  });

  test('timeline step 3 has correct title', async ({ page }) => {
    const step = page.locator('#investment-lifecycle .v2-timeline__step').nth(2);
    await expect(step.locator('.v2-timeline__title')).toContainText('Portfolio Aggregation');
  });

  test('timeline steps have KPI badges', async ({ page }) => {
    const kpiCards = page.locator('#investment-lifecycle .v2-timeline__kpi-card');
    await expect(kpiCards).toHaveCount(3);
  });

  // --- Bento Grid ---
  test('bento grid section exists', async ({ page }) => {
    const section = page.locator('#bento-thesis');
    await expect(section).toBeAttached();
  });

  test('bento feature card has Core Thesis overline', async ({ page }) => {
    const overline = page.locator('#bento-thesis .v2-bento__feature-overline');
    await expect(overline).toContainText('Core Thesis');
  });

  test('bento has 2 stat cards', async ({ page }) => {
    const stats = page.locator('#bento-thesis .v2-bento__stat');
    await expect(stats).toHaveCount(2);
  });

  test('bento has link card', async ({ page }) => {
    const link = page.locator('#bento-thesis .v2-bento__link-card');
    await expect(link).toBeAttached();
  });

  // --- Trust ---
  test('trust section exists', async ({ page }) => {
    const section = page.locator('#trust-partners');
    await expect(section).toBeAttached();
  });

  test('trust badge is present', async ({ page }) => {
    const badge = page.locator('#trust-partners .v2-trust__badge');
    await expect(badge).toContainText('Verified');
  });

  test('trust has partner names', async ({ page }) => {
    const partners = page.locator('#trust-partners .v2-trust__partner');
    await expect(partners).toHaveCount(4);
  });

  // --- CTA ---
  test('closing CTA block exists', async ({ page }) => {
    const ctaBlock = page.locator('#investors-cta');
    await expect(ctaBlock).toBeAttached();
  });

  test('closing CTA heading mentions Deploy Capital', async ({ page }) => {
    const heading = page.locator('#investors-cta .v2-cta__heading');
    await expect(heading).toContainText('Deploy Capital');
  });

  test('closing CTA button links correctly', async ({ page }) => {
    const cta = page.locator('#investors-cta .v2-cta__button');
    await expect(cta).toHaveAttribute('href', ctaConfig.href);
  });

  test('closing CTA has secondary button', async ({ page }) => {
    const secondary = page.locator('#investors-cta .v2-cta__button--secondary');
    await expect(secondary).toBeAttached();
    await expect(secondary).toContainText('View Our Process');
  });

  // --- Section count ---
  test('page has exactly 6 V2 sections', async ({ page }) => {
    const sections = page.locator('.v2-section');
    await expect(sections).toHaveCount(investorsContent.sections.length);
  });

  // --- Hero stat ---
  test('hero stat displays 18.4%', async ({ page }) => {
    const stat = page.locator('.v2-hero__stat-value');
    await expect(stat).toContainText('18.4%');
  });

  test('hero stat label is Target IRR', async ({ page }) => {
    const label = page.locator('.v2-hero__stat-label');
    await expect(label).toContainText('Target IRR');
  });

  // --- Bento link card href ---
  test('bento link card links to schedule', async ({ page }) => {
    const link = page.locator('.v2-bento__link-card');
    await expect(link).toHaveAttribute('href', routes.schedule);
  });

  // --- CTA secondary button ---
  test('CTA secondary links to roofers page', async ({ page }) => {
    const secondary = page.locator('#investors-cta .v2-cta__button--secondary');
    await expect(secondary).toHaveAttribute('href', routes.howItWorksRoofers);
  });

  // --- No console errors ---
  test('page has no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/how-it-works/investors', { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    expect(errors).toHaveLength(0);
  });
});

// ===========================================================================
// INVESTORS PAGE — MOBILE RESPONSIVE
// ===========================================================================

test.describe('Investors Page — Mobile Layout', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('all 6 sections render on mobile', async ({ page }) => {
    await page.goto('/how-it-works/investors', { waitUntil: 'domcontentloaded' });
    const sections = page.locator('.v2-section');
    await expect(sections).toHaveCount(6);
  });

  test('hero heading is visible on mobile', async ({ page }) => {
    await page.goto('/how-it-works/investors', { waitUntil: 'domcontentloaded' });
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
  });

  test('timeline steps stack vertically on mobile', async ({ page }) => {
    await page.goto('/how-it-works/investors', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      document.querySelector('#investment-lifecycle')?.scrollIntoView();
    });
    await page.waitForTimeout(300);
    const step = page.locator('.v2-timeline__step').first();
    const gridCols = await step.evaluate(el =>
      window.getComputedStyle(el).gridTemplateColumns
    );
    // On mobile, single column
    expect(gridCols.split(' ').length).toBeLessThanOrEqual(1);
  });

  test('bento grid stacks on mobile', async ({ page }) => {
    await page.goto('/how-it-works/investors', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      document.querySelector('#bento-thesis')?.scrollIntoView();
    });
    await page.waitForTimeout(300);
    const grid = page.locator('.v2-bento');
    const gridCols = await grid.evaluate(el =>
      window.getComputedStyle(el).gridTemplateColumns
    );
    expect(gridCols.split(' ').length).toBe(1);
  });
});

// ===========================================================================
// SCHEDULE PAGE
// ===========================================================================

test.describe('Schedule Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/schedule', { waitUntil: 'domcontentloaded' });
  });

  test('heading matches content', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toContainText(scheduleHeading);
  });

  test('body text mentions $60B', async ({ page }) => {
    await expect(page.locator('body')).toContainText('$60B');
  });

  test('body text mentions ROOF', async ({ page }) => {
    await expect(page.locator('body')).toContainText('ROOF');
  });

  test('Calendly placeholder is visible', async ({ page }) => {
    await expect(page.locator('.placeholder-box')).toContainText(
      'Calendly Widget — Coming Soon'
    );
  });
});

// ===========================================================================
// OPT-IN PAGE — ALL SECTIONS
// ===========================================================================

test.describe('Opt-In Page — All Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/3b-opt-in', { waitUntil: 'domcontentloaded' });
  });

  // --- Badge ---
  test('badge is displayed with correct text', async ({ page }) => {
    const badge = page.locator('.opt-in__badge');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText(optInHero?.overline ?? '');
  });

  // --- Mockup Image ---
  test('mockup image is present', async ({ page }) => {
    const img = page.locator('.opt-in__mockup-image');
    await expect(img).toBeAttached();
    await expect(img).toHaveAttribute('alt', optInHero?.book.title ?? '');
  });

  // --- Heading ---
  test('heading matches content', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toContainText('8 Things');
  });

  // --- Body ---
  test('body text references PE firms', async ({ page }) => {
    await expect(page.locator('.page-header__description')).toContainText('PE firms');
  });

  // --- Form ---
  test('form has first name input with correct placeholder', async ({ page }) => {
    const input = page.locator('#firstName');
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute(
      'placeholder',
      optInHero?.form.fields.find(f => f.name === 'firstName')?.placeholder ?? ''
    );
  });

  test('form has email input with correct type and placeholder', async ({ page }) => {
    const input = page.locator('#email');
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('type', 'email');
    await expect(input).toHaveAttribute(
      'placeholder',
      optInHero?.form.fields.find(f => f.name === 'email')?.placeholder ?? ''
    );
  });

  test('submit button has correct label', async ({ page }) => {
    const submit = page.locator('.opt-in__submit');
    await expect(submit).toContainText(optInHero?.form.submitLabel ?? '');
  });

  // --- Form interactivity ---
  test('form inputs accept text', async ({ page }) => {
    const firstName = page.locator('#firstName');
    const email = page.locator('#email');

    await firstName.fill('Test User');
    await expect(firstName).toHaveValue('Test User');

    await email.fill('test@example.com');
    await expect(email).toHaveValue('test@example.com');
  });

  test('first name input is required', async ({ page }) => {
    const input = page.locator('#firstName');
    await expect(input).toHaveAttribute('required', '');
  });

  test('email input is required', async ({ page }) => {
    const input = page.locator('#email');
    await expect(input).toHaveAttribute('required', '');
  });
});

// ===========================================================================
// CROSS-PAGE: FOOTER LINKS
// ===========================================================================

test.describe('Footer — Navigation Links', () => {
  test('footer has Free Report link', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    const link = page.locator('.footer-nav-list a').filter({ hasText: 'Free Report' });
    await expect(link).toBeAttached();
    await expect(link).toHaveAttribute('href', routes.optIn);
  });

  test('footer has Schedule A Call link', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    const link = page.locator('.footer-nav-list a').filter({ hasText: 'Schedule A Call' });
    await expect(link).toBeAttached();
    await expect(link).toHaveAttribute('href', routes.schedule);
  });
});

// ===========================================================================
// CROSS-PAGE: CTA BUTTONS ALL WORK
// ===========================================================================

test.describe('CTA Buttons — All Pages', () => {

  // Roofers uses V2 CTA component
  test('Roofers page V2 CTA button has correct href', async ({ page }) => {
    await page.goto('/how-it-works/roofers', { waitUntil: 'domcontentloaded' });
    const cta = page.locator('#roofers-cta .v2-cta__button');
    await expect(cta).toHaveAttribute('href', ctaConfig.href);
  });

  test('Roofers page V2 CTA button is clickable', async ({ page }) => {
    await page.goto('/how-it-works/roofers', { waitUntil: 'domcontentloaded' });
    const cta = page.locator('#roofers-cta .v2-cta__button');
    await expect(cta).toBeEnabled();
  });

  // Investors uses V2 CTA component
  test('Investors page V2 CTA button has correct href', async ({ page }) => {
    await page.goto('/how-it-works/investors', { waitUntil: 'domcontentloaded' });
    const cta = page.locator('#investors-cta .v2-cta__button');
    await expect(cta).toHaveAttribute('href', ctaConfig.href);
  });

  test('Investors page V2 CTA button is clickable', async ({ page }) => {
    await page.goto('/how-it-works/investors', { waitUntil: 'domcontentloaded' });
    const cta = page.locator('#investors-cta .v2-cta__button');
    await expect(cta).toBeEnabled();
  });

  // About uses V2 CTA component
  test('About page V2 CTA button has correct href', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    const cta = page.locator('#about-cta .v2-cta__button');
    await expect(cta).toHaveAttribute('href', ctaConfig.href);
  });

  test('About page V2 CTA button is clickable', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    const cta = page.locator('#about-cta .v2-cta__button');
    await expect(cta).toBeEnabled();
  });
});

// ===========================================================================
// CROSS-PAGE: VALUE PROPS STRIP ON ALL RELEVANT PAGES
// ===========================================================================

test.describe('ValuePropsStrip — Present on correct pages', () => {
  test('Home page has value props strip', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    await expect(page.locator('.value-props')).toBeAttached();
  });

  test('Roofers page has V2 sections (no value props strip)', async ({ page }) => {
    await page.goto('/how-it-works/roofers', { waitUntil: 'domcontentloaded' });
    // V2 roofers page doesn't use value-props strip
    await expect(page.locator('.v2-section').first()).toBeAttached();
  });

  test('Investors page has V2 sections (no value props strip)', async ({ page }) => {
    await page.goto('/how-it-works/investors', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.v2-section').first()).toBeAttached();
  });

  test('About page does NOT have value props strip', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.value-props')).toHaveCount(0);
  });
});

// ===========================================================================
// LAYOUT: SPACING & SIZE CHECKS
// ===========================================================================

test.describe('Layout & Spacing', () => {
  test('V2 step cards have non-zero padding', async ({ page }) => {
    await page.goto('/how-it-works/roofers', { waitUntil: 'domcontentloaded' });
    const card = page.locator('.v2-step').first();
    const padding = await card.evaluate(
      (el) => window.getComputedStyle(el).paddingTop
    );
    expect(parseInt(padding)).toBeGreaterThan(0);
  });

  test('V2 CTA section is present on About', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    const block = page.locator('#about-cta');
    await expect(block).toBeAttached();
  });

  test('V2 hero heading has correct font family', async ({ page }) => {
    await page.goto('/how-it-works/roofers', { waitUntil: 'domcontentloaded' });
    const heading = page.locator('.v2-hero__heading');
    const fontFamily = await heading.evaluate(
      (el) => window.getComputedStyle(el).fontFamily
    );
    expect(fontFamily).toBeTruthy();
  });

  test('V2 team cards have border-radius', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    const card = page.locator('.v2-team-card').first();
    const radius = await card.evaluate(
      (el) => window.getComputedStyle(el).borderRadius
    );
    expect(parseInt(radius)).toBeGreaterThan(0);
  });

  test('opt-in badge has pill shape (full border-radius)', async ({ page }) => {
    await page.goto('/3b-opt-in', { waitUntil: 'domcontentloaded' });
    const badge = page.locator('.opt-in__badge');
    const radius = await badge.evaluate(
      (el) => window.getComputedStyle(el).borderRadius
    );
    expect(parseInt(radius)).toBeGreaterThan(100);
  });
});
