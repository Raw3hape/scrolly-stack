/**
 * About Page Content — Foundation Projects
 */

import type { PageContent } from '../types';
import { footerContent } from './shared';

export const aboutContent: PageContent = {
  slug: 'about',
  metadata: {
    title: 'About — Foundation Projects',
    description:
      'We\u2019re a team of roofing industry professionals on a mission to get owners like you a big exit. No brokers, no PE traps.',
  },
  sections: [
    {
      type: 'hero',
      id: 'about-hero',
      surface: 'base',
      layout: 'editorial',
      heading:
        'We\u2019re A Team Of Roofing Industry Professionals On A Mission To Get Owners Like You A Big Exit',
      subtext:
        'We\u2019ve spent years inside this industry. We know what your company is worth. And we built Foundation Projects because we got tired of watching good roofing owners like you get taken advantage of by brokers and private equity firms.',
      buttonLabel: 'Book A Call',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBX2APLOJ_83bZdQwQ0rn9FyZ0Bfw21mUceg6Oj-5orhoFeDrTp5mX_EoSFUXZ2geGn2hVLnZpT0L1fs2lxrtSKSD65UXYjmCTzPL4Z_OBQLnuCibAFXfAzxlIQQ-5xGfYWf72uEOoCG6ttQRdRwlWdqDKobT8LQOgEfd8sAvmm1i6j-OwLXXSifdv6_Fzy8dAVgXG_vzEOzQ3IICFAtgpBawFy-Ab_en3WxHSWSAxwHnG8-s87aIWCp8k6A-U_Mb3LapV41dabzV7u',
    },
    {
      type: 'cinematic',
      id: 'pe-trap',
      surface: 'dark',
      chapterLabel: 'Chapter I',
      chapterSubtitle: 'The Trap',
      heading:
        'Too Many Roofing Company Owners Get Taken Advantage Of When They Exit',
      card: {
        title: 'The 3× vs 10× Flip',
        text: 'You\u2019d spend 10, 15, 20 years building a roofing business with strong revenue, loyal crews, happy customers\u2014 and then a PE firm shows up and offers you 3x. Take it or leave it. Most owners take it. Then watched the buyer flip it for 10x a few years later.',
        footnote: 'That\u2019s not a bad deal. That\u2019s a bad system.',
      },
      backgroundUrl: '/images/cinematic-roofing-bg.jpg',
    },
    {
      type: 'mission',
      id: 'solution',
      surface: 'base',
      layout: 'vertical',
      chapterLabel: 'Chapter II',
      heading: 'So We Built a Better One',
      headingAccent:
        'Foundation Projects is a platform that brings the best roofing companies together and takes them public. Instead of selling to a buyer who captures all the upside, you stay in the deal \u2014 and get paid when the platform goes public at 7\u201310x.',
      steps: [
        {
          icon: 'building',
          title: 'Public Market Liquidity',
          text: 'Exit at 7\u201310x multiples through a public offering \u2014 not a local fire-sale price from a PE firm.',
        },
        {
          icon: 'shield',
          title: 'Legacy Protection',
          text: 'Your team stays, your name stays, your culture stays. You built it \u2014 you keep it.',
        },
        {
          icon: 'target',
          title: 'Operational Excellence',
          text: 'We help tighten your operations and grow revenue, so your company is worth more before you ever exit.',
        },
      ],
      quote: {
        text: '\u201CThe goal isn\u2019t just to sell. The goal is to be part of the most valuable roofing entity ever built.\u201D',
        body: '',
        label: 'Our Founding Principle',
      },
    },
    {
      type: 'team',
      id: 'team',
      surface: 'high',
      chapterLabel: 'Our Team',
      heading: 'Our Team Doesn\u2019t Get Paid Until You Do',
      subtext:
        'Meet our team of roofing industry professionals who care about your business (almost) as much as you do.',
      members: [
        {
          name: 'Marcus Thorne',
          role: 'Operations Principal',
          bio: '25 years in roofing operations. Formerly scaled three regional outfits to $50M+ exits.',
          imageUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCmedK40XHbRbxaxM4RyZN15OBzrmPMvwKgCS47vRKu_jZkpWgJW2S_a3ZP-pqbY9eZgwWVS6x9yQSUjG9-vO1s0EHNM0LjaPKC36rKwX-YzvZCJF2Rwl9HilEI412TrnB4uWFzawz__TvZ6510Yo1ScdDjtWiHeuyBphMpfOTV5uNHNcc27A6Ew43pL5DmWZ2vK_4sdHlrH3V-2mHc4KCR_Ww8no8rBPbfNlwvu8Qsa7DKBLL5E6tk8YcSuedCzMPvbb1J_ErepYib',
        },
        {
          name: 'Elena Rodriguez',
          role: 'M&A Strategy',
          bio: 'Specialist in construction roll-ups. Expert in finding the hidden value in your balance sheet.',
          imageUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuC0j8BmRbEtuXQsNUFFoveZxyrXXfv6JxVhdiDS1mzjNcpiMGfn2HgRaaOMMM2LZzlByf7-3Es3jexlvYlIW_J8BLy2yhFvLXfjPYKAylw1nXfIzTnX7S3QYFSlnt70z0j1F_ODwRoalvydCyQdUT2egt_WSSjgHRafmW6s-pQ793Bw2tIbu4QPa7tb1xmB9oSk8EaqZghWNptYgXx0DVSM9iE8tt7wXmjCttw2bLLF7rRjRDCQqYZW9JF0kCfHld_lkonDGb_gJLKV',
        },
        {
          name: 'Jacob Sterling',
          role: 'Founder',
          bio: 'Started Foundation Projects after watching his father\u2019s 40-year company sold for pennies.',
          imageUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAkZjRjQOH0ikNMTjOqDzXqe4gBYg2YzjlJ0kUbGAlVCqm8D4myhpSk94Ru9PIQzc9i79ARsPG6pzBRIMskToUcMt6eWE6QIAy09rdlTkL4-jvpDkmvA-8UhOJiQnnCnoHxS12bycszbNj-JVMHzdY8qR7yh76HLRXovzLNsvbpE2Jie-B4yUJZGYmn6kJwHjR_HzVl0Oyo_eTrCitRCLMPY5MTEqH0WscDfDpCT3KKemztBYkgUDFfJQrMCTIMZ6jiGfHMCL1dhwpT',
        },
        {
          name: 'Laura Rodriguez',
          role: 'VP, Operations',
          bio: 'Built operating systems for 3 roofing roll-ups. CRM & RevOps expert.',
        },
        {
          name: 'David Park',
          role: 'CFO',
          bio: 'Former Big 4. Took two home services companies through IPO.',
        },
        {
          name: 'Rachel Foster',
          role: 'VP, Growth',
          bio: 'Grew a regional roofing company from $5M to $35M in 4 years.',
        },
      ],
    },
    {
      type: 'cinematic',
      id: 'results',
      surface: 'dark',
      heading:
        'Now, Owners Like You Get A Better Roofing Company AND The Exit They Deserve',
      card: {
        title: 'Better Business. Bigger Exit.',
        text: 'The first owners who joined the platform didn\u2019t just get a better exit. Their businesses got better, too \u2014 meaning they were worth more. We helped them tighten their operations, grow revenue, and found the owners who had been fielding lowball offers were suddenly sitting on a roofing company that was inherently worth a lot more.',
      },
      backgroundUrl: '/images/cinematic-roofing-bg.jpg',
    },
    {
      type: 'testimonial',
      id: 'proof',
      surface: 'base',
      heading: 'Proof Of The Model',
      autoPlayInterval: 8000,
      testimonials: [
        {
          quote:
            'I was about to sign a 4\u00d7 multiple with a PE firm. Foundation showed me how my company was actually a 10\u00d7 asset if we partnered for a public exit. My family\u2019s wealth changed overnight.',
          author: 'Robert Vance',
          company: 'Former Owner, Vance Professional Roofing',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCyvr30AJ3qoJuO0iI17pQyOXQmaQ_STGrJVjtCPwvUaodE0KvCurSxL1oPuSHx1MnPsDv5m9CrAe179XIxOaQazlMgn7UjvWII0SxTfMNYUymQ5MvFdk6eC-rqIYo72r13U9Tklwqc-OQfR1UDwf0ONO5KrA-PfI5L0KukV2NKcMOMH2_wAYMvj3EYclS1bJ7yZSonxRCEI1OsZNdSP65qF1Vz8mkAfJDTWgp6sSK_yOes2v3341eLWD3VBU-kp6goVef-g7X7cpiY',
          badge: 'Verified Exit',
        },
        {
          quote:
            'After 30 years on rooftops, I thought selling to a national chain was my only option. Foundation\u2019s public-market approach gave me 3\u00d7 what the highest PE offer was \u2014 and I still run my crew.',
          author: 'Linda Hargrove',
          company: 'Founder, Hargrove & Sons Roofing',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuC0j8BmRbEtuXQsNUFFoveZxyrXXfv6JxVhdiDS1mzjNcpiMGfn2HgRaaOMMM2LZzlByf7-3Es3jexlvYlIW_J8BLy2yhFvLXfjPYKAylw1nXfIzTnX7S3QYFSlnt70z0j1F_ODwRoalvydCyQdUT2egt_WSSjgHRafmW6s-pQ793Bw2tIbu4QPa7tb1xmB9oSk8EaqZghWNptYgXx0DVSM9iE8tt7wXmjCttw2bLLF7rRjRDCQqYZW9JF0kCfHld_lkonDGb_gJLKV',
          badge: 'Verified Exit',
        },
        {
          quote:
            'The due diligence alone would have cost me a year with a traditional broker. Foundation\u2019s team had our financials structured and investor-ready in 8 weeks. We closed at a 7.2\u00d7 multiple.',
          author: 'Marcus Delgado',
          company: 'CEO, Pinnacle Roofing Group',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAkZjRjQOH0ikNMTjOqDzXqe4gBYg2YzjlJ0kUbGAlVCqm8D4myhpSk94Ru9PIQzc9i79ARsPG6pzBRIMskToUcMt6eWE6QIAy09rdlTkL4-jvpDkmvA-8UhOJiQnnCnoHxS12bycszbNj-JVMHzdY8qR7yh76HLRXovzLNsvbpE2Jie-B4yUJZGYmn6kJwHjR_HzVl0Oyo_eTrCitRCLMPY5MTEqH0WscDfDpCT3KKemztBYkgUDFfJQrMCTIMZ6jiGfHMCL1dhwpT',
          badge: 'Verified Exit',
        },
      ],
    },
    {
      type: 'cta',
      id: 'about-cta',
      surface: 'dark',
      overline: 'Join Us',
      heading: 'We\u2019re Building the Platform That Takes Roofing Public',
      microcopy:
        'Foundation Projects is actively assembling a group of best-in-class roofing companies with one destination in mind. The window is open. And the owners who get in now will be the ones who look back and say they got in at the right time.',
      buttonLabel: 'Book A Call',
    },
  ],
  footer: footerContent,
};
