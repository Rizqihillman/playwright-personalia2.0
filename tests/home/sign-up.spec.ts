import { test, expect, Locator, Page } from '@playwright/test';
import { generateUniqueUser } from '../helpers/dataGenerator';

// 🖱️ Fungsi bantu: simulasi gerakan mouse alami ke elemen target
async function moveMouseToElement(page: Page, locator: Locator) {
  await locator.waitFor({ state: 'visible', timeout: 10000 });
  const box = await locator.boundingBox();

  if (box) {
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    // Gerakan mouse seperti manusia (bergerak bertahap)
    await page.mouse.move(centerX - 150, centerY - 80);
    await page.waitForTimeout(200);
    await page.mouse.move(centerX - 60, centerY - 40, { steps: 6 });
    await page.waitForTimeout(150);
    await page.mouse.move(centerX, centerY, { steps: 10 });
    await page.waitForTimeout(250);
  } else {
    console.warn('⚠️ Gagal mendapatkan posisi elemen (boundingBox null)');
  }
}

test.describe('Register Page', () => {
  test('Register new account successfully with human-like mouse movement', async ({ page }) => {
    const user = generateUniqueUser();

    // 1️⃣ Buka halaman Sign Up
    await page.goto('https://dev.personalia.arkamaya.net/sign-up');

    // 2️⃣ Isi form pendaftaran
    await page.getByRole('textbox', { name: 'Nama Perusahaan' }).fill(user.companyName);
    await page.getByRole('textbox', { name: 'Nama Lengkap' }).fill(user.fullName);
    await page.getByRole('textbox', { name: 'Nomor Telepon' }).fill(user.phone);
    await page.getByRole('textbox', { name: 'Email' }).fill(user.email);

    const passwordInput = page.locator('input[type="password"]').first();
    const confirmPasswordInput = page.locator('input[type="password"]').nth(1);
    await passwordInput.fill(user.password);
    await confirmPasswordInput.fill(user.password);

    const checkbox = page.getByRole('checkbox', { name: /Saya Setuju|Syarat dan/i });
    await checkbox.check();

    // 3️⃣ Klik tombol "Daftar Akun Sekarang"
    const daftarButton = page.getByRole('button', { name: /Daftar Akun Sekarang/i });
    await daftarButton.click();

    // Setelah klik, gerakkan mouse alami (simulasi manusia yang lepas mouse)
    await page.waitForTimeout(500);
    await page.mouse.move(500, 400, { steps: 12 });
    await page.waitForTimeout(300);
    await page.mouse.move(700, 250, { steps: 10 });

    // 4️⃣ Tunggu popup informasi muncul
    const okButton = page.getByRole('button', { name: /Ok, mengerti!/i });
    await okButton.waitFor({ state: 'visible', timeout: 20000 });

    // 5️⃣ Gerakkan mouse ke tombol popup sebelum klik
    await moveMouseToElement(page, okButton);
    await okButton.click();

    // 6️⃣ Setelah klik OK, gerakkan mouse lagi
    await page.waitForTimeout(500);
    await page.mouse.move(400, 200, { steps: 15 });

    // 7️⃣ Verifikasi redirect ke halaman login atau verifikasi
    await expect(page).toHaveURL(/sign-in|verification/i, { timeout: 20000 });

    console.log(`✅ Registered new user: ${user.email}`);
  });
});
