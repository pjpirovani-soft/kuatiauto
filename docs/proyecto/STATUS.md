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
| E2b2 | órdenes (CRUD + líneas) | wip (UI completa, falta gate) | — | UI cerrada commit 64c6b23 |
| E2b2 | empleados (invitación Resend) | pendiente | RESEND_API_KEY | sacado de E2b2 |
| E3 | catálogo global (lectura) | wip (seed cargado) | — | 15 fabricantes, 73 modelos, 10 servicios, 8 productos |
| E3 | catálogo local (CRUD) | wip (funcional) | — | commit b399b28 |
| E3 | stock + movimientos | pendiente | — | columnas stock_actual/stock_minimo ya existen en producto_empresa; falta UI de movimientos |
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
| 16 migraciones aplicadas | ✅ 2026-10-31 |
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
**Segunda pasada E2b1 (2026-10-31):**

- Tests de `listarVehiculosEmpresa()` agregados: 3 casos, suite 89 → 92.
- Registro manda `nombre` en `signUp` → `raw_user_meta_data.nombre`. Trigger `handle_new_user` no requirió migración SQL (ya leía con `coalesce`).
- BITACORA.md y CHANGELOG.md actualizados con el cierre de E2b1.
- Pendiente residual: test unitario para `auth-actions.ts` (register con nombre); cobertura por integración manual en el próximo registro real.

## Nota de avance E2b2 sesion 1 (2026-10-31)

**Backend de ordenes cerrado.** Commit 326bd1c. 928 lineas, 44 tests nuevos (133/133 suite completa).

- Migracion 016_producto_empresa.sql: sincroniza el repo con la DB real (drift detectado al planificar E2b2). Aplicada con supabase db push.
- lib/schemas/ordenSchema.ts: crearOrdenSchema, editarOrdenSchema, anularOrdenSchema, listarOrdenesSchema, ordenIdSchema. Validacion de lineas (exactamente uno de servicio_global_id / servicio_empresa_id; idem producto). Limites duros (max 50 servicios, 100 productos). 26 tests.
- lib/ordenes-actions.ts: 8 server actions (listarOrdenes, listarOrdenesEmpresa, obtenerOrden, crearOrden, editarOrden, completarOrden, anularOrden, eliminarOrdenBorrador). Rate limit en mutaciones, audit log, validacion cross-empresa, calculo de importe_total y proximo_mantenimiento (D-E2-2) al completar.
- lib/ordenes-actions.test.ts: 15 tests. Cubre auth, rate limit, cross-empresa, transiciones de estado.

**Deuda aceptada en backend:** editarOrden y crearOrden sin transaccion real (delete + insert sin rollback). Mitigado con audit log. Si aparece bug, migrar a RPC en sesion futura.

**Proximo:** E2b2 sesion 2 (UI de ordenes: /ordenes, /ordenes/nuevo, /ordenes/[id], OrdenForm, OrdenLineas).
## Nota de cierre E2b2 sesion 2 (2026-10-31)

**UI de órdenes cerrada.** Commit `64c6b23`. 922 líneas, 9 archivos (7 nuevos + 2 modificados).

- `/ordenes`: lista global por empresa con badge de estado, importe, observaciones truncadas, link a detalle.
- `/ordenes/nuevo`: form de creación, precarga de vehículo vía `?vehiculo_id=` desde `/vehiculos/[id]`.
- `/ordenes/[id]`: form de edición + acciones (completar / anular con motivo / eliminar borrador).
- `components/OrdenLineas.tsx`: editor de líneas de servicio y producto, respeta el schema real (sin `descripcion` ni `cantidad` en servicios).
- `components/OrdenForm.tsx`: cabecera + líneas + submit, discriminated union `modo: crear | editar`.
- `components/NuevaOrdenClient.tsx` y `components/EditarOrdenClient.tsx`: wrappers cliente que importan las server actions (no se puede pasar function de server a client en Next 16).
- `app/(dashboard)/layout.tsx`: link "Órdenes" agregado al sidebar.

**Verificado:** tsc 0 errores, npm test 133/133, npm run build OK (15 rutas, incluye las 3 nuevas), encoding sin BOM y sin mojibake en 9 archivos.

**Deuda generada / diferida:**
- `editarOrden` y `crearOrden` sin transacción real (delete + insert sin rollback). Mitigado con audit log. Migrar a RPC si aparece bug.
- Inmutabilidad de orden `completada` no bloqueada en backend (solo UI).
- Catálogo global/empresa vacío: seed pendiente E3.
- `any` en helper `mapearOpciones` de las páginas de órdenes.
- `RESEND_API_KEY` sin configurar → empleados se pospone.

**Próximo:** E3 (catálogo global + local) + cierre E1 (gate 10/10).

## Nota de cierre E3 (2026-10-31)

**Catálogo local + seed de marcas/modelos cerrados.** Commit `b399b28`. 19 archivos, 1482 líneas.

- Backend: `lib/schemas/servicioEmpresaSchema.ts`, `lib/schemas/productoEmpresaSchema.ts`, `lib/servicios-empresa-actions.ts`, `lib/productos-empresa-actions.ts` (listar / obtener / crear / editar; **sin eliminar**, decisión D-E3a-1 por falta de columna `activo`).
- Tests: 17 schema + 26 actions = 43 nuevos. Suite total 176/176.
- UI: `/catalogo` (índice), `/catalogo/servicios` (lista + nuevo + editar), `/catalogo/productos` (lista + nuevo + editar). Link "Catálogo" en sidebar.
- Migración `017_seed_marcas_modelos.sql`: 10 marcas faltantes (todas las de `fabricante` que no tenían homónima) + 70 modelos populares en Paraguay. Total: 15 fabricantes, 15 marcas, 73 modelos.

**Verificado:** tsc 0, 176/176 tests, build OK (22 rutas), encoding limpio.

**Deuda generada:**
- Soft-delete de catálogo local: falta migración 018 con `activo` + actions `eliminarX`.
- Catálogo técnico profundo (versiones, motorizaciones, especificaciones): vacío, deuda v2.
- Productos globales con `marca = [PENDIENTE]`: deuda v2.
- Stock: solo columnas `stock_actual`/`stock_minimo`; UI de movimientos pendiente.

**Próximo:** cierre de E1 (gate 10/10) — prueba cruzada A/B + 2FA. Después E4 (directorio + portal del conductor) y E5 (recordatorios + panel admin).
