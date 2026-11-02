# Changelog

Todas las versiones notables de KuatiAuto. Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/), versionado [SemVer](https://semver.org/lang/es/).

## [0.3.0] - 2026-11-02

### Added
- Logo definitivo integrado: landing, login, registro, 4 sidebars, PWA icons, favicon.
- Variante horizontal blanca (blanco+lima) para fondos petróleo.
- Variante horizontal petróleo (petróleo+lima) para fondos claros.
- Componente `components/brand/Logo.tsx` con props variant/theme/size/href/priority.
- Assets en `public/branding/` optimizados a WebP (~39-77 KB).
- `CHANGELOG.md` (este archivo).
- `NEXT_PUBLIC_APP_VERSION` en `.env.local` para mostrar versión en sidebars.

### Changed
- `app/layout.tsx`: metadata.icons, themeColor #123C46, appleWebApp.
- `public/manifest.json`: íconos PNG reales (192, 512, maskable).
- Los 4 sidebars usan `<Logo variant="isotipo" theme="dark" />` + texto HTML.
- Login/Registro usan `<Logo variant="horizontal" theme="light" size="lg" />`.
- Landing usa `<Logo variant="horizontal" theme="dark" />` en navbar y hero.

### Removed
- SVGs placeholder de PWA (icon-192x192.svg, icon-512x512.svg).
- Registro de Service Worker en `app/layout.tsx` (SW desactivado, se reactivará).

### Fixed
- Test ClienteForm.test.tsx: regex `/tel[eé]fono/i` tolera acento.

### Deudas técnicas conocidas
- `app/register-conductor/page.tsx` fuera del Design System (encoding roto en "Contraseña").
- Tests con regex de labels sin acento (frágil).
- Sidebar debería leer versión de `package.json`, no de env var.

## [0.2.0] - Histórico

- F0-F14 cerradas. E1-E5b cerradas.
- Dashboard Propietario, Panel CEO `/admin/analytics`.
- Sentry, Vercel Analytics, backups en GitHub Actions.
- Design System al 100% (paleta, Inter, Tabler Icons).
- 279 tests verdes.
