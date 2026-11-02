import { test, expect } from "@playwright/test";

test.describe("Smoke: Centro de Ayuda (prod)", () => {
  test("hub /ayuda carga con las 3 tarjetas de rol", async ({ page }) => {
    await page.goto("/ayuda", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /Centro de Ayuda/i, level: 1 })).toBeVisible();
    // Verificar los 3 links (el nombre incluye la descripción, por eso regex sin ancla)
    await expect(page.getByRole("link", { name: /Propietario del lubricentro/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Guía del conductor|Conductor/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Administrador de la plataforma/i })).toBeVisible();
  });

  test("guía del propietario carga", async ({ page }) => {
    await page.goto("/ayuda/propietario", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Guía del propietario", level: 1 })).toBeVisible();
    // Verificar que hay al menos un <h2> de sección
    await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();
  });

  test("guía del conductor carga", async ({ page }) => {
    await page.goto("/ayuda/conductor", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Guía del conductor", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();
  });

  test("guía del admin carga", async ({ page }) => {
    await page.goto("/ayuda/admin", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Guía del administrador", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();
  });
});