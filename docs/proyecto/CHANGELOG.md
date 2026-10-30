# CHANGELOG â€” KuatiAuto (provisional)

Registro de cambios por fase. Formato: Keep a Changelog adaptado. Fechas en ISO 8601.

## [F11] - 2026-10-30 - Notificaciones (stub + mocks) - COMPLETADA

### Added
- `docs/proyecto/F11-PLAN.md`: alcance F11a (stub + mocks), quÃ© incluye, quÃ© no, orden de implementaciÃ³n, criterios de aceptaciÃ³n.
- `ARCHITECTURE.md` Â§Notificaciones: cliente Resend con fallback mock, templates, tabla `notificacion_log`, server actions, cron (diseÃ±o), idempotencia, rate limiting, reintentos, trazabilidad, RLS.
- `DECISIONES.md` D-F11-1 a D-F11-5 (PROPUESTA).

### Changed
- `ROADMAP.md`: F11 marcado como EN PROGRESO con docs 5a-5b; F11-PLAN.md como doc principal.
- `SESSION-STATE.md`: D-F11-* como PROPUESTA; prÃ³ximos 3 pasos actualizados.

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

## [F10] â€” 2026-10-30 â€” Directorio y geolocalizaciÃ³n

Ver `BITACORA.md` Â§Fase 10. Resumen: bÃºsqueda por distancia (earthdistance + cube), Leaflet + OSM, migraciÃ³n `012_busqueda_directorio.sql`, `lib/directorio-actions.ts`, `components/directorio/MapaDirectorio.tsx`, `app/(directorio)/page.tsx`.

## [F9] â€” 2026-10-30 â€” Privacidad y protecciÃ³n de datos

Ver `BITACORA.md` Â§Fase 9. Ley 6534/2020, retenciÃ³n, derechos, consentimientos.

## [F8] â€” 2026-10-30 â€” Costes y sostenibilidad

Ver `BITACORA.md` Â§Fase 8. Free tier, Ãºnico costo real: dominio `.com.py`.

## [F7] â€” 2026-10-30 â€” Stack tecnolÃ³gico

Ver `BITACORA.md` Â§Fase 7. Next.js 16, React 19, Tailwind 4, Supabase, Zod, Vitest, Vercel, Resend, Leaflet + OSM, Vercel Analytics, Sentry, GitHub Actions.

## [F6a] â€” 2026-10-30 â€” CatÃ¡logo automotriz

Ver `BITACORA.md` Â§Fase 6a. Fuentes aceptables niveles 1-3, validaciÃ³n por admin_general, alcance inicial acotado.

## [F5] â€” 2026-10-30 â€” Modelo de datos (F5a, F5b, F5c)

Ver `BITACORA.md` Â§Fases 5a, 5b, 5c. Migraciones 001-006, RLS, audit_log, rate_limit, seed del catÃ¡logo.

## [F4] â€” 2026-10-30 â€” Arquitectura de seguridad

Ver `BITACORA.md` Â§Fase 4. OWASP Top 10 + ASVS nivel 2, lÃ­mites de confianza, rate limiting, auditorÃ­a, recuperaciÃ³n.

## [F3] â€” 2026-10-30 â€” Arquitectura multiempresa

Ver `BITACORA.md` Â§Fase 3. RLS por empresa_id, SECURITY DEFINER, pruebas cruzadas.

## [F2] â€” 2026-10-30 â€” Usuarios, roles y permisos

Ver `BITACORA.md` Â§Fase 2. Roles MVP: admin_general, propietario, empleado, conductor, visitante.

## [F1] â€” 2026-10-30 â€” DefiniciÃ³n del producto

Ver `BITACORA.md` Â§Fase 1. Alcance MVP confirmado: gestiÃ³n + directorio + portal + catÃ¡logo + inventario.

## [F0] â€” 2026-10-30 â€” Punto de partida

Ver `BITACORA.md` Â§Fase 0. MetodologÃ­a, nombre provisional, repo Ãºnico modular.