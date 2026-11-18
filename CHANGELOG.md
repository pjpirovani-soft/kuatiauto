# Changelog

## [0.11.1] - 2026-11-18

### Added
- **H-DIR-2**: etiqueta de mantenimiento compartible con QR. Boton en `/ordenes/[id]` (si completada) y `/vehiculos/[id]` (si hay orden completada) que genera un PNG 800x1200 con datos del vehiculo, ultimo mantenimiento, proximo mantenimiento (destacado en dorado) y QR a la ficha publica (`/v/[token]`). Modal con Descargar / Copiar / WhatsApp / Ver ficha. Usa la paleta KuatiAuto (petroleo + dorado + grafito).

### Security
- **KU-SEC-03**: `checkRateLimit` ahora es fail-closed por defecto en producción. Si el RPC de rate limit falla, bloquea en vez de permitir. Solo `NODE_ENV=development` mantiene fail-open. Override explícito vía `RATE_LIMIT_FAIL_MODE` sigue funcionando.

### Fixed
- **KU-FUNC-01**: `crearOrden` y `editarOrden` usan las RPCs transaccionales `crear_orden_transaccional` y `editar_orden_transaccional` (migraciones 026 + 030). Elimina el riesgo de órdenes huérfanas por inserts no atómicos.
- **H-DIR-1**: el mapa del directorio ahora se centra en la ciudad seleccionada (`?ciudad=Asunción` → mapa en Asunción). Antes solo filtraba la lista, no el mapa. Fix en `app/directorio/page.tsx` (`CIUDADES_COORDS`) + `MiUbicacionButton.tsx` (borra `ciudad` al geolocalizar).

### Infrastructure
- **KU-OPS-01**: agregado workflow `.github/workflows/ci.yml` (Quality Gate: lint + tsc + test + build en cada push/PR a main).

### Tests
- `lib/rate-limit.test.ts`: 11 tests (antes 8) cubren default prod/dev + overrides.
- `lib/ordenes-actions.test.ts`: 15 tests pasan; agregado `mockRpc` al mock de Supabase.

### Docs
- Cierre de KU-SEC-03 y KU-FUNC-01 en STATUS/DEUDA.
- Nueva entrada en BITACORA y DECISIONES.


## [0.11.0] - 2026-11-18

### Added
- **PWA install button**: boton "Instalar app" en `/perfil` que captura `beforeinstallprompt` (Chromium) y muestra modal de instrucciones para iOS Safari (que no soporta el evento).
- `lib/pwa.ts`: utilidades `isStandalone`, `isIOS`, `canPromptInstall`, tipo `BeforeInstallPromptEvent`.
- `components/pwa/BotonInstalarApp.tsx`: componente client con deteccion de plataforma.

### Changed
- `app/perfil/page.tsx`: integrado `<BotonInstalarApp />` arriba del formulario de perfil.

### Notes
- En Chrome/Edge (Android + desktop): boton nativo de instalacion.
- En Safari iOS: modal con 4 pasos (Compartir -> Agregar a pantalla de inicio).
- En Firefox/Safari desktop o si ya esta instalada: no se renderiza (null).

Todas las versiones notables de KuatiAuto. Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/), versionado [SemVer](https://semver.org/lang/es/).

## [0.4.2] - 2026-11-02

### Changed
- `components/SidebarAdmin.tsx`, `SidebarPropietario.tsx`, `SidebarConductor.tsx`: leen versión desde `pkg.version` (`package.json`) en lugar de `process.env.NEXT_PUBLIC_APP_VERSION`. Elimina dependencia de env var manual en Vercel.
- `app/register-conductor/page.tsx`: refactor completo al Design System (paleta Kuati, Tailwind 4, logo, focus ring lima).

### Fixed
- `app/register-conductor/page.tsx`: encoding roto en "Contraseña" (era "ContraseÃ±a").
- `app/register-conductor/page.tsx`: error silenciado en server action (ahora redirige con `?error=...`).

## [0.4.1] - 2026-11-02

### Added
- `components/PublicarButton.tsx` documentado como existente e integrado en `/establecimientos/[id]`. La deuda del dump estaba desactualizada (no faltaba implementar, ya estaba).

## [0.4.0] - 2026-11-02

### Added
- `components/establecimiento/LocationPicker.tsx`: mapa Leaflet clickeable con pin arrastrable. Click en el mapa setea `lat`/`lng` y actualiza los inputs sincronizados.
- `components/directorio/MiUbicacionButton.tsx`: botón "Mi ubicación" que usa `navigator.geolocation.getCurrentPosition`, actualiza `lat`/`lng` en la URL y recarga el directorio centrado en la ubicación del usuario.
- Popup del mapa del directorio: link "Cómo llegar" que abre Google Maps con la ruta al establecimiento.
- `EstablecimientoForm.tsx`: integración del `LocationPicker` + `useState` de `coords` + inputs `lat_aproximada`/`lng_aproximada` controlados y sincronizados con el mapa.

### Changed
- `EstablecimientoForm.tsx`: `onSubmit` usa `coords` como fuente de verdad para lat/lng.
- `app/directorio/page.tsx`: reescrito con `WriteAllText` para evitar bug de literales.
- `components/directorio/MapaDirectorio.tsx`: reescrito con `WriteAllText` + link "Cómo llegar" en el popup.

### Fixed
- Bug de encoding: literales en `-replace` de PowerShell (causa: comillas simples). Workaround: `WriteAllText` con heredoc `@'...'@`.

## [0.3.0] - 2026-11-02

### Added
- Logo definitivo integrado: landing, login, registro, 4 sidebars, PWA icons, favicon.
- Variante horizontal blanca (blanco+lima) para fondos petróleo.
- Variante horizontal petróleo (petróleo+lima) para fondos claros.
- Componente `components/brand/Logo.tsx` con props variant/theme/size/href/priority.
- Assets en `public/branding/` optimizados a WebP (~39-77 KB).
- `CHANGELOG.md` (este archivo).
- Directorio con centro en Encarnación (-27.33, -55.87), radio 50 km, select de 24 ciudades.

### Changed
- `app/layout.tsx`: metadata.icons, themeColor #123C46, appleWebApp.
- `public/manifest.json`: íconos PNG reales (192, 512, maskable).
- Los 4 sidebars usan `<Logo variant="isotipo" theme="dark" />` + texto HTML.
- Login/Registro usan `<Logo variant="horizontal" theme="light" size="lg" />`.
- Landing usa `<Logo variant="horizontal" theme="dark" />` en navbar y hero.
- `.nvmrc` a Node 20 LTS (Vercel lo respeta).
- `package.json` reescrito en UTF-8 sin BOM (rompía build Vercel).

### Removed
- SVGs placeholder de PWA (icon-192x192.svg, icon-512x512.svg).
- Registro de Service Worker en `app/layout.tsx` (SW desactivado, se reactivará).

### Fixed
- Test ClienteForm.test.tsx: regex `/tel[eé]fono/i` tolera acento.

## [0.2.0] - Histórico

- F0-F14 cerradas. E1-E5b cerradas.
- Dashboard Propietario, Panel CEO `/admin/analytics`.
- Sentry, Vercel Analytics, backups en GitHub Actions.
- Design System al 100% (paleta, Inter, Tabler Icons).
- 279 tests verdes.