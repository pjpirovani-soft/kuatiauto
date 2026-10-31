import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => ({
  mockRpc: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    rpc: mocks.mockRpc,
  })),
}));

import { checkRateLimit, buildClave } from './rate-limit';

describe('buildClave', () => {
  it('une partes con ":"', () => {
    expect(buildClave(['login', 'user@example.com'])).toBe('login:user@example.com');
  });

  it('filtra null y undefined', () => {
    expect(buildClave(['login', null, 'user@example.com', undefined])).toBe('login:user@example.com');
  });

  it('filtra strings vacios', () => {
    expect(buildClave(['', 'a', '', 'b'])).toBe('a:b');
  });

  it('devuelve string vacio si todo es null/undefined', () => {
    expect(buildClave([null, undefined])).toBe('');
  });
});

describe('checkRateLimit', () => {
  beforeEach(() => {
    mocks.mockRpc.mockReset();
  });

  it('devuelve ok:true cuando RPC responde true', async () => {
    mocks.mockRpc.mockResolvedValue({ data: true, error: null });
    const r = await checkRateLimit({ clave: 'login:x', max: 5, ventanaSegundos: 60 });
    expect(r.ok).toBe(true);
    expect(r.retryAfterSeconds).toBe(0);
    expect(r.skipped).toBe(false);
    expect(mocks.mockRpc).toHaveBeenCalledWith('check_rate_limit', {
      p_clave: 'login:x',
      p_max: 5,
      p_ventana_segundos: 60,
    });
  });

  it('devuelve ok:false cuando RPC responde false', async () => {
    mocks.mockRpc.mockResolvedValue({ data: false, error: null });
    const r = await checkRateLimit({ clave: 'login:x', max: 5, ventanaSegundos: 60 });
    expect(r.ok).toBe(false);
    expect(r.retryAfterSeconds).toBe(60);
    expect(r.skipped).toBe(false);
  });

  it('fail-open cuando RPC devuelve error', async () => {
    mocks.mockRpc.mockResolvedValue({ data: null, error: { message: 'boom' } });
    const r = await checkRateLimit({ clave: 'login:x', max: 5, ventanaSegundos: 60 });
    expect(r.ok).toBe(true);
    expect(r.skipped).toBe(true);
  });

  it('fail-open cuando RPC lanza excepcion', async () => {
    mocks.mockRpc.mockRejectedValue(new Error('network'));
    const r = await checkRateLimit({ clave: 'login:x', max: 5, ventanaSegundos: 60 });
    expect(r.ok).toBe(true);
    expect(r.skipped).toBe(true);
  });
});