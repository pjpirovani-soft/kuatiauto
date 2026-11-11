import { z } from 'zod';

export const vehiculoSchema = z.object({
  cliente_id: z.string().uuid('Cliente invalido'),
  marca: z.string().min(1, 'La marca es obligatoria').max(60, 'La marca no puede superar 60 caracteres'),
  modelo: z.string().min(1, 'El modelo es obligatorio').max(60, 'El modelo no puede superar 60 caracteres'),
  anio: z.coerce.number().int().min(1900, 'Anio invalido').max(2100, 'Anio invalido').optional().nullable(),
  patente: z.string().max(20, 'La patente no puede superar 20 caracteres').transform((val) => val ? val.toUpperCase().trim() : val).optional().nullable(),
  km_actual: z.coerce.number().int().min(0, "Los km no pueden ser negativos").max(10000000, "Km fuera de rango").optional(),
  notas: z.string().max(500, 'Las notas no pueden superar 500 caracteres').optional().nullable(),
  activo: z.boolean().optional(),
});

export const vehiculoIdSchema = z.object({
  id: z.string().uuid('ID invalido'),
});

export type VehiculoInput = z.infer<typeof vehiculoSchema>;
export type VehiculoIdInput = z.infer<typeof vehiculoIdSchema>;


