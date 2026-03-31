/**
 * Opt In Page Content — Foundation Projects
 */

import type { PageContent } from '../types';

export const optInContent: PageContent = {
  slug: 'opt-in',
  metadata: {
    title: '8 Things Private Equity Has Wrong About The Roofing Industry | Foundation Projects',
    description:
      'What brokers & private equity firms don\u2019t understand about this $60B industry\u2014 and why it\u2019s costing owners (and investors!) millions. Free instant download.',
  },
  sections: [
    // \u2500\u2500 S1: Opt-In Hero (3D Book + Form) \u2500\u2500
    {
      type: 'opt-in-hero',
      id: 'optin-hero',
      surface: 'base',
      overline: 'FREE, INSTANT DOWNLOAD',
      heading: '8 Things Private Equity Has Wrong About The Roofing Industry',
      subtext:
        'What brokers & private equity firms don\u2019t understand about this $60B industry\u2014 and why it\u2019s costing owners (and investors!) millions.',
      book: {
        title: '8 Things Private Equity Has Wrong',
        subtitle: 'Foundation Projects Architecture',
        coverUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuB5e1C1cLPMEhOxLTQK-CSgouRPZ8vuAJBfLUwmj2-qkiQIPpKRi8nUTR6eetBAtvmSml_qrOKY6qGv_NQEBNrcyUZKO9bLFUHPtL-Rzmk9vKp48hDCz9XO5Jrct_uLuyKXHtPaTi8TVkce_7qhCdHZXs-ZAYB139tTl-0-s53Od7yFZwS5llv17r2tCTQf9bq9ZD6Br_Lc-sN0XKb2p0WdBFXF1PuYziL_JK3vobzu4YFNrYaeLzIPCJ8uA9SlNPV1YtdFlp_jTidD',
      },
      trustBadge: {
        text: 'Industry Verified',
        metric: 'Over 500+ Copies Distributed to Owners',
      },
      form: {
        fields: [
          {
            name: 'firstName',
            label: 'First Name',
            placeholder: 'Jane Doe',
            type: 'text',
            required: true,
          },
          {
            name: 'email',
            label: 'Email',
            placeholder: 'jane@company.com',
            type: 'email',
            required: true,
          },
        ],
        submitLabel: 'Get Instant Access - FREE',
        disclaimer: 'Your data is secure. Architectural integrity in everything we do.',
      },
      valueProps: [
        {
          icon: 'chart-bar',
          title: 'Valuation Gaps',
          text: 'Why current brokerage models are costing roofing owners millions in realized value.',
        },
        {
          icon: 'users',
          title: 'Founder Exclusion',
          text: 'How standard PE deal structures systematically sideline the original founders post-sale.',
        },
        {
          icon: 'shield',
          title: 'The Debt Trap',
          text: 'The hidden risk of leverage-heavy acquisitions in a cyclical $60B industry.',
        },
      ],
    },

    // \u2500\u2500 S2: Testimonials (horizontal bleed scroll) \u2500\u2500
    {
      type: 'opt-in-testimonials',
      id: 'optin-testimonials',
      surface: 'low',
      heading: 'The industry is changing. Don\u2019t be the last to know the new rules.',
      subtext:
        'We\u2019ve spent a decade analyzing roofing assets from the inside. This guide is the synthesis of that architectural perspective.',
      pullQuote: {
        text: '\u201CUnparalleled clarity.\u201D',
        source: 'Modern Roofing Journal',
      },
      testimonials: [
        {
          quote:
            'Finally, someone addresses the debt-load issue in PE rollups. A must-read for any owner over $10M.',
          role: 'CEO',
          company: 'Northeast Roofing Group',
          verified: true,
        },
        {
          quote:
            'Foundation Projects understands that roofing is about people, not just spreadsheets.',
          role: 'Founder',
          company: 'Heritage Exteriors',
          verified: true,
        },
        {
          quote: 'The section on broker incentives was eye-opening. We almost made a huge mistake.',
          role: 'Managing Partner',
          company: 'Skyline Labs',
          verified: true,
        },
        {
          quote:
            'Clear, authoritative, and actionable. Best free resource I\u2019ve seen this year.',
          role: 'Principal',
          company: 'Capstone Partners',
          verified: true,
        },
        {
          quote: 'An architectural approach to business that was missing in our sector.',
          role: 'Managing Director',
          company: 'Summit Exteriors',
          verified: true,
        },
        {
          quote:
            'Changed our entire exit strategy overnight. The data on public-market valuations is unmatched.',
          role: 'Owner',
          company: 'Pacific Coast Roofing',
          verified: true,
        },
        {
          quote:
            'We were about to sign with a broker. This report saved us from leaving millions on the table.',
          role: 'President',
          company: 'Ironclad Systems',
          verified: true,
        },
        {
          quote:
            'The only guide that treats roofing as a legitimate asset class. Refreshingly honest.',
          role: 'CFO',
          company: 'Ridgeline Holdings',
          verified: true,
        },
        {
          quote:
            'Shared this with every owner in my network. It\u2019s the kind of insight you usually pay consultants for.',
          role: 'VP Operations',
          company: 'Granite Shield Roofing',
          verified: true,
        },
      ],
    },

    // ── S3: Final CTA (dark, same style as homepage) ──
    {
      type: 'cta',
      id: 'optin-cta',
      surface: 'dark',
      overline: 'Ready To Build The Exit?',
      heading: 'Your Big Exit Starts With A 30-Minute Call.',
      microcopy: 'No commitments. Just a strategic conversation about your legacy.',
      buttonLabel: 'Book A Call',
    },
  ],
};
