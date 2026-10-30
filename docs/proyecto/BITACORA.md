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
## Deuda técnica pendiente

- Renombrar `clientes` a `establecimientos` en el scaffold (F3).
- Decidir estructura final de `app/` con route groups (F3).
- Verificar `@kuatiauto` en redes y DINAPI.
- Registrar `kuatiauto.com.py` cuando el piloto lo justifique.
- Definir contenido exacto del seed del catálogo global (~20-30 servicios/productos) (F6).