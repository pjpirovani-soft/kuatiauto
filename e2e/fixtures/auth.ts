import { Page, expect } from "@playwright/test";

/**
 * Login E2E reusable. Navega a /login, llena email/password, click Entrar.
 * NO espera redirect — cada test decide a qué ruta esperar.
 */
export async function loginAs(page: Page, email: string, password: string) {
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
}

/**
 * Credenciales tipadas desde env. Falla explícitamente si faltan.
 * Uso: const creds = getCreds("E2E_USER_PROPIETARIO");
 */
export function getCreds(prefix: string): { email: string; password: string } {
  const email = process.env[`${prefix}_EMAIL`];
  const password = process.env[`${prefix}_PASSWORD`];
  if (!email || !password) {
    throw new Error(`Faltan ${prefix}_EMAIL / ${prefix}_PASSWORD en .env.e2e.local`);
  }
  return { email, password };
}