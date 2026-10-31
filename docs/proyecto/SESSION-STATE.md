# Session State — KuatiAuto (provisional)

**Actualizado:** 2026-10-31

> Este archivo es el handoff entre sesiones. Leerlo primero al arrancar. Actualizarlo al cerrar.

## Estado actual (30 segundos)

- **Fase:** E2a-bis cerrada (2026-10-31). F0–F14 completas. E1 wip (gate 7/10). E2a wip con piloto funcional.
- **Supabase real:** proyecto `kuatiauto` (`wzfukuzcousihslfgelr`, us-east-1). 15 migraciones aplicadas. `.env.local` cargado.
- **App funcional end-to-end contra DB real:** registro → login → crear empresa → crear cliente → persistencia → audit_log.
- **Piloto cargado:** Luis María Delvalle Ramírez (`importjapanencar@gmail.com`) como `propietario` de Import Japan - Autorepuestos (`adbcd23e-f296-435c-b835-e9ce837a9d95`). Cliente de prueba: María José Bitar Balletbo.
- **CEO:** Pedro José Pirovani (`pirovanipedrojose@gmail.com`) como `admin_general`, `empresa_id=null`. Panel de admin real: Supabase Dashboard (UI `/admin` es E5).
- **Tests:** 89/89 verdes (11 archivos). **tsc --noEmit:** 0 errores.
- **Repo:** `C:\Users\Admin\proyectos\kuatiauto` (movido fuera del studio). Remote: `github.com/pjpirovani-soft/kuatiauto`.
- **Bloqueado por:** nada.

## Commits clave (main)

| Hash | Contenido |
|---|---|
| `6a4d365` | feat - conecta Supabase real y valida flujo piloto end-to-end |
| `4adf7aa` | docs - E2a cierre |
| `62e3962` | fix - resolver colisión de rutas + home real |
| `7316326` | feat - UI clientes |
| `fd1d1cf` | feat - vehículos backend |
| `41fede8` | feat - clientes backend |
| `1042f2e` | feat - E1 fundamentos |
| `3684ff2` | docs - cierre F13 |

## Próximos 3 pasos (E2b subdividido)

1. **E2b1 — UI vehículos + layout dashboard con navegación (~1 sesión).**
   - `components/VehiculoForm.tsx` + 3 páginas (`/vehiculos`, `/vehiculos/nuevo`, `/vehiculos/[id]`).
   - Layout dashboard con sidebar (clientes, vehículos, directorio, logout).
2. **E2b2 — Órdenes de trabajo + empleados (~3-4 sesiones).**
   - CRUD de `orden_trabajo` + `orden_servicio` + `orden_producto`.
   - Invitación de empleados vía Resend (cuando haya key).
3. **Cierre de E1 (gate 10/10).**
   - Prueba cruzada A/B contra Supabase real.
   - 2FA en gestor de contraseñas (acción del propietario).

## Deuda pendiente

### E1 (gate 7/10)
- Prueba cruzada A/B contra Supabase real (8-10 del gate).
- 2FA en gestor de contraseñas (acción del propietario).

### E2a (menor)
- `empresa_id: null` en `notificaciones-actions.ts` (enviarBienvenida) — deuda F11 conocida.
- Seed del catálogo con marcas `[PENDIENTE]` — se resuelve con E3.
- Trigger `handle_new_user` pone `empleado` + email como nombre. Debería tomar `raw_user_meta_data` o default `propietario`. Anotado para E2b.
- Panel `/` mezclado con dashboard. Meta final: `/` = landing pública, `/dashboard` = panel logueado. Anotado para E2b1.

### Proyecto
- `SUPABASE_SERVICE_ROLE_KEY` seteada ✅
- `RESEND_API_KEY` sin configurar (modo mock) — E2b2.
- `npm audit`: 19 vulnerabilidades (17 moderate, 2 critical). Revisar al cerrar E2b. Probablemente dev-only.
- Sentry diseñado, no configurado — E5.
- Backups automatizados, export semanal — v2.

## Decisiones de E2a (por delegación, 2026-10-31)

- **D-E2-1:** soft-delete en cliente y vehículo (campo `activo`). Órdenes no se borran, se anulan.
- **D-E2-2:** próximo mantenimiento = `fecha_orden + intervalo_km`. Cálculo en server action.
- **D-E2-3:** invitación empleado = token en `usuario` + email con link. Sin tabla nueva.
- **D-E2-4:** subdivisión E2a (clientes+vehículos) → E2b (órdenes+empleados). Refinada 2026-10-31: E2b1 (UI vehículos + layout) → E2b2 (órdenes + empleados).
- **D-E2-5:** tests de E1 diferidos. **Cerrados 2026-10-31** (`rate-limit.test.ts`, `empresa-actions.test.ts`).

## Protocolo de sesión (PowerShell 5.x)

- Un comando por mensaje. Corto, pegado, verificado antes del siguiente.
- `-LiteralPath` para paths con `[id]` (wildcards de PowerShell).
- Si el output de un comando se pega en la consola, PowerShell lo interpreta como comando y falla. Los outputs van al chat, no a la consola.
- Si un comando falla 2 veces → cambiar a VS Code.
- **Archivos `.ts`/`.tsx`: se editan en VS Code o con `[System.IO.File]::WriteAllText` desde PowerShell. Nunca pegar TS en la consola.**
- **Encoding:** UTF-8 sin BOM. Verificar con `$bytes[0..2]` (no `0xEF 0xBB 0xBF`) y regex `Ã[\x80-\xBF]` para mojibake.

## Cómo retomar en conversación nueva

Pegar este mensaje:

> Retomo KuatiAuto. Leé `docs/proyecto/SESSION-STATE.md` y `docs/proyecto/STATUS.md`. Estado: F0–F14 cerradas, E1 wip (gate 7/10), E2a wip con piloto funcional end-to-end contra Supabase real. 89/89 tests, tsc 0. Próximo: E2b1 (UI vehículos + layout dashboard). Protocolo: PowerShell 5.x, un comando por mensaje, `-LiteralPath` para [id], archivos TS en VS Code (no consola), UTF-8 sin BOM, verificar encoding con bytes y regex. Repo en `C:\Users\Admin\proyectos\kuatiauto`.

## Contacto

- Propietario: Pedro J. Pirovani (pjpirovani-soft en GitHub).
- Piloto: Luis María Delvalle Ramírez — Import Japan - Autorepuestos (Encarnación).