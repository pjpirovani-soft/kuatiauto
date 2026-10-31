import { describe, it, expect } from "vitest";
import { productoEmpresaSchema, productoEmpresaIdSchema } from "./productoEmpresaSchema";

describe("productoEmpresaSchema", () => {
  it("acepta nombre minimo", () => {
    const r = productoEmpresaSchema.safeParse({ nombre: "Filtro de aceite" });
    expect(r.success).toBe(true);
  });

  it("acepta todos los campos", () => {
    const r = productoEmpresaSchema.safeParse({
      nombre: "Aceite 5W-30",
      marca: "Mobil",
      tipo: "aceite",
      viscosidad: "5W-30",
      unidad: "litro",
      stock_actual: 10,
      stock_minimo: 2,
    });
    expect(r.success).toBe(true);
  });

  it("coacciona stock desde string", () => {
    const r = productoEmpresaSchema.safeParse({ nombre: "X", stock_actual: "10", stock_minimo: "2" });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.stock_actual).toBe(10);
      expect(r.data.stock_minimo).toBe(2);
    }
  });

  it("rechaza nombre vacio", () => {
    const r = productoEmpresaSchema.safeParse({ nombre: "" });
    expect(r.success).toBe(false);
  });

  it("rechaza stock negativo", () => {
    const r = productoEmpresaSchema.safeParse({ nombre: "X", stock_actual: -1 });
    expect(r.success).toBe(false);
  });

  it("rechaza stock no entero", () => {
    const r = productoEmpresaSchema.safeParse({ nombre: "X", stock_actual: 1.5 });
    expect(r.success).toBe(false);
  });

  it("acepta marca, tipo y viscosidad null", () => {
    const r = productoEmpresaSchema.safeParse({ nombre: "X", marca: null, tipo: null, viscosidad: null });
    expect(r.success).toBe(true);
  });
});

describe("productoEmpresaIdSchema", () => {
  it("acepta uuid valido", () => {
    const r = productoEmpresaIdSchema.safeParse({ id: "00000000-0000-0000-0000-000000000000" });
    expect(r.success).toBe(true);
  });

  it("rechaza id no uuid", () => {
    const r = productoEmpresaIdSchema.safeParse({ id: "abc" });
    expect(r.success).toBe(false);
  });
});