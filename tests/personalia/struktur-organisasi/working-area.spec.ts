import { test, expect } from '@playwright/test';
import { loginAs } from '../../../utils/auth';

test.describe('Modul Struktur Organisasi', () => {
  test('Admin berhasil membuka screen Struktur Organisasi', async ({ page }) => {
    // 🔑 Login menggunakan helper dari auth.ts
    await loginAs(page, 'admin');

    // 🧭 Navigasi ke menu Personalia → Struktur Organisasi
    await page.locator('[id="#kt_aside_menu"]').getByText('Personalia').click();
    await page.locator('a').filter({ hasText: 'Struktur Organisasi' }).click();

    // ✅ Verifikasi heading halaman muncul
    const heading = page.locator('h1.page-heading', { hasText: 'Struktur Organisasi' });
    await expect(heading).toBeVisible({ timeout: 10000 });

    console.log('🎉 Berhasil membuka halaman Struktur Organisasi');

    // (Opsional) Tambahan validasi teks lain di konten
    const areaKerjaText = page.getByText(/Area Kerja/);
    await expect(areaKerjaText).toBeVisible();

    console.log('✅ Elemen "Area Kerja" tampil di halaman.');
  });
});


    