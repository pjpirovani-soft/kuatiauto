# IMPLEMENTATION PLAN — KuatiAuto

**Generado:** 2026-10-30 (F14).
**Propósito:** plan de implementación de módulos. Es el entregable principal de F14 y habilita la escritura de código.
**Fuentes:** PROMPT-MAESTRO.md, ROADMAP.md, ARCHITECTURE.md (gate de seguridad), SPEC.md, DECISIONES.md (D-P1, D-F14-1..5), migraciones 001-013.
**Regla dura:** ningún módulo se escribe sin pasar el gate de seguridad de 10 puntos (§6).

## §1 Principios

1. **Fase-por-módulo.** Un módulo no arranca hasta que el anterior en el grafo (§3) esté `completo` o `wip` con autorización explícita.
2. **Gate de seguridad obligatorio.** Sin los 10 puntos de §6, el módulo se commitea como `wip`, no como `completo`.
3. **Sin fechas absolutas.** Estimación relativa S/M/L/XL. Re-estimación al cierre de cada etapa.
4. **Migraciones por fase.** Las 13 actuales (001-013) son la base. Cada etapa que agregue tablas las numera siguiendo la convención.
5. **Tests obligatorios.** Vitest unitario + integración RLS (prueba cruzada A/B) cuando el módulo toque tablas multi-tenant.
6. **Idempotencia y trazabilidad.** Server actions con Zod + rate limit + audit_log cuando aplique (D-F2-3, D-F4-4).
7. **No se inventan datos.** Catálogo, fuentes, pilotos: `[PENDIENTE]` antes que inventar (ADR-005, F6a).
8. **Docs actualizados en el mismo commit.** BITACORA, CHANGELOG, SESSION-STATE, STATUS se actualizan con cada módulo cerrado.

## §2 Etapas y módulos

| Etapa | Módulos | Objetivo | Esfuerzo |
|---|---|---|---|
| **E1 — Fundamentos** | auth completo (registro/login/reset/confirmación con Resend), multiempresa (crear empresa + establecimiento vía `crear_empresa_con_establecimiento`), sesión SSR con `@supabase/ssr`, shell + route groups + layout base, middleware rate limiting, hooks de audit_log | SaaS usable end-to-end para un propietario que se registra y crea empresa | L |
| **E2 — Gestión core** | clientes (CRUD), vehículos (CRUD + `vehiculo_identidad` por trigger), órdenes de trabajo (CRUD + `orden_servicio` + `orden_producto`), cálculo de `importe_total`, próximo mantenimiento sugerido, empleados (invitación vía Resend) | Dueño de lubricentro gestiona clientes, vehículos y órdenes | XL |
| **E3 — Catálogo + stock** | catálogo global (lectura), catálogo local (CRUD por empresa), inventario + `stock_movimiento` + triggers, alertas de stock bajo, seed del catálogo automotriz verificado (F6b) | Órdenes con servicios/productos del catálogo + control de stock | L |
| **E4 — Directorio + portal** | directorio público (búsqueda por distancia, Leaflet, geocodificación Nominatim), publicación/moderación, portal del conductor (registro, mis vehículos, historial compartido, autorización/revocación) | El negocio es descubrible; el conductor ve su historial | L |
| **E5 — Notificaciones + admin** | cron de recordatorios (Vercel Cron), reintentos + backoff, panel admin (empresas, catálogo, moderación), Sentry configurado, Vercel Analytics activado | Producto operativo con recordatorios automáticos y administración | M |
## §3 Dependencias (grafo)

```
E1 (auth + multiempresa + shell)
 └─ E2 (clientes, vehículos, órdenes, empleados)
     ├─ E3 (catálogo local, stock)
     ├─ E4 (directorio, portal)
     └─ E5 (cron notif, admin)
```

**Regla:** ningún módulo arranca si sus predecesores en el grafo no están `completo` (o `wip` con autorización explícita del propietario en BITACORA).

**Reordenamiento:** si el piloto pide directorio antes de E3, se reordena con aprobación explícita y se registra en BITACORA. Por defecto: E1 → E2 → E3 → E4 → E5.

## §4 Prioridades

| Prioridad | Módulos |
|---|---|
| **Must (MVP, D-P1)** | auth, multiempresa, clientes, vehículos, órdenes, catálogo (global lectura + local CRUD), stock, directorio, portal, notificaciones básicas, admin mínimo |
| **Should (MVP tardío / v2 temprano)** | alertas stock bajo, moderación avanzada, export, reportes |
| **Could (v2)** | multi-empresa por usuario, Mapbox, portabilidad de datos, catálogo CSV, verificador_catalogo separado |

## §5 Entregables por etapa

El detalle de entregables por etapa (qué incluye cada una) está en `F14-PLAN.md` §"Entregables por etapa". No se duplica acá.`n
Checklist genérico aplicable a **cada** etapa antes de marcarla completo:

- [ ] Migraciones aplicadas (nº de la etapa) + tipos Supabase regenerados (`supabase gen types`).
- [ ] Server actions con Zod + rate limit + `audit_log` cuando aplique.
- [ ] Componentes UI (server + client mínimos).
- [ ] Tests unitarios (Vitest) + tests de integración RLS (prueba cruzada A/B) cuando toque tablas multi-tenant.
- [ ] Docs: entrada en BITACORA, CHANGELOG, SESSION-STATE, STATUS.
- [ ] Verificación: `npm run test`, `tsc --noEmit`, `next build`.
- [ ] Gate de seguridad de 10 puntos (§6).
- [ ] `.env.example` actualizado si hay variables nuevas.

## §6 Criterios de "módulo completo" (gate de 10 puntos)

El detalle de los 10 puntos está en `ARCHITECTURE.md` §"Gate de seguridad por módulo". No se duplica acá. Resumen operativo:

1. Activos y datos que maneja → listados en ARCHITECTURE.md.
2. Usuarios y roles con acceso → matriz en `SPEC.md` actualizada.
3. Operaciones permitidas/prohibidas → explícitas.
4. Amenazas específicas del módulo → agregadas a ARCHITECTURE.md.
5. Controles implementados → referenciados con archivo:línea.
6. RLS y permisos BD revisados → captura en ARCHITECTURE.md.
7. Autorización backend verificada → prueba con usuario sin permiso.
8. Pruebas positivas y negativas → en BITACORA.md, verdes.
9. Prueba cruzada entre dos empresas (módulos multi-tenant) → en BITACORA.md, verde.
10. Hallazgos → en BITACORA.md con severidad. Críticos y altos bloquean el cierre salvo aceptación explícita en SESSION-STATE.md.

**Regla:** sin los 10 verdes, el módulo se commitea como `wip` con nota en `STATUS.md`, no como `completo`.

## §7 Estimación relativa (D-F14-4)

- **S** = <=1 sesión.
- **M** = 2-3 sesiones.
- **L** = 4-6 sesiones.
- **XL** = >6 sesiones.

Re-estimación al cierre de cada etapa. Solo se planifica etapa en curso + siguiente.

| Etapa | Estimación inicial | Notas |
|---|---|---|
| E1 | L | Auth + multiempresa + shell + rate limit. Primer código real de módulos. |
| E2 | XL | El más grande. Si desborda, subdividir en E2a (clientes+vehículos) y E2b (órdenes+empleados). |
| E3 | L | Catálogo + stock. F6b puede quedar `wip`. |
| E4 | L | Directorio + portal. Leaflet + Nominatim ya diseñados (F10). |
| E5 | M | Cron + admin + Sentry. |

## Apéndice A — Correspondencia módulo ↔ tablas (migraciones 001-013)

| Módulo | Tablas principales | Migración |
|---|---|---|
| auth | `auth.users` (Supabase), `usuario` | 002 |
| multiempresa | `empresa`, `establecimiento` | 001 |
| clientes | `cliente` | 003 |
| vehículos | `vehiculo`, `vehiculo_identidad` | 004 |
| catálogo | `servicio_global`, `servicio_empresa`, `producto_global`, `producto_empresa` | 005 |
| órdenes | `orden_trabajo`, `orden_servicio`, `orden_producto` | 006 |
| stock | `stock_movimiento` | 006 |
| directorio | `establecimiento_publico` | 008, 012 |
| portal | `conductor`, `vehiculo_conductor`, `historial_compartido` | 008 |
| notificaciones | `notificacion_log` | 013 |
| seguridad/audit | `audit_log`, `rate_limit` | 009, 010 |

## Apéndice B — Correspondencia módulo ↔ decisiones

| Módulo | Decisiones aplicables |
|---|---|
| auth | D-F2-2 (Supabase Auth + doble capa), D-F4-3 (rate limit login) |
| multiempresa | D-F3-1..5 (RLS por `empresa_id`, SECURITY DEFINER), D-F5a-2 (trigger) |
| clientes/vehículos | D-F3-2 (RLS), D-F5b-2 (coordenadas aproximadas si aplica) |
| órdenes | D-F1-2 (9 campos, tablas aparte), ADR-006 |
| catálogo | ADR-005 (híbrido), D-F6-1..4 (fuentes, validación) |
| stock | D-F5a-2 (`actualizar_stock`) |
| directorio | D-F10-1..6 (búsqueda, Nominatim, publicación, R10) |
| portal | D-F2-4 (historial compartido), D-F5b-3 (conductor), R8 |
| notificaciones | D-F11-1..5 (cron, idempotencia, rate limit, reintentos, trazabilidad) |
| admin | D-F4-4 (audit_log), D-F10-3 (moderación) |
| operación | D-F13-1..5 (entornos, backups, monitorización, incidentes, continuidad) |

**Nota:** los apéndices C (deuda técnica) y D (riesgos R7-R14) no se duplican acá. Viven en `CONTINUACION.md` §Deuda y en `ARCHITECTURE.md` §Modelo de amenazas respectivamente.
