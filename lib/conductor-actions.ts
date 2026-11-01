"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { auditLog } from "@/lib/audit";
import { checkRateLimit, buildClave } from "@/lib/rate-limit";
import { conductorSchema, vehiculoConductorSchema, vehiculoConductorIdSchema, historialTokenSchema, historialIdSchema, proponerHistorialSchema } from "@/lib/schemas/conductorSchema";

type Result<T = void> = { ok: true; data: T } | { ok: false; error: string };

export async function obtenerPerfilConductor(): Promise<Result<unknown>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };
  const { data } = await supabase.from("conductor").select("*").eq("id", user.id).maybeSingle();
  if (!data) return { ok: false, error: "Conductor no encontrado" };
  return { ok: true, data };
}

export async function editarPerfilConductor(input: unknown): Promise<Result<void>> {
  const parsed = conductorSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };
  const { error } = await supabase.from("conductor").update({ nombre: parsed.data.nombre, telefono: parsed.data.telefono ?? null }).eq("id", user.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/mi-garage");
  return { ok: true, data: undefined };
}

export async function listarVehiculosConductor(): Promise<Result<unknown[]>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };
  const { data } = await supabase.from("vehiculo_conductor").select("*").eq("conductor_id", user.id).order("created_at", { ascending: false });
  return { ok: true, data: data ?? [] };
}

export async function crearVehiculoConductor(input: unknown): Promise<Result<{ id: string }>> {
  const parsed = vehiculoConductorSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };
  const rl = await checkRateLimit({ clave: buildClave(["conductor:crear_vehiculo", user.id]), max: 10, ventanaSegundos: 60 });
  if (!rl.ok) return { ok: false, error: "Demasiadas operaciones." };
  const { data, error } = await supabase.from("vehiculo_conductor").insert({
    conductor_id: user.id, marca: parsed.data.marca, modelo: parsed.data.modelo,
    anio: parsed.data.anio ?? null, patente: parsed.data.patente ?? null, km_actual: parsed.data.km_actual
  }).select("id").single();
  if (error) return { ok: false, error: error.message };
  await auditLog({ usuarioId: user.id, empresaId: null, accion: "crear", entidad: "vehiculo_conductor", entidadId: data.id });
  revalidatePath("/mi-garage/vehiculos");
  return { ok: true, data: { id: data.id } };
}

export async function eliminarVehiculoConductor(input: unknown): Promise<Result<void>> {
  const parsed = vehiculoConductorIdSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "ID invalido" };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };
  const { error } = await supabase.from("vehiculo_conductor").delete().eq("id", parsed.data.id).eq("conductor_id", user.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/mi-garage/vehiculos");
  return { ok: true, data: undefined };
}

export async function listarHistorialCompartido(): Promise<Result<unknown[]>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };
  const { data, error } = await supabase.rpc("listar_historial_compartido");
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: data ?? [] };
}

export async function aceptarHistorial(input: unknown): Promise<Result<void>> {
  const parsed = historialTokenSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Token invalido" };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };
  const rl = await checkRateLimit({ clave: buildClave(["conductor:aceptar_historial", user.id]), max: 20, ventanaSegundos: 60 });
  if (!rl.ok) return { ok: false, error: "Demasiadas operaciones." };
  const { error } = await supabase.rpc("aceptar_historial_compartido", { p_token: parsed.data.token });
  if (error) return { ok: false, error: error.message };
  await auditLog({ usuarioId: user.id, empresaId: null, accion: "autorizar", entidad: "historial_compartido", datosNuevos: { token: parsed.data.token } });
  revalidatePath("/mi-garage/historial");
  return { ok: true, data: undefined };
}

export async function revocarHistorial(input: unknown): Promise<Result<void>> {
  const parsed = historialIdSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "ID invalido" };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };
  const { error } = await supabase.rpc("revocar_historial_compartido", { p_id: parsed.data.id });
  if (error) return { ok: false, error: error.message };
  await auditLog({ usuarioId: user.id, empresaId: null, accion: "revocar", entidad: "historial_compartido", entidadId: parsed.data.id });
  revalidatePath("/mi-garage/historial");
  return { ok: true, data: undefined };
}

export async function proponerHistorial(input: unknown): Promise<Result<{ token: string }>> {
  const parsed = proponerHistorialSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };
  const { data: token, error } = await supabase.rpc("proponer_historial_compartido", { p_conductor_email: parsed.data.conductor_email, p_vehiculo_empresa_id: parsed.data.vehiculo_empresa_id });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/establecimientos");
  return { ok: true, data: { token: token as string } };
}
