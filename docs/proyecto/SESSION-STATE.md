# Session State — KuatiAuto (provisional)

**Actualizado:** 2026-10-31

> Este archivo es el handoff entre sesiones. Leerlo primero al arrancar. Actualizarlo al cerrar.

## Estado actual (30 segundos)

- **Fase:** E4a cerrada (2026-10-31, directorio + establecimientos publicos). E4b pendiente (portal del conductor). F0–F14 completas. E1 wip (gate 9/10, falta 2FA del propietario). E2a-bis, E2b1, E2b2 (backend + UI de ordenes), E3, E4a cerradas.
- **Supabase real:** proyecto kuatiauto (wzfukuzcousihslfgelr, us-east-1). 18 migraciones aplicadas. .env.local cargado.
- **App funcional end-to-end contra DB real:** registro → login → crear empresa → crear cliente → crear vehiculo → persistencia → audit_log.
- **Piloto cargado:** Luis María Delvalle Ramírez (importjapanencar@gmail.com) como propietario de Import Japan - Autorepuestos (adbcd23e-f296-435c-b835-e9ce837a9d95). Cliente de prueba: María José Bitar Balletbo.
- **CEO:** Pedro José Pirovani (pirovanipedrojose@gmail.com) como admin_general, empresa_id=null. Panel de admin real: Supabase Dashboard (UI /admin es E5).
- **Tests:** 212/212 verdes (19 archivos). **tsc --noEmit:** 0 errores. **build:** OK (25 rutas).
- **Repo:** C:\Users\Admin\proyectos\kuatiauto (movido fuera del studio). Remote: github.com/pjpirovani-soft/kuatiauto.
- **Bloqueado por:** nada.

## Commits clave (main)

| Hash | Contenido |
|---|---|
| 1dbcb0e | chore - upgrade vitest 5 (resuelve 2 critical + 12 moderate) |
| b399b28 | feat - E3 catalogo local (CRUD servicios/productos) + seed marcas/modelos |
| 64c6b23 | feat - E2b2 UI de ordenes (lista, nuevo, detalle, lineas, acciones) |
| 326bd1c | feat - E2b2 backend de ordenes (schema + actions + tests) |
| b957510 | fix - migracion 016 sincroniza producto_empresa con la DB real |
| 3e4bd1d | fix - registro envia nombre a raw_user_meta_data |
| 8caefb9 | docs - cierre E2b1 completa (bitacora, changelog, handoff) |
| 99db01f | test - cubre listarVehiculosEmpresa (3 casos) |
| cbc6af3 | docs - cierre E2b1 |
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

1. **E3 — Catálogo global + local.**
   - Resuelve seed de marcas [PENDIENTE].
   - Catálogo local (CRUD).
2. **Empleados (invitación Resend).**
   - Depende de RESEND_API_KEY.
   - Quedó fuera de E2b2 por bloqueo de key.
3. **Cierre de E1 (gate 10/10).**
   - Prueba cruzada A/B contra Supabase real (8-10 del gate).
   - 2FA en gestor de contraseñas (acción del propietario).
## Deuda pendiente

### E1 (gate 9/10)
- ~~Prueba cruzada A/B contra Supabase real~~ ✅ 2026-10-31. Usuario A (Luis, Import Japan) y usuario B (test-b-user@example.com, Taller Prueba B) creados. B no ve A (listado + acceso directo por URL a cliente de A → "Cliente no encontrado"). A no ve B (idem). RLS verificado contra DB real.
- 2FA en gestor de contraseñas (acción del propietario). **Único pendiente para cerrar E1 al 10/10.**
- Usuarios de prueba: `test-b-user@example.com` (Taller Prueba B, empresa b4d1b031-f3c9-4c86-a513-b0b071929b28). Sirve para futuras pruebas cruzadas.

### E3 (resuelto 2026-10-31, salvo residuales)
- Soft-delete de catalogo local: `servicio_empresa` y `producto_empresa` no tienen columna `activo`. Se decidio no implementar `eliminar` en E3a para evitar huerfanos o errores de FK. Deuda: migracion 018 que agregue `activo boolean not null default true` + actions `eliminarX` con soft-delete.
- Catalogo tecnico profundo (versiones, motorizaciones, especificaciones de lubricante) sigue vacio: el seed solo cubre fabricante -> marca -> modelo. Deuda v2 si el piloto lo pide.
- Productos globales con `marca = [PENDIENTE]` (aceites y filtros). Requiere verificacion real de marcas (Mobil, Shell, Castrol) con fuentes. Deuda v2.

### E2b2 (resuelto 2026-10-31, salvo residuales)
- editarOrden y crearOrden sin transaccion real (delete + insert sin rollback). Mitigado con audit log.
- Inmutabilidad de orden `completada`: UI la marca solo-lectura, pero el backend no bloquea edicion explicita. Deuda de hardening.
- Catalogo global/empresa vacio: seed pendiente E3.
- `any` en helper `mapearOpciones` de las paginas de ordenes (deuda menor de tipado).

### E2a (menor)
- empresa_id: null en notificaciones-actions.ts (enviarBienvenida) — deuda F11 conocida.
- Seed del catálogo con marcas [PENDIENTE] — se resuelve con E3.

### E2b1 (resuelto 2026-10-31, salvo residuales)
- Tests de listarVehiculosEmpresa() — HECHO (3 casos, suite 89 → 92).
- Trigger handle_new_user — HECHO vía frontend (register manda nombre en raw_user_meta_data). No requirió migración SQL.
- Residual: VehiculoForm initialData=vehiculo compila por structural typing; si crece el schema, ajustar tipo VehiculoData.
- Residual: sin test unitario para los cambios en auth-actions.ts (register con nombre). Cobertura por integración manual en el próximo registro real.

### Proyecto
- SUPABASE_SERVICE_ROLE_KEY seteada OK.
- RESEND_API_KEY sin configurar (modo mock) — E2b2.
- npm audit: 16 moderate (0 critical, 0 high) desde 2026-10-31. Todas en minimatch dev-only (cadena de ESLint), no explotables en produccion. Upgrade Vitest 5 resolvio las 2 critical + 12 moderate.
- Sentry diseñado, no configurado — E5.
- Backups automatizados, export semanal — v2.

## Decisiones de E2b1 (2026-10-31)

- **D-E2b1-1:** listarVehiculosEmpresa() agregado al backend. /vehiculos es lista global real, no redirect. Sidebar linkea util. Consistente con /clientes.
- **D-E2b1-2:** VehiculoForm.tsx un solo componente con discriminated union Props (modo: crear sin initialData / modo: editar con initialData). TypeScript garantiza el contrato.
- **D-E2b1-3:** /vehiculos/[id] es editar (form pre-cargado). Eliminar es soft-delete via eliminarVehiculo (botón no implementado en UI todavía — próximo paso si se pide).
- **D-E2b1-4:** Layout dashboard en app/(dashboard)/layout.tsx con sidebar (Panel, Clientes, Vehículos, Directorio externo-al-shell, Cerrar sesión). Auth check server-side.
- **D-E2b1-5:** Panel logueado movido de (dashboard)/page.tsx a (dashboard)/dashboard/page.tsx. (dashboard)/page.tsx borrado (colisión con landing app/page.tsx).
- **D-E2b1-6:** Directorio queda fuera del shell (link a que sale del layout). Es público, no requiere sidebar.
- **D-E2b1-7:** nombre en authSchema queda opcional. Login no lo manda, register sí. El trigger SQL ya tiene coalesce. Endurecer a schema separado (registerSchema + loginSchema) queda como deuda menor si alguna vez molesta.

## Deudas diferidas (heredadas)

- Decisión D-E2-1 a D-E2-5 de E2a (soft-delete, próximo mantenimiento por fecha_orden + intervalo_km, invitación por token, subdivisión E2a/E2b, tests E1 diferidos).

## Drift check (obligatorio antes de etapas que tocan tablas existentes)

Antes de planificar cualquier etapa que toque tablas ya creadas:

1. `supabase migration list --linked` — comparar aplicadas vs `supabase/migrations/`.
2. `supabase db diff --linked --schema public` — detectar objetos en la DB real ausentes en el repo.
3. Si hay drift: migración de sincronización `NNN_*.sql`, commit aparte, push, recién después planificar.

Origen: `producto_empresa` apareció a mitad de planificar E2b2 sesión 1. Detectado a tiempo por suerte. Nota: `supabase db diff` requiere Docker Desktop corriendo (`docker ps` sin error). `rls_auto_enable` es ruido conocido de Supabase (event trigger del dashboard), no es drift.

## Protocolo de sesión (PowerShell 5.x)

- **Un comando por mensaje.** Corto, pegado, verificado antes del siguiente.
- **-LiteralPath** para paths con [id] en cmdlets de PS. Para System.IO.File.WriteAllText no hace falta (es .NET, no glob).
- **Nunca pegar TS/TSX en la consola.** Va por VS Code o por System.IO.File.WriteAllText. Este proyecto ya perdió ~40 min por esto.
- **Nunca pegar el prompt PS C:> ni el >> en la consola.** Los outputs van al chat, no a la consola.
- **npm test en PowerShell 5.x:** usar cmd /c "npm test > file 2>&1" para evitar NativeCommandError que mata el pipeline. Leer el archivo con Get-Content y filtrar.
- **Encoding:** UTF-8 sin BOM. Verificar con $bytes[0..2] (no 0xEF 0xBB 0xBF) y regex para mojibake.
- **Caché de tipos .next:** si tsc marca error en .next/dev/types/validator.ts, borrar la carpeta .next recursivamente y reintentar.
- **Heredocs en PowerShell:** frágiles con paste. Preferir $lines = @(...) -join "`r`n" + WriteAllText. Y evitar backticks o comillas simples dobles dentro de los literales.
- **Reemplazos con .Replace() de strings multilínea:** si el texto no matchea exacto, no cambia nada y no da error. Para bloques grandes, regenerar el archivo completo en vez de reemplazar.

## Cómo retomar en conversación nueva

Pegar este mensaje:

> Retomo KuatiAuto. Leé docs/proyecto/SESSION-STATE.md y docs/proyecto/STATUS.md. Estado: F0–F14 cerradas, E1 wip (gate 7/10), E2a-bis cerrada, E2b1 cerrada, E2b2 backend cerrado. 133/133 tests, tsc 0, build OK. Proximo: E2b2 sesion 2 (UI de ordenes). Protocolo: PowerShell 5.x, un comando por mensaje, -LiteralPath para [id], archivos TS en VS Code (no consola), npm test via cmd /c con redirect a archivo, UTF-8 sin BOM, verificar encoding con bytes y regex. Repo en C:\Users\Admin\proyectos\kuatiauto.

## Contacto

- Propietario: Pedro J. Pirovani (pjpirovani-soft en GitHub).
- Piloto: Luis María Delvalle Ramírez — Import Japan - Autorepuestos (Encarnación).