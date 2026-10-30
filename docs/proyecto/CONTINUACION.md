# CONTINUACIÓN — KuatiAuto

**Generado:** 2026-10-30 (checkpoint pre-F14)
**Propósito:** retomar el proyecto en una conversación nueva sin perder contexto.

## Estado actual

- **Proyecto:** KuatiAuto (provisional), plataforma SaaS multiempresa para mantenimiento automotor en Paraguay.
- **Repo:** https://github.com/pjpirovani-soft/kuatiauto (privado, branch main)
- **Local:** C:\Users\Admin\proyectos\studio-pjpirovani-soft\clients\kuatiauto
- **Último commit:** 3684ff2 docs(kuatiauto): cierra F13 - operacion y continuidad
- **Fases completadas:** F0 a F13.
- **Fase en curso:** F14 — Plan de implementación (arranque, sin edits aún).
- **Fases pendientes:** F14 (última de la metodología).

## Documentos clave

- docs/proyecto/PROMPT-MAESTRO.md — fuente de verdad metodológica (14 fases).
- docs/proyecto/ROADMAP.md — hoja de ruta con estado de cada fase.
- docs/contexto/DECISIONES.md — registro A/B/C/D.
- docs/proyecto/ARCHITECTURE.md — arquitectura, ADRs, seguridad, multiempresa, directorio, notificaciones, operación.
- docs/proyecto/SPEC.md — especificación funcional.
- docs/proyecto/SESSION-STATE.md — handoff entre sesiones.
- docs/proyecto/BITACORA.md — historial cronológico.
- docs/proyecto/BUSINESS-LOGIC.md — catálogo, costes, modelo comercial.
- docs/proyecto/CHANGELOG.md — cambios por fase.
- docs/proyecto/F11-PLAN.md, F12-PLAN.md, F13-PLAN.md — planes por fase.
- docs/proyecto/MANTENIMIENTO.md — runbook operativo (F13).

## Migraciones SQL (13 archivos)

001 a 013. Última: 013_notificaciones.sql (F11).

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript + Tailwind 4
- Supabase (PostgreSQL 15 + RLS + Auth)
- Zod 4.6.7 + Vitest 3.2.7 + Vercel
- Leaflet + OpenStreetMap
- Resend (cliente con fallback mock; sin cuenta)

## Verificación (al cierre de F13)

- vitest: 28/28
- tsc --noEmit: 0 errores
- next build: verde
- encoding: 0 mojibake, 0 BOM en docs de estado

## Decisiones clave (APROBADAS)

- D-F11-1..5: Vercel Cron, idempotency_key, check_rate_limit, reintentos 3/backoff, notificacion_log + audit_log manuales.
- D-F12-1..5: free único MVP, límites suaves, premium v2, pricing Gs. 150k/mes Pro (v2), canal outbound.
- D-F13-1..5: entornos local/preview/prod, backups diarios + export semanal, monitorización Vercel+Sentry (diseñado), incidentes S1/S2/S3, RTO/RPO 24h, accesos con 2FA.
- D-F8-1: todo free tier, único costo real dominio .com.py.

## Deuda técnica pendiente (al arranque de F14)

- npm audit: 3 vulnerabilidades dev-only (vitest/tinypool). Aceptadas hasta vitest 5.x.
- empresa_id: null en notificaciones-actions (TODO: cablear en E1/E2).
- SUPABASE_SERVICE_ROLE_KEY no seteada.
- RESEND_API_KEY no seteada (modo mock).
- Tipos Supabase sin regenerar (regenerar al aplicar 013 en E1).
- Reintentos y cron de F11 diseñados, no implementados (E5).
- Sentry diseñado, no configurado (E5).
- Export semanal de backups: script manual, no automatizado.
- Prueba de restauración trimestral: no ejecutada.
- 2FA en gestor de contraseñas: acción del propietario.
- Inconsistencia de estado F13: ROADMAP dice COMPLETADA, SESSION-STATE/CHANGELOG/BITACORA dicen EN PROGRESO. D-F13-1..5 en PROPUESTA. **Saneamiento pendiente (commit 1 de F14).**

## F14 — Plan de implementación (delegado, arranque pendiente)

**Decisiones tomadas por delegación (2026-10-30, sesión pre-F14):**
- Aprobar D-F13-1..5 tal como están.
- F14 = 3 docs: `F14-PLAN.md` + `IMPLEMENTATION-PLAN.md` + `STATUS.md` reescrito.
- Saneamiento F13 en el mismo commit que el arranque de F14 (commit 1).
- Orden de etapas: E1 Fundamentos → E2 Gestión core → E3 Catálogo+stock → E4 Directorio+portal → E5 Notificaciones+admin.
- F6b (seed verificado) dentro de E3; si no hay fuentes, E3 queda `wip` con seed vacío (no se inventan datos).
- Estimación S/M/L/XL sin fechas absolutas. Re-estimación al cierre de cada etapa.
- `STATUS.md` reescrito reemplaza el template (el template vive en el repo del studio, no se pierde).
- D-F14-1..5 redactadas como PROPUESTA en `F14-PLAN.md` (aprobar al cierre de F14).

**Plan de 7 comandos (uno por mensaje, con verificación):**
1. Saneamiento F13 (5 edits quirúrgicos: DECISIONES, SESSION-STATE, CHANGELOG, BITACORA, ROADMAP).
2. Crear `F14-PLAN.md`.
3. Crear `IMPLEMENTATION-PLAN.md`.
4. Reescribir `STATUS.md`.
5. Actualizar `ROADMAP.md` (F14 EN PROGRESO).
6. Actualizar `SESSION-STATE.md` + `BITACORA.md` + `CHANGELOG.md` (entradas F14).
7. Commit de cierre F14 (solo con OK explícito).

**Contenido pre-diseñado:** los borradores completos de F14-PLAN.md, IMPLEMENTATION-PLAN.md y STATUS.md, y los edits exactos de los 5 archivos de saneamiento, están en el mensaje "EXTIENDE AL 97%" de la sesión anterior (2026-10-30). La sesión nueva puede pedirlos de nuevo si hace falta.

## Cómo retomar en una conversación nueva

Pegar este mensaje al inicio:

> Estoy retomando el proyecto KuatiAuto. Leé docs/proyecto/CONTINUACION.md para el estado actual. F13 está cerrada (commit 3684ff2) pero hay inconsistencia de estado en SESSION-STATE/CHANGELOG/BITACORA (dicen EN PROGRESO). D-F13-1..5 en PROPUESTA. Arrancamos F14 (plan de implementación, última fase). Trabajamos con método B: un comando PowerShell por mensaje, path absoluto, $out | Set-Clipboard; Write-Host $out, sin commitear sin OK explícito. Verificar encoding antes de editar. La sesión anterior delegó las decisiones de F14 (detalladas en CONTINUACION.md §F14). Avisame cuando el contexto esté al 80%.

## Contacto

- Propietario: Pedro J. Pirovani (pjpirovani-soft en GitHub).