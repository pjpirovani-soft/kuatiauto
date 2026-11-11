-- 030_mecanico_metodo_pago.sql
-- Agrega asignacion de mecanico y metodo de pago a las ordenes.

-- 1. Agregar empleado_id (FK a usuario)
ALTER TABLE public.orden_trabajo
ADD COLUMN IF NOT EXISTS empleado_id uuid REFERENCES public.usuario(id) ON DELETE SET NULL;

-- 2. Agregar metodo_pago con CHECK
ALTER TABLE public.orden_trabajo
ADD COLUMN IF NOT EXISTS metodo_pago text
CHECK (metodo_pago IN ('efectivo', 'tarjeta', 'transferencia', 'cuenta_corriente', 'otro'));

-- 3. Indices para busquedas
CREATE INDEX IF NOT EXISTS idx_orden_trabajo_empleado
ON public.orden_trabajo (empresa_id, empleado_id)
WHERE empleado_id IS NOT NULL;

-- 4. Actualizar crear_orden_transaccional para incluir los nuevos campos
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
  p_productos jsonb,
  p_empleado_id uuid DEFAULT NULL,
  p_metodo_pago text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_orden_id uuid;
  v_numero integer;
BEGIN
  v_numero := public.siguiente_numero_orden(p_empresa_id);

  INSERT INTO public.orden_trabajo (
    empresa_id, vehiculo_id, fecha, km_servicio, observaciones,
    proximo_mantenimiento_fecha, proximo_mantenimiento_km,
    estado, creado_por, numero_orden, empleado_id, metodo_pago
  ) VALUES (
    p_empresa_id, p_vehiculo_id, p_fecha, p_km_servicio, p_observaciones,
    p_proximo_fecha, p_proximo_km,
    'borrador', p_usuario_id, v_numero, p_empleado_id, p_metodo_pago
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