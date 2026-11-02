# Changelog

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
- `components/directorio/MiUbicacionButton.tsx`: botÃ³n "ðŸ“ Mi ubicaciÃ³n" que usa `navigator.geolocation.getCurrentPosition`, actualiza `lat`/`lng` en la URL y recarga el directorio centrado en la ubicaciÃ³n del usuario.
- Popup del mapa del directorio: link "ðŸ§­ CÃ³mo llegar" que abre Google Maps con la ruta al establecimiento (`https://www.google.com/maps/dir/?api=1&destination=lat,lng`).
- `EstablecimientoForm.tsx`: integraciÃ³n del `LocationPicker` + `useState` de `coords` + inputs `lat_aproximada`/`lng_aproximada` controlados y sincronizados con el mapa.

### Changed
- `EstablecimientoForm.tsx`: `onSubmit` usa `coords` como fuente de verdad para lat/lng (`coords?.lat ?? fd.get(...)`).
- `app/directorio/page.tsx`: reescrito con `WriteAllText` (sin `-replace` con `` `n ``) para evitar el bug de literales.
- `components/directorio/MapaDirectorio.tsx`: reescrito con `WriteAllText` + link "CÃ³mo llegar" en el popup.

### Fixed
- Bug de encoding: `` `n `` literales en `-replace` de PowerShell (causa: comillas simples no interpretan `` `n ``). Workaround: `[System.IO.File]::WriteAllText` con heredoc `@'...'@` y `UTF8Encoding($false)`.

### Deudas tÃ©cnicas conocidas
- `app/register-conductor/page.tsx` fuera del Design System (Tailwind bÃ¡sico, encoding roto en "ContraseÃ±a").
- BotÃ³n "Publicar en directorio" no conectado a la UI (existe `publicarEstablecimiento` en actions; hoy se publica solo por SQL).
- Sidebar lee versiÃ³n desde `NEXT_PUBLIC_APP_VERSION`, idealmente deberÃ­a leer de `package.json`.
- Tests con regex de labels sin acento (frÃ¡gil).
- Dominio `.com.py` postergado hasta validar producto (costo: G. 160.000/aÃ±o en NIC.py).

## [0.3.0] - 2026-11-02

### Added
- Logo definitivo integrado: landing, login, registro, 4 sidebars, PWA icons, favicon.
- Variante horizontal blanca (blanco+lima) para fondos petrÃ³leo.
- Variante horizontal petrÃ³leo (petrÃ³leo+lima) para fondos claros.
- Componente `components/brand/Logo.tsx` con props variant/theme/size/href/priority.
- Assets en `public/branding/` optimizados a WebP (~39-77 KB).
- `CHANGELOG.md` (este archivo).
- `NEXT_PUBLIC_APP_VERSION` en `.env.local` para mostrar versiÃ³n en sidebars.
- Directorio con centro en EncarnaciÃ³n (-27.33, -55.87), radio 50 km, select de 24 ciudades.

### Changed
- `app/layout.tsx`: metadata.icons, themeColor #123C46, appleWebApp.
- `public/manifest.json`: Ã­conos PNG reales (192, 512, maskable).
- Los 4 sidebars usan `<Logo variant="isotipo" theme="dark" />` + texto HTML.
- Login/Registro usan `<Logo variant="horizontal" theme="light" size="lg" />`.
- Landing usa `<Logo variant="horizontal" theme="dark" />` en navbar y hero.
- `.nvmrc` a Node 20 LTS (Vercel lo respeta).
- `package.json` reescrito en UTF-8 sin BOM (rompÃ­a build Vercel).

### Removed
- SVGs placeholder de PWA (icon-192x192.svg, icon-512x512.svg).
- Registro de Service Worker en `app/layout.tsx` (SW desactivado, se reactivarÃ¡).

### Fixed
- Test ClienteForm.test.tsx: regex `/tel[eÃ©]fono/i` tolera acento.

## [0.2.0] - HistÃ³rico

- F0-F14 cerradas. E1-E5b cerradas.
- Dashboard Propietario, Panel CEO `/admin/analytics`.
- Sentry, Vercel Analytics, backups en GitHub Actions.
- Design System al 100% (paleta, Inter, Tabler Icons).
- 279 tests verdes.