# BITACORA â€” KuatiAuto (provisional)

## 2026-10-30 â€” Fase 0: punto de partida arquitectÃ³nico

- **Contexto:** el proyecto nace del contacto comercial de EncarnaciÃ³n (Paraguay) que trabaja en mantenimiento automotor y propuso una plataforma comÃºn para establecimientos del rubro. El nombre `KuatiAuto` queda como provisional hasta verificar redes y DINAPI.
- **Proyecto base:** creado con `nueva-app.ps1 -Blueprint web-app -Destino clients\kuatiauto`. Scaffold `web-app` con auth + CRUD + RLS de ejemplo.
- **MetodologÃ­a:** se alinea a la metodologÃ­a del studio (ENC) el mismo dÃ­a.
- **Fase 0 (documentaciÃ³n):** `ARCHITECTURE.md`, `SPEC.md`, `SESSION-STATE.md`, `CLIENTE.md`, `GLOSARIO.md`, `BITACORA.md`.
- **Decisiones aprobadas:** D-A, D-B, D-C, D-D (metodologÃ­a), D-P1, D-P2, D-P3 (delegadas), ADR-001 a ADR-004.
- **Verificado:** `kuatiauto.com.py` disponible en NIC.py (2026-10-30). Sin registrar.
- **Pendiente:** verificar redes (@kuatiauto) y DINAPI (clases 9, 35, 42).
- **No se tocÃ³:** `app/`, `components/`, `lib/`, `supabase/`.

**Commits:** `b0bea04 docs: fase 0 â€” punto de partida arquitectonico KuatiAuto`.

## 2026-10-30 â€” Fase 1: definiciÃ³n de producto

- **Contexto:** se define el alcance del MVP, los flujos, el modelo de datos preliminar y los criterios de aceptaciÃ³n.
- **Decisiones por delegaciÃ³n (D-F1-1, D-F1-2, D-F1-3):**
  - Flujo MVP: 7 pasos del camino feliz. Sin factura/recibo, sin impresiÃ³n/PDF, sin mÃ©tricas en dashboard. PrÃ³ximo mantenimiento sugerido automÃ¡tico.
  - Orden de trabajo: 9 campos. `orden_servicio` y `orden_producto` en tablas aparte. `importe_total` Ãºnico.
  - CatÃ¡logo: hÃ­brido. Global (admin) + local (empresa). Seed manual.
- **ADRs nuevos:** ADR-005 (catÃ¡logo hÃ­brido), ADR-006 (productos y servicios en tablas aparte).
- **Riesgos cerrados:** R5 (alcance MVP inflado).
- **Docs actualizados:** `SPEC.md` (secciones 2, 3, 4, 8, 9, 10, 11), `GLOSARIO.md` (tÃ©rminos nuevos), `ARCHITECTURE.md` (ADR-005, ADR-006, plan de migraciones), `SESSION-STATE.md`, `BITACORA.md`, `CHANGELOG.md`.
- **No se tocÃ³:** `app/`, `components/`, `lib/`, `supabase/`. El scaffold `web-app` queda intacto hasta F3.

**Commits:** (pendiente).


## 2026-10-30 â€” Cierre de F1: alcance MVP confirmado

- **Contexto:** el PROMPT MAESTRO se recupera y se guarda como `docs/proyecto/PROMPT-MAESTRO.md`. Se crea `ROADMAP.md` (hoja de ruta de 14 fases) y `DECISIONES.md` (registro A/B/C/D).
- **Decisiones confirmadas:**
  - **P-Alcance-MVP:** los 4 componentes del PROMPT MAESTRO son MVP (gestiÃ³n + directorio + portal + catÃ¡logo + inventario). Directorio y portal no son v2.
  - **P-CatÃ¡logo:** catÃ¡logo completo desde MVP (fabricantes, marcas, modelos, motores, especificaciones, fuentes).
  - **P-Inventario:** inventario y movimientos de stock en MVP.
- **ReversiÃ³n:** D-P1 (mi propuesta de recortar a gestiÃ³n + catÃ¡logo mÃ­nimo + admin mÃ­nimo) queda DESCARTADA. El alcance es el del PROMPT MAESTRO.
- **Consecuencia:** F2 ahora incluye el rol de conductor (portal) y el rol pÃºblico (directorio). La matriz de permisos es mÃ¡s grande.
- **Docs actualizados:** `SPEC.md` (secciÃ³n 2), `DECISIONES.md`, `ROADMAP.md`, `SESSION-STATE.md`, `BITACORA.md`, `CHANGELOG.md`.

**Commits:** (pendiente).

## 2026-10-30 â€” Fase 2: usuarios, roles y permisos

- **Contexto:** se define la matriz completa de permisos, la separaciÃ³n authn/authz, las operaciones auditables y las reglas de negocio por rol.
- **Roles del MVP:** `admin_general`, `propietario`, `empleado`, `conductor`, `visitante`. `verificador_catalogo` â†’ v2.
- **Authn:** Supabase Auth para roles con cuenta. **Authz:** RLS + server actions (doble capa).
- **Matriz de permisos:** 20 entidades Ã— 5 roles Ã— operaciones (V/C/E/D). En `SPEC.md` secciÃ³n 3.
- **Reglas clave:**
  - Conductor ve historial solo si autorizÃ³. Establecimiento no ve historial cross-tenant (R8).
  - Directorio con coordenadas aproximadas. Exactas solo para autenticados (R10).
  - Propietario no puede degradarse a sÃ­ mismo ni eliminarse.
  - Admin general no ve datos de negocio.
- **Operaciones auditables:** 8 (alta/baja empresa, alta/desactivaciÃ³n empleado, ediciÃ³n cliente/vehÃ­culo/orden, ediciÃ³n catÃ¡logo global, cambios de rol, autorizaciÃ³n de historial, publicaciÃ³n en directorio, uso de service_role).
- **Decisiones:** D-F2-1 a D-F2-5 en `DECISIONES.md`.
- **Docs actualizados:** `SPEC.md` (secciÃ³n 3), `ARCHITECTURE.md` (secciÃ³n AutorizaciÃ³n), `DECISIONES.md`, `ROADMAP.md`, `SESSION-STATE.md`, `BITACORA.md`, `CHANGELOG.md`.
- **No se tocÃ³:** `app/`, `components/`, `lib/`, `supabase/`. El scaffold `web-app` queda intacto hasta F3.

**Commits:** (pendiente).


## 2026-10-30 â€” Fase 3: arquitectura multiempresa

- **Contexto:** se define el modelo multi-tenant, la estrategia RLS, SECURITY DEFINER y las pruebas cruzadas. Es la fase crÃ­tica: sin esto, no hay cÃ³digo seguro.
- **Modelo:** empresa â†’ N establecimientos. 1 usuario = 1 empresa en MVP. Multi-empresa â†’ v2 (tabla usuario_empresa). admin_general y conductor tienen empresa_id = null.
- **RLS:** por empresa_id en todas las tablas de negocio. CatÃ¡logo global: SELECT true, escritura solo admin_general. Directorio: SELECT true con coordenadas aproximadas. Portal: RLS por conductor_id. AdministraciÃ³n: empresa/usuario/audit_log con polÃ­ticas especÃ­ficas.
- **SECURITY DEFINER:** una sola funciÃ³n en MVP: crear_empresa_con_establecimiento. search_path fijo, permisos solo authenticated, transacciÃ³n atÃ³mica.
- **Pruebas cruzadas:** 2 sesiones (empresa A y B), todas las tablas, SELECT/INSERT/UPDATE/DELETE. Documentadas en este archivo antes de cerrar F3.
- **DiferenciaciÃ³n por rol:** RLS por empresa_id. Roles (empleado vs propietario) se validan en server actions. ExcepciÃ³n: historial_compartido.
- **Decisiones:** D-F3-1 a D-F3-5 en DECISIONES.md.
- **Docs actualizados:** ARCHITECTURE.md (secciÃ³n Multiempresa), DECISIONES.md, ROADMAP.md, SESSION-STATE.md, BITACORA.md, CHANGELOG.md.
- **No se tocÃ³:** app/, components/, lib/, supabase/. El scaffold web-app queda intacto hasta F5.

**Commits:** 6507ebe (arquitectura), pendiente (cierre F3).

## 2026-10-30 â€” Fase 4: arquitectura de seguridad

- **Contexto:** se cierra el modelo de amenazas, lÃ­mites de confianza, rate limiting, auditorÃ­a y recuperaciÃ³n. Es la Ãºltima fase crÃ­tica antes de F5.
- **Modelo de amenazas:** OWASP Top 10 (2021) completo + OWASP ASVS nivel 2 + amenazas del dominio (R7-R14, cada una con control y fase).
- **LÃ­mites de confianza:** frontend no confiable, server actions confiables pero validan todo, Supabase confiable (RLS Ãºltima lÃ­nea), service_role solo server-side, terceros con permisos mÃ­nimos y rotaciÃ³n.
- **Rate limiting:** login 5/min IP, registro 3/min IP, recuperaciÃ³n 3/min IP, API 100/min usuario, crear empresa 10/min, invitar empleado 10/min, publicar directorio 20/min. ImplementaciÃ³n: middleware + tabla rate_limit.
- **AuditorÃ­a:** tabla audit_log con 9 operaciones auditables, retenciÃ³n 1 aÃ±o, solo admin_general lee, INSERT vÃ­a SECURITY DEFINER o server action con service_role.
- **RecuperaciÃ³n:** backups diarios Supabase (7 dÃ­as free), rotaciÃ³n de secretos 90 dÃ­as, plan de respuesta documentado, notificaciÃ³n de incidentes crÃ­ticos en 72h (Ley 6534/2020).
- **Decisiones:** D-F4-1 a D-F4-5 en DECISIONES.md.
- **Docs actualizados:** ARCHITECTURE.md (secciÃ³n Seguridad ampliada), DECISIONES.md, ROADMAP.md, SESSION-STATE.md, BITACORA.md, CHANGELOG.md.
- **No se tocÃ³:** app/, components/, lib/, supabase/.

**Commits:** 9d7b1c2 (arquitectura), pendiente (cierre F4).

## 2026-10-30 â€” Fase 5a: modelo de datos (gestiÃ³n)

- **Contexto:** se implementan las migraciones 001-006 de las tablas de gestiÃ³n. Es la primera fase con cÃ³digo real.
- **Migraciones:** 001_empresa_establecimiento, 002_usuario, 003_cliente, 004_vehiculo, 005_orden_trabajo, 006_stock_movimiento. Total: ~14 KB de SQL.
- **Tablas creadas:** empresa, establecimiento, usuario, cliente, vehiculo, vehiculo_identidad, orden_trabajo, orden_servicio, orden_producto, producto_empresa, stock_movimiento.
- **Triggers y funciones:** set_updated_at, handle_new_user, crear_empresa_con_establecimiento (SECURITY DEFINER), poblar_vehiculo_identidad, actualizar_stock.
- **Pendiente F5b:** catÃ¡logo automotriz (fabricante, marca, modelo, version, motorizacion, especificacion_lubricante, servicio_global, servicio_empresa, producto_global), directorio (establecimiento_publico), portal (conductor, vehiculo_conductor, historial_compartido).
- **Pendiente F5c:** audit_log, rate_limit, RLS policies (011), seed del catÃ¡logo.
- **No se tocÃ³:** app/, components/, lib/. El scaffold web-app queda intacto hasta F6.

**Commits:** (pendiente).

## 2026-10-30 â€” Fase 5b: catÃ¡logo, directorio y portal

- **Contexto:** se implementan las migraciones 007-008. Con esto el modelo de datos del MVP estÃ¡ completo (falta F5c: audit_log, rate_limit, RLS, seed).
- **Migraciones:** 007_catalogo.sql (7112 bytes), 008_directorio_portal.sql (5444 bytes). Total F5a+F5b: ~26 KB de SQL.
- **CatÃ¡logo:** fabricante â†’ marca â†’ modelo â†’ version â†’ motorizacion â†’ especificacion_lubricante (con fuente, fecha, estado de validaciÃ³n). servicio_global, servicio_empresa, producto_global. FKs pendientes de orden_servicio/orden_producto agregadas.
- **Directorio:** establecimiento_publico con coordenadas aproximadas (lat/lng 5 decimales, barrio, ciudad, departamento), servicios_ofrecidos, horarios.
- **Portal:** conductor (cuenta propia), vehiculo_conductor, historial_compartido (con autorizado boolean).
- **Trigger nuevo:** handle_new_conductor (crea conductor si el usuario se registra como tal).
- **Pendiente F5c:** audit_log, rate_limit, RLS policies (011), seed del catÃ¡logo.
- **No se tocÃ³:** app/, components/, lib/.

**Commits:** (pendiente).

## 2026-10-30 â€” Fase 5c: RLS, audit_log, rate_limit y seed (F5 completa)

- **Contexto:** se cierran las Ãºltimas 3 migraciones de F5. Con esto el modelo de datos del MVP estÃ¡ completo.
- **Migraciones:** 009_audit_log_rate_limit, 010_rls_policies, 011_seed_catalogo. Total F5: 11 migraciones, ~49 KB de SQL.
- **RLS:** habilitado en todas las tablas. 2 helpers (current_empresa_id, is_admin_general). PolÃ­ticas por tabla y operaciÃ³n, siguiendo el modelo de F3.
- **audit_log:** 9 operaciones auditables, retenciÃ³n 1 aÃ±o, solo admin_general lee.
- **rate_limit:** check_rate_limit(clave, max, ventana) SECURITY DEFINER. cleanup_rate_limit() para limpieza.
- **Seed:** 15 fabricantes, 5 marcas, 3 modelos, 10 servicios globales, 8 productos globales. Marcas [PENDIENTE] hasta F6. Especificaciones de lubricantes vacÃ­as (no inventar).
- **F5 completa:** modelo de datos del MVP cerrado. Listo para F6 (catÃ¡logo automotriz) y F7 (stack).
- **No se tocÃ³:** app/, components/, lib/.

**Commits:** (pendiente).

## 2026-10-30 â€” Fase 6a: catÃ¡logo automotriz (fuentes y validaciÃ³n)

- **Contexto:** se define el proceso de llenado y validaciÃ³n del catÃ¡logo. No es cÃ³digo: es la polÃ­tica de fuentes y el proceso de verificaciÃ³n.
- **Fuentes:** niveles 1-3 aceptables (manual del fabricante, fabricante del lubricante, bases tÃ©cnicas). Nivel 4 (foros) no aceptable.
- **ValidaciÃ³n:** admin_general verifica en MVP. pendiente â†’ verificado o disputado. ContradicciÃ³n â†’ disputado. RevisiÃ³n anual.
- **Alcance inicial:** 10 fabricantes comunes en Paraguay, 2-3 modelos cada uno, solo especificaciones de aceite de motor. AmpliaciÃ³n en v2.
- **Carga:** manual por admin en MVP. CSV en v2. Versionado por fila nueva. AuditorÃ­a en audit_log.
- **Pendiente F6b:** carga inicial del catÃ¡logo con datos verificados. Requiere que el piloto o el admin verifiquen las fuentes antes de cargar.

**Commits:** (pendiente).

## 2026-10-30 â€” Fase 7: stack tecnolÃ³gico (justificaciÃ³n)

- **Contexto:** se justifica cada elecciÃ³n del stack y se definen los servicios externos que faltaban: correo, mapas, analÃ­tica, CI/CD.
- **Stack core:** Next.js 16 + React 19 + TypeScript + Tailwind 4 + Supabase + Zod + Vitest + Vercel. JustificaciÃ³n en ARCHITECTURE.md.
- **Correo:** Resend (free tier 100/dÃ­a, 3000/mes). Emails: confirmaciÃ³n, recuperaciÃ³n, invitaciÃ³n. v2: notificaciÃ³n de mantenimiento.
- **Mapas:** Leaflet + OpenStreetMap en MVP (gratis). Mapbox en v2 si el directorio crece.
- **AnalÃ­tica:** Vercel Analytics + Sentry free tier. CI/CD: GitHub Actions.
- **Variables de entorno:** 6 definidas (Supabase URL + anon + service_role, Resend, Sentry, app URL).
- **Decisiones:** D-F7-1 a D-F7-4 en DECISIONES.md.

**Commits:** (pendiente).

## 2026-10-30 â€” Fase 8: costes y sostenibilidad

- **Contexto:** se define la polÃ­tica de costes. Todo free tier, sin pagar nada hasta que el proyecto lo justifique.
- **Free tiers:** Vercel Hobby, Supabase Free, Resend Free, Sentry Free, Leaflet + OSM, GitHub Free. Ãšnico costo real: dominio `.com.py` (~$2/mes).
- **Escenarios:** 1 (prueba) $0/mes, 2 (primeros establecimientos) $0/mes, 3 (crecimiento moderado) ~$65/mes si se supera free tier, 4 (crecimiento importante) ~$1200/mes.
- **Regla de oro:** no se paga nada hasta que el proyecto lo justifique con uso real o ingresos. Monitoreo mensual de lÃ­mites. No pagar por adelantado.
- **Decisiones:** D-F8-1 a D-F8-3 en DECISIONES.md.

**Commits:** (pendiente).

## 2026-10-30 â€” Fase 9: privacidad y protecciÃ³n de datos

- **Contexto:** se define el cumplimiento de la Ley 6534/2020 de Paraguay.
- **Datos recopilados:** email, nombre, telÃ©fono, patente, VIN (interno), km_actual, IP/user_agent (audit_log), coordenadas aproximadas. Nada mÃ¡s.
- **RetenciÃ³n:** mientras cuenta/vehÃ­culo activo. audit_log 1 aÃ±o. EliminaciÃ³n: soft delete + anonimizaciÃ³n en 30 dÃ­as.
- **Derechos:** acceso, rectificaciÃ³n, eliminaciÃ³n, oposiciÃ³n, portabilidad (v2).
- **Consentimiento:** registro (tÃ©rminos + privacidad), conductor (historial compartido). Sin cookies de tracking.
- **Incidentes:** notificaciÃ³n a afectados en 72h (Ley 6534/2020).
- **Decisiones:** D-F9-1 a D-F9-4 en DECISIONES.md.

**Commits:** (pendiente).

## 2026-10-30 â€” Fase 10: directorio y geolocalizaciÃ³n

- **Contexto:** se implementa la bÃºsqueda por distancia y el mapa del directorio. Primera fase con cÃ³digo de frontend.
- **MigraciÃ³n 012:** earthdistance + cube. FunciÃ³n buscar_establecimientos (SECURITY DEFINER), publicar_establecimiento (SECURITY DEFINER).
- **Frontend:** lib/schemas/directorioSchema.ts, lib/directorio-actions.ts, components/directorio/MapaDirectorio.tsx (Leaflet + OSM), app/(directorio)/page.tsx.
- **Dependencia nueva:** leaflet (npm install leaflet + @types/leaflet).
- **ProtecciÃ³n:** coordenadas aproximadas (R10), rate limiting (F4), no email, solo telÃ©fono, paginaciÃ³n.
- **Decisiones:** D-F10-1 a D-F10-6 en DECISIONES.md.

**Commits:** (pendiente).
## 2026-10-30 â€” Fase 11: notificaciones (docs)

**Docs:**
- `ARCHITECTURE.md` Â§Notificaciones (alcance F11a: stub + mocks, tabla `notificacion_log`, server actions, cron solo diseÃ±o, idempotencia, rate limiting, reintentos, trazabilidad, RLS, criterios de aceptaciÃ³n).
- `DECISIONES.md` D-F11-1 a D-F11-5 (PROPUESTA).
- `F11-PLAN.md` (alcance aprobado, quÃ© incluye, quÃ© no, orden de implementaciÃ³n).
- `ROADMAP.md` actualizado (F11 en progreso con docs 5a-5b).
- `SESSION-STATE.md` actualizado (D-F11-* como PROPUESTA, prÃ³ximos 3 pasos).

**Decisiones:** D-F11-1 a D-F11-5 (PROPUESTA, se aprueban al cerrar F11).

**Commits:** 14ca03b, d53b5b3, fdd5ef6.

**Pendiente:** cÃ³digo de F11 (migraciÃ³n 013, lib/email/, notificaciones-actions, tests), `next build` verde, cierre de F11.
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
- BUSINESS-LOGIC.md §Modelo comercial (planes, limites, premium, estrategia, suscripciones).
- DECISIONES.md D-F12-1..5 (PROPUESTA).
- ROADMAP.md F12 EN PROGRESO.
- SESSION-STATE.md actualizado.

**Decisiones:** D-F12-1..5 (APROBADAS).

**Commits:** d64e534, 5dcdaec, f5a1311, 60a0815.

**Pendiente:** cierre de F12 (aprobacion D-F12, CHANGELOG, commit final).
## Deuda tÃ©cnica pendiente

- Renombrar `clientes` a `establecimientos` en el scaffold (F3).
- Decidir estructura final de `app/` con route groups (F3).
- Verificar `@kuatiauto` en redes y DINAPI.
- Registrar `kuatiauto.com.py` cuando el piloto lo justifique.
- Definir contenido exacto del seed del catÃ¡logo global (~20-30 servicios/productos) (F6).