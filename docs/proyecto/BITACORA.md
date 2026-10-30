# BITACORA — KuatiAuto (provisional)

## 2026-10-30 — Fase 0: punto de partida arquitectónico

- **Contexto:** el proyecto nace del contacto comercial de Encarnación (Paraguay) que trabaja en mantenimiento automotor y propuso una plataforma común para establecimientos del rubro. El nombre `KuatiAuto` queda como provisional hasta verificar redes y DINAPI.
- **Proyecto base:** creado con `nueva-app.ps1 -Blueprint web-app -Destino clients\kuatiauto`. Scaffold `web-app` con auth + CRUD + RLS de ejemplo.
- **Metodología:** se alinea a la metodología del studio (ENC) el mismo día: docs por área, SESSION-STATE como handoff, hallazgos en BITACORA, seguridad integrada en ARCHITECTURE.
- **Fase 0 (documentación):** se escriben/actualizan:
  - `ARCHITECTURE.md` (stack + ADRs 001-004 + sección Seguridad con 10 fundamentos + gate por módulo).
  - `SPEC.md` (alcance MVP, riesgos R1-R14, criterios vacíos, fases).
  - `SESSION-STATE.md` (estado, open loops, follow-ups, decisiones de sesión, próximos 3 pasos).
  - `CLIENTE.md` (piloto provisional con 5 campos `[PENDIENTE]`).
  - `GLOSARIO.md` (términos base).
  - `BITACORA.md` (esta entrada).
- **Decisiones aprobadas:** D-A, D-B, D-C, D-D (metodología), D-P1, D-P2, D-P3 (delegadas), ADR-001 a ADR-004.
- **Verificado:** `kuatiauto.com.py` disponible en NIC.py (2026-10-30). Sin registrar.
- **Pendiente:** verificar redes (@kuatiauto) y DINAPI (clases 9, 35, 42).
- **No se tocó:** `app/`, `components/`, `lib/`, `supabase/`. El scaffold `web-app` queda intacto hasta F3.

**Commits:** (pendiente).

## Deuda técnica pendiente

- Renombrar `clientes` a `establecimientos` en el scaffold (F3).
- Decidir estructura final de `app/` con route groups (F3).
- Verificar `@kuatiauto` en redes y DINAPI.
- Registrar `kuatiauto.com.py` cuando el piloto lo justifique.