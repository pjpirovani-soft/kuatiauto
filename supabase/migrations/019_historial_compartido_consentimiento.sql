-- 019_historial_compartido_consentimiento.sql
-- E4b: Portal del conductor. Consentimiento de historial compartido.
-- H-E4b-1: Cambiar default de autorizado a false (antes true permitia auto-autorizacion).

alter table historial_compartido alter column autorizado set default false;

-- Agregar token de propuesta para el flujo de invitacion.
alter table historial_compartido add column if not exists token_propuesta uuid default gen_random_uuid();

-- Funcion: proponer compartir historial (la empresa invita al conductor).
create or replace function proponer_historial_compartido(
  p_conductor_email text,
  p_vehiculo_empresa_id uuid
) returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_conductor_id uuid;
  v_empresa_id uuid;
  v_token uuid;
begin
  if auth.uid() is null then raise exception 'No autenticado'; end if;
  v_empresa_id := (select empresa_id from usuario where id = auth.uid());
  if v_empresa_id is null then raise exception 'Sin empresa'; end if;
  select id into v_conductor_id from conductor where email = p_conductor_email;
  if v_conductor_id is null then raise exception 'Conductor no registrado'; end if;
  if not exists (select 1 from vehiculo where id = p_vehiculo_empresa_id and empresa_id = v_empresa_id) then
    raise exception 'Vehiculo no pertenece a la empresa';
  end if;
  insert into historial_compartido (conductor_id, empresa_id, vehiculo_empresa_id, autorizado, token_propuesta)
  values (v_conductor_id, v_empresa_id, p_vehiculo_empresa_id, false, gen_random_uuid())
  on conflict do nothing
  returning token_propuesta into v_token;
  if v_token is null then
    select token_propuesta into v_token from historial_compartido
    where conductor_id = v_conductor_id and vehiculo_empresa_id = p_vehiculo_empresa_id;
  end if;
  return v_token;
end;
$$;

revoke all on function proponer_historial_compartido(text, uuid) from public;
grant execute on function proponer_historial_compartido(text, uuid) to authenticated;

-- Funcion: aceptar propuesta (el conductor autoriza).
create or replace function aceptar_historial_compartido(p_token uuid) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null then raise exception 'No autenticado'; end if;
  update historial_compartido
  set autorizado = true, updated_at = now()
  where token_propuesta = p_token and conductor_id = auth.uid();
  if not found then raise exception 'Token invalido o no autorizado'; end if;
end;
$$;

revoke all on function aceptar_historial_compartido(uuid) from public;
grant execute on function aceptar_historial_compartido(uuid) to authenticated;

-- Funcion: revocar historial.
create or replace function revocar_historial_compartido(p_id uuid) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null then raise exception 'No autenticado'; end if;
  update historial_compartido
  set autorizado = false, updated_at = now()
  where id = p_id and conductor_id = auth.uid();
  if not found then raise exception 'No autorizado'; end if;
end;
$$;

revoke all on function revocar_historial_compartido(uuid) from public;
grant execute on function revocar_historial_compartido(uuid) to authenticated;
