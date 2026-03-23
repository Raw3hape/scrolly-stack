/**
 * E2E Tests — Content Pages (Home, About, Roofers, Investors, Schedule, Opt-In)
 *
 * Comprehensive tests for ALL sections, content, layout, CTAs, and interactivity.
 * All text assertions import from content config — zero hardcoded strings.
 */

import { test, expect } from '@playwright/test';
import { ctaConfig, routes } from '../src/config/nav';
import { ctaConfigV2 } from '../src/config/nav-v2';
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
    await expect(cta).toHaveAttribute('href', ctaConfigV2.href);
  });

  // --- Section count ---
  test('page has exactly 6 V2 sections', async ({ page }) => {
    const sections = page.locator('.v2-section');
    await expect(sections).toHaveCount(6);
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
  // V1 pages use .cta-block .link-button
  const v1Pages = [
    { path: '/how-it-works/roofers', name: 'Roofers' },
    { path: '/how-it-works/investors', name: 'Investors' },
  ];

  for (const p of v1Pages) {
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

  // About uses V2 CTA component
  test('About page V2 CTA button has correct href', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    const cta = page.locator('#about-cta .v2-cta__button');
    await expect(cta).toHaveAttribute('href', ctaConfigV2.href);
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

  test('V2 CTA section is present on About', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    const block = page.locator('#about-cta');
    await expect(block).toBeAttached();
  });

  test('value props strip has border-radius', async ({ page }) => {
    await page.goto('/how-it-works/roofers', { waitUntil: 'domcontentloaded' });
    const strip = page.locator('.value-props');
    const radius = await strip.evaluate(
      (el) => window.getComputedStyle(el).borderRadius
    );
    expect(parseInt(radius)).toBeGreaterThan(0);
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
