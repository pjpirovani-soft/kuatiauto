import { describe, it, expect } from "vitest";
import {
  enviarRecordatorioMantenimientoSchema,
  enviarBienvenidaSchema,
  enviarHistorialCompartidoSchema,
} from "./notificacionesSchema";

const UUID = "00000000-0000-4000-8000-000000000001";

describe("enviarRecordatorioMantenimientoSchema", () => {
  const base = {
    vehiculo_id: UUID,
    cliente_email: "cliente@example.com",
    cliente_nombre: "Juan",
    vehiculo_descripcion: "Toyota Corolla 2020",
    proximo_mantenimiento: "Cambio de aceite a los 80.000 km",
    establecimiento_nombre: "Taller Central",
    fecha_objetivo: "2026-11-15",
  };

  it("acepta datos validos", () => {
    expect(enviarRecordatorioMantenimientoSchema.safeParse(base).success).toBe(true);
  });

  it("rechaza UUID invalido", () => {
    expect(enviarRecordatorioMantenimientoSchema.safeParse({ ...base, vehiculo_id: "no-uuid" }).success).toBe(false);
  });

  it("rechaza email invalido", () => {
    expect(enviarRecordatorioMantenimientoSchema.safeParse({ ...base, cliente_email: "no-email" }).success).toBe(false);
  });

  it("rechaza fecha_objetivo con formato incorrecto", () => {
    expect(enviarRecordatorioMantenimientoSchema.safeParse({ ...base, fecha_objetivo: "15/11/2026" }).success).toBe(false);
  });
});

describe("enviarBienvenidaSchema", () => {
  const base = {
    establecimiento_id: UUID,
    email: "dueno@example.com",
    nombre: "Maria",
    establecimiento_nombre: "Taller Central",
  };

  it("acepta datos validos", () => {
    expect(enviarBienvenidaSchema.safeParse(base).success).toBe(true);
  });

  it("rechaza nombre vacio", () => {
    expect(enviarBienvenidaSchema.safeParse({ ...base, nombre: "" }).success).toBe(false);
  });
});

describe("enviarHistorialCompartidoSchema", () => {
  const base = {
    conductor_id: UUID,
    email: "conductor@example.com",
    conductor_nombre: "Pedro",
    vehiculo_descripcion: "Toyota Corolla 2020",
    establecimiento_nombre: "Taller Central",
    accion: "autorizado" as const,
  };

  it("acepta accion autorizado", () => {
    expect(enviarHistorialCompartidoSchema.safeParse(base).success).toBe(true);
  });

  it("acepta accion revocado", () => {
    expect(enviarHistorialCompartidoSchema.safeParse({ ...base, accion: "revocado" }).success).toBe(true);
  });

  it("rechaza accion distinta", () => {
    expect(enviarHistorialCompartidoSchema.safeParse({ ...base, accion: "otro" }).success).toBe(false);
  });
});