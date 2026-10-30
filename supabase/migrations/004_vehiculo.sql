-- 004_vehiculo.sql
-- F5a: gestión — vehículo de un cliente de una empresa + identidad global.
-- RLS se habilita en 011_rls_policies.sql.

create table if not exists vehiculo (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references empresa(id) on delete cascade,
  cliente_id uuid not null references cliente(id) on delete cascade,
  marca text not null,
  modelo text not null,
  anio integer,
  patente text,
  km_actual integer not null default 0,
  notas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_vehiculo_empresa on vehiculo(empresa_id);
create index if not exists idx_vehiculo_cliente on vehiculo(cliente_id);
create index if not exists idx_vehiculo_patente on vehiculo(empresa_id, patente);

drop trigger if exists trg_vehiculo_updated_at on vehiculo;
create trigger trg_vehiculo_updated_at before update on vehiculo
  for each row execute function set_updated_at();

-- Vehiculo_identidad: normaliza patente + VIN para consolidación cross-tenant en v2.
-- En MVP se puebla pero no se expone cross-tenant. Ver ADR-002.
create table if not exists vehiculo_identidad (
  id uuid primary key default gen_random_uuid(),
  vehiculo_id uuid not null references vehiculo(id) on delete cascade,
  patente_normalizada text,
  vin text,
  created_at timestamptz not null default now()
);

create index if not exists idx_vehiculo_identidad_vehiculo on vehiculo_identidad(vehiculo_id);
create index if not exists idx_vehiculo_identidad_patente on vehiculo_identidad(patente_normalizada);

-- Trigger: poblar vehiculo_identidad al insertar/actualizar vehiculo
create or replace function poblar_vehiculo_identidad()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_patente_norm text;
begin
  v_patente_norm := upper(regexp_replace(coalesce(new.patente, ''), '[^A-Za-z0-9]', '', 'g'));

  insert into vehiculo_identidad (vehiculo_id, patente_normalizada)
  values (new.id, nullif(v_patente_norm, ''))
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists trg_vehiculo_identidad on vehiculo;
create trigger trg_vehiculo_identidad after insert or update of patente on vehiculo
  for each row execute function poblar_vehiculo_identidad();