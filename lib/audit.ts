// lib/audit.ts
// Helper server-side para insertar en audit_log (F4, D-F4-4).
// Requiere SUPABASE_SERVICE_ROLE_KEY. Sin key: no-op con console.warn (dev).

import { createAdminClient, hasAdminClient } from '@/lib/supabase/admin';

export type AuditAction =
  | 'crear'
  | 'editar'
  | 'eliminar'
  | 'deshabilitar'
  | 'publicar'
  | 'autorizar'
  | 'revocar'
  | 'login'
  | 'rate_limit_exceeded';

export type AuditInput = {
  usuarioId: string | null;
  empresaId: string | null;
  accion: AuditAction;
  entidad: string;
  entidadId?: string | null;
  datosAnteriores?: Record<string, unknown> | null;
  datosNuevos?: Record<string, unknown> | null;
  ip?: string | null;
  userAgent?: string | null;
};

export async function auditLog(input: AuditInput): Promise<boolean> {
  if (!hasAdminClient()) {
    console.warn('[audit] sin SUPABASE_SERVICE_ROLE_KEY: audit_log no persiste');
    return false;
  }
  try {
    const admin = createAdminClient();
    const { error } = await admin.from('audit_log').insert({
      usuario_id: input.usuarioId,
      empresa_id: input.empresaId,
      accion: input.accion,
      entidad: input.entidad,
      entidad_id: input.entidadId ?? null,
      datos_anteriores: input.datosAnteriores ?? null,
      datos_nuevos: input.datosNuevos ?? null,
      ip: input.ip ?? null,
      user_agent: input.userAgent ?? null,
    });
    if (error) {
      console.warn('[audit] insert audit_log:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[audit] excepcion:', e instanceof Error ? e.message : String(e));
    return false;
  }
}
