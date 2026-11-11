'use server';

import { createClient } from '@/lib/supabase/server';

export type ServicioGenerico = {
  id: string;
  nombre: string;
  descripcion: string | null;
  intervalo_km_sugerido: number | null;
  intervalo_meses_sugerido: number | null;
};

export type ProductoGenerico = {
  id: string;
  nombre: string;
  marca: string | null;
  tipo: string | null;
  viscosidad: string | null;
};

export async function listarServiciosGenericos(): Promise<{ ok: true; data: ServicioGenerico[] } | { ok: false; error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'No autenticado' };

  const { data, error } = await supabase
    .from('servicio_global')
    .select('id, nombre, descripcion, intervalo_km_sugerido, intervalo_meses_sugerido')
    .order('nombre');

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: data ?? [] };
}

export async function listarProductosGenericos(): Promise<{ ok: true; data: ProductoGenerico[] } | { ok: false; error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'No autenticado' };

  const { data, error } = await supabase
    .from('producto_global')
    .select('id, nombre, marca, tipo, viscosidad')
    .order('nombre');

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: data ?? [] };
}