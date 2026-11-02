import { test, expect } from "@playwright/test";

test.describe("Smoke: Centro de Ayuda (prod)", () => {
  test("hub /ayuda carga con las 3 tarjetas de rol", async ({ page }) => {
    await page.goto("/ayuda", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /Centro de Ayuda/i, level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Elegí tu rol" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Propietario del lubricentro/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /^Conductor$/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Administrador de la plataforma/i })).toBeVisible();
  });

  test("guía del propietario carga", async ({ page }) => {
    await page.goto("/ayuda/propietario", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Guía del propietario", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: /1\\. Primeros pasos/ })).toBeVisible();
  });

  test("guía del conductor carga", async ({ page }) => {
    await page.goto("/ayuda/conductor", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Guía del conductor", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: /1\\. ¿Qué es KuatiAuto/ })).toBeVisible();
  });

  test("guía del admin carga", async ({ page }) => {
    await page.goto("/ayuda/admin", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Guía del administrador", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: /1\\. Tu rol como administrador/ })).toBeVisible();
  });
});