# F13 — Plan de operación y continuidad

**Estado:** PROPUESTA (2026-10-30).
**Alcance:** solo docs. No toca código.
**Bloquea a:** nada técnico. Condiciona operación sostenible y recuperación ante incidentes.

## Qué incluye F13

1. **Runbook específico de KuatiAuto** (MANTENIMIENTO.md, adaptado del template del studio).
2. **Entornos** (local, preview, prod) y su configuración.
3. **Despliegues** (Vercel + Supabase), flujo y rollback.
4. **Backups y recuperación** (frecuencia, retención, prueba de restauración).
5. **Monitorización, logs y alertas** (diseñado, no configurado).
6. **Gestión de incidentes** (severidades, tiempos de respuesta, canal).
7. **Continuidad del negocio** (RTO/RPO, accesos, plan de recuperación).
8. **Decisiones D-F13-1..5** en DECISIONES.md.
9. **Actualizar** ROADMAP.md, SESSION-STATE.md, BITACORA.md, CHANGELOG.md.

## Qué NO incluye F13

- Código (no hay scripts de backup, no hay Sentry instalado, no hay alertas activas).
- Configuración real de Sentry, Vercel Analytics ni alertas (queda diseñado).
- Contratación de servicios pagos.
- Migración de datos ni cambios de infraestructura.
- Runbooks de terceros (Vercel/Supabase) más allá de referencias.

## Decisiones D-F13-* (por delegación, coherentes con D-F11-* y D-F12-*)

| ID | Decisión | Estado |
|---|---|---|
| D-F13-1 | Entornos: local (dev), preview (Vercel por PR), prod (Vercel main + Supabase prod). Un solo proyecto Supabase en MVP; branching diferido a v2. | PROPUESTA |
| D-F13-2 | Backups: Supabase backup diario automático (plan free/pro según disponibilidad) + export lógico semanal a almacenamiento externo (script manual documentado). Retención 30 días. Prueba de restauración trimestral documentada. | PROPUESTA |
| D-F13-3 | Monitorización: Vercel Analytics (Web Vitals + logs) + Sentry free tier para errores de servidor y cliente (diseñado, no configurado en MVP). Alertas por email al propietario. | PROPUESTA |
| D-F13-4 | Incidentes: 3 severidades. S1 (caída total o pérdida de datos) respuesta < 2 h; S2 (funcionalidad crítica degradada) < 24 h; S3 (bug menor o cosmético) próximo sprint. Canal único: email + WhatsApp del propietario. Post-mortem obligatorio para S1. | PROPUESTA |
| D-F13-5 | Continuidad: RTO 24 h, RPO 24 h. Accesos críticos (Vercel, Supabase, GitHub, dominio .com.py, Resend) documentados en gestor de contraseñas del propietario con 2FA. Plan de recuperación documentado en MANTENIMIENTO.md. | PROPUESTA |

## Criterios de aceptación

- MANTENIMIENTO.md con runbook, entornos, despliegues, backups, monitorización, incidentes y continuidad.
- ARCHITECTURE.md con sección Operación (referencia a MANTENIMIENTO.md).
- DECISIONES.md con D-F13-1..5.
- ROADMAP.md con F13 EN PROGRESO.
- SESSION-STATE.md actualizado.
- BITACORA.md + CHANGELOG.md con entrada de F13.
- Commits: docs: F13 — operación y continuidad.

## Plan de implementación

1. F13-PLAN.md (este archivo).
2. DECISIONES.md D-F13-1..5.
3. MANTENIMIENTO.md (runbook completo).
4. ARCHITECTURE.md (sección Operación).
5. ROADMAP.md + SESSION-STATE.md.
6. BITACORA.md + CHANGELOG.md.
7. Cierre F13.
