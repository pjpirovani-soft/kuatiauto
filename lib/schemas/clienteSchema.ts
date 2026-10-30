import { z } from 'zod';

export const clienteSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(120, 'El nombre no puede superar 120 caracteres'),
  telefono: z.string().max(30, 'El telefono no puede superar 30 caracteres').optional().nullable(),
  email: z.string().email('Email invalido').max(120, 'El email no puede superar 120 caracteres').optional().nullable().or(z.literal('')),
  notas: z.string().max(500, 'Las notas no pueden superar 500 caracteres').optional().nullable(),
  activo: z.boolean().optional(),
});

export const clienteIdSchema = z.object({
  id: z.string().uuid('ID invalido'),
});

export type ClienteInput = z.infer<typeof clienteSchema>;
export type ClienteIdInput = z.infer<typeof clienteIdSchema>;
