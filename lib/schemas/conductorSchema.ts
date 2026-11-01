import { z } from "zod";

export const conductorSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(120),
  telefono: z.string().max(40).optional().nullable(),
});

export const vehiculoConductorSchema = z.object({
  marca: z.string().min(1, "Marca obligatoria").max(60),
  modelo: z.string().min(1, "Modelo obligatorio").max(60),
  anio: z.number().min(1900).max(2100).optional().nullable(),
  patente: z.string().max(20).optional().nullable(),
  km_actual: z.number().min(0).default(0),
});

export const vehiculoConductorIdSchema = z.object({ id: z.string().uuid() });
export const historialTokenSchema = z.object({ token: z.string().uuid() });
export const historialIdSchema = z.object({ id: z.string().uuid() });
export const proponerHistorialSchema = z.object({ conductor_email: z.string().email(), vehiculo_empresa_id: z.string().uuid() });

export type VehiculoConductorInput = z.infer<typeof vehiculoConductorSchema>;
