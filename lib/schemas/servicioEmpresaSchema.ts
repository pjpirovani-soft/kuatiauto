import { z } from "zod";

export const servicioEmpresaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(120, "El nombre no puede superar 120 caracteres"),
  descripcion: z.string().max(500, "La descripcion no puede superar 500 caracteres").optional().nullable(),
});

export const servicioEmpresaIdSchema = z.object({
  id: z.string().uuid("ID invalido"),
});

export type ServicioEmpresaInput = z.infer<typeof servicioEmpresaSchema>;
export type ServicioEmpresaIdInput = z.infer<typeof servicioEmpresaIdSchema>;