/**
 * Schedule Page Content — Foundation Projects
 */

import type { PageContent } from '../types';

export const scheduleContent: PageContent = {
  slug: 'schedule',
  metadata: {
    title: 'Schedule A Call \u2014 Foundation Projects',
    description:
      'Book a free 30-minute strategy session with Foundation Projects. Discover how we help roofing company owners achieve premium exits through our public-market strategy.',
  },
  sections: [
    // ── S1: Hero ──
    {
      type: 'schedule-hero',
      id: 'schedule-hero',
      surface: 'base',
      heading: 'Our Next Step Is To Book A Call',
      subtext:
        'If you\u2019re serious about cashing in on a $60B industry \u2014 booking a call with our team is the right choice.',
      smsBadge: {
        text: 'Schedule a call below or text',
        keyword: 'ROOF',
        phone: 'XXX-XXX-XXXX',
      },
    },

    // ── S2: Booking Widget (sidebar + calendar) ──
    {
      type: 'schedule-booking',
      id: 'schedule-booking',
      surface: 'base',
      flush: true,
      provider: 'built-in',
      sidebar: {
        heading: 'What to expect',
        items: [
          {
            icon: 'clock',
            title: '30 min call',
            text: 'A focused session to evaluate alignment and potential.',
          },
          {
            icon: 'target',
            title: 'Clarity',
            text: 'We break down the architectural integrity of our investment model.',
          },
          {
            icon: 'shield',
            title: 'No obligation',
            text: 'High-level conversation. You decide if we move forward.',
          },
        ],
        trustBadge: {
          label: 'Direct Access',
          text: 'You will be speaking directly with our lead structural strategist.',
        },
      },
      widget: {
        label: 'Select Date & Time',
        title: 'Strategy Session',
        timezone: 'Eastern Standard Time (EST)',
        timeSlots: ['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM', '4:00 PM'],
        submitLabel: 'Next Step',
      },
    },

    // ── S3: Testimonial Quote ──
    {
      type: 'schedule-quote',
      id: 'schedule-quote',
      surface: 'dark',
      quote:
        'The calls we have are the pivot point. It\u2019s where the vision for a permanent roofing asset meets the execution of the architectural plan.',
      author: 'Julian Vance',
      role: 'Managing Partner, Foundation Projects',
      avatarUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAKeVPf5NXaFE5Fv34zBCkEo8z0RI3TS0Eqysjute0rNYknk4K_APwkN50pa7vZxDlBMT8qbeC77l68TXWDrVxW5Bnjvz23Be063qzrkwsCdRzmejWW35qu336_J98HtDG1vzQLFuSknyIkpfZ2Ek-JuO__MpMvcetJ6EkdPBac6W8sQSP0TngPs6gHon_q6HTarBoS1vt_bypiMFd6YlZ-0Oacadp1mHlYTqZhQzEZfvqzVST8BtoE06EW8di1rULeaTXJiKtXpt6t',
      backgroundUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC1uN36zRMO7vTpPWW9EPZYxGof3KIjExoy7PugBT7CvyedXr4UXVc-PP5sZ5YhcxTkjE0FIO5oaxAE8ahMEC_0PTA2C8kv5CVAGUbwrIbYp6-pF5ox6jeUIYAPKoiGlVGKPfu7KzyK8E295aOmubDR2N1Psto4wCEG072-kLF2bfTRC7fqAkzGl0QEbot4k3rvjit3_Jg-unRUBbKOyHxgjaYO5vUrT4vOZxmSsdFdlFXZ-a52rWfxPFXMKeXKMM66ysChkyO3sBuP',
    },

    // ── S4: Final CTA (dark) ──
    {
      type: 'cta',
      id: 'schedule-cta',
      surface: 'dark',
      overline: 'Ready To Build The Exit?',
      heading: 'Your Big Exit Starts With A 30-Minute Call.',
      microcopy: 'No commitments. Just a strategic conversation about your legacy.',
      buttonLabel: 'Book A Call',
    },
  ],
};
