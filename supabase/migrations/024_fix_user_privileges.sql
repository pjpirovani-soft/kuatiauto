-- 024_fix_user_privileges.sql
-- Cierra el hallazgo P0/KU-DB-02: Evita que los usuarios modifiquen su propio rol o empresa_id.

CREATE OR REPLACE FUNCTION public.check_user_privileges()
RETURNS TRIGGER AS $$
BEGIN
    -- Si el rol o la empresa están cambiando...
    IF (OLD.rol IS DISTINCT FROM NEW.rol) OR (OLD.empresa_id IS DISTINCT FROM NEW.empresa_id) THEN
        -- Verificamos si el usuario actual es admin_general. 
        IF (SELECT rol FROM public.usuario WHERE id = auth.uid()) != 'admin_general' THEN
            RAISE EXCEPTION 'No tienes permiso para cambiar tu rol o empresa.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_user_privileges ON public.usuario;
CREATE TRIGGER enforce_user_privileges
BEFORE UPDATE ON public.usuario
FOR EACH ROW EXECUTE FUNCTION public.check_user_privileges();