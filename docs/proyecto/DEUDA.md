# DEUDA — KuatiAuto

Registro consolidado de deuda tecnica. Actualizado 2026-11-18.

## P0 — Bloqueante para produccion con datos reales

| ID | Deuda | Detalle | Esfuerzo |
|---|---|---|---|
| D-P0-1 | RLS cross-tenant solo local | `lib/rls-cross-tenant.test.ts` corre con `.env.local` real; en CI se skipea porque no hay credenciales. La validacion real de RLS en CI requiere pgTAP contra DB efimera o Supabase staging. Cierra KU-SEC-04 de la auditoria externa. | Alto (2-3 sesiones) |

## P1 — Alta prioridad

| ID | Deuda | Detalle | Esfuerzo |
|---|---|---|---|
| D-P1-1 | 4 useEffect con setState sincronico | React 19 lo rechaza. Archivos: `components/OrdenForm.tsx` (prioritario, es el form principal), `components/MobileSidebarWrapper.tsx`, `components/directorio/MapaDirectorio.tsx`, `components/RegistroSW.tsx`. Reemplazar por useMemo/useSyncExternalStore. | Medio (2-3 horas) |
| D-P1-2 | 53 warnings de lint | `no-explicit-any` y `no-unused-vars` bajados a `warn` en `eslint.config.mjs`. Visibles pero no bloquean. Arreglar de a uno, priorizando `lib/ordenes-actions.ts`, `lib/reportes-actions.ts`, `components/OrdenForm.tsx`. | Medio (3-4 horas) |

## P2 — Media prioridad

| ID | Deuda | Detalle | Esfuerzo |
|---|---|---|---|
| D-P2-1 | `.gitattributes` | No existe. Git convierte LF a CRLF en cada checkout Windows. Warning recurrente en cada commit. Agregar `* text=auto eol=lf` + `*.ps1 eol=lf`. | Bajo (5 min) |
| D-P2-2 | BOM en `next.config.mjs` | Tiene `EF BB BF` al inicio. No rompe Next, pero viola `ENCODING.md`. Reescribir con `UTF8Encoding(false)`. | Bajo (2 min) |
| D-P2-3 | `.gitignore` con duplicados | `playwright_out.txt` x2, `build_out.txt` x6. Consolidar en una sola ocurrencia por patron. | Bajo (5 min) |
| D-P2-4 | Sin cron de recordatorios | `enviarRecordatorioMantenimiento` existe (con idempotency), pero no hay cron que dispare por proximo mantenimiento vencido. Vercel Cron o Edge Function. | Medio (1 sesion) |
| D-P2-5 | Paginacion admin | `listarEmpresasAdmin`, `listarUsuariosAdmin`, `listarOrdenes` traen todos los registros. Con >1000 filas PostgREST trunca silenciosamente. Agregar `.range()` + `count: exact` filtrado. | Medio (1 sesion) |

## P3 — Baja prioridad / pulido

| ID | Deuda | Detalle | Esfuerzo |
|---|---|---|---|
| D-P3-1 | H-025-1 telefono en `crear_empresa_con_establecimiento` | La migracion 025 (vigente) hace `CREATE OR REPLACE` y NO persiste `p_telefono` en `establecimiento` (la 021 si lo hacia). El telefono se pierde. Fix: migracion 033 que reescriba con `telefono` incluido. | Bajo (15 min) |
| D-P3-2 | Docs desactualizados vs `main` | Docs dicen v0.5; `main` dice v0.10.0. Actualizar `ARCHITECTURE.md`, `ROADMAP.md`, `STATUS.md` con F15/F16 + ADR-017..N. | Medio (1 sesion) |
| D-P3-3 | README generico | Sigue siendo plantilla de blueprint, no describe KuatiAuto. | Bajo (30 min) |
| D-P3-4 | Supabase CLI v2.122 → v3.2.0 | Major bump disponible. Riesgo de romper `npx supabase` o el link. Evaluar antes de actualizar. | Bajo (30 min) |

## Aceptadas por diseno (no son deuda)

- ADR-009 (WARN de Supabase Advisors): 13 WARN aceptados, documentados.
- `auth_leaked_password_protection`: requiere plan Pro, no disponible en Free.
## H-039 - Warning no-explicit-any en BotonInstalarApp.tsx

- **Origen:** cast `as BeforeInstallPromptEvent` y `as Navigator & { standalone?: boolean }`.
- **Severidad:** baja (warning de ESLint, no bloquea).
- **Impacto:** el contador de warnings sube de 53 a 54. No es deuda funcional.
- **Fix:** reemplazar casts por type guards o `satisfies`. ~15 min.
- **Tracking:** deuda P3-5.
## Nuevas (post-sesion 2026-11-18)

| ID | Deuda | Detalle | Esfuerzo |
|---|---|---|---|
| D-P1-3 | E2E `directorio-filtros` rojo en prod | `e2e/smoke/directorio-filtros.spec.ts` espera fixtures ("Import Japan", "B-Test-E4a") que no estan publicados en prod. Fallo pre-existente desde commit `2ea2b92`. Fix: reescribir test resiliente o publicar fixtures. | Bajo (1 hora) |
| D-P2-1 | `as any` en args de RPC | `lib/ordenes-actions.ts` usa `as any` para `crear_orden_transaccional` y `editar_orden_transaccional` porque `types.ts` tiene union de firmas (026 sin empleado/metodo_pago, 030 con). Se quita al regenerar tipos con `supabase gen types`. | Bajo (30 min) |
| D-P3-1 | CRLF en `lib/ordenes-actions*.ts` | `git checkout --` en Windows restaura con CRLF. No rompe nada (Next/TS toleran). Normalizar con `.gitattributes` (`* text=auto eol=lf`). | Bajo (15 min) |