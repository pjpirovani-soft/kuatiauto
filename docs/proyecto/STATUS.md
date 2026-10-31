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
| E1 | auth completo (registro/login/reset/confirmación) | wip (gate 7/10) | — | prueba cruzada A/B pendiente |
| E1 | multiempresa (crear empresa + establecimiento) | wip | — | validado end-to-end (Luis) |
| E1 | shell + route groups + layout base | wip | — | layout dashboard es E2b1 |
| E1 | middleware rate limiting | wip | — | tests 8/8 verdes |
| E1 | hooks audit_log | wip | — | audit_log registra crear/empresa, crear/cliente |
| E1 | cablear `empresa_id` en notificaciones-actions | pendiente | — | deuda F11, diferida |
| E2a | clientes CRUD (schema, actions, tests, UI) | **wip (piloto funcional)** | — | validado con cliente real |
| E2a | vehículos backend (schema, actions, tests) | wip | — | UI es E2b1 |
| E2a | vehículos UI (form, lista, nuevo, editar) | pendiente | E2a-vehículos backend | E2b1 |
| E2a | layout dashboard con navegación | pendiente | — | E2b1 |
| E2b1 | UI vehículos + layout dashboard | pendiente | E2a | próxima sesión |
| E2b2 | órdenes (CRUD + líneas) | pendiente | E2a | — |
| E2b2 | empleados (invitación Resend) | pendiente | E2a | depende de RESEND_API_KEY |
| E3 | catálogo global (lectura) | pendiente | E1 | — |
| E3 | catálogo local (CRUD) | pendiente | E1 | — |
| E3 | stock + movimientos | pendiente | E2b2-órdenes | — |
| E4 | directorio (búsqueda + mapa) | wip | — | página base en app/directorio |
| E4 | publicación/moderación directorio | pendiente | E4-directorio | — |
| E4 | portal del conductor | pendiente | E1, E2b2 | — |
| E5 | cron recordatorios + reintentos | pendiente | E2b2-órdenes | — |
| E5 | panel admin | pendiente | E1 | reemplaza Supabase Dashboard como panel del CEO |
| E5 | Sentry + Vercel Analytics | pendiente | E1 | — |

## Infraestructura

| Item | Estado |
|---|---|
| Supabase proyecto `kuatiauto` | ✅ Activo (free tier, us-east-1) |
| 15 migraciones aplicadas | ✅ 2026-10-31 |
| `lib/supabase/types.ts` (27 tablas, 12 funciones) | ✅ Generado |
| `@supabase/ssr@0.12.7` | ✅ Bug `never` resuelto |
| `.env.local` | ✅ Cargado (URL, anon, service_role) |
| `RESEND_API_KEY` | ❌ No configurada (modo mock) |
| Sentry | ❌ No configurado |
| Backups automatizados | ❌ Script manual, no automatizado |

## Deuda técnica al cierre de E2a-bis

| Deuda | Origen | Etapa de resolución |
|---|---|---|
| Prueba cruzada A/B contra Supabase real | E1 | E1-cierre (gate 8-10) |
| 2FA en gestor de contraseñas | F13 | Acción del propietario |
| `empresa_id: null` en `notificaciones-actions.ts` | F11 | Cuando se toque notificaciones (E5) |
| Trigger `handle_new_user` asigna `empleado` + email como nombre | E1 | E2b1 |
| Panel `/` mezclado con dashboard | E2a | E2b1 (mover panel a `/dashboard`, liberar `/`) |
| Seed catálogo marcas `[PENDIENTE]` | F6a | E3 |
| `npm audit` 19 vulns (17 moderate, 2 critical) | E2a-bis | Revisar al cerrar E2b |
| Sentry diseñado, no configurado | F13 | E5 |
| Export semanal de backups: script manual | F13 | v2 |
| Prueba de restauración trimestral: no ejecutada | F13 | Post-E5 |

## Hallazgos de seguridad abiertos

(vacío al 2026-10-31)

Un hallazgo crítico o alto abierto bloquea el cierre del módulo salvo aceptación explícita documentada en `SESSION-STATE.md`.

## Notas

- `STATUS.md` es tablero macro. `SESSION-STATE.md` es handoff operativo. No se duplican (D-F14-5).
- Un módulo con hallazgos críticos/altos abiertos NO se commitea como `completo`. Se commitea como `wip` con nota acá.
- Al cierre de cada etapa se actualiza este tablero + SESSION-STATE + BITACORA + CHANGELOG.

## Nota de cierre E2a-bis (2026-10-31)

**Piloto funcional end-to-end contra Supabase real.** Registro → login → crear empresa → crear cliente → persistencia → audit_log. Suite 89/89. `tsc` 0. Encoding limpio. Commits `93c3f9a` y `6a4d365` pusheados.

**Próximo:** E2b1 (UI vehículos + layout dashboard con navegación).
## Nota de cierre E2b1 (2026-10-31)

**UI vehículos + layout dashboard cerrados.** Commit 6143d08.

- listarVehiculosEmpresa() agregado a lib/vehiculos-actions.ts (lista global, filtro por empresa).
- app/(dashboard)/layout.tsx: sidebar (Panel, Clientes, Vehículos, Directorio, Logout) + auth check server-side.
- components/VehiculoForm.tsx: client component crear/editar con discriminated union.
- /vehiculos (lista), /vehiculos/nuevo (form crear), /vehiculos/[id] (form editar).
- Panel logueado movido de (dashboard)/page.tsx a (dashboard)/dashboard/page.tsx. (dashboard)/page.tsx borrado (colisión con landing app/page.tsx).
- / sigue siendo landing pública estática. /directorio queda fuera del shell.

**Verificado:** tsc 0 errores, npm run build OK (11 rutas, incluye las 3 nuevas), npm test 89/89. Encoding sin BOM en 6 archivos nuevos.

**Deuda generada:** listarVehiculosEmpresa() sin tests (agregar 2 casos en próxima sesión).

**Próximo:** tests de listarVehiculosEmpresa() + trigger handle_new_user, después E2b2 (órdenes + empleados).