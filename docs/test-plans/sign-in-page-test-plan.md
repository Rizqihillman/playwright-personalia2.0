# Test Plan: Halaman Sign-In — https://dev.personalia.arkamaya.net/sign-in

Terakhir diperbarui: 2025-10-27

## Ringkasan Eksekutif

Dokumen ini berisi rencana pengujian terperinci untuk halaman Sign-In aplikasi Personalia (development). Tujuan utama: memastikan pengguna dapat masuk dengan kredensial valid, memverifikasi penanganan kesalahan (invalid credentials, field kosong, format email salah), dan mengecek alur terkait (Forgot Password, tautan pendaftaran, perilaku "Remember me").

Asumsi awal:
- Pengujian dimulai dari state browser bersih (cache/session cookies kosong) kecuali disebutkan lain.
- Endpoint: `https://dev.personalia.arkamaya.net/sign-in` tersedia dari lingkungan pengujian.
- Akun uji sudah dibuat di lingkungan dev atau kredensial tes disediakan oleh tim.

## Kontrak Singkat (Inputs / Outputs / Error Modes)
- Input: email/username dan password (string).
- Output: redirect ke dashboard saat sukses; error message di-place pada UI saat gagal.
- Error modes: kredensial salah, akun terkunci, format input tidak valid, validasi sisi-klien dan sisi-server.

## Elemen UI dan Interaktif yang Diperiksa
- Field "Email" / "Username" (atribut name/id jika tersedia)
- Field "Password"
- Tombol "Sign In" / "Masuk"
- Checkbox "Remember me" (jika ada)
- Link "Forgot password?" / "Lupa kata sandi"
- Link "Sign up" / "Daftar" atau tautan ke halaman lain
- Tampilan pesan error/alert (inline validation dan banner)
- Indikator loading / disabled state saat permintaan sedang diproses

## Alur Pengguna Utama (Primary User Journeys)
1. Masuk sukses (happy path): user memasukkan email valid dan password yang benar, kemudian diarahkan ke dashboard.
2. Lupa kata sandi: user mengklik "Lupa kata sandi?" dan diarahkan ke alur reset.
3. Kredensial salah: sistem menampilkan pesan error yang jelas.
4. Akun terkunci setelah percobaan masuk berulang (jika diimplementasikan).
5. 3 kali salah maka harus menunggu selama 1 menit
6. 3 kali salah dengan email yang tidak terdaftar maka IP nya akan ke block

## Skenario Pengujian (Detail)

Catatan: setiap skenario berasumsi dimulai dari halaman Sign-In dengan session bersih.

### 1. Sukses — Login dengan kredensial valid
Asumsi: Akun tes tersedia (email: `admin@techcorp.com`, password: `*!satu2tiga!*S`)

Langkah:
1. Buka `https://dev.personalia.arkamaya.net/sign-in`.
2. Masukkan `admin@techcorp.com` pada field Email.
3. Masukkan `*!satu2tiga!*S` pada field Password.
4. Klik tombol "Masuk".

Expected Results:
- Tombol menampilkan state loading (disabled) saat request berjalan.
- User diarahkan ke halaman dashboard atau landing page setelah login.
- Session/cookie otorisasi diset (untuk cek: presence of auth cookie / localStorage token).

Success criteria:
- Redirect selesai dalam waktu yang wajar (<5s pada lingkungan dev).
- Tidak muncul pesan error.

### 2. Gagal — Password salah

Langkah:
1. Buka halaman Sign-In.
2. Masukkan email valid (`user.test@example.com`).
3. Masukkan password yang salah (`wrong-password`).
4. Klik "Masuk".

Expected Results:
- Muncul pesan pop up error jelas (mis. "Kredensial tidak valid").
- Field password dikosongkan atau tetap (sesuaikan dengan kebijakan), dan fokus ke field password.
- Tidak diarahkan ke dashboard.

### 3. Gagal — Email tidak terdaftar

Langkah:
1. Masukkan `not.exists@example.com` sebagai email.
2. Masukkan sembarang password.
3. Klik "Masuk".

Expected Results:
- Muncul pesan error yang menyebutkan bahwa akun tidak ditemukan atau kredensial salah.

### 4. Validasi sisi-klien — Field kosong

Langkah:
1. Buka halaman Sign-in.
2. Klik tombol "Masuk" tanpa mengisi apapun.

Expected Results:
- Inline validation muncul: "Email harus diisi" dan/atau "Kata sandi wajib diisi.".
- Tombol tidak mengirim request jika validasi sisi-klien gagal.

### 5. Validasi format — Email tidak valid

Langkah:
1. Masukkan `invalid-email-format` di field email.
2. Isi password dan klik "Masuk".

Expected Results:
- Muncul pesan validasi format email (mis. "Email tidak valid. Gunakan format email yang benar.").
- Tidak ada panggilan ke API otentikasi sampai format valid.

### 6. Percobaan berulang — Akun terkunci (jika fitur tersedia)

Langkah:
1. Dengan akun valid, lakukan 3 percobaan login berturut-turut dengan password salah.

Expected Results:
- Setelah ambang (5 percobaan), akun dikunci sementara dan pesan sesuai ditampilkan (mis. "Terlalu banyak percobaan masuk, silakan coba lagi dalam 60 detik.").
- Permintaan login berikutnya ditolak meskipun password benar sampai batas unlock.

### 7. Forgot Password link

Langkah:
1. Klik link "Lupa Kata Sandi?" dari halaman Sign-In.

Expected Results:
- Dialihkan ke halaman Lupa Kata Sandi.
- Form reset meminta email dan menampilkan konfirmasi setelah submit (mis. "Link reset telah dikirim ke email Anda").

### 8. Remember Me behavior

Langkah:
1. Login dengan opsi "Remember me" dicentang.
2. Tutup browser dan buka ulang (atau buka di tab baru) lalu buka aplikasi.

Expected Results:
- Jika fitur diimplementasikan, user tetap login atau token persist untuk sesi yang lebih panjang.

### 9. Link navigasi / Sign up

Langkah:
1. Klik link "Sign up" (jika ada).

Expected Results:
- Dialihkan ke halaman pendaftaran.

### 10. Keamanan dasar (manual smoke/security tests)
- Input panjang (very long strings) harus ditangani tanpa crash.
- Percobaan injection (SQL/JS) harus di-sanitize; aplikasi tidak mengembalikan stack trace.
- Rate limiting: bila banyak permintaan dalam waktu singkat, server menolak/menaikkan status 429.

### 11. Aksesibilitas
- Semua field harus fokus-able via keyboard (tab order).
- Label terkait input (aria-label atau <label for=>) harus ada.
- Error messages harus terasosiasi ke input (aria-describedby) untuk pembaca layar.

## Data Uji (Contoh)
- Valid user: `admin@techcorp.com` / `*!satu2tiga!*S*`
- Invalid user: `noone@example.com` / `any`
- Edge: extremely long email string ( > 1000 chars )

## Kriteria Sukses & Kegagalan
- Sukses: Semua skenario kritikal (login sukses, invalid credentials, validation) lulus.
- Kegagalan: Ada regressions yang menghalangi pengguna untuk login dengan kredensial valid atau aplikasi memaparkan data sensitif.

## Kandidat Otomasi
- Happy path login (unit e2e)
- Invalid credentials
- Empty fields validation
- Forgot password redirection
- Accessibility smoke tests (tab order, labels)

## Rekomendasi Eksekusi
- Jalankan skenario manual sekali pada environment dev untuk verifikasi fungsionalitas.
- Buat 4-6 e2e tests otomatis di Playwright (happy path, wrong password, empty fields, forgot-password redirect).
- Tambahkan monitoring untuk failed logins rate (telemetry) di environment staging.

## Catatan & Follow-up
- Jika ada fitur SSO atau MFA, tambahkan skenario terpisah.
- Verifikasi juga behavior untuk pengguna dengan role berbeda (admin vs employee) bila relevan.

---
File ini dibuat oleh planner agent berdasarkan permintaan: rencana pengujian untuk halaman Sign-In.
