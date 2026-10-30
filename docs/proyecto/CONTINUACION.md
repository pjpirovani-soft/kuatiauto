# CONTINUACIÓN — KuatiAuto

**Generado:** 2026-10-30
**Propósito:** retomar el proyecto en una conversación nueva sin perder contexto.

## Estado actual

- **Proyecto:** KuatiAuto (provisional), plataforma SaaS multiempresa para mantenimiento automotor en Paraguay.
- **Repo:** https://github.com/pjpirovani-soft/kuatiauto (privado)
- **Local:** C:\Users\Admin\proyectos\studio-pjpirovani-soft\clients\kuatiauto
- **Último commit:** 3f31f3a feat: F10 — directorio y geolocalizacion (busqueda por distancia + Leaflet)
- **Fases completadas:** F0 a F10.
- **Fase en progreso:** F11 — Notificaciones y automatizaciones.
- **Fases pendientes:** F11, F12, F13, F14.

## Documentos clave

- `docs/proyecto/PROMPT-MAESTRO.md` — fuente de verdad metodológica (14 fases).
- `docs/proyecto/ROADMAP.md` — hoja de ruta con estado de cada fase.
- `docs/contexto/DECISIONES.md` — registro A/B/C/D de decisiones.
- `docs/proyecto/ARCHITECTURE.md` — arquitectura, ADRs, seguridad, multiempresa, directorio.
- `docs/proyecto/SPEC.md` — especificación funcional.
- `docs/proyecto/SESSION-STATE.md` — handoff entre sesiones.
- `docs/proyecto/BITACORA.md` — historial cronológico.
- `docs/proyecto/BUSINESS-LOGIC.md` — catálogo, costes, reglas de negocio.

## Migraciones SQL (12 archivos, ~52 KB)

001 a 012. La última es `012_busqueda_directorio.sql` (F10).

## Código frontend

- lib/schemas/directorioSchema.ts
- lib/directorio-actions.ts
- components/directorio/MapaDirectorio.tsx (Leaflet + OSM)
- app/(directorio)/page.tsx

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript + Tailwind 4
- Supabase (PostgreSQL 15 + RLS + Auth)
- Zod + Vitest + Vercel
- Leaflet + OpenStreetMap (instalado)
- Resend (email, pendiente de configurar)

## Deuda técnica pendiente

- `npm audit`: 4 vulnerabilidades (1 moderada, 1 alta, 2 críticas). Correr `npm audit fix` y verificar.
- Configurar Resend (cuenta + API key) para F11.
- Configurar Sentry (cuenta + DSN) para F11.
- `package.json` tiene `"name": "kuatiauto"`? Verificar (el scaffold decía `web-app`).
- Scaffold `web-app` intacto: `app/dashboard/clientes/`, `components/ClienteForm.tsx`, `lib/cliente-actions.ts`, `lib/auth-actions.ts`. Hay que renombrar `clientes` a `establecimientos` y adaptar a KuatiAuto en F11+.

## Próximo paso (F11)

**F11 — Notificaciones y automatizaciones.**

Definir:
- Sistema de notificaciones (email con Resend).
- Recordatorios de próximo mantenimiento (por fecha y/o km).
- Notificaciones al conductor (v2 o MVP).
- Trazabilidad, reintentos, control de errores.
- Idempotencia.
- Rate limiting de envíos.

Docs: ARCHITECTURE.md (sección Notificaciones), DECISIONES.md (D-F11-*), ROADMAP.md, SESSION-STATE.md, BITACORA.md, CHANGELOG.md.

Código: lib/email/ (Resend client, templates), lib/notificaciones-actions.ts, Supabase Edge Function o cron para envíos programados, migración 013_notificaciones.sql (tabla notificacion_log).

## Cómo retomar en una conversación nueva

Pegar este mensaje al inicio:

> Estoy retomando el proyecto KuatiAuto. Leé `docs/proyecto/CONTINUACION.md` para el estado actual. La última fase completada es F10. La próxima es F11 (notificaciones). Trabajamos con el método B (fases → docs → aprobación → commit). Al final de cada comando, copiá el output al portapapeles. Avisame cuando el contexto esté al 80%.

Después:
- Leer `docs/proyecto/ROADMAP.md` para el estado de cada fase.
- Leer `docs/contexto/DECISIONES.md` para las decisiones tomadas.
- Leer `docs/proyecto/SESSION-STATE.md` para el handoff.
- Arrancar F11.

## Contacto

- Propietario: Pedro J. Pirovani (pjpirovani-soft en GitHub).