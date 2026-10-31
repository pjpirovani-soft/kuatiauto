# Session State — KuatiAuto (provisional)

**Actualizado:** 2026-10-31

> Este archivo es el handoff entre sesiones. Leerlo primero al arrancar. Actualizarlo al cerrar.

## Estado actual (30 segundos)

- **Fase:** E2b1 cerrada (2026-10-31). F0–F14 completas. E1 wip (gate 7/10). E2a-bis cerrada. E2b1 cerrada (UI vehiculos + layout dashboard).
- **Supabase real:** proyecto kuatiauto (wzfukuzcousihslfgelr, us-east-1). 15 migraciones aplicadas. .env.local cargado.
- **App funcional end-to-end contra DB real:** registro → login → crear empresa → crear cliente → crear vehiculo → persistencia → audit_log.
- **Piloto cargado:** Luis María Delvalle Ramírez (importjapanencar@gmail.com) como propietario de Import Japan - Autorepuestos (adbcd23e-f296-435c-b835-e9ce837a9d95). Cliente de prueba: María José Bitar Balletbo.
- **CEO:** Pedro José Pirovani (pirovanipedrojose@gmail.com) como admin_general, empresa_id=null. Panel de admin real: Supabase Dashboard (UI /admin es E5).
- **Tests:** 89/89 verdes (11 archivos). **tsc --noEmit:** 0 errores. **build:** OK.
- **Repo:** C:\Users\Admin\proyectos\kuatiauto (movido fuera del studio). Remote: github.com/pjpirovani-soft/kuatiauto.
- **Bloqueado por:** nada.

## Commits clave (main)

| Hash | Contenido |
|---|---|
| 6143d08 | feat - E2b1 UI vehiculos + layout dashboard |
| 45620f7 | fix(e2a) - E2a-bis saneamiento (tests E1 cerrados, ClienteForm reescrito, docs) |
| 6a4d365 | feat - conecta Supabase real y valida flujo piloto end-to-end |
| 4adf7aa | docs - E2a cierre |
| 62e3962 | fix - resolver colisión de rutas + home real |
| 7316326 | feat - UI clientes |
| fd1d1cf | feat - vehículos backend |
| 41fede8 | feat - clientes backend |
| 1042f2e | feat - E1 fundamentos |
| 3684ff2 | docs - cierre F13 |

## Próximos 3 pasos

1. **Tests de listarVehiculosEmpresa() (~30 min).**
   - Agregar 2 casos en lib/vehiculos-actions.test.ts: (a) ok con auth+empresa, (b) sin auth. Sube suite de 89 a ~91.
   - Deuda nueva de E2b1 — no se agregó en esta sesión por decisión de alcance.
2. **Trigger handle_new_user (SQL, migracion nueva).**
   - Hoy pone empleado + email como nombre. Debería tomar raw_user_meta_data o default propietario.
   - Deuda de E1 anotada para E2b1, no resuelta esta sesión.
3. **E2b2 — Órdenes de trabajo + empleados (~3-4 sesiones).**
   - CRUD de orden_trabajo + orden_servicio + orden_producto.
   - Invitación de empleados vía Resend (cuando haya key).

## Deuda pendiente

### E1 (gate 7/10)
- Prueba cruzada A/B contra Supabase real (8-10 del gate).
- 2FA en gestor de contraseñas (acción del propietario).

### E2a (menor)
- empresa_id: null en notificaciones-actions.ts (enviarBienvenida) — deuda F11 conocida.
- Seed del catálogo con marcas [PENDIENTE] — se resuelve con E3.

### E2b1 (nueva)
- **Tests de listarVehiculosEmpresa()** — backend agregado sin cobertura. Prioridad alta.
- **Trigger handle_new_user** — todavía asigna empleado + email como nombre. Debe tomar raw_user_meta_data o default propietario. Prioridad media.
- **VehiculoForm initialData=vehiculo** — hoy compila por structural typing (Supabase devuelve activo de más, se ignora). Si se agregan más campos al schema, ajustar el tipo VehiculoData del form.

### Proyecto
- SUPABASE_SERVICE_ROLE_KEY seteada OK.
- RESEND_API_KEY sin configurar (modo mock) — E2b2.
- npm audit: 19 vulnerabilidades (17 moderate, 2 critical). Revisar al cerrar E2b.
- Sentry diseñado, no configurado — E5.
- Backups automatizados, export semanal — v2.

## Decisiones de E2b1 (2026-10-31)

- **D-E2b1-1:** listarVehiculosEmpresa() agregado al backend. /vehiculos es lista global real, no redirect. Sidebar linkea util. Consistente con /clientes.
- **D-E2b1-2:** VehiculoForm.tsx un solo componente con discriminated union Props (modo: crear sin initialData / modo: editar con initialData). TypeScript garantiza el contrato.
- **D-E2b1-3:** /vehiculos/[id] es editar (form pre-cargado). Eliminar es soft-delete via eliminarVehiculo (botón no implementado en UI todavía — próximo paso si se pide).
- **D-E2b1-4:** Layout dashboard en app/(dashboard)/layout.tsx con sidebar (Panel, Clientes, Vehículos, Directorio externo-al-shell, Cerrar sesión). Auth check server-side.
- **D-E2b1-5:** Panel logueado movido de (dashboard)/page.tsx a (dashboard)/dashboard/page.tsx. (dashboard)/page.tsx borrado (colisión con landing app/page.tsx).
- **D-E2b1-6:** Directorio queda fuera del shell (link a que sale del layout). Es público, no requiere sidebar.

## Deudas diferidas (heredadas)

- Decisión D-E2-1 a D-E2-5 de E2a (soft-delete, próximo mantenimiento por fecha_orden + intervalo_km, invitación por token, subdivisión E2a/E2b, tests E1 diferidos).

## Protocolo de sesión (PowerShell 5.x)

- **Un comando por mensaje.** Corto, pegado, verificado antes del siguiente.
- **-LiteralPath** para paths con [id] en cmdlets de PS. Para System.IO.File.WriteAllText no hace falta (es .NET, no glob).
- **Nunca pegar TS/TSX en la consola.** Va por VS Code o por System.IO.File.WriteAllText. Este proyecto ya perdió ~30 min por esto.
- **Nunca pegar el prompt PS C:> ni el >> en la consola.** Los outputs van al chat, no a la consola.
- **npm test en PowerShell 5.x:** usar cmd /c "npm test > file 2>&1" para evitar NativeCommandError que mata el pipeline. Leer el archivo con Get-Content y filtrar.
- **Encoding:** UTF-8 sin BOM. Verificar con $bytes[0..2] (no 0xEF 0xBB 0xBF) y regex para mojibake.
- **Caché de tipos .next:** si tsc marca error en .next/dev/types/validator.ts, borrar la carpeta .next recursivamente y reintentar.
- **Heredocs en PowerShell:** frágiles con paste. Preferir $lines = @(...) -join "`r`n" + WriteAllText. Y evitar backticks o comillas simples dobles dentro de los literales.

## Cómo retomar en conversación nueva

Pegar este mensaje:

> Retomo KuatiAuto. Leé docs/proyecto/SESSION-STATE.md y docs/proyecto/STATUS.md. Estado: F0–F14 cerradas, E1 wip (gate 7/10), E2a-bis cerrada, E2b1 cerrada (UI vehículos + layout dashboard). 89/89 tests, tsc 0, build OK. Próximo: tests de listarVehiculosEmpresa() + trigger handle_new_user, después E2b2 (órdenes + empleados). Protocolo: PowerShell 5.x, un comando por mensaje, -LiteralPath para [id], archivos TS en VS Code (no consola), npm test via cmd /c con redirect a archivo, UTF-8 sin BOM, verificar encoding con bytes y regex. Repo en C:\Users\Admin\proyectos\kuatiauto.

## Contacto

- Propietario: Pedro J. Pirovani (pjpirovani-soft en GitHub).
- Piloto: Luis María Delvalle Ramírez — Import Japan - Autorepuestos (Encarnación).