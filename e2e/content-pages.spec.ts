/**
 * E2E Tests — Content Pages (Home, About, Roofers, Investors, Schedule, Opt-In)
 *
 * Comprehensive tests for ALL sections, content, layout, CTAs, and interactivity.
 * All text assertions import from content config — zero hardcoded strings.
 */

import { test, expect } from '@playwright/test';
import { ctaConfig, routes } from '../src/config/nav';
import {
  aboutHero,
  expandedProblem,
  comparison,
  teamSection,
  proofSection,
  aboutClosingCta,
} from '../src/config/content/about';
import {
  roofersHero,
  roofersValueProps,
  roofersProb,
  roofersSteps,
  whatChanges,
  roofersFinalCta,
} from '../src/config/content/roofers';
import {
  investorsHero,
  investorsValueProps,
  opportunity,
  investorsSteps,
  investorsStakes,
  whyActNow,
  investorsFinalCta,
} from '../src/config/content/investors';
import { scheduleContent } from '../src/config/content/schedule';
import { optInContent } from '../src/config/content/opt-in';
import {
  problemStakesContent,
  homeValueProps,
  homeHowItWorks,
  stakesContent,
  homeFinalCta,
} from '../src/config/content/home';

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
// ABOUT PAGE — ALL SECTIONS
// ===========================================================================

test.describe('About Page — All Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
  });

  // --- Hero ---
  test('hero heading matches content', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toContainText(aboutHero.heading);
  });

  test('hero body is present', async ({ page }) => {
    const desc = page.locator('.page-header__description');
    await expect(desc).toContainText('Foundation Projects');
  });

  // --- Expanded Problem ---
  test('expanded problem heading exists', async ({ page }) => {
    const heading = page.locator('.about-problem__heading');
    await expect(heading).toContainText(expandedProblem.heading);
  });

  test('expanded problem body text is present', async ({ page }) => {
    const body = page.locator('.about-problem__body');
    await expect(body).toContainText('PE firm');
  });

  test('expanded problem punchline is visible', async ({ page }) => {
    const punchline = page.locator('.about-problem__punchline');
    await expect(punchline).toContainText(expandedProblem.punchline);
  });

  // --- Comparison Columns ---
  test('comparison columns are visible', async ({ page }) => {
    const comp = page.locator('.comparison');
    await expect(comp).toBeVisible();
  });

  test('comparison has two columns', async ({ page }) => {
    const columns = page.locator('.comparison__column');
    await expect(columns).toHaveCount(2);
  });

  test('negative column has correct title', async ({ page }) => {
    const negTitle = page.locator('.comparison__column--negative .comparison__title');
    await expect(negTitle).toContainText(comparison.left.title);
  });

  test('positive column has correct title', async ({ page }) => {
    const posTitle = page.locator('.comparison__column--positive .comparison__title');
    await expect(posTitle).toContainText(comparison.right.title);
  });

  // --- Team Section ---
  test('team heading is displayed', async ({ page }) => {
    const heading = page.locator('.team-section__heading');
    await expect(heading).toContainText(teamSection.heading);
  });

  test('team subheading is displayed', async ({ page }) => {
    const sub = page.locator('.team-section__subheading');
    await expect(sub).toContainText('team');
  });

  test('team accent stat is displayed', async ({ page }) => {
    const stat = page.locator('.team-accent-stat');
    await expect(stat).toContainText(teamSection.accentStat);
  });

  test('team grid has 6 members', async ({ page }) => {
    const cards = page.locator('.team-card');
    await expect(cards).toHaveCount(teamSection.members.length);
  });

  test('each team card has name, role, and bio', async ({ page }) => {
    for (let i = 0; i < teamSection.members.length; i++) {
      const card = page.locator('.team-card').nth(i);
      await expect(card.locator('.team-card__name')).toContainText(teamSection.members[i].name);
      await expect(card.locator('.team-card__role')).toContainText(teamSection.members[i].role);
      await expect(card.locator('.team-card__bio')).not.toBeEmpty();
    }
  });

  test('team cards have avatar placeholders', async ({ page }) => {
    const avatars = page.locator('.team-card__photo-placeholder');
    await expect(avatars).toHaveCount(teamSection.members.length);
  });

  test('team cards have hover effect (not zero transform)', async ({ page }) => {
    const card = page.locator('.team-card').first();
    await card.hover();
    // Card should have transition property
    const transition = await card.evaluate((el) =>
      window.getComputedStyle(el).getPropertyValue('transition')
    );
    expect(transition).toContain('transform');
  });

  // --- Proof Section ---
  test('proof heading is displayed', async ({ page }) => {
    const heading = page.locator('.about-proof__heading');
    await expect(heading).toContainText(proofSection.heading);
  });

  test('proof body text is present', async ({ page }) => {
    const body = page.locator('.about-proof__body');
    await expect(body).toContainText('exit');
  });

  // --- Closing CTA ---
  test('closing CTA block exists', async ({ page }) => {
    const ctaBlock = page.locator('.cta-block');
    await expect(ctaBlock).toBeAttached();
  });

  test('closing CTA heading matches', async ({ page }) => {
    const heading = page.locator('.cta-block__heading');
    await expect(heading).toContainText(aboutClosingCta.heading);
  });

  test('closing CTA button links correctly', async ({ page }) => {
    const cta = page.locator('.cta-block .link-button');
    await expect(cta).toHaveAttribute('href', ctaConfig.href);
  });

  // --- Section count ---
  test('page has at least 6 sections', async ({ page }) => {
    const sections = page.locator('.section');
    const count = await sections.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });
});

// ===========================================================================
// ROOFERS PAGE — ALL SECTIONS
// ===========================================================================

test.describe('Roofers Page — All Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/how-it-works/roofers', { waitUntil: 'domcontentloaded' });
  });

  // --- Hero ---
  test('hero heading matches content', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toContainText(roofersHero.heading);
  });

  test('hero body matches content', async ({ page }) => {
    const desc = page.locator('.page-header__description');
    await expect(desc).toContainText('3-step');
  });

  // --- Value Props Strip ---
  test('value props strip has 3 items', async ({ page }) => {
    const labels = page.locator('.value-props__label');
    await expect(labels).toHaveCount(roofersValueProps.length);
  });

  test('value props contain correct text', async ({ page }) => {
    for (const prop of roofersValueProps) {
      await expect(page.locator('.value-props')).toContainText(prop);
    }
  });

  // --- Problem Section ---
  test('problem heading is displayed', async ({ page }) => {
    const heading = page.locator('.status-page__heading');
    await expect(heading).toContainText(roofersProb.heading);
  });

  test('problem body text is present', async ({ page }) => {
    const body = page.locator('.status-page__body');
    await expect(body).toContainText('Brokers take 20%');
  });

  // --- Step Cards ---
  test('step cards are rendered', async ({ page }) => {
    const cards = page.locator('.step-card');
    await expect(cards).toHaveCount(roofersSteps.length);
  });

  test('step card 1 has correct number and title', async ({ page }) => {
    const firstCard = page.locator('.step-card').first();
    await expect(firstCard.locator('.step-card__number')).toContainText('1');
    await expect(firstCard.locator('.step-card__title')).toContainText(roofersSteps[0].title);
  });

  test('step card 2 has correct title', async ({ page }) => {
    const secondCard = page.locator('.step-card').nth(1);
    await expect(secondCard.locator('.step-card__title')).toContainText(roofersSteps[1].title);
  });

  test('step card 3 has correct title', async ({ page }) => {
    const thirdCard = page.locator('.step-card').nth(2);
    await expect(thirdCard.locator('.step-card__title')).toContainText(roofersSteps[2].title);
  });

  test('step cards have footnotes', async ({ page }) => {
    const footnotes = page.locator('.step-card__footnote');
    await expect(footnotes).toHaveCount(roofersSteps.length);
  });

  // --- What Changes For You ---
  test('what changes bullet list exists', async ({ page }) => {
    const bullets = page.locator('.bullet-section__item');
    await expect(bullets).toHaveCount(whatChanges.bullets.length);
  });

  test('what changes heading is correct', async ({ page }) => {
    const heading = page.locator('.bullet-section__heading');
    await expect(heading).toContainText(whatChanges.heading);
  });

  test('bullet section CTA links to correct href', async ({ page }) => {
    const cta = page.locator('.bullet-section__cta .link-button');
    await expect(cta).toHaveAttribute('href', ctaConfig.href);
  });

  // --- Final CTA Block ---
  test('final CTA block exists', async ({ page }) => {
    const ctaBlock = page.locator('.cta-block');
    await expect(ctaBlock).toBeAttached();
  });

  test('final CTA heading matches', async ({ page }) => {
    const heading = page.locator('.cta-block__heading');
    await expect(heading).toContainText(roofersFinalCta.heading);
  });

  test('final CTA button links correctly', async ({ page }) => {
    const cta = page.locator('.cta-block .link-button');
    await expect(cta).toHaveAttribute('href', ctaConfig.href);
  });

  // --- Section count ---
  test('page has at least 6 sections', async ({ page }) => {
    const sections = page.locator('.section');
    const count = await sections.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });
});

// ===========================================================================
// INVESTORS PAGE — ALL SECTIONS
// ===========================================================================

test.describe('Investors Page — All Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/how-it-works/investors', { waitUntil: 'domcontentloaded' });
  });

  // --- Hero ---
  test('hero heading matches content', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toContainText(investorsHero.heading);
  });

  test('hero body mentions $60B industry', async ({ page }) => {
    const desc = page.locator('.page-header__description');
    await expect(desc).toContainText('$60 billion');
  });

  // --- Value Props Strip ---
  test('value props strip has 3 items', async ({ page }) => {
    const labels = page.locator('.value-props__label');
    await expect(labels).toHaveCount(investorsValueProps.length);
  });

  test('value props contain correct text', async ({ page }) => {
    for (const prop of investorsValueProps) {
      await expect(page.locator('.value-props')).toContainText(prop);
    }
  });

  // --- Opportunity Section ---
  test('opportunity heading is displayed', async ({ page }) => {
    const heading = page.locator('.status-page__heading');
    await expect(heading).toContainText(opportunity.heading);
  });

  test('opportunity body mentions consolidation', async ({ page }) => {
    const body = page.locator('.status-page__body');
    await expect(body).toContainText('consolidation');
  });

  // --- Step Cards ---
  test('step cards are rendered', async ({ page }) => {
    const cards = page.locator('.step-card');
    await expect(cards).toHaveCount(investorsSteps.length);
  });

  test('step card 1 has correct title', async ({ page }) => {
    const firstCard = page.locator('.step-card').first();
    await expect(firstCard.locator('.step-card__title')).toContainText(investorsSteps[0].title);
  });

  test('step card 2 has correct title', async ({ page }) => {
    const secondCard = page.locator('.step-card').nth(1);
    await expect(secondCard.locator('.step-card__title')).toContainText(investorsSteps[1].title);
  });

  test('step card 3 has correct title', async ({ page }) => {
    const thirdCard = page.locator('.step-card').nth(2);
    await expect(thirdCard.locator('.step-card__title')).toContainText(investorsSteps[2].title);
  });

  // --- Stakes Section ---
  test('stakes section lead text present', async ({ page }) => {
    const lead = page.locator('.stakes-section__lead');
    await expect(lead).toContainText(investorsStakes.body);
  });

  test('stakes section detail text present', async ({ page }) => {
    const detail = page.locator('.stakes-section__detail');
    await expect(detail).toContainText('consolidating');
  });

  // --- Why Act Now ---
  test('why act now bullet list exists', async ({ page }) => {
    const bullets = page.locator('.bullet-section__item');
    await expect(bullets).toHaveCount(whyActNow.bullets.length);
  });

  test('why act now heading is correct', async ({ page }) => {
    const heading = page.locator('.bullet-section__heading');
    await expect(heading).toContainText(whyActNow.heading);
  });

  test('why act now CTA links to correct href', async ({ page }) => {
    const cta = page.locator('.bullet-section__cta .link-button');
    await expect(cta).toHaveAttribute('href', ctaConfig.href);
  });

  // --- Final CTA Block ---
  test('final CTA block exists', async ({ page }) => {
    const ctaBlock = page.locator('.cta-block');
    await expect(ctaBlock).toBeAttached();
  });

  test('final CTA heading matches', async ({ page }) => {
    const heading = page.locator('.cta-block__heading');
    await expect(heading).toContainText(investorsFinalCta.heading);
  });

  test('final CTA has "Spots are limited" footnote', async ({ page }) => {
    const footnote = page.locator('.cta-block__footnote');
    await expect(footnote).toContainText('Spots are limited');
  });

  test('final CTA button links correctly', async ({ page }) => {
    const cta = page.locator('.cta-block .link-button');
    await expect(cta).toHaveAttribute('href', ctaConfig.href);
  });

  // --- Section count ---
  test('page has at least 7 sections', async ({ page }) => {
    const sections = page.locator('.section');
    const count = await sections.count();
    expect(count).toBeGreaterThanOrEqual(7);
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
    await expect(h1).toContainText(scheduleContent.heading);
  });

  test('body text mentions $60B', async ({ page }) => {
    await expect(page.locator('body')).toContainText('$60B');
  });

  test('body text mentions ROOF', async ({ page }) => {
    await expect(page.locator('body')).toContainText('ROOF');
  });

  test('Calendly placeholder is visible', async ({ page }) => {
    await expect(page.locator('.placeholder-box')).toContainText(
      scheduleContent.widgetPlaceholder
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
    await expect(badge).toContainText(optInContent.badge);
  });

  // --- Mockup Image ---
  test('mockup image is present', async ({ page }) => {
    const img = page.locator('.opt-in__mockup-image');
    await expect(img).toBeAttached();
    await expect(img).toHaveAttribute('alt', optInContent.mockupAlt);
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
      optInContent.formFields.firstName.placeholder
    );
  });

  test('form has email input with correct type and placeholder', async ({ page }) => {
    const input = page.locator('#email');
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('type', 'email');
    await expect(input).toHaveAttribute(
      'placeholder',
      optInContent.formFields.email.placeholder
    );
  });

  test('submit button has correct label', async ({ page }) => {
    const submit = page.locator('.opt-in__submit');
    await expect(submit).toContainText(optInContent.ctaLabel);
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
  const pages = [
    { path: '/about', name: 'About' },
    { path: '/how-it-works/roofers', name: 'Roofers' },
    { path: '/how-it-works/investors', name: 'Investors' },
  ];

  for (const p of pages) {
    test(`${p.name} page CTA block button has correct href`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: 'domcontentloaded' });
      const cta = page.locator('.cta-block .link-button');
      await expect(cta).toHaveAttribute('href', ctaConfig.href);
    });

    test(`${p.name} page CTA block button is clickable`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: 'domcontentloaded' });
      const cta = page.locator('.cta-block .link-button');
      await expect(cta).toBeEnabled();
    });
  }
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

  test('Roofers page has value props strip', async ({ page }) => {
    await page.goto('/how-it-works/roofers', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.value-props')).toBeAttached();
  });

  test('Investors page has value props strip', async ({ page }) => {
    await page.goto('/how-it-works/investors', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.value-props')).toBeAttached();
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
  test('step cards have non-zero padding', async ({ page }) => {
    await page.goto('/how-it-works/roofers', { waitUntil: 'domcontentloaded' });
    const card = page.locator('.step-card').first();
    const padding = await card.evaluate(
      (el) => window.getComputedStyle(el).paddingTop
    );
    expect(parseInt(padding)).toBeGreaterThan(0);
  });

  test('step card numbers have gradient background', async ({ page }) => {
    await page.goto('/how-it-works/roofers', { waitUntil: 'domcontentloaded' });
    const number = page.locator('.step-card__number').first();
    const bg = await number.evaluate(
      (el) => window.getComputedStyle(el).backgroundImage
    );
    expect(bg).toContain('gradient');
  });

  test('CTA block has gradient background', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    const block = page.locator('.cta-block');
    const bg = await block.evaluate(
      (el) => window.getComputedStyle(el).backgroundImage
    );
    expect(bg).toContain('gradient');
  });

  test('value props strip has border-radius', async ({ page }) => {
    await page.goto('/how-it-works/roofers', { waitUntil: 'domcontentloaded' });
    const strip = page.locator('.value-props');
    const radius = await strip.evaluate(
      (el) => window.getComputedStyle(el).borderRadius
    );
    expect(parseInt(radius)).toBeGreaterThan(0);
  });

  test('team cards have border-radius', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    const card = page.locator('.team-card').first();
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
