-- 002_usuario.sql
-- F5a: gestión — usuario vinculado a auth.users, roles.
-- RLS se habilita en 011_rls_policies.sql.

create table if not exists usuario (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  nombre text,
  rol text not null default 'empleado' check (rol in ('admin_general','propietario','empleado','conductor')),
  empresa_id uuid references empresa(id) on delete set null,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_usuario_empresa on usuario(empresa_id);
create index if not exists idx_usuario_rol on usuario(rol);

-- Trigger updated_at
drop trigger if exists trg_usuario_updated_at on usuario;
create trigger trg_usuario_updated_at before update on usuario
  for each row execute function set_updated_at();

-- Trigger: al crear un auth.user, crear el usuario en public.usuario
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.usuario (id, email, nombre, rol)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nombre', new.email),
    'empleado'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Nota: el rol 'empleado' por defecto se cambia a 'propietario' cuando
-- el usuario llama a crear_empresa_con_establecimiento().
-- 'admin_general' y 'conductor' se asignan manualmente (F10, F11).