# Session State — KuatiAuto (provisional)

**Actualizado:** 2026-10-30

> Este archivo es el handoff entre sesiones. Leerlo primero al arrancar. Actualizarlo al cerrar.

## Estado actual (30 segundos)

- **Fase:** E1 — Fundamentos (WIP 2026-10-30). F0-F14 COMPLETADAS.
- **Trabajando en:** E1 Fundamentos (WIP). Hecho: auth completo, rate limiting, multiempresa, audit hooks, cableado empresa_id, route group (dashboard), .env.example, .gitignore, STATUS/BITACORA/CHANGELOG actualizados. Falta: commit de cierre E1, tests de rate-limit/empresa-actions (E2), prueba cruzada A/B (Supabase real).
- **Falta E1:** commit de cierre. Tests diferidos a E2. Gate 10 puntos parcial (1-7 ok, 8-10 pendientes por Supabase real).
- **Bloqueado por:** nada. Decisiones F14: D-F14-1..n en PROPUESTA (definir en F14-PLAN.md, aprobar al cierre).
## Alcance MVP (confirmado 2026-10-30)

Los 4 componentes del PROMPT MAESTRO entran en MVP:
1. SaaS de gestión multiempresa (incluye inventario y movimientos de stock).
2. Directorio público de establecimientos.
3. Portal del conductor.
4. Catálogo automotriz técnico completo (fabricantes, marcas, modelos, motores, especificaciones, fuentes).

## Open Loops (acciones sin verificar)

- [ ] Verificar `@kuatiauto` en Instagram, Facebook, TikTok.
- [ ] Verificar `KuatiAuto` en DINAPI (clases 9, 35, 42).
- [ ] Confirmar los 5 campos críticos del piloto en `CLIENTE.md`.
- [ ] Confirmar si el catálogo completo es viable con datos reales del piloto (F6).

## Follow-ups (tareas diferidas)

- [ ] Registrar `kuatiauto.com.py` cuando el piloto justifique el costo (verificado disponible 2026-10-30).
- [ ] Renombrar `clientes` a `establecimientos` en el scaffold (F3).
- [ ] Decidir estructura final de `app/` con route groups (F3).
- [ ] Definir fuentes y proceso de validación del catálogo automotriz (F6).

## Decisiones de la sesión (2026-10-30)

### Metodología y nombre

- **D-A:** alinear studio a metodología ENC. Aprobado.
- **D-B:** seguridad integrada en ARCHITECTURE + SPEC + BITACORA + SESSION-STATE. Sin SEGURIDAD.md. Aprobado.
- **D-C:** CLIENTE.md provisional con `[PENDIENTE]`. Aprobado.
- **D-D:** `KuatiAuto` es nombre de trabajo, no comercial definitivo. Aprobado.

### Producto (F1) — APROBADO 2026-10-30

- **P-Alcance-MVP:** los 4 componentes del PROMPT MAESTRO (gestión + directorio + portal + catálogo + inventario) son MVP. Directorio y portal no son v2.
- **P-Catálogo:** catálogo completo desde MVP (fabricantes, marcas, modelos, años, versiones, motorizaciones, cilindradas, combustibles, SAE, API, ACEA, aprobaciones, capacidades, intervalos). Con fuentes y validación.
- **P-Inventario:** inventario y movimientos de stock en MVP.

### ADRs

- **ADR-001:** repo único modular. Aprobado.
- **ADR-002:** vehículo híbrido. Aprobado.
- **ADR-003:** piloto provisional. Aprobado.
- **ADR-004:** nombre KuatiAuto provisional. Aprobado.
- **ADR-005:** catálogo híbrido global + local. Aprobado.
- **ADR-006:** productos y servicios en tablas aparte. Aprobado.

### Riesgos cerrados / abiertos

- **R5 (alcance MVP inflado):** cerrado por P-Alcance-MVP.
- **R1, R2, R3, R4, R6-R14:** abiertos, con fase asignada.

## Decisiones de F11 (2026-10-30, PROPUESTA)

- D-F11-1: mecanismo de envío = Vercel Cron.
- D-F11-2: idempotencia = idempotency_key UNIQUE (tipo:refId:YYYY-MM-DD).
- D-F11-3: rate limiting = check_rate_limit (20/día empresa, 100/día global).
- D-F11-4: reintentos = 3, backoff 1m/5m/30m, luego fallido.
- D-F11-5: trazabilidad = notificacion_log (siempre) + audit_log (solo manuales).
- Estado: APROBADA (2026-10-30).

## Proximos 3 pasos

1. Commit de cierre E1 (STATUS, BITACORA, CHANGELOG, SESSION-STATE, ROADMAP + codigo).
2. Arrancar E2 - Gestion core (clientes, vehiculos, ordenes, empleados).
3. Tests de rate-limit/empresa-actions diferidos a E2. Prueba cruzada A/B cuando haya Supabase real.
## Deuda F11 (anotada)

- empresa_id: null en notificaciones-actions: TODO F12 (cablear al piloto).
- SUPABASE_SERVICE_ROLE_KEY no seteada: notificacion_log no persiste hasta configurarla.
- RESEND_API_KEY no seteada: sendEmail en modo mock.
- Tipos Supabase no regenerados: regenerar con supabase gen types al aplicar 013.
- Reintentos (D-F11-4) y cron (D-F11-1): disenados, no implementados en codigo (F12+).

## Nota metodológica

- Este proyecto heredó la metodología alineada del studio el 2026-10-30 (commit 72da08e).
- Docs deprecados a NO generar: DECISIONES.md viejo, SEGURIDAD.md, TESTS.md, AUDITORIA.md, CONVENCIONES.md.
- Doc nuevo: DECISIONES.md (registro A/B/C/D), PROMPT-MAESTRO.md (fuente de verdad), ROADMAP.md (hoja de ruta).
## Deuda F13 (anotada)

- D-F13-1..5 en estado PROPUESTA. Aprobar al cierre.
- Sentry free tier: disenado, no configurado (D-F13-3).
- Almacenamiento externo de exports: script manual documentado en MANTENIMIENTO.md, no automatizado.
- Prueba de restauracion trimestral: proceso documentado, no ejecutado aun.
- 2FA en gestor de contrasenas: requiere accion del propietario.