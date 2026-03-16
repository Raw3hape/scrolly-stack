/**
 * Site-wide configuration — Foundation Projects
 * 
 * Central source of truth for site name, URLs, and defaults.
 * Used by layout, metadata, footer, and SEO components.
 */
export const siteConfig = {
  name: 'Foundation Projects',
  tagline: 'Roofing Consulting',
  url: 'https://foundationprojects.com',
  description: 'We install CRM, marketing, and ops systems that transform roofing companies into premium sellable businesses.',
  copyright: `© ${new Date().getFullYear()} Foundation Projects. All rights reserved.`,
} as const;
