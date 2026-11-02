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
  obtenerContadoresAdmin,
  listarEmpresasAdmin,
  obtenerEmpresaAdmin,
} from './admin-actions';

type ChainOpts = {
  maybeSingle?: { data: unknown; error: unknown };
  order?: { data: unknown; error: unknown };
  in?: { data: unknown; error: unknown };
  count?: { count: number; error: unknown };
  list?: { data: unknown; error: unknown };
};

function makeChain(opts: ChainOpts) {
  const chain: Record<string, unknown> = {};
  const self = () => chain;
  chain.select = vi.fn(self);
  chain.eq = vi.fn(self);
  chain.order = vi.fn(() => Promise.resolve(opts.order ?? { data: [], error: null }));
  chain.in = vi.fn(() => Promise.resolve(opts.in ?? { data: [], error: null }));
  chain.maybeSingle = vi.fn(() => Promise.resolve(opts.maybeSingle ?? { data: null, error: null }));
  chain.then = (resolve: (v: unknown) => unknown) => {
    const value = opts.count
      ? { count: opts.count.count, error: opts.count.error, data: null }
      : opts.list ?? { data: [], error: null };
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

describe('obtenerContadoresAdmin', () => {
  beforeEach(() => {
    mocks.mockGetUser.mockReset();
    mocks.mockRlsFrom.mockReset();
    mocks.mockAdminFrom.mockReset();
  });

  it('devuelve error si no hay sesion', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: null } });
    const r = await obtenerContadoresAdmin();
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/no autenticado/i);
    expect(mocks.mockAdminFrom).not.toHaveBeenCalled();
  });

  it('devuelve error si el usuario no es admin_general', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    mocks.mockRlsFrom.mockImplementation(() =>
      makeChain({ maybeSingle: { data: { rol: 'propietario' }, error: null } })
    );
    const r = await obtenerContadoresAdmin();
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/no autorizado/i);
    expect(mocks.mockAdminFrom).not.toHaveBeenCalled();
  });

  it('devuelve los 4 contadores con service_role', async () => {
    mockRlsAdmin();
    const counts: Record<string, number> = {
      empresa: 5,
      usuario: 20,
      establecimiento_publico: 3,
      orden_trabajo: 42,
    };
    mocks.mockAdminFrom.mockImplementation((table: string) =>
      makeChain({ count: { count: counts[table] ?? 0, error: null } })
    );

    const r = await obtenerContadoresAdmin();
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.empresas).toBe(5);
      expect(r.data.usuarios).toBe(20);
      expect(r.data.establecimientosPublicados).toBe(3);
      expect(r.data.ordenes).toBe(42);
    }
  });
});
describe('listarEmpresasAdmin', () => {
  beforeEach(() => {
    mocks.mockGetUser.mockReset();
    mocks.mockRlsFrom.mockReset();
    mocks.mockAdminFrom.mockReset();
  });

  it('devuelve error si no hay sesion', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: null } });
    const r = await listarEmpresasAdmin();
    expect(r.ok).toBe(false);
  });

  it('devuelve array vacio si no hay empresas', async () => {
    mockRlsAdmin();
    mocks.mockAdminFrom.mockImplementation((table: string) => {
      if (table === 'empresa') {
        return makeChain({ order: { data: [], error: null } });
      }
      return makeChain({ list: { data: [], error: null } });
    });

    const r = await listarEmpresasAdmin();
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toEqual([]);
  });

  it('devuelve empresas con contadores agrupados por empresa_id', async () => {
    mockRlsAdmin();
    const empresas = [
      { id: 'e-1', nombre: 'Import Japan', activa: true, created_at: '2026-01-01' },
      { id: 'e-2', nombre: 'Taller B', activa: false, created_at: '2026-02-01' },
    ];
    mocks.mockAdminFrom.mockImplementation((table: string) => {
      if (table === 'empresa') {
        return makeChain({ order: { data: empresas, error: null } });
      }
      if (table === 'usuario') {
        return makeChain({
          list: {
            data: [{ empresa_id: 'e-1' }, { empresa_id: 'e-1' }, { empresa_id: 'e-2' }],
            error: null,
          },
        });
      }
      if (table === 'cliente') {
        return makeChain({ list: { data: [{ empresa_id: 'e-1' }], error: null } });
      }
      if (table === 'vehiculo') {
        return makeChain({ list: { data: [], error: null } });
      }
      if (table === 'orden_trabajo') {
        return makeChain({ list: { data: [{ empresa_id: 'e-1' }, { empresa_id: 'e-2' }], error: null } });
      }
      return makeChain({ list: { data: [], error: null } });
    });

    const r = await listarEmpresasAdmin();
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data).toHaveLength(2);
      const e1 = r.data.find((x) => x.id === 'e-1')!;
      const e2 = r.data.find((x) => x.id === 'e-2')!;
      expect(e1.usuarios).toBe(2);
      expect(e1.clientes).toBe(1);
      expect(e1.vehiculos).toBe(0);
      expect(e1.ordenes).toBe(1);
      expect(e2.usuarios).toBe(1);
      expect(e2.clientes).toBe(0);
      expect(e2.ordenes).toBe(1);
    }
  });
});
describe('obtenerEmpresaAdmin', () => {
  beforeEach(() => {
    mocks.mockGetUser.mockReset();
    mocks.mockRlsFrom.mockReset();
    mocks.mockAdminFrom.mockReset();
  });

  it('devuelve error si no hay sesion', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: null } });
    const r = await obtenerEmpresaAdmin('e-1');
    expect(r.ok).toBe(false);
  });

  it('devuelve notFound si la empresa no existe', async () => {
    mockRlsAdmin();
    mocks.mockAdminFrom.mockImplementation(() =>
      makeChain({ maybeSingle: { data: null, error: null } })
    );
    const r = await obtenerEmpresaAdmin('no-existe');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.notFound).toBe(true);
  });

  it('devuelve el detalle completo de la empresa', async () => {
    mockRlsAdmin();
    const empresa = {
      id: 'e-1',
      nombre: 'Import Japan',
      ruc: '80012345-6',
      telefono: '+595983223346',
      direccion: 'Encarnacion',
      activa: true,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-02T00:00:00Z',
    };
    const establecimientos = [
      { id: 'est-1', nombre: 'Local Centro', ciudad: 'Encarnacion' },
    ];
    const publicados = [{ establecimiento_id: 'est-1', publicado: true }];
    const usuarios = [
      { id: 'u-1', nombre: 'Luis', email: 'luis@example.com', rol: 'propietario' },
    ];

    // Chain dual: decide count vs list segun el primer arg de select().
    function makeDualChain(dual: {
      count?: { count: number; error: unknown };
      list?: { data: unknown; error: unknown };
      order?: { data: unknown; error: unknown };
      in?: { data: unknown; error: unknown };
      maybeSingle?: { data: unknown; error: unknown };
    }) {
      const chain: Record<string, unknown> = {};
      let selectArg: unknown = undefined;
      chain.select = vi.fn((arg: unknown) => {
        selectArg = arg;
        return chain;
      });
      chain.eq = vi.fn(() => chain);
      chain.order = vi.fn(() => Promise.resolve(dual.order ?? dual.list ?? { data: [], error: null }));
      chain.in = vi.fn(() => Promise.resolve(dual.in ?? { data: [], error: null }));
      chain.maybeSingle = vi.fn(() =>
        Promise.resolve(dual.maybeSingle ?? { data: null, error: null })
      );
      chain.then = (resolve: (v: unknown) => unknown) => {
        const isCount =
          dual.count !== undefined &&
          typeof selectArg === 'string' &&
          (selectArg === '*' || selectArg.includes('*'));
        const value = isCount
          ? { count: dual.count!.count, error: dual.count!.error, data: null }
          : dual.list ?? { data: [], error: null };
        return Promise.resolve(value).then(resolve);
      };
      return chain;
    }

    mocks.mockAdminFrom.mockImplementation((table: string) => {
      if (table === 'empresa') {
        return makeDualChain({ maybeSingle: { data: empresa, error: null } });
      }
      if (table === 'usuario') {
        return makeDualChain({
          count: { count: 1, error: null },
          list: { data: usuarios, error: null },
        });
      }
      if (table === 'cliente') {
        return makeDualChain({ count: { count: 2, error: null } });
      }
      if (table === 'vehiculo') {
        return makeDualChain({ count: { count: 1, error: null } });
      }
      if (table === 'orden_trabajo') {
        return makeDualChain({ count: { count: 5, error: null } });
      }
      if (table === 'establecimiento_publico') {
        return makeDualChain({
          count: { count: 1, error: null },
          in: { data: publicados, error: null },
        });
      }
      if (table === 'establecimiento') {
        return makeDualChain({ list: { data: establecimientos, error: null } });
      }
      return makeDualChain({});
    });

    const r = await obtenerEmpresaAdmin('e-1');
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.id).toBe('e-1');
      expect(r.data.nombre).toBe('Import Japan');
      expect(r.data.contadores.usuarios).toBe(1);
      expect(r.data.contadores.clientes).toBe(2);
      expect(r.data.contadores.vehiculos).toBe(1);
      expect(r.data.contadores.ordenes).toBe(5);
      expect(r.data.contadores.establecimientosPublicados).toBe(1);
      expect(r.data.establecimientos).toHaveLength(1);
      expect(r.data.establecimientos[0].publicado).toBe(true);
      expect(r.data.usuarios).toHaveLength(1);
    }
  });
});