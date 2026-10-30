import { z } from 'zod';

export const clienteSchema = z.object({
  nombre: z.string().min(2, 'Nombre muy corto').max(100),
  email: z.string().email('Email invalido'),
  telefono: z.string().max(30).optional().or(z.literal('')),
  notas: z.string().max(2000).optional().or(z.literal('')),
});

export type ClienteInput = z.infer<typeof clienteSchema>;
