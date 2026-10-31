import { z } from "zod";

export const productoEmpresaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(120, "El nombre no puede superar 120 caracteres"),
  marca: z.string().max(80, "La marca no puede superar 80 caracteres").optional().nullable(),
  tipo: z.string().max(40, "El tipo no puede superar 40 caracteres").optional().nullable(),
  viscosidad: z.string().max(20, "La viscosidad no puede superar 20 caracteres").optional().nullable(),
  unidad: z.string().min(1, "La unidad es obligatoria").max(20, "La unidad no puede superar 20 caracteres").optional(),
  stock_actual: z.coerce.number().int().min(0, "El stock no puede ser negativo").max(1000000, "Stock fuera de rango").optional(),
  stock_minimo: z.coerce.number().int().min(0, "El stock minimo no puede ser negativo").max(1000000, "Stock fuera de rango").optional(),
});

export const productoEmpresaIdSchema = z.object({
  id: z.string().uuid("ID invalido"),
});

export type ProductoEmpresaInput = z.infer<typeof productoEmpresaSchema>;
export type ProductoEmpresaIdInput = z.infer<typeof productoEmpresaIdSchema>;