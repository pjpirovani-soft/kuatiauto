import { test, expect } from "@playwright/test";

const email = process.env.E2E_USER_PROPIETARIO_B_EMAIL;
const password = process.env.E2E_USER_PROPIETARIO_B_PASSWORD;

test.describe("Smoke: login propietario B (prod)", () => {
  test.skip(!email || !password, "Faltan E2E_USER_PROPIETARIO_B_EMAIL / _PASSWORD en .env.e2e.local");

  test("login exitoso redirige a /clientes", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });

    await page.locator("#email").fill(email!);
    await page.locator("#password").fill(password!);
    await page.getByRole("button", { name: "Entrar", exact: true }).click();

    await page.waitForURL("**/clientes", { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: /clientes/i })).toBeVisible();
  });
});