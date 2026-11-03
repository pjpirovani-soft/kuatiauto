# DECISIONES — KuatiAuto

Registro de decisiones del proyecto. Cada decisión tiene un estado:
- **APROBADA:** confirmada explícitamente por el propietario.
- **PROPUESTA:** recomendación pendiente de aprobación.
- **PENDIENTE / VERIFICAR:** requiere información o investigación.
- **DESCARTADA:** evaluada y rechazada.

## Heredadas del PROMPT MAESTRO (D1-D12)

| ID | Decisión | Estado |
|---|---|---|
| D1 | Alcance geográfico: Paraguay (usuarios extranjeros OK, establecimientos solo PY) | APROBADA |
| D2 | Modelo multiempresa en una sola plataforma; un Supabase | APROBADA |
| D3 | PostgreSQL vía Supabase como BD inicial | APROBADA |
| D4 | Presupuesto mínimo, free tier al inicio | APROBADA |
| D5 | Cloudinary para imágenes (evaluar por tipo) | APROBADA con matiz |
| D6 | Módulos mínimos: clientes, vehículos, servicios, próximos mantenimientos | APROBADA (estructura a diseñar) |
| D7 | Directorio con búsqueda por ubicación (mecanismo a definir) | APROBADA con matiz |
| D8 | Catálogo automotriz con trazabilidad y fuentes | APROBADA |
| D9 | Facturación tributaria oficial FUERA del MVP | APROBADA |
| D10 | Diseñar y documentar antes de programar | APROBADA |
| D11 | Repo único, app Next modular | APROBADA |
| D12 | Método B de trabajo: fases → docs → aprobación → commit | APROBADA |

## Metodología (D-A a D-D)

| ID | Decisión | Estado |
|---|---|---|
| D-A | Alinear studio a metodología ENC | APROBADA |
| D-B | Seguridad integrada en ARCHITECTURE + SPEC + BITACORA + SESSION-STATE. Sin SEGURIDAD.md | APROBADA |
| D-C | CLIENTE.md provisional con `[PENDIENTE]` | APROBADA |
| D-D | `KuatiAuto` es nombre de trabajo, no comercial definitivo | APROBADA |

## Producto (D-P1 a D-P3, D-F1-1 a D-F1-3)

| ID | Decisión | Estado |
|---|---|---|
| D-P1 | Alcance MVP = gestión + directorio + portal + catálogo + inventario (los 4 componentes del PROMPT MAESTRO). | APROBADA |
| D-P2 | Vehículo híbrido: pertenencia por empresa (MVP) + `vehiculo_identidad` (v2) | PROPUESTA |
| D-P3 | Piloto provisional con `[PENDIENTE]` | APROBADA |
| D-F1-1 | Flujo MVP: 7 pasos. Sin factura/recibo, sin impresión/PDF, sin métricas en dashboard. Próximo mantenimiento sugerido automático | PROPUESTA |
| D-F1-2 | Orden de trabajo: 9 campos. `orden_servicio` y `orden_producto` en tablas aparte. `importe_total` único | PROPUESTA |
| D-F1-3 | Catálogo híbrido: global (admin) + local (empresa). Seed manual | PROPUESTA |

**Nota:** las decisiones marcadas PROPUESTA fueron tomadas por delegación pero no confirmadas explícitamente. Deben revisarse contra el PROMPT MAESTRO, que trata directorio y portal como componentes principales, no como v2. Si el propietario las confirma, pasan a APROBADA. Si las rechaza, pasan a DESCARTADA y se revierten.

## ADRs (en ARCHITECTURE.md)

| ID | Decisión | Estado |
|---|---|---|
| ADR-001 | Repo único con app Next modular | APROBADA |
| ADR-002 | Vehículo híbrido | PROPUESTA |
| ADR-003 | Piloto provisional | APROBADA |
| ADR-004 | Nombre KuatiAuto provisional | APROBADA |
| ADR-005 | Catálogo híbrido global + local | PROPUESTA |
| ADR-006 | Productos y servicios en tablas aparte | PROPUESTA |


## Decisiones de F2 (2026-10-30, por delegación)

| ID | Decisión | Estado |
|---|---|---|
| D-F2-1 | Roles del MVP: `admin_general`, `propietario`, `empleado`, `conductor`, `visitante`. `verificador_catalogo` → v2 | APROBADA por delegación |
| D-F2-2 | Authn con Supabase Auth para todos los roles con cuenta. Authz con RLS + server actions (doble capa) | APROBADA por delegación |
| D-F2-3 | Operaciones auditables: 8 listadas en ARCHITECTURE sección Autorización | APROBADA por delegación |
| D-F2-4 | Conductor ve historial solo si autorizó. Establecimiento no ve historial cross-tenant (R8) | APROBADA por delegación |
| D-F2-5 | Directorio con coordenadas aproximadas. Exactas solo para autenticados (R10) | APROBADA por delegación |

## Decisiones de F3 (2026-10-30, por delegación)

| ID | Decisión | Estado |
|---|---|---|
| D-F3-1 | 1 empresa → N establecimientos. En MVP, 1 usuario = 1 empresa. Multi-empresa → v2 | APROBADA por delegación |
| D-F3-2 | RLS por empresa_id en tablas de negocio. Catálogo global: SELECT true, escritura admin_general. Directorio: SELECT true con coordenadas aproximadas. Portal: RLS por conductor_id | APROBADA por delegación |
| D-F3-3 | Una sola función SECURITY DEFINER en MVP: crear_empresa_con_establecimiento. search_path fijo, permisos solo authenticated | APROBADA por delegación |
| D-F3-4 | Pruebas cruzadas obligatorias antes de cerrar F3. 2 sesiones, todas las tablas, documentadas en BITACORA.md | APROBADA por delegación |
| D-F3-5 | RLS diferencia por empresa_id, no por rol. Roles se validan en server actions. Excepción: historial_compartido | APROBADA por delegación |

## Decisiones de F4 (2026-10-30, por delegación)

| ID | Decisión | Estado |
|---|---|---|
| D-F4-1 | Modelo de amenazas: OWASP Top 10 completo + ASVS nivel 2 + amenazas del dominio (R7-R14) | APROBADA por delegación |
| D-F4-2 | Límites de confianza: frontend no confiable, server actions confiables pero validan, Supabase confiable (RLS última línea), service_role solo server-side, terceros con permisos mínimos | APROBADA por delegación |
| D-F4-3 | Rate limiting: login 5/min IP, registro 3/min IP, recuperación 3/min IP, API 100/min usuario, crear empresa 10/min, invitar empleado 10/min, publicar directorio 20/min. Implementación: middleware + tabla rate_limit | APROBADA por delegación |
| D-F4-4 | Auditoría: tabla audit_log con 9 operaciones auditables, retención 1 año, solo admin_general lee, INSERT vía SECURITY DEFINER o server action con service_role | APROBADA por delegación |
| D-F4-5 | Recuperación: backups diarios Supabase (7 días free), rotación de secretos 90 días, plan de respuesta documentado, notificación de incidentes críticos en 72h | APROBADA por delegación |

## Decisiones de F5a (2026-10-30, por delegación)

| ID | Decisión | Estado |
|---|---|---|
| D-F5a-1 | DDL en migraciones numeradas por fase (001-006 en F5a). `id uuid default gen_random_uuid()`, `created_at timestamptz default now()`, `updated_at` con trigger. | APROBADA por delegación |
| D-F5a-2 | Triggers: `set_updated_at`, `handle_new_user`, `crear_empresa_con_establecimiento` (SECURITY DEFINER), `poblar_vehiculo_identidad`, `actualizar_stock`. | APROBADA por delegación |
| D-F5a-3 | FKs a tablas de catálogo (servicio_global, producto_global) se agregan en F5b, no en F5a, para evitar dependencia circular. En F5a solo se crean las columnas. | APROBADA por delegación |

## Decisiones de F5b (2026-10-30, por delegación)

| ID | Decisión | Estado |
|---|---|---|
| D-F5b-1 | Catálogo automotriz completo: jerarquía fabricante → marca → modelo → version → motorizacion. Especificaciones con fuente, fecha, estado de validación y verificador. | APROBADA por delegación |
| D-F5b-2 | Directorio con coordenadas aproximadas (lat/lng con 5 decimales, barrio, ciudad, departamento). No expone coordenadas exactas (R10). | APROBADA por delegación |
| D-F5b-3 | Portal del conductor con tabla propia (conductor), distinta de usuario de empresa. El conductor autoriza/revoca historial_compartido (R8). | APROBADA por delegación |

## Decisiones de F5c (2026-10-30, por delegación)

| ID | Decisión | Estado |
|---|---|---|
| D-F5c-1 | RLS en todas las tablas. 2 helpers (`current_empresa_id`, `is_admin_general`). Políticas por tabla y operación, siguiendo el modelo de F3. `rate_limit` sin políticas (solo service_role). | APROBADA por delegación |
| D-F5c-2 | Seed del catálogo: 15 fabricantes, 5 marcas, 3 modelos, 10 servicios globales, 8 productos globales (marca `[PENDIENTE]`). Especificaciones de lubricantes vacías hasta F6 (no inventar). | APROBADA por delegación |
| D-F5c-3 | `check_rate_limit(clave, max, ventana_segundos)` SECURITY DEFINER. `cleanup_rate_limit()` para limpieza periódica. | APROBADA por delegación |

## Decisiones de F6a (2026-10-30, por delegación)

| ID | Decisión | Estado |
|---|---|---|
| D-F6-1 | Fuentes aceptables: niveles 1-3 (manual del fabricante, fabricante del lubricante, bases técnicas). Nivel 4 (foros) no aceptable. Cada especificación con fuente, fecha, estado, verificador. | APROBADA por delegación |
| D-F6-2 | Validación por admin_general en MVP. `pendiente` → `verificado` o `disputado`. Contradicción → `disputado`. Revisión anual. | APROBADA por delegación |
| D-F6-3 | Alcance inicial: 10 fabricantes comunes en Paraguay, 2-3 modelos cada uno, solo especificaciones de aceite de motor. Ampliación en v2. | APROBADA por delegación |
| D-F6-4 | Carga manual por admin en MVP. Importación CSV en v2. Versionado por fila nueva. Auditoría en audit_log. | APROBADA por delegación |

## Decisiones de F7 (2026-10-30, por delegación)

| ID | Decisión | Estado |
|---|---|---|
| D-F7-1 | Stack core = Next.js 16 + React 19 + TypeScript + Tailwind 4 + Supabase + Zod + Vitest + Vercel | APROBADA por delegación |
| D-F7-2 | Correo transaccional = Resend (free tier 100 emails/día, 3000/mes) | APROBADA por delegación |
| D-F7-3 | Mapas = Leaflet + OpenStreetMap en MVP. Mapbox en v2 | APROBADA por delegación |
| D-F7-4 | Analítica = Vercel Analytics. Monitoreo = Sentry free tier. CI/CD = GitHub Actions | APROBADA por delegación |

## Decisiones de F8 (2026-10-30, por delegación)

| ID | Decisión | Estado |
|---|---|---|
| D-F8-1 | Todo free tier. Único costo real en MVP: dominio `.com.py` (~$2/mes). No se paga nada más. | APROBADA por delegación |
| D-F8-2 | Monitoreo mensual de límites. Si se acerca al límite, evaluar. No pagar por adelantado. | APROBADA por delegación |
| D-F8-3 | Si el proyecto escala, se evalúan escenarios 3 y 4. Hasta entonces, $0/mes. | APROBADA por delegación |

## Decisiones de F9 (2026-10-30, por delegación)

| ID | Decisión | Estado |
|---|---|---|
| D-F9-1 | Datos personales: email, nombre, teléfono, patente, VIN (interno), km_actual, IP/user_agent (audit_log), coordenadas aproximadas. Nada más. | APROBADA por delegación |
| D-F9-2 | Retención: mientras cuenta/vehículo activo. audit_log 1 año. Eliminación: soft delete + anonimización en 30 días. | APROBADA por delegación |
| D-F9-3 | Derechos: acceso, rectificación, eliminación, oposición, portabilidad (v2). | APROBADA por delegación |
| D-F9-4 | Consentimiento en registro (términos + privacidad) y en conductor (historial compartido). Sin cookies de tracking en MVP. | APROBADA por delegación |

## Decisiones de F10 (2026-10-30, por delegación)

| ID | Decisión | Estado |
|---|---|---|
| D-F10-1 | Búsqueda por distancia con earthdistance + cube. Función SECURITY DEFINER. | APROBADA por delegación |
| D-F10-2 | Geocodificación con Nominatim (OSM). 1 req/segundo. Fallback manual. | APROBADA por delegación |
| D-F10-3 | Publicación por propietario, moderación por admin_general. Función SECURITY DEFINER. | APROBADA por delegación |
| D-F10-4 | Filtros: ciudad, departamento, servicios (jsonb), texto libre. | APROBADA por delegación |
| D-F10-5 | Mapa: Leaflet + OpenStreetMap. Sin API key. Popup con nombre, dirección, teléfono. | APROBADA por delegación |
| D-F10-6 | Coordenadas aproximadas (R10). Rate limiting (F4). No email, solo teléfono. Paginación. | APROBADA por delegación |
## Pendientes de verificar

| ID | Decisión | Estado |
|---|---|---|
| P-Nombre | Verificar `@kuatiauto` en redes y DINAPI | PENDIENTE |
| P-Piloto | Confirmar los 5 campos críticos de `CLIENTE.md` | PENDIENTE |
| P-Dominio | Registrar `kuatiauto.com.py` | PENDIENTE |
| P-Alcance-MVP | Directorio y portal son MVP (resuelto 2026-10-30). | APROBADA |
| P-Catálogo | Catálogo completo desde MVP: fabricantes, marcas, modelos, motores, especificaciones, fuentes (resuelto 2026-10-30). | APROBADA |
| P-Inventario | Inventario y movimientos de stock en MVP (resuelto 2026-10-30). | APROBADA |
## Decisiones de F11 (2026-10-30, por delegación)

| ID | Decisión | Estado |
|---|---|---|
| D-F11-1 | Mecanismo de envío programado = Vercel Cron (alternativa Edge Function documentada). | APROBADA |
| D-F11-2 | Idempotencia = idempotency_key UNIQUE en notificacion_log, formato tipo:refId:YYYY-MM-DD. | APROBADA |
| D-F11-3 | Rate limiting de envíos = reutiliza check_rate_limit de F5c. 20/día por empresa, 100/día global. | APROBADA |
| D-F11-4 | Reintentos = máximo 3, backoff exponencial (1m, 5m, 30m), luego fallido para revisión manual. | APROBADA |
| D-F11-5 | Trazabilidad = notificacion_log (siempre) + audit_log (solo envíos manuales). | APROBADA |

## Decisiones de F12 (2026-10-30, por delegacion)

| ID | Decision | Estado |
|---|---|---|
| D-F12-1 | Plan unico free en MVP. Sin freemium ni planes pagos. | APROBADA |
| D-F12-2 | Limites tecnicos suaves en MVP. 1 empresa por usuario. Sin tope duro de establecimientos ni vehiculos. Monitoreo mensual. | APROBADA |
| D-F12-3 | Funcionalidades premium diferidas a v2: multi-empresa, exportacion, reportes avanzados, portal extendido, catalogo editable. | APROBADA |
| D-F12-4 | Pricing tentativo v2: Gs. 150.000/mes por establecimiento, 3 tiers. Cobro manual en v2 temprana, pasarela en v2 avanzada. | APROBADA |
| D-F12-5 | Canal MVP: outbound directo + red del propietario. Sin paid ads. CAC ~ 0. | APROBADA |

## Decisiones de F13 (2026-10-30, por delegación)

| ID | Decisión | Estado |
|---|---|---|
| D-F13-1 | Entornos: local (dev), preview (Vercel por PR), prod (Vercel main + Supabase prod). Un solo proyecto Supabase en MVP; branching diferido a v2. | APROBADA |
| D-F13-2 | Backups: Supabase backup diario automático + export lógico semanal a almacenamiento externo (script manual documentado). Retención 30 días. Prueba de restauración trimestral documentada. | APROBADA |
| D-F13-3 | Monitorización: Vercel Analytics (Web Vitals + logs) + Sentry free tier para errores de servidor y cliente (diseñado, no configurado en MVP). Alertas por email al propietario. | APROBADA |
| D-F13-4 | Incidentes: 3 severidades. S1 (caída total o pérdida de datos) respuesta < 2 h; S2 (funcionalidad crítica degradada) < 24 h; S3 (bug menor o cosmético) próximo sprint. Canal único: email + WhatsApp del propietario. Post-mortem obligatorio para S1. | APROBADA |
| D-F13-5 | Continuidad: RTO 24 h, RPO 24 h. Accesos críticos (Vercel, Supabase, GitHub, dominio .com.py, Resend) documentados en gestor de contraseñas del propietario con 2FA. Plan de recuperación documentado en MANTENIMIENTO.md. | APROBADA |
**Nota:** D-F13-1..5 APROBADAS 2026-10-30 (por delegacion, arranque F14). F13 cerrada.

## ADR-007: Playwright E2E (2026-11-02, Fase D)

| ID | Decisión | Estado |
|---|---|---|
| ADR-007 | Adoptar `@playwright/test` para tests E2E. Alternativas evaluadas: Cypress (descartado: peor DX en Next 16 + React Server Components; peso de bundle), Vitest browser mode (descartado: aún experimental en la fecha, sin `storageState` ni multi-project robusto). Playwright gana por: soporte first-class de Next 16 App Router, multi-browser opcional, `storageState` para reutilizar login (crítico por rate limit D-F4-3), traza HTML/video/screenshot nativos, y CI runner oficial (`mcr.microsoft.com/playwright`). | APROBADA por delegación |
| D-D-1 | Estrategia híbrida: smokes **read-only** contra `kuatiauto.vercel.app` (prod) + flows de escritura contra Supabase local + `npm run dev`. Nunca escritura contra prod (D-F4-5, D-F13-2). | APROBADA por delegación |
| D-D-2 | `workers: 1` + `fullyParallel: false` en `smoke-prod` por rate limiting 5/min (D-F4-3). `storageState` compartido cuando se agreguen más smokes del mismo rol. | APROBADA por delegación |
| D-D-3 | `.env.e2e.local` con credenciales de prueba (gitignored por `.env.*.local`). No se hardcodean credenciales en specs (AI-RULES.md: "nunca imprimir el VALOR de una key"). | APROBADA por delegación |
| D-D-4 | `serviceWorkers: 'block'` en tests por SW v2 de PWA (Fase E8) que muestra banner "nueva versión" intermitente. | APROBADA por delegación |

**Nota:** ADR-007 y D-D-1..4 APROBADAS 2026-11-02 (por delegación, cierre parcial de D). 6/6 smokes verdes contra prod (18.1s). Flows de escritura y CI quedan para próxima sesión.

## ADR-008: Fase E8 — Design System, métricas, legal y PWA (2026-11-02, cierre retroactivo)

| ID | Decisión | Estado |
|---|---|---|
| ADR-008 | Fase E8 ejecutada 2026-11-02 (no documentada en su momento). Alcance: Design System unificado (paleta corporativa kuati-*), responsive completo (sidebars con hamburguesa, tablas con vista de tarjetas), panel de métricas del CEO (`/admin/analytics`) y del Propietario (`/dashboard`), páginas legales (`/terminos`, `/privacidad` Ley 6534/2020), centro de ayuda (`/ayuda`), PWA con SW v2 (botón "nueva versión disponible"), versión visible en sidebars (`NEXT_PUBLIC_APP_VERSION`). | APROBADA retroactivamente |
| D-E8-1 | Paleta corporativa: `kuati-petroleo`, `kuati-lima`, `kuati-grafito`, `kuati-borde`, `kuati-blanco`. Definidas en `tailwind.config` y aplicadas al 100% de la app. | APROBADA retroactivamente |
| D-E8-2 | Métricas separadas por rol: CEO ve métricas globales, Propietario ve métricas de su empresa. No se mezclan (RLS + views separadas). | APROBADA retroactivamente |
| D-E8-3 | PWA: SW v2 con estrategia de cache "nueva versión disponible" (no auto-refresh para evitar perder datos de formulario). Versión visible en sidebars para diagnóstico. | APROBADA retroactivamente |

**Nota:** ADR-008 y D-E8-1..3 APROBADAS retroactivamente el 2026-11-02. La fase E8 se ejecutó pero no quedó documentada en `DECISIONES.md` en su momento; este ADR regulariza el estado.

## Adenda 2026-11-02 — Corrección de deudas de documentación

Detectadas durante la lectura de docs para iniciar fase D:

- `STATUS.md` fechado 2026-10-31, decía 18 migraciones (real: 20). **Actualizado a 2026-11-02.**
- `SESSION-STATE.md` fechado 2026-11-01, decía 19 migraciones y 212 tests (real: 20 migraciones, 279 Vitest + 6 Playwright). **Actualizado a 2026-11-02 con sección nueva arriba.**
- `SESSION-PROTOCOL.md`: residuo `$13.` en pasos 3 y 3b de arranque y cierre. **Deuda menor, a corregir en próxima sesión.**
## ADR-009: WARN aceptados de Supabase Advisors (2026-11-02)

**Contexto:** Ejecutado `npx supabase db advisors --linked --type security` en el proyecto `kuatiauto` (2026-11-02). Se detectaron ~30 WARN iniciales. Después de las migraciones 022 y 023, quedan ~13 WARN que **se aceptan explícitamente** por decisión de diseño.

| ID | Advertencia | Estado | Justificación |
|---|---|---|---|
| D-ADV-1 | `auth_leaked_password_protection` | ACEPTADO | Requiere plan Pro (pago). Plan Free no lo soporta. Documentado como deuda hasta que el producto valide ingresos. |
| D-ADV-2 | `extension_in_public` (cube, earthdistance) | ACEPTADO | Mover las extensiones a otro schema rompe las funciones de distancia del directorio (`buscar_establecimientos`). Riesgo mayor que el WARN. |
| D-ADV-3 | `actualizar_stock` ejecutable por `authenticated` | ACEPTADO | Es un trigger que corre con los permisos del usuario que crea/edita una orden. Revocarlo rompe el stock. |
| D-ADV-4 | `anon_security_definer_function_executable` en `check_rate_limit` | ACEPTADO | `auth-actions.ts` lo llama **antes** de `signInWithPassword`/`signUp`. Revocarlo de `anon` rompe el login. |
| D-ADV-5 | `anon_security_definer_function_executable` en `buscar_establecimientos` | ACEPTADO | Función pública del directorio (visitantes anónimos buscan lubricentros). Es intencional. |
| D-ADV-6 | `anon_security_definer_function_executable` en `publicar_establecimiento`, `proponer_historial_compartido`, `aceptar_historial_compartido`, `revocar_historial_compartido`, `current_empresa_id`, `is_admin_general`, `handle_new_user`, `handle_new_conductor`, `poblar_vehiculo_identidad`, `rls_auto_enable`, `listar_historial_compartido` | ACEPTADO | Todas validan `auth.uid()` internamente. El WARN es "puede ser ejecutada por anon", pero el cuerpo de la función rechaza si no hay sesión. Es defensa en profundidad. |

**Conclusión:** los WARN restantes son **aceptados por diseño** y **documentados**. No representan vulnerabilidades explotables. El WARN naranja del dashboard de Supabase va a seguir visible, pero ahora es **ruido conocido** y no un problema sin analizar.

**Revisión:** reevaluar en cada release minor (o si el producto pasa a plan Pro).
## ADR-010: Centro de Ayuda con contenido por rol (2026-11-03)

**Contexto:** KuatiAuto tiene 3 roles distintos (propietario, conductor, admin_general) con flujos de trabajo completamente diferentes. Una guía genérica no sirve: el propietario necesita saber cómo crear órdenes, el conductor cómo ver su historial, el admin cómo moderar el catálogo.

**Decisión:** Implementar un Centro de Ayuda con arquitectura de contenido por rol.

| ID | Decisión | Estado |
|---|---|---|
| ADR-010 | Centro de Ayuda con 4 páginas: hub + 3 guías por rol. Contenido modelado como datos (`lib/ayuda/*.ts`) consumidos por componentes reutilizables (`components/ayuda/*.tsx`). | APROBADA |
| D-AYUDA-1 | Separar contenido (data) de presentación (componentes). Razón: facilita mantenimiento, traducción a otros idiomas, y permite agregar capturas de pantalla sin tocar el renderizado. | APROBADA |
| D-AYUDA-2 | Hub con 12 FAQs generales (plan, seguridad, soporte) + 3 tarjetas de rol. El propietario tiene tarjeta destacada (es el usuario principal del MVP). | APROBADA |
| D-AYUDA-3 | Guía del propietario con 15 secciones (la más completa). Cubre todo el ciclo de vida: onboarding, dashboard, CRUDs, recepción rápida, catálogo, directorio, portal del conductor, notificaciones, troubleshooting. | APROBADA |
| D-AYUDA-4 | Guía del conductor con 8 secciones (más corta). El conductor solo necesita saber: registrarse, ver su garage, agregar vehículos, ver historial, autorizar/revocar, privacidad. | APROBADA |
| D-AYUDA-5 | Guía del admin con 6 secciones. Cubre: rol, dashboard, empresas, usuarios, catálogo global, analytics. | APROBADA |
| D-AYUDA-6 | Sin capturas de pantalla en MVP. El componente `AyudaBloque` tiene tipo `captura` preparado, pero no se usa. Se agregan en una segunda pasada. | APROBADA |
| D-AYUDA-7 | Índice lateral sticky en desktop + drawer en mobile. `scroll-mt-24` en cada `<section>` para que los anchors no queden tapados por el header. | APROBADA |
| D-AYUDA-8 | Links "Ayuda" en los 3 sidebars (propietario, conductor, admin). Apuntan a la guía específica de cada rol, no al hub. | APROBADA |
| D-AYUDA-9 | Test E2E en CI (`e2e/smoke/ayuda.spec.ts`). Verifica que las 4 páginas cargan y tienen al menos un `<h2>` de sección. | APROBADA |

**Lecciones:**
- **Contenido como datos > JSX inline.** El `AyudaSeccion.tsx` renderiza 9 tipos de bloque (parrafo, lista, pasos, tip, advertencia, tabla, faq, captura, link) sin saber nada del contenido específico. Agregar una sección nueva es solo agregar un objeto al array.
- **Playwright y timing en CI.** Los tests de ayuda corren contra prod (Vercel). Si el CI corre antes de que Vercel deploye, fallan por 404. La solución fue esperar a que Vercel esté "Ready" antes de push. **Para futuros deploys, considerar `waitForURL` con retry o un step de "wait for deploy" en el workflow.**
- **Selectores de Playwright.** `getByRole('link', { name: /^Conductor$/ })` es demasiado estricto si el link tiene texto adicional (descripción adentro del `<a>`). Mejor regex sin ancla + `.first()`.

**Estado:** implementado y deployado en prod. CI verde con 11/11 tests.
## ADR-011: Registro diferenciado por rol (2026-11-03)

**Contexto:** KuatiAuto tiene 4 roles (`admin_general`, `propietario`, `empleado`, `conductor`). Solo 2 se registran públicamente: propietario (`/register`) y conductor (`/register-conductor`). `admin_general` se crea por SQL y `empleado` lo invita el propietario. Los 2 formularios se veían **exactamente iguales**, lo que generaba confusión en el registro.

**Decisión:** implementar un hub `/empezar` + rediseño diferenciado de los 2 registros.

| ID | Decisión | Estado |
|---|---|---|
| ADR-011 | Hub público `/empezar` con 2 tarjetas (lubricentro destacado, conductor). Redirección inteligente si el usuario ya está logueado. | APROBADA |
| D-REG-1 | **Diferenciación visual por paleta dominante:** lubricentro con fondo petróleo (`#123C46`) + botón petróleo. Conductor con fondo grafito (`#30363B`) + botón lima (`#A3D900`). Misma estructura de card, distinta colorimetría. | APROBADA |
| D-REG-2 | **Iconos diferenciados:** `IconBuildingStore` (edificio) para lubricentro, `IconCar` (auto) para conductor. | APROBADA |
| D-REG-3 | **Títulos explícitos:** "Crear cuenta de lubricentro" y "Crear cuenta de conductor" (antes "Crear cuenta" y "Registro de Conductor"). | APROBADA |
| D-REG-4 | **Links cruzados:** cada registro tiene un link al otro ("¿Sos conductor?" / "¿Sos lubricentro?"). | APROBADA |
| D-REG-5 | **Link "Volver"** a `/empezar` en ambos registros (no a la landing). | APROBADA |
| D-REG-6 | **URLs existentes se mantienen:** `/register` y `/register-conductor` siguen funcionando (no redirigen a `/empezar`). Razón: no romper links guardados, emails, o marketing. | APROBADA |
| D-REG-7 | **Landing apunta a `/empezar`:** los 2 CTAs ("Registrarse" y "Comenzar ahora") ahora llevan al hub, no directo a `/register`. | APROBADA |
| D-REG-8 | **Lógica de auth intacta:** `register(formData)` y `registerConductor(formData)` no se tocaron. Solo cambios visuales. | APROBADA |
| D-REG-9 | **Texto al pie sobre empleados:** "¿Sos empleado? Pedile al dueño que te invite". Aclara que el empleado no se registra solo. | APROBADA |

**Por qué funciona:**

| Aspecto | Lubricentro | Conductor |
|---|---|---|
| Fondo general | Petróleo (azul oscuro) | Grafito (gris oscuro) |
| Icono | 🏢 `IconBuildingStore` | 🚗 `IconCar` |
| Título | "Crear cuenta de lubricentro" | "Crear cuenta de conductor" |
| Botón primario | Petróleo | Lima |
| Link cruzado | "¿Sos conductor?" | "¿Sos lubricentro?" |

**Regla mental del usuario:** "Si el fondo es azul → lubricentro. Si es gris → conductor. Si el botón es azul → lubricentro. Si es verde → conductor."

**Lecciones:**
- **El registro es la puerta de entrada.** La diferenciación visual no es cosmética: es UX crítica.
- **Mantener URLs existentes.** Aunque la landing apunte a `/empezar`, `/register` y `/register-conductor` siguen funcionando.
- **Redirección inteligente:** si el usuario ya está logueado, `/empezar` lo manda a su panel. Evita mostrar "crear cuenta" a quien ya tiene una.

**Estado:** implementado y deployado en prod. 279/279 tests Vitest, 11/11 smokes Playwright.
## ADR-012: CTA "Empezar gratis" + corrección de textos (2026-11-03)

**Contexto:** después de implementar el registro diferenciado (ADR-011), se detectaron 2 problemas:
1. El texto del link cruzado en `/register-conductor` decía "¿Sos lubricentro?" — error de redacción (un lubricentro es un lugar, no una persona).
2. El CTA de ambos registros era "Crear cuenta" — genérico, débil, no comunica valor.

**Decisión:**

| ID | Decisión | Estado |
|---|---|---|
| ADR-012 | Reemplazar el CTA "Crear cuenta" por "Empezar gratis" en ambos registros. | APROBADA |
| D-CTA-1 | **"Empezar gratis"** en vez de "Crear cuenta". Razón: comunica acción + beneficio, reduce fricción (elimina ansiedad de cobro), consistente entre registros, alineado con el producto (gratis en MVP). | APROBADA |
| D-CTA-2 | **Corregir "¿Sos lubricentro?"** → **"¿Tenés un lubricentro?"**. Razón: en español, un lubricentro es un lugar, no una persona. "Sos lubricentro" es incorrecto gramaticalmente. | APROBADA |
| D-CTA-3 | **Mantener consistencia:** el CTA es el mismo en ambos registros ("Empezar gratis"). El texto del link cruzado se adapta al rol ("¿Sos conductor?" / "¿Tenés un lubricentro?"). | APROBADA |
| D-CTA-4 | **Subtítulo "Sin tarjeta de crédito" diferido** a un segundo commit. Razón: primero validar el CTA principal, después agregar el subtítulo. | PENDIENTE |

**Comparación de CTAs (evaluación de marketing):**

| CTA | Pros | Contras | Veredicto |
|---|---|---|---|
| "Crear cuenta" | Estándar, claro | Genérico, no comunica valor | ❌ Descartado |
| "Empezar gratis" | Acción + beneficio, reduce fricción | Un poco genérico | ✅ **Elegido** |
| "Digitalizar mi lubricentro" | Específico del valor | Largo | ❌ Descartado |
| "Probar gratis" | Reduce fricción | Implica que después se paga | ❌ Descartado |
| "Quiero gestionar mi lubricentro" | Primera persona | Largo | ❌ Descartado |

**Lecciones:**
- **El CTA debe ser específico del valor.** "Crear cuenta" es lo que dice el 90% de los SaaS. No diferencia.
- **Los textos deben ser naturales.** "¿Sos lubricentro?" es incorrecto. "¿Tenés un lubricentro?" es natural.
- **La consistencia entre registros** ayuda a la claridad. El usuario ve el mismo CTA en ambos, pero el texto contextual se adapta al rol.

**Estado:** implementado y pusheado (commit `1154a53`). Pendiente verificación en prod y agregar subtítulo "Sin tarjeta de crédito" en un segundo commit.
## ADR-013: Logout con server action (2026-11-03)

**Contexto:** el logout del cliente (`supabase.auth.signOut()` + `router.push('/login')`) era interceptado por el middleware (`proxy.ts`), que por una carrera de milisegundos todavía leía una sesión vieja y redirigía al `/dashboard`. El usuario hacía click en "Cerrar Sesión" y volvía al dashboard.

**Decisión:**

| ID | Decisión | Estado |
|---|---|---|
| ADR-013 | El logout se hace en el servidor con una server action (`logoutAction` en `lib/auth-actions.ts`). | APROBADA |
| D-LOGOUT-1 | `logoutAction` hace: `supabase.auth.signOut()` + `revalidatePath('/', 'layout')` + `redirect('/login')`. Todo en el servidor. | APROBADA |
| D-LOGOUT-2 | Los 3 sidebars (`SidebarPropietario`, `SidebarConductor`, `SidebarAdmin`) llaman a `logoutAction()` en vez de hacer `signOut` + `router.push` en el cliente. | APROBADA |
| D-LOGOUT-3 | Se elimina `createClient` y `useRouter` de los 3 sidebars (ya no son necesarios). | APROBADA |

**Ventaja:** el `redirect('/login')` ocurre en el servidor, **antes** de que el middleware pueda interceptar. No hay carrera de milisegundos.

**Alternativa descartada:** `router.refresh()` antes de `router.push('/login')` en el cliente. Funciona a veces, pero es un parche. La server action es más robusta.

**Estado:** implementado y pusheado (commit `ed04e49`). Pendiente verificación en prod.

## ADR-014: Layout de sidebars en 3 capas (2026-11-03)

**Contexto:** el botón "Cerrar Sesión" no se veía en pantallas chicas. El `<aside>` tenía `h-screen sticky top-0`, pero el wrapper (`MobileSidebarWrapper`) era `md:static`. El `sticky` no funcionaba porque el padre no tenía altura definida. El sidebar crecía con el contenido y empujaba el botón fuera del viewport.

**Decisión:**

| ID | Decisión | Estado |
|---|---|---|
| ADR-014 | El layout de sidebars se implementa en 3 capas: wrapper, `<aside>`, `<main>`. | APROBADA |
| D-LAYOUT-1 | **Wrapper** (`MobileSidebarWrapper`): `md:sticky md:top-0 md:h-screen md:shrink-0` + `overflow-y-auto md:overflow-visible`. En mobile tiene scroll interno (para llegar al botón de logout). En desktop es sticky con altura fija. | APROBADA |
| D-LAYOUT-2 | **`<aside>`** (`SidebarPropietario`): `w-full h-full md:h-screen`. El wrapper maneja el sticky y la altura. El aside solo llena el wrapper. | APROBADA |
| D-LAYOUT-3 | **Layout** (`app/(dashboard)/layout.tsx`): contenedor `h-screen overflow-hidden` + `<main> h-screen overflow-y-auto`. El main scrollea solo, el sidebar queda fijo. | APROBADA |

**Regla:** el layout de sidebars en SaaS requiere las 3 piezas. Si falta una, se rompe:
- **Sin wrapper sticky + h-screen:** el aside no puede sticker, crece con el contenido.
- **Sin `<aside> h-full`:** el aside no llena el wrapper.
- **Sin `<main> h-screen overflow-y-auto`:** el main crece con el contenido, empuja todo.

**Estado:** implementado y pusheado (commit `09dc183`). Verificado en PC. Pendiente verificar en mobile (problema de red/firewall, no del layout).