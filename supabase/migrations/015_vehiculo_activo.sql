-- 015_vehiculo_activo.sql
-- E2a: soft-delete en vehiculo (D-E2-1, mismo patron que 014_cliente_activo).
-- vehiculo_identidad se puebla por trigger, no se toca.

alter table vehiculo add column if not exists activo boolean not null default true;

create index if not exists idx_vehiculo_activo on vehiculo(empresa_id, activo) where activo = true;
