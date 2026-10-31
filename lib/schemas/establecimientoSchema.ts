import { z } from "zod";

const horariosSchema = z.record(z.string(), z.unknown()).optional().nullable();
const serviciosOfrecidosSchema = z.array(z.string().min(1).max(80)).max(50, "Maximo 50 servicios").optional().nullable();

export const crearEstablecimientoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(120, "El nombre no puede superar 120 caracteres"),
  direccion: z.string().max(300, "La direccion no puede superar 300 caracteres").optional().nullable(),
  telefono: z.string().max(40, "El telefono no puede superar 40 caracteres").optional().nullable(),
  horarios: horariosSchema,
  descripcion: z.string().max(1000, "La descripcion no puede superar 1000 caracteres").optional().nullable(),
  barrio: z.string().max(120).optional().nullable(),
  ciudad: z.string().max(120).optional().nullable(),
  departamento: z.string().max(120).optional().nullable(),
  telefono_publico: z.string().max(40).optional().nullable(),
  servicios_ofrecidos: serviciosOfrecidosSchema,
  lat_aproximada: z.number().min(-90).max(90).optional().nullable(),
  lng_aproximada: z.number().min(-180).max(180).optional().nullable(),
});

export const editarEstablecimientoSchema = crearEstablecimientoSchema.extend({
  id: z.string().uuid("ID invalido"),
});

export const establecimientoIdSchema = z.object({
  id: z.string().uuid("ID invalido"),
});

export const publicarMiEstablecimientoSchema = z.object({
  establecimiento_publico_id: z.string().uuid("ID invalido"),
  publicado: z.boolean(),
});

export type CrearEstablecimientoInput = z.infer<typeof crearEstablecimientoSchema>;
export type EditarEstablecimientoInput = z.infer<typeof editarEstablecimientoSchema>;
export type EstablecimientoIdInput = z.infer<typeof establecimientoIdSchema>;
export type PublicarMiEstablecimientoInput = z.infer<typeof publicarMiEstablecimientoSchema>;
