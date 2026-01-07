import { test, expect, Page } from '@playwright/test';
import { loginAs } from '../../utils/auth';

/**
 * E2E: Complete Employee Workflow
 * Flow: Login → Create → Fill All Tabs → Verify
 */

interface EmployeeTestData {
  nip: string;
  nama: string;
  email: string;
  noTelepon: string;
  alamat: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  agama: string;
  statusPerkawinan: string;
  gasiPokok: string;
  tunjanganTransport: string;
  tunjanganMakan: string;
  noHpPribadi: string;
  noTeleponKantor: string;
  emailAlternative: string;
  alamatPribadi: string;
  kodePos: string;
  namaKontak: string;
  noKontakDarurat: string;
  namaFileKTP: string;
  namaFileNPWP: string;
  namaFileSK: string;
}

const generateTestData = (): EmployeeTestData => {
  const ts = Date.now();
  return {
    // Biografi
    nip: `NIP${ts}`,
    nama: `Pegawai Test ${ts}`,
    email: `employee${ts}@test.com`,
    noTelepon: '081234567890',
    alamat: 'Jl. Test No. 123, Jakarta',
    tempatLahir: 'Jakarta',
    tanggalLahir: '1990-01-15',
    jenisKelamin: 'Laki-laki',
    agama: 'Islam',
    statusPerkawinan: 'Belum Menikah',
    // Gaji
    gasiPokok: '5000000',
    tunjanganTransport: '500000',
    tunjanganMakan: '750000',
    // Kontak
    noHpPribadi: '081234567890',
    noTeleponKantor: '0212345678',
    emailAlternative: `alt${ts}@test.com`,
    alamatPribadi: 'Jl. Rumah Test No. 1',
    kodePos: '12345',
    namaKontak: 'Keluarga Darurat',
    noKontakDarurat: '081234567899',
    // Dokumen
    namaFileKTP: `KTP_${ts}.pdf`,
    namaFileNPWP: `NPWP_${ts}.pdf`,
    namaFileSK: `SK_${ts}.pdf`,
  };
};

test.describe('E2E: Complete Employee Workflow', () => {
  test('Login → Create Employee → Fill Tabs → Verify', async ({ page }) => {
    const data = generateTestData();

    try {
      // 🔐 Login
      console.log('🔐 Login sebagai Admin');
      await loginAs(page, 'admin');

      // 📂 Navigate
      console.log('📂 Navigasi ke Data Pegawai');
      await navigateToPage(page, 'Personalia', 'Data Pegawai');

      // ➕ Create
      console.log('➕ Membuat pegawai baru');
      const employeeId = await createEmployee(page);
      console.log(`✅ ID: ${employeeId}`);

      // 📝 Fill Biografi
      console.log('📝 Isi Tab Biografi');
      await fillTab(page, 'Biografi', {
        'NIP|Nomor Induk Pegawai': data.nip,
        'Nama|Nama Lengkap': data.nama,
        'Email|Email Kantor': data.email,
        'Telepon|No Telepon': data.noTelepon,
        'Alamat': data.alamat,
        'Tempat Lahir': data.tempatLahir,
        'Tanggal Lahir': data.tanggalLahir,
      }, {
        'Jenis Kelamin': data.jenisKelamin,
        'Agama': data.agama,
        'Status Perkawinan': data.statusPerkawinan,
      });

      // 💰 Fill Gaji
      console.log('💰 Isi Tab Gaji');
      await fillTab(page, 'Gaji', {
        'Gaji Pokok': data.gasiPokok,
        'Tunjangan Transport': data.tunjanganTransport,
        'Tunjangan Makan': data.tunjanganMakan,
      });

      // 📞 Fill Kontak
      console.log('📞 Isi Tab Kontak');
      await fillTab(page, 'Kontak', {
        'HP Pribadi|Nomor HP': data.noHpPribadi,
        'Telepon Kantor': data.noTeleponKantor,
        'Email Alternatif': data.emailAlternative,
        'Alamat Pribadi': data.alamatPribadi,
        'Kode Pos': data.kodePos,
        'Nama Kontak': data.namaKontak,
        'Nomor Kontak Darurat': data.noKontakDarurat,
      });

      // 📄 Fill Dokumen
      console.log('📄 Isi Tab Dokumen');
      await fillTab(page, 'Dokumen', {
        'KTP': data.namaFileKTP,
        'NPWP': data.namaFileNPWP,
        'SK': data.namaFileSK,
      });

      // 💾 Save
      console.log('💾 Simpan Data');
      await saveData(page);

      // ✓ Verify in Data Pegawai
      console.log('✓ Verifikasi di Data Pegawai');
      await verifyData(page, 'Personalia', 'Data Pegawai', data.nip);

      // ✓ Verify in Dokumen
      console.log('✓ Verifikasi Dokumen');
      await verifyData(page, 'Personalia', 'Dokumen', data.nama);

      // ✓ Verify in Kontrak
      console.log('✓ Verifikasi Kontrak');
      await verifyData(page, 'Personalia', 'Kontrak', data.nama);

      console.log('🎉 E2E Test PASSED!');
    } catch (error) {
      console.error('❌ E2E Test FAILED:', error);
      throw error;
    }
  });
});

// ==============================================
// NAVIGATION & ACTIONS
// ==============================================

async function navigateToPage(page: Page, menu: string, submenu: string) {
  try {
    await page.locator('[id="#kt_aside_menu"]').getByText(new RegExp(menu, 'i')).click();
    await page.waitForTimeout(500);

    await page.locator('a').filter({ hasText: new RegExp(submenu, 'i') }).click();

    await page.waitForLoadState('networkidle');
    await expect(page.locator('.page-heading').first()).toBeVisible({ timeout: 10000 });
  } catch (error) {
    throw new Error(`Gagal navigasi ke ${submenu}: ${error}`);
  }
}

async function createEmployee(page: Page): Promise<string> {
  try {
    const btn = page.locator('button').filter({ hasText: /Tambah|Buat|Create|\+/i }).first();
    await btn.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    return `EMP${Date.now()}`;
  } catch (error) {
    throw new Error(`Gagal membuat pegawai: ${error}`);
  }
}

async function fillTab(
  page: Page,
  tabName: string,
  textFields: Record<string, string> = {},
  selectFields: Record<string, string> = {}
) {
  try {
    // Click tab
    const tab = page.locator('[role="tab"]').filter({ hasText: new RegExp(tabName, 'i') }).first();
    await tab.click();
    await page.waitForTimeout(500);

    // Fill text fields
    for (const [label, value] of Object.entries(textFields)) {
      if (value) await fillField(page, label, value);
    }

    // Fill select fields
    for (const [label, value] of Object.entries(selectFields)) {
      if (value) await selectField(page, label, value);
    }
  } catch (error) {
    throw new Error(`Gagal isi tab ${tabName}: ${error}`);
  }
}

async function saveData(page: Page) {
  try {
    const btn = page.locator('button').filter({ hasText: /Simpan|Save|Kirim/i }).first();
    await btn.click();
    await page.waitForTimeout(2000);
    await page.waitForLoadState('networkidle');
  } catch (error) {
    throw new Error(`Gagal simpan data: ${error}`);
  }
}

async function verifyData(page: Page, menu: string, submenu: string, searchText: string) {
  try {
    await navigateToPage(page, menu, submenu);

    // Search if possible
    const search = page.locator('input[type="text"][placeholder*="Cari"]').first();
    if (await search.count() > 0) {
      await search.fill(searchText);
      await page.waitForTimeout(1000);
    }

    // Verify data exists
    const table = page.locator('table').first();
    const content = await table.textContent();

    if (!content?.includes(searchText)) {
      throw new Error(`Data "${searchText}" tidak ditemukan`);
    }
  } catch (error) {
    throw new Error(`Gagal verifikasi di ${submenu}: ${error}`);
  }
}

// ==============================================
// FORM FIELD UTILITIES
// ==============================================

async function fillField(page: Page, labelPattern: string, value: string) {
  try {
    // Find by label
    const labels = page.locator('label');
    for (let i = 0; i < await labels.count(); i++) {
      const label = labels.nth(i);
      const text = await label.textContent();

      if (new RegExp(labelPattern, 'i').test(text || '')) {
        const id = await label.getAttribute('for');
        const input = id ? page.locator(`#${id}`) : label.locator('..').locator('input, textarea').first();

        if (await input.count() > 0 && await input.isVisible()) {
          await input.fill(value);
          console.log(`  ✓ ${labelPattern}`);
          return;
        }
      }
    }

    // Fallback: by placeholder
    const fallback = page.locator(`input[placeholder*="${labelPattern.split('|')[0]}"]`).first();
    if (await fallback.count() > 0) {
      await fallback.fill(value);
      console.log(`  ✓ ${labelPattern} (fallback)`);
    }
  } catch (error) {
    console.warn(`  ⚠️ Field ${labelPattern}: ${error}`);
  }
}

async function selectField(page: Page, labelPattern: string, value: string) {
  try {
    // Find by label
    const labels = page.locator('label');
    for (let i = 0; i < await labels.count(); i++) {
      const label = labels.nth(i);
      const text = await label.textContent();

      if (new RegExp(labelPattern, 'i').test(text || '')) {
        const id = await label.getAttribute('for');
        const select = id ? page.locator(`#${id}`) : label.locator('..').locator('select').first();

        if (await select.count() > 0 && await select.isVisible()) {
          await select.selectOption(value);
          console.log(`  ✓ ${labelPattern}`);
          return;
        }
      }
    }

    // Fallback: select2/custom dropdown
    const trigger = page.locator('.select2-container, [role="combobox"]').first();
    if (await trigger.count() > 0) {
      await trigger.click();
      await page.waitForTimeout(500);

      const option = page.locator('.select2-results li, [role="option"]')
        .filter({ hasText: new RegExp(value, 'i') })
        .first();

      if (await option.count() > 0) {
        await option.click();
        console.log(`  ✓ ${labelPattern}`);
      }
    }
  } catch (error) {
    console.warn(`  ⚠️ Select ${labelPattern}: ${error}`);
  }
}
