import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://dev.personalia.arkamaya.net';

test.describe('Lupa Password - Personalia', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/password-reset`, { waitUntil: 'networkidle' });
  });

  // ------------------------------
  // 1 Permintaan Reset Berhasil
  // ------------------------------
  test('1 Request reset password dengan email valid', async ({ page }) => {
    await page.getByPlaceholder(/Email/i).fill(process.env.ADMIN_EMAIL!);
    await page.getByRole('button', { name: /Kirim/i }).click();

    // Assert success popup
    await expect(
      page.getByText(/Kami telah mengirimkan tautan pengaturan ulang kata sandi/i)
    ).toBeVisible();
  });

  // ------------------------------
  // 2 Email Tidak Ditemukan
  // ------------------------------
  test('2 Request reset password dengan email tidak terdaftar', async ({ page }) => {
    await page.getByPlaceholder(/Email/i).fill('email.tidak.valid@dummytes.com');
    await page.getByRole('button', { name: /Kirim/i }).click();

    // Assert error message muncul
    const errorMessage = page.getByText(/Email tidak terdaftar di sistem/i);
    await expect(errorMessage).toBeVisible();
  });

  // ------------------------------
  // Simulasi buka halaman reset password (link dari email)
  // URL real biasanya format: /password-reset/{token}
  const RESET_URL = `${BASE_URL}/password-reset/token-simulasi-otomasi`;

  // ------------------------------
  // 3 Validasi Password Lemah
  // ------------------------------
  test('3 Validasi password baru lemah', async ({ page }) => {
    await page.goto(RESET_URL);

    await page.getByPlaceholder(/Password Baru/i).fill('12345');
    await page.getByPlaceholder(/Konfirmasi Password/i).fill('12345');
    await page.getByRole('button', { name: /Ubah Kata Sandi/i }).click();

    // Assert validasi keamanan password
    await expect(
      page.getByText(/Password minimal 8 karakter dengan kombinasi huruf besar, huruf kecil, angka, dan simbol/i)
    ).toBeVisible();
  });

  // ------------------------------
  // 4 Reset Password Sukses
  // ------------------------------
  test('4 Reset password berhasil', async ({ page }) => {
    await page.goto(RESET_URL);

    const strongPass = 'Test@12345';

    await page.getByPlaceholder(/Password Baru/i).fill(strongPass);
    await page.getByPlaceholder(/Konfirmasi Password/i).fill(strongPass);
    await page.getByRole('button', { name: /Ubah Kata Sandi/i }).click();

    // Assert success alert + redirect
    await expect(
      page.getByText(/Anda telah berhasil mengatur ulang kata sandi/i)
    ).toBeVisible();

    // pastikan redirect ke login/dashboard
    await expect(page).toHaveURL(/(sign-in|dashboard)/i, { timeout: 15000 });
  });
});
