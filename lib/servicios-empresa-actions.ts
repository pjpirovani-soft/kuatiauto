"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { auditLog } from "@/lib/audit";
import { checkRateLimit, buildClave } from "@/lib/rate-limit";
import { servicioEmpresaSchema, servicioEmpresaIdSchema } from "@/lib/schemas/servicioEmpresaSchema";

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

export async function listarServiciosEmpresa(): Promise<Result<unknown[]>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };

  const empresaId = await getEmpresaId();
  if (!empresaId) return { ok: false, error: "Sin empresa asociada" };

  const { data, error } = await supabase
    .from("servicio_empresa")
    .select("id, empresa_id, nombre, descripcion, created_at, updated_at")
    .eq("empresa_id", empresaId)
    .order("nombre");
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: data ?? [] };
}

export async function obtenerServicioEmpresa(input: unknown): Promise<Result<unknown>> {
  const parsed = servicioEmpresaIdSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos invalidos" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };

  const empresaId = await getEmpresaId();
  if (!empresaId) return { ok: false, error: "Sin empresa asociada" };

  const { data, error } = await supabase
    .from("servicio_empresa")
    .select("id, empresa_id, nombre, descripcion, created_at, updated_at")
    .eq("id", parsed.data.id)
    .eq("empresa_id", empresaId)
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: "Servicio no encontrado" };
  return { ok: true, data };
}

export async function crearServicioEmpresa(input: unknown): Promise<Result<{ id: string }>> {
  const parsed = servicioEmpresaSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos invalidos" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };

  const empresaId = await getEmpresaId();
  if (!empresaId) return { ok: false, error: "Sin empresa asociada" };

  const rl = await checkRateLimit({ clave: buildClave(["servicio_empresa:crear", user.id]), max: 20, ventanaSegundos: 60 });
  if (!rl.ok) return { ok: false, error: "Demasiadas operaciones. Reintenta en " + rl.retryAfterSeconds + "s." };

  const { data, error } = await supabase
    .from("servicio_empresa")
    .insert({
      empresa_id: empresaId,
      nombre: parsed.data.nombre,
      descripcion: parsed.data.descripcion ?? null,
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };

  await auditLog({
    usuarioId: user.id,
    empresaId,
    accion: "crear",
    entidad: "servicio_empresa",
    entidadId: data.id,
    datosNuevos: { nombre: parsed.data.nombre },
  });

  revalidatePath("/catalogo/servicios");
  return { ok: true, data: { id: data.id } };
}

export async function editarServicioEmpresa(input: unknown): Promise<Result<{ id: string }>> {
  const parsed = servicioEmpresaIdSchema.and(servicioEmpresaSchema).safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos invalidos" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };

  const empresaId = await getEmpresaId();
  if (!empresaId) return { ok: false, error: "Sin empresa asociada" };

  const rl = await checkRateLimit({ clave: buildClave(["servicio_empresa:editar", user.id]), max: 30, ventanaSegundos: 60 });
  if (!rl.ok) return { ok: false, error: "Demasiadas operaciones. Reintenta en " + rl.retryAfterSeconds + "s." };

  const { error } = await supabase
    .from("servicio_empresa")
    .update({
      nombre: parsed.data.nombre,
      descripcion: parsed.data.descripcion ?? null,
    })
    .eq("id", parsed.data.id)
    .eq("empresa_id", empresaId);
  if (error) return { ok: false, error: error.message };

  await auditLog({
    usuarioId: user.id,
    empresaId,
    accion: "editar",
    entidad: "servicio_empresa",
    entidadId: parsed.data.id,
    datosNuevos: { nombre: parsed.data.nombre },
  });

  revalidatePath("/catalogo/servicios");
  return { ok: true, data: { id: parsed.data.id } };
}
export async function toggleServicioEmpresa(input: { id: string; activo: boolean }): Promise<Result<{ id: string }>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };
  const empresaId = await getEmpresaId();
  if (!empresaId) return { ok: false, error: "Sin empresa asociada" };

  const { error } = await supabase
    .from('servicio_empresa')
    .update({ activo: input.activo })
    .eq('id', input.id)
    .eq('empresa_id', empresaId);

  if (error) return { ok: false, error: error.message };

  await auditLog({
    usuarioId: user.id,
    empresaId: empresaId,
    accion: 'editar',
    entidad: 'servicio_empresa',
    entidadId: input.id,
    datosNuevos: { campo: 'activo', valor: input.activo },
  });

  revalidatePath('/catalogo/servicios');
  revalidatePath('/ordenes');
  revalidatePath('/recepcion');
  return { ok: true, data: { id: input.id } };
}
