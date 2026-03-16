import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  timeout: 30_000,

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // Desktop
    {
      name: 'desktop-1920',
      use: { viewport: { width: 1920, height: 1080 } },
    },
    {
      name: 'desktop-1440',
      use: { viewport: { width: 1440, height: 900 } },
    },

    // Tablet
    {
      name: 'tablet-landscape',
      use: { viewport: { width: 1024, height: 768 } },
    },
    {
      name: 'tablet-portrait',
      use: { viewport: { width: 768, height: 1024 } },
    },

    // Mobile
    {
      name: 'iphone-se',
      use: { ...devices['iPhone SE'] },
    },
    {
      name: 'iphone-14',
      use: { ...devices['iPhone 14'] },
    },
  ],

  // webServer is disabled — run `npm run dev` manually before tests.
  // Enable for CI: { command: 'npm run dev', url: 'http://localhost:3000', reuseExistingServer: true }
});
