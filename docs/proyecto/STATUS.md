# STATUS — KuatiAuto (provisional)

**Actualizado:** 2026-10-30
**Propósito:** tablero macro de módulos. `SESSION-STATE.md` sigue siendo el handoff operativo entre sesiones. No se duplican (D-F14-5).
**Regla:** un módulo se marca `completo` solo tras pasar el gate de seguridad de 10 puntos (`ARCHITECTURE.md` §Gate de seguridad por módulo). Sin gate, se commitea como `wip` con nota acá.

## Leyenda

- `pendiente`: no arrancado.
- `wip`: en progreso, no pasa el gate todavía.
- `completo`: pasa el gate de 10 puntos.
- `bloqueado`: esperando dependencia o decisión externa.

## Estado de módulos

| Etapa | Módulo | Estado | Bloqueantes | Hallazgos |
|---|---|---|---|---|
| E1 | auth completo (registro/login/reset/confirmación) | wip | — | — |
| E1 | multiempresa (crear empresa + establecimiento) | wip | — | — |
| E1 | shell + route groups + layout base | wip | — | — |
| E1 | middleware rate limiting | wip | — | — |
| E1 | hooks audit_log | wip | — | — |
| E1 | cablear `empresa_id` en notificaciones-actions (deuda F11) | wip | — | — |
| E2 | clientes CRUD | pendiente | E1 | — |
| E2 | vehículos CRUD + `vehiculo_identidad` | pendiente | E1 | — |
| E2 | órdenes (CRUD + líneas) | pendiente | E1, E2-clientes, E2-vehículos | — |
| E2 | empleados (invitación Resend) | pendiente | E1 | — |
| E3 | catálogo global (lectura) | pendiente | E1 | — |
| E3 | catálogo local (CRUD) | pendiente | E1 | — |
| E3 | stock + movimientos | pendiente | E2-órdenes | — |
| E3 | seed catálogo verificado (F6b) | pendiente | E3-catálogo | — |
| E4 | directorio (búsqueda + mapa) | pendiente | E1, E2-vehículos | — |
| E4 | publicación/moderación directorio | pendiente | E4-directorio | — |
| E4 | portal del conductor | pendiente | E1, E2-vehículos | — |
| E5 | cron recordatorios + reintentos | pendiente | E2-órdenes | — |
| E5 | panel admin | pendiente | E1 | — |
| E5 | Sentry + Vercel Analytics | pendiente | E1 | — |
## Deuda técnica al arranque de E1

| Deuda | Origen | Etapa de resolución |
|---|---|---|
| `npm audit` 3 vulns dev-only (vitest/tinypool) | F11 | Cuando vitest 5.x estable |
| `empresa_id: null` en `notificaciones-actions` | F11 | E1 |
| `SUPABASE_SERVICE_ROLE_KEY` no seteada | F11 | E1 (config) |
| `RESEND_API_KEY` no seteada (modo mock) | F11 | E2 (empleados) |
| Tipos Supabase sin regenerar | F11 | E1 (al aplicar 013) |
| Reintentos y cron F11 diseñados, no implementados | F11 | E5 |
| Sentry diseñado, no configurado | F13 | E5 |
| Export semanal de backups: script manual | F13 | v2 |
| Prueba de restauración trimestral: no ejecutada | F13 | Post-E5 (operación) |
| 2FA en gestor de contraseñas | F13 | Acción del propietario |

## Hallazgos de seguridad abiertos

(vacío al 2026-10-30)

Un hallazgo crítico o alto abierto bloquea el cierre del módulo salvo aceptación explícita documentada en `SESSION-STATE.md`.

## Notas

- `STATUS.md` es tablero macro. `SESSION-STATE.md` es handoff operativo. No se duplican (D-F14-5).
- Un módulo con hallazgos críticos/altos abiertos NO se commitea como `completo`. Se commitea como `wip` con nota acá.
- Al cierre de cada etapa se actualiza este tablero + SESSION-STATE + BITACORA + CHANGELOG.
- El template original del studio se preservó como `STATUS.md.bak-template` (no se commitea).

## Nota de cierre E1 (2026-10-30)

E1 **wip**: código completo (auth, rate limiting, multiempresa, audit hooks, cableado `empresa_id` en notificaciones). Tests de rate-limit y empresa-actions pendientes (E2). Prueba cruzada A/B pendiente (requiere Supabase real, keys al final). Gate de seguridad de 10 puntos: parcial (puntos 1-7 cubiertos, 8-10 pendientes por falta de Supabase real).
