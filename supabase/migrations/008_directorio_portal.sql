-- 008_directorio_portal.sql
-- F5b: directorio público + portal del conductor.
-- RLS se habilita en 011_rls_policies.sql.

-- Directorio público: establecimientos con coordenadas aproximadas.
-- No expone coordenadas exactas (R10).
create table if not exists establecimiento_publico (
  id uuid primary key default gen_random_uuid(),
  establecimiento_id uuid not null references establecimiento(id) on delete cascade,
  empresa_id uuid not null references empresa(id) on delete cascade,
  nombre text not null,
  descripcion text,
  direccion_aproximada text,
  barrio text,
  ciudad text,
  departamento text,
  telefono text,
  horarios jsonb,
  servicios_ofrecidos jsonb,
  lat_aproximada numeric(8,5),
  lng_aproximada numeric(8,5),
  publicado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (establecimiento_id)
);

create index if not exists idx_establecimiento_publico_ciudad on establecimiento_publico(ciudad) where publicado = true;
create index if not exists idx_establecimiento_publico_depto on establecimiento_publico(departamento) where publicado = true;
create index if not exists idx_establecimiento_publico_publicado on establecimiento_publico(publicado);

drop trigger if exists trg_establecimiento_publico_updated_at on establecimiento_publico;
create trigger trg_establecimiento_publico_updated_at before update on establecimiento_publico
  for each row execute function set_updated_at();

-- Portal del conductor: cuenta propia (distinta del usuario de empresa).
-- Un conductor puede tener empresa_id = null.
create table if not exists conductor (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  nombre text,
  telefono text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_conductor_updated_at on conductor;
create trigger trg_conductor_updated_at before update on conductor
  for each row execute function set_updated_at();

-- Trigger: al crear auth.user, crear conductor (además de usuario en F5a).
-- El rol del usuario determina si es conductor o de empresa.
-- En F5a se crea usuario con rol 'empleado' por defecto. Aquí se crea conductor
-- con rol 'conductor' si el usuario eligió portal al registrarse.
-- La distinción real se hace en el flujo de registro (F6+).
create or replace function handle_new_conductor()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.raw_user_meta_data->>'tipo' = 'conductor' then
    insert into public.conductor (id, email, nombre)
    values (
      new.id,
      new.email,
      coalesce(new.raw_user_meta_data->>'nombre', new.email)
    )
    on conflict (id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_conductor on auth.users;
create trigger on_auth_user_created_conductor
  after insert on auth.users
  for each row execute function handle_new_conductor();

-- Vehículos del conductor: pertenecen al conductor, no a una empresa.
-- El conductor puede vincular un vehículo que ya existe en una empresa
-- (con consentimiento) o cargar uno propio.
create table if not exists vehiculo_conductor (
  id uuid primary key default gen_random_uuid(),
  conductor_id uuid not null references conductor(id) on delete cascade,
  marca text not null,
  modelo text not null,
  anio integer,
  patente text,
  km_actual integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_vehiculo_conductor on vehiculo_conductor(conductor_id);

drop trigger if exists trg_vehiculo_conductor_updated_at on vehiculo_conductor;
create trigger trg_vehiculo_conductor_updated_at before update on vehiculo_conductor
  for each row execute function set_updated_at();

-- Historial compartido: el conductor autoriza a un establecimiento a ver
-- el historial de su vehículo. El establecimiento no puede verlo sin esta autorización (R8).
create table if not exists historial_compartido (
  id uuid primary key default gen_random_uuid(),
  conductor_id uuid not null references conductor(id) on delete cascade,
  empresa_id uuid not null references empresa(id) on delete cascade,
  vehiculo_conductor_id uuid references vehiculo_conductor(id) on delete cascade,
  vehiculo_empresa_id uuid references vehiculo(id) on delete cascade,
  autorizado boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (vehiculo_conductor_id is not null or vehiculo_empresa_id is not null)
);

create index if not exists idx_historial_conductor on historial_compartido(conductor_id);
create index if not exists idx_historial_empresa on historial_compartido(empresa_id);
create index if not exists idx_historial_autorizado on historial_compartido(autorizado);

drop trigger if exists trg_historial_compartido_updated_at on historial_compartido;
create trigger trg_historial_compartido_updated_at before update on historial_compartido
  for each row execute function set_updated_at();

-- Nota: historial_compartido permite al conductor autorizar/revocar el acceso
-- de un establecimiento al historial de su vehículo. La lógica de negocio
-- (cuándo se crea, cuándo se revoca) se implementa en F10-F11.