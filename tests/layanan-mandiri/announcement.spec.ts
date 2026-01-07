import { test, expect } from '@playwright/test';
import { loginAs } from '../../utils/auth';

test.describe('Modul Announcement', () => {

  test('Admin berhasil membuka halaman Announcement & membuat pengumuman', async ({ page }) => {
    
    
    // 🔐 Login Admin
    await loginAs(page, 'admin');

    // 📂 Navigasi ke Announcement
    await page.getByText('Layanan Mandiri', { exact: true }).click();
    await page.getByRole('link', { name: /Announcement|Pengumuman/i }).click();

    // ✅ Verifikasi halaman Announcement tampil
    const heading = page.locator('.page-heading');
    await expect(heading).toContainText(/Announcement|Pengumuman/i, { timeout: 10000 });
    console.log('✅ Berhasil membuka halaman Announcement');

    // 🕒 Tunggu card list/panel content muncul
    await expect(page.locator('.card-body').first()).toBeVisible({ timeout: 10000 });

    // ➕ Klik tombol tambah pengumuman
    await page.getByRole('button', { name: /Tambah|Add/i }).click();

    // ✍️ Isi form Announcement
    await page.getByPlaceholder('Judul Announcement').fill('Test Pengumuman');
    await page.getByPlaceholder('Deskripsi...').fill('Disini adalah deskripsi pengumuman otomatis');

    // 💾 Klik simpan
    await page.getByRole('button', { name: /Simpan|Save/i }).click();

    // ✅ Assert pop-up sukses
    await expect(
      page.getByText(/berhasil|success/i)
    ).toBeVisible({ timeout: 5000 });

    console.log('✅ Pengumuman berhasil dibuat');

    // 🎯 Validasi muncul di daftar Announcement (optional)
    await expect(page.locator('.announcement-card')).toContainText('Test Pengumuman');
  });

});
