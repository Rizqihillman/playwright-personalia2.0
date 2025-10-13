import { test, expect, Page } from '@playwright/test';
import { loginAs } from '../helpers/auth';

// Utility untuk menunggu popup “Ok, got it!” jika muncul
async function handlePopup(page: Page) {
  const popup = page.locator('button:has-text("Ok, got it!")');
  if (await popup.isVisible({ timeout: 3000 }).catch(() => false)) {
    await popup.click();
  }
}

// Base URL dari environment
const BASE_URL = process.env.BASE_URL || 'https://dev.personalia.arkamaya.net';

// ------------------------------
// ✅ Positive Scenarios
// ------------------------------
test.describe('Login Positive Scenarios', () => {

  test('1. Kredensial benar -> Login berhasil', async ({ page }) => {
    await loginAs(page, 'admin');
    await handlePopup(page);
    await expect(page.locator('text=Personalia')).toBeVisible({ timeout: 7000 });
  });

  test('2. Login berhasil setelah gagal < 3x', async ({ page }) => {
    await page.goto(`${BASE_URL}/sign-in`);
    await page.getByPlaceholder('Email').fill('wrong@personalia.id');
    await page.getByPlaceholder('password').fill('WrongPass');
    await page.locator('#kt_sign_in_submit').click();

    // Coba login benar setelah 1x salah
    await loginAs(page, 'admin');
    await handlePopup(page);
    await expect(page.locator('text=Personalia')).toBeVisible({ timeout: 7000 });
  });
});

// ------------------------------
// ❌ Negative Scenarios
// ------------------------------
test.describe('Login Negative Scenarios', () => {

  test('4. Input kosong (Email & Password)', async ({ page }) => {
    await page.goto(`${BASE_URL}/sign-in`);
    await page.locator('#kt_sign_in_submit').click();
    await expect(page.locator('text=Email wajib diisi')).toBeVisible();
    await expect(page.locator('text=Password wajib diisi')).toBeVisible();
  });

  test('5. Email kosong', async ({ page }) => {
    await page.goto(`${BASE_URL}/sign-in`);
    await page.getByPlaceholder('password').fill('pass123');
    await page.locator('#kt_sign_in_submit').click();
    await expect(page.locator('text=Email wajib diisi')).toBeVisible();
  });

  test('6. Password kosong', async ({ page }) => {
    await page.goto(`${BASE_URL}/sign-in`);
    await page.getByPlaceholder('Email').fill('admin@personalia.id');
    await page.locator('#kt_sign_in_submit').click();
    await expect(page.locator('text=Password wajib diisi')).toBeVisible();
  });

  test('7. Format email tidak valid', async ({ page }) => {
    await page.goto(`${BASE_URL}/sign-in`);
    await page.getByPlaceholder('Email').fill('abc123');
    await page.getByPlaceholder('password').fill('pass123');
    await page.locator('#kt_sign_in_submit').click();
    await expect(page.locator('text=Format email tidak valid')).toBeVisible();
  });

  test('8. Email tidak terdaftar', async ({ page }) => {
    await page.goto(`${BASE_URL}/sign-in`);
    await page.getByPlaceholder('Email').fill('notfound@personalia.id');
    await page.getByPlaceholder('password').fill('pass123');
    await page.locator('#kt_sign_in_submit').click();
    await expect(page.locator('text=Email tidak terdaftar')).toBeVisible();
  });

  test('9. Password salah (kurang dari 3x)', async ({ page }) => {
    await page.goto(`${BASE_URL}/sign-in`);
    await page.getByPlaceholder('Email').fill(process.env.ADMIN_USER || '');
    await page.getByPlaceholder('password').fill('Salah123');
    await page.locator('#kt_sign_in_submit').click();
    await expect(page.locator('text=Email atau password salah')).toBeVisible();
  });
  
});

// ---------------------------------
// ⚠️ Edge Cases (bisa diaktifkan nanti)
// ------------------------------
// test.describe('Login Edge Cases', () => {

//   test('10. Password salah ≥ 3x -> Blokir sementara', async ({ page }) => {
//     await page.goto(`${BASE_URL}/sign-in`);
//     for (let i = 0; i < 3; i++) {
//       await page.getByPlaceholder('Email').fill(process.env.ADMIN_USER || '');
//       await page.getByPlaceholder('password').fill('WrongPass');
//       await page.locator('#kt_sign_in_submit').click();
//     }
//     await expect(page.locator('text=Akun diblokir sementara')).toBeVisible({ timeout: 5000 });
//   });

//   test('12. SQL Injection attempt', async ({ page }) => {
//     await page.goto(`${BASE_URL}/sign-in`);
//     await page.getByPlaceholder('Email').fill("' OR 1=1 --");
//     await page.getByPlaceholder('password').fill("' OR 'x'='x");
//     await page.locator('#kt_sign_in_submit').click();
//     await expect(page.locator('text=Email atau password salah')).toBeVisible();
//   });
// });
