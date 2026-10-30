# CONTINUACIÓN — KuatiAuto

**Generado:** 2026-10-30
**Propósito:** retomar el proyecto en una conversación nueva sin perder contexto.

## Estado actual

- **Proyecto:** KuatiAuto (provisional), plataforma SaaS multiempresa para mantenimiento automotor en Paraguay.
- **Repo:** https://github.com/pjpirovani-soft/kuatiauto (privado, branch main)
- **Local:** C:\Users\Admin\proyectos\studio-pjpirovani-soft\clients\kuatiauto
- **Último commit:** b8ebdbb docs: cierra F12 - modelo comercial (D-F12-1..5 aprobadas)
- **Fases completadas:** F0 a F12.
- **Fase siguiente:** F13 — Operación y continuidad.
- **Fases pendientes:** F13, F14.

## Documentos clave

- docs/proyecto/PROMPT-MAESTRO.md — fuente de verdad metodológica (14 fases).
- docs/proyecto/ROADMAP.md — hoja de ruta con estado de cada fase.
- docs/contexto/DECISIONES.md — registro A/B/C/D.
- docs/proyecto/ARCHITECTURE.md — arquitectura, ADRs, seguridad, multiempresa, directorio, notificaciones.
- docs/proyecto/SPEC.md — especificación funcional.
- docs/proyecto/SESSION-STATE.md — handoff entre sesiones.
- docs/proyecto/BITACORA.md — historial cronológico.
- docs/proyecto/BUSINESS-LOGIC.md — catálogo, costes, modelo comercial.
- docs/proyecto/CHANGELOG.md — cambios por fase.
- docs/proyecto/F11-PLAN.md y F12-PLAN.md — planes por fase.

## Migraciones SQL (13 archivos)

001 a 013. Última: 013_notificaciones.sql (F11).

## Código F11 (notificaciones, stub + mocks)

- lib/email/resend.ts (cliente + fallback mock)
- lib/email/templates/ (recordatorio, bienvenida, historial)
- lib/supabase/admin.ts (service_role, server-side)
- lib/schemas/notificacionesSchema.ts
- lib/notificaciones-actions.ts (3 server actions)
- 3 archivos de tests (20 tests nuevos)

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript + Tailwind 4
- Supabase (PostgreSQL 15 + RLS + Auth)
- Zod 4.6.7 + Vitest 3.2.7 + Vercel
- Leaflet + OpenStreetMap
- Resend (cliente con fallback mock; sin cuenta)

## Verificación (al cierre de F12)

- vitest: 28/28
- tsc --noEmit: 0 errores
- next build: verde

## Decisiones clave (APROBADAS)

- D-F11-1..5: Vercel Cron, idempotency_key, check_rate_limit, reintentos 3/backoff, notificacion_log + audit_log manuales.
- D-F12-1..5: free único MVP, límites suaves, premium v2, pricing Gs. 150k/mes Pro (v2), canal outbound.
- D-F8-1: todo free tier, único costo real dominio .com.py.

## Deuda técnica pendiente

- npm audit: 3 vulnerabilidades dev-only (1 moderate, 2 critical en vitest/tinypool). Aceptadas hasta vitest 5.x estable.
- empresa_id: null en notificaciones-actions (TODO F12+).
- SUPABASE_SERVICE_ROLE_KEY no seteada.
- RESEND_API_KEY no seteada (modo mock).
- Tipos Supabase sin regenerar (supabase gen types al aplicar 013).
- Reintentos y cron de F11 diseñados, no implementados en código.

## Próximo paso (F13)

**F13 — Operación y continuidad.**

Definir:
- Runbook específico de KuatiAuto.
- Despliegues (Vercel, Supabase).
- Entornos (local, preview, prod).
- Backups y recuperación.
- Monitorización, logs, alertas.
- Gestión de incidentes.
- Continuidad del negocio.

Docs: MANTENIMIENTO.md (template del studio a adaptar), ARCHITECTURE.md, DECISIONES.md (D-F13-*), ROADMAP.md, SESSION-STATE.md, BITACORA.md, CHANGELOG.md.

Código: ninguno. F13 es solo docs.

## Cómo retomar en una conversación nueva

Pegar este mensaje al inicio:

> Estoy retomando el proyecto KuatiAuto. Leé docs/proyecto/CONTINUACION.md para el estado actual. La última fase completada es F12. La próxima es F13 (operación y continuidad). Trabajamos con el método B (fases → docs → aprobación → commit). Al final de cada comando, copiá el output al portapapeles. Avisame cuando el contexto esté al 80%.

Después:
- Leer docs/proyecto/ROADMAP.md para el estado de cada fase.
- Leer docs/contexto/DECISIONES.md para las decisiones tomadas.
- Leer docs/proyecto/SESSION-STATE.md para el handoff.
- Arrancar F13.

## Contacto

- Propietario: Pedro J. Pirovani (pjpirovani-soft en GitHub).