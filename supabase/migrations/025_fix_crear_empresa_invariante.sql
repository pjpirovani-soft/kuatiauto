-- 025_fix_crear_empresa_invariante.sql
-- Cierra el hallazgo KU-SEC-02: Impide que un usuario se asigne a una nueva empresa si ya tiene una.

CREATE OR REPLACE FUNCTION public.crear_empresa_con_establecimiento(
  p_nombre text,
  p_ruc text DEFAULT NULL,
  p_direccion text DEFAULT NULL,
  p_telefono text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_empresa_id uuid;
  v_empresa_actual uuid;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No autenticado';
  END IF;

  -- Invariante: El usuario no debe tener empresa ya asignada
  SELECT empresa_id INTO v_empresa_actual FROM public.usuario WHERE id = v_user_id;
  
  IF v_empresa_actual IS NOT NULL THEN
    RAISE EXCEPTION 'El usuario ya pertenece a una empresa.';
  END IF;

  -- Crear empresa
  INSERT INTO public.empresa (nombre, ruc, direccion, telefono)
  VALUES (p_nombre, p_ruc, p_direccion, p_telefono)
  RETURNING id INTO v_empresa_id;

  -- Crear establecimiento por defecto
  INSERT INTO public.establecimiento (empresa_id, nombre, direccion)
  VALUES (v_empresa_id, p_nombre, p_direccion);

  -- Asignar empresa al usuario y cambiar su rol
  UPDATE public.usuario
  SET empresa_id = v_empresa_id, rol = 'propietario'
  WHERE id = v_user_id;

  RETURN v_empresa_id;
END;
$$;