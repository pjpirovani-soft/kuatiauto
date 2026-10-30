-- 001_empresa_establecimiento.sql
-- F5a: gestión — empresa y establecimiento.
-- RLS se habilita en 011_rls_policies.sql.

create table if not exists empresa (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  ruc text,
  direccion text,
  telefono text,
  activa boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists establecimiento (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references empresa(id) on delete cascade,
  nombre text not null,
  direccion text,
  telefono text,
  horarios jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_establecimiento_empresa on establecimiento(empresa_id);

-- Trigger updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_empresa_updated_at on empresa;
create trigger trg_empresa_updated_at before update on empresa
  for each row execute function set_updated_at();

drop trigger if exists trg_establecimiento_updated_at on establecimiento;
create trigger trg_establecimiento_updated_at before update on establecimiento
  for each row execute function set_updated_at();

-- Función SECURITY DEFINER: crear empresa + establecimiento + actualizar usuario
create or replace function crear_empresa_con_establecimiento(
  p_nombre text,
  p_ruc text default null,
  p_direccion text default null,
  p_telefono text default null
) returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_empresa_id uuid;
  v_establecimiento_id uuid;
begin
  if auth.uid() is null then
    raise exception 'No autenticado';
  end if;

  insert into empresa (nombre, ruc, direccion, telefono)
  values (p_nombre, p_ruc, p_direccion, p_telefono)
  returning id into v_empresa_id;

  insert into establecimiento (empresa_id, nombre, direccion, telefono)
  values (v_empresa_id, p_nombre, p_direccion, p_telefono)
  returning id into v_establecimiento_id;

  update usuario
  set empresa_id = v_empresa_id, rol = 'propietario'
  where id = auth.uid();

  return v_empresa_id;
end;
$$;

revoke all on function crear_empresa_con_establecimiento(text, text, text, text) from public;
grant execute on function crear_empresa_con_establecimiento(text, text, text, text) to authenticated;