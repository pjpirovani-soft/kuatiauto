import { test, expect } from "@playwright/test";
import { loginAs, getCreds } from "../fixtures/auth";

test.describe("Smoke: panel analytics admin (prod)", () => {
  test("login admin → /admin/analytics carga métricas globales", async ({ page }) => {
    const { email, password } = getCreds("E2E_USER_ADMIN");
    await loginAs(page, email, password);
    await page.waitForURL("**/admin", { timeout: 15_000 });

    await page.goto("/admin/analytics", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /^Métricas Globales$/ })).toBeVisible();
  });
});