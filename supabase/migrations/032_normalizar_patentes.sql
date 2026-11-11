-- 032_normalizar_patentes.sql
-- Convierte las patentes existentes a mayusculas.

UPDATE public.vehiculo
SET patente = UPPER(TRIM(patente))
WHERE patente IS NOT NULL AND patente != UPPER(TRIM(patente));

UPDATE public.vehiculo_conductor
SET patente = UPPER(TRIM(patente))
WHERE patente IS NOT NULL AND patente != UPPER(TRIM(patente));