import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockSingle: vi.fn(),
  mockSelect: vi.fn(),
  mockInsert: vi.fn(),
  mockUpdate: vi.fn(),
  mockEq: vi.fn(),
  mockFrom: vi.fn(),
  mockMaybeSingle: vi.fn(),
  mockOrder: vi.fn(),
  mockAuditLog: vi.fn(async () => true),
  mockCheckRateLimit: vi.fn(async () => ({ ok: true, retryAfterSeconds: 0, skipped: false })),
}));

const chainable: Record<string, unknown> = {};
chainable.select = mocks.mockSelect;
chainable.insert = mocks.mockInsert;
chainable.update = mocks.mockUpdate;
chainable.eq = mocks.mockEq;
chainable.single = mocks.mockSingle;
chainable.maybeSingle = mocks.mockMaybeSingle;
chainable.order = mocks.mockOrder;
chainable.then = (resolve: (v: unknown) => void) => resolve({ data: null, error: null });

mocks.mockFrom.mockReturnValue(chainable);
mocks.mockSelect.mockReturnValue(chainable);
mocks.mockInsert.mockReturnValue(chainable);
mocks.mockUpdate.mockReturnValue(chainable);
mocks.mockEq.mockReturnValue(chainable);
mocks.mockOrder.mockResolvedValue({ data: null, error: null });

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: mocks.mockGetUser },
    from: mocks.mockFrom,
  })),
}));

vi.mock("@/lib/audit", () => ({ auditLog: mocks.mockAuditLog }));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: mocks.mockCheckRateLimit,
  buildClave: (parts: (string | undefined | null)[]) => parts.filter(Boolean).join(":"),
}));

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { listarServiciosEmpresa, obtenerServicioEmpresa, crearServicioEmpresa, editarServicioEmpresa } from "./servicios-empresa-actions";

const EMPRESA_ID = "11111111-1111-1111-1111-111111111111";
const USER_ID = "22222222-2222-2222-2222-222222222222";
const SERVICIO_ID = "330e8400-e29b-41d4-a716-446655440033";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.mockGetUser.mockResolvedValue({ data: { user: { id: USER_ID } } });
  mocks.mockMaybeSingle.mockResolvedValue({ data: { empresa_id: EMPRESA_ID }, error: null });
  mocks.mockCheckRateLimit.mockResolvedValue({ ok: true, retryAfterSeconds: 0, skipped: false });
});

describe("listarServiciosEmpresa", () => {
  it("sin auth devuelve error", async () => {
    mocks.mockGetUser.mockResolvedValueOnce({ data: { user: null } });
    const res = await listarServiciosEmpresa();
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toContain("No autenticado");
  });

  it("sin empresa devuelve error", async () => {
    mocks.mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
    const res = await listarServiciosEmpresa();
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toContain("Sin empresa");
  });

  it("devuelve lista ok", async () => {
    mocks.mockOrder.mockResolvedValueOnce({ data: [{ id: SERVICIO_ID, nombre: "X" }], error: null });
    const res = await listarServiciosEmpresa();
    expect(res.ok).toBe(true);
    if (res.ok) expect(Array.isArray(res.data)).toBe(true);
  });
});

describe("obtenerServicioEmpresa", () => {
  it("id invalido devuelve error", async () => {
    const res = await obtenerServicioEmpresa({ id: "abc" });
    expect(res.ok).toBe(false);
  });

  it("no encontrado devuelve error", async () => {
    mocks.mockMaybeSingle
      .mockResolvedValueOnce({ data: { empresa_id: EMPRESA_ID }, error: null })
      .mockResolvedValueOnce({ data: null, error: null });
    const res = await obtenerServicioEmpresa({ id: SERVICIO_ID });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toContain("no encontrado");
  });

  it("ok devuelve el servicio", async () => {
    mocks.mockMaybeSingle
      .mockResolvedValueOnce({ data: { empresa_id: EMPRESA_ID }, error: null })
      .mockResolvedValueOnce({ data: { id: SERVICIO_ID, nombre: "X" }, error: null });
    const res = await obtenerServicioEmpresa({ id: SERVICIO_ID });
    expect(res.ok).toBe(true);
  });
});

describe("crearServicioEmpresa", () => {
  it("sin auth devuelve error", async () => {
    mocks.mockGetUser.mockResolvedValueOnce({ data: { user: null } });
    const res = await crearServicioEmpresa({ nombre: "X" });
    expect(res.ok).toBe(false);
  });

  it("datos invalidos devuelve error", async () => {
    const res = await crearServicioEmpresa({ nombre: "" });
    expect(res.ok).toBe(false);
  });

  it("rate limit bloquea", async () => {
    mocks.mockCheckRateLimit.mockResolvedValueOnce({ ok: false, retryAfterSeconds: 30, skipped: false });
    const res = await crearServicioEmpresa({ nombre: "X" });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toContain("Demasiadas");
  });

  it("ok crea y devuelve id", async () => {
    mocks.mockSingle.mockResolvedValueOnce({ data: { id: SERVICIO_ID }, error: null });
    const res = await crearServicioEmpresa({ nombre: "X" });
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.data.id).toBe(SERVICIO_ID);
    expect(mocks.mockAuditLog).toHaveBeenCalled();
  });

  it("error de DB devuelve mensaje", async () => {
    mocks.mockSingle.mockResolvedValueOnce({ data: null, error: { message: "db down" } });
    const res = await crearServicioEmpresa({ nombre: "X" });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toBe("db down");
  });
});

describe("editarServicioEmpresa", () => {
  it("id invalido devuelve error", async () => {
    const res = await editarServicioEmpresa({ id: "abc", nombre: "X" });
    expect(res.ok).toBe(false);
  });

  it("ok edita", async () => {
    mocks.mockEq.mockReturnValue(chainable);
    const res = await editarServicioEmpresa({ id: SERVICIO_ID, nombre: "Y" });
    expect(res.ok).toBe(true);
    expect(mocks.mockAuditLog).toHaveBeenCalled();
  });
});