-- 014_cliente_activo.sql
-- E2a: soft-delete en cliente (D-E2-1).
-- RLS existente sigue aplicando; activo solo filtra listados.

alter table cliente add column if not exists activo boolean not null default true;

create index if not exists idx_cliente_activo on cliente(empresa_id, activo) where activo = true;
