# ARCHITECTURE — KuatiAuto (provisional)

**Actualizado:** 2026-10-30

## Stack Tecnológico (F7 — 2026-10-30)

### Stack core (justificado)

| Tecnología | Por qué | Alternativas evaluadas | Costo |
|---|---|---|---|
| Next.js 16 (App Router, Turbopack) | Server Components, Server Actions, route groups, deploy en Vercel, ecosistema maduro | Remix (menos ecosistema), SvelteKit (menos devs en PY), Astro (no para SaaS) | Gratis |
| React 19 | Requerido por Next 16, ecosistema, Server Components | Preact (menos ecosistema), Vue (no con Next) | Gratis |
| TypeScript estricto | Tipado en cliente y servidor, Zod integrado, menos bugs | JavaScript (sin tipos), Flow (menos adopción) | Gratis |
| Tailwind CSS 4 | Utility-first, rápido de iterar, buen DX | CSS Modules (más verboso), styled-components (runtime) | Gratis |
| Supabase (PostgreSQL 15 + RLS + Auth) | Auth + RLS + Storage + Realtime en un servicio, free tier generoso, SQL nativo | Firebase (NoSQL, sin RLS SQL), PlanetScale (sin Auth), Neon (sin Auth) | Free tier |
| Zod | Validación TS-first, schemas reutilizables, integración con React Hook Form | Yup (menos TS), Valibot (más nuevo, menos ecosistema) | Gratis |
| Vitest + Testing Library | Rápido, integración con Vite, API compatible con Jest | Jest (más lento, más config) | Gratis |
| Vercel | Deploy de Next.js, edge functions, CI/CD, free tier | Netlify (menos integración con Next), Cloudflare Pages (más complejo) | Free tier |

### Servicios externos

**Correo transaccional: Resend.**

- Free tier: 100 emails/día, 3000/mes. Suficiente para MVP.
- Alternativas: SendGrid (100/día), Mailgun (100/día), AWS SES (pago por uso, más complejo).
- Emails del MVP: confirmación de registro, recuperación de contraseña, invitación de empleado.
- v2: notificación de próximo mantenimiento.

**Mapas y geocodificación: Leaflet + OpenStreetMap (MVP). Mapbox (v2).**

- Leaflet + OSM: gratis, sin API key, mapas base. Geocodificación con Nominatim (1 req/segundo).
- Mapbox: free tier 50k requests/mes, mejor calidad, requiere API key.
- Decisión: Leaflet + OSM en MVP. Mapbox en v2 si el directorio crece.

**Analítica: Vercel Analytics.**

- Incluido en Vercel, free tier. Core Web Vitals + page views.
- v2: Umami self-hosted si se necesita más detalle.

**Monitoreo de errores: Sentry.**

- Free tier: 5k eventos/mes. Suficiente para MVP.
- Alternativas: Highlight (free tier), ninguno (no recomendado).

**CI/CD: GitHub Actions.**

- Ya configurado en el studio. Lint + test + build en cada push a main.
- Deploy automático a Vercel en merge a main.

### Variables de entorno necesarias

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (solo server)
- `RESEND_API_KEY`
- `SENTRY_DSN`
- `NEXT_PUBLIC_APP_URL`

### Decisiones de F7 (por delegación)

- D-F7-1: stack core = Next.js 16 + React 19 + TypeScript + Tailwind 4 + Supabase + Zod + Vitest + Vercel.
- D-F7-2: correo transaccional = Resend (free tier 100/día).
- D-F7-3: mapas = Leaflet + OpenStreetMap en MVP. Mapbox en v2.
- D-F7-4: analítica = Vercel Analytics + Sentry free tier + GitHub Actions.

## Estructura del repositorio

**Repo único, app Next modular.** Un solo repositorio contiene:

- `app/(auth)/` — login, register, logout.
- `app/(dashboard)/` — sistema administrativo de las empresas.
- `app/(portal)/` — portal de clientes particulares (v2).
- `app/(directorio)/` — directorio público (v2).
- `app/(admin)/` — panel de administración general.
- `app/api/` — route handlers compartidos.
- `lib/` — utilidades, clientes Supabase, schemas Zod, server actions.
- `supabase/migrations/` — SQL numeradas.

Separación futura en múltiples apps si el crecimiento lo justifica (ADR-001).

## ADRs

### ADR-001: Repo único con app Next modular

- **Contexto:** la plataforma tiene 4 componentes (gestión, portal, directorio, admin) que comparten stack, auth y base de datos.
- **Decisión:** un solo repositorio, una sola app Next con route groups por componente. No múltiples apps independientes.
- **Alternativas:** monorepo con múltiples apps (más complejo, overkill para MVP); múltiples repos (imposible compartir tipos y auth sin paquetes).
- **Consecuencias:** simplicidad de deploy (1 Vercel project). Separación futura posible sin reescribir.

### ADR-002: Vehículo híbrido — pertenencia por empresa, identidad global

- **Contexto:** dos opciones para la entidad vehículo: (a) pertenece al cliente del establecimiento (simple, historial fragmentado), (b) pertenece al conductor de la plataforma (potente, RLS cross-tenant complejo).
- **Decisión:** en MVP, opción (a): `vehiculo.empresa_id` + RLS por empresa. Además, tabla `vehiculo_identidad` (patente normalizada + VIN opcional) se puebla desde el día 1 para permitir consolidación cross-tenant en v2 **sin reescribir tablas**.
- **Alternativas:** (a) puro (migración traumática a futuro); (b) puro (RLS cross-tenant prematuro, SECURITY DEFINER desde el día 1).
- **Consecuencias:** propiedad separada de identidad. Patrón estándar multi-tenant. Migración a consolidación cross-tenant es aditiva, no destructiva.

### ADR-003: Piloto provisional

- **Contexto:** el contacto comercial de Encarnación originó la idea, pero no hay datos comerciales confirmados.
- **Decisión:** `CLIENTE.md` queda con los 5 campos críticos `[PENDIENTE]`. El MVP se diseña para el patrón genérico de lubricentro paraguayo, no exclusivamente para el piloto.
- **Consecuencias:** no se inventan datos. El piloto valida el MVP, no lo define.

### ADR-004: Nombre KuatiAuto (provisional)

- **Contexto:** el producto necesita nombre antes de Fase 0.
- **Decisión:** `KuatiAuto` como nombre de trabajo. Dominio `kuatiauto.com.py` verificado disponible (2026-10-30, NIC.py), sin registrar. Pendiente verificar redes y DINAPI.
- **Consecuencias:** si se confirma, pasa a DECIDIDO. Si colisiona, se renombra en `GLOSARIO.md` + `SPEC.md` (2 archivos), sin tocar código.

### ADR-005: Catálogo híbrido global + local

- **Contexto:** tensión entre "catálogo compartido" (PROMPT MAESTRO) y "catálogo por empresa en MVP" (GLOSARIO F0).
- **Decisión:** modelo híbrido. Catálogo global (`servicio_global`, `producto_global`) administrado por admin general, solo lectura para empresas. Catálogo local (`servicio_empresa`, `producto_empresa`) editable por cada empresa. El piloto arranca con seed manual del catálogo global, no con datos inventados.
- **Alternativas:** (a) solo global (admin carga todo, cuello de botella); (b) solo local (cada empresa inventa la rueda).
- **Consecuencias:** las empresas no dependen del admin para operar, pero se benefician del catálogo compartido. Consolidación local→global es v2.

### ADR-006: Productos y servicios en tablas aparte, no texto libre

- **Contexto:** una orden de trabajo puede tener múltiples servicios y productos. Texto libre es simple pero no permite reportes ni reutilización.
- **Decisión:** `orden_servicio` (N:M orden-servicio) y `orden_producto` (N:M orden-producto) con FK al catálogo. El importe total es un solo campo en `orden_trabajo` en MVP; desglose por línea → v2.
- **Alternativas:** texto libre (simple, no escalable); JSON en columna (peor de ambos mundos).
- **Consecuencias:** reportes futuros posibles ("cuántos cambios de aceite este mes"). Requiere UI de multi-select, más compleja que un textarea.

## Seguridad

Documento central: `ARCHITECTURE.md` sección Seguridad + `SPEC.md` criterios + `BITACORA.md` hallazgos. No hay `SEGURIDAD.md` separado (decisión D-B, 2026-10-30).

### Fundamentos obligatorios antes de programar (bloqueantes de F3 y F4)

- [ ] Modelo de amenazas inicial → F4
- [ ] Arquitectura de autenticación → F3
- [ ] Modelo de autorización → F2 + F3
- [ ] Estructura de roles y permisos → F2
- [ ] Modelo de aislamiento multiempresa → F3
- [ ] Separación público/privado → F3 + F10
- [ ] Seguridad Supabase/PostgreSQL → F3 + F5
- [ ] Gestión de secretos → F7 + F13
- [ ] Límites de confianza frontend/backend/BD → F3 + F7
- [ ] Auditoría y registro de eventos → F2 + F4 + F13

**Ningún código de módulo se escribe hasta que estos 10 estén definidos en este doc o en SPEC.md.**

### Aislamiento multiempresa (crítico, se define en F3)

Requisitos no negociables:

1. RLS en todas las tablas con datos privados o de empresa.
2. No confiar en `empresa_id` del frontend.
3. Verificar en server la pertenencia del usuario a la empresa.
4. Autorización en cada operación sensible.
5. Evitar IDOR/BOLA.
6. Impedir consulta/modificación/eliminación cross-empresa.
7. Evitar privilegios excesivos y credenciales que eludan RLS.
8. SECURITY DEFINER solo con justificación documentada.
9. Revisar permisos de tablas, vistas, funciones, esquemas.
10. Probar accesos cruzados con usuarios y sesiones independientes.

### Gate de seguridad por módulo

Obligatorio antes de marcar un módulo `completo` en `STATUS.md`:

1. Activos y datos que maneja → listados en este doc.
2. Usuarios y roles con acceso → matriz en `SPEC.md` actualizada.
3. Operaciones permitidas/prohibidas → explícitas.
4. Amenazas específicas del módulo → agregadas a este doc.
5. Controles implementados → referenciados con archivo:línea.
6. RLS y permisos BD revisados → captura en este doc.
7. Autorización backend verificada → prueba con usuario sin permiso.
8. Pruebas positivas y negativas → en `BITACORA.md`, verdes.
9. Prueba cruzada entre dos empresas (módulos multi-tenant) → en `BITACORA.md`, verde.
10. Hallazgos → en `BITACORA.md` con severidad. Críticos y altos bloquean el cierre salvo aceptación explícita documentada en `SESSION-STATE.md`.

Un módulo con hallazgos críticos/altos abiertos NO se commitea como completo. Se commitea como `wip` con nota en `STATUS.md`.

### Gestión de secretos

- Variables de entorno: `.env.local` (no versionado), `.env.example` (versionado, sin valores reales).
- Producción: secrets de Vercel + Supabase.
- Rotación: tokens de servicio cada 90 días o ante sospecha.
- Nunca commitear `.env*` real. `.gitignore` debe cubrirlo.

### Referencias

- OWASP Top 10.
- OWASP ASVS (controles aplicables seleccionados).


## Autorización (F2 — 2026-10-30)

Modelo de permisos, autenticación y operaciones auditables. La matriz completa está en `SPEC.md` sección 3.

### Autenticación

- **Proveedor:** Supabase Auth (email/password).
- **Roles con cuenta:** `admin_general`, `propietario`, `empleado`, `conductor`.
- **Roles sin cuenta:** `visitante` (directorio público).
- **Sesión:** cookie HttpOnly gestionada por `@supabase/ssr`. Server components y server actions leen la sesión del servidor, no del cliente.

### Autorización (doble capa)

1. **RLS (Row Level Security):** primera línea. Todas las tablas con datos de usuario o empresa tienen políticas RLS. El `empresa_id` nunca se confía del frontend.
2. **Server actions:** segunda línea. Cada acción valida el rol y la pertenencia antes de escribir. Si RLS falla por error de configuración, la server action debe fallar igual.

**Regla dura:** ningún componente de cliente decide permisos. Solo muestra u oculta UI. La decisión real es server-side.

### Modelo de aislamiento multiempresa

- Cada tabla de negocio tiene `empresa_id` (FK a `empresa`).
- RLS: `empresa_id = (select empresa_id from usuario where id = auth.uid())`.
- El `usuario.empresa_id` se setea al crear la empresa o al aceptar la invitación. No se puede cambiar sin pasar por una operación auditada.
- Admin general: `empresa_id` null. RLS le permite ver empresas y catálogo global, pero **no** tablas de negocio (clientes, vehículos, órdenes, stock).
- Conductor: RLS le permite ver sus vehículos y su historial compartido, pero no datos de empresas.
- Visitante: RLS le permite ver `establecimiento_publico` (con coordenadas aproximadas), nada más.

### Operaciones auditables

Tabla `audit_log` (a crear en F5) con: `id`, `usuario_id`, `empresa_id` (nullable), `accion`, `entidad`, `entidad_id`, `datos_anteriores` (jsonb), `datos_nuevos` (jsonb), `created_at`.

Operaciones registradas (mínimo MVP):

- Alta/baja/deshabilitación de empresa.
- Alta/desactivación de empleado.
- Edición de cliente/vehículo/orden (solo cambios, no lecturas).
- Edición de catálogo global (fabricantes, marcas, modelos, especificaciones, servicios/productos globales).
- Cambios de rol.
- Autorización/revocación de historial compartido.
- Publicación/despublicación en directorio.
- Uso de `service_role` (si se usa).

### Reglas de negocio que condicionan RLS

- **Conductor:** ve historial de sus vehículos solo si el establecimiento lo compartió o él lo autorizó (`historial_compartido`).
- **Establecimiento:** no ve historial de vehículos de otros establecimientos (R8).
- **Directorio:** coordenadas aproximadas (barrio/distrito) para visitantes. Exactas solo para autenticados.
- **Propietario:** no puede degradarse a sí mismo ni eliminarse (evita lockout).
- **Empleado:** ve datos del mismo tenant, no de otros.
- **Admin general:** no ve datos de negocio. Solo empresas, catálogo y moderación.

### Pendiente para F3/F4

- RLS formal por tabla (F3).
- Modelo de amenazas (F4).
- Rate limiting (F4).
- Protección de `service_role` (F4).
- Recuperación ante incidentes (F4).

## Arquitectura multiempresa (F3 — 2026-10-30)

Diseño formal del modelo multi-tenant, RLS, SECURITY DEFINER y pruebas cruzadas. Es la fase crítica del proyecto: sin esto, no hay código seguro.

### Modelo empresa / establecimiento / usuario

**Jerarquía:**

- empresa — unidad de aislamiento. Tiene nombre, RUC (nullable), dirección, teléfono.
- establecimiento — local físico. Pertenece a una empresa. 1 empresa → N establecimientos (el modelo lo soporta, la UI lo permite). En MVP, la mayoría de empresas tendrá 1.
- usuario — persona con cuenta. Tiene empresa_id (nullable para admin_general y conductor), rol, email, nombre.

**Pertenencia del usuario:**

- En MVP, un usuario pertenece a 1 empresa. El usuario.empresa_id se setea al crear la empresa o al aceptar la invitación.
- Multi-empresa → v2. El modelo lo soporta con una tabla intermedia usuario_empresa (no en MVP). En MVP, usuario.empresa_id es una FK directa.
- admin_general tiene empresa_id = null. No pertenece a ninguna empresa.
- conductor tiene empresa_id = null. Pertenece al portal, no a una empresa.

**Regla de aislamiento:**

> Toda tabla de negocio tiene empresa_id. RLS por empresa_id. El empresa_id nunca se confía del frontend. Se valida en server contra el usuario.empresa_id de la sesión.

### RLS: estrategia formal

**Tablas de negocio (con empresa_id):**

cliente, vehiculo, vehiculo_identidad, orden_trabajo, orden_servicio, orden_producto, stock_movimiento, servicio_empresa, producto_empresa.

Política base (SELECT, INSERT, UPDATE, DELETE):

    empresa_id = (select empresa_id from usuario where id = auth.uid())

Y para INSERT/UPDATE, además: empresa_id del registro debe coincidir con el del usuario. Para DELETE, solo propietario/empleado (RLS no diferencia rol, lo hace server action).

**Tablas de catálogo global (sin empresa_id):**

fabricante, marca, modelo, version, motorizacion, especificacion_lubricante, servicio_global, producto_global.

Política:
- SELECT: true (todos leen).
- INSERT/UPDATE/DELETE: solo admin_general (exists (select 1 from usuario where id = auth.uid() and rol = 'admin_general')).

**Tablas de directorio:**

establecimiento_publico (vista o tabla materializada).

Política:
- SELECT: true (visitantes leen). Coordenadas aproximadas (barrio/distrito), no exactas.
- INSERT/UPDATE/DELETE: solo propietario del establecimiento (para publicar/despublicar) y admin_general (para moderar).

**Tablas de portal:**

conductor, vehiculo_conductor, historial_compartido.

Política:
- conductor: SELECT/UPDATE solo su perfil (id = auth.uid()).
- vehiculo_conductor: CRUD solo sus vehículos (conductor_id = auth.uid()).
- historial_compartido: SELECT si conductor_id = auth.uid() o empresa_id = (select empresa_id from usuario where id = auth.uid()). INSERT/DELETE solo conductor (autoriza/revoca).

**Tablas de administración:**

empresa, usuario, audit_log.

Política:
- empresa: SELECT/UPDATE solo su empresa (id = (select empresa_id from usuario where id = auth.uid())). SELECT todas para admin_general. INSERT solo en el registro inicial (vía SECURITY DEFINER). DELETE solo admin_general (soft delete).
- usuario: SELECT/UPDATE su perfil. SELECT todos para admin_general. INSERT/UPDATE empleados solo propietario de la misma empresa. DELETE solo admin_general (soft delete).
- audit_log: SELECT solo admin_general. INSERT vía función SECURITY DEFINER o server action con service_role (nunca desde el cliente).
### SECURITY DEFINER

Solo una función en MVP:

    crear_empresa_con_establecimiento(
      p_nombre text,
      p_ruc text default null,
      p_direccion text default null,
      p_telefono text default null
    ) returns uuid

Qué hace:
1. Crea la empresa.
2. Crea el establecimiento por defecto (mismo nombre, dirección de la empresa).
3. Actualiza usuario.empresa_id y usuario.rol = 'propietario' para auth.uid().
4. Devuelve el empresa_id.

Requisitos:
- SECURITY DEFINER con search_path fijo (set search_path = public, pg_temp).
- Permisos de ejecución solo para authenticated.
- Transacción atómica (todo o nada).
- Documentada en BITACORA.md con justificación.

Nada más. Cualquier otra operación cross-tenant (consolidar historial, migrar datos) es v2 y requiere su propia justificación.

### Pruebas cruzadas (gate de seguridad)

Obligatorias antes de marcar F3 como completa. Se documentan en BITACORA.md.

Escenario: 2 sesiones, empresa A y empresa B. Cada una con 1 propietario, 1 empleado, 1 cliente, 1 vehículo, 1 orden.

Pruebas por tabla de negocio:

| Tabla | A intenta sobre B | Resultado esperado |
|---|---|---|
| cliente | SELECT | 0 filas |
| cliente | INSERT con empresa_id = B | error RLS |
| cliente | UPDATE empresa_id = B | 0 filas afectadas |
| cliente | DELETE empresa_id = B | 0 filas afectadas |
| vehiculo | SELECT | 0 filas |
| vehiculo | INSERT/UPDATE/DELETE | error o 0 filas |
| orden_trabajo | SELECT | 0 filas |
| orden_trabajo | INSERT/UPDATE/DELETE | error o 0 filas |
| stock_movimiento | SELECT | 0 filas |
| stock_movimiento | INSERT/UPDATE/DELETE | error o 0 filas |
| servicio_empresa, producto_empresa | SELECT | 0 filas |
| servicio_empresa, producto_empresa | INSERT/UPDATE/DELETE | error o 0 filas |

Pruebas por tabla de catálogo:

| Tabla | A intenta | Resultado esperado |
|---|---|---|
| fabricante, marca, etc. | SELECT | OK (todos leen) |
| fabricante, marca, etc. | INSERT/UPDATE/DELETE | error RLS (solo admin_general) |

Pruebas por tabla de directorio:

| Tabla | A intenta | Resultado esperado |
|---|---|---|
| establecimiento_publico | SELECT (visitante) | OK, coordenadas aproximadas |
| establecimiento_publico | INSERT/UPDATE/DELETE | error RLS (solo propietario del suyo o admin_general) |

Pruebas por tabla de portal:

| Tabla | A intenta | Resultado esperado |
|---|---|---|
| conductor | SELECT su perfil | OK |
| conductor | SELECT perfil de otro | 0 filas |
| vehiculo_conductor | SELECT sus vehículos | OK |
| vehiculo_conductor | SELECT vehículos de otro | 0 filas |
| historial_compartido | SELECT si autorizó | OK |
| historial_compartido | SELECT si no autorizó | 0 filas |

Herramienta: tests de integración con Supabase. Puede ser pgTAP (dentro de PostgreSQL) o tests SQL directos desde Node (@supabase/supabase-js con 2 clientes). Se define en F5.
### Aislamiento entre roles dentro de la misma empresa

RLS diferencia por empresa_id, no por rol. La diferenciación por rol (empleado vs propietario) se hace en server actions, no en RLS. Motivo: RLS más simple y más segura; server actions son el lugar natural para validar permisos de negocio.

Excepción: historial_compartido tiene RLS propia porque el acceso es condicional (conductor autorizó).

### Decisiones de F3 (por delegación)

- D-F3-1: 1 empresa → N establecimientos. En MVP, 1 usuario = 1 empresa. Multi-empresa → v2.
- D-F3-2: RLS por empresa_id en todas las tablas de negocio. Catálogo global: SELECT true, escritura solo admin_general. Directorio: SELECT true con coordenadas aproximadas. Portal: RLS por conductor_id.
- D-F3-3: una sola función SECURITY DEFINER en MVP: crear_empresa_con_establecimiento. search_path fijo, permisos solo authenticated.
- D-F3-4: pruebas cruzadas obligatorias antes de cerrar F3. 2 sesiones, todas las tablas, documentadas en BITACORA.md.
- D-F3-5: RLS diferencia por empresa_id, no por rol. Roles se validan en server actions. Excepción: historial_compartido.


## Arquitectura de seguridad (F4 — 2026-10-30)

Modelo de amenazas, límites de confianza, rate limiting, auditoría y recuperación. Complementa la sección Seguridad de F0 y la sección Multiempresa de F3. Sin F4, no se puede escribir código seguro.

### Modelo de amenazas

Referencias: OWASP Top 10 (2021) y OWASP ASVS nivel 2 (aplicable a SaaS con datos personales).

**Amenazas generales (OWASP Top 10):**

| ID | Amenaza | Control | Fase |
|---|---|---|---|
| A01 | Broken Access Control | RLS + server actions + pruebas cruzadas | F3, F4 |
| A02 | Cryptographic Failures | HTTPS obligatorio, secretos en env, Supabase Auth | F4, F7 |
| A03 | Injection | Zod en cliente y servidor, queries parametrizadas | F4, F5 |
| A04 | Insecure Design | Este modelo de amenazas, gate por módulo | F4 |
| A05 | Security Misconfiguration | Checklist de config, headers, CORS, CSP | F4, F7 |
| A06 | Vulnerable Components | npm audit, Dependabot, actualización mensual | F4, F13 |
| A07 | Auth Failures | Rate limiting, MFA opcional, sesiones cortas | F4, F7 |
| A08 | Data Integrity Failures | Auditoría, validación de integridad, backups | F4, F5 |
| A09 | Logging Failures | audit_log + logs de Vercel + alertas | F4, F13 |
| A10 | SSRF | Validación de URLs externas, allowlist | F4, F7 |

**Amenazas específicas del dominio:**

| ID | Amenaza | Control | Fase |
|---|---|---|---|
| R7 | Fuga entre lubricentros competidores | RLS por empresa_id + pruebas cruzadas | F3, F4 |
| R8 | Historial vehicular como dato sensible comercial | historial_compartido con consentimiento del conductor | F3, F4 |
| R9 | Datos personales de conductores | Minimización, retención, consentimiento (Ley 6534/2020) | F9 |
| R10 | Coordenadas de establecimientos | Aproximación a barrio/distrito en directorio público | F3, F10 |
| R11 | Integridad del catálogo automotriz | Fuentes, fecha, estado de validación, auditoría | F6 |
| R12 | Endpoints de notificación abusables | Rate limiting, validación de destinatarios, idempotencia | F11 |
| R13 | Funciones SQL privilegiadas | SECURITY DEFINER solo con justificación, search_path fijo | F3, F5 |
| R14 | Dependencias externas | Permisos mínimos, rotación de tokens, monitoreo | F7, F13 |

### Límites de confianza

| Zona | Confianza | Regla |
|---|---|---|
| Frontend (navegador) | NO confiable | Todo se valida en server. Nunca decidir permisos en cliente. |
| Server actions / route handlers | Confiable, pero valida todo | Zod en cada input. Verificar sesión y permisos antes de escribir. |
| Supabase (PostgreSQL + Auth) | Confiable | RLS es la última línea. Si RLS falla, la operación falla. |
| service_role | Confiable pero nunca en cliente | Solo server-side. Solo operaciones auditadas. Rotación cada 90 días. |
| Cloudinary, Resend, mapas | Terceros | Tokens con permisos mínimos. Rotación. Monitoreo de uso. |

**Regla dura:** ningún componente de cliente decide permisos. Solo muestra u oculta UI. La decisión real es server-side.
### Rate limiting

Implementación: middleware de Next.js + tabla rate_limit en Supabase (pg_cron para limpieza).

| Endpoint | Límite | Ventana | Por |
|---|---|---|---|
| Login | 5 intentos | 1 minuto | IP |
| Registro | 3 intentos | 1 minuto | IP |
| Recuperación de contraseña | 3 intentos | 1 minuto | IP |
| API general | 100 requests | 1 minuto | usuario autenticado |
| Crear empresa | 10 requests | 1 minuto | usuario |
| Invitar empleado | 10 requests | 1 minuto | usuario |
| Publicar/despublicar en directorio | 20 requests | 1 minuto | usuario |
| Endpoints de notificación (v2) | 50 requests | 1 minuto | usuario |

Respuesta al exceder: HTTP 429 con header Retry-After. Log en audit_log (acción rate_limit_exceeded). No bloquear permanentemente por IP (evitar negación de servicio a usuarios legítimos detrás de NAT).

### Auditoría

Tabla audit_log (a crear en F5):

- id (uuid, PK)
- usuario_id (uuid, FK a auth.users, nullable para operaciones del sistema)
- empresa_id (uuid, FK a empresa, nullable para admin_general)
- accion (text: 'crear', 'editar', 'eliminar', 'deshabilitar', 'publicar', 'autorizar', 'revocar', 'login', 'rate_limit_exceeded')
- entidad (text: nombre de la tabla afectada)
- entidad_id (uuid, nullable)
- datos_anteriores (jsonb, nullable)
- datos_nuevos (jsonb, nullable)
- ip (inet, nullable)
- user_agent (text, nullable)
- created_at (timestamptz, default now())

Operaciones auditables (mínimo MVP, ya definidas en F2):

- Alta/baja/deshabilitación de empresa.
- Alta/desactivación de empleado.
- Edición de cliente/vehículo/orden (solo cambios, no lecturas).
- Edición de catálogo global.
- Cambios de rol.
- Autorización/revocación de historial compartido.
- Publicación/despublicación en directorio.
- Uso de service_role.
- Login fallido y rate_limit_exceeded.

Retención: 1 año mínimo. Solo admin_general lee (RLS). INSERT vía función SECURITY DEFINER o server action con service_role (nunca desde el cliente).

### Logging y monitoreo

- Logs de Vercel para errores 500 y latencia.
- Logs de Supabase para queries lentas y errores de RLS.
- Alertas: errores 500 > 10/min, latencia p95 > 2s, intentos de login fallidos > 20/min.
- Dashboard de Vercel Speed Insights para Core Web Vitals.
### Recuperación ante incidentes

Plan de respuesta:

1. Detección: alertas de Vercel/Supabase, reporte de usuario, revisión de audit_log.
2. Contención: deshabilitar cuenta comprometida, rotar tokens, bloquear IP si aplica.
3. Erradicación: identificar causa raíz, corregir, testear, deployar.
4. Recuperación: restaurar desde backup si hay pérdida de datos, verificar integridad.
5. Lecciones aprendidas: documentar en BITACORA.md, actualizar este doc si corresponde.

Backups:

- Supabase: backups diarios automáticos (7 días en free tier, 30 días en pro).
- Export semanal a Cloudinary o S3: v2.
- Verificación de backup: mensual, restaurar en entorno de prueba y verificar integridad.

Rotación de secretos:

- Tokens de servicio (service_role, Cloudinary, Resend): cada 90 días o ante sospecha.
- Variables de entorno: nunca commitear. .env.example versionado sin valores reales.
- Rotación documentada en BITACORA.md.

Contacto de seguridad:

- Responsable: el propietario del proyecto.
- Email: (pendiente, usar el del propietario).
- Escalación: si el incidente es crítico (fuga de datos), notificar a usuarios afectados en 72h (Ley 6534/2020).

### Decisiones de F4 (por delegación)

- D-F4-1: modelo de amenazas = OWASP Top 10 completo + ASVS nivel 2 + amenazas del dominio (R7-R14).
- D-F4-2: límites de confianza = frontend no confiable, server actions confiables pero validan, Supabase confiable (RLS última línea), service_role solo server-side, terceros con permisos mínimos.
- D-F4-3: rate limiting = login 5/min IP, registro 3/min IP, recuperación 3/min IP, API 100/min usuario, crear empresa 10/min, invitar empleado 10/min, publicar directorio 20/min. Implementación: middleware + tabla rate_limit.
- D-F4-4: auditoría = tabla audit_log con 9 operaciones auditables, retención 1 año, solo admin_general lee, INSERT vía SECURITY DEFINER o server action con service_role.
- D-F4-5: recuperación = backups diarios Supabase (7 días free), rotación de secretos 90 días, plan de respuesta documentado, notificación de incidentes críticos en 72h.



## Directorio y geolocalización (F10 — 2026-10-30)

### Búsqueda por distancia

- Función SQL `buscar_establecimientos(lat, lng, radio_km, ciudad, servicio, texto)`, SECURITY DEFINER.
- Usa `earthdistance` + `cube` (extensiones nativas de PostgreSQL, gratis).
- Devuelve establecimientos dentro del radio, ordenados por distancia.
- Límite 100 resultados, rate limiting en F4 (100/min por IP).

### Geocodificación

- Nominatim (OpenStreetMap) para convertir dirección a coordenadas. Free, 1 req/segundo.
- El propietario carga la dirección, el sistema geocodifica y guarda lat/lng aproximadas (5 decimales, ~1 km de precisión).
- Si Nominatim falla, el propietario puede ajustar manualmente en un mapa Leaflet.

### Publicación

- El propietario publica/despublica su establecimiento (`publicado = true/false`).
- Admin_general puede moderar (despublicar si hay abuso).
- Función `publicar_establecimiento(id, publicado)`, SECURITY DEFINER, con verificación de autorización.

### Filtros

- Por ciudad, departamento, servicios ofrecidos (jsonb), texto libre (nombre).
- Búsqueda combinada: `ciudad = X AND servicios @> '["cambio de aceite"]'`.

### Mapa (frontend)

- Leaflet + OpenStreetMap. Sin API key.
- Componente `MapaDirectorio` con marcadores de establecimientos.
- Click en marcador → popup con nombre, dirección aproximada, teléfono.
- Geolocalización del visitante (opcional, con permiso del navegador).

### Protección frente a abuso (R10)

- Coordenadas aproximadas (5 decimales = ~1 km de precisión). No exactas.
- Rate limiting en búsquedas (100/min por IP, F4).
- No exponer email del establecimiento, solo teléfono.
- No permitir scraping masivo (rate limit + paginación).

### Decisiones de F10 (por delegación)

- D-F10-1: búsqueda por distancia con earthdistance + cube. Función SECURITY DEFINER.
- D-F10-2: geocodificación con Nominatim (OSM). 1 req/segundo. Fallback manual en mapa.
- D-F10-3: publicación/despublicación por propietario, moderación por admin_general. Función SECURITY DEFINER.
- D-F10-4: filtros por ciudad, departamento, servicios (jsonb), texto libre.
- D-F10-5: mapa con Leaflet + OpenStreetMap. Sin API key. Popup con nombre, dirección, teléfono.
- D-F10-6: coordenadas aproximadas (R10). Rate limiting (F4). No email, solo teléfono. Paginación.
## Privacidad y protección de datos (F9 — 2026-10-30)

Cumplimiento de la Ley 6534/2020 de Paraguay (Protección de Datos Personales).

### Datos personales recopilados

| Dato | Tabla | Finalidad | Retención | Acceso |
|---|---|---|---|---|
| Email | usuario, conductor | Auth, contacto | Cuenta activa | El usuario, admin_general (solo email) |
| Nombre | usuario, conductor, cliente | Identificación | Cuenta activa | El usuario, su empresa, admin_general |
| Teléfono | usuario, conductor, cliente | Contacto | Cuenta activa | El usuario, su empresa |
| Patente | vehiculo, vehiculo_conductor | Identificación del vehículo | Vehículo activo | El usuario, su empresa, conductor (sus vehículos) |
| VIN | vehiculo_identidad | Consolidación (v2) | Vehículo activo | Nadie en MVP (solo interno) |
| km_actual | vehiculo, vehiculo_conductor | Mantenimiento | Vehículo activo | El usuario, su empresa, conductor |
| IP, user agent | audit_log | Seguridad | 1 año | admin_general |
| Coordenadas aproximadas | establecimiento_publico | Directorio | Mientras publicado | Público |

### Datos que NO se recopilan

- RUC del cliente (no es persona física).
- Datos de tarjetas de crédito (no hay pagos en MVP).
- Datos biométricos.
- Geolocalización exacta del conductor (solo del establecimiento, aproximada).

### Derechos del titular (Ley 6534/2020)

- **Acceso:** el usuario ve sus datos en su perfil.
- **Rectificación:** el usuario edita sus datos.
- **Eliminación:** el usuario solicita baja. Soft delete + anonimización en 30 días.
- **Oposición:** el conductor revoca el historial compartido.
- **Portabilidad:** exportación de datos (v2).

### Consentimiento

- Registro: aceptación de términos y política de privacidad.
- Conductor: autorización explícita para compartir historial con establecimientos.
- Sin cookies de tracking en MVP.

### Seguridad de datos personales

- RLS por empresa_id (F3).
- HTTPS obligatorio (F4).
- Secretos en env (F4).
- Auditoría de accesos (F4).
- Retención definida (arriba).

### Notificación de incidentes

Si hay fuga de datos personales, notificar a los afectados en 72h (Ley 6534/2020). Documentar en BITACORA.md.

### Decisiones de F9 (por delegación)

- D-F9-1: datos personales recopilados = email, nombre, teléfono, patente, VIN (interno), km_actual, IP/user_agent (audit_log), coordenadas aproximadas. Nada más.
- D-F9-2: retención = mientras la cuenta/vehículo esté activo. audit_log 1 año. Eliminación: soft delete + anonimización en 30 días.
- D-F9-3: derechos del titular = acceso, rectificación, eliminación, oposición, portabilidad (v2).
- D-F9-4: consentimiento en registro (términos + privacidad) y en conductor (historial compartido). Sin cookies de tracking en MVP.
## Notificaciones (F11 — 2026-10-30)

**Alcance aprobado:** F11a (stub + mocks). Sin cuenta de Resend. El código funciona sin RESEND_API_KEY (modo mock) y con ella (envío real). La cuenta se crea cuando el piloto esté listo.

### Arquitectura

- **Cliente de email:** lib/email/resend.ts. Interfaz estable sendEmail({ to, subject, html, text?, idempotencyKey }). Si RESEND_API_KEY existe, envía real. Si no, log estructurado + retorno simulado. Los tests usan el modo mock.
- **Templates:** lib/email/templates/ (recordatorio-mantenimiento, bienvenida, historial-compartido). HTML mínimo, texto plano, sin dependencias nuevas.
- **Persistencia:** tabla notificacion_log (migración 013_notificaciones.sql). Registra cada envío con estado (pendiente|enviado|fallido|reintentando), intentos, ultimo_error, enviado_at.
- **Server actions:** lib/notificaciones-actions.ts. Tres acciones: enviarRecordatorioMantenimiento, enviarBienvenida, enviarHistorialCompartido. Validación Zod, rate limiting, audit_log, escritura en notificacion_log.
- **Envío programado:** cron diario (Vercel Cron o Supabase Edge Function). Lee vehículos con próximo mantenimiento vencido y encola recordatorios. Solo diseño en F11, sin despliegue.

### Idempotencia

- Columna idempotency_key UNIQUE en notificacion_log.
- Formato: tipo:refId:YYYY-MM-DD.
- Si la fila existe, no se reenvía. Evita duplicados en reintentos y en ejecuciones concurrentes del cron.

### Rate limiting

- Reutiliza check_rate_limit de F5c.
- Límites: 20 emails/día por empresa, 100/día global.
- Exceso → error controlado, no crash.

### Reintentos

- Máximo 3 intentos, backoff exponencial (1m, 5m, 30m).
- Tras 3 fallos, estado fallido y queda para revisión manual.
- Cada intento actualiza intentos y ultimo_error.

### Trazabilidad

- Cada envío escribe en notificacion_log (siempre).
- Envíos manuales (disparados por usuario) también escriben en audit_log.
- Envíos automáticos (cron) NO escriben en audit_log (ruido innecesario).

### RLS

- SELECT por empresa_id.
- INSERT/UPDATE solo server-side (service_role o SECURITY DEFINER).
- La tabla no es accesible desde otra empresa.

### Criterios de aceptación

- npm run test verde con los nuevos tests.
- npm run build verde.
- tsc --noEmit sin errores.
- Sin RESEND_API_KEY: sendEmail no falla, loguea mock, escribe en notificacion_log con estado enviado (mock).
- Idempotencia probada: mismo key no duplica fila ni email.
- Rate limit probado: excede → error controlado, no crash.
- RLS: notificacion_log no accesible desde otra empresa.
## Migraciones SQL (F5 completa — 2026-10-30)

| # | Archivo | Contenido |
|---|---|---|
| 001 | `001_empresa_establecimiento.sql` | `empresa`, `establecimiento`, trigger de creación automática de establecimiento |
| 002 | `002_usuario.sql` | `usuario` vinculado a `auth.users`, roles |
| 003 | `003_cliente.sql` | `cliente` |
| 004 | `004_vehiculo.sql` | `vehiculo`, `vehiculo_identidad` |
| 005 | `005_catalogo.sql` | `servicio_global`, `servicio_empresa`, `producto_global`, `producto_empresa` |
| 006 | `006_orden_trabajo.sql` | `orden_trabajo`, `orden_servicio`, `orden_producto` |
| 007 | `007_rls.sql` | Políticas RLS de todas las tablas |
| 008 | `008_seed.sql` | Datos iniciales del catálogo global (solo piloto) |

Las migraciones se numeran por fase (regla del studio). El número de archivo no necesariamente coincide con el número de fase del PROMPT MAESTRO.

## Operación (F13 — 2026-10-30)

Esta sección resume cómo se opera KuatiAuto en producción. El runbook detallado (procedimientos paso a paso, comandos, checklist de incidentes, plan de recuperación) vive en `docs/proyecto/MANTENIMIENTO.md`. Aquí solo se documenta el contrato operativo y su trazabilidad a decisiones.

### Decisiones operativas

- **D-F13-1 — Entornos.** Tres entornos: local (dev), preview (Vercel por PR), prod (Vercel `main` + Supabase prod). Un único proyecto Supabase en MVP; branching diferido a v2.
- **D-F13-2 — Backups.** Supabase backup diario automático + export lógico semanal a almacenamiento externo (script manual documentado). Retención 30 días. Prueba de restauración trimestral documentada.
- **D-F13-3 — Monitorización.** Vercel Analytics (Web Vitals + logs) + Sentry free tier para errores de servidor y cliente (diseñado, no configurado en MVP). Alertas por email al propietario.
- **D-F13-4 — Incidentes.** Tres severidades: S1 (caída total o pérdida de datos) respuesta < 2 h; S2 (funcionalidad crítica degradada) < 24 h; S3 (bug menor o cosmético) próximo sprint. Canal único: email + WhatsApp del propietario. Post-mortem obligatorio para S1.
- **D-F13-5 — Continuidad.** RTO 24 h, RPO 24 h. Accesos críticos (Vercel, Supabase, GitHub, dominio `.com.py`, Resend) en gestor de contraseñas del propietario con 2FA. Plan de recuperación documentado en `MANTENIMIENTO.md`.

### Referencias

- Runbook operativo completo: `docs/proyecto/MANTENIMIENTO.md`.
- Decisiones registradas: `docs/contexto/DECISIONES.md` (D-F13-1..5).
- Plan de fase: `docs/proyecto/F13-PLAN.md`.

## Flujos principales

Ver `SPEC.md` sección 9 "Flujos del MVP".

## Deuda y decisiones abiertas

- `STATUS.md` vs `SESSION-STATE.md`: `SESSION-STATE.md` es el operativo, `STATUS.md` es macro.
- Estructura de `app/` con route groups: se confirma en F3.
- Renombrar `clientes` a `establecimientos` en el scaffold: F3.
- `vehiculo_identidad`: decidir en F5 si se puebla automáticamente por trigger o en server action.
- Catálogo global seed: contenido exacto de los ~20-30 servicios/productos → F6.
