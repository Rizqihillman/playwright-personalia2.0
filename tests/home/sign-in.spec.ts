// tests/sprint1/login.admin.spec.ts
import { test, expect, Page } from '@playwright/test';
import { loginAs } from '../../utils/auth';
import dotenv from 'dotenv';

dotenv.config({
  path: process.env.ENV === 'staging' ? '.env.staging' : '.env.dev',
});

const BASE_URL = process.env.BASE_URL || 'https://dev.personalia.arkamaya.net';

// ------------------------------
// Helpers
// ------------------------------
async function handlePopup(page: Page) {
  const okButton = page.getByRole('button', { name: /Ok|Mengerti|Ok, mengerti!|Got it/i });
  if (await okButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    await okButton.click().catch(() => { });
  }
}

async function simulateHumanMouse(page: Page) {
  if (process.env.RECAPTCHA_ENABLED !== 'true') return;

  const { width, height } = page.viewportSize() || { width: 1280, height: 720 };
  for (let i = 0; i < 5; i++) {
    const x = Math.floor(Math.random() * width * 0.8);
    const y = Math.floor(Math.random() * height * 0.8);
    await page.mouse.move(x, y, { steps: 10 });
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(2000);
}

// ------------------------------
// Test Suites (Admin)
// ------------------------------
test.describe('Login - Admin (Positive & Negative)', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    test.setTimeout(90000);
    await page.goto(`${BASE_URL}/sign-in`, { waitUntil: 'networkidle', timeout: 60000 });
  });

  // ✅ 1. Happy Path
  test('1. Login berhasil (Admin)', async ({ page }) => {
    await loginAs(page, 'admin');
    await expect(page.locator('#kt_toolbar_container h1.page-heading')).toHaveText(/Dashboard/i);
  });

  // ✅ 2. Login setelah 1x gagal
  test('2. Login berhasil setelah gagal < 3x (Admin)', async ({ page }) => {
    await page.getByPlaceholder(/Email/i).fill('wrong@personalia.id');
    await page.getByPlaceholder(/Password/i).fill('WrongPass');
    await page.locator('#kt_sign_in_submit').click();

    const err = page.locator('text=Email atau password salah');
    await err.isVisible({ timeout: 3000 }).catch(() => { });

    await loginAs(page, 'admin');
    await handlePopup(page);

    await expect(page.locator('#kt_toolbar_container h1.page-heading')).toBeVisible({ timeout: 30000 });
  });

  // ✅ 3. Mandatory Email & Password
  test('3. Validasi Mandatory Field (Email & Password kosong)', async ({ page }) => {
    await page.goto(`${BASE_URL}/sign-in`);

    // Pastikan field terisi otomatis dulu (optional check)
    // console.log('Auto-filled =', await page.getByPlaceholder(/Email/i).inputValue());

    // Clear kedua field
    await page.getByPlaceholder(/Email/i).fill('');
    await page.getByPlaceholder(/Password/i).fill('');

    // Klik tombol Masuk
    await page.getByRole('button', { name: /Masuk/i }).click();

    // Validasi pesan error
    await expect(page.locator('text=Email wajib diisi')).toBeVisible();
    await expect(page.locator('text=Kata sandi wajib diisi')).toBeVisible();

    // Validasi bahwa user tetap di halaman login (optional but recommended)
    await expect(page).toHaveURL(/sign-in/);
  });


  // ✅ 4. Format Email Salah
  test('4. Validasi Format Email', async ({ page }) => {
    await page.getByPlaceholder(/Email/i).fill('wrong-format-email');
    await page.getByPlaceholder(/Password/i).fill('dummyPass123');
    await page.getByRole('button', { name: /Masuk/i }).click();
    await expect(page.locator('text=Email tidak valid')).toBeVisible();
  });

});
