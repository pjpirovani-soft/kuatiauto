# Changelog — KuatiAuto (provisional)

Formato basado en Keep a Changelog y Semantic Versioning.

## [0.0.12] - 2026-10-30

### Added
- Fase 8: costes y sostenibilidad.
- BUSINESS-LOGIC.md: free tiers del stack, escenarios (prueba, primeros establecimientos, crecimiento moderado, crecimiento importante), regla de oro (todo free tier, no pagar por adelantado).
- DECISIONES.md: D-F8-1 a D-F8-3.

### Closed
- F8 — Costes y sostenibilidad.
## [0.0.11] - 2026-10-30

### Added
- Fase 7: stack tecnológico (justificación).
- ARCHITECTURE.md: stack core justificado (Next.js, React, TypeScript, Tailwind, Supabase, Zod, Vitest, Vercel), servicios externos (Resend, Leaflet+OSM, Vercel Analytics, Sentry, GitHub Actions), variables de entorno.
- DECISIONES.md: D-F7-1 a D-F7-4.

### Closed
- F7 — Stack tecnológico: justificación.
## [0.0.10] - 2026-10-30

### Added
- Fase 6a: catálogo automotriz (fuentes y validación).
- BUSINESS-LOGIC.md: jerarquía de fuentes (1-3 aceptables, 4 no), proceso de validación, alcance inicial (10 fabricantes, 2-3 modelos), proceso de carga.
- DECISIONES.md: D-F6-1 a D-F6-4.

### Closed
- F6 — Catálogo automotriz: fuentes y validación.
## [0.0.9] - 2026-10-30

### Added
- Fase 5c: RLS, audit_log, rate_limit y seed. Migraciones 009-011.
- audit_log: 9 operaciones auditables, retención 1 año.
- rate_limit: check_rate_limit + cleanup_rate_limit.
- RLS habilitado en todas las tablas (010). 2 helpers: current_empresa_id, is_admin_general.
- Seed: 15 fabricantes, 5 marcas, 3 modelos, 10 servicios, 8 productos (marcas [PENDIENTE]).
- DECISIONES.md: D-F5c-1 a D-F5c-3.

### Closed
- F5 — Modelo de datos (11 migraciones, ~49 KB de SQL).
## [0.0.8] - 2026-10-30

### Added
- Fase 5b: catálogo automotriz, directorio y portal. Migraciones 007-008.
- Catálogo: fabricante, marca, modelo, version, motorizacion, especificacion_lubricante (con fuente, fecha, estado de validación), servicio_global, servicio_empresa, producto_global.
- Directorio: establecimiento_publico (coordenadas aproximadas, servicios, horarios).
- Portal: conductor, vehiculo_conductor, historial_compartido.
- Trigger handle_new_conductor.
- DECISIONES.md: D-F5b-1 a D-F5b-3.

### In Progress
- F5 — Modelo de datos (F5a y F5b completadas, F5c pendiente).
## [0.0.7] - 2026-10-30

### Added
- Fase 5a: modelo de datos (gestión). Migraciones 001-006 en supabase/migrations/.
- Tablas: empresa, establecimiento, usuario, cliente, vehiculo, vehiculo_identidad, orden_trabajo, orden_servicio, orden_producto, producto_empresa, stock_movimiento.
- Triggers y funciones: set_updated_at, handle_new_user, crear_empresa_con_establecimiento (SECURITY DEFINER), poblar_vehiculo_identidad, actualizar_stock.
- DECISIONES.md: D-F5a-1 a D-F5a-3.

### In Progress
- F5 — Modelo de datos (F5a completada, F5b/F5c pendientes).
## [0.0.6] - 2026-10-30

### Added
- Fase 4: arquitectura de seguridad.
- ARCHITECTURE.md sección Seguridad ampliada: modelo de amenazas (OWASP Top 10 + ASVS nivel 2 + dominio), límites de confianza, rate limiting, auditoría (audit_log), logging y monitoreo, recuperación ante incidentes.
- DECISIONES.md: D-F4-1 a D-F4-5.

### Closed
- F4 — Arquitectura de seguridad.
## [0.0.5] - 2026-10-30

### Added
- Fase 3: arquitectura multiempresa.
- ARCHITECTURE.md sección Multiempresa: modelo empresa/establecimiento/usuario, estrategia RLS por tabla, SECURITY DEFINER (crear_empresa_con_establecimiento), pruebas cruzadas (gate de seguridad), aislamiento entre roles.
- DECISIONES.md: D-F3-1 a D-F3-5.

### Closed
- F3 — Arquitectura multiempresa.
## [0.0.4] - 2026-10-30

### Added
- Fase 2: usuarios, roles y permisos.
- `SPEC.md` sección 3: roles definitivos (admin_general, propietario, empleado, conductor, visitante), matriz de permisos (20 entidades × 5 roles), reglas de negocio por rol, operaciones auditables.
- `ARCHITECTURE.md` sección Autorización: authn/authz (doble capa RLS + server actions), modelo de aislamiento multiempresa, operaciones auditables, reglas que condicionan RLS.
- `DECISIONES.md`: D-F2-1 a D-F2-5.

### Closed
- F2 — Usuarios, roles y permisos.
## [0.0.3] - 2026-10-30

### Added
- `PROMPT-MAESTRO.md`: documento fundacional del proyecto.
- `ROADMAP.md`: hoja de ruta de 14 fases con estado y dependencias.
- `DECISIONES.md`: registro A/B/C/D de decisiones.

### Changed
- Alcance MVP confirmado: los 4 componentes del PROMPT MAESTRO (gestión + directorio + portal + catálogo + inventario).
- `SPEC.md` sección 2 actualizada.
- D-P1 (recorte a gestión + catálogo mínimo) revertida. El alcance es el del PROMPT MAESTRO.

### Closed
- F1 — Definición del producto.
## [0.0.2] - 2026-10-30

### Added
- Fase 1: definición de producto y alcance MVP.
- `SPEC.md` sección 9: flujos del MVP (7 pasos del camino feliz + flujos secundarios).
- `SPEC.md` sección 10: modelo de datos preliminar (13 entidades).
- `SPEC.md` sección 11: criterios de aceptación del MVP (funcionales, seguridad, calidad).
- `ARCHITECTURE.md`: ADR-005 (catálogo híbrido), ADR-006 (productos/servicios en tablas aparte), plan de migraciones SQL (001-008).
- `GLOSARIO.md`: términos nuevos (orden_servicio, orden_producto, servicio_global, servicio_empresa, producto_global, producto_empresa, seed).
- `SESSION-STATE.md`: decisiones D-F1-1, D-F1-2, D-F1-3.

### Closed
- R5 (alcance MVP inflado).

## [0.0.1] - 2026-10-30

### Added
- Fase 0: punto de partida arquitectónico.
- `ARCHITECTURE.md`: stack, ADRs 001-004, sección Seguridad con 10 fundamentos, gate por módulo.
- `SPEC.md`: alcance MVP, riesgos R1-R14, criterios vacíos, 14 fases.
- `SESSION-STATE.md`: estado, open loops, follow-ups, decisiones, próximos 3 pasos.
- `CLIENTE.md`: piloto provisional con 5 campos `[PENDIENTE]`.
- `GLOSARIO.md`: términos base (empresa, establecimiento, vehículo, orden de trabajo, catálogo, RLS, tenant).
- `BITACORA.md`: entrada Fase 0.

### Notes
- Nombre `KuatiAuto` provisional. Dominio `kuatiauto.com.py` verificado disponible (NIC.py), sin registrar.
- Metodología heredada del studio (commit 72da08e). Docs deprecados no se generan.
- Scaffold `web-app` (auth + CRUD + RLS de ejemplo) queda intacto hasta F3.