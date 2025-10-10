import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// --- Ambil ENV MODE ---
const envFile = process.env.ENV === 'staging' ? '.env.staging' : '.env.dev';
dotenv.config({ path: path.resolve(__dirname, envFile) });

export default defineConfig({
  testDir: './tests',
  testMatch: [
    '**/*.spec.ts', // default
    '**/helpers/*.spec.ts', // tambahkan ini agar detect test di helpers
  ],
  fullyParallel: true,
  retries: 0,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright'],
    
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://dev.personalia.arkamaya.net',
    headless: true,
    viewport: { width: 1280, height: 720 },
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    // artifacts (video/screenshot/trace) already configured above
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        //slowMo: 10000,       // <<=== (dalam ms)
      },
    },
  ],
});
