// lib/schemas/notificacionesSchema.ts
import { z } from "zod";

export const enviarRecordatorioMantenimientoSchema = z.object({
  vehiculo_id: z.string().uuid(),
  cliente_email: z.string().email(),
  cliente_nombre: z.string().min(1).max(120),
  vehiculo_descripcion: z.string().min(1).max(200),
  proximo_mantenimiento: z.string().min(1).max(200),
  establecimiento_nombre: z.string().min(1).max(200),
  fecha_objetivo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const enviarBienvenidaSchema = z.object({
  establecimiento_id: z.string().uuid(),
  email: z.string().email(),
  nombre: z.string().min(1).max(120),
  establecimiento_nombre: z.string().min(1).max(200),
});

export const enviarHistorialCompartidoSchema = z.object({
  conductor_id: z.string().uuid(),
  email: z.string().email(),
  conductor_nombre: z.string().min(1).max(120),
  vehiculo_descripcion: z.string().min(1).max(200),
  establecimiento_nombre: z.string().min(1).max(200),
  accion: z.enum(["autorizado", "revocado"]),
});

export type EnviarRecordatorioMantenimientoInput = z.infer<typeof enviarRecordatorioMantenimientoSchema>;
export type EnviarBienvenidaInput = z.infer<typeof enviarBienvenidaSchema>;
export type EnviarHistorialCompartidoInput = z.infer<typeof enviarHistorialCompartidoSchema>;