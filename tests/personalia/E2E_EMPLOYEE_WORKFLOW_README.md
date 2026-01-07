# E2E Test: Complete Employee Workflow

## 📋 Deskripsi

Test script ini mengotomatisasi complete flow pembuatan dan verifikasi data pegawai:

1. **Login** - Masuk sebagai Admin
2. **Buat Pegawai Baru** - Membuat record pegawai baru di halaman Data Pegawai
3. **Isi Tab Biografi** - Mengisi informasi pribadi (NIP, nama, email, alamat, dll)
4. **Isi Tab Gaji** - Mengisi informasi kompensasi (gaji pokok, tunjangan, dll)
5. **Isi Tab Kontak** - Mengisi informasi kontak (HP, email alternatif, kontak darurat, dll)
6. **Isi Tab Dokumen** - Mengisi dokumen pegawai (KTP, NPWP, SK, dll)
7. **Verifikasi Data** - Cek data pegawai terlihat di halaman Data Pegawai
8. **Verifikasi Dokumen** - Cek dokumen terlihat di halaman Dokumen
9. **Verifikasi Kontrak** - Cek kontrak terlihat di halaman Kontrak

## 🚀 Cara Menjalankan

### Jalankan satu test:
```bash
npx playwright test tests/personalia/e2e-employee-complete-flow.spec.ts
```

### Jalankan dengan UI mode (lebih interaktif):
```bash
npx playwright test tests/personalia/e2e-employee-complete-flow.spec.ts --ui
```

### Jalankan dengan debug mode:
```bash
npx playwright test tests/personalia/e2e-employee-complete-flow.spec.ts --debug
```

### Jalankan di browser tertentu (contoh: Chrome):
```bash
npx playwright test tests/personalia/e2e-employee-complete-flow.spec.ts --project=chromium
```

### Jalankan dengan headed mode (bisa lihat browser):
```bash
npx playwright test tests/personalia/e2e-employee-complete-flow.spec.ts --headed
```

## 📊 Test Flow Diagram

```
┌─────────────────────────────────────────────┐
│  Login sebagai Admin                        │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│  Navigasi ke Data Pegawai                   │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│  Buat Pegawai Baru                          │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│  Isi Tab Biografi (NIP, Nama, Email, dll)  │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│  Isi Tab Gaji (Gaji Pokok, Tunjangan)      │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│  Isi Tab Kontak (HP, Email, Kontak Darurat)│
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│  Isi Tab Dokumen (KTP, NPWP, SK)           │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│  Simpan Data Pegawai                        │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│  Verifikasi di Halaman Data Pegawai         │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│  Verifikasi Dokumen di Halaman Dokumen      │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│  Verifikasi Kontrak di Halaman Kontrak      │
└──────────────┬──────────────────────────────┘
               │
               ▼
          ✅ TEST PASSED
```

## 🔧 Struktur Test

```typescript
test.describe('E2E: Complete Employee Workflow', () => {
  // Test case: Complete flow login → create → fill tabs → verify
  test('Complete flow: Login → Create Employee → Fill all tabs → Verify data', async ({ page }) => {
    // 1. Login
    // 2. Navigate
    // 3. Create
    // 4. Fill Tabs
    // 5. Verify
  });
});
```

## 📝 Test Data

Test menggunakan data yang di-generate secara random dengan timestamp untuk menghindari konflik:

```typescript
const testData = {
  nip: `NIP${Date.now()}`,              // Unique berdasarkan timestamp
  nama: `Pegawai Test ${Date.now()}`,   // Unique nama
  email: `employee${Date.now()}@test.com`, // Unique email
  // ... field lainnya
};
```

## 🎯 Helper Functions

Script menyediakan helper functions untuk memudahkan pengisian form:

### `fillField(page, labelPattern, value)`
Mengisi text field berdasarkan label pattern. Menggunakan regex matching untuk fleksibilitas.

**Contoh:**
```typescript
await fillField(page, 'NIP|Nomor Induk Pegawai', '12345678');
await fillField(page, 'Nama|Nama Lengkap', 'John Doe');
```

### `selectFromDropdown(page, labelPattern, value)`
Memilih opsi dari dropdown/select berdasarkan label pattern.

**Contoh:**
```typescript
await selectFromDropdown(page, 'Jenis Kelamin', 'Laki-laki');
await selectFromDropdown(page, 'Agama', 'Islam');
```

## ⚙️ Kustomisasi

Untuk menyesuaikan dengan form Anda yang spesifik:

### 1. Update Test Data
Edit bagian `const testData = {}` dengan field dan value sesuai form Anda:
```typescript
const testData = {
  nip: `NIP${Date.now()}`,
  nama: `Pegawai Test ${Date.now()}`,
  // ... tambah field sesuai form Anda
};
```

### 2. Ubah Label Pattern
Jika field Anda punya label berbeda, update pattern di `fillField()` dan `selectFromDropdown()`:
```typescript
// Jika label asli: "Nomor Identitas Pribadi" bukan "NIP"
await fillField(page, 'Nomor Identitas Pribadi', data.nip);
```

### 3. Handle Special Fields
Jika ada field dengan behavior khusus (date picker, file upload, custom component), ubah bagian yang relevan:
```typescript
// Contoh: untuk date picker
const datePicker = page.locator('[id="tanggalLahir"]');
await datePicker.click();
await page.locator('[aria-label*="' + targetDate + '"]').click();
```

## ✅ Assertions

Test menggunakan Playwright `expect()` untuk verifikasi:
- Data pegawai terlihat di tabel
- Nama pegawai ditemukan saat search
- Halaman navigasi berhasil

## 🐛 Troubleshooting

### Timeout errors
- Pastikan selectors sesuai dengan HTML Anda
- Tingkatkan timeout di `.expect()` atau `.waitFor()`

### Field tidak ditemukan
- Inspect element di browser dan verifikasi label/placeholder text
- Update `fillField()` labelPattern sesuai text asli

### Navigation errors
- Verifikasi menu text sesuai dengan text di halaman
- Pastikan menu visible sebelum di-click

## 📊 Expected Output

Saat test berjalan, Anda akan melihat log seperti:

```
🔐 STEP 1: Login sebagai Admin
✅ Login berhasil sebagai admin, dashboard tampil!
📂 STEP 2: Navigasi ke Data Pegawai
✅ Navigasi ke Data Pegawai berhasil
➕ STEP 3: Membuat pegawai baru
✅ Form pegawai baru dibuka (ID: NIP1700234567890)
📝 STEP 4: Mengisi Tab Biografi
✓ Field "NIP|Nomor Induk Pegawai" diisi dengan "NIP1700234567890"
✓ Field "Nama|Nama Lengkap" diisi dengan "Pegawai Test 1700234567890"
... (lebih banyak logs)
✓ STEP 9: Verifikasi data di halaman Data Pegawai
✅ Data pegawai Pegawai Test 1700234567890 ditemukan dan terverifikasi
... (verifikasi dokumen dan kontrak)
🎉 E2E Test PASSED - Complete Employee Workflow Successful!
```

## 🔄 Continuous Integration

Untuk menjalankan test di CI/CD pipeline:

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install
      - run: npx playwright test tests/personalia/e2e-employee-complete-flow.spec.ts
```

## 📚 Referensi

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Test API](https://playwright.dev/docs/api/class-test)
- [Selectors Best Practices](https://playwright.dev/docs/locators)
