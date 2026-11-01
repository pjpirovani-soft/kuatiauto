# Session State — KuatiAuto (provisional)

**Actualizado:** 2026-11-01

> Este archivo es el handoff entre sesiones. Leerlo primero al arrancar. Actualizarlo al cerrar.

## Estado actual (30 segundos)

- **Fase:** F0–F14 cerradas. E1 cerrada (gate 10/10). E2a-bis wip (funcional, sin gate formal). E2b1 wip (funcional, sin gate formal). E2b2, E3, E4a, E4b cerradas (gate 10/10). **E5a cerrada (2026-11-02)**. **E5b wip (dashboard funcional 2026-11-02, faltan listas)**. E5c pendiente.
- **Supabase real:** proyecto kuatiauto (wzfukuzcousihslfgelr, us-east-1). 19 migraciones aplicadas. .env.local cargado.
- **App funcional end-to-end contra DB real:** registro → login → crear empresa → crear cliente → crear vehículo → crear orden → catálogo → establecimientos → directorio → portal del conductor (mi-garage).
- **Tests:** 212/212 verdes (19 archivos). **tsc --noEmit:** 0 errores. **build:** OK (25 rutas).
- **Repo:** C:\Users\Admin\proyectos\kuatiauto. Remote: github.com/pjpirovani-soft/kuatiauto.
- **Bloqueado por:** nada.

## Usuarios de prueba en DB real

| Email | Rol | Empresa | Password |
|---|---|---|---|
| importjapanencar@gmail.com | propietario | Import Japan (adbcd23e-f296-435c-b835-e9ce837a9d95) | ImportJapan-2026 |
| test-b-user@example.com | propietario | Taller Prueba B (b4d1b031-f3c9-4c86-a513-b0b071929b28) | TestB1234!Segura |
| pirovanipedrojose@gmail.com | admin_general | — | (no usada en tests) |
| conductor2@example.com | conductor | — | TestConductor123! |

## Próximos 3 pasos

1. **E5b-futuro (listas del panel admin).** /admin/empresas, /admin/usuarios, /admin/catalogo. Hoy solo dashboard con contadores.
2. **E5c (Sentry + Vercel Analytics + backups automatizados).**
3. **Cierre formal de gates de E2a-bis y E2b1** (no bloqueante, solo papeleo).

## Deuda pendiente

### E4b (cerrada, 2026-11-01)
- **H-E4b-1** (bajo, UX): form de login deja el botón sin feedback ~3s durante el server action. E5.
- **H-E4b-2** (medio, cosmético): `/mi-garage/historial` muestra "Taller" y "Vehículo:" vacíos por RLS bloqueando join anidado en PostgREST. Fix: denormalizar en `proponer_historial_compartido` (migración 020) o RPC `listar_historial_compartido()` SECURITY DEFINER. Datos críticos (autorizado, token) funcionan perfecto; no bloquea.
- **D-E4b-1** (deuda UX): precargar email del cliente dueño en `ProponerHistorialForm` si existe. E5/v2.

### E4a (resuelto, salvo residuales)
- H-E4a-2 (bajo): `/establecimientos` no oculta "Nuevo" para admin_general. E5.
- H-E4a-7 (medio): directorio arranca en Asuncion sin selector de ciudad ni geolocalizacion. E5.

### E2b2 (cerrada, deudas aceptadas)
- `editarOrden` y `crearOrden` sin transaccion real (delete + insert sin rollback). Mitigado con audit log.
- Inmutabilidad de orden `completada` bloqueada solo en UI, no en backend.
- `any` en helper `mapearOpciones` de las paginas de ordenes.
- `historial_compartido.vehiculo_conductor_id` FK OK, pero el flujo conductor-conductor no se usa hoy.

### E2a/E2b1 (wip funcional)
- Gate formal de 10 puntos pendiente (solo papeleo, funcionalidad validada).

### Proyecto
- `empresa_id: null` en `notificaciones-actions.ts` (enviarBienvenida). Deuda F11.
- `RESEND_API_KEY` sin configurar (modo mock).
- npm audit: 16 moderate dev-only (cadena ESLint), no explotables en produccion.
- Sentry diseñado, no configurado — E5.
- Backups automatizados, export semanal — v2.

## Cómo retomar en conversacion nueva

Pegar el PROMPT DE CONTINUACION del dump actualizado.

## Contacto

- Propietario: Pedro J. Pirovani (pjpirovani-soft en GitHub).
- Piloto: Luis María Delvalle Ramírez — Import Japan - Autorepuestos (Encarnación).


### E5a (cerrada 2026-11-02, con deudas de dominio)
- RESEND_FROM usa onboarding@resend.dev: solo permite enviar al email de la cuenta Resend. Cambiar a no-reply@kuatiauto.com.py cuando se registre y verifique el dominio en NIC.py + Resend.
- Vercel no configurado: cuando se deploye, replicar RESEND_API_KEY y RESEND_FROM en env vars del proyecto.
- Cron de recordatorios automaticos no implementado: hoy solo se envia al completar orden manualmente.
- Fire-and-forget: los 3 envios usan void ... .catch(...). Aceptado en MVP.

### E5b (wip 2026-11-02, dashboard funcional)
- /admin/empresas pendiente: lista de empresas + detalle con contadores por empresa.
- /admin/usuarios pendiente: lista de usuarios + cambio de rol / desactivacion.
- /admin/catalogo pendiente: moderacion de servicio_global y producto_global.
- Links del sidebar admin: hoy solo Panel. Agregar los demas cuando existan las paginas.

