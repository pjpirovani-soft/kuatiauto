"use server";

import { createClient } from "@/lib/supabase/server";
import { buscarEstablecimientosSchema, publicarEstablecimientoSchema } from "@/lib/schemas/directorioSchema";
import { revalidatePath } from "next/cache";

export async function buscarEstablecimientos(input: unknown) {
  const parsed = buscarEstablecimientosSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Datos invalidos", details: parsed.error.flatten() };
  }
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("buscar_establecimientos", {
    p_lat: parsed.data.lat,
    p_lng: parsed.data.lng,
    p_radio_km: parsed.data.radio_km,
    p_ciudad: parsed.data.ciudad ?? undefined,
    p_servicio: parsed.data.servicio ?? undefined,
    p_texto: parsed.data.texto ?? undefined,
  });
  if (error) return { error: error.message };
  return { data };
}

export async function publicarEstablecimiento(input: unknown) {
  const parsed = publicarEstablecimientoSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Datos invalidos", details: parsed.error.flatten() };
  }
  const supabase = await createClient();
  const { error } = await supabase.rpc("publicar_establecimiento", {
    p_establecimiento_id: parsed.data.establecimiento_id,
    p_publicado: parsed.data.publicado,
  });
  if (error) return { error: error.message };
  revalidatePath("/directorio");
  return { ok: true };
}