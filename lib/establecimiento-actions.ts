"use server";

import { revalidatePath } from "next/cache";
import type { Json } from "@/lib/supabase/types";
import { createClient } from "@/lib/supabase/server";
import { auditLog } from "@/lib/audit";
import { checkRateLimit, buildClave } from "@/lib/rate-limit";
import {
  crearEstablecimientoSchema,
  editarEstablecimientoSchema,
  establecimientoIdSchema,
  publicarMiEstablecimientoSchema,
} from "@/lib/schemas/establecimientoSchema";

type Result<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

async function getEmpresaId(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from("usuario").select("empresa_id").eq("id", user.id).maybeSingle();
    return data?.empresa_id ?? null;
  } catch {
    return null;
  }
}

export async function listarEstablecimientos(): Promise<Result<unknown[]>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };

  const empresaId = await getEmpresaId();
  if (!empresaId) return { ok: false, error: "Sin empresa asociada" };

  const { data, error } = await supabase
    .from("establecimiento")
    .select("id, empresa_id, nombre, direccion, telefono, horarios, created_at, updated_at, establecimiento_publico(id, publicado, ciudad, barrio, departamento)")
    .eq("empresa_id", empresaId)
    .order("nombre");
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: data ?? [] };
}

export async function obtenerEstablecimiento(input: unknown): Promise<Result<unknown>> {
  const parsed = establecimientoIdSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos invalidos" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };

  const empresaId = await getEmpresaId();
  if (!empresaId) return { ok: false, error: "Sin empresa asociada" };

  const { data: rows, error } = await supabase
    .from("establecimiento")
    .select("id, empresa_id, nombre, direccion, telefono, horarios, created_at, updated_at, establecimiento_publico(id, nombre, descripcion, direccion_aproximada, barrio, ciudad, departamento, telefono, horarios, servicios_ofrecidos, lat_aproximada, lng_aproximada, publicado)")
    .eq("id", parsed.data.id)
    .eq("empresa_id", empresaId)
    .limit(1);
  if (error) return { ok: false, error: error.message };
  const data = rows?.[0];
  if (!data) return { ok: false, error: "Establecimiento no encontrado" };
  const pub = Array.isArray(data.establecimiento_publico)
    ? (data.establecimiento_publico[0] ?? null)
    : (data.establecimiento_publico ?? null);
  return { ok: true, data: { ...data, establecimiento_publico: pub } };
}

export async function crearEstablecimiento(input: unknown): Promise<Result<{ id: string; publico_id: string | null }>> {
  const parsed = crearEstablecimientoSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos invalidos" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };

  const empresaId = await getEmpresaId();
  if (!empresaId) return { ok: false, error: "Sin empresa asociada" };

  const rl = await checkRateLimit({ clave: buildClave(["establecimiento:crear", user.id]), max: 10, ventanaSegundos: 60 });
  if (!rl.ok) return { ok: false, error: "Demasiadas operaciones. Reintenta en " + rl.retryAfterSeconds + "s." };

  const d = parsed.data;
  const { data: creado, error: err1 } = await supabase
    .from("establecimiento")
    .insert({
      empresa_id: empresaId,
      nombre: d.nombre,
      direccion: d.direccion ?? null,
      telefono: d.telefono ?? null,
      horarios: (d.horarios ?? null) as Json | null,
    })
    .select("id")
    .single();
  if (err1) return { ok: false, error: err1.message };

  const { data: publico, error: err2 } = await supabase
    .from("establecimiento_publico")
    .insert({
      establecimiento_id: creado.id,
      empresa_id: empresaId,
      nombre: d.nombre,
      descripcion: d.descripcion ?? null,
      barrio: d.barrio ?? null,
      ciudad: d.ciudad ?? null,
      departamento: d.departamento ?? null,
      telefono: d.telefono_publico ?? null,
      servicios_ofrecidos: d.servicios_ofrecidos ?? null,
      lat_aproximada: d.lat_aproximada ?? null,
      lng_aproximada: d.lng_aproximada ?? null,
      publicado: false,
    })
    .select("id")
    .single();

  if (err2) {
    await supabase.from("establecimiento").delete().eq("id", creado.id).eq("empresa_id", empresaId);
    return { ok: false, error: err2.message };
  }

  await auditLog({
    usuarioId: user.id,
    empresaId,
    accion: "crear",
    entidad: "establecimiento",
    entidadId: creado.id,
    datosNuevos: { nombre: d.nombre, ciudad: d.ciudad ?? null },
  });

  revalidatePath("/establecimientos");
  revalidatePath("/directorio");
  return { ok: true, data: { id: creado.id, publico_id: publico?.id ?? null } };
}

export async function editarEstablecimiento(input: unknown): Promise<Result<{ id: string }>> {
  const parsed = editarEstablecimientoSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos invalidos" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };

  const empresaId = await getEmpresaId();
  if (!empresaId) return { ok: false, error: "Sin empresa asociada" };

  const rl = await checkRateLimit({ clave: buildClave(["establecimiento:editar", user.id]), max: 30, ventanaSegundos: 60 });
  if (!rl.ok) return { ok: false, error: "Demasiadas operaciones. Reintenta en " + rl.retryAfterSeconds + "s." };

  const d = parsed.data;
  const { error: err1 } = await supabase
    .from("establecimiento")
    .update({
      nombre: d.nombre,
      direccion: d.direccion ?? null,
      telefono: d.telefono ?? null,
      horarios: (d.horarios ?? null) as Json | null,
    })
    .eq("id", d.id)
    .eq("empresa_id", empresaId);
  if (err1) return { ok: false, error: err1.message };

  const { error: err2 } = await supabase
    .from("establecimiento_publico")
    .upsert(
      {
        establecimiento_id: d.id,
        empresa_id: empresaId,
        nombre: d.nombre,
        descripcion: d.descripcion ?? null,
        barrio: d.barrio ?? null,
        ciudad: d.ciudad ?? null,
        departamento: d.departamento ?? null,
        telefono: d.telefono_publico ?? null,
        servicios_ofrecidos: d.servicios_ofrecidos ?? null,
        lat_aproximada: d.lat_aproximada ?? null,
        lng_aproximada: d.lng_aproximada ?? null,
      },
      { onConflict: "establecimiento_id" }
    );
  if (err2) return { ok: false, error: err2.message };

  await auditLog({
    usuarioId: user.id,
    empresaId,
    accion: "editar",
    entidad: "establecimiento",
    entidadId: d.id,
    datosNuevos: { nombre: d.nombre },
  });

  revalidatePath("/establecimientos");
  revalidatePath(`/establecimientos/${d.id}`);
  revalidatePath("/directorio");
  return { ok: true, data: { id: d.id } };
}

export async function publicarMiEstablecimiento(input: unknown): Promise<Result<{ id: string }>> {
  const parsed = publicarMiEstablecimientoSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos invalidos" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };

  const empresaId = await getEmpresaId();
  if (!empresaId) return { ok: false, error: "Sin empresa asociada" };

  const rl = await checkRateLimit({ clave: buildClave(["establecimiento:publicar", user.id]), max: 20, ventanaSegundos: 60 });
  if (!rl.ok) return { ok: false, error: "Demasiadas operaciones. Reintenta en " + rl.retryAfterSeconds + "s." };

  const { error } = await supabase.rpc("publicar_establecimiento", {
    p_establecimiento_id: parsed.data.establecimiento_publico_id,
    p_publicado: parsed.data.publicado,
  });
  if (error) return { ok: false, error: error.message };

  await auditLog({
    usuarioId: user.id,
    empresaId,
    accion: parsed.data.publicado ? "publicar" : "editar",
    entidad: "establecimiento_publico",
    entidadId: parsed.data.establecimiento_publico_id,
    datosNuevos: { publicado: parsed.data.publicado },
  });

  revalidatePath("/establecimientos");
  revalidatePath("/directorio");
  return { ok: true, data: { id: parsed.data.establecimiento_publico_id } };
}
