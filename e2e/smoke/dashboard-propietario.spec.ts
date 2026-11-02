import { test, expect } from "@playwright/test";
import { loginAs, getCreds } from "../fixtures/auth";

test.describe("Smoke: dashboard propietario (prod)", () => {
  test("login propietario → /dashboard carga panel principal", async ({ page }) => {
    const { email, password } = getCreds("E2E_USER_PROPIETARIO");
    await loginAs(page, email, password);
    await page.waitForURL("**/clientes", { timeout: 15_000 });

    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /^Panel Principal$/ })).toBeVisible();
  });
});