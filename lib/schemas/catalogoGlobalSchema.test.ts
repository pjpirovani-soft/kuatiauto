import { describe, it, expect } from "vitest";
import {
  crearServicioGlobalSchema,
  editarServicioGlobalSchema,
  servicioGlobalIdSchema,
} from "./catalogoGlobalSchema";

describe("crearServicioGlobalSchema", () => {
  it("acepta nombre valido", () => {
    const r = crearServicioGlobalSchema.safeParse({ nombre: "Cambio de aceite" });
    expect(r.success).toBe(true);
  });

  it("rechaza nombre muy corto", () => {
    const r = crearServicioGlobalSchema.safeParse({ nombre: "A" });
    expect(r.success).toBe(false);
  });

  it("rechaza nombre vacio", () => {
    const r = crearServicioGlobalSchema.safeParse({ nombre: "   " });
    expect(r.success).toBe(false);
  });

  it("acepta descripcion vacia", () => {
    const r = crearServicioGlobalSchema.safeParse({ nombre: "Alineacion", descripcion: "" });
    expect(r.success).toBe(true);
  });

  it("acepta intervalos como string numerico", () => {
    const r = crearServicioGlobalSchema.safeParse({
      nombre: "Cambio de filtro",
      intervalo_km_sugerido: "10000",
      intervalo_meses_sugerido: "12",
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.intervalo_km_sugerido).toBe(10000);
      expect(r.data.intervalo_meses_sugerido).toBe(12);
    }
  });

  it("acepta intervalos como numero", () => {
    const r = crearServicioGlobalSchema.safeParse({
      nombre: "Cambio de aceite",
      intervalo_km_sugerido: 10000,
    });
    expect(r.success).toBe(true);
  });

  it("rechaza intervalo 0", () => {
    const r = crearServicioGlobalSchema.safeParse({
      nombre: "Test",
      intervalo_km_sugerido: "0",
    });
    expect(r.success).toBe(false);
  });
});

describe("editarServicioGlobalSchema", () => {
  it("requiere id UUID valido", () => {
    const r = editarServicioGlobalSchema.safeParse({
      id: "not-a-uuid",
      nombre: "Cambio de aceite",
    });
    expect(r.success).toBe(false);
  });

  it("acepta id UUID v4 valido", () => {
    const r = editarServicioGlobalSchema.safeParse({
      id: "550e8400-e29b-41d4-a716-446655440000",
      nombre: "Cambio de aceite",
    });
    expect(r.success).toBe(true);
  });
});

describe("servicioGlobalIdSchema", () => {
  it("rechaza id invalido", () => {
    expect(servicioGlobalIdSchema.safeParse({ id: "abc" }).success).toBe(false);
  });

  it("acepta id valido", () => {
    expect(
      servicioGlobalIdSchema.safeParse({ id: "550e8400-e29b-41d4-a716-446655440000" }).success
    ).toBe(true);
  });
});
import {
  crearProductoGlobalSchema,
  editarProductoGlobalSchema,
  productoGlobalIdSchema,
} from "./catalogoGlobalSchema";

describe("crearProductoGlobalSchema", () => {
  it("acepta nombre solo", () => {
    const r = crearProductoGlobalSchema.safeParse({ nombre: "Filtro de aceite" });
    expect(r.success).toBe(true);
  });

  it("rechaza nombre muy corto", () => {
    const r = crearProductoGlobalSchema.safeParse({ nombre: "A" });
    expect(r.success).toBe(false);
  });

  it("acepta marca/tipo/viscosidad", () => {
    const r = crearProductoGlobalSchema.safeParse({
      nombre: "Aceite sintetico",
      marca: "Mobil",
      tipo: "Aceite",
      viscosidad: "10W-40",
    });
    expect(r.success).toBe(true);
  });

  it("acepta strings vacios en campos opcionales", () => {
    const r = crearProductoGlobalSchema.safeParse({
      nombre: "Aceite",
      marca: "",
      tipo: "",
      viscosidad: "",
    });
    expect(r.success).toBe(true);
  });

  it("rechaza viscosidad muy larga", () => {
    const r = crearProductoGlobalSchema.safeParse({
      nombre: "Test",
      viscosidad: "x".repeat(50),
    });
    expect(r.success).toBe(false);
  });
});

describe("editarProductoGlobalSchema", () => {
  it("requiere id UUID valido", () => {
    const r = editarProductoGlobalSchema.safeParse({ id: "no-uuid", nombre: "Test" });
    expect(r.success).toBe(false);
  });

  it("acepta id UUID v4 valido", () => {
    const r = editarProductoGlobalSchema.safeParse({
      id: "550e8400-e29b-41d4-a716-446655440000",
      nombre: "Test",
    });
    expect(r.success).toBe(true);
  });
});

describe("productoGlobalIdSchema", () => {
  it("rechaza id invalido", () => {
    expect(productoGlobalIdSchema.safeParse({ id: "abc" }).success).toBe(false);
  });

  it("acepta id valido", () => {
    expect(
      productoGlobalIdSchema.safeParse({ id: "550e8400-e29b-41d4-a716-446655440000" }).success
    ).toBe(true);
  });
});