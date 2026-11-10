-- 026_rpc_ordenes_transaccional.sql
-- Cierra el hallazgo KU-FUNC-01: Asegura que el guardado de órdenes sea atómico.

-- 1. RPC para crear orden
CREATE OR REPLACE FUNCTION public.crear_orden_transaccional(
  p_empresa_id uuid,
  p_usuario_id uuid,
  p_vehiculo_id uuid,
  p_fecha date,
  p_km_servicio integer,
  p_observaciones text,
  p_proximo_fecha date,
  p_proximo_km integer,
  p_servicios jsonb,
  p_productos jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_orden_id uuid;
BEGIN
  INSERT INTO public.orden_trabajo (
    empresa_id, vehiculo_id, fecha, km_servicio, observaciones,
    proximo_mantenimiento_fecha, proximo_mantenimiento_km,
    estado, creado_por
  ) VALUES (
    p_empresa_id, p_vehiculo_id, p_fecha, p_km_servicio, p_observaciones,
    p_proximo_fecha, p_proximo_km,
    'borrador', p_usuario_id
  ) RETURNING id INTO v_orden_id;

  IF p_servicios IS NOT NULL AND jsonb_array_length(p_servicios) > 0 THEN
    INSERT INTO public.orden_servicio (orden_id, servicio_global_id, servicio_empresa_id, precio)
    SELECT 
      v_orden_id,
      (s->>'servicio_global_id')::uuid,
      (s->>'servicio_empresa_id')::uuid,
      (s->>'precio')::numeric
    FROM jsonb_array_elements(p_servicios) AS s;
  END IF;

  IF p_productos IS NOT NULL AND jsonb_array_length(p_productos) > 0 THEN
    INSERT INTO public.orden_producto (orden_id, producto_global_id, producto_empresa_id, cantidad, precio_unitario)
    SELECT 
      v_orden_id,
      (p->>'producto_global_id')::uuid,
      (p->>'producto_empresa_id')::uuid,
      (p->>'cantidad')::numeric,
      (p->>'precio_unitario')::numeric
    FROM jsonb_array_elements(p_productos) AS p;
  END IF;

  RETURN v_orden_id;
END;
$$;

-- 2. RPC para editar orden
CREATE OR REPLACE FUNCTION public.editar_orden_transaccional(
  p_orden_id uuid,
  p_vehiculo_id uuid,
  p_fecha date,
  p_km_servicio integer,
  p_observaciones text,
  p_proximo_fecha date,
  p_proximo_km integer,
  p_servicios jsonb,
  p_productos jsonb
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.orden_trabajo SET
    vehiculo_id = p_vehiculo_id,
    fecha = p_fecha,
    km_servicio = p_km_servicio,
    observaciones = p_observaciones,
    proximo_mantenimiento_fecha = p_proximo_fecha,
    proximo_mantenimiento_km = p_proximo_km
  WHERE id = p_orden_id;

  DELETE FROM public.orden_servicio WHERE orden_id = p_orden_id;
  DELETE FROM public.orden_producto WHERE orden_id = p_orden_id;

  IF p_servicios IS NOT NULL AND jsonb_array_length(p_servicios) > 0 THEN
    INSERT INTO public.orden_servicio (orden_id, servicio_global_id, servicio_empresa_id, precio)
    SELECT 
      p_orden_id,
      (s->>'servicio_global_id')::uuid,
      (s->>'servicio_empresa_id')::uuid,
      (s->>'precio')::numeric
    FROM jsonb_array_elements(p_servicios) AS s;
  END IF;

  IF p_productos IS NOT NULL AND jsonb_array_length(p_productos) > 0 THEN
    INSERT INTO public.orden_producto (orden_id, producto_global_id, producto_empresa_id, cantidad, precio_unitario)
    SELECT 
      p_orden_id,
      (p->>'producto_global_id')::uuid,
      (p->>'producto_empresa_id')::uuid,
      (p->>'cantidad')::numeric,
      (p->>'precio_unitario')::numeric
    FROM jsonb_array_elements(p_productos) AS p;
  END IF;
END;
$$;