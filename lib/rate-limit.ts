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

export async function checkRateLimit(opts: RateLimitOptions): Promise<RateLimitResult> {
  const { clave, max, ventanaSegundos } = opts;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_clave: clave,
      p_max: max,
      p_ventana_segundos: ventanaSegundos,
    });
    if (error) {
      console.warn('[rate-limit] RPC error, permitiendo (fail-open dev):', error.message);
      return { ok: true, retryAfterSeconds: 0, skipped: true };
    }
    const permitido = data === true;
    return { ok: permitido, retryAfterSeconds: permitido ? 0 : ventanaSegundos, skipped: false };
  } catch (e) {
    console.warn('[rate-limit] excepcion, permitiendo (fail-open dev):', e);
    return { ok: true, retryAfterSeconds: 0, skipped: true };
  }
}

export function buildClave(parts: (string | undefined | null)[]): string {
  return parts.filter((p): p is string => Boolean(p)).join(':');
}
