import { test, expect } from '@playwright/test';
import { loginAs } from '../../../utils/auth';

test.describe('Modul Struktur Organisasi - Divisi', () => {
  test('Admin berhasil membuka screen Divisi', async ({ page }) => {
    // 🔑 Login via auth helper
    await loginAs(page, 'admin');

    // 🧭 Navigasi menu ke Struktur Organisasi
    await page.locator('[id="#kt_aside_menu"]').getByText('Personalia').click();
    await page.locator('a').filter({ hasText: 'Struktur Organisasi' }).click();

    // ✅ Pastikan halaman Struktur Organisasi terbuka
    const strukturHeading = page.locator('h1.page-heading', { hasText: 'Struktur Organisasi' });
    await expect(strukturHeading).toBeVisible({ timeout: 10000 });
    console.log('🎉 Halaman Struktur Organisasi berhasil dibuka');

    // 🧩 Klik tab atau section "Divisi"
    await page.getByText('DivisiPengelompokan unit').click();

    // ✅ Pastikan konten Divisi tampil
    const divisiHeading = page.locator('#kt_content_container').getByText('Divisi', { exact: true });
    await expect(divisiHeading).toBeVisible({ timeout: 10000 });

    console.log('✅ Halaman Divisi berhasil dibuka dan elemen "Divisi" tampil.');
  });
});
