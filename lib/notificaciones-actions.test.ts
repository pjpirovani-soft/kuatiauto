import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSendEmail = vi.fn();
vi.mock("@/lib/email/resend", () => ({
  sendEmail: (...args: unknown[]) => mockSendEmail(...args),
}));

const mockRpc = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ rpc: mockRpc }),
}));

const mockInsert = vi.fn();
const mockSelectMaybeSingle = vi.fn();
vi.mock("@/lib/supabase/admin", () => ({
  hasAdminClient: () => true,
  createAdminClient: () => ({
    from: () => ({
      insert: mockInsert,
      select: () => ({ eq: () => ({ maybeSingle: mockSelectMaybeSingle }) }),
    }),
  }),
}));

import {
  enviarRecordatorioMantenimiento,
  enviarBienvenida,
  enviarHistorialCompartido,
} from "./notificaciones-actions";

const UUID = "00000000-0000-4000-8000-000000000001";

describe("notificaciones-actions", () => {
  beforeEach(() => {
    mockSendEmail.mockReset();
    mockRpc.mockReset();
    mockInsert.mockReset();
    mockSelectMaybeSingle.mockReset();
  });

  it("recordatorio: rechaza input invalido antes de tocar DB", async () => {
    const r = await enviarRecordatorioMantenimiento({});
    expect(r.ok).toBe(false);
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("recordatorio: si ya fue enviado, no llama sendEmail", async () => {
    mockSelectMaybeSingle.mockResolvedValue({ data: { id: "prev" } });
    const r = await enviarRecordatorioMantenimiento({
      vehiculo_id: UUID,
      cliente_email: "c@example.com",
      cliente_nombre: "Juan",
      vehiculo_descripcion: "Corolla",
      proximo_mantenimiento: "Aceite 80k",
      establecimiento_nombre: "Taller",
      fecha_objetivo: "2026-11-15",
    });
    expect(r.ok).toBe(false);
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("recordatorio: si rate limit rechaza, no llama sendEmail", async () => {
    mockSelectMaybeSingle.mockResolvedValue({ data: null });
    mockRpc.mockResolvedValue({ data: false, error: null });
    const r = await enviarRecordatorioMantenimiento({
      vehiculo_id: UUID,
      cliente_email: "c@example.com",
      cliente_nombre: "Juan",
      vehiculo_descripcion: "Corolla",
      proximo_mantenimiento: "Aceite 80k",
      establecimiento_nombre: "Taller",
      fecha_objetivo: "2026-11-15",
    });
    expect(r.ok).toBe(false);
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("recordatorio: camino feliz llama sendEmail y persiste", async () => {
    mockSelectMaybeSingle.mockResolvedValue({ data: null });
    mockRpc.mockResolvedValue({ data: true, error: null });
    mockSendEmail.mockResolvedValue({ ok: true, id: "mock-1", mock: true });
    mockInsert.mockResolvedValue({ error: null });

    const r = await enviarRecordatorioMantenimiento({
      vehiculo_id: UUID,
      cliente_email: "c@example.com",
      cliente_nombre: "Juan",
      vehiculo_descripcion: "Corolla",
      proximo_mantenimiento: "Aceite 80k",
      establecimiento_nombre: "Taller",
      fecha_objetivo: "2026-11-15",
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.id).toBe("mock-1");
      expect(r.mock).toBe(true);
      expect(r.persistido).toBe(true);
    }
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
  });

  it("bienvenida: camino feliz", async () => {
    mockSelectMaybeSingle.mockResolvedValue({ data: null });
    mockSendEmail.mockResolvedValue({ ok: true, id: "mock-2", mock: true });
    mockInsert.mockResolvedValue({ error: null });
    const r = await enviarBienvenida({
      establecimiento_id: UUID,
      email: "d@example.com",
      nombre: "Maria",
      establecimiento_nombre: "Taller",
    });
    expect(r.ok).toBe(true);
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
  });

  it("historial: rechaza accion invalida", async () => {
    const r = await enviarHistorialCompartido({
      conductor_id: UUID,
      email: "x@example.com",
      conductor_nombre: "Pedro",
      vehiculo_descripcion: "Corolla",
      establecimiento_nombre: "Taller",
      accion: "otro",
    });
    expect(r.ok).toBe(false);
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("historial: camino feliz con accion autorizado", async () => {
    mockSelectMaybeSingle.mockResolvedValue({ data: null });
    mockSendEmail.mockResolvedValue({ ok: true, id: "mock-3", mock: true });
    mockInsert.mockResolvedValue({ error: null });
    const r = await enviarHistorialCompartido({
      conductor_id: UUID,
      email: "x@example.com",
      conductor_nombre: "Pedro",
      vehiculo_descripcion: "Corolla",
      establecimiento_nombre: "Taller",
      accion: "autorizado",
    });
    expect(r.ok).toBe(true);
  });
});