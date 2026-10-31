import { describe, it, expect } from "vitest";
import { servicioEmpresaSchema, servicioEmpresaIdSchema } from "./servicioEmpresaSchema";

describe("servicioEmpresaSchema", () => {
  it("acepta nombre y descripcion", () => {
    const r = servicioEmpresaSchema.safeParse({ nombre: "Cambio de aceite", descripcion: "Service basico" });
    expect(r.success).toBe(true);
  });

  it("acepta descripcion null", () => {
    const r = servicioEmpresaSchema.safeParse({ nombre: "Alineacion", descripcion: null });
    expect(r.success).toBe(true);
  });

  it("acepta descripcion omitida", () => {
    const r = servicioEmpresaSchema.safeParse({ nombre: "Frenos" });
    expect(r.success).toBe(true);
  });

  it("rechaza nombre vacio", () => {
    const r = servicioEmpresaSchema.safeParse({ nombre: "" });
    expect(r.success).toBe(false);
  });

  it("rechaza nombre mayor a 120", () => {
    const r = servicioEmpresaSchema.safeParse({ nombre: "a".repeat(121) });
    expect(r.success).toBe(false);
  });

  it("rechaza descripcion mayor a 500", () => {
    const r = servicioEmpresaSchema.safeParse({ nombre: "X", descripcion: "a".repeat(501) });
    expect(r.success).toBe(false);
  });
});

describe("servicioEmpresaIdSchema", () => {
  it("acepta uuid valido", () => {
    const r = servicioEmpresaIdSchema.safeParse({ id: "00000000-0000-0000-0000-000000000000" });
    expect(r.success).toBe(true);
  });

  it("rechaza id no uuid", () => {
    const r = servicioEmpresaIdSchema.safeParse({ id: "abc" });
    expect(r.success).toBe(false);
  });
});