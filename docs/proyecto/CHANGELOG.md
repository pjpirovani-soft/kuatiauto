# CHANGELOG — KuatiAuto (provisional)

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