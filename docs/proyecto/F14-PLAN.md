# F14 — Plan de implementación

**Estado:** PROPUESTA (2026-10-30).
**Alcance:** solo docs. No toca código.
**Bloquea a:** escritura de código de módulos. Es la última fase de la metodología.
**Bloqueado por:** nada. F13 cerrada (commit 3684ff2).

## Qué incluye F14

1. **IMPLEMENTATION-PLAN.md** (entregable principal):
   - Etapas de implementación ordenadas y dependientes.
   - Módulos por etapa.
   - Dependencias entre módulos (grafo).
   - Prioridades (must/should/could; MVP vs v2).
   - Entregables por etapa (código, migraciones, tests, docs).
   - Criterios de "módulo completo" (referencia al gate de seguridad de 10 puntos de ARCHITECTURE.md).
   - Estimación de esfuerzo relativa (sin fechas absolutas).
2. **STATUS.md** reescrito: tablero macro de módulos (estado por módulo, bloqueantes, hallazgos).
3. **Decisiones D-F14-1..5** en DECISIONES.md.
4. **Actualizar** ROADMAP.md, SESSION-STATE.md, BITACORA.md, CHANGELOG.md.
5. **Saneamiento de estado F13** (hecho en comando 1: D-F13-1..5 APROBADAS; F13 COMPLETADA en SESSION-STATE/CHANGELOG/BITACORA).

## Qué NO incluye F14

- Código (ningún módulo se escribe en F14).
- Configuración real de servicios (Sentry, Resend, dominio).
- Contratación de servicios pagos.
- Migraciones nuevas (las 13 actuales cubren MVP).
- Fechas absolutas ni cronograma con calendario (solo esfuerzo relativo).

## Decisiones D-F14-* (por delegación)

| ID | Decisión | Estado |
|---|---|---|
| D-F14-1 | Etapas de implementación: 5 etapas (E1 Fundamentos, E2 Gestión core, E3 Catálogo+stock, E4 Directorio+portal, E5 Notificaciones+admin). Orden estricto por dependencias. | PROPUESTA |
| D-F14-2 | Un módulo se considera "completo" solo si pasa el gate de seguridad de 10 puntos de ARCHITECTURE.md. Sin gate, no hay commit `completo` (solo `wip`). | PROPUESTA |
| D-F14-3 | Prioridades must/should/could mapeadas a MVP/v2 según D-P1 (los 4 componentes son MVP). | PROPUESTA |
| D-F14-4 | Estimación por esfuerzo relativo (S/M/L/XL), sin fechas absolutas. Re-estimación al cierre de cada etapa. | PROPUESTA |
| D-F14-5 | STATUS.md es el tablero macro de módulos. SESSION-STATE.md sigue siendo el handoff operativo entre sesiones. No se duplican. | PROPUESTA |

## Criterios de aceptación

- IMPLEMENTATION-PLAN.md con etapas, módulos, dependencias, prioridades, entregables y criterios de "módulo completo".
- STATUS.md reescrito como tablero macro.
- DECISIONES.md con D-F14-1..5.
- ROADMAP.md F14 EN PROGRESO al arrancar, COMPLETADA al cerrar.
- SESSION-STATE.md, BITACORA.md, CHANGELOG.md actualizados.
- Saneamiento F13 aplicado (D-F13-1..5 APROBADAS; F13 COMPLETADA unánime). Hecho en comando 1.
- Commits: `docs(kuatiauto): F14 arranque — saneamiento F13 + F14-PLAN` y `docs(kuatiauto): F14 — plan de implementación`.

## Plan de implementación (comandos)

1. Saneamiento F13 (5 edits quirúrgicos: DECISIONES, SESSION-STATE, CHANGELOG, BITACORA, ROADMAP). **Hecho.**
2. F14-PLAN.md (este archivo). **Hecho.**
3. IMPLEMENTATION-PLAN.md (entregable principal).
4. STATUS.md reescrito.
5. ROADMAP.md + SESSION-STATE.md (entradas F14 en docs de estado).
6. BITACORA.md + CHANGELOG.md (entradas F14).
7. Cierre F14 (commit de cierre, con OK explícito).

## Orden de etapas (D-F14-1) — justificación

- **E1 Fundamentos** (auth + multiempresa + shell + rate limiting + audit hooks). Sin esto no hay SaaS.
- **E2 Gestión core** (clientes + vehículos + órdenes + empleados). Es el corazón del SaaS; el piloto lo necesita primero para operar.
- **E3 Catálogo + stock** (catálogo global lectura + local CRUD + inventario + movimientos). Depende de E2 (órdenes).
- **E4 Directorio + portal** (búsqueda + mapa + publicación + portal del conductor). Depende de E1 (establecimiento) y E2 (vehículo). El piloto puede operar sin directorio; se publica cuando E4 esté.
- **E5 Notificaciones + admin** (cron recordatorios + panel admin + Sentry + Analytics). Depende de E2 (órdenes) y E3 (catálogo).

**Regla de reordenamiento:** si el piloto pide directorio antes de E3, se reordena con aprobación explícita del propietario y se registra en BITACORA.

## F6b (seed verificado) dentro de E3

Si al arrancar E3 no hay fuentes verificadas para el catálogo automotriz, E3 se commitea como `wip` con seed vacío y se completa después. **No se inventan datos** (regla de F6a y ADR-005).

## Estimación relativa (D-F14-4)

- **S** = ≤1 sesión.
- **M** = 2-3 sesiones.
- **L** = 4-6 sesiones.
- **XL** = >6 sesiones.

Re-estimación al cierre de cada etapa. Solo se planifica etapa en curso + siguiente.

## STATUS.md reescrito (D-F14-5)

- `STATUS.md` = tablero macro de módulos (estado por módulo, bloqueantes, hallazgos).
- `SESSION-STATE.md` = handoff operativo entre sesiones (fase en curso, próximos pasos, deuda).
- No se duplican. `STATUS.md` referencia al gate de seguridad de ARCHITECTURE.md para el criterio de "módulo completo".
- El template del studio no se conserva como copia: vive en el repo del studio (`studio-pjpirovani-soft`), no se pierde.

## Riesgos y mitigaciones

- **Riesgo:** el piloto pide funcionalidades fuera de orden (ej. directorio antes de E3). **Mitigación:** regla de reordenamiento con aprobación explícita.
- **Riesgo:** F6b no tiene fuentes al arrancar E3. **Mitigación:** E3 `wip` con seed vacío, no se inventan datos.
- **Riesgo:** estimación XL en E2 desborda. **Mitigación:** re-estimación al cierre de E1; si E2 es XL real, se subdivide en E2a (clientes+vehículos) y E2b (órdenes+empleados).
- **Riesgo:** Sentry no se configura en E5 (deuda F13). **Mitigación:** E5 lo incluye como entregable; si no se llega, queda `wip` y se documenta.

## Contacto

- Propietario: Pedro J. Pirovani (pjpirovani-soft en GitHub).