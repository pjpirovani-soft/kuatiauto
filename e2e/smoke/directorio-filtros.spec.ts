import { test, expect } from "@playwright/test";

test.describe("Smoke: directorio filtros (prod)", () => {
  test("texto sin tilde encuentra 'Encarnacion'", async ({ page }) => {
    await page.goto("/directorio?texto=encarnacion", { waitUntil: "domcontentloaded" });
    // DIR-1: ilike con unaccent debe encontrar "Encarnación".
    await expect(page.getByText("Import Japan")).toBeVisible();
  });

  test("servicio substring 'aceite' encuentra 'cambio de aceite'", async ({ page }) => {
    await page.goto("/directorio?servicio=aceite", { waitUntil: "domcontentloaded" });
    // DIR-2: jsonb_array_elements_text + ilike debe matchear substring.
    await expect(page.getByText("Import Japan")).toBeVisible();
  });

  test("texto 'Centro' busca en barrio", async ({ page }) => {
    await page.goto("/directorio?texto=Centro", { waitUntil: "domcontentloaded" });
    // DIR-5: p_texto debe buscar en barrio.
    await expect(page.getByText("B-Test-E4a")).toBeVisible();
  });

  test("sin resultados muestra contador en 0", async ({ page }) => {
    await page.goto("/directorio?texto=xyznoexiste", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(/0 establecimientos/)).toBeVisible();
  });

  test("filtros combinados ciudad + servicio", async ({ page }) => {
    await page.goto("/directorio?ciudad=Encarnaci%C3%B3n&servicio=aceite", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Import Japan")).toBeVisible();
    await expect(page.getByText(/establecimientos encontrados/)).toBeVisible();
  });
});