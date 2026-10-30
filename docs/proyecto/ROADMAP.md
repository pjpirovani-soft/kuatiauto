# ROADMAP — KuatiAuto

**Actualizado:** 2026-10-30
**Fuente de verdad:** PROMPT MAESTRO (14 fases). Este archivo es el índice de estado.
**Estado general:** F0-F13 completadas. E1 EN PROGRESO (2026-10-30). Fase de implementacion segun IMPLEMENTATION-PLAN.md.

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
| 11 | Notificaciones | **COMPLETADA** (2026-10-30) | ARCHITECTURE.md §Notificaciones + F11-PLAN.md |
| 12 | Modelo comercial | **COMPLETADA** (2026-10-30) | BUSINESS-LOGIC.md + F12-PLAN.md |
| 13 | Operación y continuidad | **COMPLETADA** (2026-10-30) | MANTENIMIENTO.md + ARCHITECTURE.md §Operación |
| 14 | Plan de implementación | Pendiente | ROADMAP.md + STATUS.md |

## F11 — Notificaciones y automatizaciones (COMPLETADA 2026-10-30)

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

## F13 — Operación y continuidad (COMPLETADA 2026-10-30)

**Alcance:** runbook específico de KuatiAuto (entornos, despliegues, backups, recuperación, monitorización, incidentes, continuidad, accesos). Todo docs, sin código. No bloquea nada.

**Docs hechos:**
- `F13-PLAN.md` (plan de fase).
- `DECISIONES.md` (D-F13-1..5, PROPUESTA).
- `MANTENIMIENTO.md` (runbook completo).
- `docs/ciclo-de-vida/MANTENIMIENTO.md` (stub que apunta al nuevo).
- `ARCHITECTURE.md` §Operación (F13 — 2026-10-30).

**Docs pendientes:** ninguno.

**Bloquea a:** nada.

## F14 — Plan de implementación (EN PROGRESO 2026-10-30)

**Alcance:** ultima fase de la metodologia. Producir el plan que habilita la escritura de codigo de modulos. Todo docs, sin codigo.

**Docs producidos:**
- F14-PLAN.md (plan de fase, D-F14-1..5).
- IMPLEMENTATION-PLAN.md (etapas, modulos, dependencias, prioridades, entregables, gate de seguridad).
- STATUS.md reescrito (tablero macro de modulos).

**Saneamiento incluido:** D-F13-1..5 a APROBADA; F13 a COMPLETADA.

**Bloquea a:** escritura de codigo de modulos.

**Bloqueado por:** nada.

## Próximo paso concreto

**F14 EN PROGRESO.** Docs producidos. Falta: commit de cierre. Despues arranca codigo de modulos (E1 Fundamentos).

## Deuda de docs

Los siguientes docs están **desactualizados** o son **templates del studio** y hay que adaptarlos a KuatiAuto:

- `PROMPT.md`: es el del studio. Referencia `CONVENCIONES.md` y `DECISIONES.md` (deprecados). Hay que reescribirlo.
- `README.md`: es el del blueprint. Hay que reescribirlo.
- `STATUS.md`: desactualizado (2026-10-29, template). Hay que actualizarlo.
- ~~`BUSINESS-LOGIC.md`: vacío~~ → **RESUELTO en F12** (catálogo, costes, modelo comercial; 183 líneas).
- `AI-RULES.md`, `SESSION-PROTOCOL.md`, `ROL.md`, `ENCODING.md`: templates del studio. Hay que adaptarlos.
- ~~`MANTENIMIENTO.md`: template del studio~~ → **RESUELTO en F13** (docs/proyecto/MANTENIMIENTO.md + stub en docs/ciclo-de-vida/).

**Nota:** `DECISIONES.md` ya existe (creado en F2). Se actualiza por fase, no se recrea.
