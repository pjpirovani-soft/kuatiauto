-- 012_busqueda_directorio.sql
-- F10: búsqueda por distancia en el directorio.
-- Usa earthdistance + cube (extensiones nativas de PostgreSQL, gratis).

create extension if not exists cube;
create extension if not exists earthdistance;

-- Función: buscar establecimientos dentro de un radio.
-- Devuelve: id, nombre, direccion_aproximada, barrio, ciudad, telefono,
--           servicios_ofrecidos, horarios, lat_aproximada, lng_aproximada, distancia_km.
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
    and (p_ciudad is null or ep.ciudad = p_ciudad)
    and (p_servicio is null or ep.servicios_ofrecidos @> jsonb_build_array(p_servicio))
    and (p_texto is null or ep.nombre ilike '%' || p_texto || '%' or ep.descripcion ilike '%' || p_texto || '%')
  order by distancia_km asc, ep.nombre asc
  limit 100;
$$;

revoke all on function buscar_establecimientos(double precision, double precision, double precision, text, text, text) from public;
grant execute on function buscar_establecimientos(double precision, double precision, double precision, text, text, text) to anon, authenticated;

-- Función: publicar/despublicar establecimiento.
create or replace function publicar_establecimiento(
  p_establecimiento_id uuid,
  p_publicado boolean
) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null then
    raise exception 'No autenticado';
  end if;
  if not exists (
    select 1 from establecimiento_publico
    where id = p_establecimiento_id
      and empresa_id = (select empresa_id from usuario where id = auth.uid())
  ) and not is_admin_general() then
    raise exception 'No autorizado';
  end if;
  update establecimiento_publico set publicado = p_publicado, updated_at = now()
  where id = p_establecimiento_id;
end;
$$;

revoke all on function publicar_establecimiento(uuid, boolean) from public;
grant execute on function publicar_establecimiento(uuid, boolean) to authenticated;

-- Nota: las coordenadas se guardan con 5 decimales (~1 km de precisión).
-- La función usa earthdistance (point <@> point) para calcular distancia en km.