import { z } from "zod";

export const crearServicioGlobalSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(120, "El nombre no puede superar 120 caracteres"),
  descripcion: z
    .string()
    .trim()
    .max(1000, "La descripcion no puede superar 1000 caracteres")
    .optional()
    .or(z.literal("")),
  intervalo_km_sugerido: z
    .union([z.number().int().positive(), z.string().transform((v) => (v === "" ? undefined : Number(v)))])
    .optional()
    .refine((v) => v === undefined || (typeof v === "number" && v > 0), {
      message: "El intervalo en km debe ser un numero positivo",
    }),
  intervalo_meses_sugerido: z
    .union([z.number().int().positive(), z.string().transform((v) => (v === "" ? undefined : Number(v)))])
    .optional()
    .refine((v) => v === undefined || (typeof v === "number" && v > 0), {
      message: "El intervalo en meses debe ser un numero positivo",
    }),
});

export const editarServicioGlobalSchema = crearServicioGlobalSchema.extend({
  id: z.string().uuid("ID invalido"),
});

export const servicioGlobalIdSchema = z.object({
  id: z.string().uuid("ID invalido"),
});

export type CrearServicioGlobalInput = z.infer<typeof crearServicioGlobalSchema>;
export type EditarServicioGlobalInput = z.infer<typeof editarServicioGlobalSchema>;
export const crearProductoGlobalSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(120, "El nombre no puede superar 120 caracteres"),
  marca: z
    .string()
    .trim()
    .max(80, "La marca no puede superar 80 caracteres")
    .optional()
    .or(z.literal("")),
  tipo: z
    .string()
    .trim()
    .max(80, "El tipo no puede superar 80 caracteres")
    .optional()
    .or(z.literal("")),
  viscosidad: z
    .string()
    .trim()
    .max(40, "La viscosidad no puede superar 40 caracteres")
    .optional()
    .or(z.literal("")),
});

export const editarProductoGlobalSchema = crearProductoGlobalSchema.extend({
  id: z.string().uuid("ID invalido"),
});

export const productoGlobalIdSchema = z.object({
  id: z.string().uuid("ID invalido"),
});

export type CrearProductoGlobalInput = z.infer<typeof crearProductoGlobalSchema>;
export type EditarProductoGlobalInput = z.infer<typeof editarProductoGlobalSchema>;