import { describe, expect, it } from 'vitest';
import { aboutContent } from '@/config/content/about';
import { homeContent } from '@/config/content/home-page';
import { investorsContent } from '@/config/content/investors';
import { optInContent } from '@/config/content/opt-in';
import { roofersContent } from '@/config/content/roofers';
import { scheduleContent } from '@/config/content/schedule';
import type { PageContent } from '@/config/types';

const ALL_PAGES: PageContent[] = [
  aboutContent,
  homeContent,
  investorsContent,
  optInContent,
  roofersContent,
  scheduleContent,
];

describe('page content configs', () => {
  for (const page of ALL_PAGES) {
    describe(`${page.slug}`, () => {
      it('has required metadata fields', () => {
        expect(page.metadata.title).toBeTruthy();
        expect(page.metadata.description).toBeTruthy();
        expect(page.slug).toBeTruthy();
      });

      it('has at least one section', () => {
        expect(page.sections.length).toBeGreaterThan(0);
      });

      it('has unique section IDs', () => {
        const ids = page.sections.map((s) => s.id);
        expect(new Set(ids).size).toBe(ids.length);
      });

      it('every section has a type and id', () => {
        for (const section of page.sections) {
          expect(section.type).toBeTruthy();
          expect(section.id).toBeTruthy();
        }
      });
    });
  }
});
