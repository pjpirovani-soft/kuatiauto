-- 003_cliente.sql
-- F5a: gestión — cliente de una empresa.
-- RLS se habilita en 011_rls_policies.sql.

create table if not exists cliente (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references empresa(id) on delete cascade,
  nombre text not null,
  telefono text,
  email text,
  notas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_cliente_empresa on cliente(empresa_id);
create index if not exists idx_cliente_nombre on cliente(empresa_id, nombre);

-- Trigger updated_at
drop trigger if exists trg_cliente_updated_at on cliente;
create trigger trg_cliente_updated_at before update on cliente
  for each row execute function set_updated_at();