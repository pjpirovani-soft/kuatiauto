# F12 — Plan de modelo comercial

**Estado:** PROPUESTA (2026-10-30).
**Alcance:** solo docs. No toca codigo.
**Bloquea a:** nada tecnico. Condiciona sostenibilidad.

## Que incluye F12

1. **Planes y precios** (BUSINESS-LOGIC.md §Planes).
   - MVP: 1 plan free unico, sin cobro.
   - v2: 3 tiers (Free, Pro, Business) con pricing en Gs.
2. **Limites por plan** (MVP y v2).
3. **Funcionalidades premium diferidas** (lista explicita de que queda fuera del free).
4. **Estrategia comercial** (canal, CAC, LTV estimado, retencion).
5. **Suscripciones y cobro** (manual en v2 temprana, pasarela en v2 avanzada).
6. **Decisiones D-F12-1..5** en DECISIONES.md.
7. **Actualizar** ROADMAP.md, SESSION-STATE.md, BITACORA.md, CHANGELOG.md.

## Que NO incluye F12

- Codigo (no hay billing, no hay webhooks de pago, no hay gating por plan).
- Integracion con pasarelas (Bancard, Pagopar, Stripe).
- Facturacion tributaria oficial (sigue fuera, D9).
- Migracion de datos existentes.

## Decisiones D-F12-* (por delegacion, coherentes con D-F8-1)

| ID | Decision | Estado |
|---|---|---|
| D-F12-1 | Plan unico free en MVP. Sin freemium ni planes pagos. | PROPUESTA |
| D-F12-2 | Limites tecnicos suaves en MVP: 1 empresa por usuario (D-F3-1), establecimientos y vehiculos sin tope duro, monitoreados. | PROPUESTA |
| D-F12-3 | Funcionalidades premium diferidas a v2: multi-empresa, exportacion, reportes avanzados, portal con historial extendido, catalogo editable por empresa. | PROPUESTA |
| D-F12-4 | Pricing tentativo v2: Gs. 150.000/mes por establecimiento (~USD 20), 3 tiers (Free, Pro, Business). Cobro manual (transferencia) en v2 temprana; pasarela (Bancard/Pagopar) en v2 avanzada. | PROPUESTA |
| D-F12-5 | Canal de adquisicion MVP: outbound directo al piloto + 5 talleres de la red del propietario. Sin paid ads. CAC ~ 0. | PROPUESTA |

## Criterios de aceptacion

- BUSINESS-LOGIC.md con seccion Planes, Limites, Premium, Estrategia.
- DECISIONES.md con D-F12-1..5.
- ROADMAP.md con F12 EN PROGRESO.
- SESSION-STATE.md actualizado.
- BITACORA.md + CHANGELOG.md con entrada de F12.
- Commits: docs: F12 — modelo comercial.

## Plan de implementacion

1. BUSINESS-LOGIC.md (secciones nuevas).
2. DECISIONES.md D-F12-1..5.
3. F12-PLAN.md (este archivo).
4. ROADMAP.md + SESSION-STATE.md.
5. BITACORA.md + CHANGELOG.md.
6. Cierre F12.