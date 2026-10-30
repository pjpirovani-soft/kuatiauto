# Session State — KuatiAuto (provisional)

**Actualizado:** 2026-10-30

> Este archivo es el handoff entre sesiones. Leerlo primero al arrancar. Actualizarlo al cerrar.

## Estado actual (30 segundos)

- **Fase:** F0 — Punto de partida arquitectónico (completada).
- **Trabajando en:** preparación de F1 (definición de producto y alcance MVP).
- **Bloqueado por:** nada. Decisiones pendientes: verificar redes/DINAPI de KuatiAuto, confirmar datos del piloto.

## Open Loops (acciones sin verificar)

- [ ] Verificar `@kuatiauto` en Instagram, Facebook, TikTok.
- [ ] Verificar `KuatiAuto` en DINAPI (clases 9, 35, 42).
- [ ] Confirmar los 5 campos críticos del piloto en `CLIENTE.md`.

## Follow-ups (tareas diferidas)

- [ ] Registrar `kuatiauto.com.py` cuando el piloto justifique el costo (verificado disponible 2026-10-30).
- [ ] Renombrar `clientes` a `establecimientos` en el scaffold (F3).
- [ ] Decidir estructura final de `app/` con route groups (F3).

## Decisiones de la sesión (2026-10-30)

- **D-A:** alinear studio a metodología ENC. Aprobado.
- **D-B:** seguridad integrada en ARCHITECTURE + SPEC + BITACORA + SESSION-STATE. Sin SEGURIDAD.md. Aprobado.
- **D-C:** CLIENTE.md provisional con `[PENDIENTE]`. Aprobado.
- **D-D:** `KuatiAuto` es nombre de trabajo, no comercial definitivo. Aprobado.
- **D-P1:** alcance MVP = gestión + catálogo mínimo + admin mínimo. Aprobado por delegación.
- **D-P2:** vehículo híbrido con MVP en (a) + `vehiculo_identidad`. Aprobado por delegación.
- **D-P3:** piloto provisional. Aprobado por delegación.
- **ADR-001:** repo único modular. Aprobado.
- **ADR-002:** vehículo híbrido. Aprobado.
- **ADR-003:** piloto provisional. Aprobado.
- **ADR-004:** nombre KuatiAuto provisional. Aprobado.

## Próximos 3 pasos

1. F1: definir producto y alcance MVP (funciones incluidas, excluidas, flujos, criterios de aceptación verificables).
2. F2: roles y permisos (matriz completa, operaciones auditables).
3. F3: arquitectura multiempresa (RLS, aislamiento, SECURITY DEFINER). **Bloqueante de todo lo posterior.**

## Nota metodológica

- Este proyecto heredó la metodología alineada del studio el 2026-10-30 (commit 72da08e).
- Docs deprecados a NO generar: DECISIONES.md, SEGURIDAD.md, TESTS.md, AUDITORIA.md, CONVENCIONES.md.
- Doc nuevo: CODIGO.md (naming + estructura + patrones).
- Seguridad integrada en ARCHITECTURE.md (sección Seguridad) + SPEC.md (criterios) + BITACORA.md (hallazgos).
- Decisiones de sesión en SESSION-STATE.md (no en DECISIONES.md).