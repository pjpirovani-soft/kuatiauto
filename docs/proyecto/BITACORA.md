# BITACORA — KuatiAuto (provisional)

## 2026-10-30 — Fase 0: punto de partida arquitectónico

- **Contexto:** el proyecto nace del contacto comercial de Encarnación (Paraguay) que trabaja en mantenimiento automotor y propuso una plataforma común para establecimientos del rubro. El nombre `KuatiAuto` queda como provisional hasta verificar redes y DINAPI.
- **Proyecto base:** creado con `nueva-app.ps1 -Blueprint web-app -Destino clients\kuatiauto`. Scaffold `web-app` con auth + CRUD + RLS de ejemplo.
- **Metodología:** se alinea a la metodología del studio (ENC) el mismo día.
- **Fase 0 (documentación):** `ARCHITECTURE.md`, `SPEC.md`, `SESSION-STATE.md`, `CLIENTE.md`, `GLOSARIO.md`, `BITACORA.md`.
- **Decisiones aprobadas:** D-A, D-B, D-C, D-D (metodología), D-P1, D-P2, D-P3 (delegadas), ADR-001 a ADR-004.
- **Verificado:** `kuatiauto.com.py` disponible en NIC.py (2026-10-30). Sin registrar.
- **Pendiente:** verificar redes (@kuatiauto) y DINAPI (clases 9, 35, 42).
- **No se tocó:** `app/`, `components/`, `lib/`, `supabase/`.

**Commits:** `b0bea04 docs: fase 0 — punto de partida arquitectonico KuatiAuto`.

## 2026-10-30 — Fase 1: definición de producto

- **Contexto:** se define el alcance del MVP, los flujos, el modelo de datos preliminar y los criterios de aceptación.
- **Decisiones por delegación (D-F1-1, D-F1-2, D-F1-3):**
  - Flujo MVP: 7 pasos del camino feliz. Sin factura/recibo, sin impresión/PDF, sin métricas en dashboard. Próximo mantenimiento sugerido automático.
  - Orden de trabajo: 9 campos. `orden_servicio` y `orden_producto` en tablas aparte. `importe_total` único.
  - Catálogo: híbrido. Global (admin) + local (empresa). Seed manual.
- **ADRs nuevos:** ADR-005 (catálogo híbrido), ADR-006 (productos y servicios en tablas aparte).
- **Riesgos cerrados:** R5 (alcance MVP inflado).
- **Docs actualizados:** `SPEC.md` (secciones 2, 3, 4, 8, 9, 10, 11), `GLOSARIO.md` (términos nuevos), `ARCHITECTURE.md` (ADR-005, ADR-006, plan de migraciones), `SESSION-STATE.md`, `BITACORA.md`, `CHANGELOG.md`.
- **No se tocó:** `app/`, `components/`, `lib/`, `supabase/`. El scaffold `web-app` queda intacto hasta F3.

**Commits:** (pendiente).


## 2026-10-30 — Cierre de F1: alcance MVP confirmado

- **Contexto:** el PROMPT MAESTRO se recupera y se guarda como `docs/proyecto/PROMPT-MAESTRO.md`. Se crea `ROADMAP.md` (hoja de ruta de 14 fases) y `DECISIONES.md` (registro A/B/C/D).
- **Decisiones confirmadas:**
  - **P-Alcance-MVP:** los 4 componentes del PROMPT MAESTRO son MVP (gestión + directorio + portal + catálogo + inventario). Directorio y portal no son v2.
  - **P-Catálogo:** catálogo completo desde MVP (fabricantes, marcas, modelos, motores, especificaciones, fuentes).
  - **P-Inventario:** inventario y movimientos de stock en MVP.
- **Reversión:** D-P1 (mi propuesta de recortar a gestión + catálogo mínimo + admin mínimo) queda DESCARTADA. El alcance es el del PROMPT MAESTRO.
- **Consecuencia:** F2 ahora incluye el rol de conductor (portal) y el rol público (directorio). La matriz de permisos es más grande.
- **Docs actualizados:** `SPEC.md` (sección 2), `DECISIONES.md`, `ROADMAP.md`, `SESSION-STATE.md`, `BITACORA.md`, `CHANGELOG.md`.

**Commits:** (pendiente).

## 2026-10-30 — Fase 2: usuarios, roles y permisos

- **Contexto:** se define la matriz completa de permisos, la separación authn/authz, las operaciones auditables y las reglas de negocio por rol.
- **Roles del MVP:** `admin_general`, `propietario`, `empleado`, `conductor`, `visitante`. `verificador_catalogo` → v2.
- **Authn:** Supabase Auth para roles con cuenta. **Authz:** RLS + server actions (doble capa).
- **Matriz de permisos:** 20 entidades × 5 roles × operaciones (V/C/E/D). En `SPEC.md` sección 3.
- **Reglas clave:**
  - Conductor ve historial solo si autorizó. Establecimiento no ve historial cross-tenant (R8).
  - Directorio con coordenadas aproximadas. Exactas solo para autenticados (R10).
  - Propietario no puede degradarse a sí mismo ni eliminarse.
  - Admin general no ve datos de negocio.
- **Operaciones auditables:** 8 (alta/baja empresa, alta/desactivación empleado, edición cliente/vehículo/orden, edición catálogo global, cambios de rol, autorización de historial, publicación en directorio, uso de service_role).
- **Decisiones:** D-F2-1 a D-F2-5 en `DECISIONES.md`.
- **Docs actualizados:** `SPEC.md` (sección 3), `ARCHITECTURE.md` (sección Autorización), `DECISIONES.md`, `ROADMAP.md`, `SESSION-STATE.md`, `BITACORA.md`, `CHANGELOG.md`.
- **No se tocó:** `app/`, `components/`, `lib/`, `supabase/`. El scaffold `web-app` queda intacto hasta F3.

**Commits:** (pendiente).


## 2026-10-30 — Fase 3: arquitectura multiempresa

- **Contexto:** se define el modelo multi-tenant, la estrategia RLS, SECURITY DEFINER y las pruebas cruzadas. Es la fase crítica: sin esto, no hay código seguro.
- **Modelo:** empresa → N establecimientos. 1 usuario = 1 empresa en MVP. Multi-empresa → v2 (tabla usuario_empresa). admin_general y conductor tienen empresa_id = null.
- **RLS:** por empresa_id en todas las tablas de negocio. Catálogo global: SELECT true, escritura solo admin_general. Directorio: SELECT true con coordenadas aproximadas. Portal: RLS por conductor_id. Administración: empresa/usuario/audit_log con políticas específicas.
- **SECURITY DEFINER:** una sola función en MVP: crear_empresa_con_establecimiento. search_path fijo, permisos solo authenticated, transacción atómica.
- **Pruebas cruzadas:** 2 sesiones (empresa A y B), todas las tablas, SELECT/INSERT/UPDATE/DELETE. Documentadas en este archivo antes de cerrar F3.
- **Diferenciación por rol:** RLS por empresa_id. Roles (empleado vs propietario) se validan en server actions. Excepción: historial_compartido.
- **Decisiones:** D-F3-1 a D-F3-5 en DECISIONES.md.
- **Docs actualizados:** ARCHITECTURE.md (sección Multiempresa), DECISIONES.md, ROADMAP.md, SESSION-STATE.md, BITACORA.md, CHANGELOG.md.
- **No se tocó:** app/, components/, lib/, supabase/. El scaffold web-app queda intacto hasta F5.

**Commits:** 6507ebe (arquitectura), pendiente (cierre F3).

## 2026-10-30 — Fase 4: arquitectura de seguridad

- **Contexto:** se cierra el modelo de amenazas, límites de confianza, rate limiting, auditoría y recuperación. Es la última fase crítica antes de F5.
- **Modelo de amenazas:** OWASP Top 10 (2021) completo + OWASP ASVS nivel 2 + amenazas del dominio (R7-R14, cada una con control y fase).
- **Límites de confianza:** frontend no confiable, server actions confiables pero validan todo, Supabase confiable (RLS última línea), service_role solo server-side, terceros con permisos mínimos y rotación.
- **Rate limiting:** login 5/min IP, registro 3/min IP, recuperación 3/min IP, API 100/min usuario, crear empresa 10/min, invitar empleado 10/min, publicar directorio 20/min. Implementación: middleware + tabla rate_limit.
- **Auditoría:** tabla audit_log con 9 operaciones auditables, retención 1 año, solo admin_general lee, INSERT vía SECURITY DEFINER o server action con service_role.
- **Recuperación:** backups diarios Supabase (7 días free), rotación de secretos 90 días, plan de respuesta documentado, notificación de incidentes críticos en 72h (Ley 6534/2020).
- **Decisiones:** D-F4-1 a D-F4-5 en DECISIONES.md.
- **Docs actualizados:** ARCHITECTURE.md (sección Seguridad ampliada), DECISIONES.md, ROADMAP.md, SESSION-STATE.md, BITACORA.md, CHANGELOG.md.
- **No se tocó:** app/, components/, lib/, supabase/.

**Commits:** 9d7b1c2 (arquitectura), pendiente (cierre F4).

## 2026-10-30 — Fase 5a: modelo de datos (gestión)

- **Contexto:** se implementan las migraciones 001-006 de las tablas de gestión. Es la primera fase con código real.
- **Migraciones:** 001_empresa_establecimiento, 002_usuario, 003_cliente, 004_vehiculo, 005_orden_trabajo, 006_stock_movimiento. Total: ~14 KB de SQL.
- **Tablas creadas:** empresa, establecimiento, usuario, cliente, vehiculo, vehiculo_identidad, orden_trabajo, orden_servicio, orden_producto, producto_empresa, stock_movimiento.
- **Triggers y funciones:** set_updated_at, handle_new_user, crear_empresa_con_establecimiento (SECURITY DEFINER), poblar_vehiculo_identidad, actualizar_stock.
- **Pendiente F5b:** catálogo automotriz (fabricante, marca, modelo, version, motorizacion, especificacion_lubricante, servicio_global, servicio_empresa, producto_global), directorio (establecimiento_publico), portal (conductor, vehiculo_conductor, historial_compartido).
- **Pendiente F5c:** audit_log, rate_limit, RLS policies (011), seed del catálogo.
- **No se tocó:** app/, components/, lib/. El scaffold web-app queda intacto hasta F6.

**Commits:** (pendiente).

## 2026-10-30 — Fase 5b: catálogo, directorio y portal

- **Contexto:** se implementan las migraciones 007-008. Con esto el modelo de datos del MVP está completo (falta F5c: audit_log, rate_limit, RLS, seed).
- **Migraciones:** 007_catalogo.sql (7112 bytes), 008_directorio_portal.sql (5444 bytes). Total F5a+F5b: ~26 KB de SQL.
- **Catálogo:** fabricante → marca → modelo → version → motorizacion → especificacion_lubricante (con fuente, fecha, estado de validación). servicio_global, servicio_empresa, producto_global. FKs pendientes de orden_servicio/orden_producto agregadas.
- **Directorio:** establecimiento_publico con coordenadas aproximadas (lat/lng 5 decimales, barrio, ciudad, departamento), servicios_ofrecidos, horarios.
- **Portal:** conductor (cuenta propia), vehiculo_conductor, historial_compartido (con autorizado boolean).
- **Trigger nuevo:** handle_new_conductor (crea conductor si el usuario se registra como tal).
- **Pendiente F5c:** audit_log, rate_limit, RLS policies (011), seed del catálogo.
- **No se tocó:** app/, components/, lib/.

**Commits:** (pendiente).

## 2026-10-30 — Fase 5c: RLS, audit_log, rate_limit y seed (F5 completa)

- **Contexto:** se cierran las últimas 3 migraciones de F5. Con esto el modelo de datos del MVP está completo.
- **Migraciones:** 009_audit_log_rate_limit, 010_rls_policies, 011_seed_catalogo. Total F5: 11 migraciones, ~49 KB de SQL.
- **RLS:** habilitado en todas las tablas. 2 helpers (current_empresa_id, is_admin_general). Políticas por tabla y operación, siguiendo el modelo de F3.
- **audit_log:** 9 operaciones auditables, retención 1 año, solo admin_general lee.
- **rate_limit:** check_rate_limit(clave, max, ventana) SECURITY DEFINER. cleanup_rate_limit() para limpieza.
- **Seed:** 15 fabricantes, 5 marcas, 3 modelos, 10 servicios globales, 8 productos globales. Marcas [PENDIENTE] hasta F6. Especificaciones de lubricantes vacías (no inventar).
- **F5 completa:** modelo de datos del MVP cerrado. Listo para F6 (catálogo automotriz) y F7 (stack).
- **No se tocó:** app/, components/, lib/.

**Commits:** (pendiente).

## 2026-10-30 — Fase 6a: catálogo automotriz (fuentes y validación)

- **Contexto:** se define el proceso de llenado y validación del catálogo. No es código: es la política de fuentes y el proceso de verificación.
- **Fuentes:** niveles 1-3 aceptables (manual del fabricante, fabricante del lubricante, bases técnicas). Nivel 4 (foros) no aceptable.
- **Validación:** admin_general verifica en MVP. pendiente → verificado o disputado. Contradicción → disputado. Revisión anual.
- **Alcance inicial:** 10 fabricantes comunes en Paraguay, 2-3 modelos cada uno, solo especificaciones de aceite de motor. Ampliación en v2.
- **Carga:** manual por admin en MVP. CSV en v2. Versionado por fila nueva. Auditoría en audit_log.
- **Pendiente F6b:** carga inicial del catálogo con datos verificados. Requiere que el piloto o el admin verifiquen las fuentes antes de cargar.

**Commits:** (pendiente).

## 2026-10-30 — Fase 7: stack tecnológico (justificación)

- **Contexto:** se justifica cada elección del stack y se definen los servicios externos que faltaban: correo, mapas, analítica, CI/CD.
- **Stack core:** Next.js 16 + React 19 + TypeScript + Tailwind 4 + Supabase + Zod + Vitest + Vercel. Justificación en ARCHITECTURE.md.
- **Correo:** Resend (free tier 100/día, 3000/mes). Emails: confirmación, recuperación, invitación. v2: notificación de mantenimiento.
- **Mapas:** Leaflet + OpenStreetMap en MVP (gratis). Mapbox en v2 si el directorio crece.
- **Analítica:** Vercel Analytics + Sentry free tier. CI/CD: GitHub Actions.
- **Variables de entorno:** 6 definidas (Supabase URL + anon + service_role, Resend, Sentry, app URL).
- **Decisiones:** D-F7-1 a D-F7-4 en DECISIONES.md.

**Commits:** (pendiente).

## 2026-10-30 — Fase 8: costes y sostenibilidad

- **Contexto:** se define la política de costes. Todo free tier, sin pagar nada hasta que el proyecto lo justifique.
- **Free tiers:** Vercel Hobby, Supabase Free, Resend Free, Sentry Free, Leaflet + OSM, GitHub Free. Único costo real: dominio `.com.py` (~$2/mes).
- **Escenarios:** 1 (prueba) $0/mes, 2 (primeros establecimientos) $0/mes, 3 (crecimiento moderado) ~$65/mes si se supera free tier, 4 (crecimiento importante) ~$1200/mes.
- **Regla de oro:** no se paga nada hasta que el proyecto lo justifique con uso real o ingresos. Monitoreo mensual de límites. No pagar por adelantado.
- **Decisiones:** D-F8-1 a D-F8-3 en DECISIONES.md.

**Commits:** (pendiente).

## 2026-10-30 — Fase 9: privacidad y protección de datos

- **Contexto:** se define el cumplimiento de la Ley 6534/2020 de Paraguay.
- **Datos recopilados:** email, nombre, teléfono, patente, VIN (interno), km_actual, IP/user_agent (audit_log), coordenadas aproximadas. Nada más.
- **Retención:** mientras cuenta/vehículo activo. audit_log 1 año. Eliminación: soft delete + anonimización en 30 días.
- **Derechos:** acceso, rectificación, eliminación, oposición, portabilidad (v2).
- **Consentimiento:** registro (términos + privacidad), conductor (historial compartido). Sin cookies de tracking.
- **Incidentes:** notificación a afectados en 72h (Ley 6534/2020).
- **Decisiones:** D-F9-1 a D-F9-4 en DECISIONES.md.

**Commits:** (pendiente).

## 2026-10-30 — Fase 10: directorio y geolocalización

- **Contexto:** se implementa la búsqueda por distancia y el mapa del directorio. Primera fase con código de frontend.
- **Migración 012:** earthdistance + cube. Función buscar_establecimientos (SECURITY DEFINER), publicar_establecimiento (SECURITY DEFINER).
- **Frontend:** lib/schemas/directorioSchema.ts, lib/directorio-actions.ts, components/directorio/MapaDirectorio.tsx (Leaflet + OSM), app/(directorio)/page.tsx.
- **Dependencia nueva:** leaflet (npm install leaflet + @types/leaflet).
- **Protección:** coordenadas aproximadas (R10), rate limiting (F4), no email, solo teléfono, paginación.
- **Decisiones:** D-F10-1 a D-F10-6 en DECISIONES.md.

**Commits:** (pendiente).
## 2026-10-30 — Fase 11: notificaciones (docs)

**Docs:**
- `ARCHITECTURE.md` §Notificaciones (alcance F11a: stub + mocks, tabla `notificacion_log`, server actions, cron solo diseño, idempotencia, rate limiting, reintentos, trazabilidad, RLS, criterios de aceptación).
- `DECISIONES.md` D-F11-1 a D-F11-5 (PROPUESTA).
- `F11-PLAN.md` (alcance aprobado, qué incluye, qué no, orden de implementación).
- `ROADMAP.md` actualizado (F11 en progreso con docs 5a-5b).
- `SESSION-STATE.md` actualizado (D-F11-* como PROPUESTA, próximos 3 pasos).

**Decisiones:** D-F11-1 a D-F11-5 (PROPUESTA, se aprueban al cerrar F11).

**Commits:** 14ca03b, d53b5b3, fdd5ef6.

**Pendiente:** código de F11 (migración 013, lib/email/, notificaciones-actions, tests), `next build` verde, cierre de F11.
## 2026-10-30 - Cierre de F11: notificaciones (stub + mocks)

**Codigo (F11a):**
- supabase/migrations/013_notificaciones.sql: tabla notificacion_log, indices, RLS (SELECT por empresa, escritura solo service_role).
- lib/email/resend.ts: cliente con fallback mock (sin dependencia resend, fetch nativo).
- lib/email/templates/: recordatorio-mantenimiento, bienvenida, historial-compartido.
- lib/supabase/admin.ts: createAdminClient() + hasAdminClient().
- lib/schemas/notificacionesSchema.ts: 3 schemas Zod.
- lib/notificaciones-actions.ts: 3 server actions con idempotencia + rate limit + persistencia opcional.

**Verificacion:** vitest 28/28, tsc --noEmit 0 errores, next build verde.

**Decisiones:** D-F11-1..5 APROBADAS.

**Commits:** 14ca03b, d53b5b3, fdd5ef6, 47273b7, 5ec82aa, c8f233a, 1c692dc, 0ec2b85.

**Deuda:** empresa_id: null (TODO F12), SUPABASE_SERVICE_ROLE_KEY y RESEND_API_KEY sin configurar, tipos Supabase sin regenerar, reintentos y cron disenados no implementados.

## 2026-10-30 - Cierre de F12: modelo comercial

**Docs:**
- F12-PLAN.md (alcance, decisiones D-F12-1..5, criterios de aceptacion).
- BUSINESS-LOGIC.md �Modelo comercial (planes, limites, premium, estrategia, suscripciones).
- DECISIONES.md D-F12-1..5 (PROPUESTA).
- ROADMAP.md F12 EN PROGRESO.
- SESSION-STATE.md actualizado.

**Decisiones:** D-F12-1..5 (APROBADAS).

**Commits:** d64e534, 5dcdaec, f5a1311, 60a0815.

**Pendiente:** cierre de F12 (aprobacion D-F12, CHANGELOG, commit final).

## 2026-10-30 - Cierre de F13: operacion y continuidad

**Docs:**
- F13-PLAN.md (alcance, decisiones D-F13-1..5, criterios).
- MANTENIMIENTO.md completo en docs/proyecto/ (runbook: entornos, despliegues, backups, monitorizacion, incidentes S1/S2/S3, continuidad, accesos).
- docs/ciclo-de-vida/MANTENIMIENTO.md -> stub que apunta al nuevo.
- DECISIONES.md D-F13-1..5 (PROPUESTA).
- ARCHITECTURE.md §Operacion (F13 - 2026-10-30), insertada entre Migraciones SQL y Flujos principales.
- ROADMAP.md F13 EN PROGRESO + deuda de docs saneada (BUSINESS-LOGIC marcado resuelto en F12, MANTENIMIENTO marcado resuelto en F13).
- SESSION-STATE.md actualizado a F13.
- CHANGELOG.md pendiente.

**Decisiones:** D-F13-1..5 (PROPUESTA, aprobar al cierre).

**Extra:** fix de encoding en SESSION-STATE, BITACORA y CHANGELOG (doble codificacion cp1252 -> utf8, mojibake A-tilde eliminado, em-dash preservados).

**Commits:** 4878559 (plan, decisiones, runbook) + pendientes de esta sesion.

**Cierre:** D-F13-1..5 APROBADAS (2026-10-30, por delegacion). ROADMAP COMPLETADA. Commit de cierre: 3684ff2. Saneamiento de estado aplicado al arrancar F14.
## 2026-10-30 - F14 arranque: plan de implementacion + saneamiento F13

**Saneamiento F13 (por delegacion, al arrancar F14):**
- D-F13-1..5 aprobadas (PROPUESTA -> APROBADA).
- SESSION-STATE, CHANGELOG, BITACORA: F13 a COMPLETADA (ROADMAP ya lo estaba desde 3684ff2).
- Sin cambios de codigo.

**F14 (en progreso):**
- F14-PLAN.md (alcance, D-F14-1..5, criterios de aceptacion).
- IMPLEMENTATION-PLAN.md (etapas, modulos, dependencias, prioridades, entregables, gate de seguridad).
- STATUS.md reescrito (tablero macro de modulos).
- ROADMAP.md F14 EN PROGRESO.

**Decisiones:** D-F14-1..5 (PROPUESTA, aprobar al cierre de F14).

**Commits:** (pendiente).

## 2026-10-30 - E1 Fundamentos (wip)

**Código:**
- Auth completo: login, register, resetPassword, logout, tildes corregidas (lib/auth-actions.ts).
- Rate limiting: lib/rate-limit.ts (helper con check_rate_limit de F5c) + integrado en login (5/min), register (3/min), resetPassword (3/min).
- Multiempresa: lib/empresa-actions.ts (crearEmpresa via crear_empresa_con_establecimiento).
- Audit hooks: lib/audit.ts (auditLog helper con service_role, no-op sin key).
- Cableado empresa_id en notificaciones-actions.ts (enviarRecordatorioMantenimiento, enviarHistorialCompartido). enviarBienvenida deja null (se llama antes de tener empresa).
- Layout: metadata KuatiAuto, route group (dashboard).
- .env.example: NEXT_PUBLIC_APP_URL, SENTRY_DSN, RATE_LIMIT_FAIL_MODE.
- .gitignore: *.bak, *.bak-template, docs/_dump-continuacion.txt.

**Verificación:**
- tsc --noEmit: 0 errores.
- npm run test: 28/28.
- Encoding: 0 mojibake, 0 BOM en archivos nuevos.

**Pendiente (deuda E1, a E2):**
- Tests de rate-limit y empresa-actions (mock pesado, sin Supabase real).
- Prueba cruzada A/B (requiere Supabase real, keys al final).
- Gate de seguridad de 10 puntos: parcial (1-7 ok, 8-10 pendientes).

**Commits:** (pendiente).
## 2026-10-31 - E2a: Gestion core (clientes + vehiculos backend)

**Codigo:**
- lib/schemas/clienteSchema.ts + clienteSchema.test.ts (12 tests).
- lib/clientes-actions.ts + clientes-actions.test.ts (10 tests): listar, crear, editar, soft-delete.
- lib/schemas/vehiculoSchema.ts + vehiculoSchema.test.ts (12 tests).
- lib/vehiculos-actions.ts + vehiculos-actions.test.ts (11 tests): listar por cliente, crear, editar, soft-delete.
- supabase/migrations/014_cliente_activo.sql: soft-delete en cliente.
- supabase/migrations/015_vehiculo_activo.sql: soft-delete en vehiculo.
- components/ClienteForm.tsx reescrito (objeto plano, no FormData).
- app/(dashboard)/clientes/page.tsx, nuevo/page.tsx, [id]/page.tsx reescritos.
- app/page.tsx: home real KuatiAuto (reemplaza blueprint).
- app/(directorio)/page.tsx -> app/directorio/page.tsx (resuelve colision de rutas /).
- .gitignore: docs/_*.txt.

**Verificacion:**
- tsc --noEmit: 0 errores.
- vitest: 71/73 (2 tests desactualizados por cambio de schema: km_actual optional, ClienteForm props nuevas).
- App funcional end-to-end: login, directorio, CRUD clientes.

**Decisiones por delegacion (2026-10-31):**
- D-E2-1: soft-delete en cliente y vehiculo (campo activo). Ordenes no se borran, se anulan.
- D-E2-2: proximo mantenimiento = fecha_orden + intervalo_km. Calculo en server action, no en BD.
- D-E2-3: invitacion empleado = token en usuario + email con link. Sin tabla nueva.
- D-E2-4: subdivision E2a (clientes+vehiculos) -> E2b (ordenes+empleados) desde el inicio.
- D-E2-5: tests de E1 diferidos se escriben al final de E2a.

**Lecciones:**
- Zod v4: z.string().uuid() exige UUID v4 estricto (bloque 3 empieza con 4, bloque 4 con 8/9/a/b). Fixtures deben usar UUIDs v4 reales.
- vi.mock se hoistea: usar vi.hoisted() para mocks compartidos.
- Mock chainable de Supabase: agregar .then al chainable para que await sobre .eq() funcione.
- PowerShell 5.x: -LiteralPath para paths con [id]; un comando por mensaje; no pegar PS> ni >>.

**Deuda pendiente:**
- vehiculoSchema.test.ts: 1 test espera km_actual: 0, ahora es optional.
- ClienteForm.test.tsx: test escrito para componente viejo (FormData), reescribir.
- UI vehiculos: 3 paginas + VehiculoForm.tsx.
- Layout dashboard con navegacion (sidebar o menu).
- Links de clientes apuntan a /dashboard/clientes pero ruta real es /clientes.
- Fix encoding BITACORA aplicado en este commit.

**Commits:** 4fa3185 (plan), 41fede8 (clientes backend), fd1d1cf (vehiculos backend), 7316326 (UI clientes), 62e3962 (fix rutas).
## Deuda técnica pendiente

- Renombrar `clientes` a `establecimientos` en el scaffold (F3).
- Decidir estructura final de `app/` con route groups (F3).
- Verificar `@kuatiauto` en redes y DINAPI.
- Registrar `kuatiauto.com.py` cuando el piloto lo justifique.
- Definir contenido exacto del seed del catálogo global (~20-30 servicios/productos) (F6).
## 2026-10-31 — E2a-bis: Supabase real + piloto end-to-end

**Contexto:** sesión larga de conexión real. Se sale del modo mock y se valida el flujo completo contra PostgreSQL real.

**Supabase:**
- Proyecto `kuatiauto` (`wzfukuzcousihslfgelr`, us-east-1, free tier).
- CLI `2.122.0` instalada como devDependency (`supabase`).
- Login con PAT, link al project-ref.
- 15 migraciones aplicadas en orden (001–015) sin errores.
- Migración scaffold `001_clientes.sql` del blueprint web-app movida a `_cuarentena/` (crea tabla `clientes` plural, RLS por user_id — no pertenece a KuatiAuto).
- `lib/supabase/types.ts` generado (83 KB, 27 tablas, 12 funciones).

**Tipos cableados:**
- `@supabase/ssr` de `0.5.2` a `0.12.7` — resuelve el bug de `never` en queries (por `__InternalSupabase.PostgrestVersion: "14.18"`).
- `<Database>` cableado en `server.ts` y `client.ts`.
- 23 errores de `never` resueltos al actualizar `@supabase/ssr`. Quedaron 6 de `null` → `undefined` en params RPC (`directorio-actions.ts`, `empresa-actions.ts`), resueltos con reemplazo quirúrgico.

**Flujo piloto validado end-to-end:**
- Luis María Delvalle Ramírez (`importjapanencar@gmail.com`) creado desde Supabase Dashboard (auto-confirm, sin email — el SMTP de Supabase free no manda a emails fuera del equipo).
- `rol='propietario'`, `nombre` corregido por SQL, `empresa_id` seteado al crear empresa.
- Empresa `Import Japan - Autorepuestos` (`adbcd23e-f296-435c-b835-e9ce837a9d95`) creada vía `crear_empresa_con_establecimiento` (SECURITY DEFINER) desde `/crear-empresa`.
- Cliente `María José Bitar Balletbo` creado vía `crearCliente`, persistido con `empresa_id` correcto.
- `audit_log` registra `crear/empresa` (14:07) y `crear/cliente` (14:19).

**CEO:**
- Pedro José Pirovani (`pirovanipedrojose@gmail.com`) como `admin_general`, `empresa_id=null`. Panel de admin real: Supabase Dashboard (UI `/admin` es E5).

**Reorganización de repos:**
- Studio (`studio-pjpirovani-soft`) limpiado: scripts/, blueprints/, .github/workflows/ retirados. Queda como "documentación + clients". Commit `53ebf93`.
- KuatiAuto movido a `C:\Users\Admin\proyectos\kuatiauto` (fuera del studio). Commit `4adf7aa..6a4d365` pusheado.
- ENC-Logística movida a `C:\Users\Admin\proyectos\enc-logistica`. Sin cambios (ya sincronizado en `0319683`).

**Fixes UI:**
- `/crear-empresa` (form + page) creado. Sin esto, Luis no podía crear empresa.
- `app/(dashboard)/page.tsx` reescrito (sin mojibake, condicional: crear empresa vs gestionar clientes).
- `app/(dashboard)/dashboard/page.tsx` → redirect a `/`.
- Links `/dashboard/clientes` → `/clientes` en 6 archivos (deuda de E2a documentada).

**E2a-bis cerrado:**
- `vehiculoSchema.test.ts`: test `default km_actual a 0` reemplazado por 2 tests (optional + 0 explícito). 13/13 verdes.
- `empresa-actions.ts` reformateado (era 1 línea, ahora legible). Sin mojibake (`Datos inv�lidos` → `Datos inválidos`).
- `ClienteForm.test.tsx` reescrito contra interfaz nueva (action plano, no FormData). 5/5 verdes.
- `rate-limit.test.ts` (nuevo): 8 tests (`buildClave` + `checkRateLimit` con fail-open). 8/8 verdes.
- `empresa-actions.test.ts` (nuevo): 5 tests (`crearEmpresa`: validación Zod, sin sesión, RPC OK, RPC falla). 5/5 verdes.

**Verificación:**
- `npx vitest run`: **89/89** tests verdes (11 archivos).
- `npx tsc --noEmit`: **0 errores**.
- Encoding: 0 BOM, 0 mojibake en archivos nuevos.

**Deuda pendiente (E1 gate):** prueba cruzada A/B contra Supabase real (8-10 del gate).
**Deuda pendiente (E2a):** `empresa_id: null` en `notificaciones-actions.ts` (dejar para cuando se toque notificaciones), trigger `handle_new_user` (mejorar en E2b), `/` vs `/dashboard` (E2b1).

**Commits:** `93c3f9a` (CLI + cuarentena), `6a4d365` (Supabase real + flujo piloto), `[pendiente]` (E2a-bis).

**Lecciones:**
- El SMTP de Supabase free solo manda a emails del equipo. Sin Resend, los signups externos fallan. Workaround: crear usuarios desde Dashboard con "Auto Confirm User".
- `@supabase/ssr@0.5.2` + `supabase-js` moderno → `never` en queries. Actualizar a `0.12.7`.
- PowerShell: `Resolve-Path` falla con `[id]` (wildcards). Usar `Join-Path (Get-Location) $path` + `[System.IO.File]::ReadAllText($full)`.
- Nunca pegar output de comandos en la consola. Nunca pegar TS en la consola.

## Cierre E2b1 — 2026-10-31

**Cerrado:**
- `listarVehiculosEmpresa()` agregada a `lib/vehiculos-actions.ts` (lista global, filtro por empresa).
- `app/(dashboard)/layout.tsx`: sidebar con Panel, Clientes, Vehículos, Directorio (externo) y Logout. Auth check server-side.
- `components/VehiculoForm.tsx`: client component crear/editar con discriminated union (`modo`).
- `/vehiculos` (lista), `/vehiculos/nuevo` (crear), `/vehiculos/[id]` (editar).
- Panel logueado movido a `(dashboard)/dashboard/page.tsx`. `(dashboard)/page.tsx` borrado (colisión con landing `app/page.tsx`).
- Tests de `listarVehiculosEmpresa()`: 3 casos (sin auth, sin empresa, ok). Suite 89 → 92.
- Registro manda `nombre` en `signUp` → `raw_user_meta_data.nombre`. Trigger `handle_new_user` ya lo leía con `coalesce`, no requirió migración SQL.

**Verificación:**
- `npx tsc --noEmit`: 0 errores.
- `npm run build`: OK (11 rutas, incluye las 3 nuevas).
- `npx vitest run`: **92/92** tests verdes (11 archivos).
- Encoding: 0 BOM, 0 mojibake en archivos nuevos y modificados.

**Deuda pendiente:**
- E1 gate 7/10: prueba cruzada A/B contra Supabase real, 2FA del propietario.
- E2a: `empresa_id: null` en `notificaciones-actions.ts` (diferida a E5).
- Sin tests para los cambios de `auth-actions.ts` (register con nombre) — cobertura por integración manual en el próximo registro real.
- `VehiculoForm initialData` compila por structural typing; si crece el schema, ajustar tipo `VehiculoData`.

**Commits:** `6143d08` (feat E2b1), `cbc6af3` (docs E2b1), pendientes al cierre: fix registro + docs cierre completa.

**Lecciones:**
- PowerShell 5.x: `npm test 2>&1` mató el pipeline con `NativeCommandError`. Solución: `cmd /c "npm test > file 2>&1"`.
- `Set-Clipboard` puede fallar silenciosamente por bloqueo del portapapeles. Preferir `Write-Host` del output directo.
- Heredocs `@"..."@` en PowerShell son frágiles con paste. Preferir `$lines = @(...) -join "`r`n"` + `WriteAllText`.
- Nunca pegar TS/output en la consola. Se perdió ~40 min en esta sesión por eso.
- La deuda del trigger `handle_new_user` era realmente del form de registro (no del SQL). Diagnosticar antes de migrar.
- `.next/` cachea types generados. Si `tsc` falla en `.next/dev/types/validator.ts`, borrar `.next` y reintentar.
## Cierre E2b2 sesión 2 — 2026-10-31

**Cerrado:**
- `/ordenes` (lista global por empresa, badge de estado, importe, observaciones trunc).
- `/ordenes/nuevo` (form de creación, precarga de vehículo vía `?vehiculo_id=`).
- `/ordenes/[id]` (form de edición + acciones: completar / anular con motivo / eliminar borrador).
- `components/OrdenLineas.tsx` (servicios y productos, respeta schema real).
- `components/OrdenForm.tsx` (cabecera + líneas, discriminated union `crear | editar`).
- `components/NuevaOrdenClient.tsx` y `components/EditarOrdenClient.tsx` (wrappers cliente que importan server actions).
- `app/(dashboard)/layout.tsx`: link "Órdenes" en sidebar.
- `app/(dashboard)/vehiculos/[id]/page.tsx`: botón "Nueva orden para este vehículo".

**Verificación:**
- `npx tsc --noEmit`: 0 errores.
- `npm run build`: OK (15 rutas, incluye `/ordenes`, `/ordenes/nuevo`, `/ordenes/[id]`).
- `npx vitest run`: 133/133 verdes (13 archivos).
- Encoding: 0 BOM, 0 mojibake en 9 archivos (verificado por bytes + codepoints, no por `Get-Content`).

**Deuda generada:**
- `editarOrden` y `crearOrden` sin transacción real (delete + insert sin rollback). Mitigado con audit log. Deuda aceptada en backend E2b2 sesión 1.
- Inmutabilidad de orden `completada` no bloqueada en backend (solo UI).
- Catálogo global/empresa vacío: seed pendiente E3.
- `any` en helper `mapearOpciones` de las páginas de órdenes (deuda menor de tipado).

**Commits:** `64c6b23` (feat E2b2 UI), `[pendiente]` (docs cierre E2b2 sesión 2).

**Lecciones:**
- **`Get-Content` de PowerShell 5.x en esta máquina miente sobre encoding** (muestra mojibake incluso en archivos UTF-8 limpios). Para verificar encoding: `[System.IO.File]::ReadAllText` + inspección de codepoints, o `ReadAllBytes` y chequeo de BOM. Nunca confiar en `Get-Content` para diagnóstico de encoding.
- **Drift check obligatorio antes de etapas que tocan tablas existentes.** `producto_empresa` apareció a mitad de planificar E2b2 sesión 1. Detectado por suerte. Protocolo ahora exige `supabase migration list --linked` + `supabase db diff --linked --schema public` al inicio de la etapa.
- **`supabase db diff` requiere Docker Desktop corriendo.** En esta máquina, `docker desktop start` arranca el daemon y el named pipe `dockerDesktopLinuxPipe` queda disponible. `Get-Service com.docker.service` falla porque es instalación per-user (no registra servicio de Windows). Normal.
- **`rls_auto_enable` es ruido de Supabase**, no drift real. Es un event trigger que el dashboard instala para habilitar RLS en tablas nuevas. Ignorar en diffs futuros.
- **Heredocs `@"..."@` de PowerShell expanden `$` y backticks.** Para bloques con `${}` o backticks de TS, usar heredoc de comillas simples `@'...'@` o construir con `$lines = @(...) -join`.
- **Pastes duplicados** de bloques largos ocurren con frecuencia en esta sesión. Si pasa, `Ctrl+C` para salir del modo continuación, y verificar con `Get-Item Length` que el archivo final quedó correcto. `WriteAllText` es idempotente, no corrompe.

## Cierre E3 — 2026-10-31

**Cerrado: catálogo local CRUD + seed de marcas/modelos.**

- Backend: `lib/schemas/servicioEmpresaSchema.ts`, `lib/schemas/productoEmpresaSchema.ts`, `lib/servicios-empresa-actions.ts`, `lib/productos-empresa-actions.ts` (listar / obtener / crear / editar). **Sin eliminar** (D-E3a-1).
- Tests: 17 schema + 26 actions = 43 nuevos. Suite 133 → 176.
- UI: `/catalogo` (índice), `/catalogo/servicios` (lista + nuevo + editar), `/catalogo/productos` (lista + nuevo + editar). Link "Catálogo" en sidebar.
- Migración `017_seed_marcas_modelos.sql`: 10 marcas faltantes + 70 modelos populares en Paraguay. Total: 15 fabricantes, 15 marcas, 73 modelos.

**Verificación:**
- `npx tsc --noEmit`: 0 errores.
- `npm test`: 176/176 verdes (17 archivos).
- `npm run build`: OK (22 rutas, incluye las 7 nuevas del catálogo).
- Encoding: 0 BOM, 0 mojibake en 18 archivos.
- `supabase db push`: 017 aplicada y verificada (15/15 fabricantes con marca, 73 modelos).

**Deuda generada:**
- Soft-delete de catálogo local: falta migración 018 con columna `activo` + actions `eliminarX`.
- Catálogo técnico profundo (versiones, motorizaciones, especificaciones): vacío, deuda v2.
- Productos globales con `marca = [PENDIENTE]`: requiere verificación real, deuda v2.
- Stock: solo columnas `stock_actual`/`stock_minimo`; UI de movimientos pendiente.

**Commits:** `b399b28` (feat E3), `[pendiente]` (docs cierre E3).

**Lecciones:**
- La tabla `servicio_empresa` es más simple de lo que el resumen mental asumía: solo `nombre + descripcion`, sin `precio_base` ni `activo`. Leer `types.ts` de las tablas involucradas **antes** de planificar, no confiar en resúmenes.
- `orden_servicio` y `orden_producto` tienen las columnas FK (`servicio_empresa_id`, etc.) **sin FK declarada** en la migración (comentario en `005_orden_trabajo.sql` dice "se agregan en 005b o 006" pero nunca se agregaron). La DB real sí las tiene (probablemente aplicadas a mano vía dashboard). No bloquea hoy, pero deuda de housekeeping.
- `supabase db query --linked` es el comando correcto para queries ad-hoc (no `db execute`).
- Heredocs `@'...'@` de PowerShell insertan LF, no CRLF. Si el archivo destino tiene CRLF, el `.Replace()` falla silenciosamente. Solución: construir strings con `[char]13 + [char]10` o comparar por líneas, no por bloques.

## Prueba cruzada A/B — 2026-10-31

**Gate E1 cruzado cerrado (punto 8-10).**

Setup:
- Usuario A: `importjapanencar@gmail.com` (Luis, Import Japan). Password: `ImportJapan-2026` (recordada en esta sesión).
- Usuario B: `test-b-user@example.com` (Taller Prueba B). Creado vía Auth Admin API con `sb_secret_` y `User-Agent: kua­ti­auto-script/1.0` (evita el bloqueo "Forbidden use of secret API key in browser").
- Empresa B + cliente B: creados vía SQL directo (`supabase db query --file`). IDs documentados en STATUS.md.

Pruebas ejecutadas:
1. Login A y login B (ventanas separadas) → cada uno ve solo sus propios clientes.
2. B → URL directa `localhost:3000/clientes/<id-cliente-A>` → "Cliente no encontrado." ✅
3. A → URL directa `localhost:3000/clientes/<id-cliente-B>` → "Cliente no encontrado." ✅

**Resultado:** RLS aísla correctamente. Gate E1 pasa de 7/10 a 9/10. Falta solo 2FA del propietario para el 10/10.

**Lecciones:**
- Las nuevas API keys de Supabase (`sb_publishable_`, `sb_secret_`) **no son JWT**. El header `Authorization: Bearer <key>` falla si se usa con ellas en endpoints de Auth. La key va solo en `apikey`. Para REST queries con JWT de usuario, `apikey` = publishable, `Authorization` = JWT del usuario.
- La `sb_secret_` solo funciona fuera del navegador (User-Agent de script). Desde Chrome DevTools, Supabase la rechaza con "Forbidden use of secret API key in browser". Usar PowerShell/curl con User-Agent custom.
- La prueba cruzada real se hace en la UI (login A, login B, intentar acceder por URL), no con scripts que peleen con keys. Fue más rápido y confiable.
- Crear usuarios de prueba: Auth Admin API (`POST /auth/v1/admin/users`) + SQL para vincular a empresa. Reutilizable para futuras pruebas cruzadas.
- Password de Luis: `ImportJapan-2026`. Guardar en gestor de contraseñas del propietario.

## Cierre E4a — 2026-10-31

**Cerrado: directorio publico + establecimientos publicos. Gate 10/10.**

- Migracion `018_establecimiento_publico.sql`: revoke all on establecimiento_publico from anon + grant select to anon (H-E4a-1).
- `lib/schemas/establecimientoSchema.ts` + 16 tests.
- `lib/establecimiento-actions.ts` (listar, obtener, crear, editar, publicarMiEstablecimiento) + 20 tests.
- `components/EstablecimientoForm.tsx` + `components/PublicarButton.tsx`.
- `app/(dashboard)/establecimientos/{page,nuevo/page,[id]/page}.tsx`.
- Link "Establecimientos" en sidebar.
- `lib/directorio-actions.ts` + `directorioSchema.ts`: rename establecimiento_id -> establecimiento_publico_id.
- `app/directorio/page.tsx`: `await searchParams` (Next 16).

**Hallazgos:**

| ID | Severidad | Descripcion | Estado |
|---|---|---|---|
| H-E4a-1 | Alto | anon con GRANT ALL en establecimiento_publico | Corregido en 018 |
| H-E4a-2 | Bajo | UI /establecimientos no oculta Nuevo para admin_general | Diferido a E5 |
| H-E4a-3 | Medio | editarEstablecimiento no creaba fila publica si no existia | Corregido con upsert |
| H-E4a-4 | Alto | params.id sin await en establecimientos/[id] -> 404 | Corregido |
| H-E4a-5 | Alto | auditar params/searchParams en todas las paginas | Verificado: 8/8 con await |
| H-E4a-6 | - | falsa alarma coordenadas con coma | Descartado |
| H-E4a-7 | Medio | directorio arranca en Asuncion sin selector de ciudad | Diferido a E4b/E5 |
| H-E4a-8 | Alto | searchParams sin await en /directorio -> defaults silenciosos | Corregido |

**Prueba cruzada A/B (gate punto 9):**

| # | Prueba | Resultado |
|---|---|---|
| 1 | A crea/edita establecimiento | OK |
| 2 | A publica | OK |
| 3 | B crea, no ve el de A | OK |
| 4 | B -> URL de A -> 404 | OK |
| 5 | A -> URL de B -> 404 | OK |
| 6 | Directorio publico muestra A (publicado) | OK |
| 7 | Despublicar A -> desaparece | OK |

**Verificacion:** `tsc --noEmit` 0 errores, `npm test` 212/212, `npm run build` OK (25 rutas). Migracion 018 aplicada y verificada contra DB real (anon solo SELECT).

**Lecciones:**

- Next 16: `params` y `searchParams` son Promise. Sin `await`, dan error o defaults silenciosos. Cualquier pagina nueva debe `await params` / `await searchParams`.
- `upsert` con `onConflict` es la forma correcta de asegurar fila hija cuando no existe. `update` afecta 0 filas y devuelve `ok: true` silenciosamente.
- Vitest 5: `vi.clearAllMocks()` NO limpia las colas de `mockResolvedValueOnce`. Usar `vi.resetAllMocks()` + re-setear mocks base en `beforeEach`.
- Supabase por defecto otorga GRANT ALL a `anon` en tablas nuevas. Toda migracion que cree tablas publicas debe revocar explicitamente.
- El directorio publico necesita coordenadas; si `lat_aproximada` es NULL, la fila no aparece aunque este publicada.

## Cierre E1 — 2026-11-01

**E1 (auth completo + multiempresa + shell + rate limit + audit) cerrada. Gate 10/10.**

- Prueba cruzada A/B completada el 2026-10-31 (aislamiento RLS verificado).
- Punto 10 del gate: 2FA activada en el gestor de contrasenas del propietario (Bitwarden, 2026-11-01).
- No hubo cambios de codigo en este cierre: solo se cumplio la accion externa pendiente.

**Estado final E1:** 212/212 tests, tsc 0, build OK (25 rutas). Prueba cruzada A/B 7/7.

## Cierre E3 — 2026-11-01

**E3 (Catálogo global + local) cerrada. Gate 10/10.**

- Prueba cruzada A/B: Empresa A creó "Servicio Test A" y Empresa B "Servicio Test B".
- Listado en UI: A solo ve su servicio, B no aparece en la lista.
- Acceso directo por URL (IDOR) a `/catalogo/servicios/<id-de-B>` estando como A: devuelve 404. Aislamiento RLS correcto.
- Datos de prueba eliminados de la DB tras la validación.

**Estado final E3:** 212/212 tests, tsc 0, build OK. RLS validada en UI y DB.

## Cierre E2b2 — 2026-11-01

**E2b2 (Órdenes de trabajo + UI) cerrada. Gate 10/10.**

- Prueba cruzada A/B: se crearon órdenes de prueba para Empresa A y B.
- Listado en UI: Luis solo ve la orden de su empresa (Orden Test A).
- Acceso directo por URL (IDOR) a la orden de B: devuelve 404.
- Datos de prueba eliminados tras la validación.

**Deudas aceptadas (no bloquean el gate):**
- `editarOrden` y `crearOrden` sin transacción SQL real (delete + insert). Mitigado con audit_log. Se migrará a RPC en futura sesión si hay bug.
- Inmutabilidad de orden `completada` bloqueada solo en UI, no en backend.

**Estado final E2b2:** 212/212 tests, tsc 0, build OK (25 rutas).

## E4b (wip) — 2026-11-01

**Portal del conductor: backend + UI creados. Pendiente prueba cruzada por caida de Supabase (502).**

- Migracion `019_historial_compartido_consentimiento.sql`: autorizado default false + 3 funciones SECURITY DEFINER (proponer, aceptar, revocar).
- Backend: `lib/conductor-actions.ts` + `conductorSchema.ts`.
- UI: `(portal)/layout.tsx` + `/mi-garage`, `/mi-garage/vehiculos`, `/mi-garage/historial`, `register-conductor`.
- Componentes: `VehiculoConductorForm`, `ProponerHistorialForm`.
- Fix: login redirige a `/mi-garage` si el usuario es conductor (antes caia en `/clientes`).

**Lecciones:**
- Supabase API keys nuevas (`sb_secret_`) van solo en `apikey`, sin `Authorization: Bearer`.
- Crear usuarios con contraseña por Auth Admin API (`/auth/v1/admin/users`). SQL directo no hashea bien.
- Supabase free tier puede dar 502 temporal. Reintentar.

## Cierre E4b — 2026-11-01

**Portal del conductor cerrado. Gate 10/10.**

- **Integracion UI cerrada en esta sesion:**
  - `ProponerHistorialForm` importado y renderizado en `/vehiculos/[id]` (empresa propone historial al conductor).
  - `HistorialAccionesClient` (nuevo componente) con botones Aceptar/Revocar, integrado en `/mi-garage/historial`.
- **Fix de paso:** el `href` de `/ordenes/nuevo?vehiculo_id=` en `/vehiculos/[id]` habia perdido el `{vehiculo.id}` en E2b2. Corregido.
- **Bug de escritura resuelto durante la sesion:** `Set-Content`/`WriteAllLines` con strings de comillas simples en un array multilinea puede perder la **primera** comilla simple del archivo (caso real: `'use client';` se escribio como `use client`;). Workaround: detectar con `.StartsWith('use client')` y reparar con `[char]39`.

**Prueba cruzada A/B (2026-11-01, DB real):**

| # | Paso | Resultado |
|---|---|---|
| 1 | Login conductor2 -> redirige a /mi-garage (no /clientes) | OK |
| 2 | `/mi-garage/vehiculos` muestra Fiat Uno (2015) TEST-CON2 | OK |
| 3 | `/mi-garage/historial` muestra 'Ningun taller ha solicitado acceso' (vacio) | OK |
| 4 | Luis propone via `ProponerHistorialForm` -> token generado | OK |
| 5 | DB: fila en `historial_compartido` con `autorizado=false` | OK |
| 6 | Conductor2 recarga -> ve 'Pendiente de autorizacion' + boton 'Aceptar' | OK |
| 7 | Conductor2 Aceptar -> estado 'Autorizado' + boton 'Revocar'; DB `autorizado=true` | OK |
| 8 | Conductor2 Revocar -> vuelve a 'Pendiente'; DB `autorizado=false` | OK |

**Hallazgos:**

| ID | Severidad | Descripcion | Estado |
|---|---|---|---|
| H-E4b-1 | Bajo (UX) | Form de login deja el boton sin feedback ~3s durante server action | Diferido a E5 |
| H-E4b-2 | Medio (cosmetico) | `/mi-garage/historial` muestra 'Taller' y 'Vehiculo:' vacios. Causa: RLS bloquea join anidado `empresa:empresa_id(nombre)` en PostgREST (conductor no pertenece a empresa). Datos criticos (autorizado, token) OK. Fix: migracion 020 con denormalizacion o RPC `listar_historial_compartido()` SECURITY DEFINER | A sesion corta posterior |
| D-E4b-1 | Deuda UX | Precargar email del cliente dueño en `ProponerHistorialForm` si existe | E5/v2 |

**Verificacion:** 212/212 tests, tsc 0, build OK (25 rutas). Encoding limpio.

**Lecciones:**

- **RLS en joins anidados de PostgREST falla silenciosamente:** si el usuario autenticado no puede SELECT en la tabla relacionada, el join devuelve `null` sin error. No es un bug de PostgREST, es RLS haciendo su trabajo. Los datos que el usuario necesita ver deben estar denormalizados en la tabla puente o accederse via SECURITY DEFINER.
- **`supabase db query --linked` con UNION ALL funciona** para chequear dos tablas en una query (usado para verificar `conductor` + `usuario` en un solo paso).
- **`[System.IO.File]::ReadAllBytes(C:\Users\Admin\proyectos\kuatiauto\docs\proyecto\BITACORA.md)[0..2]` es el chequeo de BOM mas confiable** en PS 5.x (`Get-Content` miente sobre encoding, como ya documentado en E2b2).
- **`[char]39`** es la forma segura de meter una comilla simple en strings de PowerShell sin pelear con el parser.

## Fix H-E4b-2 — 2026-11-01

**Fix del display vacio de taller/vehiculo en /mi-garage/historial.**

**Causa:** el select() con joins anidados (empresa:empresa_id(nombre), vehiculo:vehiculo_empresa_id(marca, modelo)) devolvia null silenciosamente. PostgREST aplica RLS del usuario actual a los joins anidados, y el conductor no pertenece a la empresa, asi que las policies de empresa y vehiculo bloquean la lectura sin tirar error.

**Fix:**

- Migracion 020_listar_historial_compartido.sql: RPC SECURITY DEFINER con search_path controlado. Solo devuelve los campos necesarios (nombre_empresa, vehiculo_marca, vehiculo_modelo, vehiculo_anio, vehiculo_patente). GRANT EXECUTE solo a authenticated, revoke de public.
- lib/conductor-actions.ts: listarHistorialCompartido() usa la RPC en lugar de joins anidados.
- app/(portal)/mi-garage/historial/page.tsx: campos cambiados a nombre_empresa, vehiculo_marca, vehiculo_modelo.
- lib/supabase/types.ts: regenerado (incluye la funcion nueva). En PS 5.x, supabase gen types produce UTF-16 LE con BOM al redirigir; re-guardado a UTF-8 sin BOM con WriteAllText.

**Verificacion:**

- Funcion creada con security_type = DEFINER (query a information_schema.routines).
- UI: /mi-garage/historial muestra 'Import Japan - Autorepuestos' y 'Vehículo: Toyota Ractis' correctamente.
- Flujo aceptar -> revocar sigue funcionando tras el cambio a RPC.
- 212/212 tests, tsc 0, build OK (25 rutas).

**Lecciones:**

- RLS bloquea joins anidados en PostgREST silenciosamente. Si necesitas datos de tablas donde el usuario autenticado no tiene SELECT, la solucion es SECURITY DEFINER con search_path controlado (no desactivar RLS).
- Set-Content / WriteAllLines con strings de comillas simples en array multilinea puede perder la PRIMERA comilla simple del archivo. Patron para reescribir archivos: WriteAllText con heredoc simple (comillas simples).
- supabase gen types > file en PS 5.x produce UTF-16 LE con BOM. Re-guardar con ReadAllText + WriteAllText + UTF8Encoding(false) para normalizar.
- List.Add con backticks dobles () los comen: en PS el backtick es escape, asi que doble backtick = un backtick literal. Para CHANGELOG/BITACORA con code inline, mejor evitar backticks o usar [char]96.


## Cierre E5a — 2026-11-02

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

**Verificacion:** 212/212 tests, tsc 0, build OK (25 rutas). Envio real OK (mock=false).

**Lecciones:**

- PS 5.x: comandos con ReadAllText + regex anidados rompen el parser; usar variables intermedias.
- Add-Content -Encoding UTF8 en PS 5.x no agrega BOM; WriteAllText con UTF8Encoding(false) es mas confiable.
- tsx como devDependency: util para scripts sueltos (envio directo contra API).
- process.exit en tsx/Windows genera Assertion failed al cerrar, pero el proceso termino OK.

## Cierre E5b (wip) — 2026-11-02

**Panel admin: dashboard funcional. Wip, faltan listas de entidades.**

- lib/auth-actions.ts: redirect post-login. Orden: admin_general -> /admin, conductor -> /mi-garage, sin empresa -> /crear-empresa, con empresa -> /clientes. Fix adicional: usuarios sin empresa ahora van a /crear-empresa (antes caian en /clientes).
- app/(admin)/layout.tsx: auth check server-side. notFound() si no es admin_general. Sidebar con link Panel + logout via server action. Links Empresas/Usuarios/Catalogo retirados del sidebar (rutas no existentes) con TODO para E5b-futuro.
- app/(admin)/admin/page.tsx: dashboard con 4 contadores (empresas, usuarios, establecimientos publicados, ordenes).
- lib/admin-actions.ts: obtenerContadoresAdmin(). Usa createClient() con RLS: is_admin_general() ya esta en las policies de empresa y usuario, no hizo falta service_role.

**Verificacion:** login como pirovanipedrojose@gmail.com -> /admin. Contadores reales: Empresas 2, Usuarios 5, Establecimientos publicados 0, Ordenes 0. tsc 0, build OK (26 rutas, incluye /admin).

**Pendiente (E5b-futuro):** /admin/empresas, /admin/usuarios, /admin/catalogo, links del sidebar.


## E5b-futuro parte 1 — 2026-11-02

**Panel admin: /admin/empresas (lista + detalle). Fix de bug de RLS en contadores (H-E5b-2).**

**Hallazgo H-E5b-2 (alto, funcional, corregido):**
- Las policies SELECT de cliente, vehiculo, orden_trabajo y establecimiento son SOLO `empresa_id = current_empresa_id()`. Para admin_general, `current_empresa_id()` es NULL, asi que las 4 tablas devolvian 0 filas con `createClient()` (RLS). Los contadores del dashboard mostraban "0 establecimientos publicados" y "0 ordenes" cuando en realidad habia datos.
- Verificado: `select count(*) from cliente` = 2, `from vehiculo` = 1, mientras el dashboard reportaba 0.
- Fix: `obtenerContadoresAdmin`, `listarEmpresasAdmin` y `obtenerEmpresaAdmin` usan `createAdminClient()` (service_role) DESPUES del check de rol admin_general. No se toca el auth check (sigue con createClient + RLS).

**Codigo nuevo:**
- lib/admin-actions.ts reescrito: helper `requireAdmin()`, `obtenerContadoresAdmin()` (fix), `listarEmpresasAdmin(filtroEstado?)` (contadores agrupados por empresa_id, sin N+1), `obtenerEmpresaAdmin(id)` (detalle + establecimientos + usuarios).
- app/(admin)/admin/empresas/page.tsx: lista con filtro por estado (Todas / Activas / Desactivadas), badge activa/desactivada, contadores por columna, link al detalle.
- app/(admin)/admin/empresas/[id]/page.tsx: detalle con datos, 5 contadores, tabla de usuarios y tabla de establecimientos. `await params` (Next 16). `notFound()` si la empresa no existe.
- app/(admin)/layout.tsx: link "Empresas" agregado al NAV. Mojibake corregido (`Cerrar sesiÃ³n` -> `Cerrar sesión`).

**Verificacion:**
- 221/221 tests verdes (20 archivos, +9 nuevos en lib/admin-actions.test.ts).
- tsc --noEmit: exit 0.
- npm run build: OK, incluye /admin, /admin/empresas, /admin/empresas/[id].

**Pendiente (E5b-futuro parte 2):**
- /admin/usuarios: lista + cambio de rol / desactivacion.
- /admin/catalogo: moderacion de servicio_global y producto_global.
- Link "Usuarios" y "Catalogo" en el sidebar admin.

**Lecciones:**
- RLS en tablas de negocio (cliente, vehiculo, orden_trabajo, establecimiento) excluye a admin_general. Cualquier vista admin que cuente esas tablas debe usar service_role, previo check de rol.
- Promise.all con chains mockeados: el orden de invocacion no es determinista. Para mocks de chains duales (count vs list), distinguir por el primer arg de `select()` (string `*` = count), no por contador de invocaciones.
- `order()` tambien debe respetar el dual-chain: si el codigo hace `.select(...).eq(...).order(...)`, el resultado final viene de `order`, no de `then`.
- select() como vi.fn que captura el primer arg permite discriminar entre count y list en el mismo chain.
## E5b-futuro parte 2 — 2026-11-02

**Panel admin: /admin/usuarios (lista + cambio de rol + activar/desactivar).**

**Codigo nuevo:**
- lib/admin-actions.ts extendido: `listarUsuariosAdmin(filtroRol?)`, `cambiarRolUsuario(userId, nuevoRol)`, `desactivarUsuario(userId, activo)`. Tipos `UsuarioAdminRow`, `RolAsignable` (propietario/empleado/conductor; admin_general excluido de la UI).
- components/UsuarioAccionesClient.tsx: client component con select de rol + boton desactivar/reactivar. `useTransition` + manejo de error inline. Excluye al propio usuario y a admin_general.
- app/(admin)/admin/usuarios/page.tsx: tabla con filtro por rol (Todos/Admin general/Propietario/Empleado/Conductor), badge activo/inactivo, link a /admin/empresas/[id] en la columna empresa.
- app/(admin)/layout.tsx: link "Usuarios" agregado.

**Reglas de negocio implementadas:**
- No se puede cambiar el propio rol (auto-modificacion bloqueada).
- No se puede cambiar el rol de un admin_general desde la UI (solo SQL).
- No se puede desactivar la propia cuenta.
- No se puede desactivar al ultimo admin_general activo (count check).

**Verificacion:**
- 233/233 tests verdes (21 archivos, +12 nuevos en lib/admin-usuarios-actions.test.ts).
- tsc --noEmit: exit 0.
- npm run build: OK, incluye /admin/usuarios.

**Pendiente (E5b-futuro parte 3):**
- /admin/catalogo: moderacion de servicio_global y producto_global.
- Link "Catalogo" en el sidebar.

**Lecciones:**
- PowerShell: backticks de escape (\`r\`n) NO se interpretan en strings con comillas simples, solo en comillas dobles. Para construir lineas con salto embebido, usar comillas dobles y escapar las internas con backtick.
- Tests aislados en archivo propio (admin-usuarios-actions.test.ts) en vez de extender admin-actions.test.ts: evita riesgo de romper tests verdes y permite iterar sin tocar el mock base.
## E5b-futuro parte 3a — 2026-11-02

**Catalogo global: servicios (CRUD).**

**Codigo nuevo:**
- lib/schemas/catalogoGlobalSchema.ts: Zod para crear/editar servicios globales (nombre 2-120, descripcion opcional, intervalos km/meses positivos).
- lib/admin-actions.ts extendido: listarServiciosGlobalesAdmin, obtenerServicioGlobalAdmin, crearServicioGlobal, editarServicioGlobal, eliminarServicioGlobal. Tipos ServicioGlobalRow y resultados.
- components/ServicioGlobalForm.tsx: client component crear/editar con validacion nativa + Zod server-side. useTransition.
- components/EliminarServicioGlobalButton.tsx: client component con confirm + alert.
- app/(admin)/admin/catalogo/page.tsx: indice con 2 cards (servicios, productos).
- app/(admin)/admin/catalogo/servicios/page.tsx: lista con badge de intervalos y boton Eliminar.
- app/(admin)/admin/catalogo/servicios/nuevo/page.tsx + [id]/page.tsx: crear/editar.
- Link "Catalogo" en app/(admin)/layout.tsx.

**Decisiones tomadas:**
- CRUD sin columna `activo` (no existe en el schema). Eliminar es delete real, con confirm. Deuda: si hace falta despublicar sin borrar, migracion 021 con activo.
- El form usa validacion HTML nativa (required, minLength, maxLength) + validacion server-side en la action. Sin Zod en el cliente (no se reenvia el schema al bundle).
- `requireAdmin()` reutilizado en las 5 actions.

**Verificacion:**
- 257/257 tests verdes (23 archivos, +24 nuevos: 11 schema + 13 actions).
- tsc --noEmit: exit 0.
- npm run build: OK (8 rutas admin, incluye /admin/catalogo/servicios/nuevo y /[id]).

**Pendiente (E5b-futuro parte 3b):**
- /admin/catalogo/productos: CRUD completo (marca, tipo, viscosidad).
- Link "Productos" ya esta en el indice de catalogo.

**Lecciones:**
- `supabase gen types` con `Test-Path`/`Select-String` sin `-LiteralPath` falla con `[id]` como wildcard. Usar `-LiteralPath` siempre en paths con corchetes.
- Test-Path con paths `[id]` retorna False aunque el directorio exista. Usar `[System.IO.Directory]::Exists` para verificar.
- `confirm()` y `alert()` en client components funcionan sin configuración extra (solo en handler, no en render).
## E5b-futuro parte 3b — 2026-11-02

**Catalogo global: productos (CRUD). E5b-futuro completo.**

**Codigo nuevo:**
- lib/schemas/catalogoGlobalSchema.ts extendido: crearProductoGlobalSchema, editarProductoGlobalSchema, productoGlobalIdSchema (nombre 2-120, marca/tipo 80, viscosidad 40, todos opcionales salvo nombre).
- lib/admin-actions.ts extendido: listarProductosGlobalesAdmin, obtenerProductoGlobalAdmin, crearProductoGlobal, editarProductoGlobal, eliminarProductoGlobal. Tipo ProductoGlobalRow.
- components/ProductoGlobalForm.tsx: client form crear/editar con marca, tipo, viscosidad.
- components/EliminarProductoGlobalButton.tsx: client boton con confirm.
- app/(admin)/admin/catalogo/productos/page.tsx + nuevo/page.tsx + [id]/page.tsx.
- lib/schemas/catalogoGlobalSchema.test.ts extendido (+9 tests de productos, total 20).
- lib/admin-catalogo-productos-actions.test.ts: 11 tests.

**Verificacion:**
- 277/277 tests verdes (24 archivos, +20 nuevos).
- tsc --noEmit: exit 0.
- npm run build: OK (7 rutas de catalogo, panel admin completo).

**Estado E5b-futuro:** CERRADO. /admin/empresas, /admin/usuarios, /admin/catalogo/servicios, /admin/catalogo/productos. Todos con tests y build verde.

**Pendiente inmediato:** smoke test manual del panel admin en navegador (crear/editar/eliminar servicio y producto, verificar el flujo end-to-end con pirovanipedrojose@gmail.com). Después: E5c (Sentry + Vercel Analytics + backups).

**Lecciones:**
- Replicar un patron (CRUD servicio -> CRUD producto) es mecanico, pero conviene escribir el segundo archivo completo en vez de "adaptar" el primero con replace. El riesgo de tipeo silencioso es bajo y el diff es mas legible.
- El patron de mock de Supabase con `makeChain` y flags `insert/update/delete/order/maybeSingle` escala bien para CRUD. Reutilizar entre archivos de test.
- `confirm()`/`alert()` requieren que el handler este en un client component, pero no bloquean el `useTransition`. Si el usuario cancela, no hay state change.

## Cierre E5b  2026-11-02

**Panel admin cerrado. Smoke test manual completo en navegador.**

**Pasos del smoke test (todos verdes):**
- A (login/nav): A1 redirect a /admin, A2 sidebar completo, A3 contadores reales, A4 logo.
- B (/admin/empresas): B1 lista 2 empresas, B2 filtro por estado, B3 badges, B4 detalle con contadores + usuarios + establecimientos, B5 404 con UUID inexistente, B6 filtro se resetea al volver.
- C (/admin/usuarios): C1 lista 5 usuarios, C2 filtro por rol, C3 auto-mod bloqueada, C4 admin_general bloqueado, C5 cambio de rol persiste.
- D (/admin/catalogo/servicios): D1 listar 10 servicios, D2 crear, D3 editar, D4 eliminar con confirm, D5 validacion HTML5 nombre <2, D6 validacion HTML5 intervalo <1.
- E (/admin/catalogo/productos): E1 listar 8 productos, E2 crear con marca/tipo/viscosidad, E3 editar marca, E4 eliminar, E5 validacion HTML5, E6 404 con UUID inexistente.
- F (cierre): F1 logout, F2 re-login redirect a /admin, F3 console sin errores rojos, F4 network sin 4xx/5xx inesperados.

**Hallazgo H-E5b-3 (alto, integridad de datos) - detectado y resuelto en sesion:**
- Sintoma: conductor2@example.com y conductor-test@example.com aparecian con rol='empleado' en la DB y empresa_id=null (estado inconsistente: empleado sin empresa rompe RLS y redirects post-login).
- Causa raiz: el select de roles en /admin/usuarios caia a "empleado" (primera opcion) cuando el rol actual no matcheaba ninguna opcion. Alguna sesion previa persistio ese cambio.
- Fix en 4 piezas:
  1. DB: UPDATE usuario SET rol='conductor' WHERE email IN ('conductor2@example.com','conductor-test@example.com'). Verificado con SELECT.
  2. Cliente (UsuarioAccionesClient.tsx): si empresaId === null, NO se renderea select; se muestra texto plano "conductor (sin empresa)".
  3. Backend (cambiarRolUsuario en lib/admin-actions.ts): se agrega lectura de empresa_id en el SELECT y se valida invariante - propietario/empleado requieren empresa_id; conductor requiere empresa_id=null. Errores explicitos.
  4. Tests: +2 tests en lib/admin-usuarios-actions.test.ts (rechazo propietario/empleado sin empresa, rechazo conductor con empresa). Total 279/279 verdes.
- tsc --noEmit: 0 errores.

**Hallazgo H-E5b-4 (bajo, backlog):**
- Inconsistencia HTML min="1" vs Zod min(0) en intervalo_km / intervalo_meses de servicios globales. No es bug funcional: el HTML es mas estricto, el server nunca recibe 0. Se decide dejar como esta o alinear en E5c/v2.

**Lecciones:**
- Selects con defaultValue/primera opcion fallback: NUNCA renderea un select cuando el valor actual no matchea. Es un bug silencioso que se persiste con cualquier onChange.
- Invariantes de rol: propietario/empleado => empresa_id NOT NULL, conductor => empresa_id NULL. Validar en backend (no solo en UI) y con tests.
- El smoke test manual encontro un bug real que los 277 tests unitarios no podian detectar. Justifica el gate de 10 puntos.
- Turbopack a veces necesita hard reload (Ctrl+F5) para reflejar cambios de client components que no se recompilaron.
---
## 2026-11-02 — Fase E5c (Observabilidad y Backups)
- **E5c-1:** Instalado `@vercel/analytics`, montado en el root layout.
- **E5c-2:** Wizard de Sentry ejecutado. Reescritos `instrumentation-client.ts`, `sentry.server.config.ts` y `sentry.edge.config.ts` para usar env vars (`SENTRY_DSN`) en vez del DSN hardcodeado. Corregido `lang="es"` en `app/global-error.tsx`. Build y `tsc` verdes.
- **E5c-3:** Creado workflow de backup. Debuggeado el error `password authentication failed` (era el usuario del pooler y los corchetes en el string). Workflow #2 corrió en verde.

---

## 2026-11-02 — Fase D (Playwright E2E, smokes contra prod)

**Setup Playwright + 6 smokes verdes contra producción.** La fase D arranca con cobertura read-only de los 4 roles + 2 pantallas clave. Flows de escritura y CI quedan para la próxima sesión.

**Setup:**
- `@playwright/test` y `dotenv` instalados como devDependencies.
- `playwright.config.ts` con 2 projects: `smoke-prod` (kuatiauto.vercel.app) y `flows-local` (localhost:3000, aún sin tests).
- Decisiones aplicadas del dump y DECISIONES.md: `serviceWorkers: 'block'` por SW v2 (Fase E8), `workers: 1` en smoke-prod por rate limit D-F4-3 (5/min), `locale: es-PY`, `timezoneId: America/Asuncion`, retries 2 solo en CI, trace/screenshot/video en fallo.
- `e2e/fixtures/auth.ts`: helpers `loginAs(page, email, password)` y `getCreds(prefix)` que lee `process.env`.
- `.env.e2e.local` con credenciales de los 4 usuarios (gitignored por `.env.*.local`).
- `.gitignore` extendido: `e2e/.auth/`, `e2e/report/`, `e2e/test-results/`, `e2e/blob-report/`, `playwright-report/`, `test-results/`, `playwright_out.txt`.

**Smokes (6 tests, 18.1s total, todos verdes):**
- `login-propietario` → `/clientes`
- `login-propietario-b` → `/clientes` (aislamiento A/B básico)
- `login-admin` → `/admin`
- `login-conductor` → `/mi-garage`
- `analytics-admin` → `/admin/analytics` (heading "Métricas Globales")
- `dashboard-propietario` → `/dashboard` (heading "Panel Principal")

**Verificación:**
- 6/6 smokes passed contra prod.
- `npx tsc --noEmit`: sin errores.
- Rate limit 5/min no bloqueó los 6 logins en 18s.

**Hallazgos / ajustes en sesión:**
- 1er intento del smoke conductor falló por strict mode violation: el regex `/garage|vehículo|vehiculo|historial/i` matcheaba 2 headings (`<h2>Mis Vehículos</h2>` y `<h2>Historial Compartido</h2>`). Fix: `/^Mis Vehículos$/i` (heading exacto). Lección: siempre anclar regex de heading con `^...$` para evitar strict mode.
- Falta de `dotenv`: Playwright no carga `.env.*` automáticamente. Instalado + configurado en `playwright.config.ts` con `loadEnv({ path: ".env.e2e.local" })`.

**Lecciones PowerShell 5.x (nuevas):**
- **`[System.IO.File]::ReadAllText/WriteAllText/AppendAllText` NO resuelven paths relativos contra `$PWD` de PowerShell.** Usan `[System.Environment]::CurrentDirectory`, que es `C:\Users\<user>` por default. Fix: `Join-Path $PWD.Path "docs\proyecto\ARCHIVO.md"` para path absoluto. Sin esto, falla con "No se puede encontrar una parte de la ruta de acceso".
- **`Start-Job { ... }` multilínea se cuelga en PS 5.x con paste largo.** Fallback: `cmd /c "comando > out.txt 2>&1"` en una sola línea.
- **Cuando el prompt muestra `>>` residual**, Ctrl+C antes de pegar el próximo comando. Pasar output pegado como si fuera comando genera 6-10 errores rojos de "término no reconocido" (cosmético, no daña archivos).
- Los smokes contra prod tardan ~2-4s cada uno (SSR Next 16 + Lambda caliente). El primer run en frío tardó 6.5s.

**Pendiente próxima sesión:**
- Flows de escritura contra Supabase local: `registro → empresa → establecimiento → publicar → directorio`. Requiere setup de Supabase local + seed de usuarios.
- CI GitHub Actions: smokes en cada PR, flows solo en `main`.
- ADR-007 (Playwright) y ADR-008 (Fase E8) en `DECISIONES.md`.
- `STATUS.md` y `SESSION-STATE.md` están desactualizados (fechados 2026-10-31 y 2026-11-01, no reflejan v0.4.2 ni los smokes E2E).
---

## 2026-11-02 — Cierre formal de D parcial (CI verde + v0.4.3)

**D parcial cerrada formalmente.** CI en GitHub Actions verde, tag `v0.4.3` pusheado.

**Commits finales:**
- `de40447` — setup Playwright + 6 smokes + docs (16 files).
- `4f5f0e7` — workflow `e2e-smoke.yml` (55 lines).
- `163e40e` — alineación a Node 22 (engines + nvmrc + CI). CI verde.

**Tag `v0.4.3`** (2026-11-02): smokes E2E + CI + Node 22.

**CI en GitHub Actions (verde):**
- Workflow: `.github/workflows/e2e-smoke.yml`.
- Trigger: push a main, PR a main, workflow_dispatch.
- Node 22, `npm ci`, `npx playwright install --with-deps chromium`.
- 10 secrets configurados (via `gh secret set -f github_secrets.env`).
- Run #3 (`163e40e`): ✅ 6/6 smokes passed, 2m 6s.

**Fix de Node 22 (lección):**
- `npm ci` fallaba con ~20 warnings de `EBADENGINE` en Node 20 porque `@supabase/*`, `vitest@5`, `jsdom@30` requieren Node 22.
- `.nvmrc` decía `20`, `package.json` no tenía `engines` (inconsistente con deps reales).
- Fix: `.nvmrc` → `22`, `package.json` + `engines: { node: ">=22" }`, workflow `node-version: 22`.
- **Nota:** `npm run build` local sigue teniendo un cuelgue en `runAfterProductionCompile` (Sentry probablemente). **No es bloqueante:** Vercel compila con Node 22 y el CI no usa build local.

**Lecciones nuevas (críticas):**
- **`[System.IO.File]::WriteAllText` + `UTF8Encoding(false)`** es el único método confiable en PS 5.x para escribir archivos que otras herramientas (gh, git) van a leer sin BOM. `Out-File -Encoding UTF8` **agrega BOM** → `gh secret set -f` falla con `unexpected character "»"`.
- **`gh secret set -f archivo.env`** requiere que el archivo exista en el CWD. Si se borra antes, falla con `file not found`.
- **Los smokes contra prod con rate limit 5/min** (`D-F4-3`): 6 tests en 2m 6s en GitHub Actions no dan 429 (la latencia natural de CI renueva la ventana). En local, 18s, tampoco (verificado). Pero un CI muy rápido (workers paralelos) podría fallar; `workers: 1` lo previene.
- **Primer run de CI con secrets mal configurados:** el primer intento falló con "Faltan E2E_USER_ADMIN_EMAIL". El `gh secret list` mostró solo 2 secrets (los reales). Los 8 nuevos se cargaron en el segundo intento con `WriteAllLines`.

**Estado final de D parcial:**
- ✅ Setup Playwright (config + fixtures + .env.e2e.local).
- ✅ 6 smokes read-only contra prod (4 roles + analytics + dashboard).
- ✅ Workflow CI (push/PR/dispatch) con Node 22.
- ✅ 10 secrets en GitHub.
- ✅ Tag `v0.4.3`.
- ⏳ Pendiente próxima sesión: flows de escritura contra Supabase local (`registro → empresa → establecimiento → publicar → directorio`).

**Deuda menor (a anotar):**
- `npm run build` local se cuelga en `runAfterProductionCompile` (no bloqueante, Vercel lo corre bien).
- `package.json` dice `version: "0.4.0"` pero el tag es `v0.4.3` (deuda de bumping).
- `.github/workflows/backup-db.yml` con `SUPABASE_DB_URL` no fue tocado.
---

## 2026-11-02 — Etapa II (Dashboard propietario) + Advisors de seguridad

**Mejoras funcionales y cierre de advisors de Supabase.**

**Etapa II — Dashboard del propietario (commit `768b535`):**
- `lib/propietario-metricas-actions.ts` extendido: 5 queries paralelas (`Promise.all`) con filtro explícito por `empresa_id` (defensivo, no confía solo en RLS):
  - `clientes` (count)
  - `vehiculos` (count)
  - `ordenesCompletadasMes` (count, filtrado por `fecha >= inicio_mes`)
  - `ordenesPendientes` (count, estado `borrador`)
  - `ultimasOrdenes` (5 últimas, JOIN anidado `orden_trabajo → vehiculo → cliente`)
- `app/(dashboard)/dashboard/page.tsx` reescrito:
  - 4 cards de métricas reales (grid responsive `grid-cols-2 md:grid-cols-4`).
  - 2 botones de acción ("Nueva orden", "Nuevo cliente").
  - Tabla de últimas 5 órdenes con badge de estado, cliente, vehículo, importe.
  - Estado vacío amable ("Todavía no hay órdenes").
  - Bloque "Empecemos" (sin empresa) intacto.
  - `<h1>Panel Principal</h1>` mantenido → smoke `dashboard-propietario` sigue verde.
- Degradación elegante: si el JOIN anidado falla por RLS/FK, `ultimasOrdenes` = `[]` y se muestra el estado vacío.

**Advisors de seguridad (commits `6d1d28e`, migraciones 022 + 023):**

Ejecutado `npx supabase db advisors --linked --type security` (2026-11-02). ~30 WARN iniciales.

**Arreglados (migración 022):**
- `set_updated_at`: `security invoker` + `set search_path = ''` → elimina WARN `function_search_path_mutable`.
- `cleanup_rate_limit`, `actualizar_stock`, `crear_empresa_con_establecimiento`: revocados de `anon` y `PUBLIC` (no se llaman desde flujos anónimos).
- **`check_rate_limit` NO se revoca de `anon`**: `auth-actions.ts` lo llama antes de `signInWithPassword`/`signUp` (usuario anónimo).

**Arreglados (migración 023):**
- `cleanup_rate_limit`: revocado de `authenticated` (solo se llama desde cron/service role).

**WARN aceptados (documentados en ADR-009):**
- `actualizar_stock` en `authenticated` (trigger de stock).
- `extension_in_public` (cube, earthdistance) — mover rompe mapas.
- `anon_security_definer_function_executable` en `check_rate_limit`, `buscar_establecimientos`, y ~8 funciones más (necesarias o validan `auth.uid()`).
- `auth_leaked_password_protection` — plan Free.

**Verificación:**
- `tsc --noEmit`: 0 errores.
- `npm test`: 279/279 passed (7.67s).
- `npx playwright test --project=smoke-prod`: 7/7 passed (19.6s).
- `npx supabase db push`: 021, 022, 023 aplicadas en prod.
- `npx supabase db advisors`: `cleanup_rate_limit` y `function_search_path_mutable` eliminados.

**Lecciones:**
- `supabase db push` **aplica todas las migraciones pendientes**, no solo la última. La 021 se había aplicado manualmente en prod pero no estaba en el historial de `db push`; se reaplicó (idempotente).
- El WARN `function_search_path_mutable` es de los más fáciles de arreglar (`set search_path = ''`) y de los más importantes (evita ataques de schema hijacking).
- Revocar `anon` de `check_rate_limit` **rompe el login** (porque se llama antes de autenticar). Verificar siempre quién llama a cada función antes de revocar.

**Deuda pendiente (para próxima sesión):**
- Actualizar Supabase CLI v2.122.0 → v3.0.0 (warning persistente).
- Etapa III (recepción rápida de vehículos).
- Etapa V (libreta digital del conductor).
- Deuda menor: `package.json` dice `version: "0.4.0"` pero el tag es `v0.4.3`.
---

## 2026-11-03 — Etapa III (Recepción rápida) + Centro de Ayuda completo

**Dos features grandes cerradas: wizard de recepción unificado y Centro de Ayuda con guías por rol.**

### Etapa III — Recepción rápida (commit `1662360`)

Wizard de 3 pasos en `/recepcion` que unifica el flujo cliente → vehículo → orden en una sola pantalla. Antes el flujo requería navegar por 3 pantallas separadas (`/clientes/nuevo`, `/vehiculos/nuevo`, `/ordenes/nuevo`).

**Archivos nuevos:**
- `app/(dashboard)/recepcion/page.tsx` — Server Component que pre-carga clientes, vehículos, servicios y productos.
- `components/recepcion/RecepcionWizard.tsx` — contenedor con state machine (paso 1/2/3).
- `components/recepcion/PasoIndicador.tsx` — UI del progreso (1 → 2 → 3).
- `components/recepcion/PasoCliente.tsx` — búsqueda + creación inline de cliente.
- `components/recepcion/PasoVehiculo.tsx` — búsqueda + creación inline de vehículo.
- `components/recepcion/PasoOrden.tsx` — km, servicios, productos, observaciones, submit.

**Archivos modificados (retrocompatibles):**
- `components/ClienteForm.tsx` — agregado `onSuccess?: (data: { id: string; nombre: string }) => void` opcional.
- `components/VehiculoForm.tsx` — agregado `onSuccess?: (data: { id: string }) => void` opcional.
- `components/SidebarPropietario.tsx` — agregado link "Recepción rápida".

**Verificación:** tsc 0 errores, 279/279 tests Vitest, 7/7 smokes Playwright.

### Centro de Ayuda completo (commits `33b66a8`, `529fe07`, `5ce1c37`)

Sistema de documentación in-app con 4 páginas y contenido real por rol.

**Hub `/ayuda`:**
- 3 tarjetas de rol (Propietario destacado, Conductor, Admin).
- 12 preguntas frecuentes (accordion nativo con `<details>`).
- Sección de contacto (email, WhatsApp, horario).

**Guías por rol:**

| Guía | Secciones | Contenido |
|---|---|---|
| **Propietario** | 15 | Primeros pasos, dashboard, clientes, vehículos, recepción rápida, órdenes, catálogo servicios/productos, inventario, establecimientos, directorio, portal conductor, notificaciones, consejos, solución de problemas (10 FAQs). |
| **Conductor** | 8 | Qué es KuatiAuto, crear cuenta, mi garage, agregar vehículo, ver historial, autorizar/revocar, privacidad, solución de problemas (7 FAQs). |
| **Admin** | 6 | Rol admin, dashboard, empresas, usuarios, catálogo global, analytics. |

**Arquitectura de contenido:**
- `lib/ayuda/types.ts` — contrato de datos (union discriminada `AyudaBloque`).
- `lib/ayuda/hub.ts` — datos del hub.
- `lib/ayuda/propietario-parte1.ts` + `propietario-parte2.ts` — contenido del propietario (dividido por tamaño).
- `lib/ayuda/conductor.ts` — contenido del conductor.
- `lib/ayuda/admin.ts` — contenido del admin.

**Componentes reutilizables:**
- `AyudaSeccion.tsx` — renderiza bloques (parrafo, lista, pasos, tip, advertencia, tabla, faq, captura, link).
- `AyudaIndiceLateral.tsx` — sidebar sticky en desktop + drawer en mobile.
- `AyudaBreadcrumb.tsx` — navegación contextual.
- `AyudaRolCard.tsx` — tarjeta de rol en el hub.

**Links en sidebars:** agregados en `SidebarPropietario`, `SidebarConductor`, `SidebarAdmin`.

**Verificación:** tsc 0 errores, 279/279 tests Vitest, 11/11 smokes Playwright (4 nuevos de ayuda).

**Lecciones:**
- **Playwright + timing en CI:** los tests de ayuda se deployan en Vercel, pero el CI de GitHub Actions corre en paralelo. Si el CI corre antes de que Vercel deploye, los tests fallan. Solución: esperar a Vercel o usar `waitForURL` con timeout generoso.
- **Selectores de Playwright:** `getByRole('link', { name: /^Conductor$/ })` falla si el link tiene texto adicional (descripción adentro). Usar regex sin ancla o `.first()`.
- **Contenido como datos:** separar el contenido de los componentes (`lib/ayuda/*.ts` + `components/ayuda/*.tsx`) hace el mantenimiento y la traducción mucho más fáciles.

### Estado final

- **Commit HEAD:** `5ce1c37` (`fix(e2e): ajustar selectores del smoke del Centro de Ayuda`).
- **Tag:** `v0.4.3` (del 2026-11-02, no bumpeado en esta sesión).
- **CI:** verde con 11 tests.
- **Tests:** 279/279 Vitest, 11/11 Playwright smokes.

### Deuda pendiente

- Bumping de `package.json` a `0.4.3` (sigue en `0.4.0`).
- Actualizar Supabase CLI v2.122 → v3.0.0.
- Etapa IV (cierre de orden con catálogo integrado) — pendiente.
- Etapa V (libreta digital del conductor) — parcialmente cubierta por la guía del conductor.
- Flows E2E de escritura contra Supabase local — pendiente.
---

## 2026-11-03 — Contacto del fundador + separación de registros + fix de sidebars

**Tres mejoras de producto cerradas en la misma sesión.**

### Contacto del fundador (commit `937da16`)

Se agregó una sección de contacto del fundador en el Centro de Ayuda y en las 3 guías. Ahora el usuario tiene 3 canales para contactar al creador:
- **WhatsApp:** +595 986 207 595 (con link `wa.me` y mensaje pre-cargado).
- **Email:** kuatiauto.soporte@gmail.com (con reenvío a email personal).
- **Portfolio:** https://portafolio-pjpirovani.vercel.app

**Componente:** `components/ayuda/AyudaContacto.tsx` (reutilizable).
**Datos:** `HUB_FUNDADOR` en `lib/ayuda/hub.ts`.

**Por qué:** en fase MVP, el fundador atendiendo personalmente es un diferencial. Genera confianza y da un canal directo al usuario.

### Separación de registros (commit `4cb7d38`)

**Problema detectado:** los formularios de `/register` (lubricentro) y `/register-conductor` (conductor) se veían **exactamente iguales**. Mismo fondo petróleo, misma card blanca, mismo logo. El usuario no podía diferenciar en qué registro estaba.

**Solución implementada:**

1. **Nuevo hub `/empezar`** (público):
   - 2 tarjetas grandes con iconos, título, descripción y bullets de beneficios.
   - Lubricentro: fondo petróleo, icono `IconBuildingStore`, botón petróleo.
   - Conductor: fondo lima, icono `IconCar`, botón lima.
   - Redirección inteligente: si el usuario ya está logueado, lo manda a su panel (`/admin`, `/mi-garage`, `/crear-empresa`, `/dashboard`).
   - Texto al pie: "¿Ya tenés cuenta? Iniciar sesión" + "¿Sos empleado? Pedile al dueño que te invite".

2. **Rediseño de `/register` (lubricentro):**
   - Fondo petróleo (mantenido).
   - Icono de edificio arriba del título (nuevo).
   - Título: "Crear cuenta de lubricentro" (antes "Crear cuenta").
   - Link cruzado: "¿Sos conductor? → Registrate acá".
   - Link "Volver" arriba → `/empezar`.

3. **Rediseño de `/register-conductor`:**
   - Fondo **grafito** (distinto al petróleo del lubricentro).
   - Icono de auto arriba del título (nuevo).
   - Título: "Crear cuenta de conductor" (antes "Registro de Conductor").
   - Botón **lima** (distinto al petróleo del lubricentro).
   - Link cruzado: "¿Sos lubricentro? → Registrate acá".
   - Link "Volver" arriba → `/empezar`.

4. **Landing actualizada:**
   - Los 2 links "Registrarse" (navbar) y "Comenzar ahora" (hero) ahora apuntan a `/empezar` (antes `/register`).
   - URLs existentes (`/register`, `/register-conductor`) siguen funcionando (no se rompen links externos).

**Lógica de autenticación:** intacta. No se tocó `register(formData)` ni `registerConductor(formData)`. Solo cambios visuales (header, iconos, colores, links cruzados).

### Fix de sidebars (commit pendiente)

**Problema detectado:** el botón "Cerrar Sesión" en los sidebars no era visible en pantallas chicas (laptops). El `<aside>` tenía `min-h-screen` (altura mínima, no fija), por lo que crecía con el contenido del menú y empujaba el botón fuera de la pantalla.

**Solución:** los 3 sidebars (`SidebarPropietario`, `SidebarConductor`, `SidebarAdmin`) ahora tienen:
- `h-screen sticky top-0` en el `<aside>` → altura fija al viewport, no crece.
- `shrink-0` en header, versión y footer → no se encogen.
- `overflow-y-auto` en el `<nav>` → solo los links scrollean si son muchos.

**Resultado:** el botón "Cerrar Sesión" está **siempre visible al fondo del sidebar**, sin importar cuántos items tenga el menú.

**Verificación:** tsc 0 errores, 279/279 tests Vitest, 11/11 smokes Playwright.

### Lecciones

- **El registro es la puerta de entrada al producto.** Si el usuario se confunde acá, perdió la confianza antes de empezar. La diferenciación visual (colores, iconos, títulos) es crítica, no cosmética.
- **Los sidebars en SaaS deben ser `sticky` con `h-screen` + `overflow-y-auto` en el nav.** Es la práctica estándar (Linear, Notion, Vercel, Stripe). Sin esto, el botón de logout se pierde en pantallas chicas.
- **El botón "Cerrar Sesión" siempre debe ser visible.** Es un patrón de UX importante: el usuario tiene que poder salir en 1 click desde cualquier panel.
- **Nunca romper URLs existentes.** Aunque la landing ahora apunte a `/empezar`, `/register` y `/register-conductor` siguen funcionando para links guardados o externos.

### Estado final

- **Commit HEAD:** `4cb7d38` (último del push) + `fix(sidebars)` (pendiente de commitear en este momento).
- **Tests:** 279/279 Vitest, 11/11 Playwright.
- **Vercel:** deployado con los 3 cambios (excepto el fix de sidebars, que se deploya con este commit).
---

## 2026-11-03 (segunda parte) — Fix de layout, CTA y corrección de textos

**Cierre de sesión con 3 fixes adicionales después del primer cierre de hoy.**

### Fix de layout de sidebars (commit `09dc183`)

**Problema:** el botón "Cerrar Sesión" no se veía en pantallas chicas. El `<aside>` tenía `h-screen sticky top-0` pero el wrapper (`MobileSidebarWrapper`) era `md:static`, así que el sticky no funcionaba. El sidebar crecía con el contenido y empujaba el botón fuera del viewport.

**Solución (3 archivos):**
- `components/MobileSidebarWrapper.tsx`: `md:static` → `md:sticky md:top-0 md:h-screen md:shrink-0`. Agregado `overflow-y-auto md:overflow-visible` para que en mobile tenga scroll interno.
- `components/SidebarPropietario.tsx`: `<aside>` con `w-full h-full md:h-screen` (el wrapper maneja el sticky y la altura).
- `app/(dashboard)/layout.tsx`: contenedor con `h-screen overflow-hidden`, `<main>` con `h-screen overflow-y-auto` (main scrollea solo, sidebar fijo).

**Verificación:** en PC funciona (captura confirma sidebar fijo, botón visible, versión `v0.4.3`). En mobile queda pendiente de verificar (problema de red/firewall, no del layout).

### Corrección de CTA y textos (commit `1154a53`)

**Problemas detectados:**
1. El texto del link cruzado en `/register-conductor` decía "¿Sos lubricentro?" — **error de redacción** (un lubricentro es un lugar, no una persona).
2. El CTA de ambos registros era "Crear cuenta" — **genérico y débil** según reglas de marketing.

**Solución:**
- **Texto del link cruzado:** "¿Sos lubricentro?" → "¿Tenés un lubricentro?" (natural, voseo paraguayo).
- **CTA del botón:** "Crear cuenta" → "Empezar gratis" (en ambos registros). Razón:
  - Comunica acción (empezar) + beneficio (gratis).
  - Reduce fricción (elimina ansiedad de "¿me cobran?").
  - Consistente entre los 2 registros.
  - Alineado con el producto (KuatiAuto es gratis en MVP).
  - Es lo que usan Stripe, Notion, Linear en sus inicios.

### Lecciones

- **El layout de sidebars en SaaS requiere 3 piezas:** wrapper `sticky` con `h-screen`, `<aside>` con `h-full`, `<main>` con `h-screen overflow-y-auto`. Si falta una, el layout se rompe.
- **En mobile, el wrapper `fixed` necesita `overflow-y-auto`** para que el usuario pueda scrollear y llegar al botón de logout.
- **El CTA debe ser específico del valor.** "Crear cuenta" es genérico. "Empezar gratis" comunica acción + beneficio.
- **Los textos deben ser naturales.** "¿Sos lubricentro?" no tiene sentido. "¿Tenés un lubricentro?" sí.
- **`Start-Process -Wait -NoNewWindow` es más robusto que `cmd /c` en PS 5.x** para correr Playwright. El `cmd /c` a veces se cuelga y recibe Ctrl+C sin que el usuario lo mande.

### Estado final

- **Commit HEAD:** `1154a53`.
- **Tests:** 279/279 Vitest, 11/11 Playwright.
- **Vercel:** deployado con todos los cambios (pendiente verificación manual en prod).
- **Pendiente próxima sesión:** verificar layout y CTA en prod (PC y mobile), debug del celular (localhost vs IP local).
---

## 2026-11-03 (tercera parte) — Logout con server action + fix de textos

**Cierre de sesión con el fix del logout y correcciones finales de copy.**

### Logout con server action (commit `ed04e49`)

**Problema detectado:** al hacer click en "Cerrar Sesión", el usuario iba al `/dashboard` en vez de `/login`. Causa: el middleware (`proxy.ts`) interceptaba la redirección del cliente (`router.push('/login')`) y, por una carrera de milisegundos, todavía leía una sesión vieja y lo devolvía al dashboard.

**Solución:** mover el logout al servidor con una server action.

- **`lib/auth-actions.ts`**: agregada `logoutAction()` que hace `signOut` + `revalidatePath` + `redirect('/login')`.
- **3 sidebars** (`SidebarPropietario`, `SidebarConductor`, `SidebarAdmin`): eliminado `createClient` y `useRouter`. `handleLogout` ahora solo llama a `logoutAction()`.
- El `redirect('/login')` ocurre en el servidor, antes de que el middleware pueda interceptar.

**Ventaja:** la redirección es del servidor, el middleware no tiene oportunidad de mandar al dashboard.
### Fix de texto "Soy lubricentro" (commit `ed04e49`)

**Problema:** en `/empezar`, la tarjeta izquierda decía "Soy lubricentro". Un lubricentro es un lugar, no una persona. Es incorrecto gramaticalmente.

**Solución:** "Soy lubricentro" → "Tengo un lubricentro" en `app/empezar/page.tsx`.

**Consistencia:** el link cruzado en `/register-conductor` ya decía "¿Tenés un lubricentro?" (commit `1154a53`). Ahora los 2 textos son coherentes.

### Resumen de la sesión 2026-11-03 (14 commits)

| Commit | Descripción |
|---|---|
| `ed04e49` | fix(auth): logout con server action + corregir texto Soy lubricentro |
| `1154a53` | fix(registro): corregir texto y CTA a Empezar gratis |
| `09dc183` | fix(layout): sidebar sticky en desktop y scroll en mobile |
| `c0f25b3` | feat(registro): efecto pulse-slow en links cruzados |
| `9bcbf3a` | chore(version): bump package.json a 0.4.3 |
| `eaa95bf` | docs(cierre): contacto fundador + registro diferenciado + fix sidebars (ADR-011) |
| `37e2cda` | fix(sidebars): sticky + h-screen + shrink-0 |
| `4cb7d38` | feat(registro): separar registro de lubricentro y conductor + hub /empezar |
| `937da16` | feat(ayuda): contacto del fundador en hub y 3 guias |
| `e424166` | docs(cierre): Etapa III + Centro de Ayuda completo (ADR-010) |
| `5ce1c37` | fix(e2e): ajustar selectores del smoke del Centro de Ayuda |
| `529fe07` | test(e2e): smoke del Centro de Ayuda |
| `33b66a8` | feat(ayuda): centro de ayuda completo con guias por rol |
| `1662360` | feat(recepcion): wizard de recepcion rapida (Etapa III) |
### Lecciones

- **Logout en Next.js + Supabase:** si el middleware tiene lógica de redirección, el logout del cliente (`router.push`) puede ser interceptado. La solución es hacer el logout en el servidor con una server action (`signOut` + `revalidatePath` + `redirect`).
- **Los textos deben ser naturales.** "Soy lubricentro" es incorrecto. "Tengo un lubricentro" es natural.
- **El CTA debe comunicar acción + beneficio.** "Empezar gratis" > "Crear cuenta".
- **El layout de sidebars requiere 3 piezas:** wrapper `sticky` + `<aside> h-full` + `<main> h-screen overflow-y-auto`.

### Estado final

- **Commit HEAD:** `ed04e49`.
- **Versión:** `0.4.3`.
- **Tests:** 279/279 Vitest, 11/11 Playwright.
- **Vercel:** deployado con todos los cambios.
- **Pendiente próxima sesión:**
  - Implementar `/perfil` (nombre + cambio de contraseña + ver rol/empresa).
  - Verificar en prod: logout, texto de `/empezar`, layout.
  - Debug del celular (localhost vs IP local).
  - Etapa IV (cierre de orden).
## 2026-11-03 (cuarta parte) — /perfil con cambio de nombre y contraseña

**Primer feature de gestión de cuenta del usuario. Cierra la deuda pendiente del cierre anterior.**

### Implementación de /perfil (commit `26bd897`)

**Motivación:** los usuarios no tenían forma de cambiar su nombre ni su contraseña desde la app. El nombre solo se definía al registrarse y la contraseña solo se podía recuperar por email (reset). Se necesitaba una página compartida por los 3 roles (propietario, conductor, admin).

**Decisiones de arquitectura:**

- **Ubicación:** `app/perfil/page.tsx` en la raíz, **fuera** de los grupos `(dashboard)`, `(portal)`, `(admin)`. Es compartida por los 3 roles. Sigue el precedente de `/ayuda`, que tampoco tiene layout propio.
- **Header:** "← Volver al inicio" + "Ayuda" (según rol). Sin sidebar contextual.
- **Re-auth:** antes de `updateUser({ password })`, se valida la contraseña actual con `signInWithPassword`. Si falla, no se permite el cambio.
- **Fuente de email:** `auth.user.email` (no `usuario.email`, redundante).
- **Fuente de rol:** `usuario.rol` (consistente con `proxy.ts`).
- **Nombre:** `usuario.nombre` (nullable, fallback a `''`).

**Archivos nuevos:**

- `lib/perfil-actions.ts` — 3 server actions: `obtenerPerfil`, `actualizarNombre`, `cambiarPassword`.
- `app/perfil/page.tsx` — server component, redirect a `/login` sin sesión.
- `components/perfil/PerfilForm.tsx` — client component con 2 `useActionState` (nombre + contraseña).
- `lib/perfil-actions.test.ts` — 17 tests unitarios.
- `e2e/smoke/perfil.spec.ts` — 2 smokes (redirect sin sesión, render con sesión).

**Archivos modificados:**

- `components/SidebarPropietario.tsx` — link "Mi perfil" + `IconUser`.
- `components/SidebarConductor.tsx` — idem.
- `components/SidebarAdmin.tsx` — idem.

### Verificación de schema (previa a escribir código)

Antes de escribir una sola línea de código, se verificaron los hechos con `supabase db query`:

- `usuario.nombre` — text, nullable. ✅
- `usuario.rol` — text, default `'empleado'`, **no enum**. ✅
- `usuario.email` — text, not null, **redundante con `auth.users.email`**. ✅
- `usuario.empresa_id` — uuid, nullable. ✅
- Trigger `trg_usuario_updated_at` en UPDATE, ejecuta `set_updated_at()`. ✅
- `proxy.ts` no protege `/perfil`. ✅
- `app/ayuda/` no tiene `layout.tsx` propio (precedente para `/perfil`). ✅

**Lección:** verificar el schema real antes de escribir código evita 5 suposiciones (columna `nombre`, tipo de `rol`, trigger, protección de ruta, layout). El costo de `db query` es 30 segundos; el costo de escribir código con supuestos es 2 horas de debugging.

### Tests

- **Vitest:** 279 → **296** (+17). Todos passing.
- **Playwright smokes:** 11 → **13** (+2). Todos passing contra prod.
- **`tsc --noEmit`:** 0 errores.

### Lecciones

- **Re-auth es no negociable para cambio de contraseña.** `signInWithPassword` antes de `updateUser` cuesta 3 líneas y elimina una clase entera de ataques (session hijacking).
- **El trigger `updated_at` ahorra código.** No setear `updated_at` manualmente: es fuente de bugs (formato, timezone, orden de ejecución). El trigger lo hace solo.
- **`useActionState` de React 19** es el patrón para formularios con feedback inline. Sin `useState` + `useEffect` + fetch manual.
- **Precedente de `/ayuda`:** páginas compartidas por roles van en la raíz, sin layout propio, con header autogestionado. Coherencia arquitectónica.
- **Verificar el schema antes de escribir código** evita suposiciones costosas. `supabase db query` es más rápido que debuggear.
- **El protocolo PowerShell del dump** (`WriteAllText` + `UTF8Encoding($false)` + `Test-Path` + `Join-Path`) funciona. Cero corrupción de encoding en 9 archivos.

### Estado final

- **Commit HEAD:** `26bd897`.
- **Versión:** `0.4.4` (bump pendiente en el commit de docs).
- **Tests:** 296/296 Vitest, 13/13 Playwright smokes.
- **Vercel:** deployado, verificado con smoke E2E real contra `kuatiauto.vercel.app`.
- **Pendiente próxima sesión:**
  - Bump `package.json` + `package-lock.json` a `0.4.4` (en este cierre).
  - Tag `v0.4.4`.
  - Verificar layout y CTA de `/empezar` en prod (PC y mobile).
  - Debug del celular (localhost vs IP local).
  - Etapa IV (cierre de orden con catálogo integrado).
  - Actualizar Supabase CLI v2.122 → v3.0.0.
## 2026-11-10 — Cierre de auditoría P0/P1/P2 (Seguridad)

**Contexto:** Se ejecutó una auditoría externa con IA (Claude) que arrojó 3 hallazgos críticos de seguridad que no estaban contemplados en el gate de seguridad original.

**Cambios implementados:**
- **P0 (KU-DB-02):** Se creó la migración  24_fix_user_privileges.sql con un trigger BEFORE UPDATE en la tabla usuario. Ahora es imposible que un usuario se cambie el ol o el empresa_id a sí mismo vía PostgREST.
- **P1 (KU-SEC-01):** Se reescribió proxy.ts agregando todas las rutas privadas (/clientes, /vehiculos, /perfil, etc.). Además, ahora consulta el campo ctivo para bloquear cuentas desactivadas y usa maybeSingle() para evitar fallos abiertos (fail-open).
- **P2 (KU-SEC-03):** Se modificó lib/auth-actions.ts para incluir la IP (x-forwarded-for) en la clave del rate limit. Se configuró RATE_LIMIT_FAIL_MODE=closed en .env.local y Vercel.

**Verificación:**
- 296/296 tests Vitest verdes.
- 
ext build compiló sin errores (31 rutas).
- git push a main (commit a518fc).
- Migración  24 sincronizada con el historial de Supabase (migration repair).

**Deudas pendientes de auditoría:**
- **KU-FUNC-01:** Guardado de órdenes no atómico (falta RPC transaccional).
- **KU-SEC-02:** RPC crear_empresa_con_establecimiento no valida si el usuario ya tiene empresa.
## 2026-11-10 — Cierre KU-SEC-02 y KU-FUNC-01 (Transacciones y Onboarding)

**Contexto:** Se completaron los dos hallazgos restantes de la auditoría de seguridad/funcional.

**Cambios implementados:**
- **KU-SEC-02 (Migración 025):** Se reforzó la función RPC crear_empresa_con_establecimiento. Ahora verifica que usuario.empresa_id sea NULL antes de permitir la creación. Si el usuario ya tiene empresa, lanza una excepción. Esto impide el "salto" de tenant.
- **KU-FUNC-01 (Migración 026):** Se movió la lógica de crear/editar órdenes a dos RPCs transaccionales (crear_orden_transaccional y editar_orden_transaccional). Ahora la cabecera, los servicios y los productos se guardan en un solo BEGIN...COMMIT. Si algo falla, PostgreSQL hace rollback automático.
- **Backend (lib/ordenes-actions.ts):** crearOrden y editarOrden ahora llaman a las RPCs transaccionales en lugar de hacer inserts/updates manuales.

**Verificación:**
- 296/296 tests Vitest verdes.
- 
ext build compiló sin errores (31 rutas).
- Migraciones 025 y 026 aplicadas exitosamente en Supabase (db push).

**Estado de la auditoría:**
- ✅ P0 (KU-DB-02): Cerrado.
- ✅ P1 (KU-SEC-01): Cerrado.
- ✅ P2 (KU-SEC-03): Cerrado.
- ✅ KU-SEC-02: Cerrado.
- ✅ KU-FUNC-01: Cerrado.
- ⏳ Pendiente (baja prioridad): KU-SEC-04 (pruebas RLS cross-tenant), KU-FUNC-02 (validar FKs cross-tenant), KU-PERF-01 (paginación admin).
## 2026-11-10 (segunda parte) — Unificación de Recepción Rápida y Órdenes

**Contexto:** Se unificó la lógica de "Próximo mantenimiento" en ambas pantallas, y se agregó la actualización automática del km_actual del vehículo.

**Cambios implementados:**
- **Recepción Rápida:** Ahora trae los intervalos de servicio_global desde page.tsx y los usa para el autocompletado en PasoOrden.tsx.
- **Backend (lib/ordenes-actions.ts):** completarOrden actualiza el km_actual del vehículo si el km de la orden es mayor.
- **UI:** Sección destacada de "Próximo mantenimiento" en la recepción rápida.

**Verificación:**
- 296/296 tests Vitest verdes.
- 
ext build compiló sin errores (31 rutas).
- Push a main: commit 808da67.

**Estado:** v0.5.0 estable y lista para el piloto.
## 2026-11-11 — v0.6.0: Numeracion de ordenes + soft-delete de catalogo + dashboard con alertas

**Contexto:** Sesion de mejoras de UX/UI y funcionalidad. Se implementaron 3 features grandes del backlog de la auditoria.

**Cambios implementados:**

- **Numeracion de ordenes (Migracion 029):**
  - Columna 
umero_orden en orden_trabajo, con indice unico por empresa.
  - Funcion RPC siguiente_numero_orden() y actualizacion de crear_orden_transaccional para asignar el numero automaticamente.
  - UI: columna "N°" en la lista, y titulo "Orden #0001" en el detalle.

- **Soft-delete de catalogo local (Migracion 028):**
  - Columna ctivo en servicio_empresa y producto_empresa, con indices.
  - Server actions 	oggleServicioEmpresa y 	oggleProductoEmpresa.
  - Filtros .eq('activo', true) en los <select> de ordenes y recepcion.
  - UI: botones "Desactivar" (ambar) y "Reactivar" (verde) en las tablas y tarjetas del catalogo.

- **Dashboard con alertas de mantenimiento:**
  - Funcion obtenerVehiculosProximos() que combina la ultima orden completada con el km_actual del vehiculo.
  - Criterio "lo que ocurra primero": si la fecha o el km superan el umbral, se marca como vencido.
  - UI: seccion ambar con badges "Vencido" (rojo) y "Proximo" (amarillo).

- **Actualizacion automatica del km_actual:**
  - Al completar una orden, el km_actual del vehiculo se actualiza si el km de la orden es mayor.

**Verificacion:**
- 296/296 tests Vitest verdes.
- \
ext build\ compilo sin errores (31 rutas).
- Migraciones 028 y 029 aplicadas en Supabase.

**Estado:** v0.6.0 estable y lista para el piloto.
## 2026-11-11 — v0.7.0: Asignacion de mecanico, metodo de pago y tests RLS cross-tenant

**Contexto:** Cierre del backlog de la auditoria. Se implementaron 2 features y se completo el hallazgo KU-SEC-04 con tests automatizados.

**Cambios implementados:**

- **Asignacion de mecanico y metodo de pago (Migracion 030):**
  - Columna empleado_id (FK a usuario) y metodo_pago (con CHECK de valores permitidos) en orden_trabajo.
  - Funcion RPC crear_orden_transaccional actualizada para recibir y guardar ambos campos.
  - Server actions crearOrden y editarOrden actualizadas.
  - Nueva funcion listarEmpleadosEmpresa() en lib/empleados-actions.ts.
  - UI: 2 selects nuevos en OrdenForm.tsx (Mecanico asignado y Metodo de pago).

- **Tests RLS cross-tenant (KU-SEC-04):**
  - Archivo lib/rls-cross-tenant.test.ts con 4 tests.
  - Simula 2 empresas (A y B) con usuarios distintos.
  - Verifica que A NO puede leer, editar ni crear datos de B.
  - Configuracion de dotenv en itest.setup.ts para cargar .env.local.

**Verificacion:**
- 296/296 tests Vitest verdes + 4 tests RLS nuevos.
- 
ext build compilo sin errores (31 rutas).
- Migracion 030 aplicada en Supabase.

**Estado:** v0.7.0 estable, con auditoria de seguridad cerrada al 100%.
## 2026-11-11 — v0.8.0: Reportes, impresion/PDF, mecanico y metodo de pago

**Contexto:** Cierre de las funcionalidades de UX/UI y reportes. Se completo el backlog de mejoras de negocio.

**Cambios implementados:**

- **Impresion/PDF:**
  - Estilos @media print en pp/globals.css que ocultan sidebar, botones y navegacion.
  - Componente BotonImprimir.tsx que ejecuta window.print().
  - Boton "Imprimir / PDF" en el detalle de la orden.

- **Numeracion de ordenes (Migracion 031):**
  - Backfill de 
umero_orden para ordenes existentes.

- **Patentes en mayusculas (Migracion 032):**
  - Normalizacion en ehiculoSchema.ts y VehiculoForm.tsx.
  - Migracion que convierte patentes existentes a mayusculas.

- **Mecanico y metodo de pago (Migracion 030):**
  - Columnas empleado_id y metodo_pago en orden_trabajo.
  - Funcion listarEmpleadosEmpresa() en lib/empleados-actions.ts.
  - 2 selects nuevos en OrdenForm.tsx.

- **Reportes:**
  - lib/reportes-actions.ts con 4 funciones: ventas mensuales, productividad por mecanico, top productos y top servicios.
  - Pagina /reportes en pp/(dashboard)/reportes/page.tsx.
  - Link "Reportes" en el sidebar.

- **Ayuda:**
  - Secciones nuevas de Reportes e Impresion en la guia del propietario.
  - Mencion de mecanico y metodo de pago en la seccion de ordenes.

**Verificacion:**
- 300/300 tests Vitest verdes (296 + 4 RLS).
- \
ext build\ compilo sin errores (32 rutas).
- Migraciones 030, 031 y 032 aplicadas en Supabase.

**Estado:** v0.8.0 estable, con auditoria cerrada y backlog de UX/UI completo.
## 2026-11-11 — v0.9.0: PWA con banner de nueva version + multi-empresa como pendiente

**Contexto:** Se reactivo el Service Worker con la estrategia correcta de "Nueva version disponible". Se decidio diferir Multi-empresa a una proxima sesion.

**Cambios implementados:**

- **PWA (Service Worker v3):**
  - public/sw.js reescrito: NO hace skipWaiting() en el install, espera confirmacion del cliente.
  - components/RegistroSW.tsx: registra el SW y muestra un banner cuando hay una nueva version disponible.
  - El banner tiene un boton "Actualizar" que envia SKIP_WAITING al SW y recarga la pagina.
  - pp/layout.tsx: agregado el componente RegistroSW.

**Pendiente para la proxima sesion (v1.0.0):**

- **Multi-empresa:** Requiere una migracion grande con tabla usuario_empresa (N:M), refactor de RLS y cambios en todas las server actions. Por su complejidad y riesgo, se difiere a una sesion dedicada con:
  - Backup reciente de la DB.
  - Tiempo sin interrupciones (2-4 horas).
  - Staging separado de produccion.
  - Tests exhaustivos de aislamiento.

**Verificacion:**
- 300/300 tests Vitest verdes.
- \
ext build\ compilo sin errores (32 rutas).

**Estado:** v0.9.0 estable, con PWA activa. Multi-empresa queda documentado como pendiente.
## 2026-11-11 — v0.10.0: Swipe gestures en tarjetas de órdenes

**Contexto:** Se implementó el efecto swipe (deslizar) en las tarjetas de órdenes de la vista móvil, usando @use-gesture/react + @react-spring/web. Es una mejora de UX que respeta las buenas prácticas de diseño (el swipe complementa, no reemplaza, los botones tradicionales).

**Cambios implementados:**

- **Dependencias nuevas:** @use-gesture/react + @react-spring/web.
- **Componente SwipeableCard.tsx:** Envuelve cualquier tarjeta y permite deslizarla horizontalmente. Al soltar, si supera el umbral de 100px o la velocidad es alta, ejecuta la acción. Si no, vuelve al centro con animación.
- **Componente TarjetaOrdenSwipeable.tsx:** Envuelve la tarjeta de orden con SwipeableCard. Deslizar a la derecha activa "Completar" (verde), a la izquierda activa "Anular" (ámbar).
- **ordenes/page.tsx:** Reemplaza las tarjetas de la vista móvil por TarjetaOrdenSwipeable. La tabla de escritorio no se toca.

**Buenas prácticas aplicadas:**
- El swipe complementa, no reemplaza, los botones (que siguen existiendo para accesibilidad y escritorio).
- xis: 'x' evita conflictos con el scroll vertical.
- 	ouchAction: 'pan-y' le dice al navegador que solo maneje el scroll vertical.
- ilterTaps: true evita que un tap rápido se confunda con un drag.
- ubberband: true da resistencia al arrastrar más allá del límite.
- Las acciones son reversibles (Completar/Anular se pueden deshacer).

**Verificación:**
- 300/300 tests Vitest verdes.
- 
ext build compiló sin errores (34 rutas).

**Estado:** v0.10.0 estable, con swipe gestures en órdenes.