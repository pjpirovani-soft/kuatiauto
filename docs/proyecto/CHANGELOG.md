## [E5b] - 2026-11-02 - Panel admin completo (smoke test + fix H-E5b-3)

### Verified
- Smoke test manual en navegador: A (login/nav), B (/admin/empresas), C (/admin/usuarios), D (/admin/catalogo/servicios), E (/admin/catalogo/productos), F (logout/re-login/console/network). Todos verdes.
- 279/279 tests, tsc --noEmit 0 errores, build OK.

### Fixed
- **H-E5b-3 (alto, integridad de datos):** conductores con rol='empleado' en DB por bug del select. Fix en DB (UPDATE), cliente (UsuarioAccionesClient no renderea select si empresaId=null), backend (cambiarRolUsuario valida invariantes empresa_id/rol), tests (+2).
- Mojibake de em-dash en app/(admin)/admin/usuarios/page.tsx.

### Added
- 2 tests nuevos en lib/admin-usuarios-actions.test.ts (rechazo propietario/empleado sin empresa, rechazo conductor con empresa).

### Deuda aceptada
- H-E5b-4 (bajo): HTML min="1" vs Zod min(0) en intervalos. Backlog.

### Changed
- components/UsuarioAccionesClient.tsx: nueva prop empresaId. Si es null, muestra texto "conductor (sin empresa)" en lugar de select.
- lib/admin-actions.ts: cambiarRolUsuario lee empresa_id y valida invariantes.
- app/(admin)/admin/usuarios/page.tsx: pasa empresaId al cliente.
## [E5b-wip] - 2026-11-02 - Panel admin (dashboard funcional)

### Added
- app/(admin)/layout.tsx: auth check server-side. notFound() si no es admin_general.
- app/(admin)/admin/page.tsx: dashboard con contadores (empresas, usuarios, establecimientos publicados, ordenes).
- lib/admin-actions.ts: obtenerContadoresAdmin().

### Changed
- lib/auth-actions.ts: redirect post-login con orden admin -> conductor -> sin-empresa -> clientes. Fix: usuarios sin empresa ahora van a /crear-empresa.

### Verified
- Login admin -> /admin con contadores reales. tsc 0, build OK (26 rutas).

### Pendiente
- /admin/empresas, /admin/usuarios, /admin/catalogo. Links del sidebar.

## [E5a] - 2026-11-02 - Notificaciones reales cableadas

### Added
- enviarBienvenida cableada en lib/empresa-actions.ts (crearEmpresa, fire-and-forget).
- enviarHistorialCompartido cableada en lib/conductor-actions.ts (revocarHistorial, fire-and-forget).
- enviarRecordatorioMantenimiento cableada en lib/ordenes-actions.ts (completarOrden, fire-and-forget).
- tsx (devDependency) para scripts sueltos.

### Changed
- .env.local: RESEND_API_KEY y RESEND_FROM configuradas (RESEND_FROM usa onboarding@resend.dev para tests a email propio).

### Verified
- Envio real contra API Resend: OK (mock=false, id devuelto por la API).
- 212/212 tests, tsc 0, build OK (25 rutas).

### Deudas
- RESEND_FROM usa onboarding@resend.dev (solo tests al email de la cuenta). Cambiar a no-reply@kuatiauto.com.py cuando se registre y verifique el dominio en NIC.py + Resend.
- Vercel no configurado; replicar RESEND_API_KEY y RESEND_FROM en env vars cuando se deploye.
- Cron de recordatorios automaticos no implementado.

## [E4b] - 2026-11-01 - Portal del conductor (gate 10/10)

### Added
- supabase/migrations/020_listar_historial_compartido.sql: RPC SECURITY DEFINER para que el conductor vea nombre de empresa y datos del vehiculo sin que RLS bloquee los joins anidados de PostgREST (H-E4b-2).
- components/HistorialAccionesClient.tsx: botones Aceptar/Revocar en el portal del conductor.

### Changed
- app/(dashboard)/vehiculos/[id]/page.tsx: ProponerHistorialForm importado y renderizado. Fix del href de /ordenes/nuevo?vehiculo_id= (perdia vehiculo.id desde E2b2).
- app/(portal)/mi-garage/historial/page.tsx: HistorialAccionesClient integrado; campos a nombre_empresa / vehiculo_marca / vehiculo_modelo (planos del RPC).
- lib/conductor-actions.ts: listarHistorialCompartido() usa la RPC en lugar de joins anidados.
- lib/supabase/types.ts: regenerado desde Supabase (incluye la funcion nueva). Normalizado a UTF-8 sin BOM (supabase gen types produce UTF-16 LE con BOM en PS 5.x).

### Verified
- Prueba cruzada A/B: Luis propone -> token generado -> conductor2 acepta -> revoca -> re-acepta. Estado reversible, DB consistente.
- /mi-garage/historial muestra nombre del taller y datos del vehiculo (fix H-E4b-2 confirmado en UI).
- 212/212 tests, tsc --noEmit 0 errores, npm run build OK (25 rutas).
- Encoding limpio: 0 mojibake, 0 BOM en archivos nuevos/modificados.

### Hallazgos
- **H-E4b-1** (bajo, UX): form de login deja el boton sin feedback ~3s durante el server action. Diferido a E5.
- **H-E4b-2** (medio, cosmetico): RESUELTO. Causa: RLS bloqueaba joins anidados en PostgREST; conductor no pertenece a empresa. Fix: RPC SECURITY DEFINER con search_path controlado, GRANT EXECUTE solo a authenticated.

### Deuda
- **D-E4b-1** (UX): precargar email del cliente dueño en ProponerHistorialForm si existe. E5/v2.

## [E4b-wip] - 2026-11-01 - Portal del conductor (en progreso)

### Added
- `supabase/migrations/019_historial_compartido_consentimiento.sql`.
- `lib/conductor-actions.ts`, `lib/schemas/conductorSchema.ts`.
- `app/(portal)/layout.tsx`, `/mi-garage/*`, `app/register-conductor/page.tsx`.
- `components/VehiculoConductorForm.tsx`, `components/ProponerHistorialForm.tsx`.

### Fixed
- `lib/auth-actions.ts`: login redirige a `/mi-garage` si es conductor.

### Pendiente
- Prueba cruzada A/B (bloqueada por Supabase 502).

## [E2b2] - 2026-11-01 - Cierre formal (gate 10/10)

### Verified
- Prueba cruzada A/B contra DB real (órdenes): aislamiento RLS confirmado en listado y acceso por URL (404).
- `STATUS.md`: fila de órdenes actualizada a `completo`.

### Notas
- No hubo cambios de código. Cierre administrativo del gate.
- Deudas aceptadas: transacciones no atómicas, inmutabilidad de completadas (UI only).
- Datos de prueba eliminados.

## [E3] - 2026-11-01 - Cierre formal (gate 10/10)

### Verified
- Prueba cruzada A/B contra DB real (catálogo local): aislamiento RLS confirmado en listado y en acceso directo por URL (404).
- `STATUS.md`: filas de catálogo global y local actualizadas a `completo`.

### Notas
- No hubo cambios de código. Cierre administrativo del gate de E3.
- Datos de prueba insertados para la prueba cruzada fueron eliminados.

## [E1] - 2026-11-01 - Cierre formal (gate 10/10)

### Changed
- `SESSION-STATE.md`: E1 pasa de `wip (gate 9/10)` a `cerrada (gate 10/10)`.
- `STATUS.md`: fila E1 auth pasa a `completo`.

### Verified
- 2FA activada en el gestor de contrasenas del propietario (Bitwarden).
- Prueba cruzada A/B (2026-10-31) sigue vigente: aislamiento bidireccional verificado.

### Notas
- No hubo cambios de codigo. Cierre administrativo del gate de E1.

## [E4a] - 2026-10-31 - Directorio + establecimientos publicos

### Added
- `supabase/migrations/018_establecimiento_publico.sql`: revoke all from anon + grant select to anon.
- `lib/schemas/establecimientoSchema.ts` + 16 tests.
- `lib/establecimiento-actions.ts`: listar, obtener, crear, editar, publicarMiEstablecimiento. 20 tests.
- `components/EstablecimientoForm.tsx`, `components/PublicarButton.tsx`.
- `app/(dashboard)/establecimientos/page.tsx`, `nuevo/page.tsx`, `[id]/page.tsx`.
- Link "Establecimientos" en sidebar de `(dashboard)/layout.tsx`.

### Changed
- `lib/schemas/directorioSchema.ts`: `establecimiento_id` -> `establecimiento_publico_id`.
- `lib/directorio-actions.ts`: lee el campo renombrado.
- `lib/establecimiento-actions.ts` `editarEstablecimiento`: usa `upsert` con `onConflict: "establecimiento_id"` para crear fila publica si no existe (H-E4a-3).
- `lib/establecimiento-actions.ts` `obtenerEstablecimiento`: `limit(1)` + normalizacion de join (H-E4a-4).

### Fixed
- `app/(dashboard)/establecimientos/[id]/page.tsx`: `await params` (Next 16, H-E4a-4).
- `app/directorio/page.tsx`: `await searchParams` (Next 16, H-E4a-8).
- `lib/establecimiento-actions.test.ts`: `vi.resetAllMocks()` + re-setup en `beforeEach` (H-E4a-test).

### Verified
- `npx tsc --noEmit`: 0 errores.
- `npm test`: 212/212 (19 archivos).
- `npm run build`: OK (25 rutas).
- Migracion 018 aplicada y verificada contra DB real: anon solo SELECT en establecimiento_publico.
- Prueba cruzada A/B (7/7) contra DB real: aislamiento bidireccional verificado, directorio publico muestra solo publicados.

### Deuda
- H-E4a-2: `/establecimientos` no oculta "Nuevo" para admin_general (falla con "Sin empresa"). Diferido a E5.
- H-E4a-7: directorio arranca en Asuncion sin selector de ciudad ni geolocalizacion. Diferido a E4b/E5.

## [E2a-bis] - 2026-10-31 - Saneamiento: Supabase real + flujo piloto end-to-end

### Added
- Proyecto Supabase real `kuatiauto` (`wzfukuzcousihslfgelr`, us-east-1). 15 migraciones aplicadas (001–015).
- `lib/supabase/types.ts` generado (83 KB, 27 tablas, 12 funciones).
- `lib/rate-limit.test.ts` (8 tests: buildClave + checkRateLimit con fail-open).
- `lib/empresa-actions.test.ts` (5 tests: validación Zod, sin sesión, RPC OK, RPC falla).
- `components/EmpresaForm.tsx` + `app/(dashboard)/crear-empresa/page.tsx`: form para que el propietario cree su empresa.
- `app/(dashboard)/dashboard/page.tsx`: redirect a `/` (parche del 404).
- `supabase/migrations/_cuarentena/` con `001_clientes.sql` (scaffold blueprint) + README explicativo.

### Changed
- `@supabase/ssr`: 0.5.2 → 0.12.7. Resuelve bug `never` en queries (Postgrest 14.18).
- `<Database>` cableado en `lib/supabase/server.ts` y `lib/supabase/client.ts`.
- `lib/directorio-actions.ts`: params RPC `null` → `undefined` (3 reemplazos).
- `lib/empresa-actions.ts`: reformateado (era 1 línea), `Datos inválidos` (corregido), params RPC `undefined`.
- `app/(dashboard)/page.tsx`: reescrito sin mojibake, condicional (crear empresa vs gestionar clientes), link `/clientes`.
- `app/(dashboard)/clientes/page.tsx`, `nuevo/page.tsx`, `[id]/page.tsx`, `components/ClienteForm.tsx`, `lib/clientes-actions.ts`, `lib/vehiculos-actions.ts`: links `/dashboard/clientes` → `/clientes`.
- `package.json` / `package-lock.json`: `supabase` como devDependency.
- `.gitignore`: `supabase/.temp/` (config local CLI).

### Fixed
- `lib/schemas/vehiculoSchema.test.ts`: test `default km_actual a 0` reemplazado por 2 tests (`optional` → `undefined`; `0` explícito).
- `components/ClienteForm.test.tsx`: reescrito contra interfaz nueva (action plano, no FormData).
- 23 errores de `never` en `tsc` al cablear `Database` (resueltos con `@supabase/ssr@0.12.7`).
- 6 errores de `null` en params RPC (resueltos con `?? undefined`).

### Verified
- `npx vitest run`: **89/89** tests verdes (11 archivos).
- `npx tsc --noEmit`: 0 errores.
- Encoding: 0 BOM, 0 mojibake en archivos modificados/creados.
- **Flujo piloto validado end-to-end** contra Supabase real:
  - Luis María Delvalle Ramírez (`importjapanencar@gmail.com`, rol `propietario`).
  - Empresa `Import Japan - Autorepuestos` (`adbcd23e-f296-435c-b835-e9ce837a9d95`).
  - Cliente `María José Bitar Balletbo`.
  - `audit_log`: `crear/empresa` + `crear/cliente`.

### Removed
- `supabase/migrations/001_clientes.sql` (movido a `_cuarentena/`, no pertenece a KuatiAuto).
- `scripts/`, `blueprints/`, `.github/workflows/ci.yml` del repo del studio (movimiento de repos, no de KuatiAuto).

### Pendiente
- UI vehículos + layout dashboard (E2b1).
- Órdenes + empleados (E2b2).
- Prueba cruzada A/B (E1-cierre).
- `RESEND_API_KEY` (E2b2, cuando haya cuenta).
- `npm audit` 19 vulns (revisar al cerrar E2b).
# CHANGELOG — KuatiAuto (provisional)

## [E2a] - 2026-10-31 - Gestion core: clientes + vehiculos backend

### Added
- lib/schemas/clienteSchema.ts + clienteSchema.test.ts (12 tests).
- lib/clientes-actions.ts + clientes-actions.test.ts (10 tests): listar, crear, editar, soft-delete.
- lib/schemas/vehiculoSchema.ts + vehiculoSchema.test.ts (12 tests).
- lib/vehiculos-actions.ts + vehiculos-actions.test.ts (11 tests): listar por cliente, crear, editar, soft-delete.
- supabase/migrations/014_cliente_activo.sql: soft-delete en cliente.
- supabase/migrations/015_vehiculo_activo.sql: soft-delete en vehiculo.
- components/ClienteForm.tsx: formulario reescrito (objeto plano, no FormData).
- app/(dashboard)/clientes/page.tsx, nuevo/page.tsx, [id]/page.tsx reescritos.
- app/page.tsx: home real KuatiAuto (reemplaza blueprint).
- app/directorio/page.tsx: directorio movido desde route group (resuelve colision /).

### Changed
- lib/schemas/vehiculoSchema.ts: km_actual de default(0) a optional().
- .gitignore: docs/_*.txt (outputs de tests/tsc).

### Removed
- lib/cliente-actions.ts (viejo, pre-multiempresa).

### Verified
- tsc --noEmit: 0 errores.
- vitest: 71/73 (2 tests desactualizados por cambio de schema).
- App funcional end-to-end: login, directorio, CRUD clientes.

### Pendiente
- vehiculoSchema.test.ts: 1 test espera km_actual: 0, ahora es optional.
- ClienteForm.test.tsx: test escrito para componente viejo, reescribir.
- UI vehiculos: 3 paginas + VehiculoForm.tsx.
- Layout dashboard con navegacion.
- Links de clientes apuntan a /dashboard/clientes, ruta real es /clientes.
## [E1] - 2026-10-30 - Fundamentos (wip)

### Added
- lib/rate-limit.ts: helper checkRateLimit + buildClave. Fail-open en dev.
- lib/audit.ts: helper auditLog con service_role. No-op sin key.
- lib/empresa-actions.ts: server action crearEmpresa via crear_empresa_con_establecimiento.

### Changed
- lib/auth-actions.ts: tildes corregidas, resetPassword agregado, rate limit en login/register/resetPassword.
- lib/notificaciones-actions.ts: empresa_id cableado en 2 de 3 actions (enviarBienvenida deja null).
- app/layout.tsx: metadata KuatiAuto.
- app/dashboard/ movido a app/(dashboard)/ (route group).
- .env.example: NEXT_PUBLIC_APP_URL, SENTRY_DSN, RATE_LIMIT_FAIL_MODE.
- .gitignore: *.bak, *.bak-template, docs/_dump-continuacion.txt.
- docs/proyecto/STATUS.md: E1 a wip con nota de cierre.

### Verified
- tsc --noEmit: 0 errores.
- npm run test: 28/28.
- Encoding: 0 mojibake, 0 BOM.

### Pendiente
- Tests de rate-limit y empresa-actions (E2).
- Prueba cruzada A/B (requiere Supabase real).
- Cerrar E1 (commit de cierre).

## [F14] - 2026-10-30 - Plan de implementacion - EN PROGRESO

### Added
- docs/proyecto/F14-PLAN.md (alcance, D-F14-1..5, criterios de aceptacion).
- docs/proyecto/IMPLEMENTATION-PLAN.md (etapas, modulos, dependencias, prioridades, entregables, criterios de "modulo completo").
- STATUS.md reescrito como tablero macro de modulos (reemplaza template del studio).

### Changed
- DECISIONES.md: D-F13-1..5 a APROBADA (cierre formal F13).
- SESSION-STATE.md / CHANGELOG.md / BITACORA.md: F13 a COMPLETADA (saneamiento).
- ROADMAP.md: F14 EN PROGRESO.

### Pendiente
- Cerrar F14 (ROADMAP COMPLETADA, commit de cierre).

Registro de cambios por fase. Formato: Keep a Changelog adaptado. Fechas en ISO 8601.

## [F13] - 2026-10-30 - Operacion y continuidad - COMPLETADA

### Added
- docs/proyecto/F13-PLAN.md: alcance, decisiones D-F13-1..5, criterios de aceptacion.
- docs/proyecto/MANTENIMIENTO.md: runbook completo (entornos, despliegues, backups, monitorizacion, incidentes S1/S2/S3, continuidad, accesos).
- docs/ciclo-de-vida/MANTENIMIENTO.md: stub que apunta al nuevo runbook.
- ARCHITECTURE.md §Operacion (F13 - 2026-10-30): contrato operativo y resumen D-F13-1..5.
- DECISIONES.md D-F13-1..5 (PROPUESTA).

### Changed
- ROADMAP.md: F13 marcado EN PROGRESO; deuda de docs saneada (BUSINESS-LOGIC resuelto F12, MANTENIMIENTO resuelto F13).
- SESSION-STATE.md: estado actual, proximos pasos y deuda F13.
- BITACORA.md: entrada 2026-10-30 F13.

### Fixed
- Encoding en SESSION-STATE.md, BITACORA.md y CHANGELOG.md: doble codificacion cp1252 -> utf8 eliminada (mojibake A-tilde), em-dash preservados.

### Verified
- Encoding post-fix: C3-83(mojibake)=0 en los 3 archivos.

### Cerrado
- D-F13-1..5 APROBADAS (2026-10-30, arranque F14, por delegacion).
- ROADMAP.md F13 COMPLETADA. Commit de cierre: 3684ff2.
## [F12] - 2026-10-30 - Modelo comercial - COMPLETADA

### Added
- docs/proyecto/F12-PLAN.md: alcance F12, decisiones D-F12-1..5, criterios de aceptacion.
- BUSINESS-LOGIC.md �Modelo comercial: planes, limites, premium, estrategia, suscripciones.
- DECISIONES.md D-F12-1..5 (PROPUESTA).

### Changed
- ROADMAP.md: F12 marcado EN PROGRESO.
- SESSION-STATE.md: F12 en curso.

### Verified
- D-F12-1..5 APROBADAS.
- BUSINESS-LOGIC.md �Modelo comercial completo.

## [F11] - 2026-10-30 - Notificaciones (stub + mocks) - COMPLETADA

### Added
- `docs/proyecto/F11-PLAN.md`: alcance F11a (stub + mocks), qué incluye, qué no, orden de implementación, criterios de aceptación.
- `ARCHITECTURE.md` §Notificaciones: cliente Resend con fallback mock, templates, tabla `notificacion_log`, server actions, cron (diseño), idempotencia, rate limiting, reintentos, trazabilidad, RLS.
- `DECISIONES.md` D-F11-1 a D-F11-5 (PROPUESTA).

### Changed
- `ROADMAP.md`: F11 marcado como EN PROGRESO con docs 5a-5b; F11-PLAN.md como doc principal.
- `SESSION-STATE.md`: D-F11-* como PROPUESTA; próximos 3 pasos actualizados.

### Codigo (F11a)
- Migracion 013_notificaciones.sql (tabla, indices, RLS).
- lib/email/resend.ts (cliente + fallback mock).
- lib/email/templates/ (recordatorio, bienvenida, historial).
- lib/supabase/admin.ts (service_role, solo server-side).
- lib/schemas/notificacionesSchema.ts (Zod).
- lib/notificaciones-actions.ts (3 server actions con idempotencia + rate limit).
- Tests: notificacionesSchema.test.ts, resend.test.ts, notificaciones-actions.test.ts.

### Verified
- vitest: 28/28.
- tsc --noEmit: 0 errores.
- next build: verde.

### Decisiones
- D-F11-1..5 APROBADAS.

## [F10] — 2026-10-30 — Directorio y geolocalización

Ver `BITACORA.md` §Fase 10. Resumen: búsqueda por distancia (earthdistance + cube), Leaflet + OSM, migración `012_busqueda_directorio.sql`, `lib/directorio-actions.ts`, `components/directorio/MapaDirectorio.tsx`, `app/(directorio)/page.tsx`.

## [F9] — 2026-10-30 — Privacidad y protección de datos

Ver `BITACORA.md` §Fase 9. Ley 6534/2020, retención, derechos, consentimientos.

## [F8] — 2026-10-30 — Costes y sostenibilidad

Ver `BITACORA.md` §Fase 8. Free tier, único costo real: dominio `.com.py`.

## [F7] — 2026-10-30 — Stack tecnológico

Ver `BITACORA.md` §Fase 7. Next.js 16, React 19, Tailwind 4, Supabase, Zod, Vitest, Vercel, Resend, Leaflet + OSM, Vercel Analytics, Sentry, GitHub Actions.

## [E2b1] — 2026-10-31 — UI vehículos + layout dashboard

Ver `BITACORA.md` §Cierre E2b1. Layout dashboard con sidebar, `VehiculoForm` crear/editar, 3 rutas de vehículos, `listarVehiculosEmpresa()` en backend. Panel logueado movido a `/dashboard`. Registro manda `nombre` a `raw_user_meta_data`.

## [F6a] — 2026-10-30 — Catálogo automotriz

Ver `BITACORA.md` §Fase 6a. Fuentes aceptables niveles 1-3, validación por admin_general, alcance inicial acotado.

## [F5] — 2026-10-30 — Modelo de datos (F5a, F5b, F5c)

Ver `BITACORA.md` §Fases 5a, 5b, 5c. Migraciones 001-006, RLS, audit_log, rate_limit, seed del catálogo.

## [F4] — 2026-10-30 — Arquitectura de seguridad

Ver `BITACORA.md` §Fase 4. OWASP Top 10 + ASVS nivel 2, límites de confianza, rate limiting, auditoría, recuperación.

## [F3] — 2026-10-30 — Arquitectura multiempresa

Ver `BITACORA.md` §Fase 3. RLS por empresa_id, SECURITY DEFINER, pruebas cruzadas.

## [F2] — 2026-10-30 — Usuarios, roles y permisos

Ver `BITACORA.md` §Fase 2. Roles MVP: admin_general, propietario, empleado, conductor, visitante.

## [F1] — 2026-10-30 — Definición del producto

Ver `BITACORA.md` §Fase 1. Alcance MVP confirmado: gestión + directorio + portal + catálogo + inventario.

## [F0] — 2026-10-30 — Punto de partida

Ver `BITACORA.md` §Fase 0. Metodología, nombre provisional, repo único modular.
## [E2b2-s2] — 2026-10-31 — UI de órdenes

Ver `BITACORA.md` §Cierre E2b2 sesión 2. Lista `/ordenes`, form `/ordenes/nuevo` con precarga vía `?vehiculo_id=`, detalle `/ordenes/[id]` con acciones (completar / anular / eliminar borrador). `OrdenLineas` respeta schema real (servicios sin cantidad, productos sin descripción). Link "Órdenes" en sidebar. Botón "Nueva orden para este vehículo" en `/vehiculos/[id]`. Commit `64c6b23`. 133/133 tests, tsc 0, build OK.

## [E3] — 2026-10-31 — Catálogo local + seed de marcas/modelos

Ver `BITACORA.md` §Cierre E3. CRUD de servicios y productos propios de la empresa (`/catalogo/servicios`, `/catalogo/productos`), backend con 4 actions cada uno, 43 tests nuevos (suite 176). Migración `017` con 10 marcas faltantes + 70 modelos populares en Paraguay. Commit `b399b28`.

## [E5b-wip2] - 2026-11-02 - Panel admin: /admin/empresas + fix H-E5b-2

### Added
- `lib/admin-actions.ts`: `listarEmpresasAdmin(filtroEstado?)` (contadores agrupados por empresa_id, sin N+1) y `obtenerEmpresaAdmin(id)` (detalle con establecimientos y usuarios).
- `app/(admin)/admin/empresas/page.tsx`: lista con filtro por estado (Todas / Activas / Desactivadas), badge, contadores por columna, link al detalle.
- `app/(admin)/admin/empresas/[id]/page.tsx`: detalle con datos, 5 contadores, tabla de usuarios, tabla de establecimientos. `await params`, `notFound()` si no existe.
- `lib/admin-actions.test.ts`: 9 tests (obtenerContadoresAdmin, listarEmpresasAdmin, obtenerEmpresaAdmin).
- Link "Empresas" en `app/(admin)/layout.tsx`.

### Changed
- `lib/admin-actions.ts`: `obtenerContadoresAdmin` usa `createAdminClient()` (service_role) para las 4 queries de conteo, previo check de rol admin_general. Fix del bug de RLS.
- `lib/admin-actions.ts`: helper `requireAdmin()` extraido (reutilizado por las 3 actions).

### Fixed
- **H-E5b-2 (alto):** las policies SELECT de cliente, vehiculo, orden_trabajo y establecimiento NO incluyen `is_admin_general()`. Con `createClient()` (RLS), admin_general veia 0 filas en esas 4 tablas. El dashboard mostraba "0 establecimientos publicados" y "0 ordenes" cuando habia datos reales. Fix con service_role + check previo de rol.
- Mojibake en `app/(admin)/layout.tsx`: `Cerrar sesiÃ³n` -> `Cerrar sesión`, comment `CatÃ¡logo` -> `Catalogo`.

### Verified
- 221/221 tests verdes (20 archivos, +9 nuevos).
- `tsc --noEmit`: exit 0.
- `npm run build`: OK (incluye /admin, /admin/empresas, /admin/empresas/[id]).

### Pending
- /admin/usuarios: lista + cambio de rol / desactivacion.
- /admin/catalogo: moderacion de servicio_global y producto_global.
- Link "Usuarios" y "Catalogo" en el sidebar admin.
## [E5b-wip3] - 2026-11-02 - Panel admin: /admin/usuarios

### Added
- `lib/admin-actions.ts`: `listarUsuariosAdmin(filtroRol?)`, `cambiarRolUsuario(userId, nuevoRol)`, `desactivarUsuario(userId, activo)`. Tipos `UsuarioAdminRow`, `RolAsignable`.
- `components/UsuarioAccionesClient.tsx`: client component con select de rol + activar/desactivar. Excluye auto-modificacion y admin_general.
- `app/(admin)/admin/usuarios/page.tsx`: tabla con filtro por rol, badge activo/inactivo, link a empresa.
- `lib/admin-usuarios-actions.test.ts`: 12 tests.
- Link "Usuarios" en `app/(admin)/layout.tsx`.

### Business rules
- No auto-cambio de rol.
- No cambio de rol de admin_general desde UI (solo SQL).
- No auto-desactivacion.
- No desactivar al ultimo admin_general activo.

### Verified
- 233/233 tests verdes (21 archivos, +12 nuevos).
- `tsc --noEmit`: exit 0.
- `npm run build`: OK (incluye /admin/usuarios).

### Fixed (tooling)
- Bug de protocolo PS: `` `r`n `` en strings de comillas simples no se interpreta. Usar comillas dobles con escape de comillas internas.

### Pending
- /admin/catalogo: moderacion de servicio_global y producto_global.
- Link "Catalogo" en el sidebar.
## [E5b-wip4] - 2026-11-02 - Catalogo global: servicios (CRUD)

### Added
- `lib/schemas/catalogoGlobalSchema.ts`: Zod para servicios globales.
- `lib/admin-actions.ts`: `listarServiciosGlobalesAdmin`, `obtenerServicioGlobalAdmin`, `crearServicioGlobal`, `editarServicioGlobal`, `eliminarServicioGlobal`.
- `components/ServicioGlobalForm.tsx`: client form crear/editar.
- `components/EliminarServicioGlobalButton.tsx`: boton de eliminacion con confirm.
- `app/(admin)/admin/catalogo/page.tsx`: indice.
- `app/(admin)/admin/catalogo/servicios/page.tsx` + `nuevo/page.tsx` + `[id]/page.tsx`.
- `lib/schemas/catalogoGlobalSchema.test.ts`: 11 tests.
- `lib/admin-catalogo-servicios-actions.test.ts`: 13 tests.
- Link "Catalogo" en `app/(admin)/layout.tsx`.

### Verified
- 257/257 tests verdes (23 archivos, +24 nuevos).
- `tsc --noEmit`: exit 0.
- `npm run build`: OK (8 rutas admin).

### Pending
- /admin/catalogo/productos: CRUD completo (marca, tipo, viscosidad).
## [E5b-wip5] - 2026-11-02 - Catalogo global: productos (CRUD) + cierre E5b-futuro

### Added
- `lib/schemas/catalogoGlobalSchema.ts`: schemas de productos (crear/editar/id).
- `lib/admin-actions.ts`: `listarProductosGlobalesAdmin`, `obtenerProductoGlobalAdmin`, `crearProductoGlobal`, `editarProductoGlobal`, `eliminarProductoGlobal`.
- `components/ProductoGlobalForm.tsx`, `components/EliminarProductoGlobalButton.tsx`.
- `app/(admin)/admin/catalogo/productos/page.tsx` + `nuevo/page.tsx` + `[id]/page.tsx`.
- Tests: +9 schema, +11 actions.

### Verified
- 277/277 tests verdes (24 archivos, +20 nuevos).
- `tsc --noEmit`: exit 0.
- `npm run build`: OK (7 rutas de catalogo).

### Estado E5b-futuro
Cerrado funcionalmente: `/admin/empresas`, `/admin/usuarios`, `/admin/catalogo/servicios`, `/admin/catalogo/productos`. Todos con tests, tsc y build verde.

### Pending
- Smoke test manual del panel admin en navegador.
- E5c: Sentry + Vercel Analytics + backups automatizados.
## [E5c] - 2026-11-02
### Added
- Sentry error monitoring (`@sentry/nextjs`) con DSN por variables de entorno.
- Vercel Analytics (`@vercel/analytics`) en el root layout.
- Workflow de GitHub Actions para backups semanales de la base de datos (`.github/workflows/backup-db.yml`).
- Archivo `app/global-error.tsx` para capturar errores de React.

### Fixed
- Deploy inicial en Vercel: configuradas las variables de entorno de producción que faltaban para Supabase y Sentry.

## [E8] - 2026-11-02
### Added
- Landing Page rediseñada (Hero, tarjetas, efectos neón).
- Login y Registro con toggle de contraseña, spinner y Design System.
- Sidebars responsive (Admin, Propietario, Conductor) con menú hamburguesa, logout y versión visible.
- Tablas responsive con vista de tarjetas en celular.
- Panel de métricas globales para el CEO (/admin/analytics).
- Dashboard del Propietario con métricas propias.
- Páginas legales (/terminos, /privacidad) y Centro de Ayuda (/ayuda).
- Actualización automática de la PWA y versión de la app visible.

### Fixed
- Scroll horizontal en tablas del panel de admin para celular.
- Corrección de validación de datos en el panel de métricas.

## [0.2.0] - 2026-11-02
### Added
- Design System aplicado al 100% (Landing, Login, Registro, Legales, Ayuda, Sidebars, Tablas, Formularios y Métricas).
- Panel de métricas globales para el CEO (/admin/analytics) y métricas del Propietario en el Dashboard.
- Formularios responsive (Cliente, Vehículo, Establecimiento, Servicio, Producto, Orden).
- Barra superior mobile (MobileTopBar) para evitar superposición del menú.
- Páginas legales (/terminos, /privacidad) y Centro de Ayuda (/ayuda).

### Fixed
- Scroll horizontal en tablas del panel de admin para celular.
- Sidebar responsive con menú hamburguesa y cierre en celular.
- Corrección de validación de datos en el panel de métricas.
