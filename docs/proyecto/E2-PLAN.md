# E2 — Gestión core (plan de fase)

**Generado:** 2026-10-30
**Estado:** EN PROGRESO. Subdividida E2a → E2b por delegación (sesión 2026-10-30).
**Fuente:** IMPLEMENTATION-PLAN.md §2 y §3, SPEC.md §3, ARCHITECTURE.md §Gate de seguridad, migraciones 001-013.

## Alcance E2a (este tramo)

- **Clientes CRUD** — tabla `cliente` (migración 003). Listar, crear, editar, soft-delete. Server action con Zod + `audit_log`. RLS ya existe.
- **Vehículos CRUD** — tablas `vehiculo` + `vehiculo_identidad` (migración 004, trigger `poblar_vehiculo_identidad`). Vinculados a cliente. CRUD básico.
- **Deuda E1 saldada en E2a:** tests de `lib/rate-limit.ts` y `lib/empresa-actions.ts`; reformateo de `lib/empresa-actions.ts` (hoy en una línea); saneamiento menor de `CHANGELOG.md`, `CONTINUACION.md` y `.gitignore` (`docs/_ultimo-commit.txt`).

## Fuera de alcance E2a (queda para E2b)

- Órdenes de trabajo (`orden_trabajo`, `orden_servicio`, `orden_producto`).
- Empleados (invitación vía Resend).
- Próximo mantenimiento sugerido.

## Decisiones D-E2-* (por delegación, 2026-10-30)

| ID | Decisión | Estado |
|---|---|---|
| D-E2-1 | Soft-delete en `cliente` y `vehiculo` (campo `activo`). Órdenes no se borran, se anulan. | APROBADA por delegación |
| D-E2-2 | Próximo mantenimiento = `fecha_orden + intervalo_km` (de la última orden). Cálculo en server action, no en BD. | APROBADA por delegación |
| D-E2-3 | Invitación de empleado = token en `usuario` + email con link. Sin tabla nueva. | APROBADA por delegación |
| D-E2-4 | Subdivisión E2a (clientes+vehículos) → E2b (órdenes+empleados) desde el inicio. | APROBADA por delegación |
| D-E2-5 | Tests de E1 diferidos se escriben al final de E2a, no al principio. | APROBADA por delegación |

## Orden de implementación E2a

1. `lib/schemas/clienteSchema.ts` + `lib/clientes-actions.ts` (Zod + audit + rate limit).
2. `lib/schemas/vehiculoSchema.ts` + `lib/vehiculos-actions.ts` (Zod + audit + rate limit).
3. UI mínima: `app/(dashboard)/clientes/` (lista, nuevo, editar), `app/(dashboard)/vehiculos/` (lista, nuevo, editar).
4. Tests de E1 diferidos (`rate-limit.test.ts`, `empresa-actions.test.ts`).
5. Saneamiento menor (CHANGELOG, CONTINUACION, .gitignore, empresa-actions reformateo).
6. Verificación: `npm run test`, `tsc --noEmit`, `next build`.
7. Gate de seguridad de 10 puntos (§6 IMPLEMENTATION-PLAN).

## Criterios de aceptación E2a

- [ ] Clientes y vehículos CRUD funcionales end-to-end.
- [ ] Server actions con Zod + rate limit + `audit_log`.
- [ ] RLS verificado con prueba manual de 2 usuarios en la misma empresa y en empresas distintas (si hay Supabase real; si no, queda `wip` con nota).
- [ ] Tests verdes de E1 diferidos.
- [ ] `tsc --noEmit` 0 errores, `next build` verde.
- [ ] Docs actualizados: BITACORA, CHANGELOG, SESSION-STATE, STATUS, ROADMAP.
- [ ] Gate de seguridad de 10 puntos: sección en BITACORA con hallazgos.

## Riesgos

- **Sin Supabase real:** la prueba cruzada A/B y el gate completo quedan pendientes. E2a se commiteará como `wip` si el gate no llega a 10/10.
- **Resend sin key:** E2a no usa email, no bloquea.

## Deuda que E2a NO cierra

- Prueba cruzada A/B completa (requiere Supabase real).
- Regenerar tipos Supabase (`supabase gen types`) — se hace al configurar Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: si no está, audit y notificacion_log no persisten (fail-open). Queda documentado.
