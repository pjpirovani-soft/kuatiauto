# Session State — KuatiAuto (provisional)

**Actualizado:** 2026-10-31

> Este archivo es el handoff entre sesiones. Leerlo primero al arrancar. Actualizarlo al cerrar.

## Estado actual (30 segundos)

- **Fase:** E2a — Gestión core: clientes + vehículos backend (WIP 2026-10-31). F0–F14 COMPLETADAS. E1 wip.
- **Trabajando en:** E2a. Hecho: clientes CRUD end-to-end (schema, actions, tests, UI), vehículos backend (schema, actions, tests), fix de colisión de rutas, home real, migraciones 014/015.
- **Tests:** 71/73 verdes. 2 desactualizados (vehiculoSchema.test.ts: `km_actual` optional; ClienteForm.test.tsx: props viejas).
- **tsc --noEmit:** 0 errores.
- **App funcional:** login, directorio, CRUD clientes. Verificado con `npm run dev`.
- **Bloqueado por:** nada.

## Commits clave (main)

| Hash | Contenido |
|---|---|
| `1042f2e` | E1 - fundamentos (wip) |
| `4987fc3` | docs - sección E1 en ROADMAP |
| `4fa3185` | E2a - plan de gestión core |
| `41fede8` | E2a - clientes (schema, actions, tests) |
| `fd1d1cf` | E2a - vehículos (schema, actions, tests, migración 015) |
| `7316326` | E2a - UI clientes (form, lista, nuevo, editar) |
| `62e3962` | E2a - fix colisión de rutas + home real |

## Próximos 3 pasos

1. **Cerrar docs de E2a:** `STATUS.md` actualizado, commit `docs(kuatiauto): E2a - cierre` (BITACORA y CHANGELOG ya actualizados).
2. **UI vehículos:** `VehiculoForm.tsx` + 3 páginas (`vehiculos/page.tsx`, `nuevo/page.tsx`, `[id]/page.tsx`). Backend listo.
3. **Layout dashboard con navegación:** sidebar o menú que una clientes, vehículos, directorio, logout.

## Deuda pendiente (E2a)

- `vehiculoSchema.test.ts`: 1 test espera `km_actual: 0`, ahora es `optional`.
- `ClienteForm.test.tsx`: test escrito para componente viejo (FormData), reescribir.
- Links de clientes apuntan a `/dashboard/clientes`, ruta real es `/clientes` (por route group).
- `lib/empresa-actions.ts` está en una línea (reformatear).

## Deuda pendiente (E1)

- Tests de `rate-limit.ts` y `empresa-actions.ts` (diferidos a E2a, aún no escritos).
- Prueba cruzada A/B contra Supabase real.
- Gate de seguridad de 10 puntos: parcial (1-7 ok, 8-10 pendientes por Supabase real).

## Deuda pendiente (proyecto)

- Verificar `@kuatiauto` en redes y DINAPI.
- Registrar `kuatiauto.com.py` cuando el piloto lo justifique.
- `SUPABASE_SERVICE_ROLE_KEY` y `RESEND_API_KEY` sin configurar (modo mock).
- Tipos Supabase sin regenerar.

## Decisiones de E2a (por delegación, 2026-10-31)

- **D-E2-1:** soft-delete en cliente y vehículo (campo `activo`). Órdenes no se borran, se anulan.
- **D-E2-2:** próximo mantenimiento = `fecha_orden + intervalo_km`. Cálculo en server action.
- **D-E2-3:** invitación empleado = token en `usuario` + email con link. Sin tabla nueva.
- **D-E2-4:** subdivisión E2a (clientes+vehículos) → E2b (órdenes+empleados).
- **D-E2-5:** tests de E1 diferidos se escriben al final de E2a.

## Protocolo de sesión (PowerShell 5.x)

- Un comando por mensaje. Corto, pegado, verificado antes del siguiente.
- `Set-Clipboard` al final de comandos con output útil. **Ctrl+V en el chat, no en la consola.**
- Nunca pegar `PS C:\...>` ni `>>`. Nunca here-strings multilínea sin `@'...'@` bien cerrado.
- `-LiteralPath` para paths con `[id]`.
- Si un comando falla 2 veces → cambiar a VS Code.

## Cómo retomar en conversación nueva

Pegar este mensaje:

> Retomo KuatiAuto. Leé `docs/proyecto/SESSION-STATE.md` y `docs/proyecto/CONTINUACION.md`. Estado: F0–F14 cerradas, E1 wip, E2a funcional end-to-end (clientes CRUD + vehículos backend). 71/73 tests, tsc 0. Próximo: cerrar docs E2a, UI vehículos, layout dashboard. Protocolo: PowerShell 5.x, un comando por mensaje, Set-Clipboard al final, sin pegar PS> ni transcripts, -LiteralPath para [id], si falla 2 veces → VS Code.

