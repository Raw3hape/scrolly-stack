import { describe, expect, it } from 'vitest';
import { routes, navLinks, ctaConfig, brandConfig } from '@/config/nav';

describe('navigation config', () => {
  it('all nav links reference defined routes', () => {
    const routeValues = new Set(Object.values(routes));
    for (const link of navLinks) {
      expect(routeValues.has(link.href)).toBe(true);
    }
  });

  it('CTA href is a valid route', () => {
    const routeValues = new Set(Object.values(routes));
    expect(routeValues.has(ctaConfig.href)).toBe(true);
  });

  it('CTA has a label', () => {
    expect(ctaConfig.label).toBeTruthy();
  });

  it('brand config has required fields', () => {
    expect(brandConfig.wordmark).toBeTruthy();
    expect(brandConfig.logo).toBeTruthy();
  });

  it('all routes start with /', () => {
    for (const route of Object.values(routes)) {
      expect(route.startsWith('/')).toBe(true);
    }
  });

  it('nav links have no duplicates', () => {
    const hrefs = navLinks.map((l) => l.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});
