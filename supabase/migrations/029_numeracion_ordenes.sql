-- 029_numeracion_ordenes.sql
-- Agrega numeracion secuencial por empresa a las ordenes de trabajo.

-- 1. Agregar columna numero_orden
ALTER TABLE public.orden_trabajo
ADD COLUMN IF NOT EXISTS numero_orden integer;

-- 2. Crear indice unico compuesto (empresa_id, numero_orden)
CREATE UNIQUE INDEX IF NOT EXISTS idx_orden_trabajo_numero
ON public.orden_trabajo (empresa_id, numero_orden)
WHERE numero_orden IS NOT NULL;

-- 3. Funcion para obtener el proximo numero
CREATE OR REPLACE FUNCTION public.siguiente_numero_orden(p_empresa_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_max integer;
BEGIN
  SELECT COALESCE(MAX(numero_orden), 0) INTO v_max
  FROM public.orden_trabajo
  WHERE empresa_id = p_empresa_id;
  
  RETURN v_max + 1;
END;
$$;

-- 4. Actualizar la RPC crear_orden_transaccional para que asigne el numero
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
  v_numero integer;
BEGIN
  -- Obtener el proximo numero
  v_numero := public.siguiente_numero_orden(p_empresa_id);

  -- Insertar cabecera con numero_orden
  INSERT INTO public.orden_trabajo (
    empresa_id, vehiculo_id, fecha, km_servicio, observaciones,
    proximo_mantenimiento_fecha, proximo_mantenimiento_km,
    estado, creado_por, numero_orden
  ) VALUES (
    p_empresa_id, p_vehiculo_id, p_fecha, p_km_servicio, p_observaciones,
    p_proximo_fecha, p_proximo_km,
    'borrador', p_usuario_id, v_numero
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