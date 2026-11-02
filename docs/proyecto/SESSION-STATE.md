# Session State — KuatiAuto (provisional)

**Actualizado:** 2026-11-01

> Este archivo es el handoff entre sesiones. Leerlo primero al arrancar. Actualizarlo al cerrar.

## Estado actual (30 segundos)

- **Fase:** F0–F14 cerradas. E1 cerrada (gate 10/10). E2a-bis wip (funcional, sin gate formal). E2b1 wip (funcional, sin gate formal). E2b2, E3, E4a, E4b cerradas (gate 10/10). **E5a cerrada (2026-11-02)**. **E5b CERRADA 2026-11-02 (dashboard + /admin/empresas + /admin/usuarios + /admin/catalogo servicios + productos, smoke test manual completo verde, H-E5b-3 resuelto).** E5c pendiente.
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

1. **Smoke test manual del panel admin en navegador.** Recorrer /admin, /admin/empresas, /admin/usuarios, /admin/catalogo/servicios y /admin/catalogo/productos con pirovanipedrojose@gmail.com. Crear, editar, eliminar un servicio y un producto.
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

### E5b (wip 2026-11-02, dashboard + /admin/empresas)
- /admin/empresas CERRADA: lista con filtro por estado + detalle con contadores, usuarios y establecimientos. Fix H-E5b-2 (contadores usaban RLS y devolvian 0 en dashboard).
- /admin/usuarios pendiente: lista de usuarios + cambio de rol / desactivacion.
- /admin/catalogo pendiente: moderacion de servicio_global y producto_global.
- Links del sidebar admin: hoy solo Panel. Agregar los demas cuando existan las paginas.



### E5b (CERRADA 2026-11-02)
- **Smoke test manual completo en navegador** con pirovanipedrojose@gmail.com. Pasos A (login/nav), B (/admin/empresas), C (/admin/usuarios), D (/admin/catalogo/servicios), E (/admin/catalogo/productos), F (logout/re-login/console/network). Todos verdes.
- **H-E5b-1 resuelto:** smoke test manual completo.
- **H-E5b-3 resuelto (alto, integridad de datos):** conductores aparecian con rol='empleado' en DB por bug del select que caia a la primera opcion. Fix en 4 piezas: (1) UPDATE en DB a rol='conductor'; (2) UsuarioAccionesClient no renderea select si empresaId es null (muestra texto plano); (3) cambiarRolUsuario valida invariante propietario/empleado requieren empresa_id y conductor requiere empresa_id=null; (4) +2 tests nuevos (279/279 verdes).
- **H-E5b-4 nuevo (bajo, backlog):** inconsistencia HTML min="1" vs Zod min(0) en intervalos de servicios globales. No es bug funcional.
- **Pendiente para v2:** seed de marcas [PENDIENTE] en producto_global, columna activo en catalogo global (delete real hoy).

### Proximos 3 pasos (actualizado 2026-11-02)
1. **E5c (Sentry + Vercel Analytics + backups automatizados).**
2. **Cierre formal de gates de E2a-bis y E2b1** (no bloqueante, solo papeleo).
3. **Pulir deuda UX acumulada** (H-E4b-1 login feedback, H-E4a-2 /establecimientos para admin, H-E4a-7 selector ciudad directorio, D-E4b-1 precarga email, H-E5b-4 HTML min vs Zod min).
---
## Actualización 2026-11-02 — E5c CERRADA
- **E5c-1 (Vercel Analytics):** `<Analytics />` cableado en `app/layout.tsx`.
- **E5c-2 (Sentry):** Configurado en client/server/edge. DSN en `.env.local`. Sampling 0.1 en prod, PII bloqueada. Commit `f1dfae9`.
- **E5c-3 (Backups):** Workflow de GitHub Actions (`.github/workflows/backup-db.yml`) corriendo semanalmente (domingos 00:00 PY). Commit `40abb74`. Secret `SUPABASE_DB_URL` configurado con Session Pooler.
- **Deudas abiertas:** Deploy en Vercel (E6), dominio `.com.py`, variables de producción para Sentry, 18 vulnerabilidades moderadas de `npm audit`.

---
## Actualización 2026-11-02 — Primer Deploy en Vercel (E6 parcial)
- **Deploy:** Proyecto importado en Vercel (`kuatiauto.vercel.app`). Build verde.
- **Variables:** Cargadas `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`.
- **Estado:** App funcionando en producción. Sentry y Analytics reportando.
- **Deuda:** Dominio `.com.py` pendiente de DNS.

---
## Actualización 2026-11-02 — Fase E8 (Diseño, UX, Métricas y Legal) COMPLETADA
- **Design System:** Paleta corporativa aplicada en toda la app (Landing, Login, Registro, Sidebars, Tablas, Métricas).
- **Responsive:** Sidebars con menú hamburguesa en celular. Tablas de Clientes/Vehículos/Órdenes con vista de tarjetas. Panel de admin con scroll horizontal.
- **Métricas:** Panel del CEO (`/admin/analytics`) con métricas globales. Dashboard del Propietario (`/dashboard`) con métricas propias (clientes, vehículos, órdenes).
- **Legal y Soporte:** Páginas `/terminos`, `/privacidad` (Ley 6534/2020) y `/ayuda`.
- **PWA:** Service Worker v2 con botón de "Nueva versión disponible". Versión de la app (`NEXT_PUBLIC_APP_VERSION`) visible en los sidebars.
- **Calidad:** 279 tests verdes, `tsc` limpio, build OK (25 rutas).

---
## Actualización 2026-11-02 — CIERRE FASE E8 (Cosmética, UX y Responsive)
- **Versión:** App actualizada a `v0.2.0`.
- **Design System:** Aplicado al 100% en toda la app (Landing, Login, Registro, Legales, Ayuda, Sidebars, Tablas, Formularios y Métricas).
- **Responsive:** Sidebars con barra superior en celular. Tablas de Clientes, Vehículos, Órdenes y Catálogo con vista de tarjetas. Formularios con grids responsive.
- **PWA:** Service Worker desactivado temporalmente para evitar caché obsoleto. Versión visible en sidebars.
- **Métricas:** Panel del CEO (`/admin/analytics`) y Dashboard del Propietario.
- **Calidad:** 279 tests verdes, `tsc` limpio, build OK (25 rutas).
