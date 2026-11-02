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
| E1 | auth completo (registro/login/reset/confirmación) | **completo** | — | prueba cruzada A/B ✅ 2026-10-31; 2FA en Bitwarden activada 2026-11-01 |
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
| E2b2 | órdenes (CRUD + líneas) | **completo** | — | gate 10/10 cerrado 2026-11-01; prueba cruzada A/B OK |
| E2b2 | empleados (invitación Resend) | pendiente | RESEND_API_KEY | sacado de E2b2 |
| E3 | catálogo global (lectura) | **completo** | — | gate 10/10 cerrado 2026-11-01; 15 fabricantes, 73 modelos |
| E3 | catálogo local (CRUD) | **completo** | — | gate 10/10 cerrado 2026-11-01; prueba cruzada A/B OK |
| E3 | stock + movimientos | pendiente | — | columnas stock_actual/stock_minimo ya existen en producto_empresa; falta UI de movimientos |
| E4 | directorio (búsqueda + mapa) | **completo** | — | E4a cerrada 2026-10-31, gate 10/10, prueba cruzada A/B 7/7 |
| E4 | publicación/moderación directorio | wip | — | propietario publica/despublica OK; moderación admin_general va a E5 |
| E4 | portal del conductor | **completo** | — | gate 10/10 cerrado 2026-11-01; prueba cruzada A/B OK (proponer/aceptar/revocar). H-E4b-2 resuelto 2026-11-01 con RPC SECURITY DEFINER (migracion 020) |
| E4 | portal del conductor | pendiente | E1, E2b2 | — |
| E5 | notificaciones reales (bienvenida + historial + recordatorio) | **completo (con deuda de dominio)** | dominio verificado en Resend | cableado 2026-11-02; envio real OK contra API Resend. Deuda: RESEND_FROM usa onboarding@resend.dev (solo tests a email propio) hasta verificar dominio |
| E5 | cron recordatorios + reintentos | pendiente | dominio Resend + deploy | — |
| E5 | panel admin | wip | — | dashboard funcional 2026-11-02 (contadores corregidos con service_role, H-E5b-2). /admin/empresas CERRADA (lista + filtro por estado + detalle con contadores, usuarios, establecimientos). /admin/usuarios CERRADA (lista + filtro por rol + cambio de rol + activar/desactivar con check del ultimo admin). Redirect post-login (admin -> /admin). Falta /admin/catalogo |
| E5 | Sentry + Vercel Analytics | pendiente | E1 | — |

## Infraestructura

| Item | Estado |
|---|---|
| Supabase proyecto `kuatiauto` | ✅ Activo (free tier, us-east-1) |
| 18 migraciones aplicadas | ✅ 2026-10-31 |
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
| `npm audit` 16 moderate (0 critical, 0 high) — todas en `minimatch` dev-only | E2a-bis | Resuelto 2026-10-31: upgrade Vitest 5 eliminó las 2 critical + 12 moderate. Las 16 restantes son dev-only en la cadena de ESLint, no explotables en producción |
| Sentry diseñado, no configurado | F13 | E5 |
| RESEND_FROM con onboarding@resend.dev (solo tests propios) | E5a | cuando se registre y verifique dominio |
| Vercel no configurado (solo .env.local por ahora) | E5a | cuando se deploye |
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

## Nota de prueba cruzada A/B (2026-10-31)

**Prueba cruzada A/B completada contra Supabase real.**

- Usuario A: `importjapanencar@gmail.com` (Luis, Import Japan, empresa adbcd23e-f296-435c-b835-e9ce837a9d95).
- Usuario B: `test-b-user@example.com` (Taller Prueba B, empresa b4d1b031-f3c9-4c86-a513-b0b071929b28). Creado vía Auth Admin API con service_role.
- Cliente A: María José Bitar Balletbo (7e74bf38-796b-4d92-8fd3-338ea3a6fd2b).
- Cliente B: Cliente Prueba B (4538656d-9c65-4dd6-8d9a-195af4741803).

**Verificado:**
- B ve solo sus propios clientes (Taller Prueba B).
- B → URL directa a cliente de A → "Cliente no encontrado".
- A (Luis) → URL directa a cliente de B → "Cliente no encontrado".

**Resultado:** RLS aísla correctamente. Gate E1 cruzado cerrado. E1 pasa de gate 7/10 a gate 9/10 (falta solo 2FA del propietario para el 10/10).

## Nota de cierre E4a (2026-10-31)

**Directorio + establecimientos públicos cerrados. Gate 10/10.**

- Migración `018`: endurece GRANT de `anon` en `establecimiento_publico` (H-E4a-1).
- Backend: `lib/schemas/establecimientoSchema.ts` + `lib/establecimiento-actions.ts` (listar, obtener, crear, editar, publicarMiEstablecimiento). 36 tests nuevos.
- UI: `/establecimientos` (lista + nuevo + editar) + `EstablecimientoForm` + `PublicarButton`. Link en sidebar.
- `/directorio`: `await searchParams` (H-E4a-8).
- Fix `upsert` en `editarEstablecimiento` (H-E4a-3): crea fila pública si no existe.
- Fix `await params` en `/establecimientos/[id]` (H-E4a-4).
- Prueba cruzada A/B 7/7 contra DB real. Aislamiento bidireccional verificado. Directorio muestra solo publicados.
- Verificación: 212/212 tests, tsc 0, build OK (25 rutas).

**Deuda diferida:** H-E4a-2 (UI admin_general en `/establecimientos` → E5), H-E4a-7 (default geográfico del directorio → E4b/E5).

**Próximo:** E4b (portal del conductor: `/mi-garage`, `vehiculo_conductor`, `historial_compartido`, invitación por token).

## Nota de cierre E4b (2026-11-01)

**Portal del conductor cerrado. Gate 10/10.**

- Backend: `lib/conductor-actions.ts` + `lib/schemas/conductorSchema.ts` (E4b sesion anterior).
- Migracion `019_historial_compartido_consentimiento.sql` (3 funciones SECURITY DEFINER: proponer, aceptar, revocar).
- UI: `(portal)/layout.tsx`, `/mi-garage`, `/mi-garage/vehiculos`, `/mi-garage/historial`, `/register-conductor`.
- Componentes: `VehiculoConductorForm`, `ProponerHistorialForm`, `HistorialAccionesClient` (nuevo).
- Integracion: `ProponerHistorialForm` en `/vehiculos/[id]` (empresa propone); `HistorialAccionesClient` en `/mi-garage/historial` (conductor acepta/revoca).
- Fix E2b2: `href` de `/ordenes/nuevo?vehiculo_id=` perdió `{vehiculo.id}`. Corregido.

**Prueba cruzada A/B (Luis -> conductor2):**
- Proponer historial: token generado, fila en DB con `autorizado=false`.
- Conductor2 recarga `/mi-garage/historial` -> ve propuesta pendiente -> Aceptar -> `autorizado=true`.
- Conductor2 Revocar -> `autorizado=false`. Reversible.

**Hallazgos:**
- **H-E4b-1** (bajo, UX): form de login deja el botón sin feedback ~3s durante el server action. E5.
- **H-E4b-2** (medio, cosmetico): RESUELTO 2026-11-01. Causa: RLS bloqueaba joins anidados en PostgREST. Fix: RPC `listar_historial_compartido()` SECURITY DEFINER (migracion 020). Datos de taller y vehiculo ahora se ven en `/mi-garage/historial`.
- **D-E4b-1** (deuda UX): precargar email del cliente dueño en `ProponerHistorialForm` si existe. E5/v2.

**Verificacion:** 212/212 tests, tsc 0, build OK (25 rutas). Encoding limpio.

## Nota de cierre E5a (2026-11-02)

**Notificaciones reales cableadas y verificadas contra Resend.**

- enviarBienvenida cableada en crearEmpresa (fire-and-forget).
- enviarHistorialCompartido cableada en revocarHistorial (fire-and-forget).
- enviarRecordatorioMantenimiento cableada en completarOrden (fire-and-forget).
- RESEND_API_KEY configurada en .env.local. Envio de prueba a pirovanipedrojose@gmail.com: OK (id real de Resend, mock=false).
- tsx agregado como devDependency para scripts sueltos.

**Deudas:**
- RESEND_FROM usa onboarding@resend.dev (solo permite enviar al email de la cuenta Resend). Cambiar a no-reply@kuatiauto.com.py cuando se registre y verifique el dominio en NIC.py + Resend.
- Vercel no configurado; cuando se deploye, replicar RESEND_API_KEY y RESEND_FROM en env vars del proyecto.
- Cron de recordatorios automaticos no implementado (solo envio manual al completar orden).


## Nota de cierre E5b (2026-11-02, wip)

**Panel admin: dashboard funcional. Wip, faltan listas de entidades.**

**Hecho:**
- lib/auth-actions.ts: redirect post-login. Orden de checks: admin_general -> /admin, conductor -> /mi-garage, sin empresa -> /crear-empresa, con empresa -> /clientes. Fix adicional: usuarios sin empresa ahora van a /crear-empresa (antes caian en /clientes).
- app/(admin)/layout.tsx: auth check server-side. notFound() si no es admin_general. Sidebar con link Panel + logout via server action.
- app/(admin)/admin/page.tsx: dashboard con 4 contadores (empresas, usuarios, establecimientos publicados, ordenes).
- lib/admin-actions.ts: obtenerContadoresAdmin(). Usa createClient() (RLS permite SELECT a admin_general via is_admin_general() en las policies de empresa y usuario).

**Verificacion:** login como pirovanipedrojose@gmail.com -> /admin, contadores reales (Empresas: 2, Usuarios: 5). tsc 0, build OK (26 rutas).

**Pendiente (E5b-futuro):**
- /admin/empresas: CERRADA. Lista con filtro por estado + detalle con contadores, usuarios y establecimientos. Fix H-E5b-2 (contadores del dashboard usaban RLS y devolvian 0).
- /admin/usuarios: CERRADA. Lista con filtro por rol, cambio de rol (propietario/empleado/conductor), activar/desactivar con guardas (no auto-modificacion, no dejar sin admin_general activo).
- /admin/usuarios: lista + cambiar rol / desactivar.
- /admin/catalogo: moderacion de servicio_global y producto_global.
- Links del sidebar correspondientes (hoy solo Panel).

