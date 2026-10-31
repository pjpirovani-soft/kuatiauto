# _cuarentena — Migraciones removidas

## 001_clientes.sql

**Origen:** blueprint `web-app` del studio (scaffold generado por `nueva-app.ps1`).
**Motivo de remoción:** crea tabla `clientes` (plural) con RLS por `user_id` (auth.uid()), modelo del blueprint. **No pertenece a KuatiAuto**, que usa tabla `cliente` (singular) con `empresa_id` y RLS por empresa (migración `003_cliente.sql`).
**Acción:** movida acá el 2026-10-31 para evitar conflicto de numeración (`001_clientes.sql` vs `001_empresa_establecimiento.sql`) al aplicar `supabase db push`.
**Estado:** no se aplica. No se borra (histórico). Si en el futuro se necesita, se revisa y se reubica.