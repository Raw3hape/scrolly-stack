import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import globals from 'globals';

export default [
  ...nextCoreWebVitals,
  {
    ignores: [
      'backup/**',
      'dist/**',
    ],
  },
  {
    files: ['src/**/*.{ts,tsx}', 'e2e/**/*.ts', 'playwright.config.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // These React Compiler rules are currently too noisy for this codebase and
      // block delivery without catching issues that are actionable in infra-only work.
      // Keep core Hooks and Next guarantees from the upstream config intact.
      'react-hooks/immutability': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    files: [
      'src/components/TestimonialCarousel/TestimonialCarousel.tsx',
      'src/components/V2Sections/ScheduleQuoteSection/ScheduleQuoteSection.tsx',
    ],
    rules: {
      // These are author/content images rather than layout-critical media;
      // keep the upstream rule elsewhere and revisit when these components move to next/image.
      '@next/next/no-img-element': 'off',
    },
  },
  {
    files: [
      'src/features/scrolly-experience/hooks/useBlockState.ts',
      'src/hooks/useParallax.ts',
    ],
    rules: {
      // Both hooks have intentional dependency shaping today; keep the rule active
      // everywhere else and leave these two as explicit follow-up debt.
      'react-hooks/exhaustive-deps': 'off',
    },
  },
  {
    // Prevent Three.js imports outside the scrolly-experience feature.
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/features/scrolly-experience/**'],
    rules: {
      'no-restricted-imports': ['error', {
        paths: [
          {
            name: 'three',
            message:
              'Three.js imports are only allowed in src/features/scrolly-experience/ (client-only zone).',
          },
          {
            name: '@react-three/fiber',
            message:
              'R3F imports are only allowed in src/features/scrolly-experience/.',
          },
          {
            name: '@react-three/drei',
            message:
              'drei imports are only allowed in src/features/scrolly-experience/.',
          },
          {
            name: '@react-three/postprocessing',
            message:
              'postprocessing imports are only allowed in src/features/scrolly-experience/.',
          },
        ],
      }],
    },
  },
];
