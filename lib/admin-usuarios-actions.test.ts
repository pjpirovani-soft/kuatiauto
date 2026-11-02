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
  listarUsuariosAdmin,
  cambiarRolUsuario,
  desactivarUsuario,
} from './admin-actions';

function makeChain(opts: {
  maybeSingle?: { data: unknown; error: unknown };
  order?: { data: unknown; error: unknown };
  in?: { data: unknown; error: unknown };
  count?: { count: number; error: unknown };
  update?: { error: unknown };
  list?: { data: unknown; error: unknown };
}) {
  const chain: Record<string, unknown> = {};
  let selectArg: unknown = undefined;
  chain.select = vi.fn((arg: unknown) => {
    selectArg = arg;
    return chain;
  });
  chain.eq = vi.fn(() => chain);
  chain.update = vi.fn(() => chain);
  chain.order = vi.fn(() => Promise.resolve(opts.order ?? { data: [], error: null }));
  chain.in = vi.fn(() => Promise.resolve(opts.in ?? { data: [], error: null }));
  chain.maybeSingle = vi.fn(() =>
    Promise.resolve(opts.maybeSingle ?? { data: null, error: null })
  );
  chain.then = (resolve: (v: unknown) => unknown) => {
    let value: unknown;
    if (opts.update) value = { data: null, error: opts.update.error };
    else if (opts.count) value = { count: opts.count.count, error: opts.count.error, data: null };
    else value = opts.list ?? { data: [], error: null };
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

describe('listarUsuariosAdmin', () => {
  beforeEach(() => {
    mocks.mockGetUser.mockReset();
    mocks.mockRlsFrom.mockReset();
    mocks.mockAdminFrom.mockReset();
  });

  it('devuelve error si no hay sesion', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: null } });
    const r = await listarUsuariosAdmin();
    expect(r.ok).toBe(false);
  });

  it('devuelve error si no es admin', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: { id: 'u-1' } } });
    mocks.mockRlsFrom.mockImplementation(() =>
      makeChain({ maybeSingle: { data: { rol: 'propietario' }, error: null } })
    );
    const r = await listarUsuariosAdmin();
    expect(r.ok).toBe(false);
  });

  it('mapea empresa_nombre y devuelve lista', async () => {
    mockRlsAdmin();
    const usuarios = [
      { id: 'u-1', nombre: 'Luis', email: 'luis@e.com', rol: 'propietario', activo: true, empresa_id: 'e-1', created_at: '2026-01-01' },
      { id: 'u-2', nombre: null, email: 'admin@e.com', rol: 'admin_general', activo: true, empresa_id: null, created_at: '2026-01-02' },
    ];
    const empresas = [{ id: 'e-1', nombre: 'Import Japan' }];
    mocks.mockAdminFrom.mockImplementation((table: string) => {
      if (table === 'usuario') {
        return makeChain({ order: { data: usuarios, error: null } });
      }
      if (table === 'empresa') {
        return makeChain({ in: { data: empresas, error: null } });
      }
      return makeChain({});
    });

    const r = await listarUsuariosAdmin();
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data).toHaveLength(2);
      const u1 = r.data.find((x) => x.id === 'u-1')!;
      const u2 = r.data.find((x) => x.id === 'u-2')!;
      expect(u1.empresa_nombre).toBe('Import Japan');
      expect(u2.empresa_nombre).toBeNull();
    }
  });

  it('devuelve array vacio si no hay usuarios', async () => {
    mockRlsAdmin();
    mocks.mockAdminFrom.mockImplementation(() =>
      makeChain({ order: { data: [], error: null } })
    );
    const r = await listarUsuariosAdmin();
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toEqual([]);
  });
});

describe('cambiarRolUsuario', () => {
  beforeEach(() => {
    mocks.mockGetUser.mockReset();
    mocks.mockRlsFrom.mockReset();
    mocks.mockAdminFrom.mockReset();
  });

  it('rechaza rol invalido', async () => {
    mockRlsAdmin();
    const r = await cambiarRolUsuario('u-1', 'superadmin');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/no valido/i);
  });

  it('rechaza cambiar el propio rol', async () => {
    mockRlsAdmin();
    const r = await cambiarRolUsuario('admin-1', 'propietario');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/tu propio rol/i);
  });

  it('rechaza cambiar rol de admin_general', async () => {
    mockRlsAdmin();
    mocks.mockAdminFrom.mockImplementation((table: string) => {
      if (table === 'usuario') {
        return makeChain({ maybeSingle: { data: { id: 'u-2', rol: 'admin_general' }, error: null } });
      }
      return makeChain({});
    });
    const r = await cambiarRolUsuario('u-2', 'propietario');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/admin_general/i);
  });

  it('cambia el rol de un usuario comun', async () => {
    mockRlsAdmin();
    let updateCalled = false;
    mocks.mockAdminFrom.mockImplementation((table: string) => {
      if (table === 'usuario') {
        const chain = makeChain({ maybeSingle: { data: { id: 'u-1', rol: 'empleado', empresa_id: 'e-1' }, error: null } });
        const origUpdate = chain.update as (v: unknown) => unknown;
        chain.update = vi.fn((v: unknown) => {
          updateCalled = true;
          return origUpdate(v);
        });
        return chain;
      }
      return makeChain({});
    });
    const r = await cambiarRolUsuario('u-1', 'propietario');
    expect(r.ok).toBe(true);
    expect(updateCalled).toBe(true);
  });

  it('rechaza asignar propietario/empleado a usuario sin empresa', async () => {
    mockRlsAdmin();
    mocks.mockAdminFrom.mockImplementation((table: string) => {
      if (table === 'usuario') {
        return makeChain({ maybeSingle: { data: { id: 'u-1', rol: 'conductor', empresa_id: null }, error: null } });
      }
      return makeChain({});
    });
    const r = await cambiarRolUsuario('u-1', 'empleado');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/no tiene empresa/i);
  });

  it('rechaza asignar conductor a usuario con empresa', async () => {
    mockRlsAdmin();
    mocks.mockAdminFrom.mockImplementation((table: string) => {
      if (table === 'usuario') {
        return makeChain({ maybeSingle: { data: { id: 'u-1', rol: 'propietario', empresa_id: 'e-1' }, error: null } });
      }
      return makeChain({});
    });
    const r = await cambiarRolUsuario('u-1', 'conductor');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/conductor no puede tener empresa/i);
  });
});

describe('desactivarUsuario', () => {
  beforeEach(() => {
    mocks.mockGetUser.mockReset();
    mocks.mockRlsFrom.mockReset();
    mocks.mockAdminFrom.mockReset();
  });

  it('rechaza desactivarse a si mismo', async () => {
    mockRlsAdmin();
    const r = await desactivarUsuario('admin-1', false);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/tu propia cuenta/i);
  });

  it('rechaza desactivar al ultimo admin_general activo', async () => {
    mockRlsAdmin();
    mocks.mockAdminFrom.mockImplementation((table: string) => {
      if (table === 'usuario') {
        // maybeSingle: target admin_general activo; luego count = 1
        return makeChain({
          maybeSingle: { data: { id: 'u-2', rol: 'admin_general', activo: true }, error: null },
          count: { count: 1, error: null },
        });
      }
      return makeChain({});
    });
    const r = await desactivarUsuario('u-2', false);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/ultimo admin_general/i);
  });

  it('desactiva a un usuario comun', async () => {
    mockRlsAdmin();
    mocks.mockAdminFrom.mockImplementation((table: string) => {
      if (table === 'usuario') {
        return makeChain({ maybeSingle: { data: { id: 'u-1', rol: 'empleado', activo: true }, error: null }, update: { error: null } });
      }
      return makeChain({});
    });
    const r = await desactivarUsuario('u-1', false);
    expect(r.ok).toBe(true);
  });

  it('es no-op si el estado ya es el pedido', async () => {
    mockRlsAdmin();
    mocks.mockAdminFrom.mockImplementation((table: string) => {
      if (table === 'usuario') {
        return makeChain({ maybeSingle: { data: { id: 'u-1', rol: 'empleado', activo: false }, error: null } });
      }
      return makeChain({});
    });
    const r = await desactivarUsuario('u-1', false);
    expect(r.ok).toBe(true);
  });
});