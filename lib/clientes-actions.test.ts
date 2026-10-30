import { describe, it, expect, vi, beforeEach } from 'vitest';

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

import { crearCliente, editarCliente, eliminarCliente, listarClientes } from './clientes-actions';

const EMPRESA_ID = '11111111-1111-1111-1111-111111111111';
const CLIENTE_ID = '550e8400-e29b-41d4-a716-446655440000';
const USER_ID = '22222222-2222-2222-2222-222222222222';

beforeEach(() => {
  vi.clearAllMocks();
  mocks.mockGetUser.mockResolvedValue({ data: { user: { id: USER_ID } } });
  mocks.mockMaybeSingle.mockResolvedValue({ data: { empresa_id: EMPRESA_ID }, error: null });
  mocks.mockSingle.mockResolvedValue({ data: { id: CLIENTE_ID }, error: null });
  mocks.mockCheckRateLimit.mockResolvedValue({ ok: true, retryAfterSeconds: 0, skipped: false });
  mocks.mockOrder.mockResolvedValue({ data: null, error: null });
  mocks.mockEq.mockReturnValue(chainable);
});

describe('crearCliente', () => {
  it('rechaza input invalido sin llamar a Supabase', async () => {
    const r = await crearCliente({ nombre: 'A' });
    expect(r.ok).toBe(false);
    expect(mocks.mockFrom).not.toHaveBeenCalled();
  });

  it('rechaza sin autenticacion', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: null } });
    const r = await crearCliente({ nombre: 'Juan Perez' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain('autenticado');
  });

  it('rechaza sin empresa asociada', async () => {
    mocks.mockMaybeSingle.mockResolvedValue({ data: null, error: null });
    const r = await crearCliente({ nombre: 'Juan Perez' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain('empresa');
  });

  it('rechaza por rate limit', async () => {
    mocks.mockCheckRateLimit.mockResolvedValue({ ok: false, retryAfterSeconds: 30, skipped: false });
    const r = await crearCliente({ nombre: 'Juan Perez' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain('Demasiadas');
  });

  it('crea cliente valido y audita', async () => {
    const r = await crearCliente({ nombre: 'Juan Perez', telefono: '0981123456' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.id).toBe(CLIENTE_ID);
    expect(mocks.mockAuditLog).toHaveBeenCalledOnce();
  });
});

describe('editarCliente', () => {
  it('rechaza id invalido', async () => {
    const r = await editarCliente({ id: 'no-uuid', nombre: 'Juan' });
    expect(r.ok).toBe(false);
  });

  it('actualiza cliente valido', async () => {
    const r = await editarCliente({ id: CLIENTE_ID, nombre: 'Juan Editado' });
    expect(r.ok).toBe(true);
    expect(mocks.mockAuditLog).toHaveBeenCalledOnce();
  });
});

describe('eliminarCliente', () => {
  it('rechaza id invalido', async () => {
    const r = await eliminarCliente({ id: 'no-uuid' });
    expect(r.ok).toBe(false);
  });

  it('hace soft-delete y audita', async () => {
    const r = await eliminarCliente({ id: CLIENTE_ID });
    expect(r.ok).toBe(true);
    expect(mocks.mockAuditLog).toHaveBeenCalledOnce();
  });
});

describe('listarClientes', () => {
  it('devuelve lista vacia si no hay error', async () => {
    const r = await listarClientes();
    expect(r.ok).toBe(true);
  });
});
