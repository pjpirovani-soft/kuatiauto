import { test, expect } from '@playwright/test';
import { loginAs, getCreds } from '../fixtures/auth';

test.describe('Smoke: /perfil (prod)', () => {
  test('sin sesion redirige a /login', async ({ page }) => {
    await page.goto('/perfil', { waitUntil: 'domcontentloaded' });
    await page.waitForURL('**/login**', { timeout: 15_000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('con sesion propietario carga el perfil', async ({ page }) => {
    const { email, password } = getCreds('E2E_USER_PROPIETARIO');
    await loginAs(page, email, password);
    await page.waitForURL('**/clientes', { timeout: 15_000 });

    await page.goto('/perfil', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: /^Mi perfil$/ })).toBeVisible();
    await expect(page.getByText(email).first()).toBeVisible();
  });
});