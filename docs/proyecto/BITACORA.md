# BITACORA — KuatiAuto (provisional)

## 2026-10-30 — Fase 0: punto de partida arquitectónico

- **Contexto:** el proyecto nace del contacto comercial de Encarnación (Paraguay) que trabaja en mantenimiento automotor y propuso una plataforma común para establecimientos del rubro. El nombre `KuatiAuto` queda como provisional hasta verificar redes y DINAPI.
- **Proyecto base:** creado con `nueva-app.ps1 -Blueprint web-app -Destino clients\kuatiauto`. Scaffold `web-app` con auth + CRUD + RLS de ejemplo.
- **Metodología:** se alinea a la metodología del studio (ENC) el mismo día.
- **Fase 0 (documentación):** `ARCHITECTURE.md`, `SPEC.md`, `SESSION-STATE.md`, `CLIENTE.md`, `GLOSARIO.md`, `BITACORA.md`.
- **Decisiones aprobadas:** D-A, D-B, D-C, D-D (metodología), D-P1, D-P2, D-P3 (delegadas), ADR-001 a ADR-004.
- **Verificado:** `kuatiauto.com.py` disponible en NIC.py (2026-10-30). Sin registrar.
- **Pendiente:** verificar redes (@kuatiauto) y DINAPI (clases 9, 35, 42).
- **No se tocó:** `app/`, `components/`, `lib/`, `supabase/`.

**Commits:** `b0bea04 docs: fase 0 — punto de partida arquitectonico KuatiAuto`.

## 2026-10-30 — Fase 1: definición de producto

- **Contexto:** se define el alcance del MVP, los flujos, el modelo de datos preliminar y los criterios de aceptación.
- **Decisiones por delegación (D-F1-1, D-F1-2, D-F1-3):**
  - Flujo MVP: 7 pasos del camino feliz. Sin factura/recibo, sin impresión/PDF, sin métricas en dashboard. Próximo mantenimiento sugerido automático.
  - Orden de trabajo: 9 campos. `orden_servicio` y `orden_producto` en tablas aparte. `importe_total` único.
  - Catálogo: híbrido. Global (admin) + local (empresa). Seed manual.
- **ADRs nuevos:** ADR-005 (catálogo híbrido), ADR-006 (productos y servicios en tablas aparte).
- **Riesgos cerrados:** R5 (alcance MVP inflado).
- **Docs actualizados:** `SPEC.md` (secciones 2, 3, 4, 8, 9, 10, 11), `GLOSARIO.md` (términos nuevos), `ARCHITECTURE.md` (ADR-005, ADR-006, plan de migraciones), `SESSION-STATE.md`, `BITACORA.md`, `CHANGELOG.md`.
- **No se tocó:** `app/`, `components/`, `lib/`, `supabase/`. El scaffold `web-app` queda intacto hasta F3.

**Commits:** (pendiente).


## 2026-10-30 — Cierre de F1: alcance MVP confirmado

- **Contexto:** el PROMPT MAESTRO se recupera y se guarda como `docs/proyecto/PROMPT-MAESTRO.md`. Se crea `ROADMAP.md` (hoja de ruta de 14 fases) y `DECISIONES.md` (registro A/B/C/D).
- **Decisiones confirmadas:**
  - **P-Alcance-MVP:** los 4 componentes del PROMPT MAESTRO son MVP (gestión + directorio + portal + catálogo + inventario). Directorio y portal no son v2.
  - **P-Catálogo:** catálogo completo desde MVP (fabricantes, marcas, modelos, motores, especificaciones, fuentes).
  - **P-Inventario:** inventario y movimientos de stock en MVP.
- **Reversión:** D-P1 (mi propuesta de recortar a gestión + catálogo mínimo + admin mínimo) queda DESCARTADA. El alcance es el del PROMPT MAESTRO.
- **Consecuencia:** F2 ahora incluye el rol de conductor (portal) y el rol público (directorio). La matriz de permisos es más grande.
- **Docs actualizados:** `SPEC.md` (sección 2), `DECISIONES.md`, `ROADMAP.md`, `SESSION-STATE.md`, `BITACORA.md`, `CHANGELOG.md`.

**Commits:** (pendiente).

## 2026-10-30 — Fase 2: usuarios, roles y permisos

- **Contexto:** se define la matriz completa de permisos, la separación authn/authz, las operaciones auditables y las reglas de negocio por rol.
- **Roles del MVP:** `admin_general`, `propietario`, `empleado`, `conductor`, `visitante`. `verificador_catalogo` → v2.
- **Authn:** Supabase Auth para roles con cuenta. **Authz:** RLS + server actions (doble capa).
- **Matriz de permisos:** 20 entidades × 5 roles × operaciones (V/C/E/D). En `SPEC.md` sección 3.
- **Reglas clave:**
  - Conductor ve historial solo si autorizó. Establecimiento no ve historial cross-tenant (R8).
  - Directorio con coordenadas aproximadas. Exactas solo para autenticados (R10).
  - Propietario no puede degradarse a sí mismo ni eliminarse.
  - Admin general no ve datos de negocio.
- **Operaciones auditables:** 8 (alta/baja empresa, alta/desactivación empleado, edición cliente/vehículo/orden, edición catálogo global, cambios de rol, autorización de historial, publicación en directorio, uso de service_role).
- **Decisiones:** D-F2-1 a D-F2-5 en `DECISIONES.md`.
- **Docs actualizados:** `SPEC.md` (sección 3), `ARCHITECTURE.md` (sección Autorización), `DECISIONES.md`, `ROADMAP.md`, `SESSION-STATE.md`, `BITACORA.md`, `CHANGELOG.md`.
- **No se tocó:** `app/`, `components/`, `lib/`, `supabase/`. El scaffold `web-app` queda intacto hasta F3.

**Commits:** (pendiente).

## Deuda técnica pendiente

- Renombrar `clientes` a `establecimientos` en el scaffold (F3).
- Decidir estructura final de `app/` con route groups (F3).
- Verificar `@kuatiauto` en redes y DINAPI.
- Registrar `kuatiauto.com.py` cuando el piloto lo justifique.
- Definir contenido exacto del seed del catálogo global (~20-30 servicios/productos) (F6).