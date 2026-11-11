-- 031_backfill_numero_orden.sql
-- Asigna numero_orden a las ordenes existentes que no lo tienen.

DO $$
DECLARE
  r RECORD;
  v_contador integer;
  v_empresa_actual uuid;
BEGIN
  v_empresa_actual := NULL;
  v_contador := 0;

  -- Recorrer las ordenes sin numero, agrupadas por empresa y ordenadas por fecha
  FOR r IN
    SELECT id, empresa_id
    FROM public.orden_trabajo
    WHERE numero_orden IS NULL
    ORDER BY empresa_id, created_at ASC
  LOOP
    IF v_empresa_actual IS DISTINCT FROM r.empresa_id THEN
      -- Nueva empresa: reiniciar contador
      v_empresa_actual := r.empresa_id;
      -- Empezar desde el maximo existente + 1
      SELECT COALESCE(MAX(numero_orden), 0) INTO v_contador
      FROM public.orden_trabajo
      WHERE empresa_id = r.empresa_id AND numero_orden IS NOT NULL;
    END IF;

    v_contador := v_contador + 1;

    UPDATE public.orden_trabajo
    SET numero_orden = v_contador
    WHERE id = r.id;
  END LOOP;
END $$;