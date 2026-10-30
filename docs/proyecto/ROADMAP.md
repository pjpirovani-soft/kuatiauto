# ROADMAP — KuatiAuto

**Actualizado:** 2026-10-30
**Fuente de verdad:** PROMPT MAESTRO (14 fases). Este archivo es el índice de estado.
**Estado general:** F0-F10 completadas (2026-10-30). F11 en curso. F12-F14 pendientes.

## Regla de avance

- Una fase no arranca hasta que la anterior esté **aprobada** por el propietario.
- Excepción: las fases marcadas "paralela" pueden ir en paralelo.
- Cada fase aprobada se commitea como `docs(kuatiauto): fase N — <tema>`.
- F3 y F4 son **bloqueantes** de todo lo posterior.

## Las 14 fases

| # | Fase | Estado | Doc principal |
|---|---|---|---|
| 0 | Metodología y arranque | **COMPLETADA** (2026-10-30) | PROMPT-MAESTRO.md, CONTINUACION.md |
| 1 | Definición del producto | **COMPLETADA** (2026-10-30) | SPEC.md |
| 2 | Usuarios, roles, permisos | **COMPLETADA** (2026-10-30) | SPEC.md §3 + ARCHITECTURE.md Autorización |
| 3 | Arquitectura multiempresa | **COMPLETADA** (2026-10-30) | ARCHITECTURE.md §Multiempresa |
| 4 | Arquitectura de seguridad | **COMPLETADA** (2026-10-30) | ARCHITECTURE.md §Seguridad |
| 5 | Modelo de datos | **COMPLETADA** (2026-10-30) | SPEC.md §10 + migraciones 001-006 |
| 6 | Catálogo automotriz | **COMPLETADA** (2026-10-30) | BUSINESS-LOGIC.md |
| 7 | Stack tecnológico | **COMPLETADA** (2026-10-30) | ARCHITECTURE.md stack |
| 8 | Costes y sostenibilidad | **COMPLETADA** (2026-10-30) | BUSINESS-LOGIC.md |
| 9 | Privacidad y datos | **COMPLETADA** (2026-10-30) | ARCHITECTURE.md §Privacidad |
| 10 | Directorio y geolocalización | **COMPLETADA** (2026-10-30) | ARCHITECTURE.md §Directorio |
| 11 | Notificaciones | **EN PROGRESO** | ARCHITECTURE.md §Notificaciones |
| 12 | Modelo comercial | Pendiente | BUSINESS-LOGIC.md |
| 13 | Operación y continuidad | Pendiente | MANTENIMIENTO.md |
| 14 | Plan de implementación | Pendiente | ROADMAP.md + STATUS.md |

## F11 — Notificaciones y automatizaciones (EN PROGRESO)

**Alcance aprobado:** F11a (stub + mocks). El código debe funcionar sin `RESEND_API_KEY` (modo mock) y con ella (envío real). La cuenta de Resend se crea cuando el piloto esté listo.

**Docs a actualizar (commit docs):**
- `ARCHITECTURE.md` §Notificaciones
- `DECISIONES.md` (D-F11-1 a D-F11-n)
- `ROADMAP.md` (este archivo)
- `SESSION-STATE.md`
- `BITACORA.md`
- `CHANGELOG.md`

**Código a escribir (commit feat):**
- `lib/email/resend.ts` (cliente con fallback mock)
- `lib/email/templates/` (recordatorio mantenimiento, bienvenida, etc.)
- `lib/notificaciones-actions.ts`
- `supabase/migrations/013_notificaciones.sql` (`notificacion_log`)
- Cron / Edge Function para envíos programados (diseño, no despliegue)
- Tests con mocks

**Decisiones D-F11-* a definir en el commit de docs:**
- D-F11-1: mecanismo de envío (Edge Function vs cron Vercel).
- D-F11-2: idempotencia (clave única por notificación+destinatario+evento).
- D-F11-3: rate limiting de envíos (límites por usuario/empresa).
- D-F11-4: reintentos y control de errores.
- D-F11-5: trazabilidad en `notificacion_log` + `audit_log`.

**Bloquea a:** F12.

## F12-F14 — Pendientes (sin detalle)

- **F12 — Modelo comercial:** suscripciones, planes, límites, premium. Bloquea a nada técnico.
- **F13 — Operación y continuidad:** runbook específico de KuatiAuto (despliegues, backups, recuperación, monitorización, incidentes). Bloquea a nada.
- **F14 — Plan de implementación:** etapas, módulos, dependencias, prioridades, entregables. Bloquea escritura de código.

## Próximo paso concreto

**Cerrar F11.** Orden acordado:
1. Corregir `ROADMAP.md` (este commit).
2. `npm audit fix` (sin `--force` primero). Evaluar críticas residuales.
3. Verificar `package.json` `name` — **ya verificado: `kuatiauto`**. Sin commit.
4. Crear `docs/proyecto/F11-PLAN.md`. Aprobación del propietario.
5. Docs de F11. Commit `docs`.
6. Código de F11. Commit `feat`.
7. Cerrar F11. Commit `docs`.

## Deuda de docs

Los siguientes docs están **desactualizados** o son **templates del studio** y hay que adaptarlos a KuatiAuto:

- `PROMPT.md`: es el del studio. Referencia `CONVENCIONES.md` y `DECISIONES.md` (deprecados). Hay que reescribirlo.
- `README.md`: es el del blueprint. Hay que reescribirlo.
- `STATUS.md`: desactualizado (2026-10-29, template). Hay que actualizarlo.
- `BUSINESS-LOGIC.md`: vacío. Hay que llenarlo.
- `AI-RULES.md`, `SESSION-PROTOCOL.md`, `ROL.md`, `ENCODING.md`, `MANTENIMIENTO.md`: templates del studio. Hay que adaptarlos.

**Nota:** `DECISIONES.md` ya existe (creado en F2). Se actualiza por fase, no se recrea.