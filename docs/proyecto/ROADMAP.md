# ROADMAP — KuatiAuto

**Actualizado:** 2026-10-30
**Fuente de verdad:** PROMPT MAESTRO (14 fases). Este archivo es el índice de estado.
**Estado general:** Fases 1-4 completadas. Fase 5 en progreso. Fases 6-14 pendientes.

## Regla de avance

- Una fase no arranca hasta que la anterior esté **aprobada** por el propietario.
- Excepción: las fases marcadas "paralela" pueden ir en paralelo.
- Cada fase aprobada se commitea como `docs(kuatiauto): fase N — <tema>`.
- F3 y F4 son **bloqueantes** de todo lo posterior.

## Las 14 fases

| # | Fase | Estado | Doc principal | Bloquea a |
|---|---|---|---|---|
| 1 | Definición del producto | **COMPLETADA** (2026-10-30) | `SPEC.md` | — |
| 2 | Usuarios, roles, permisos | **COMPLETADA** (2026-10-30) | `SPEC.md` sección 3 + `ARCHITECTURE.md` Autorización | — |
| 3 | Arquitectura multiempresa | **COMPLETADA** (2026-10-30) | `ARCHITECTURE.md` sección Multiempresa | — |
| 4 | Arquitectura de seguridad | **COMPLETADA** (2026-10-30) | `ARCHITECTURE.md` sección Seguridad | — |
| 5 | Modelo de datos | **COMPLETADA** (2026-10-30) | `SPEC.md` sección 10 + migraciones | — |
| 6 | Catálogo automotriz | **COMPLETADA** (2026-10-30) | `BUSINESS-LOGIC.md` | — |
| 7 | Stack tecnológico | **COMPLETADA** (2026-10-30) | `ARCHITECTURE.md` stack | — |
| 8 | Costes y sostenibilidad | **EN PROGRESO** | `BUSINESS-LOGIC.md` | F12 |
| 9 | Privacidad y datos | Pendiente | `ARCHITECTURE.md` | — |
| 10 | Directorio y geolocalización | Pendiente (¿MVP o v2?) | `ARCHITECTURE.md` | F12 |
| 11 | Notificaciones | Pendiente (¿MVP o v2?) | `ARCHITECTURE.md` | F12 |
| 12 | Modelo comercial | Pendiente | `BUSINESS-LOGIC.md` | — |
| 13 | Operación y continuidad | Pendiente | `MANTENIMIENTO.md` | — |
| 14 | Plan de implementación | Pendiente | `ROADMAP.md` + `STATUS.md` | — |

## Fase 1 — Definición del producto (EN PROGRESO)

**Doc:** `SPEC.md`

**Lo que ya está:**
- Identidad del producto (nombre provisional, qué es, qué no es).
- Alcance MVP propuesto (gestión + catálogo mínimo + admin mínimo).
- 14 riesgos identificados (R1-R14).
- Flujos del MVP (7 pasos del camino feliz + flujos secundarios).
- Modelo de datos preliminar (13 entidades).
- Criterios de aceptación (funcionales, seguridad, calidad).

**Lo que falta para cerrar F1:**
- Propuesta de valor y diferenciación.
- Usuarios objetivo y necesidades por perfil.
- Confirmar alcance MVP: ¿directorio y portal son v2 o MVP?
- Confirmar catálogo: ¿completo o mínimo?
- Confirmar inventario: ¿MVP o v2?

**Decisiones pendientes que bloquean F1:**
- P-Alcance-MVP.
- P-Catálogo.
- P-Inventario.

## Fase 2 — Usuarios, roles, permisos (PENDIENTE)

**Doc:** `SPEC.md` sección 3 + `ARCHITECTURE.md` sección Autorización.

**Lo que hay:** esqueleto de 3 roles (admin_general, propietario, empleado) y 2 roles v2 (conductor, verificador de catálogo).

**Lo que falta:** matriz completa de permisos por rol × entidad × operación. Separación authn/authz. Operaciones auditables.

**Bloquea a:** F3 (RLS depende de la matriz), F4 (modelo de amenazas depende de roles).

## Fase 3 — Arquitectura multiempresa (PENDIENTE, CRÍTICA)

**Doc:** `ARCHITECTURE.md` ADR-001, ADR-002 + nueva sección Multiempresa.

**Lo que hay:** decisión de repo único modular (ADR-001) y vehículo híbrido (ADR-002).

**Lo que falta:** modelo formal de empresa/establecimiento, RLS, aislamiento, SECURITY DEFINER, pruebas cruzadas.

**Bloquea a:** F5 (modelo de datos), F6 (catálogo), F7 (stack).

## Fase 4 — Arquitectura de seguridad (PENDIENTE, CRÍTICA)

**Doc:** `ARCHITECTURE.md` sección Seguridad + `SPEC.md` criterios.

**Lo que hay:** 10 fundamentos obligatorios, 10 requisitos de aislamiento multiempresa, gate por módulo, gestión de secretos.

**Lo que falta:** modelo de amenazas formal (OWASP Top 10 + ASVS aplicable), límites de confianza, rate limiting, auditoría, recuperación ante incidentes.

**Bloquea a:** F5, F7, F9.

## Fase 5 — Modelo de datos (PENDIENTE)

**Doc:** `SPEC.md` sección 10 + `supabase/migrations/` (a crear).

**Lo que hay:** 13 entidades con campos preliminares.

**Lo que falta:** DDL completo, índices, restricciones, claves foráneas, triggers, campos de auditoría, migraciones numeradas (001-008), RLS.

**Bloquea a:** F6, F11.

## Fase 6 — Catálogo automotriz (PENDIENTE)

**Doc:** `BUSINESS-LOGIC.md` + `ARCHITECTURE.md`.

**Lo que hay:** mención en GLOSARIO, ADR-005 (catálogo híbrido global/local), `servicio_global` y `producto_global` genéricos.

**Lo que falta:** modelo completo de fabricantes, marcas, modelos, años, versiones, motorizaciones, cilindradas, combustibles, especificaciones de lubricantes, viscosidades SAE, clasificaciones API/ACEA, aprobaciones, capacidades, intervalos. Fuentes y validación.

**Bloquea a:** F12.

## Fase 7 — Stack tecnológico (PARCIAL)

**Doc:** `ARCHITECTURE.md` stack.

**Lo que hay:** Next.js 16, React 19, Tailwind 4, Supabase, Zod, Vitest, Vercel.

**Lo que falta:** justificación de cada elección con alternativas evaluadas, correo transaccional, mapas/geocodificación, analítica, CI/CD.

**Bloquea a:** F8, F13.

## Fase 8 — Costes y sostenibilidad (PENDIENTE)

**Doc:** `BUSINESS-LOGIC.md`.

**Lo que hay:** nada.

**Lo que falta:** estimación de costes iniciales y de crecimiento, límites de free tier, escenarios (prueba, primeros establecimientos, crecimiento moderado, crecimiento importante).

**Bloquea a:** F12.

## Fase 9 — Privacidad y datos (PENDIENTE)

**Doc:** `ARCHITECTURE.md` sección Privacidad.

**Lo que hay:** mención en riesgos (R9).

**Lo que falta:** datos personales recopilados, finalidad, retención, eliminación, exportación, consentimientos, obligaciones legales PY (Ley 6534/2020).

**Bloquea a:** nada directamente, pero condiciona F5 y F10.

## Fase 10 — Directorio y geolocalización (PENDIENTE, ¿MVP o v2?)

**Doc:** `ARCHITECTURE.md` + `BUSINESS-LOGIC.md`.

**Lo que hay:** mención en GLOSARIO, PROMPT MAESTRO sección 2.2.

**Decisión pendiente:** ¿es MVP o v2? Mi propuesta (D-P1) dice v2. El PROMPT MAESTRO lo trata como componente principal.

**Lo que falta:** diseño del directorio, geolocalización, búsqueda por distancia, filtros, moderación, verificación de establecimientos, protección frente a abuso.

**Bloquea a:** F12.

## Fase 11 — Notificaciones (PENDIENTE, ¿MVP o v2?)

**Doc:** `ARCHITECTURE.md`.

**Lo que hay:** mención en riesgos (R12), PROMPT MAESTRO sección 2.3.

**Decisión pendiente:** ¿es MVP o v2? Mi propuesta (D-F1-1) dice v2.

**Lo que falta:** sistema de notificaciones (email, push), recordatorios por km/tiempo, trazabilidad, reintentos, control de errores.

**Bloquea a:** F12.

## Fase 12 — Modelo comercial (PENDIENTE)

**Doc:** `BUSINESS-LOGIC.md`.

**Lo que hay:** nada.

**Lo que falta:** suscripciones, planes gratuitos/pagos, límites por plan, funcionalidades premium, estrategia comercial, coste de adquisición, retención.

**Bloquea a:** nada técnico, pero condiciona la sostenibilidad.

## Fase 13 — Operación y continuidad (PARCIAL)

**Doc:** `MANTENIMIENTO.md` (template).

**Lo que hay:** template genérico del studio.

**Lo que falta:** runbook específico de KuatiAuto (despliegues, entornos, backups, recuperación, monitorización, logs, gestión de incidentes, continuidad).

**Bloquea a:** nada.

## Fase 14 — Plan de implementación (PENDIENTE)

**Doc:** `ROADMAP.md` (este archivo) + `STATUS.md`.

**Lo que hay:** nada.

**Lo que falta:** etapas, módulos, dependencias, prioridades, entregables, pruebas, criterios de aceptación, hitos, riesgos, orden de implementación.

**Bloquea a:** escritura de código.

## Próximo paso concreto

**Cerrar F1.** Para eso, el propietario debe confirmar (o rechazar) las 3 decisiones pendientes:

1. **P-Alcance-MVP:** ¿directorio y portal son v2 (mi propuesta) o MVP (PROMPT MAESTRO)?
2. **P-Catálogo:** ¿catálogo mínimo (servicios/productos genéricos) o catálogo completo (fabricantes, marcas, modelos, motores, especificaciones)?
3. **P-Inventario:** ¿inventario y movimientos de stock en MVP o v2?

Con esas 3 respuestas, F1 se cierra y arranca F2 (roles y permisos).

## Deuda de docs

Los siguientes docs están **desactualizados** o son **templates del studio** y hay que adaptarlos a KuatiAuto:

- `PROMPT.md`: es el del studio. Referencia `CONVENCIONES.md` y `DECISIONES.md` (deprecados). Hay que reescribirlo.
- `README.md`: es el del blueprint. Hay que reescribirlo.
- `STATUS.md`: desactualizado (2026-10-29, template). Hay que actualizarlo.
- `BUSINESS-LOGIC.md`: vacío. Hay que llenarlo.
- `AI-RULES.md`, `SESSION-PROTOCOL.md`, `ROL.md`, `ENCODING.md`, `MANTENIMIENTO.md`: templates del studio. Hay que adaptarlos.
- `DECISIONES.md`: no existe como archivo. Hay que crearlo.