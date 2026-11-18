import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

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

  afterEach(() => {
    vi.unstubAllEnvs();
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

  it('fail-closed por defecto en produccion (RPC error)', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('RATE_LIMIT_FAIL_MODE', '');
    mocks.mockRpc.mockResolvedValue({ data: null, error: { message: 'boom' } });
    const r = await checkRateLimit({ clave: 'login:x', max: 5, ventanaSegundos: 60 });
    expect(r.ok).toBe(false);
    expect(r.skipped).toBe(false);
    expect(r.retryAfterSeconds).toBe(60);
  });

  it('fail-closed por defecto en produccion (excepcion)', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('RATE_LIMIT_FAIL_MODE', '');
    mocks.mockRpc.mockRejectedValue(new Error('network'));
    const r = await checkRateLimit({ clave: 'login:x', max: 5, ventanaSegundos: 60 });
    expect(r.ok).toBe(false);
    expect(r.skipped).toBe(false);
    expect(r.retryAfterSeconds).toBe(60);
  });

  it('fail-open en desarrollo cuando RPC falla (no bloquea al dev)', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('RATE_LIMIT_FAIL_MODE', '');
    mocks.mockRpc.mockResolvedValue({ data: null, error: { message: 'boom' } });
    const r = await checkRateLimit({ clave: 'login:x', max: 5, ventanaSegundos: 60 });
    expect(r.ok).toBe(true);
    expect(r.skipped).toBe(true);
  });

  it('RATE_LIMIT_FAIL_MODE=open explicito override el default de prod', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('RATE_LIMIT_FAIL_MODE', 'open');
    mocks.mockRpc.mockResolvedValue({ data: null, error: { message: 'boom' } });
    const r = await checkRateLimit({ clave: 'login:x', max: 5, ventanaSegundos: 60 });
    expect(r.ok).toBe(true);
    expect(r.skipped).toBe(true);
  });

  it('RATE_LIMIT_FAIL_MODE=closed explicito override el default de dev', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('RATE_LIMIT_FAIL_MODE', 'closed');
    mocks.mockRpc.mockResolvedValue({ data: null, error: { message: 'boom' } });
    const r = await checkRateLimit({ clave: 'login:x', max: 5, ventanaSegundos: 60 });
    expect(r.ok).toBe(false);
    expect(r.skipped).toBe(false);
  });
});