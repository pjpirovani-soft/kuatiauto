# Session State â€” KuatiAuto (provisional)

**Actualizado:** 2026-10-30

> Este archivo es el handoff entre sesiones. Leerlo primero al arrancar. Actualizarlo al cerrar.

## Estado actual (30 segundos)

- **Fase:** F12 — Modelo comercial (COMPLETADA 2026-10-30). F13 siguiente.
- **Trabajando en:** F12 cerrada. D-F12-1..5 APROBADAS. F13 — Operacion y continuidad siguiente.
- **Bloqueado por:** nada. Decisiones pendientes: verificar redes/DINAPI de KuatiAuto, confirmar datos del piloto.

## Alcance MVP (confirmado 2026-10-30)

Los 4 componentes del PROMPT MAESTRO entran en MVP:
1. SaaS de gestiÃ³n multiempresa (incluye inventario y movimientos de stock).
2. Directorio pÃºblico de establecimientos.
3. Portal del conductor.
4. CatÃ¡logo automotriz tÃ©cnico completo (fabricantes, marcas, modelos, motores, especificaciones, fuentes).

## Open Loops (acciones sin verificar)

- [ ] Verificar `@kuatiauto` en Instagram, Facebook, TikTok.
- [ ] Verificar `KuatiAuto` en DINAPI (clases 9, 35, 42).
- [ ] Confirmar los 5 campos crÃ­ticos del piloto en `CLIENTE.md`.
- [ ] Confirmar si el catÃ¡logo completo es viable con datos reales del piloto (F6).

## Follow-ups (tareas diferidas)

- [ ] Registrar `kuatiauto.com.py` cuando el piloto justifique el costo (verificado disponible 2026-10-30).
- [ ] Renombrar `clientes` a `establecimientos` en el scaffold (F3).
- [ ] Decidir estructura final de `app/` con route groups (F3).
- [ ] Definir fuentes y proceso de validaciÃ³n del catÃ¡logo automotriz (F6).

## Decisiones de la sesiÃ³n (2026-10-30)

### MetodologÃ­a y nombre

- **D-A:** alinear studio a metodologÃ­a ENC. Aprobado.
- **D-B:** seguridad integrada en ARCHITECTURE + SPEC + BITACORA + SESSION-STATE. Sin SEGURIDAD.md. Aprobado.
- **D-C:** CLIENTE.md provisional con `[PENDIENTE]`. Aprobado.
- **D-D:** `KuatiAuto` es nombre de trabajo, no comercial definitivo. Aprobado.

### Producto (F1) â€” APROBADO 2026-10-30

- **P-Alcance-MVP:** los 4 componentes del PROMPT MAESTRO (gestiÃ³n + directorio + portal + catÃ¡logo + inventario) son MVP. Directorio y portal no son v2.
- **P-CatÃ¡logo:** catÃ¡logo completo desde MVP (fabricantes, marcas, modelos, aÃ±os, versiones, motorizaciones, cilindradas, combustibles, SAE, API, ACEA, aprobaciones, capacidades, intervalos). Con fuentes y validaciÃ³n.
- **P-Inventario:** inventario y movimientos de stock en MVP.

### ADRs

- **ADR-001:** repo Ãºnico modular. Aprobado.
- **ADR-002:** vehÃ­culo hÃ­brido. Aprobado.
- **ADR-003:** piloto provisional. Aprobado.
- **ADR-004:** nombre KuatiAuto provisional. Aprobado.
- **ADR-005:** catÃ¡logo hÃ­brido global + local. Aprobado.
- **ADR-006:** productos y servicios en tablas aparte. Aprobado.

### Riesgos cerrados / abiertos

- **R5 (alcance MVP inflado):** cerrado por P-Alcance-MVP.
- **R1, R2, R3, R4, R6-R14:** abiertos, con fase asignada.

## Decisiones de F11 (2026-10-30, PROPUESTA)

- D-F11-1: mecanismo de envÃ­o = Vercel Cron.
- D-F11-2: idempotencia = idempotency_key UNIQUE (tipo:refId:YYYY-MM-DD).
- D-F11-3: rate limiting = check_rate_limit (20/dÃ­a empresa, 100/dÃ­a global).
- D-F11-4: reintentos = 3, backoff 1m/5m/30m, luego fallido.
- D-F11-5: trazabilidad = notificacion_log (siempre) + audit_log (solo manuales).
- Estado: APROBADA (2026-10-30).

## Proximos 3 pasos

1. Arrancar F12 - Modelo comercial (suscripciones, planes, limites, premium).
2. F13 - Operacion y continuidad (runbook).
3. F14 - Plan de implementacion.

## Deuda F11 (anotada)

- empresa_id: null en notificaciones-actions: TODO F12 (cablear al piloto).
- SUPABASE_SERVICE_ROLE_KEY no seteada: notificacion_log no persiste hasta configurarla.
- RESEND_API_KEY no seteada: sendEmail en modo mock.
- Tipos Supabase no regenerados: regenerar con supabase gen types al aplicar 013.
- Reintentos (D-F11-4) y cron (D-F11-1): disenados, no implementados en codigo (F12+).

## Nota metodolÃ³gica

- Este proyecto heredÃ³ la metodologÃ­a alineada del studio el 2026-10-30 (commit 72da08e).
- Docs deprecados a NO generar: DECISIONES.md viejo, SEGURIDAD.md, TESTS.md, AUDITORIA.md, CONVENCIONES.md.
- Doc nuevo: DECISIONES.md (registro A/B/C/D), PROMPT-MAESTRO.md (fuente de verdad), ROADMAP.md (hoja de ruta).