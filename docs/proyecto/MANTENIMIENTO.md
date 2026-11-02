# MANTENIMIENTO — KuatiAuto

> Runbook operativo de KuatiAuto. Fuente de verdad para entornos, despliegues, backups, monitorización, incidentes y continuidad.
> Alineado con D-F13-1..5 (DECISIONES.md) y F13-PLAN.md.
> Última actualización: 2026-10-30.

## 1. Entornos (D-F13-1)

| Entorno | Dónde | Supabase | Uso |
|---|---|---|---|
| local | `C:\Users\Admin\proyectos\studio-pjpirovani-soft\clients\kuatiauto` | Proyecto Supabase local (CLI) o remoto dev | Desarrollo diario, tests |
| preview | Vercel (deploy por PR) | Mismo proyecto Supabase que local (MVP) | Revisión de PRs, QA |
| prod | Vercel (branch `main`) | Proyecto Supabase prod | Cliente real |

**Dominio prod:** `[PENDIENTE]` (P-Dominio: `kuatiauto.com.py`).
**URL Vercel prod:** `[PENDIENTE]`.
**Branching Supabase:** diferido a v2 (un solo proyecto Supabase en MVP).

## 2. Despliegues

### Flujo normal
1. Push a branch feature → Vercel genera preview automático.
2. Revisión en preview → PR → merge a `main`.
3. Vercel despliega prod automático desde `main`.
4. Migraciones SQL: aplicar manualmente en Supabase prod **antes** del merge (orden: `001` → `013`).
5. Verificar build verde + tests 28/28 + `tsc --noEmit` 0 errores antes del merge.

### Rollback
- **Vercel:** Dashboard → Deployments → seleccionar deploy anterior → "Promote to Production". Efecto inmediato.
- **Supabase (migración):** aplicar migración inversa manual (no hay `down` automatizado). Documentar en BITACORA.
- **Código:** `git revert <commit>` + push a `main` (Vercel redespliega).

### Reglas
- No desplegar en viernes ni antes de entrega (regla del studio).
- No mergear sin PR revisado.
- No aplicar migraciones sin backup previo (ver §3).

## 3. Backups y recuperación (D-F13-2)

### Backups automáticos
- **Supabase backup diario:** automático según plan del proyecto (free tier: retención 7 días; pro: 30 días). Verificar semanalmente en Dashboard → Database → Backups.
- **Export lógico semanal:** script manual documentado (a crear en v2). Comando de referencia:
  - `pg_dump --no-owner --no-acl -h <host> -U postgres -d postgres > backup_YYYYMMDD.sql`
  - Guardar en almacenamiento externo (disco del propietario / nube personal).
- **Retención:** 30 días (D-F13-2).
- **Prueba de restauración:** trimestral, documentada en BITACORA. Restaurar en proyecto Supabase de prueba y verificar integridad (tablas, RLS, datos críticos).

### RTO / RPO (D-F13-5)
- **RTO:** 24 h (tiempo máximo para restaurar servicio).
- **RPO:** 24 h (pérdida máxima de datos aceptable).

## 4. Monitorización, logs y alertas (D-F13-3)

> **Estado:** diseñado, no configurado en MVP.

| Herramienta | Qué cubre | Estado |
|---|---|---|
| Vercel Analytics | Web Vitals, latencia, tráfico | Diseñado |
| Vercel Logs | Errores runtime, 500s, funciones | Disponible en dashboard |
| Supabase Logs | Queries lentas, errores DB, auth | Disponible en dashboard |
| Sentry (free tier) | Errores cliente + servidor con stack trace | Diseñado, no configurado |

**Alertas:** email al propietario (`[PENDIENTE]` dirección) para errores críticos S1. Configuración de Sentry → v2 temprana.

**Revisión rutinaria:** ver §7.

## 5. Gestión de incidentes (D-F13-4)

### Severidades

| Sev | Definición | Respuesta | Post-mortem |
|---|---|---|---|
| **S1** | Caída total del servicio o pérdida de datos | < 2 h | Obligatorio |
| **S2** | Funcionalidad crítica degradada (login, crear orden, portal) | < 24 h | Opcional |
| **S3** | Bug menor o cosmético | Próximo sprint | No |

**Canal único:** email + WhatsApp del propietario (`[PENDIENTE]`).

### Runbook por síntoma

**El sitio no carga (S1)**
1. Verificar status Vercel: vercel.com/status
2. Revisar último deployment en Vercel → rollback si es necesario
3. Revisar logs runtime Vercel
4. Si Supabase: verificar status.supabase.com
5. Notificar al propietario por WhatsApp

**La base de datos no responde (S1)**
1. Verificar status Supabase
2. Revisar conexiones activas en dashboard
3. Verificar si hay migración pendiente o query bloqueante
4. Si es necesario: restaurar desde backup (§3)

**Login / auth falla (S2)**
1. Verificar Supabase Auth logs
2. Verificar `SUPABASE_SERVICE_ROLE_KEY` y variables Vercel
3. Verificar rate limiting (`rate_limit` tabla) — ¿falso positivo?

**Notificaciones no se envían (S2/S3)**
1. Verificar `RESEND_API_KEY` (si está en modo mock, es esperado)
2. Revisar `notificacion_log` en Supabase
3. Revisar cron Vercel (si implementado)

**CVE crítico en dependencia (S2)**
1. `npm audit --omit=dev` para verificar impacto en prod
2. Si afecta: actualizar dependencia, tests, deploy
3. Si no afecta (dev-only): documentar en STATUS y monitorear

**Pérdida de datos detectada (S1)**
1. Activar protocolo de incidente S1 (WhatsApp propietario)
2. Identificar alcance (qué tablas, qué empresas)
3. Restaurar desde backup más reciente (§3)
4. Post-mortem obligatorio en BITACORA

## 6. Continuidad del negocio (D-F13-5)

### Accesos críticos
Todos documentados en gestor de contraseñas del propietario con 2FA:

- Vercel (cuenta + proyecto)
- Supabase (cuenta + proyecto + DB password)
- GitHub (`pjpirovani-soft`)
- Dominio `.com.py` (registrador `[PENDIENTE]`)
- Resend (API key)
- Email del propietario (recuperación de todos los anteriores)

### Plan de recuperación (resumen)
1. **Incidente S1 declarado** → notificar propietario.
2. **Evaluar alcance** (sitio / DB / ambos).
3. **Rollback Vercel** si es deploy → `[PENDIENTE]` URL dashboard.
4. **Restaurar Supabase** si es datos → backup más reciente (§3).
5. **Verificar** login, crear orden, portal, notificaciones.
6. **Comunicar** a usuarios afectados (si aplica, según D-F9-2).
7. **Post-mortem** en BITACORA en 72 h.

## 7. Rutinas de mantenimiento

### Semanal
- [ ] Revisar Vercel Logs (errores 500, latencia)
- [ ] Revisar Supabase Logs (queries lentas, errores auth)
- [ ] Verificar backup diario Supabase
- [ ] `npm audit --omit=dev` (nuevas vulnerabilidades)

### Mensual
- [ ] `npm update` (patch/minor) en sesión dedicada
- [ ] Revisar Core Web Vitals (Vercel Analytics)
- [ ] Revisar costos (Vercel, Supabase, Resend, dominio) — D-F8-2
- [ ] Revisar límites free tier (emails Resend, DB size, bandwidth)

### Trimestral
- [ ] Prueba de restauración de backup (§3)
- [ ] Rotación de secretos (D-F4-5: 90 días)
- [ ] Revisión de accesos y 2FA

### Anual
- [ ] Revisión de decisiones D-F13-* y ADRs
- [ ] Revisión de deuda técnica acumulada

## 8. Actualización de dependencias

- **Patch/minor:** sesión de mantenimiento mensual.
- **Major:** sesión dedicada con tests completos + revisión de breaking changes.
- **No actualizar** en viernes ni antes de entrega.
- **Deuda aceptada:** `npm audit` con 3 vulnerabilidades dev-only (vitest/tinypool) hasta vitest 5.x estable (ver CONTINUACION.md).

## 9. Contactos

- **Responsable técnico:** Pedro J. Pirovani (`pjpirovani-soft` en GitHub)
- **Cliente / piloto:** `[PENDIENTE]` (ver CLIENTE.md)
- **Email propietario:** `[PENDIENTE]`
- **WhatsApp propietario:** `[PENDIENTE]`
- **Escalación:** propietario directamente (proyecto unipersonal en MVP)

## 10. Historial de mantenimiento

| Fecha | Qué se hizo | Quién | Referencia |
|---|---|---|---|
| 2026-10-30 | Creación del runbook F13 | Pedro J. Pirovani | F13-PLAN.md |

---
## §3. Observabilidad y Backups (E5c)
- **Sentry:** Los errores se capturan automáticamente. El DSN está en `.env.local` (`NEXT_PUBLIC_SENTRY_DSN`). En prod, usar `SENTRY_DSN` para server/edge.
- **Vercel Analytics:** Activo en el layout. Requiere deploy en Vercel para reportar.
- **Backups:** El workflow `.github/workflows/backup-db.yml` hace un dump semanal de Supabase (roles, schema, data) y lo guarda como artifact por 90 días. Para restaurar, descargar el artifact y aplicar los `.sql` con `psql`.
