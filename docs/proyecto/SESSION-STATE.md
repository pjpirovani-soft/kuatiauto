# Session State — KuatiAuto (provisional)

**Actualizado:** 2026-10-30

> Este archivo es el handoff entre sesiones. Leerlo primero al arrancar. Actualizarlo al cerrar.

## Estado actual (30 segundos)

- **Fase:** F1 — Definición de producto y alcance MVP (completada).
- **Trabajando en:** preparación de F2 (usuarios, roles y permisos).
- **Bloqueado por:** nada. Decisiones pendientes: verificar redes/DINAPI de KuatiAuto, confirmar datos del piloto.

## Open Loops (acciones sin verificar)

- [ ] Verificar `@kuatiauto` en Instagram, Facebook, TikTok.
- [ ] Verificar `KuatiAuto` en DINAPI (clases 9, 35, 42).
- [ ] Confirmar los 5 campos críticos del piloto en `CLIENTE.md`.

## Follow-ups (tareas diferidas)

- [ ] Registrar `kuatiauto.com.py` cuando el piloto justifique el costo (verificado disponible 2026-10-30).
- [ ] Renombrar `clientes` a `establecimientos` en el scaffold (F3).
- [ ] Decidir estructura final de `app/` con route groups (F3).
- [ ] Definir contenido exacto del seed del catálogo global (~20-30 servicios/productos) (F6).

## Decisiones de la sesión (2026-10-30)

### Metodología y nombre

- **D-A:** alinear studio a metodología ENC. Aprobado.
- **D-B:** seguridad integrada en ARCHITECTURE + SPEC + BITACORA + SESSION-STATE. Sin SEGURIDAD.md. Aprobado.
- **D-C:** CLIENTE.md provisional con `[PENDIENTE]`. Aprobado.
- **D-D:** `KuatiAuto` es nombre de trabajo, no comercial definitivo. Aprobado.

### Producto (F1) — DECIDIDO por delegación

- **D-F1-1 (flujo MVP):** 7 pasos del camino feliz. Sin factura/recibo, sin impresión/PDF, sin métricas en dashboard. Múltiples usuarios por empresa (propietario + empleado) se mantiene. Próximo mantenimiento sugerido automático (+6 meses / +10.000 km), editable.
- **D-F1-2 (orden de trabajo):** 9 campos. `orden_servicio` y `orden_producto` en tablas aparte (no texto libre). `importe_total` único, sin desglose por línea en MVP.
- **D-F1-3 (catálogo):** híbrido. Global (admin, solo lectura para empresas) + local (empresa). Seed manual del global, no datos inventados. Consolidación local→global → v2.

### ADRs (F0 + F1)

- **ADR-001:** repo único modular.
- **ADR-002:** vehículo híbrido.
- **ADR-003:** piloto provisional.
- **ADR-004:** nombre KuatiAuto provisional.
- **ADR-005 (nuevo F1):** catálogo híbrido global + local.
- **ADR-006 (nuevo F1):** productos y servicios en tablas aparte.

### Riesgos cerrados / abiertos

- **R5 (alcance MVP inflado):** cerrado por D-F1-1.
- **R1, R2, R3, R4, R6-R14:** abiertos, con fase asignada.

## Próximos 3 pasos

1. F2: roles y permisos (matriz completa propietario/empleado/admin, operaciones auditables).
2. F3: arquitectura multiempresa (RLS, aislamiento, SECURITY DEFINER). **Bloqueante de todo lo posterior.**
3. F4: seguridad y modelo de amenazas (OWASP Top 10, ASVS aplicable, gate por módulo).

## Nota metodológica

- Este proyecto heredó la metodología alineada del studio el 2026-10-30 (commit 72da08e).
- Docs deprecados a NO generar: DECISIONES.md, SEGURIDAD.md, TESTS.md, AUDITORIA.md, CONVENCIONES.md.
- Doc nuevo: CODIGO.md (naming + estructura + patrones).
- Seguridad integrada en ARCHITECTURE.md (sección Seguridad) + SPEC.md (criterios) + BITACORA.md (hallazgos).
- Decisiones de sesión en SESSION-STATE.md (no en DECISIONES.md).