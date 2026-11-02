import { test, expect } from "@playwright/test";

test.describe("Smoke: directorio público (prod)", () => {
  test("carga el directorio y permite buscar por texto", async ({ page }) => {
    await page.goto("/directorio", { waitUntil: "domcontentloaded" });

    // 1. Verificar que carga la página
    await expect(page.getByRole("heading", { name: "Directorio de lubricentros" })).toBeVisible();

    // 2. Escribir en el buscador por nombre
    const searchInput = page.getByPlaceholder("Buscar por nombre");
    await searchInput.fill("Import");

    // 3. Hacer clic en Buscar
    await page.getByRole("button", { name: "Buscar", exact: true }).click();

    // 4. Verificar que la URL cambió (el form hizo submit con GET)
    await expect(page).toHaveURL(/\/directorio\?texto=Import/);

    // 5. Verificar que el valor persiste en el input (defaultValue)
    await expect(searchInput).toHaveValue("Import");
  });
});