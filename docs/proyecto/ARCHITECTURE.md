# ARCHITECTURE — KuatiAuto (provisional)

**Actualizado:** 2026-10-30

## Stack Tecnológico

- **Framework:** Next.js 16 (App Router, Turbopack).
- **Lenguaje:** TypeScript + React 19.
- **Estilos:** Tailwind CSS 4.
- **Base de Datos:** Supabase (PostgreSQL 15 + RLS).
- **Autenticación:** Supabase Auth (email/password).
- **Validación:** Zod (cliente y servidor).
- **Tests:** Vitest + Testing Library.
- **Deploy:** Vercel + Supabase cloud.

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
## Migraciones SQL (plan preliminar, DDL exacto en F5)

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

## Flujos principales

Ver `SPEC.md` sección 9 "Flujos del MVP".

## Deuda y decisiones abiertas

- `STATUS.md` vs `SESSION-STATE.md`: `SESSION-STATE.md` es el operativo, `STATUS.md` es macro.
- Estructura de `app/` con route groups: se confirma en F3.
- Renombrar `clientes` a `establecimientos` en el scaffold: F3.
- `vehiculo_identidad`: decidir en F5 si se puebla automáticamente por trigger o en server action.
- Catálogo global seed: contenido exacto de los ~20-30 servicios/productos → F6.