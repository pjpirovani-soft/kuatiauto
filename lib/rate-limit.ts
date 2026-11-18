// lib/rate-limit.ts
// Helper server-side para rate limiting. Usa check_rate_limit() de la migracion 009.
// check_rate_limit es SECURITY DEFINER con grant a authenticated/anon. No requiere service_role.

import { createClient } from '@/lib/supabase/server';

export type RateLimitResult = {
  ok: boolean;
  retryAfterSeconds: number;
  skipped: boolean;
};

export type RateLimitOptions = {
  clave: string;
  max: number;
  ventanaSegundos: number;
};

// KU-SEC-03: modo de fallo configurable con DEFAULT SEGURO.
// 'open': si falla el RPC, permite. Solo para desarrollo explicito.
// 'closed': si falla el RPC, bloquea (fail-closed). DEFAULT en produccion.
// Si RATE_LIMIT_FAIL_MODE no esta definido:
//   - NODE_ENV=development -> 'open' (no bloquear el desarrollo local)
//   - cualquier otro caso   -> 'closed' (fail-closed por defecto)
function getFailMode(): 'open' | 'closed' {
  const mode = process.env.RATE_LIMIT_FAIL_MODE;
  if (mode === 'open') return 'open';
  if (mode === 'closed') return 'closed';
  return process.env.NODE_ENV === 'development' ? 'open' : 'closed';
}

export async function checkRateLimit(opts: RateLimitOptions): Promise<RateLimitResult> {
  const { clave, max, ventanaSegundos } = opts;
  const failMode = getFailMode();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_clave: clave,
      p_max: max,
      p_ventana_segundos: ventanaSegundos,
    });
    if (error) {
      console.warn(`[rate-limit] RPC error (fail-${failMode}):`, error.message);
      if (failMode === 'closed') {
        return { ok: false, retryAfterSeconds: ventanaSegundos, skipped: false };
      }
      return { ok: true, retryAfterSeconds: 0, skipped: true };
    }
    const permitido = data === true;
    return { ok: permitido, retryAfterSeconds: permitido ? 0 : ventanaSegundos, skipped: false };
  } catch (e) {
    console.warn(`[rate-limit] excepcion (fail-${failMode}):`, e);
    if (failMode === 'closed') {
      return { ok: false, retryAfterSeconds: ventanaSegundos, skipped: false };
    }
    return { ok: true, retryAfterSeconds: 0, skipped: true };
  }
}

export function buildClave(parts: (string | undefined | null)[]): string {
  return parts.filter((p): p is string => Boolean(p)).join(':');
}