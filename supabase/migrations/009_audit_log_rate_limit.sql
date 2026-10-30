-- 009_audit_log_rate_limit.sql
-- F5c: audit_log y rate_limit.
-- RLS se habilita en 011_rls_policies.sql.

-- Audit log: registro de operaciones auditables (F2, F4).
create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references auth.users(id) on delete set null,
  empresa_id uuid references empresa(id) on delete set null,
  accion text not null,
  entidad text,
  entidad_id uuid,
  datos_anteriores jsonb,
  datos_nuevos jsonb,
  ip inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_usuario on audit_log(usuario_id);
create index if not exists idx_audit_empresa on audit_log(empresa_id);
create index if not exists idx_audit_fecha on audit_log(created_at desc);
create index if not exists idx_audit_accion on audit_log(accion);

-- Rate limit: control de intentos por endpoint/usuario/IP.
create table if not exists rate_limit (
  id uuid primary key default gen_random_uuid(),
  clave text not null,
  contador integer not null default 1,
  ventana_inicio timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (clave, ventana_inicio)
);

create index if not exists idx_rate_limit_clave on rate_limit(clave, ventana_inicio desc);

-- Función: verificar rate limit. Devuelve true si permite, false si excede.
create or replace function check_rate_limit(
  p_clave text,
  p_max integer,
  p_ventana_segundos integer
) returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_ventana timestamptz;
  v_contador integer;
begin
  v_ventana := date_trunc('second', now()) - (extract(epoch from now())::integer % p_ventana_segundos) * interval '1 second';

  insert into rate_limit (clave, contador, ventana_inicio)
  values (p_clave, 1, v_ventana)
  on conflict (clave, ventana_inicio)
  do update set contador = rate_limit.contador + 1
  returning contador into v_contador;

  return v_contador <= p_max;
end;
$$;

revoke all on function check_rate_limit(text, integer, integer) from public;
grant execute on function check_rate_limit(text, integer, integer) to authenticated, anon;

-- Función: limpiar rate_limit viejo (más de 1 hora). Llamar con pg_cron o manualmente.
create or replace function cleanup_rate_limit()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  delete from rate_limit where ventana_inicio < now() - interval '1 hour';
end;
$$;

-- Nota: el audit_log se puebla desde server actions con service_role, o desde
-- triggers SECURITY DEFINER. No se inserta desde el cliente.
-- La función registrar_auditoria se puede agregar en F6+ si se necesita.