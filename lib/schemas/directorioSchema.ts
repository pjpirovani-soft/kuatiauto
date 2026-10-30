import { z } from "zod";

export const buscarEstablecimientosSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  radio_km: z.number().min(0.5).max(100).default(10),
  ciudad: z.string().optional(),
  servicio: z.string().optional(),
  texto: z.string().max(100).optional(),
});

export type BuscarEstablecimientosInput = z.infer<typeof buscarEstablecimientosSchema>;

export const publicarEstablecimientoSchema = z.object({
  establecimiento_id: z.string().uuid(),
  publicado: z.boolean(),
});

export type PublicarEstablecimientoInput = z.infer<typeof publicarEstablecimientoSchema>;