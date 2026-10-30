# Session State — KuatiAuto (provisional)

**Actualizado:** 2026-10-30

> Este archivo es el handoff entre sesiones. Leerlo primero al arrancar. Actualizarlo al cerrar.

## Estado actual (30 segundos)

- **Fase:** F6 — Catálogo automotriz: fuentes y validación (completada).
- **Trabajando en:** F7 — Stack tecnológico (justificación de cada elección).
- **Bloqueado por:** nada. Decisiones pendientes: verificar redes/DINAPI de KuatiAuto, confirmar datos del piloto.

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

## Próximos 3 pasos

1. F7: stack tecnológico (justificación, correo transaccional, mapas, analítica, CI/CD).
2. F8: costes y sostenibilidad (free tier, escenarios de crecimiento).
3. F9: privacidad y protección de datos (Ley 6534/2020).

## Nota metodológica

- Este proyecto heredó la metodología alineada del studio el 2026-10-30 (commit 72da08e).
- Docs deprecados a NO generar: DECISIONES.md viejo, SEGURIDAD.md, TESTS.md, AUDITORIA.md, CONVENCIONES.md.
- Doc nuevo: DECISIONES.md (registro A/B/C/D), PROMPT-MAESTRO.md (fuente de verdad), ROADMAP.md (hoja de ruta).