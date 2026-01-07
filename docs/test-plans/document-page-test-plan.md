# Test Plan: Halaman Dokumen — https://dev.personalia.arkamaya.net/document

Terakhir diperbarui: 2025-10-28

## Ringkasan Eksekutif

Halaman "Dokumen" pada aplikasi Personalia adalah pusat manajemen berkas internal (unduh, preview, pencarian). Rencana pengujian ini bertujuan untuk memverifikasi fungsionalitas inti, validasi input, penanganan error, keamanan akses, dan aksesibilitas. Tes akan mencakup skenario manual dan kandidat otomatisasi untuk Playwright e2e.

Asumsi:
- Pengujian dilakukan di lingkungan `dev` dengan URL: `https://dev.personalia.arkamaya.net/document`.
- Akun uji memiliki hak akses yang sesuai (admin / user biasa) sesuai kebutuhan skenario.
- File yang digunakan untuk unggah disimpan di mesin penguji dan memenuhi batas ukuran/tipe yang diuji.
- State dimulai dari sesi browser bersih (cookies/cache kosong) kecuali disebutkan.

## Kontrak Singkat
- Input: file (pdf, docx, png, jpg, txt, dll), metadata (nama, tag, folder), perintah UI (klik, drag-drop).
- Output: file tersimpan di server, preview ditampilkan, list diperbarui, notifikasi sukses/gagal.
- Error modes: ukuran file melebihi batas, tipe file tidak didukung, koneksi putus, akses ditolak.

## Elemen UI yang Diperiksa
- Tombol/aksi: "Unggah Dokumen", "Buat Folder", "Upload", "Download", "Preview", "Hapus", "Pindah", "Rename", "Bagikan".
- Input: field pencarian, filter (tipe, tanggal, tag), input upload file (file input atau area drag-drop).
- List/Table dokumen: nama file, tipe, ukuran, tanggal diunggah, aksi (ikon).
- Pagination / infinite scroll / load more.
- Notifikasi / toast messages.
- Modal konfirmasi (hapus, overwrite).
- Indikator loading / progress bar (unggah besar).

## Alur Pengguna Utama
1. Melihat daftar dokumen (sorting, pagination, preview metadata).
2. Mengunggah dokumen (single & multiple) dan melihat progress serta hasil.
3. Mencari dan memfilter dokumen.
4. Mengunduh dan melihat preview dokumen.
5. Mengelola dokumen (rename, move folder, delete) dengan konfirmasi.
6. Berbagi dokumen (generate link atau atur permission).

## Skenario Pengujian (Detail)

Catatan: semua skenario berasumsi dimulai pada halaman `https://dev.personalia.arkamaya.net/document` dengan session bersih.

### 1. Lihat daftar dokumen — happy path
Asumsi: Terdapat beberapa dokumen di folder default.

Langkah:
1. Buka halaman Dokumen.
2. Amati daftar dokumen pertama.
3. Klik header kolom untuk mengurutkan (Nama/Tanggal/Ukuran).

Expected Results:
- Daftar dokumen tampil dengan kolom yang benar.
- Sorting bekerja dan urutan berubah sesuai kolom dipilih.

### 2. Unggah file tunggal (small file)

Langkah:
1. Klik "Unggah Dokumen" atau seret file (contoh: sample.pdf) ke area upload.
2. Konfirmasi upload jika ada dialog.

Expected Results:
- Progress muncul singkat lalu notifikasi sukses.
- File muncul di daftar dengan metadata (nama, ukuran, tanggal).

### 3. Unggah multiple files (batch)

Langkah:
1. Pilih lebih dari satu file (mis. a.pdf, b.png, c.docx) lalu upload.

Expected Results:
- Progress per-file (atau overall) terlihat.
- Semua file yang valid muncul di daftar.
- Untuk file yang gagal (tipe tidak diperbolehkan), tampil pesan error per-file.

### 4. Unggah file besar (stress / progress)

Langkah:
1. Upload file >50MB (atau mendekati batas yang dikonfigurasikan).

Expected Results:
- Progress bar akurat, upload tidak time out jika jaringan stabil.
- Jika melebihi batas server, muncul pesan yang menjelaskan batas dan upload dibatalkan.

### 5. Unggah jenis file yang tidak didukung

Langkah:
1. Upload file dengan ekstensi yang diblokir (.exe, .bat).

Expected Results:
- Upload ditolak client-side atau server-side dengan pesan jelas (mis. "Tipe file tidak didukung").

### 6. Drag & Drop behavior

Langkah:
1. Seret file dari desktop ke area drag-drop.

Expected Results:
- Area menerima file dan menampilkan preview kecil atau nama file.
- Upload berjalan setelah drop atau after confirm.

### 7. Preview dokumen (PDF/IMAGE)

Langkah:
1. Klik ikon "Preview" pada baris dokumen untuk file PDF atau image.

Expected Results:
- Modal atau panel preview muncul menampilkan isi dokumen.
- Zoom/scroll bekerja untuk PDF; images dapat di-zoom.

### 8. Download dokumen

Langkah:
1. Klik tombol "Download" pada dokumen.

Expected Results:
- Browser memulai download file dengan nama yang benar.

### 9. Rename dokumen

Langkah:
1. Pilih action rename pada dokumen, isi nama baru, simpan.

Expected Results:
- Nama di daftar berubah; tidak boleh mengganti menjadi nama yang sudah ada (error handled).

### 10. Hapus dokumen (confirm)

Langkah:
1. Klik "Hapus" pada dokumen, konfirmasi dialog.

Expected Results:
- Modal konfirmasi muncul dengan pesan yang jelas.
- Setelah konfirmasi, dokumen hilang dari daftar dan ada notifikasi sukses.

### 11. Pindah dokumen (move folder)

Langkah:
1. Pilih "Pindah" → pilih folder tujuan → konfirmasi.

Expected Results:
- Dokumen berpindah ke folder tujuan; daftar di tiap folder konsisten.

### 12. Search & Filter

Langkah:
1. Ketik query pada field pencarian (nama file, tag).
2. Gunakan filter tipe/tanggal untuk mempersempit.

Expected Results:
- Hanya dokumen yang cocok yang muncul.
- Pagination dan counts diperbarui.

### 13. Permission / Role checks (admin vs user biasa)

Langkah:
1. Login sebagai user biasa: coba akses fitur admin-only (hapus/pindah/share jika terbatas).
2. Login sebagai admin: pastikan fitur tersedia.

Expected Results:
- User tanpa permission tidak melihat/merasa tombol/aksi yang memerlukan permission dan mendapat status 403 jika memanggil API secara langsung.

### 14. Concurrent access / race conditions

Langkah:
1. Di dua sesi browser, lakukan tindakan conflicting (menghapus pada sesi A, mengganti nama pada sesi B) hampir bersamaan.

Expected Results:
- Aplikasi menolak tindakan yang tidak valid (mis. rename di dokumen yang sudah dihapus) dan menampilkan pesan yang informatif.

### 15. Audit / versioning checks (jika tersedia)

Langkah:
1. Unggah versi baru dari dokumen yang sama (overwrite/versioning flow).

Expected Results:
- Aplikasi menyimpan versi, menampilkan riwayat versi, dan memungkinkan rollback jika fitur ada.

### 16. Accessibility smoke (keyboard & screen reader)

Langkah:
1. Akses halaman via keyboard; tab order harus konsisten.
2. Pastikan tombol/inputs memiliki label terkait (aria-label/for).

Expected Results:
- Semua kontrol dapat diakses via keyboard; pembaca layar dapat membaca label/error.

## Data Uji (Contoh)
- sample-small.pdf (20KB)
- sample-image.jpg (500KB)
- sample-large.zip (60MB)
- forbidden.exe
- nama-folder-tujuan: "HR Files"

## Kriteria Sukses & Kegagalan
- Sukses: Semua skenario fungsional dasar lulus (unggah/download/preview/search/delete).
- Kegagalan: data corruption, file tidak dapat diunduh, operasi admin dapat diakses user tanpa permission, atau aplikasi crash pada kondisi edge.

## Kandidat Otomasi Playwright
- Upload single file (happy path)
- Upload multiple files
- Search & filter
- Preview PDF/Image
- Delete file with confirmation
- Permission smoke tests (admin vs user)

## Rekomendasi Eksekusi
- Manual exploratory: jalankan seluruh skenario 1x pada environment dev.
- Otomasi: prioritaskan 4–6 Playwright e2e tests untuk regression (unggah, unduh, search, delete).
- Monitoring: tambahkan alert pada server-side untuk failed uploads dan rate of failed downloads.

## Catatan & Follow-up
- Jika fitur sharing menghasilkan public link, tambahkan skenario keamanan (link expiry, token, akses anonim).
- Jika ada integrasi virus-scan atau S3 presigned URLs, tes alur storage/staging terpisah.

---
File ini dibuat berdasarkan permintaan: rencana pengujian untuk halaman Dokumen.
