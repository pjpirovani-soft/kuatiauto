-- 016_producto_empresa.sql
-- F5b-bis: sincroniza el repo con la tabla producto_empresa (creada a mano en la DB durante E1).
-- El drift se detecto al planificar E2b2. Sin esta migracion, `supabase db push` desde cero
-- fallaria en la 007 (la FK fk_orden_producto_empresa referencia una tabla inexistente en el repo).
-- RLS se habilita en 011_rls_policies.sql (aplicada originalmente; la policy de producto_empresa
-- ya existe en la DB real y NO se repite aca para no romper el estado).

create table if not exists producto_empresa (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references empresa(id) on delete cascade,
  nombre text not null,
  marca text,
  tipo text,
  viscosidad text,
  unidad text not null default 'unidad',
  stock_actual numeric not null default 0,
  stock_minimo numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_producto_empresa on producto_empresa(empresa_id);

drop trigger if exists trg_producto_empresa_updated_at on producto_empresa;
create trigger trg_producto_empresa_updated_at before update on producto_empresa
  for each row execute function set_updated_at();