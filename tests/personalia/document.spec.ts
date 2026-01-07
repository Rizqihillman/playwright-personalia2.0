import { test, expect } from '@playwright/test';
import { loginAs } from '../../utils/auth';

test.describe('Modul Dokumen', () => {
  test('Admin berhasil membuka dan menghitung total data dokumen', async ({ page }) => {
    // 🔐 Login
    await loginAs(page, 'admin');

    // 📂 Buka halaman Dokumen
    await page.locator('[id="#kt_aside_menu"]').getByText('Personalia').click();
    await page.locator('a').filter({ hasText: 'Dokumen' }).click();

    // ✅ Pastikan halaman Dokumen tampil
    const headingDokumen = page.locator('.page-heading', { hasText: 'Dokumen' });
    await expect(headingDokumen).toBeVisible({ timeout: 10000 });
    console.log('🎉 Berhasil membuka Halaman Dokumen');

    // Tunggu tabel muncul
    const rowLocator = page.locator('table tbody tr');
    await expect(rowLocator.first()).toBeVisible({ timeout: 10000 });

    // Inisialisasi penghitung
    let totalData = 0;
    let currentPage = 1;

    while (true) {
      // 🔢 Hitung jumlah data di halaman ini
      const rowCount = await rowLocator.count();
      totalData += rowCount;
      console.log(`📄 Halaman ${currentPage}: ${rowCount} data`);

      // 🔍 Cek apakah tombol Next disable
      const nextPage = page.locator('.page-item.next');
      const isDisabled = await nextPage.evaluate(el => el.classList.contains('disabled'));

      if (isDisabled) {
        console.log('🚫 Sudah di halaman terakhir.');
        break;
      }

      // ⏭ Klik tombol next
      await nextPage.click();
      await page.waitForTimeout(1500); // beri jeda biar data reload
      currentPage++;
    }

    console.log(`✅ Total data di semua halaman: ${totalData} data Dokumen`);
  });
});
