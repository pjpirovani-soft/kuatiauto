-- Migración 021: Fix KU-SEC-02
-- Agrega invariante: un usuario no puede crear empresa si ya tiene una asignada.
-- Ref: AUDITORIA_INTEGRAL_KUATIAUTO.md / KU-SEC-02.

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
  v_usuario_empresa_id uuid;
begin
  if auth.uid() is null then
    raise exception 'No autenticado';
  end if;

  -- KU-SEC-02: invariante de aprovisionamiento único.
  -- Un usuario sin empresa puede crear la primera; uno con empresa no puede.
  select empresa_id into v_usuario_empresa_id
  from usuario
  where id = auth.uid();

  if v_usuario_empresa_id is not null then
    raise exception 'El usuario ya pertenece a una empresa';
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