/**
 * Shared Content — Foundation Projects
 *
 * Content shared across all pages (footer, etc.).
 */

import type { FooterContent } from '../types';
import { routes } from '../nav';

export const footerContent: FooterContent = {
  brandDescription:
    'Redefining roofing as an institutional-grade asset class. Building permanent value through architectural excellence.',
  columns: [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: routes.about },
        { label: 'Investor Relations', href: routes.howItWorksInvestors },
        { label: 'Partnerships', href: routes.howItWorksRoofers },
        { label: 'Contact', href: routes.schedule },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Compliances', href: '#' },
      ],
    },
  ],
  subscribeText: 'Quarterly insights on the roofing asset class.',
  subscribeTitle: 'Stay Informed',
  subscribePlaceholder: 'Email Address',
  copyrightTagline: 'Architectural Integrity in Roofing.',
};
