import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockRpc: vi.fn(),
  mockAuditLog: vi.fn(async () => true),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: mocks.mockGetUser },
    rpc: mocks.mockRpc,
  })),
}));

vi.mock('@/lib/audit', () => ({
  auditLog: mocks.mockAuditLog,
}));

import { crearEmpresa } from './empresa-actions';

describe('crearEmpresa', () => {
  beforeEach(() => {
    mocks.mockGetUser.mockReset();
    mocks.mockRpc.mockReset();
    mocks.mockAuditLog.mockClear();
  });

  it('rechaza nombre muy corto', async () => {
    const r = await crearEmpresa({ nombre: 'A' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/al menos 2 caracteres/i);
    expect(mocks.mockRpc).not.toHaveBeenCalled();
  });

  it('rechaza input invalido (sin nombre)', async () => {
    const r = await crearEmpresa({});
    expect(r.ok).toBe(false);
  });

  it('devuelve error si no hay sesion', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: null } });
    const r = await crearEmpresa({ nombre: 'Import Japan' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/no autenticado/i);
    expect(mocks.mockRpc).not.toHaveBeenCalled();
  });

  it('llama RPC con params undefined en campos null y audita', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    mocks.mockRpc.mockResolvedValue({ data: 'empresa-uuid', error: null });

    const r = await crearEmpresa({ nombre: 'Import Japan - Autorepuestos', telefono: '+595983223346' });

    expect(r.ok).toBe(true);
    if (r.ok) expect(r.empresaId).toBe('empresa-uuid');

    expect(mocks.mockRpc).toHaveBeenCalledWith('crear_empresa_con_establecimiento', {
      p_nombre: 'Import Japan - Autorepuestos',
      p_ruc: undefined,
      p_direccion: undefined,
      p_telefono: '+595983223346',
    });

    expect(mocks.mockAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        usuarioId: 'user-1',
        empresaId: 'empresa-uuid',
        accion: 'crear',
        entidad: 'empresa',
        entidadId: 'empresa-uuid',
      }),
    );
  });

  it('devuelve error cuando RPC falla', async () => {
    mocks.mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    mocks.mockRpc.mockResolvedValue({ data: null, error: { message: 'rpc boom' } });

    const r = await crearEmpresa({ nombre: 'Import Japan' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe('rpc boom');
    expect(mocks.mockAuditLog).not.toHaveBeenCalled();
  });
});