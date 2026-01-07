import { test, expect } from '@playwright/test';
import { loginAs } from '../../../utils/auth';

test.describe('Modul Dokumen & Create Employee', () => {

  // ==============================
  // TEST 1 — Login
  // ==============================
  test('Admin berhasil login', async ({ page }) => {
    await loginAs(page, 'admin');
    await expect(page).toHaveURL(/dashboard/i);
  });

  // ==============================
  // TEST 2 — Create Employee
  // ==============================
  test('Should create new employee successfully', async ({ page }) => {

    // 🔐 Login
    await loginAs(page, 'admin');

    // 📌 Navigasi ke Data Pegawai
    await page.getByText('Personalia', { exact: true }).click();
    await page.getByRole('link', { name: 'Data Pegawai' }).click();
    await expect(page.getByRole('heading', { name: 'Data Pegawai' })).toBeVisible();

    // ➕ Buat Pegawai
    await page.getByText('Buat Pegawai').click();
    await page.waitForLoadState('networkidle');

    // ========================
    // 🔹 Form Biodata
    // ========================
    await page.getByPlaceholder('NIK / Employee ID').fill('123451');
    await page.getByPlaceholder('Nama Pegawai').fill('Test Create');
    await page.getByPlaceholder('Tempat Lahir').fill('Bandung');
    await page.locator('input[placeholder="Tanggal Lahir"]').fill('01/01/2000');

    await page.locator('textarea').fill('Kota Bandung');

    // Provinsi
    await page.getByLabel('Provinsi').click();
    await page.getByText('JAWA BARAT').click();

    // Kabupaten
    await page.getByLabel('Kabupaten / Kota').click();
    await page.getByText('KABUPATEN BANDUNG', { exact: true }).click();

    // Kecamatan
    await page.getByLabel('Kecamatan').click();
    await page.getByText('BALEENDAH').click();

    // Kelurahan
    await page.getByLabel('Kelurahan').click();
    await page.getByText('BALEENDAH').first().click();

    await page.getByPlaceholder('Kode Pos').fill('10001');

    // Map
    await page.getByText('Ubah').click();
    await page.locator('.gm-style > div > div:nth-child(2)').click();
    await page.getByRole('button', { name: 'Pilih Lokasi Ini' }).click();

    // NIK KTP
    await page.getByLabel('NIK KTP').fill('321111000119920001');

    // Agama
    await page.getByLabel('Agama').click();
    await page.getByText('Islam').click();

    // Jenis Kelamin
    await page.getByLabel('Jenis Kelamin').click();
    await page.getByText('Laki-laki').click();

    // Status Nikah
    await page.getByLabel('Status Pernikahan').click();
    await page.getByText('Belum Menikah').click();

    await page.getByLabel('No Telepon').fill('08799918827712');

    await page.getByLabel('Kebangsaan').fill('Indonesia');
    await page.getByText('Indonesia').click();

    await page.getByLabel('Nomor Telepon Darurat').fill('00918829188');
    await page.getByLabel('Nomor WhatsApp').fill('089177728177');

    await page.getByLabel(/Nama Kontak Darurat/).fill('Saudara');

    // ========================
    // 🔹 Form Kontrak
    // ========================
    await page.getByText('Kontrak').click();
    await page.getByLabel('Tipe Kontrak').click();
    await page.getByText('Kontrak').click();

    await page.getByLabel('Lama Kontrak').click();
    await page.getByText('24').click();

    await page.getByLabel('Lokasi Kerja').fill('kan');
    await page.getByText('Kantor Pusat', { exact: true }).click();

    await page.getByLabel('Departemen').click();
    await page.getByText('Operation').click();

    await page.getByLabel('Divisi').click();
    await page.getByText('Product Development').click();

    await page.getByLabel('Hak Cuti').click();
    await page.getByText('Tidak Boleh').click();

    // ========================
    // 🔹 Form Gaji
    // ========================
    await page.getByText('Gaji').click();

    await page.getByText('Pilih Jabatan').click();
    await page.getByText('Quality Assurance').click();

    await page.getByText('Pilih Grade').click();
    await page.getByText('Grade 2').click();

    await page.getByText('Pilih Tipe Jadwal').click();
    await page.getByText('NON SHIFT').click();

    await page.getByText('Pilih Nama Jadwal Kerja').click();
    await page.getByText('Admin Standard Schedule').click();

    await page.getByLabel('BPJS Kesehatan Otomatis').check();
    await page.getByLabel('BPJS Ketenagakerjaan Otomatis').check();
    await page.getByLabel('Hitung Otomatis', { exact: true }).check();

    // ========================
    // 🔹 Simpan
    // ========================
    await page.getByText('Biografi').click();
    await page.getByRole('button', { name: 'Simpan' }).click();

    await expect(
      page.getByRole('heading', { name: 'Berhasil Membuat Data Pegawai' })
    ).toBeVisible();

  });

});
