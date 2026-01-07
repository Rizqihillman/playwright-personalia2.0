import { Page, expect } from '@playwright/test';
import dotenv from 'dotenv';

// 🔧 Load environment sesuai ENV
dotenv.config({
  path: process.env.ENV === 'staging' ? '.env.staging' : '.env.dev',
});

// 🧠 Tipe user
type UserRole = 'admin' | 'hr' | 'employee';

// 🔑 Ambil kredensial dari .env
const credentials = {
  admin: {
    username: process.env.ADMIN_USER!,
    password: process.env.ADMIN_PASS!,
  },
  hr: {
    username: process.env.HR_USER!,
    password: process.env.HR_PASS!,
  },
  employee: {
    username: process.env.EMP_USER!,
    password: process.env.EMP_PASS!,
  },
};

// 🖱️ Simulasi gerakan mouse (untuk reCAPTCHA atau aktivitas manusia)
async function simulateMouseMovement(page: Page, label?: string) {
  console.log(`🖱️ Simulasi gerakan mouse ${label ? `(${label})` : ''}...`);
  const { width, height } = page.viewportSize() || { width: 1280, height: 720 };

  for (let i = 0; i < 5; i++) {
    const x = Math.floor(Math.random() * width * 0.8);
    const y = Math.floor(Math.random() * height * 0.8);
    await page.mouse.move(x, y, { steps: 10 });
    await page.waitForTimeout(300);
  }

  await page.waitForTimeout(2000);
}

// 🚀 Fungsi utama login
export async function loginAs(page: Page, role: UserRole) {
  const baseUrl = process.env.BASE_URL || 'https://dev.personalia.arkamaya.net';
  const user = credentials[role];

  if (!user.username || !user.password) {
    throw new Error(`❌ Missing credentials for role: ${role}`);
  }

  console.log(`🌐 Membuka halaman login untuk role: ${role}`);
  await page.goto(`${baseUrl}/sign-in`, {
    waitUntil: 'networkidle',
    timeout: 60000,
  });

  console.log('✍️ Mengisi form login...');
  await page.getByRole('textbox', { name: 'Email' }).fill(user.username);
  await page.getByRole('textbox', { name: 'Password' }).fill(user.password);

  console.log('🚪 Klik tombol Masuk...');
  await page.getByRole('button', { name: /Masuk/i }).click();

  // 🖱️ Gerakkan mouse SETELAH klik masuk
  await simulateMouseMovement(page, 'setelah klik Masuk');

  // 💬 Tunggu popup “Ok, mengerti!”
  const okButton = page.getByRole('button', { name: /Ok, mengerti!/i });

  try {
    console.log('💬 Menunggu popup “Ok, mengerti!”...');
    await okButton.waitFor({ state: 'visible', timeout: 20000 });

    // 🖱️ Gerakkan mouse lagi SETELAH popup muncul
    await simulateMouseMovement(page, 'setelah popup muncul');

    await okButton.click();
    console.log('✅ Popup diklik.');
  } catch {
    console.warn('⚠️ Popup “Ok, mengerti!” tidak muncul, lanjut ke dashboard.');
  }

  // 🔄 Tunggu redirect ke dashboard
  console.log('⏳ Menunggu redirect ke dashboard...');
  await expect(page.locator('.page-heading', { hasText: 'Dashboard' })).toBeVisible({ timeout: 30000 });
  await page.waitForLoadState('networkidle');

  // ✅ Verifikasi dashboard tampil
  const dashboardHeading = page.locator('#kt_toolbar_container h1.page-heading', {
    hasText: /Dashboard|Dasbor/i,
  });
  await expect(dashboardHeading).toBeVisible({ timeout: 30000 });

  console.log(`🎉 Login berhasil sebagai ${role}, dashboard tampil!`);
}
