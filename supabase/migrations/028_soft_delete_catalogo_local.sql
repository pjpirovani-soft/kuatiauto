-- 028_soft_delete_catalogo_local.sql
-- Agrega columna activo para soft-delete de catálogos locales.

-- 1. Productos de empresa
ALTER TABLE public.producto_empresa
ADD COLUMN IF NOT EXISTS activo boolean NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_producto_empresa_activo
ON public.producto_empresa (empresa_id, activo);

-- 2. Servicios de empresa
ALTER TABLE public.servicio_empresa
ADD COLUMN IF NOT EXISTS activo boolean NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_servicio_empresa_activo
ON public.servicio_empresa (empresa_id, activo);