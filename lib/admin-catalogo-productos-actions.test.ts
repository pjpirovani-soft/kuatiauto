import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockRlsFrom: vi.fn(),
  mockAdminFrom: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: mocks.mockGetUser },
    from: mocks.mockRlsFrom,
  })),
}));

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(() => ({
    from: mocks.mockAdminFrom,
  })),
}));

import {
  listarProductosGlobalesAdmin,
  crearProductoGlobal,
  editarProductoGlobal,
  eliminarProductoGlobal,
  obtenerProductoGlobalAdmin,
} from './admin-actions';

function makeChain(opts: {
  maybeSingle?: { data: unknown; error: unknown };
  order?: { data: unknown; error: unknown };
  update?: { error: unknown };
  insert?: { error: unknown };
  delete?: { error: unknown };
}) {
  const chain: Record<string, unknown> = {};
  chain.select = vi.fn(() => chain);
  chain.eq = vi.fn(() => chain);
  chain.order = vi.fn(() => Promise.resolve(opts.order ?? { data: [], error: null }));
  chain.update = vi.fn(() => chain);
  chain.insert = vi.fn(() => chain);
  chain.delete = vi.fn(() => chain);
  chain.maybeSingle = vi.fn(() =>
    Promise.resolve(opts.maybeSingle ?? { data: null, error: null })
  );
  chain.then = (resolve: (v: unknown) => unknown) => {
    let value: unknown;
    if (opts.insert) value = { data: null, error: opts.insert.error };
    else if (opts.update) value = { data: null, error: opts.update.error };
    else if (opts.delete) value = { data: null, error: opts.delete.error };
    else value = { data: null, error: null };
    return Promise.resolve(value).then(resolve);
  };
  return chain;
}

function mockRlsAdmin() {
  mocks.mockGetUser.mockResolvedValue({ data: { user: { id: 'admin-1' } } });
  mocks.mockRlsFrom.mockImplementation((table: string) => {
    if (table === 'usuario') {
      return makeChain({ maybeSingle: { data: { rol: 'admin_general' }, error: null } });
    }
    return makeChain({});
  });
}

const UUID_V4 = '550e8400-e29b-41d4-a716-446655440000';

describe('listarProductosGlobalesAdmin', () => {
  beforeEach(() => {
    mocks.mockGetUser.mockReset();
    mocks.mockRlsFrom.mockReset();
    mocks.mockAdminFrom.mockReset();
  });

  it('error si no hay sesion', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: null } });
    const r = await listarProductosGlobalesAdmin();
    expect(r.ok).toBe(false);
  });

  it('error si no es admin', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: { id: 'u-1' } } });
    mocks.mockRlsFrom.mockImplementation(() =>
      makeChain({ maybeSingle: { data: { rol: 'propietario' }, error: null } })
    );
    const r = await listarProductosGlobalesAdmin();
    expect(r.ok).toBe(false);
  });

  it('devuelve la lista', async () => {
    mockRlsAdmin();
    const productos = [
      { id: UUID_V4, nombre: 'Filtro de aceite', marca: 'Mann', tipo: 'Filtro', viscosidad: null, created_at: '2026-01-01', updated_at: '2026-01-01' },
    ];
    mocks.mockAdminFrom.mockImplementation(() =>
      makeChain({ order: { data: productos, error: null } })
    );
    const r = await listarProductosGlobalesAdmin();
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toHaveLength(1);
  });
});

describe('crearProductoGlobal', () => {
  beforeEach(() => {
    mocks.mockGetUser.mockReset();
    mocks.mockRlsFrom.mockReset();
    mocks.mockAdminFrom.mockReset();
  });

  it('rechaza nombre muy corto', async () => {
    mockRlsAdmin();
    const r = await crearProductoGlobal({ nombre: 'A' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/nombre invalido/i);
  });

  it('crea el producto', async () => {
    mockRlsAdmin();
    let insertCalled = false;
    mocks.mockAdminFrom.mockImplementation((table: string) => {
      if (table === 'producto_global') {
        const chain = makeChain({ insert: { error: null } });
        const origInsert = chain.insert as (v: unknown) => unknown;
        chain.insert = vi.fn((v: unknown) => {
          insertCalled = true;
          return origInsert(v);
        });
        return chain;
      }
      return makeChain({});
    });
    const r = await crearProductoGlobal({
      nombre: 'Aceite sintetico',
      marca: 'Mobil',
      viscosidad: '10W-40',
    });
    expect(r.ok).toBe(true);
    expect(insertCalled).toBe(true);
  });
});

describe('editarProductoGlobal', () => {
  beforeEach(() => {
    mocks.mockGetUser.mockReset();
    mocks.mockRlsFrom.mockReset();
    mocks.mockAdminFrom.mockReset();
  });

  it('rechaza id vacio', async () => {
    mockRlsAdmin();
    const r = await editarProductoGlobal({ id: '', nombre: 'Test' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/id invalido/i);
  });

  it('edita el producto', async () => {
    mockRlsAdmin();
    mocks.mockAdminFrom.mockImplementation((table: string) => {
      if (table === 'producto_global') {
        return makeChain({ update: { error: null } });
      }
      return makeChain({});
    });
    const r = await editarProductoGlobal({ id: UUID_V4, nombre: 'Aceite 5W-30' });
    expect(r.ok).toBe(true);
  });
});

describe('eliminarProductoGlobal', () => {
  beforeEach(() => {
    mocks.mockGetUser.mockReset();
    mocks.mockRlsFrom.mockReset();
    mocks.mockAdminFrom.mockReset();
  });

  it('rechaza id vacio', async () => {
    mockRlsAdmin();
    const r = await eliminarProductoGlobal('');
    expect(r.ok).toBe(false);
  });

  it('elimina el producto', async () => {
    mockRlsAdmin();
    mocks.mockAdminFrom.mockImplementation((table: string) => {
      if (table === 'producto_global') {
        return makeChain({ delete: { error: null } });
      }
      return makeChain({});
    });
    const r = await eliminarProductoGlobal(UUID_V4);
    expect(r.ok).toBe(true);
  });
});

describe('obtenerProductoGlobalAdmin', () => {
  beforeEach(() => {
    mocks.mockGetUser.mockReset();
    mocks.mockRlsFrom.mockReset();
    mocks.mockAdminFrom.mockReset();
  });

  it('devuelve notFound si no existe', async () => {
    mockRlsAdmin();
    mocks.mockAdminFrom.mockImplementation(() =>
      makeChain({ maybeSingle: { data: null, error: null } })
    );
    const r = await obtenerProductoGlobalAdmin(UUID_V4);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.notFound).toBe(true);
  });

  it('devuelve el producto', async () => {
    mockRlsAdmin();
    const producto = {
      id: UUID_V4,
      nombre: 'Aceite sintetico',
      marca: 'Mobil',
      tipo: 'Aceite',
      viscosidad: '10W-40',
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
    };
    mocks.mockAdminFrom.mockImplementation(() =>
      makeChain({ maybeSingle: { data: producto, error: null } })
    );
    const r = await obtenerProductoGlobalAdmin(UUID_V4);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.marca).toBe('Mobil');
  });
});