/**
 * Site-wide configuration — Foundation Projects
 * 
 * Central source of truth for site name, URLs, and defaults.
 * Used by layout, metadata, footer, and SEO components.
 */
export const siteConfig = {
  name: 'Foundation Projects',
  tagline: 'We Take Roofing Companies Public',
  url: 'https://foundationprojects.com',
  description: 'We\'re building a roofing company that goes public. Best-in-class operators get 7–10× what PE would pay.',
  copyright: `© ${new Date().getFullYear()} Foundation Projects. All rights reserved.`,
} as const;
