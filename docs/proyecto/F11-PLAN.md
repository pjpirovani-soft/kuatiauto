# F11 — Plan de notificaciones y automatizaciones

**Estado:** APROBADA (2026-10-30).
**Fecha:** 2026-10-30
**Alcance aprobado:** F11a (stub + mocks). Sin cuenta de Resend. El código funciona sin RESEND_API_KEY (mock) y con ella (real).

## Qué incluye F11

1. **Cliente de email con fallback mock** (lib/email/resend.ts).
   - Si existe RESEND_API_KEY → envía real con Resend.
   - Si no → log estructurado + retorno simulado. Los tests usan mock.
   - Interfaz estable: sendEmail({ to, subject, html, text?, idempotencyKey }).

2. **Templates de email** (lib/email/templates/).
   - recordatorio-mantenimiento.ts (próximo service por fecha o km).
   - bienvenida.ts (alta de empresa/establecimiento).
   - historial-compartido.ts (conductor autoriza/revoca).
   - HTML mínimo, texto plano, sin dependencias nuevas.

3. **Tabla notificacion_log** (migración 013_notificaciones.sql).
   - Columnas: id, empresa_id, destinatario_email, tipo, evento_ref, idempotency_key UNIQUE, estado (pendiente|enviado|fallido|reintentando), intentos, ultimo_error, created_at, updated_at, enviado_at.
   - RLS: SELECT por empresa_id; INSERT/UPDATE solo server-side (service_role o SECURITY DEFINER).
   - Índices: (empresa_id, created_at), idempotency_key UNIQUE, (estado, created_at).

4. **Server actions** (lib/notificaciones-actions.ts).
   - enviarRecordatorioMantenimiento(vehiculoId).
   - enviarBienvenida(establecimientoId).
   - enviarHistorialCompartido(conductorId).
   - Validación Zod, rate limiting (D-F4-3), audit_log (D-F4-4), escritura en notificacion_log.

5. **Diseño de envío programado** (no despliegue).
   - Doc en ARCHITECTURE.md §Notificaciones: cron diario (Vercel Cron o Supabase Edge Function) que lee vehículos con próximo mantenimiento vencido y encola recordatorios.
   - Idempotencia por idempotency_key = tipo:vehiculoId:fechaObjetivo.

6. **Tests con mocks** (lib/email/resend.test.ts, lib/notificaciones-actions.test.ts).
   - Mock de Resend: no llama a red, retorna { id: "mock-..." }.
   - Test de idempotencia: mismo key no duplica.
   - Test de rate limit: excede → error controlado.
   - Test de fallo + reintento: estado pasa a fallido y luego reintentando.

## Qué NO incluye F11

- Cuenta real de Resend (se crea cuando el piloto esté listo).
- Cuenta real de Sentry (ídem).
- Envío de SMS, push, WhatsApp.
- Cron desplegado (solo diseño en doc).
- Notificaciones al conductor en v1 (solo diseño; el envío real al conductor es v2).
- Interfaz de usuario para ver notificaciones (solo backend + templates).
- Migración de datos existentes (no hay notificaciones previas).
- Tocar catálogo, directorio, multiempresa, RLS de F5-F10.

## Decisiones D-F11-* (se registran en el commit de docs)

- **D-F11-1:** mecanismo de envío programado = Vercel Cron (más simple que Edge Function, ya estamos en Vercel). Documentar alternativa Edge Function. Estado: PROPUESTA.
- **D-F11-2:** idempotencia = idempotency_key UNIQUE en notificacion_log, formato tipo:refId:YYYY-MM-DD. Si existe, no reenvía. Estado: PROPUESTA.
- **D-F11-3:** rate limiting de envíos = reutiliza check_rate_limit de F5c. Límites: 20 emails/día por empresa, 100/día global. Estado: PROPUESTA.
- **D-F11-4:** reintentos = máximo 3, backoff exponencial (1m, 5m, 30m), luego fallido y queda para revisión manual. Estado: PROPUESTA.
- **D-F11-5:** trazabilidad = cada envío escribe en notificacion_log (siempre) y en audit_log (solo envíos manuales disparados por acción de usuario, no los automáticos del cron). Estado: PROPUESTA.

## Orden de implementación (dentro de F11)

1. Migración 013_notificaciones.sql + RLS + índices.
2. lib/email/resend.ts (cliente + mock).
3. lib/email/templates/ (3 templates).
4. lib/notificaciones-actions.ts (3 actions).
5. Tests con mocks.
6. Doc ARCHITECTURE.md §Notificaciones + DECISIONES.md D-F11-*.
7. Actualizar SESSION-STATE.md, BITACORA.md, CHANGELOG.md, ROADMAP.md.
8. next build + vitest run verde.
9. Commit feat + commit docs (separados).

## Criterios de aceptación de F11

- npm run test verde con los nuevos tests.
- npm run build verde.
- tsc --noEmit sin errores.
- Sin RESEND_API_KEY: sendEmail no falla, loguea mock, escribe en notificacion_log con estado enviado (mock).
- Con RESEND_API_KEY: (no testeable sin cuenta, queda documentado).
- Idempotencia probada: mismo key no duplica fila ni email.
- Rate limit probado: excede → error controlado, no crash.
- RLS: notificacion_log no accesible desde otra empresa.

## Decisiones de scope tomadas (VAMOS 2026-10-30)

- Una sola migración 013_notificaciones.sql (tabla + RLS + índices).
- 3 templates (recordatorio, bienvenida, historial).
- Cron solo diseño, sin despliegue.
- Commits separados: feat: F11 — notificaciones (stub + mocks) y docs: cierra F11.