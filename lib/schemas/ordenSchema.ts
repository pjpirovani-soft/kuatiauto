import { z } from 'zod';

// Servicio dentro de una orden. Debe referenciar uno global o uno de empresa (exactamente uno).
const servicioLineaSchema = z
  .object({
    servicio_global_id: z.string().uuid('Servicio global invalido').optional().nullable(),
    servicio_empresa_id: z.string().uuid('Servicio de empresa invalido').optional().nullable(),
    precio: z.coerce.number().min(0, 'El precio no puede ser negativo').max(99999999, 'Precio fuera de rango').optional().nullable(),
  })
  .refine(
    (v) => Boolean(v.servicio_global_id) !== Boolean(v.servicio_empresa_id),
    { message: 'Cada servicio debe referenciar exactamente un servicio global o uno de empresa' }
  );

// Producto dentro de una orden. Debe referenciar uno global o uno de empresa (exactamente uno).
const productoLineaSchema = z
  .object({
    producto_global_id: z.string().uuid('Producto global invalido').optional().nullable(),
    producto_empresa_id: z.string().uuid('Producto de empresa invalido').optional().nullable(),
    cantidad: z.coerce.number().positive('La cantidad debe ser mayor a 0').max(999999, 'Cantidad fuera de rango'),
    precio_unitario: z.coerce.number().min(0, 'El precio no puede ser negativo').max(99999999, 'Precio fuera de rango').optional().nullable(),
  })
  .refine(
    (v) => Boolean(v.producto_global_id) !== Boolean(v.producto_empresa_id),
    { message: 'Cada producto debe referenciar exactamente un producto global o uno de empresa' }
  );

export const crearOrdenSchema = z.object({
  vehiculo_id: z.string().uuid('Vehiculo invalido'),
  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha invalida (formato YYYY-MM-DD)')
    .optional(),
  km_servicio: z.coerce.number().int().min(0, 'Los km no pueden ser negativos').max(10000000, 'Km fuera de rango'),
  observaciones: z.string().max(1000, 'Las observaciones no pueden superar 1000 caracteres').optional().nullable(),
  servicios: z.array(servicioLineaSchema).max(50, 'Maximo 50 servicios por orden').optional(),
  productos: z.array(productoLineaSchema).max(100, 'Maximo 100 productos por orden').optional(),
});

export const editarOrdenSchema = crearOrdenSchema.extend({
  id: z.string().uuid('ID invalido'),
});

export const ordenIdSchema = z.object({
  id: z.string().uuid('ID invalido'),
});

export const anularOrdenSchema = z.object({
  id: z.string().uuid('ID invalido'),
  motivo: z.string().max(500, 'El motivo no puede superar 500 caracteres').optional().nullable(),
});

export const listarOrdenesSchema = z.object({
  vehiculo_id: z.string().uuid('Vehiculo invalido').optional(),
});

export type CrearOrdenInput = z.infer<typeof crearOrdenSchema>;
export type EditarOrdenInput = z.infer<typeof editarOrdenSchema>;
export type AnularOrdenInput = z.infer<typeof anularOrdenSchema>;
export type ListarOrdenesInput = z.infer<typeof listarOrdenesSchema>;
export type ServicioLinea = z.infer<typeof servicioLineaSchema>;
export type ProductoLinea = z.infer<typeof productoLineaSchema>;