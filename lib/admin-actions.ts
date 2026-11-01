'use server';

import { createClient } from "@/lib/supabase/server";

export type ContadoresAdmin = {
  empresas: number;
  usuarios: number;
  establecimientosPublicados: number;
  ordenes: number;
};

export type ContadoresAdminResult =
  | { ok: true; data: ContadoresAdmin }
  | { ok: false; error: string };

export async function obtenerContadoresAdmin(): Promise<ContadoresAdminResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };
  const { data: usuario } = await supabase.from("usuario").select("rol").eq("id", user.id).maybeSingle();
  if (usuario?.rol !== "admin_general") return { ok: false, error: "No autorizado" };

  const { count: empresas } = await supabase.from("empresa").select("*", { count: "exact", head: true });
  const { count: usuarios } = await supabase.from("usuario").select("*", { count: "exact", head: true });
  const { count: establecimientosPublicados } = await supabase.from("establecimiento_publico").select("*", { count: "exact", head: true }).eq("publicado", true);
  const { count: ordenes } = await supabase.from("orden_trabajo").select("*", { count: "exact", head: true });

  return { ok: true, data: { empresas: empresas ?? 0, usuarios: usuarios ?? 0, establecimientosPublicados: establecimientosPublicados ?? 0, ordenes: ordenes ?? 0 } };
}
