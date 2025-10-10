import { test, expect } from '@playwright/test';
import { loginAs } from './helpers/auth'; // pastikan path benar

test.describe('Screen Dokumen', () => {
  test.beforeEach(async ({ page }) => {
    // Gunakan login session dari helper
    await loginAs(page, 'admin');
  });

  test('Admin berhasil membuka halaman Dokumen', async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/document`);
    await expect(page.getByRole('heading', { name: 'Dokumen' })).toBeVisible();
  });
});
