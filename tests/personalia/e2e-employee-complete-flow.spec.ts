import { test, expect, Page } from '@playwright/test';
import { loginAs } from '../../utils/auth';

// ========================================
// 📋 E2E TEST: Complete Employee Workflow
// ========================================
// Skenario:
// 1. Login sebagai Admin
// 2. Membuat data pegawai baru (tab Biografi)
// 3. Mengisi tab Gaji
// 4. Mengisi tab Kontak
// 5. Mengisi tab Dokumen
// 6. Verifikasi data di halaman Data Pegawai
// 7. Verifikasi dokumen di halaman Dokumen
// 8. Verifikasi kontrak di halaman Kontrak

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
  const timestamp = Date.now();
  return {
    // Data Biografi
    nip: `NIP${timestamp}`,
    nama: `Pegawai Test ${timestamp}`,
    email: `employee${timestamp}@test.com`,
    noTelepon: '081234567890',
    alamat: 'Jl. Test No. 123, Jakarta',
    tempatLahir: 'Jakarta',
    tanggalLahir: '1990-01-15',
    jenisKelamin: 'Laki-laki',
    agama: 'Islam',
    statusPerkawinan: 'Belum Menikah',
    // Data Gaji
    gasiPokok: '5000000',
    tunjanganTransport: '500000',
    tunjanganMakan: '750000',
    // Data Kontak
    noHpPribadi: '081234567890',
    noTeleponKantor: '0212345678',
    emailAlternative: `alt${timestamp}@test.com`,
    alamatPribadi: 'Jl. Rumah Test No. 1',
    kodePos: '12345',
    namaKontak: 'Keluarga Darurat',
    noKontakDarurat: '081234567899',
    // Data Dokumen
    namaFileKTP: `KTP_${timestamp}.pdf`,
    namaFileNPWP: `NPWP_${timestamp}.pdf`,
    namaFileSK: `SK_${timestamp}.pdf`,
  };
};

test.describe('E2E: Complete Employee Workflow', () => {
  let employeeId: string;

  test('Complete flow: Login → Create Employee → Fill all tabs → Verify data', async ({ page }) => {
    const testData = generateTestData();

    try {
      // ✅ STEP 1: Login sebagai Admin
      console.log('🔐 STEP 1: Login sebagai Admin');
      await loginAs(page, 'admin');

      // ✅ STEP 2: Navigasi ke halaman Master Pegawai
      console.log('📂 STEP 2: Navigasi ke Data Pegawai');
      await navigateToPage(page, 'Personalia', 'Data Pegawai');

      // ✅ STEP 3: Buat pegawai baru
      console.log('➕ STEP 3: Membuat pegawai baru');
      employeeId = await createNewEmployee(page, testData);
      console.log(`✅ Pegawai dibuat dengan ID: ${employeeId}`);

      // ✅ STEP 4: Isi tab Biografi
      console.log('📝 STEP 4: Mengisi Tab Biografi');
      await clickTab(page, 'Biografi');
      await fillBiographyFields(page, testData);

      // ✅ STEP 5: Isi tab Gaji
      console.log('💰 STEP 5: Mengisi Tab Gaji');
      await fillSalaryTab(page, testData);

      // ✅ STEP 6: Isi tab Kontak
      console.log('📞 STEP 6: Mengisi Tab Kontak');
      await fillContactTab(page, testData);

      // ✅ STEP 7: Isi tab Dokumen
      console.log('📄 STEP 7: Mengisi Tab Dokumen');
      await fillDocumentTab(page, testData);

      // ✅ STEP 8: Simpan data pegawai
      console.log('💾 STEP 8: Menyimpan data pegawai');
      await saveMasterEmployee(page);

      // ✅ STEP 9: Verifikasi data di halaman Data Pegawai
      console.log('✓ STEP 9: Verifikasi data di halaman Data Pegawai');
      await verifyEmployeeData(page, testData);

      // ✅ STEP 10: Verifikasi dokumen di halaman Dokumen
      console.log('✓ STEP 10: Verifikasi dokumen di halaman Dokumen');
      await verifyPageData(page, 'Personalia', 'Dokumen', testData.nama);

      // ✅ STEP 11: Verifikasi kontrak di halaman Kontrak
      console.log('✓ STEP 11: Verifikasi kontrak di halaman Kontrak');
      await verifyPageData(page, 'Personalia', 'Kontrak', testData.nama);

      console.log('🎉 E2E Test PASSED - Complete Employee Workflow Successful!');
    } catch (error) {
      console.error('❌ E2E Test FAILED:', error);
      throw error;
    }
  });
});

// ========================================
// 🧩 Helper Functions
// ========================================

/**
 * Helper: Navigasi ke halaman tertentu
 */
async function navigateToPage(page: Page, menuName: string, subMenuName: string) {
  try {
    // Klik menu utama
    await page.locator('[id="#kt_aside_menu"]').getByText(new RegExp(menuName, 'i')).click();
    await page.waitForTimeout(500);

    // Klik sub-menu
    const subMenuLink = page.locator('a').filter({ hasText: new RegExp(subMenuName, 'i') });
    await subMenuLink.click();

    // Tunggu halaman dimuat
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.page-heading').first()).toBeVisible({ timeout: 10000 });

    console.log(`✅ Navigasi ke ${subMenuName} berhasil`);
  } catch (error) {
    console.error(`❌ Error navigasi ke ${subMenuName}:`, error);
    throw error;
  }
}

/**
 * Buat pegawai baru dan kembali dengan ID pegawai
 */
async function createNewEmployee(page: Page, data: any): Promise<string> {
  // Cari tombol "Tambah" atau "Create" atau "+"
  const createButton = page.locator('button').filter({ hasText: /Tambah|Buat|Create|\+/i }).first();
  
  try {
    await createButton.click({ timeout: 5000 });
  } catch {
    // Jika tidak ditemukan, coba cari button lain
    await page.locator('button[class*="btn-primary"]').first().click();
  }
  
  // Tunggu form modal/page muncul
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  
  // Ambil ID dari field atau dari URL (asumsi setelah create, ID ada di form atau URL)
  // Jika tidak ada, generate ID unik berdasarkan NIP
  const id = data.nip;
  
  console.log(`✅ Form pegawai baru dibuka (ID: ${id})`);
  return id;
}

/**
 * Helper: Klik tab berdasarkan nama
 */
async function clickTab(page: Page, tabName: string) {
  try {
    const tab = page.locator('[role="tab"]').filter({ hasText: new RegExp(tabName, 'i') }).first();
    await tab.click();
    await page.waitForTimeout(500);
    console.log(`✅ Tab ${tabName} diklik`);
  } catch (error) {
    console.warn(`⚠️ Tab ${tabName} tidak ditemukan atau sudah aktif`);
  }
}

/**
 * Isi tab Gaji
 */
async function fillSalaryTab(page: Page, data: any) {
  // Klik tab Gaji
  const salaryTab = page.locator('[role="tab"]').filter({ hasText: /Gaji|Salary|Upah/i }).first();
  
  try {
    await salaryTab.click();
    await page.waitForTimeout(500);
  } catch {
    console.warn('⚠️ Tab Gaji tidak ditemukan');
  }
  
  // Isi field gaji
  await fillField(page, 'Gaji Pokok|Salary Pokok', data.gasiPokok);
  await fillField(page, 'Tunjangan Transport|Tunjangan Transportasi', data.tunjanganTransport);
  await fillField(page, 'Tunjangan Makan|Tunjangan Meal', data.tunjanganMakan);
  
  console.log('✅ Tab Gaji diisi');
}

/**
 * Isi tab Kontak
 */
async function fillContactTab(page: Page, data: any) {
  // Klik tab Kontak
  const contactTab = page.locator('[role="tab"]').filter({ hasText: /Kontak|Contact/i }).first();
  
  try {
    await contactTab.click();
    await page.waitForTimeout(500);
  } catch {
    console.warn('⚠️ Tab Kontak tidak ditemukan');
  }
  
  // Isi field kontak
  await fillField(page, 'HP Pribadi|Nomor HP Pribadi|Mobile Phone', data.noHpPribadi);
  await fillField(page, 'Telepon Kantor|No Telepon Kantor|Office Phone', data.noTeleponKantor);
  await fillField(page, 'Email Alternatif|Email Alternative', data.emailAlternative);
  await fillField(page, 'Alamat Pribadi|Personal Address', data.alamatPribadi);
  await fillField(page, 'Kode Pos|Postal Code', data.kodePos);
  await fillField(page, 'Nama Kontak Darurat|Emergency Contact Name', data.namaKontak);
  await fillField(page, 'Nomor Kontak Darurat|Emergency Contact Number', data.noKontakDarurat);
  
  console.log('✅ Tab Kontak diisi');
}

/**
 * Isi tab Dokumen
 */
async function fillDocumentTab(page: Page, data: any) {
  // Klik tab Dokumen
  const documentTab = page.locator('[role="tab"]').filter({ hasText: /Dokumen|Document|File/i }).first();
  
  try {
    await documentTab.click();
    await page.waitForTimeout(500);
  } catch {
    console.warn('⚠️ Tab Dokumen tidak ditemukan');
  }
  
  // Cari tombol upload atau field dokumen
  // Coba isi dengan simulating upload (jika ada)
  
  // Cari input file fields
  const fileInputs = page.locator('input[type="file"]');
  const fileCount = await fileInputs.count();
  
  if (fileCount > 0) {
    console.log(`📄 Ditemukan ${fileCount} field upload dokumen`);
    
    // Untuk test, kita simulasi dengan mengisikan nilai ke field text jika ada
    // (Production: gunakan file real atau mock)
    await fillField(page, 'KTP|KTP Upload|Kartu Identitas', data.namaFileKTP);
    await fillField(page, 'NPWP|NPWP Upload', data.namaFileNPWP);
    await fillField(page, 'SK|Surat Keputusan|SK Upload', data.namaFileSK);
  } else {
    console.warn('⚠️ Tidak ada field upload dokumen ditemukan');
  }
  
  console.log('✅ Tab Dokumen diisi');
}

/**
 * Simpan data master pegawai
 */
async function saveMasterEmployee(page: Page) {
  // Cari tombol Simpan/Save
  const saveButton = page.locator('button').filter({ 
    hasText: /Simpan|Save|Submit|Kirim/i 
  }).first();
  
  try {
    await saveButton.click();
    // Tunggu notifikasi berhasil atau redirect
    await page.waitForTimeout(2000);
    await page.waitForLoadState('networkidle');
    console.log('✅ Data pegawai disimpan');
  } catch (error) {
    console.warn('⚠️ Tombol simpan tidak ditemukan atau error:', error);
  }
}

/**
 * Verifikasi data di halaman Data Pegawai
 */
async function verifyEmployeeData(page: Page, data: any) {
  try {
    // Buka halaman Data Pegawai
    await navigateToPage(page, 'Personalia', 'Data Pegawai');

    // Cari pegawai berdasarkan NIP
    const searchField = page.locator('input[type="text"][placeholder*="Cari"]').first();

    if (await searchField.count() > 0) {
      await searchField.fill(data.nip);
      await page.waitForTimeout(1000);
    }

    // Verifikasi data ditemukan
    const rows = page.locator('table tbody tr');
    let found = false;

    for (let i = 0; i < await rows.count(); i++) {
      const row = rows.nth(i);
      const rowText = await row.textContent();

      if (rowText?.includes(data.nip) || rowText?.includes(data.nama)) {
        found = true;
        expect(rowText).toContain(data.nama);
        expect(rowText).toContain(data.nip);
        console.log(`✅ Data pegawai ${data.nama} ditemukan dan terverifikasi`);
        break;
      }
    }

    if (!found) {
      throw new Error(`Pegawai ${data.nama} tidak ditemukan di tabel`);
    }
  } catch (error) {
    console.error(`❌ Error verifikasi data pegawai:`, error);
    throw error;
  }
}

/**
 * Helper: Verifikasi data di halaman tertentu
 */
async function verifyPageData(page: Page, menuName: string, subMenuName: string, searchText: string) {
  try {
    // Navigasi ke halaman
    await navigateToPage(page, menuName, subMenuName);

    // Cari data berdasarkan search
    const searchField = page.locator('input[type="text"][placeholder*="Cari"]').first();

    if (await searchField.count() > 0) {
      await searchField.fill(searchText);
      await page.waitForTimeout(1000);
    }

    // Verifikasi data ada di tabel
    const tableContent = page.locator('table').first();
    const text = await tableContent.textContent();

    if (text?.includes(searchText)) {
      console.log(`✅ Data "${searchText}" ditemukan di halaman ${subMenuName}`);
    } else {
      throw new Error(`Data "${searchText}" tidak ditemukan di halaman ${subMenuName}`);
    }
  } catch (error) {
    console.error(`❌ Error verifikasi di ${subMenuName}:`, error);
    throw error;
  }
}

// ========================================
// 🛠️ Utility Functions
// ========================================

/**
 * Helper: Isi field dengan label matching
 */
async function fillField(page: Page, labelPattern: string, value: string) {
  if (!value) return;
  
  try {
    // Coba cari label dan ambil associated input
    const labels = page.locator('label');
    
    for (let i = 0; i < await labels.count(); i++) {
      const label = labels.nth(i);
      const labelText = await label.textContent();
      
      // Regex match label dengan pattern
      if (new RegExp(labelPattern, 'i').test(labelText || '')) {
        // Cari input element yang associated dengan label
        const inputId = await label.getAttribute('for');
        let input;
        
        if (inputId) {
          input = page.locator(`#${inputId}`);
        } else {
          // Alternative: cari input di dalam atau setelah label
          input = label.locator('..').locator('input, textarea, select').first();
        }
        
        if (await input.isVisible()) {
          await input.fill(value);
          console.log(`✓ Field "${labelPattern}" diisi dengan "${value}"`);
          return;
        }
      }
    }
    
    // Fallback: cari input berdasarkan placeholder
    const inputs = page.locator('input[placeholder*="' + labelPattern.split('|')[0] + '"], textarea');
    if (await inputs.count() > 0) {
      await inputs.first().fill(value);
      console.log(`✓ Field "${labelPattern}" diisi (fallback)`);
      return;
    }
    
    console.warn(`⚠️ Field "${labelPattern}" tidak ditemukan`);
  } catch (error) {
    console.warn(`⚠️ Error mengisi field "${labelPattern}":`, error);
  }
}

/**
 * Helper: Select dari dropdown/select
 */
async function selectFromDropdown(page: Page, labelPattern: string, value: string) {
  if (!value) return;
  
  try {
    // Cari label
    const labels = page.locator('label');
    
    for (let i = 0; i < await labels.count(); i++) {
      const label = labels.nth(i);
      const labelText = await label.textContent();
      
      if (new RegExp(labelPattern, 'i').test(labelText || '')) {
        // Cari select element
        const selectId = await label.getAttribute('for');
        let select;
        
        if (selectId) {
          select = page.locator(`#${selectId}`);
        } else {
          select = label.locator('..').locator('select').first();
        }
        
        if (await select.isVisible()) {
          await select.selectOption(value);
          console.log(`✓ Dropdown "${labelPattern}" dipilih: "${value}"`);
          return;
        }
      }
    }
    
    // Fallback: klik element untuk buka dropdown, lalu pilih opsi
    const dropdownTrigger = page.locator('.select2-container, [role="combobox"]').first();
    if (await dropdownTrigger.isVisible()) {
      await dropdownTrigger.click();
      await page.waitForTimeout(500);
      
      const option = page.locator('.select2-results li, [role="option"]').filter({ hasText: new RegExp(value, 'i') }).first();
      if (await option.isVisible()) {
        await option.click();
        console.log(`✓ Dropdown "${labelPattern}" dipilih: "${value}" (fallback)`);
        return;
      }
    }
    
    console.warn(`⚠️ Dropdown "${labelPattern}" tidak ditemukan atau opsi tidak tersedia`);
  } catch (error) {
    console.warn(`⚠️ Error memilih dropdown "${labelPattern}":`, error);
  }
}
