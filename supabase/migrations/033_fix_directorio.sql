-- 033_fix_directorio.sql
-- Fix DIR-1: ilike sin unaccent (encarnacion != Encarnacion).
-- Fix DIR-2: @> requiere match exacto (aceite != cambio de aceite).
-- Fix DIR-5: p_texto no busca en barrio ni departamento.

-- Extension unaccent (para busqueda sin tildes).
create extension if not exists unaccent;

-- Reemplazar la RPC con los fixes.
create or replace function buscar_establecimientos(
  p_lat double precision,
  p_lng double precision,
  p_radio_km double precision default 10,
  p_ciudad text default null,
  p_servicio text default null,
  p_texto text default null
) returns table (
  id uuid,
  nombre text,
  descripcion text,
  direccion_aproximada text,
  barrio text,
  ciudad text,
  departamento text,
  telefono text,
  horarios jsonb,
  servicios_ofrecidos jsonb,
  lat_aproximada numeric,
  lng_aproximada numeric,
  distancia_km double precision
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    ep.id,
    ep.nombre,
    ep.descripcion,
    ep.direccion_aproximada,
    ep.barrio,
    ep.ciudad,
    ep.departamento,
    ep.telefono,
    ep.horarios,
    ep.servicios_ofrecidos,
    ep.lat_aproximada,
    ep.lng_aproximada,
    (point(ep.lat_aproximada, ep.lng_aproximada) <@> point(p_lat, p_lng)) as distancia_km
  from establecimiento_publico ep
  where ep.publicado = true
    and (point(ep.lat_aproximada, ep.lng_aproximada) <@> point(p_lat, p_lng)) <= p_radio_km
    and (p_ciudad is null or unaccent(ep.ciudad) ilike unaccent('%' || p_ciudad || '%'))
    and (
      p_servicio is null
      or exists (
        select 1 from jsonb_array_elements_text(ep.servicios_ofrecidos) s
        where unaccent(s) ilike unaccent('%' || p_servicio || '%')
      )
    )
    and (
      p_texto is null
      or unaccent(ep.nombre) ilike unaccent('%' || p_texto || '%')
      or unaccent(coalesce(ep.descripcion, '')) ilike unaccent('%' || p_texto || '%')
      or unaccent(coalesce(ep.barrio, '')) ilike unaccent('%' || p_texto || '%')
      or unaccent(coalesce(ep.departamento, '')) ilike unaccent('%' || p_texto || '%')
    )
  order by distancia_km asc, ep.nombre asc
  limit 100;
$$;

-- Mantener los grants.
revoke all on function buscar_establecimientos(double precision, double precision, double precision, text, text, text) from public;
grant execute on function buscar_establecimientos(double precision, double precision, double precision, text, text, text) to anon, authenticated;