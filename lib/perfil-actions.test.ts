import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockFrom: vi.fn(),
  mockSignInWithPassword: vi.fn(),
  mockUpdateUser: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: mocks.mockGetUser,
      signInWithPassword: mocks.mockSignInWithPassword,
      updateUser: mocks.mockUpdateUser,
    },
    from: mocks.mockFrom,
  })),
}));

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

import { obtenerPerfil, actualizarNombre, cambiarPassword } from './perfil-actions';

type MaybeSingleResult = { data: unknown; error: unknown };

function chainMaybeSingle(result: MaybeSingleResult) {
  return {
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        maybeSingle: vi.fn(() => Promise.resolve(result)),
      })),
    })),
  };
}

const USER = { id: 'u-1', email: 'test@example.com', user_metadata: {} };

beforeEach(() => {
  mocks.mockGetUser.mockReset();
  mocks.mockFrom.mockReset();
  mocks.mockSignInWithPassword.mockReset();
  mocks.mockUpdateUser.mockReset();
});

describe('obtenerPerfil', () => {
  it('devuelve null si no hay sesion', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: null } });
    const r = await obtenerPerfil();
    expect(r).toBeNull();
    expect(mocks.mockFrom).not.toHaveBeenCalled();
  });

  it('devuelve null-ish si usuario no existe en tabla', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: USER } });
    mocks.mockFrom.mockReturnValue(chainMaybeSingle({ data: null, error: null }));
    const r = await obtenerPerfil();
    expect(r).not.toBeNull();
    expect(r?.email).toBe('test@example.com');
    expect(r?.nombre).toBe('');
    expect(r?.rol).toBe('empleado');
    expect(r?.empresa_id).toBeNull();
  });

  it('devuelve email de auth (no de usuario.email)', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: USER } });
    mocks.mockFrom.mockReturnValue(
      chainMaybeSingle({
        data: { nombre: 'Luis', rol: 'propietario', empresa_id: 'e-1', email: 'otro@example.com' },
        error: null,
      }),
    );
    const r = await obtenerPerfil();
    expect(r?.email).toBe('test@example.com');
  });

  it('devuelve nombre y rol de tabla usuario', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: USER } });
    mocks.mockFrom.mockReturnValue(
      chainMaybeSingle({
        data: { nombre: 'Luis', rol: 'conductor', empresa_id: null },
        error: null,
      }),
    );
    const r = await obtenerPerfil();
    expect(r?.nombre).toBe('Luis');
    expect(r?.rol).toBe('conductor');
  });

  it('nombre vacio si usuario.nombre es null', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: USER } });
    mocks.mockFrom.mockReturnValue(
      chainMaybeSingle({ data: { nombre: null, rol: 'empleado', empresa_id: null }, error: null }),
    );
    const r = await obtenerPerfil();
    expect(r?.nombre).toBe('');
  });

  it('rol desconocido cae a empleado', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: USER } });
    mocks.mockFrom.mockReturnValue(
      chainMaybeSingle({ data: { nombre: 'X', rol: 'superadmin_raro', empresa_id: null }, error: null }),
    );
    const r = await obtenerPerfil();
    expect(r?.rol).toBe('empleado');
  });
});

describe('actualizarNombre', () => {
  it('error si no hay sesion', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: null } });
    const r = await actualizarNombre('Nuevo');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/no autenticado/i);
  });

  it('error si nombre muy corto', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: USER } });
    const r = await actualizarNombre('A');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/al menos 2/i);
  });

  it('error si nombre muy largo', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: USER } });
    const r = await actualizarNombre('x'.repeat(81));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/80/i);
  });

  it('ok + update con nombre trimmed', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: USER } });
    const updateMock = vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ error: null })),
    }));
    mocks.mockFrom.mockReturnValue({ update: updateMock });

    const r = await actualizarNombre('  Luis  ');
    expect(r.ok).toBe(true);
    expect(updateMock).toHaveBeenCalledWith({ nombre: 'Luis' });
  });

  it('error propagado de supabase', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: USER } });
    const eqMock = vi.fn(() => Promise.resolve({ error: { message: 'DB error' } }));
    mocks.mockFrom.mockReturnValue({
      update: vi.fn(() => ({ eq: eqMock })),
    });
    const r = await actualizarNombre('Luis');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe('DB error');
  });
});

describe('cambiarPassword', () => {
  it('error si no hay sesion', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: null } });
    const r = await cambiarPassword('oldpass123', 'newpass123');
    expect(r.ok).toBe(false);
  });

  it('error si password nueva < 8', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: USER } });
    const r = await cambiarPassword('oldpass123', 'short');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/8 caracteres/i);
  });

  it('error si password nueva === actual', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: USER } });
    const r = await cambiarPassword('samepass123', 'samepass123');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/distinta/i);
  });

  it('error si re-auth falla', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: USER } });
    mocks.mockSignInWithPassword.mockResolvedValue({
      error: { message: 'Invalid credentials' },
    });
    const r = await cambiarPassword('wrongpass', 'newpass123');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/actual no es correcta/i);
    expect(mocks.mockUpdateUser).not.toHaveBeenCalled();
  });

  it('ok + updateUser con password nueva', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: USER } });
    mocks.mockSignInWithPassword.mockResolvedValue({ error: null });
    mocks.mockUpdateUser.mockResolvedValue({ error: null });
    const r = await cambiarPassword('oldpass123', 'newpass123');
    expect(r.ok).toBe(true);
    expect(mocks.mockUpdateUser).toHaveBeenCalledWith({ password: 'newpass123' });
  });

  it('error propagado de updateUser', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: USER } });
    mocks.mockSignInWithPassword.mockResolvedValue({ error: null });
    mocks.mockUpdateUser.mockResolvedValue({ error: { message: 'Update failed' } });
    const r = await cambiarPassword('oldpass123', 'newpass123');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe('Update failed');
  });
});