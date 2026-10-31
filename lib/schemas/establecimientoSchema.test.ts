import { describe, it, expect } from "vitest";
import {
  crearEstablecimientoSchema,
  editarEstablecimientoSchema,
  publicarMiEstablecimientoSchema,
  establecimientoIdSchema,
} from "./establecimientoSchema";

const UUID_V4 = "550e8400-e29b-41d4-a716-446655440000";

describe("crearEstablecimientoSchema", () => {
  it("acepta solo nombre", () => {
    const r = crearEstablecimientoSchema.safeParse({ nombre: "Taller Centro" });
    expect(r.success).toBe(true);
  });

  it("acepta todos los campos", () => {
    const r = crearEstablecimientoSchema.safeParse({
      nombre: "Taller Centro",
      direccion: "Av. Principal 123",
      telefono: "0981-123456",
      horarios: { lun: "08:00-18:00" },
      descripcion: "Taller mecanico general",
      barrio: "Centro",
      ciudad: "Encarnacion",
      departamento: "Itapua",
      telefono_publico: "0981-654321",
      servicios_ofrecidos: ["cambio de aceite", "frenos"],
      lat_aproximada: -27.33,
      lng_aproximada: -55.86,
    });
    expect(r.success).toBe(true);
  });

  it("rechaza nombre vacio", () => {
    const r = crearEstablecimientoSchema.safeParse({ nombre: "" });
    expect(r.success).toBe(false);
  });

  it("rechaza nombre mayor a 120 caracteres", () => {
    const r = crearEstablecimientoSchema.safeParse({ nombre: "x".repeat(121) });
    expect(r.success).toBe(false);
  });

  it("rechaza descripcion mayor a 1000 caracteres", () => {
    const r = crearEstablecimientoSchema.safeParse({ nombre: "X", descripcion: "y".repeat(1001) });
    expect(r.success).toBe(false);
  });

  it("rechaza mas de 50 servicios ofrecidos", () => {
    const r = crearEstablecimientoSchema.safeParse({
      nombre: "X",
      servicios_ofrecidos: Array.from({ length: 51 }, (_, i) => `s${i}`),
    });
    expect(r.success).toBe(false);
  });

  it("rechaza lat_aproximada fuera de rango", () => {
    const r = crearEstablecimientoSchema.safeParse({ nombre: "X", lat_aproximada: -91 });
    expect(r.success).toBe(false);
  });

  it("rechaza lng_aproximada fuera de rango", () => {
    const r = crearEstablecimientoSchema.safeParse({ nombre: "X", lng_aproximada: 181 });
    expect(r.success).toBe(false);
  });

  it("acepta horarios como objeto", () => {
    const r = crearEstablecimientoSchema.safeParse({ nombre: "X", horarios: { lun: "08-18", mar: "08-18" } });
    expect(r.success).toBe(true);
  });

  it("acepta sin telefono_publico", () => {
    const r = crearEstablecimientoSchema.safeParse({ nombre: "X" });
    expect(r.success).toBe(true);
  });
});

describe("editarEstablecimientoSchema", () => {
  it("requiere id uuid", () => {
    const r = editarEstablecimientoSchema.safeParse({ id: UUID_V4, nombre: "X" });
    expect(r.success).toBe(true);
  });

  it("rechaza id invalido", () => {
    const r = editarEstablecimientoSchema.safeParse({ id: "no-uuid", nombre: "X" });
    expect(r.success).toBe(false);
  });
});

describe("publicarMiEstablecimientoSchema", () => {
  it("acepta uuid + boolean", () => {
    const r = publicarMiEstablecimientoSchema.safeParse({ establecimiento_publico_id: UUID_V4, publicado: true });
    expect(r.success).toBe(true);
  });

  it("rechaza id no uuid", () => {
    const r = publicarMiEstablecimientoSchema.safeParse({ establecimiento_publico_id: "x", publicado: true });
    expect(r.success).toBe(false);
  });
});

describe("establecimientoIdSchema", () => {
  it("acepta uuid", () => {
    const r = establecimientoIdSchema.safeParse({ id: UUID_V4 });
    expect(r.success).toBe(true);
  });

  it("rechaza no uuid", () => {
    const r = establecimientoIdSchema.safeParse({ id: "x" });
    expect(r.success).toBe(false);
  });
});
