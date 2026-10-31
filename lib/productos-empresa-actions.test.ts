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

import { listarProductosEmpresa, obtenerProductoEmpresa, crearProductoEmpresa, editarProductoEmpresa } from "./productos-empresa-actions";

const EMPRESA_ID = "11111111-1111-1111-1111-111111111111";
const USER_ID = "22222222-2222-2222-2222-222222222222";
const PRODUCTO_ID = "440e8400-e29b-41d4-a716-446655440044";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.mockGetUser.mockResolvedValue({ data: { user: { id: USER_ID } } });
  mocks.mockCheckRateLimit.mockResolvedValue({ ok: true, retryAfterSeconds: 0, skipped: false });
});

describe("listarProductosEmpresa", () => {
  it("sin auth devuelve error", async () => {
    mocks.mockGetUser.mockResolvedValueOnce({ data: { user: null } });
    const res = await listarProductosEmpresa();
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toContain("No autenticado");
  });

  it("sin empresa devuelve error", async () => {
    mocks.mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
    const res = await listarProductosEmpresa();
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toContain("Sin empresa");
  });

  it("devuelve lista ok", async () => {
    mocks.mockMaybeSingle.mockResolvedValueOnce({ data: { empresa_id: EMPRESA_ID }, error: null });
    mocks.mockOrder.mockResolvedValueOnce({ data: [{ id: PRODUCTO_ID, nombre: "X" }], error: null });
    const res = await listarProductosEmpresa();
    expect(res.ok).toBe(true);
    if (res.ok) expect(Array.isArray(res.data)).toBe(true);
  });
});

describe("obtenerProductoEmpresa", () => {
  it("id invalido devuelve error", async () => {
    const res = await obtenerProductoEmpresa({ id: "abc" });
    expect(res.ok).toBe(false);
  });

  it("no encontrado devuelve error", async () => {
    mocks.mockMaybeSingle
      .mockResolvedValueOnce({ data: { empresa_id: EMPRESA_ID }, error: null })
      .mockResolvedValueOnce({ data: null, error: null });
    const res = await obtenerProductoEmpresa({ id: PRODUCTO_ID });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toContain("no encontrado");
  });

  it("ok devuelve el producto", async () => {
    mocks.mockMaybeSingle
      .mockResolvedValueOnce({ data: { empresa_id: EMPRESA_ID }, error: null })
      .mockResolvedValueOnce({ data: { id: PRODUCTO_ID, nombre: "X" }, error: null });
    const res = await obtenerProductoEmpresa({ id: PRODUCTO_ID });
    expect(res.ok).toBe(true);
  });
});

describe("crearProductoEmpresa", () => {
  it("sin auth devuelve error", async () => {
    mocks.mockGetUser.mockResolvedValueOnce({ data: { user: null } });
    const res = await crearProductoEmpresa({ nombre: "X" });
    expect(res.ok).toBe(false);
  });

  it("datos invalidos devuelve error", async () => {
    const res = await crearProductoEmpresa({ nombre: "" });
    expect(res.ok).toBe(false);
  });

  it("rate limit bloquea", async () => {
    mocks.mockMaybeSingle.mockResolvedValueOnce({ data: { empresa_id: EMPRESA_ID }, error: null });
    mocks.mockCheckRateLimit.mockResolvedValueOnce({ ok: false, retryAfterSeconds: 30, skipped: false });
    const res = await crearProductoEmpresa({ nombre: "X" });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toContain("Demasiadas");
  });

  it("ok crea y devuelve id", async () => {
    mocks.mockMaybeSingle.mockResolvedValueOnce({ data: { empresa_id: EMPRESA_ID }, error: null });
    mocks.mockSingle.mockResolvedValueOnce({ data: { id: PRODUCTO_ID }, error: null });
    const res = await crearProductoEmpresa({ nombre: "X" });
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.data.id).toBe(PRODUCTO_ID);
    expect(mocks.mockAuditLog).toHaveBeenCalled();
  });

  it("error de DB devuelve mensaje", async () => {
    mocks.mockMaybeSingle.mockResolvedValueOnce({ data: { empresa_id: EMPRESA_ID }, error: null });
    mocks.mockSingle.mockResolvedValueOnce({ data: null, error: { message: "db down" } });
    const res = await crearProductoEmpresa({ nombre: "X" });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toBe("db down");
  });
});

describe("editarProductoEmpresa", () => {
  it("id invalido devuelve error", async () => {
    const res = await editarProductoEmpresa({ id: "abc", nombre: "X" });
    expect(res.ok).toBe(false);
  });

  it("ok edita", async () => {
    mocks.mockMaybeSingle.mockResolvedValueOnce({ data: { empresa_id: EMPRESA_ID }, error: null });
    mocks.mockEq.mockReturnValue(chainable);
    const res = await editarProductoEmpresa({ id: PRODUCTO_ID, nombre: "Y" });
    expect(res.ok).toBe(true);
    expect(mocks.mockAuditLog).toHaveBeenCalled();
  });
});