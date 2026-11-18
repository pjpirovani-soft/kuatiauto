-- 034_vehiculo_token_publico.sql
-- H-DIR-2: token publico por vehiculo para compartir etiqueta de mantenimiento.
-- El token es un UUID aleatorio. La RPC obtener_vehiculo_publico() es
-- SECURITY DEFINER y solo devuelve campos publicos (sin datos del cliente).

ALTER TABLE public.vehiculo
  ADD COLUMN IF NOT EXISTS token_publico uuid DEFAULT gen_random_uuid() UNIQUE;

UPDATE public.vehiculo
  SET token_publico = gen_random_uuid()
  WHERE token_publico IS NULL;

CREATE INDEX IF NOT EXISTS idx_vehiculo_token_publico
  ON public.vehiculo (token_publico)
  WHERE token_publico IS NOT NULL;

CREATE OR REPLACE FUNCTION public.obtener_vehiculo_publico(p_token uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'vehiculo', jsonb_build_object(
      'marca', v.marca,
      'modelo', v.modelo,
      'anio', v.anio,
      'patente', v.patente,
      'km_actual', v.km_actual
    ),
    'empresa', jsonb_build_object(
      'nombre', e.nombre,
      'direccion', e.direccion,
      'telefono', e.telefono
    ),
    'ultimo_mantenimiento', (
      SELECT jsonb_build_object(
        'fecha', o.fecha,
        'km_servicio', o.km_servicio,
        'numero_orden', o.numero_orden,
        'servicios', (
          SELECT jsonb_agg(sg.nombre ORDER BY sg.nombre)
          FROM public.orden_servicio os
          JOIN public.servicio_global sg ON sg.id = os.servicio_global_id
          WHERE os.orden_id = o.id
            AND sg.id IS NOT NULL
        ),
        'proximo_mantenimiento_fecha', o.proximo_mantenimiento_fecha,
        'proximo_mantenimiento_km', o.proximo_mantenimiento_km
      )
      FROM public.orden_trabajo o
      WHERE o.vehiculo_id = v.id
        AND o.estado = 'completada'
      ORDER BY o.fecha DESC NULLS LAST, o.created_at DESC
      LIMIT 1
    )
  ) INTO v_result
  FROM public.vehiculo v
  JOIN public.empresa e ON e.id = v.empresa_id
  WHERE v.token_publico = p_token
  LIMIT 1;

  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.obtener_vehiculo_publico(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.obtener_vehiculo_publico(uuid) TO anon, authenticated;