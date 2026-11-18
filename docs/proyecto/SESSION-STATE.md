# Session State — KuatiAuto (provisional)

**Actualizado:** 2026-11-02

> Este archivo es el handoff entre sesiones. Leerlo primero al arrancar. Actualizarlo al cerrar.

## Estado actual (2026-11-02, post-fase D)

- `v0.4.2` EN PRODUCCIÓN (kuatiauto.vercel.app). `HEAD = fde7fc3`. Tag `v0.4.2` = HEAD.
- **Fase D (Playwright E2E) CERRADA parcialmente**: setup + 6 smokes read-only contra prod (4 roles + analytics + dashboard). Flows de escritura y CI pendientes.
- **Tests:** 279/279 Vitest + 6/6 Playwright smokes. **tsc --noEmit:** 0 errores. **build:** OK (25 rutas).
- **Supabase real:** proyecto kuatiauto (wzfukuzcousihslfgelr, us-east-1). 20 migraciones aplicadas.
- **Usuario de prueba admin (con password):** pirovanipedrojose@gmail.com / AdminKuati-2026!.
- **Bloqueado por:** nada.

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

## Próximos 3 pasos (2026-11-02, post-D parcial)

1. **Flows de escritura contra Supabase local.** Setup supabase start + seed de usuarios + escribir e2e/flows/registro-publicar.spec.ts: registro -> empresa -> establecimiento -> publicar -> directorio. Ver BITACORA.md (cierre D parcial).
2. **Cierre formal de gates de E2a-bis y E2b1** (no bloqueante, solo papeleo).
3. **Pulir deuda UX acumulada** (H-E4b-1 login feedback, H-E4a-2 /establecimientos para admin, H-E4a-7 selector ciudad directorio, D-E4b-1 precarga email, H-E5b-4 HTML min vs Zod min).

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

---

## 2026-11-18 - Sesion CI Quality Gate

**Estado:** CI Quality Gate operativo. Fix de RLS test. Docs de deuda.

**Hecho:**
- `.github/workflows/ci.yml` creado (lint + tsc + test + build en push/PR).
- `components/recepcion/PasoOrden.tsx` refactorizado (useMemo).
- `eslint.config.mjs` con `no-explicit-any`, `no-unused-vars`, `set-state-in-effect` a `warn`.
- `lib/rls-cross-tenant.test.ts` con `skipIf` para CI.
- `DEUDA.md`, `migraciones-notes.md` nuevos.
- `DECISIONES.md` (ADR-017), `BITACORA.md` (entrada nueva), `SESSION-STATE.md` (esta entrada).

**Verificacion:**
- 300/300 tests con `.env.local`.
- 296/300 con placeholders (4 RLS skipped, exit 0).
- Lint: exit 0 (0 errores, 53 warnings).
- TSC: exit 0.
- Build: verde.

**Open loops:**
- **P0:** RLS cross-tenant solo local (pgTAP/staging pendiente).
- **P1:** refactor de 4 `useEffect` con `setState`.
- **P2:** `.gitattributes`, BOM `next.config.mjs`, `.gitignore` dedup, cron recordatorios, paginacion admin.
- **P3:** H-025-1, docs vs `main`, README, Supabase CLI v3.

**Proximos 3 pasos:**
1. Mergear PR #2 (fix RLS + docs).
2. PR #3: `.gitattributes` + BOM + `.gitignore` (deuda P2 rapida).
3. Refactor de `OrdenForm.tsx` (useEffect con setState, prioritario).

**Lecciones:** no reescribir archivos >30 lineas sin verlos completos. `git checkout --` es la red de seguridad. `cmd /c "..."` para builds con pipe en PS 5.x.
---

## 2026-11-18 - PWA install button + release v0.11.0

**Estado:** PWA install button en produccion. Release v0.11.0 taggeado.

**Hecho:**
- `lib/pwa.ts`: `isStandalone`, `isIOS`, `canPromptInstall`, `BeforeInstallPromptEvent`.
- `components/pwa/BotonInstalarApp.tsx`: detecta plataforma, escucha `beforeinstallprompt`, modal 4 pasos para iOS.
- `app/perfil/page.tsx`: integrado `<BotonInstalarApp />`.
- `package.json`: 0.10.0 -> 0.11.0.
- `CHANGELOG.md`: seccion [0.11.0].
- Tag `v0.11.0` en `main` (commit `1929b86`).
- Branch protection en `main`: requiere `Quality Gate`, `strict: false`, `enforce_admins: false`.

**Verificacion:**
- CI: `All checks were successful` (4/4).
- `tsc --noEmit`: 0 errores.
- `npm run lint`: 0 errors, 54 warnings.
- `npm run build`: verde.
- Tag apunta al commit correcto.

**Open loops:**
- **P0:** KU-FUNC-01 (RPCs transaccionales no usadas en `ordenes-actions.ts`), KU-FUNC-02 (`crearVehiculo` no valida `cliente_id`).
- **P1:** KU-SEC-06 (rate limit busqueda), 4 `useEffect` con setState, 54 warnings lint.
- **P2:** `stock_movimiento` sin UI, refactor `admin-actions.ts` (400+ lineas), paginacion admin, `H-025` stock UI.
- **P3:** H-025-1 (telefono en crear_empresa), BOM `next.config.mjs`, `.gitattributes`, README, Supabase CLI v3.
- **Nuevo H-039:** warning `no-explicit-any` del cast `BeforeInstallPromptEvent` en `BotonInstalarApp.tsx:18` y `pwa.ts:22`. Deuda menor.

**Proximos 3 pasos:**
1. PR de docs (este).
2. Configurar cache de `.next/cache` en CI (~30s menos por run).
3. Atacar KU-FUNC-01 (usar `crear_orden_transaccional` en `crearOrden`).

**Lecciones:**
- **`beforeinstallprompt` solo Chromium.** iOS requiere instrucciones manuales.
- **`--auto` en `gh pr merge` requiere habilitar auto-merge en el repo.** No esta habilitado.
- **Branch protection con `strict: true` bloquea merges aunque los checks esten verdes** si la branch no esta actualizada con `main`.
- **El nombre del check requerido tiene que coincidir exacto** con lo que reporta GitHub. `Playwright smoke-prod (pull_request)` no se reconocio como valido.
- **`--admin` es la salida de emergencia** cuando la branch protection mal configurada bloquea.