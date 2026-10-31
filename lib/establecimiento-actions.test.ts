import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockSingle: vi.fn(),
  mockSelect: vi.fn(),
  mockInsert: vi.fn(),
  mockUpdate: vi.fn(),
  mockUpsert: vi.fn(),
  mockDelete: vi.fn(),
  mockEq: vi.fn(),
  mockFrom: vi.fn(),
  mockMaybeSingle: vi.fn(),
  mockOrder: vi.fn(),
  mockLimit: vi.fn(),
  mockRpc: vi.fn(),
  mockAuditLog: vi.fn(async () => true),
  mockCheckRateLimit: vi.fn(async () => ({ ok: true, retryAfterSeconds: 0, skipped: false })),
}));

const chainable: Record<string, unknown> = {};
chainable.select = mocks.mockSelect;
chainable.insert = mocks.mockInsert;
chainable.update = mocks.mockUpdate;
chainable.upsert = mocks.mockUpsert;
chainable.delete = mocks.mockDelete;
chainable.eq = mocks.mockEq;
chainable.single = mocks.mockSingle;
chainable.maybeSingle = mocks.mockMaybeSingle;
chainable.order = mocks.mockOrder;
chainable.limit = mocks.mockLimit;
chainable.then = (resolve: (v: unknown) => void) => resolve({ data: null, error: null });

mocks.mockFrom.mockReturnValue(chainable);
mocks.mockSelect.mockReturnValue(chainable);
mocks.mockInsert.mockReturnValue(chainable);
mocks.mockUpdate.mockReturnValue(chainable);
mocks.mockUpsert.mockReturnValue(chainable);
mocks.mockDelete.mockReturnValue(chainable);
mocks.mockEq.mockReturnValue(chainable);
mocks.mockOrder.mockResolvedValue({ data: null, error: null });
mocks.mockLimit.mockReturnValue(chainable);

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: mocks.mockGetUser },
    from: mocks.mockFrom,
    rpc: mocks.mockRpc,
  })),
}));

vi.mock("@/lib/audit", () => ({ auditLog: mocks.mockAuditLog }));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: mocks.mockCheckRateLimit,
  buildClave: (parts: (string | undefined | null)[]) => parts.filter(Boolean).join(":"),
}));

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import {
  listarEstablecimientos,
  obtenerEstablecimiento,
  crearEstablecimiento,
  editarEstablecimiento,
  publicarMiEstablecimiento,
} from "./establecimiento-actions";

const EMPRESA_ID = "11111111-1111-1111-1111-111111111111";
const USER_ID = "22222222-2222-2222-2222-222222222222";
const EST_ID = "330e8400-e29b-41d4-a716-446655440033";
const PUB_ID = "440e8400-e29b-41d4-a716-446655440044";

beforeEach(() => {
  vi.resetAllMocks();
  mocks.mockFrom.mockReturnValue(chainable);
  mocks.mockSelect.mockReturnValue(chainable);
  mocks.mockInsert.mockReturnValue(chainable);
  mocks.mockUpdate.mockReturnValue(chainable);
  mocks.mockUpsert.mockReturnValue(chainable);
  mocks.mockDelete.mockReturnValue(chainable);
  mocks.mockEq.mockReturnValue(chainable);
  mocks.mockOrder.mockResolvedValue({ data: null, error: null });
  mocks.mockLimit.mockReturnValue(chainable);
  mocks.mockGetUser.mockResolvedValue({ data: { user: { id: USER_ID } } });
  mocks.mockMaybeSingle.mockResolvedValue({ data: { empresa_id: EMPRESA_ID }, error: null });
  mocks.mockCheckRateLimit.mockResolvedValue({ ok: true, retryAfterSeconds: 0, skipped: false });
});

describe("listarEstablecimientos", () => {
  it("sin auth devuelve error", async () => {
    mocks.mockGetUser.mockResolvedValueOnce({ data: { user: null } });
    const res = await listarEstablecimientos();
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toContain("No autenticado");
  });

  it("sin empresa devuelve error", async () => {
    mocks.mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
    const res = await listarEstablecimientos();
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toContain("Sin empresa");
  });

  it("ok devuelve lista", async () => {
    mocks.mockOrder.mockResolvedValueOnce({ data: [{ id: EST_ID, nombre: "X" }], error: null });
    const res = await listarEstablecimientos();
    expect(res.ok).toBe(true);
    if (res.ok) expect(Array.isArray(res.data)).toBe(true);
  });
});

describe("obtenerEstablecimiento", () => {
  it("id invalido devuelve error", async () => {
    const res = await obtenerEstablecimiento({ id: "abc" });
    expect(res.ok).toBe(false);
  });

  it("no encontrado devuelve error", async () => {
    mocks.mockMaybeSingle
      .mockResolvedValueOnce({ data: { empresa_id: EMPRESA_ID }, error: null })
      .mockResolvedValueOnce({ data: null, error: null });
    const res = await obtenerEstablecimiento({ id: EST_ID });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toContain("no encontrado");
  });

  it("ok devuelve establecimiento", async () => {
    mocks.mockMaybeSingle.mockResolvedValueOnce({ data: { empresa_id: EMPRESA_ID }, error: null });
    mocks.mockLimit.mockResolvedValueOnce({ data: [{ id: EST_ID, nombre: "X" }], error: null });
    const res = await obtenerEstablecimiento({ id: EST_ID });
    expect(res.ok).toBe(true);
  });
});

describe("crearEstablecimiento", () => {
  it("sin auth devuelve error", async () => {
    mocks.mockGetUser.mockResolvedValueOnce({ data: { user: null } });
    const res = await crearEstablecimiento({ nombre: "X" });
    expect(res.ok).toBe(false);
  });

  it("datos invalidos devuelve error", async () => {
    const res = await crearEstablecimiento({ nombre: "" });
    expect(res.ok).toBe(false);
  });

  it("rate limit bloquea", async () => {
    mocks.mockCheckRateLimit.mockResolvedValueOnce({ ok: false, retryAfterSeconds: 30, skipped: false });
    const res = await crearEstablecimiento({ nombre: "X" });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toContain("Demasiadas");
  });

  it("ok crea establecimiento + publico", async () => {
    mocks.mockSingle
      .mockResolvedValueOnce({ data: { id: EST_ID }, error: null })
      .mockResolvedValueOnce({ data: { id: PUB_ID }, error: null });
    const res = await crearEstablecimiento({ nombre: "Taller Centro" });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.data.id).toBe(EST_ID);
      expect(res.data.publico_id).toBe(PUB_ID);
    }
    expect(mocks.mockAuditLog).toHaveBeenCalled();
  });

  it("error en insert establecimiento devuelve mensaje", async () => {
    mocks.mockSingle.mockResolvedValueOnce({ data: null, error: { message: "db down" } });
    const res = await crearEstablecimiento({ nombre: "X" });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toBe("db down");
  });

  it("error en insert publico compensa (delete) y devuelve error", async () => {
    mocks.mockSingle
      .mockResolvedValueOnce({ data: { id: EST_ID }, error: null })
      .mockResolvedValueOnce({ data: null, error: { message: "publico down" } });
    const res = await crearEstablecimiento({ nombre: "X" });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toBe("publico down");
    expect(mocks.mockDelete).toHaveBeenCalled();
  });
});

describe("editarEstablecimiento", () => {
  it("id invalido devuelve error", async () => {
    const res = await editarEstablecimiento({ id: "abc", nombre: "X" });
    expect(res.ok).toBe(false);
  });

  it("ok edita", async () => {
    const res = await editarEstablecimiento({ id: EST_ID, nombre: "Y" });
    expect(res.ok).toBe(true);
    expect(mocks.mockAuditLog).toHaveBeenCalled();
  });
});

describe("publicarMiEstablecimiento", () => {
  it("id invalido devuelve error", async () => {
    const res = await publicarMiEstablecimiento({ establecimiento_publico_id: "abc", publicado: true });
    expect(res.ok).toBe(false);
  });

  it("sin auth devuelve error", async () => {
    mocks.mockGetUser.mockResolvedValueOnce({ data: { user: null } });
    const res = await publicarMiEstablecimiento({ establecimiento_publico_id: PUB_ID, publicado: true });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toContain("No autenticado");
  });

  it("rate limit bloquea", async () => {
    mocks.mockCheckRateLimit.mockResolvedValueOnce({ ok: false, retryAfterSeconds: 20, skipped: false });
    const res = await publicarMiEstablecimiento({ establecimiento_publico_id: PUB_ID, publicado: true });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toContain("Demasiadas");
  });

  it("ok publica", async () => {
    mocks.mockRpc.mockResolvedValueOnce({ data: null, error: null });
    const res = await publicarMiEstablecimiento({ establecimiento_publico_id: PUB_ID, publicado: true });
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.data.id).toBe(PUB_ID);
    expect(mocks.mockAuditLog).toHaveBeenCalled();
  });

  it("ok despublica", async () => {
    mocks.mockRpc.mockResolvedValueOnce({ data: null, error: null });
    const res = await publicarMiEstablecimiento({ establecimiento_publico_id: PUB_ID, publicado: false });
    expect(res.ok).toBe(true);
  });

  it("error de RPC devuelve mensaje", async () => {
    mocks.mockRpc.mockResolvedValueOnce({ data: null, error: { message: "rpc fail" } });
    const res = await publicarMiEstablecimiento({ establecimiento_publico_id: PUB_ID, publicado: true });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toBe("rpc fail");
  });
});
