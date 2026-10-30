# CHANGELOG — KuatiAuto (provisional)

Registro de cambios por fase. Formato: Keep a Changelog adaptado. Fechas en ISO 8601.

## [F11] — 2026-10-30 — Notificaciones (docs)

### Added
- `docs/proyecto/F11-PLAN.md`: alcance F11a (stub + mocks), qué incluye, qué no, orden de implementación, criterios de aceptación.
- `ARCHITECTURE.md` §Notificaciones: cliente Resend con fallback mock, templates, tabla `notificacion_log`, server actions, cron (diseño), idempotencia, rate limiting, reintentos, trazabilidad, RLS.
- `DECISIONES.md` D-F11-1 a D-F11-5 (PROPUESTA).

### Changed
- `ROADMAP.md`: F11 marcado como EN PROGRESO con docs 5a-5b; F11-PLAN.md como doc principal.
- `SESSION-STATE.md`: D-F11-* como PROPUESTA; próximos 3 pasos actualizados.

### Pending (código F11)
- Migración `013_notificaciones.sql`.
- `lib/email/resend.ts` (cliente + mock).
- `lib/email/templates/` (3 templates).
- `lib/notificaciones-actions.ts` (3 actions).
- Tests con mocks.
- `next build` + `vitest run` verde.
- Cierre de F11.

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