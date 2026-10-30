"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient, hasAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/resend";
import { renderRecordatorioMantenimiento } from "@/lib/email/templates/recordatorio-mantenimiento";
import { renderBienvenida } from "@/lib/email/templates/bienvenida";
import { renderHistorialCompartido } from "@/lib/email/templates/historial-compartido";
import {
  enviarRecordatorioMantenimientoSchema,
  enviarBienvenidaSchema,
  enviarHistorialCompartidoSchema,
} from "@/lib/schemas/notificacionesSchema";

type Result = { ok: true; id: string; mock: boolean; persistido: boolean } | { ok: false; error: string };

async function registrarEnvio(args: {
  empresaId: string | null;
  destinatarioEmail: string;
  tipo: string;
  eventoRef: string | null;
  idempotencyKey: string;
  ok: boolean;
  errorMsg?: string;
}): Promise<boolean> {
  if (!hasAdminClient()) {
    console.warn("[notificaciones] sin SUPABASE_SERVICE_ROLE_KEY: no se persiste notificacion_log");
    return false;
  }
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("notificacion_log").insert({
      empresa_id: args.empresaId,
      destinatario_email: args.destinatarioEmail,
      tipo: args.tipo,
      evento_ref: args.eventoRef,
      idempotency_key: args.idempotencyKey,
      estado: args.ok ? "enviado" : "fallido",
      intentos: 1,
      ultimo_error: args.ok ? null : args.errorMsg ?? null,
      enviado_at: args.ok ? new Date().toISOString() : null,
    });
    if (error) {
      console.warn("[notificaciones] insert notificacion_log:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn("[notificaciones] admin client:", e instanceof Error ? e.message : String(e));
    return false;
  }
}

async function yaEnviado(idempotencyKey: string): Promise<boolean> {
  if (!hasAdminClient()) return false;
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("notificacion_log")
      .select("id")
      .eq("idempotency_key", idempotencyKey)
      .maybeSingle();
    return Boolean(data);
  } catch {
    return false;
  }
}

async function checkRate(clave: string, max: number, ventanaSegundos: number): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("check_rate_limit", {
      p_clave: clave,
      p_max: max,
      p_ventana_segundos: ventanaSegundos,
    });
    if (error) return true; // si falla el rate limit, no bloqueamos
    return Boolean(data);
  } catch {
    return true;
  }
}

async function getEmpresaIdFromUser(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase.from('usuario').select('empresa_id').eq('id', user.id).maybeSingle();
    if (error || !data) return null;
    return data.empresa_id ?? null;
  } catch {
    return null;
  }
}

export async function enviarRecordatorioMantenimiento(input: unknown): Promise<Result> {
  const parsed = enviarRecordatorioMantenimientoSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos invalidos" };

  const idem = `recordatorio_mantenimiento:${parsed.data.vehiculo_id}:${parsed.data.fecha_objetivo}`;
  if (await yaEnviado(idem)) return { ok: false, error: "Notificacion ya enviada (idempotencia)" };

  const allowed = await checkRate(`email:recordatorio:${parsed.data.vehiculo_id}`, 1, 86400);
  if (!allowed) return { ok: false, error: "Rate limit: recordatorio ya enviado hoy" };

  const tpl = renderRecordatorioMantenimiento({
    clienteNombre: parsed.data.cliente_nombre,
    vehiculoDescripcion: parsed.data.vehiculo_descripcion,
    proximoMantenimiento: parsed.data.proximo_mantenimiento,
    establecimientoNombre: parsed.data.establecimiento_nombre,
  });

  const sent = await sendEmail({
    to: parsed.data.cliente_email,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
    idempotencyKey: idem,
  });

  const empresaId = await getEmpresaIdFromUser();
  const persistido = await registrarEnvio({
    empresaId,
    destinatarioEmail: parsed.data.cliente_email,
    tipo: "recordatorio_mantenimiento",
    eventoRef: parsed.data.vehiculo_id,
    idempotencyKey: idem,
    ok: sent.ok,
    errorMsg: sent.ok ? undefined : sent.error,
  });

  if (!sent.ok) return { ok: false, error: sent.error };
  return { ok: true, id: sent.id, mock: sent.mock, persistido };
}

export async function enviarBienvenida(input: unknown): Promise<Result> {
  const parsed = enviarBienvenidaSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos invalidos" };

  const idem = `bienvenida:${parsed.data.establecimiento_id}:${new Date().toISOString().slice(0, 10)}`;
  if (await yaEnviado(idem)) return { ok: false, error: "Notificacion ya enviada (idempotencia)" };

  const tpl = renderBienvenida({
    nombre: parsed.data.nombre,
    establecimientoNombre: parsed.data.establecimiento_nombre,
  });

  const sent = await sendEmail({
    to: parsed.data.email,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
    idempotencyKey: idem,
  });

  const persistido = await registrarEnvio({
    empresaId: null,
    destinatarioEmail: parsed.data.email,
    tipo: "bienvenida",
    eventoRef: parsed.data.establecimiento_id,
    idempotencyKey: idem,
    ok: sent.ok,
    errorMsg: sent.ok ? undefined : sent.error,
  });

  if (!sent.ok) return { ok: false, error: sent.error };
  return { ok: true, id: sent.id, mock: sent.mock, persistido };
}

export async function enviarHistorialCompartido(input: unknown): Promise<Result> {
  const parsed = enviarHistorialCompartidoSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos invalidos" };

  const idem = `historial_compartido:${parsed.data.conductor_id}:${parsed.data.accion}:${new Date().toISOString().slice(0, 10)}`;
  if (await yaEnviado(idem)) return { ok: false, error: "Notificacion ya enviada (idempotencia)" };

  const tpl = renderHistorialCompartido({
    conductorNombre: parsed.data.conductor_nombre,
    vehiculoDescripcion: parsed.data.vehiculo_descripcion,
    establecimientoNombre: parsed.data.establecimiento_nombre,
    accion: parsed.data.accion,
  });

  const sent = await sendEmail({
    to: parsed.data.email,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
    idempotencyKey: idem,
  });

  const empresaId = await getEmpresaIdFromUser();
  const persistido = await registrarEnvio({
    empresaId,
    destinatarioEmail: parsed.data.email,
    tipo: "historial_compartido",
    eventoRef: parsed.data.conductor_id,
    idempotencyKey: idem,
    ok: sent.ok,
    errorMsg: sent.ok ? undefined : sent.error,
  });

  if (!sent.ok) return { ok: false, error: sent.error };
  return { ok: true, id: sent.id, mock: sent.mock, persistido };
}