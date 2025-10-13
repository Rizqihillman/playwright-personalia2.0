import { Page } from '@playwright/test';
import dotenv from 'dotenv';

// Baca ENV dari file sesuai ENVIRONMENT (default: dev)
dotenv.config({
  path: process.env.ENV === 'staging' ? '.env.staging' : '.env.dev'
});

type UserRole = 'admin' | 'hr' | 'employee';

const credentials = {
  admin: {
    username: process.env.ADMIN_USER!,
    password: process.env.ADMIN_PASS!
  },
  hr: {
    username: process.env.HR_USER!,
    password: process.env.HR_PASS!
  },
  employee: {
    username: process.env.EMP_USER!,
    password: process.env.EMP_PASS!
  }
};

export async function loginAs(page: Page, role: UserRole) {
  const user = credentials[role];
  if (!user.username || !user.password) {
    throw new Error(`Missing credentials for role: ${role}`);
  }

  await page.goto(`${process.env.BASE_URL}/sign-in`);
  await page.getByPlaceholder('Email').fill(user.username);
  await page.getByPlaceholder('password').fill(user.password);
  await page.click('#kt_sign_in_submit');

  // Jika ada popup SweetAlert
  const okButton = page.locator('button.swal2-confirm');
  if (await okButton.isVisible({ timeout: 5000 })) {
    await okButton.click();
  }

  // Tunggu sampai URL berpindah ke halaman utama
  await page.waitForURL(/personalia\.arkamaya\.net/, { timeout: 20000 });
}
