# STATUS — KuatiAuto (provisional)

**Actualizado:** 2026-10-31
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
| E2a | clientes CRUD (schema, actions, tests, UI) | wip | — | 2 tests desactualizados |
| E2a | vehículos backend (schema, actions, tests) | wip | — | UI pendiente |
| E2a | vehículos UI (form, lista, nuevo, editar) | pendiente | E2a-vehículos backend | — |
| E2a | layout dashboard con navegación | pendiente | — | — |
| E2b | órdenes (CRUD + líneas) | pendiente | E2a | — |
| E2b | empleados (invitación Resend) | pendiente | E2a | — |
| E3 | catálogo global (lectura) | pendiente | E1 | — |
| E3 | catálogo local (CRUD) | pendiente | E1 | — |
| E3 | stock + movimientos | pendiente | E2b-órdenes | — |
| E4 | directorio (búsqueda + mapa) | wip | — | página base movida a app/directorio |
| E4 | publicación/moderación directorio | pendiente | E4-directorio | — |
| E4 | portal del conductor | pendiente | E1, E2b | — |
| E5 | cron recordatorios + reintentos | pendiente | E2b-órdenes | — |
| E5 | panel admin | pendiente | E1 | — |
| E5 | Sentry + Vercel Analytics | pendiente | E1 | — |

## Deuda técnica al cierre de E2a

| Deuda | Origen | Etapa de resolución |
|---|---|---|
| `vehiculoSchema.test.ts`: 1 test espera `km_actual: 0` | E2a | E2a (fix rápido) |
| `ClienteForm.test.tsx`: props viejas (FormData) | E2a | E2a (fix rápido) |
| Links de clientes apuntan a `/dashboard/clientes`, ruta real `/clientes` | E2a | E2a (fix rápido) |
| `lib/empresa-actions.ts` en una línea | E1 | E2a (reformatear) |
| Tests de `rate-limit.ts` y `empresa-actions.ts` | E1 | E2a |
| `npm audit` 3 vulns dev-only (vitest/tinypool) | F11 | Cuando vitest 5.x estable |
| `SUPABASE_SERVICE_ROLE_KEY` no seteada | F11 | Config |
| `RESEND_API_KEY` no seteada (modo mock) | F11 | E2b |
| Tipos Supabase sin regenerar | F11 | Al configurar Supabase |
| Reintentos y cron F11 diseñados, no implementados | F11 | E5 |
| Sentry diseñado, no configurado | F13 | E5 |
| Export semanal de backups: script manual | F13 | v2 |
| Prueba de restauración trimestral: no ejecutada | F13 | Post-E5 |
| 2FA en gestor de contraseñas | F13 | Acción del propietario |

## Hallazgos de seguridad abiertos

(vacío al 2026-10-31)

Un hallazgo crítico o alto abierto bloquea el cierre del módulo salvo aceptación explícita documentada en `SESSION-STATE.md`.

## Notas

- `STATUS.md` es tablero macro. `SESSION-STATE.md` es handoff operativo. No se duplican (D-F14-5).
- Un módulo con hallazgos críticos/altos abiertos NO se commitea como `completo`. Se commitea como `wip` con nota acá.
- Al cierre de cada etapa se actualiza este tablero + SESSION-STATE + BITACORA + CHANGELOG.
- El template original del studio se preservó como `STATUS.md.bak-template` (no se commitea).

## Nota de cierre E2a (2026-10-31)

E2a **wip**: clientes CRUD end-to-end funcional (22 tests verdes), vehículos backend funcional (23 tests verdes), app verificada con `npm run dev`. Deuda: 2 tests desactualizados, UI vehículos, layout dashboard, fix de links. Gate de seguridad de 10 puntos: parcial (1-7 ok, 8-10 pendientes por falta de Supabase real).

