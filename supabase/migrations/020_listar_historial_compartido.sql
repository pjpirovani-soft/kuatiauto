-- 020_listar_historial_compartido.sql
-- RPC para que el conductor vea su historial compartido con datos de empresa/vehiculo
-- sin que RLS bloquee los joins anidados de PostgREST (bug H-E4b-2).
-- SECURITY DEFINER: solo devuelve los campos necesarios, no datos sensibles de la empresa.

create or replace function public.listar_historial_compartido()
returns table (
  id uuid,
  autorizado boolean,
  token_propuesta uuid,
  empresa_id uuid,
  vehiculo_empresa_id uuid,
  nombre_empresa text,
  vehiculo_marca text,
  vehiculo_modelo text,
  vehiculo_anio integer,
  vehiculo_patente text
)
language sql
security definer
set search_path = public
as $$
  select
    h.id,
    h.autorizado,
    h.token_propuesta,
    h.empresa_id,
    h.vehiculo_empresa_id,
    e.nombre as nombre_empresa,
    v.marca as vehiculo_marca,
    v.modelo as vehiculo_modelo,
    v.anio as vehiculo_anio,
    v.patente as vehiculo_patente
  from public.historial_compartido h
  left join public.empresa e on e.id = h.empresa_id
  left join public.vehiculo v on v.id = h.vehiculo_empresa_id
  where h.conductor_id = auth.uid()
  order by h.created_at desc;
$$;

revoke all on function public.listar_historial_compartido() from public;
grant execute on function public.listar_historial_compartido() to authenticated;