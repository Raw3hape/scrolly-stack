import js from '@eslint/js';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    ignores: ['dist/', 'backup/', '.next/', 'node_modules/', '**/*.d.ts'],
  },
  {
    files: ['src/**/*.ts', 'src/**/*.tsx', 'e2e/**/*.ts'],
    plugins: {
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      // TypeScript handles unused vars via noUnusedLocals — avoid double-reporting
      'no-unused-vars': 'off',
      // TypeScript already handles these — disable to prevent false positives
      'no-undef': 'off',
    },
  },
  {
    // Prevent Three.js imports outside the scrolly-experience feature
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    ignores: ['src/features/scrolly-experience/**'],
    rules: {
      'no-restricted-imports': ['error', {
        paths: [
          { name: 'three', message: 'Three.js imports are only allowed in src/features/scrolly-experience/ (client-only zone).' },
          { name: '@react-three/fiber', message: 'R3F imports are only allowed in src/features/scrolly-experience/.' },
          { name: '@react-three/drei', message: 'drei imports are only allowed in src/features/scrolly-experience/.' },
          { name: '@react-three/postprocessing', message: 'postprocessing imports are only allowed in src/features/scrolly-experience/.' },
        ],
      }],
    },
  },
];
