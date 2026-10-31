import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockSingle: vi.fn(),
  mockMaybeSingle: vi.fn(),
  mockSelect: vi.fn(),
  mockInsert: vi.fn(),
  mockUpdate: vi.fn(),
  mockDelete: vi.fn(),
  mockEq: vi.fn(),
  mockIn: vi.fn(),
  mockOrder: vi.fn(),
  mockFrom: vi.fn(),
  mockAuditLog: vi.fn(async () => true),
  mockCheckRateLimit: vi.fn(async () => ({ ok: true, retryAfterSeconds: 0, skipped: false })),
}));

function makeChain() {
  const c: Record<string, unknown> = {};
  c.select = mocks.mockSelect.mockReturnValue(c);
  c.insert = mocks.mockInsert.mockReturnValue(c);
  c.update = mocks.mockUpdate.mockReturnValue(c);
  c.delete = mocks.mockDelete.mockReturnValue(c);
  c.eq = mocks.mockEq.mockReturnValue(c);
  c.in = mocks.mockIn.mockReturnValue(c);
  c.order = mocks.mockOrder.mockReturnValue(c);
  c.single = mocks.mockSingle;
  c.maybeSingle = mocks.mockMaybeSingle;
  c.then = (resolve: (v: unknown) => void) => resolve({ data: null, error: null });
  return c;
}

mocks.mockFrom.mockImplementation(() => makeChain());

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: mocks.mockGetUser },
    from: mocks.mockFrom,
  })),
}));

vi.mock('@/lib/audit', () => ({ auditLog: mocks.mockAuditLog }));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: mocks.mockCheckRateLimit,
  buildClave: (parts: (string | undefined | null)[]) => parts.filter(Boolean).join(':'),
}));

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

import {
  listarOrdenes,
  listarOrdenesEmpresa,
  obtenerOrden,
  crearOrden,
  editarOrden,
  completarOrden,
  anularOrden,
  eliminarOrdenBorrador,
} from './ordenes-actions';

const EMPRESA_ID = '11111111-1111-1111-1111-111111111111';
const USER_ID = '22222222-2222-2222-2222-222222222222';
const VEHICULO_ID = '550e8400-e29b-41d4-a716-446655440000';
const ORDEN_ID = '770e8400-e29b-41d4-a716-446655440077';
const SERVICIO_GLOBAL_ID = '880e8400-e29b-41d4-a716-446655440088';
const PRODUCTO_GLOBAL_ID = 'aa0e8400-e29b-41d4-a716-4466554400aa';

function sesionOk() {
  mocks.mockGetUser.mockResolvedValue({ data: { user: { id: USER_ID } } });
  mocks.mockMaybeSingle.mockResolvedValueOnce({ data: { empresa_id: EMPRESA_ID }, error: null });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.mockFrom.mockImplementation(() => makeChain());
  mocks.mockGetUser.mockResolvedValue({ data: { user: { id: USER_ID } } });
  mocks.mockMaybeSingle.mockResolvedValue({ data: { empresa_id: EMPRESA_ID }, error: null });
  mocks.mockSingle.mockResolvedValue({ data: { id: ORDEN_ID }, error: null });
  mocks.mockCheckRateLimit.mockResolvedValue({ ok: true, retryAfterSeconds: 0, skipped: false });
});

describe('listarOrdenes', () => {
  it('rechaza sin auth', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: null } });
    const r = await listarOrdenes({});
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain('autenticado');
  });

  it('rechaza sin empresa', async () => {
    mocks.mockMaybeSingle.mockResolvedValue({ data: null, error: null });
    const r = await listarOrdenes({});
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain('empresa');
  });

  it('acepta sin vehiculo_id y devuelve array', async () => {
    const r = await listarOrdenes({});
    expect(r.ok).toBe(true);
    if (r.ok) expect(Array.isArray(r.data)).toBe(true);
  });
});

describe('listarOrdenesEmpresa', () => {
  it('delega en listarOrdenes', async () => {
    const r = await listarOrdenesEmpresa();
    expect(r.ok).toBe(true);
  });
});

describe('obtenerOrden', () => {
  it('rechaza id invalido', async () => {
    const r = await obtenerOrden({ id: 'no-uuid' });
    expect(r.ok).toBe(false);
  });

  it('falla si no existe', async () => {
    mocks.mockMaybeSingle.mockResolvedValueOnce({ data: { empresa_id: EMPRESA_ID }, error: null });
    mocks.mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
    const r = await obtenerOrden({ id: ORDEN_ID });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain('no encontrada');
  });
});

describe('crearOrden', () => {
  it('rechaza sin auth', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: null } });
    const r = await crearOrden({ vehiculo_id: VEHICULO_ID, km_servicio: 1000 });
    expect(r.ok).toBe(false);
  });

  it('rechaza rate limit', async () => {
    mocks.mockCheckRateLimit.mockResolvedValue({ ok: false, retryAfterSeconds: 30, skipped: false });
    const r = await crearOrden({ vehiculo_id: VEHICULO_ID, km_servicio: 1000 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain('Demasiadas');
  });

  it('rechaza vehiculo de otra empresa', async () => {
    mocks.mockMaybeSingle.mockResolvedValueOnce({ data: { empresa_id: EMPRESA_ID }, error: null });
    mocks.mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
    const r = await crearOrden({ vehiculo_id: VEHICULO_ID, km_servicio: 1000 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain('Vehiculo');
  });
});

describe('completarOrden', () => {
  it('rechaza id invalido', async () => {
    const r = await completarOrden({ id: 'no-uuid' });
    expect(r.ok).toBe(false);
  });

  it('rechaza si la orden no es borrador', async () => {
    mocks.mockMaybeSingle.mockResolvedValueOnce({ data: { empresa_id: EMPRESA_ID }, error: null });
    mocks.mockMaybeSingle.mockResolvedValueOnce({ data: { id: ORDEN_ID, estado: 'completada', vehiculo_id: VEHICULO_ID, fecha: '2026-10-01', km_servicio: 50000 }, error: null });
    const r = await completarOrden({ id: ORDEN_ID });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain('borrador');
  });
});

describe('anularOrden', () => {
  it('rechaza id invalido', async () => {
    const r = await anularOrden({ id: 'no-uuid' });
    expect(r.ok).toBe(false);
  });

  it('rechaza si ya esta anulada', async () => {
    mocks.mockMaybeSingle.mockResolvedValueOnce({ data: { empresa_id: EMPRESA_ID }, error: null });
    mocks.mockMaybeSingle.mockResolvedValueOnce({ data: { id: ORDEN_ID, estado: 'anulada', observaciones: null, vehiculo_id: VEHICULO_ID }, error: null });
    const r = await anularOrden({ id: ORDEN_ID });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain('anulada');
  });
});

describe('eliminarOrdenBorrador', () => {
  it('rechaza id invalido', async () => {
    const r = await eliminarOrdenBorrador({ id: 'no-uuid' });
    expect(r.ok).toBe(false);
  });

  it('rechaza si no es borrador', async () => {
    mocks.mockMaybeSingle.mockResolvedValueOnce({ data: { empresa_id: EMPRESA_ID }, error: null });
    mocks.mockMaybeSingle.mockResolvedValueOnce({ data: { id: ORDEN_ID, estado: 'completada', vehiculo_id: VEHICULO_ID }, error: null });
    const r = await eliminarOrdenBorrador({ id: ORDEN_ID });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain('borrador');
  });
});