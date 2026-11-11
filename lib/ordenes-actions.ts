'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { auditLog } from '@/lib/audit';
import { enviarRecordatorioMantenimiento } from "@/lib/notificaciones-actions";
import { checkRateLimit, buildClave } from '@/lib/rate-limit';
import {
  crearOrdenSchema,
  editarOrdenSchema,
  anularOrdenSchema,
  listarOrdenesSchema,
  ordenIdSchema,
  type CrearOrdenInput,
  type ProductoLinea,
  type ServicioLinea,
} from '@/lib/schemas/ordenSchema';

type Result<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

async function getSesion(): Promise<
  | { ok: true; userId: string; empresaId: string }
  | { ok: false; error: string }
> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'No autenticado' };
  const { data } = await supabase
    .from('usuario')
    .select('empresa_id')
    .eq('id', user.id)
    .maybeSingle();
  const empresaId = data?.empresa_id ?? null;
  if (!empresaId) return { ok: false, error: 'Sin empresa asociada' };
  return { ok: true, userId: user.id, empresaId };
}

function totalDesdeLineas(servicios: ServicioLinea[] | undefined, productos: ProductoLinea[] | undefined): number | null {
  let tiene = false;
  let total = 0;
  if (servicios) {
    for (const s of servicios) {
      if (s.precio != null) {
        tiene = true;
        total += Number(s.precio);
      }
    }
  }
  if (productos) {
    for (const p of productos) {
      if (p.precio_unitario != null) {
        tiene = true;
        total += Number(p.precio_unitario) * Number(p.cantidad);
      }
    }
  }
  return tiene ? Number(total.toFixed(2)) : null;
}

async function proximoMantenimiento(
  supabase: Awaited<ReturnType<typeof createClient>>,
  servicios: ServicioLinea[] | undefined,
  fechaBase: string,
  kmBase: number
): Promise<{ fecha: string | null; km: number | null }> {
  if (!servicios || servicios.length === 0) return { fecha: null, km: null };
  const globalIds = servicios.map((s) => s.servicio_global_id).filter((x): x is string => Boolean(x));
  if (globalIds.length === 0) return { fecha: null, km: null };
  const { data } = await supabase
    .from('servicio_global')
    .select('intervalo_km_sugerido, intervalo_meses_sugerido')
    .in('id', globalIds);
  if (!data || data.length === 0) return { fecha: null, km: null };
  const maxKm = Math.max(0, ...data.map((s) => Number(s.intervalo_km_sugerido ?? 0)));
  const maxMeses = Math.max(0, ...data.map((s) => Number(s.intervalo_meses_sugerido ?? 0)));
  const proxKm = maxKm > 0 ? kmBase + maxKm : null;
  let proxFecha: string | null = null;
  if (maxMeses > 0) {
    const base = new Date(fechaBase + 'T00:00:00Z');
    base.setUTCMonth(base.getUTCMonth() + maxMeses);
    proxFecha = base.toISOString().slice(0, 10);
  }
  return { fecha: proxFecha, km: proxKm };
}

async function validarReferencias(
  supabase: Awaited<ReturnType<typeof createClient>>,
  empresaId: string,
  servicios: ServicioLinea[] | undefined,
  productos: ProductoLinea[] | undefined
): Promise<string | null> {
  if (servicios) {
    const empresaIds = servicios.map((s) => s.servicio_empresa_id).filter((x): x is string => Boolean(x));
    if (empresaIds.length > 0) {
      const { data } = await supabase
        .from('servicio_empresa')
        .select('id')
        .in('id', empresaIds)
        .eq('empresa_id', empresaId);
      if (!data || data.length !== empresaIds.length) return 'Servicio de empresa no pertenece a tu empresa';
    }
  }
  if (productos) {
    const empresaIds = productos.map((p) => p.producto_empresa_id).filter((x): x is string => Boolean(x));
    if (empresaIds.length > 0) {
      const { data } = await supabase
        .from('producto_empresa')
        .select('id')
        .in('id', empresaIds)
        .eq('empresa_id', empresaId);
      if (!data || data.length !== empresaIds.length) return 'Producto de empresa no pertenece a tu empresa';
    }
  }
  return null;
}

export async function listarOrdenes(input: unknown): Promise<Result<unknown[]>> {
  const parsed = listarOrdenesSchema.safeParse(input ?? {});
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos invalidos' };

  const ses = await getSesion();
  if (!ses.ok) return ses;

  const supabase = await createClient();
  let query = supabase
    .from('orden_trabajo')
    .select('id, vehiculo_id, fecha, km_servicio, observaciones, importe_total, proximo_mantenimiento_fecha, proximo_mantenimiento_km, estado, created_at, numero_orden, empleado_id, metodo_pago')
    .eq('empresa_id', ses.empresaId)
    .order('fecha', { ascending: false })
    .order('created_at', { ascending: false });

  if (parsed.data.vehiculo_id) {
    query = query.eq('vehiculo_id', parsed.data.vehiculo_id);
  }

  const { data, error } = await query;
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: data ?? [] };
}

export async function listarOrdenesEmpresa(): Promise<Result<unknown[]>> {
  return listarOrdenes({});
}

export async function obtenerOrden(input: unknown): Promise<Result<unknown>> {
  const parsed = ordenIdSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos invalidos' };

  const ses = await getSesion();
  if (!ses.ok) return ses;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('orden_trabajo')
    .select('*, orden_servicio(*), orden_producto(*)')
    .eq('id', parsed.data.id)
    .eq('empresa_id', ses.empresaId)
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: 'Orden no encontrada' };
  return { ok: true, data };
}

export async function crearOrden(input: unknown): Promise<Result<{ id: string }>> {
  const parsed = crearOrdenSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos invalidos' };

  const ses = await getSesion();
  if (!ses.ok) return ses;

  const rl = await checkRateLimit({ clave: buildClave(['orden:crear', ses.userId]), max: 20, ventanaSegundos: 60 });
  if (!rl.ok) return { ok: false, error: 'Demasiadas operaciones. Reintenta en ' + rl.retryAfterSeconds + 's.' };

  const supabase = await createClient();

  const { data: vehiculo } = await supabase
    .from('vehiculo')
    .select('id')
    .eq('id', parsed.data.vehiculo_id)
    .eq('empresa_id', ses.empresaId)
    .maybeSingle();
  if (!vehiculo) return { ok: false, error: 'Vehiculo no pertenece a tu empresa' };

  const refErr = await validarReferencias(supabase, ses.empresaId, parsed.data.servicios, parsed.data.productos);
  if (refErr) return { ok: false, error: refErr };

  const { data: orden, error: eOrden } = await supabase
    .from('orden_trabajo')
    .insert({
      empresa_id: ses.empresaId,
      vehiculo_id: parsed.data.vehiculo_id,
      fecha: parsed.data.fecha ?? undefined,
      km_servicio: parsed.data.km_servicio,
      observaciones: parsed.data.observaciones ?? null,
      estado: 'borrador',
      creado_por: ses.userId,
    })
    .select('id')
    .single();
  if (eOrden || !orden) return { ok: false, error: eOrden?.message ?? 'Error creando orden' };

  if (parsed.data.servicios && parsed.data.servicios.length > 0) {
    const filas = parsed.data.servicios.map((s) => ({
      orden_id: orden.id,
      servicio_global_id: s.servicio_global_id ?? null,
      servicio_empresa_id: s.servicio_empresa_id ?? null,
      precio: s.precio ?? null,
    }));
    const { error } = await supabase.from('orden_servicio').insert(filas);
    if (error) return { ok: false, error: 'Error guardando servicios: ' + error.message };
  }

  if (parsed.data.productos && parsed.data.productos.length > 0) {
    const filas = parsed.data.productos.map((p) => ({
      orden_id: orden.id,
      producto_global_id: p.producto_global_id ?? null,
      producto_empresa_id: p.producto_empresa_id ?? null,
      cantidad: p.cantidad,
      precio_unitario: p.precio_unitario ?? null,
    }));
    const { error } = await supabase.from('orden_producto').insert(filas);
    if (error) return { ok: false, error: 'Error guardando productos: ' + error.message };
  }

  await auditLog({
    usuarioId: ses.userId,
    empresaId: ses.empresaId,
    accion: 'crear',
    entidad: 'orden_trabajo',
    entidadId: orden.id,
    datosNuevos: { vehiculo_id: parsed.data.vehiculo_id, km_servicio: parsed.data.km_servicio },
  });

  revalidatePath('/ordenes');
  revalidatePath('/vehiculos/' + parsed.data.vehiculo_id);
  return { ok: true, data: { id: orden.id } };
}

export async function editarOrden(input: unknown): Promise<Result<{ id: string }>> {
  const parsed = editarOrdenSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos invalidos' };

  const ses = await getSesion();
  if (!ses.ok) return ses;

  const rl = await checkRateLimit({ clave: buildClave(['orden:editar', ses.userId]), max: 30, ventanaSegundos: 60 });
  if (!rl.ok) return { ok: false, error: 'Demasiadas operaciones. Reintenta en ' + rl.retryAfterSeconds + 's.' };

  const supabase = await createClient();

  const { data: actual } = await supabase
    .from('orden_trabajo')
    .select('id, estado, vehiculo_id')
    .eq('id', parsed.data.id)
    .eq('empresa_id', ses.empresaId)
    .maybeSingle();
  if (!actual) return { ok: false, error: 'Orden no encontrada' };
  if (actual.estado !== 'borrador') return { ok: false, error: 'Solo se puede editar una orden en borrador' };

  const refErr = await validarReferencias(supabase, ses.empresaId, parsed.data.servicios, parsed.data.productos);
  if (refErr) return { ok: false, error: refErr };

  const { error: eUpd } = await supabase
    .from('orden_trabajo')
    .update({
      vehiculo_id: parsed.data.vehiculo_id,
      fecha: parsed.data.fecha ?? undefined,
      km_servicio: parsed.data.km_servicio,
      observaciones: parsed.data.observaciones ?? null,
    })
    .eq('id', parsed.data.id);
  if (eUpd) return { ok: false, error: eUpd.message };

  const { error: eDelS } = await supabase.from('orden_servicio').delete().eq('orden_id', parsed.data.id);
  if (eDelS) return { ok: false, error: 'Error limpiando servicios: ' + eDelS.message };

  const { error: eDelP } = await supabase.from('orden_producto').delete().eq('orden_id', parsed.data.id);
  if (eDelP) return { ok: false, error: 'Error limpiando productos: ' + eDelP.message };

  if (parsed.data.servicios && parsed.data.servicios.length > 0) {
    const filas = parsed.data.servicios.map((s) => ({
      orden_id: parsed.data.id,
      servicio_global_id: s.servicio_global_id ?? null,
      servicio_empresa_id: s.servicio_empresa_id ?? null,
      precio: s.precio ?? null,
    }));
    const { error } = await supabase.from('orden_servicio').insert(filas);
    if (error) return { ok: false, error: 'Error guardando servicios: ' + error.message };
  }

  if (parsed.data.productos && parsed.data.productos.length > 0) {
    const filas = parsed.data.productos.map((p) => ({
      orden_id: parsed.data.id,
      producto_global_id: p.producto_global_id ?? null,
      producto_empresa_id: p.producto_empresa_id ?? null,
      cantidad: p.cantidad,
      precio_unitario: p.precio_unitario ?? null,
    }));
    const { error } = await supabase.from('orden_producto').insert(filas);
    if (error) return { ok: false, error: 'Error guardando productos: ' + error.message };
  }

  await auditLog({
    usuarioId: ses.userId,
    empresaId: ses.empresaId,
    accion: 'editar',
    entidad: 'orden_trabajo',
    entidadId: parsed.data.id,
    datosNuevos: { km_servicio: parsed.data.km_servicio },
  });

  revalidatePath('/ordenes');
  revalidatePath('/ordenes/' + parsed.data.id);
  revalidatePath('/vehiculos/' + parsed.data.vehiculo_id);
  return { ok: true, data: { id: parsed.data.id } };
}

export async function completarOrden(input: unknown): Promise<Result<{ id: string }>> {
  const parsed = ordenIdSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos invalidos' };

  const ses = await getSesion();
  if (!ses.ok) return ses;

  const rl = await checkRateLimit({ clave: buildClave(['orden:completar', ses.userId]), max: 20, ventanaSegundos: 60 });
  if (!rl.ok) return { ok: false, error: 'Demasiadas operaciones. Reintenta en ' + rl.retryAfterSeconds + 's.' };

  const supabase = await createClient();

  const { data: actual } = await supabase
    .from('orden_trabajo')
    .select('id, estado, fecha, km_servicio, vehiculo_id, proximo_mantenimiento_fecha, proximo_mantenimiento_km')
    .eq('id', parsed.data.id)
    .eq('empresa_id', ses.empresaId)
    .maybeSingle();
  if (!actual) return { ok: false, error: 'Orden no encontrada' };
  if (actual.estado !== 'borrador') return { ok: false, error: 'Solo se puede completar una orden en borrador' };

  const { data: servicios } = await supabase
    .from('orden_servicio')
    .select('id, servicio_global_id, servicio_empresa_id, precio')
    .eq('orden_id', parsed.data.id);
  const { data: productos } = await supabase
    .from('orden_producto')
    .select('id, producto_global_id, producto_empresa_id, cantidad, precio_unitario')
    .eq('orden_id', parsed.data.id);

  const total = totalDesdeLineas(
    (servicios ?? []).map((s) => ({ servicio_global_id: s.servicio_global_id, servicio_empresa_id: s.servicio_empresa_id, precio: s.precio })),
    (productos ?? []).map((p) => ({ producto_global_id: p.producto_global_id, producto_empresa_id: p.producto_empresa_id, cantidad: Number(p.cantidad), precio_unitario: p.precio_unitario }))
  );

  const fechaBase = actual.fecha ?? new Date().toISOString().slice(0, 10);
  const prox = await proximoMantenimiento(
    supabase,
    (servicios ?? []).map((s) => ({ servicio_global_id: s.servicio_global_id, servicio_empresa_id: s.servicio_empresa_id, precio: s.precio })),
    fechaBase,
    Number(actual.km_servicio)
  );

  const { error } = await supabase
    .from('orden_trabajo')
    .update({
      estado: 'completada',
      importe_total: total,
      proximo_mantenimiento_fecha: prox.fecha,
      proximo_mantenimiento_km: prox.km,
    })
    .eq('id', parsed.data.id);
  if (error) return { ok: false, error: error.message };

  await auditLog({
    usuarioId: ses.userId,
    empresaId: ses.empresaId,
    accion: 'editar',
    entidad: 'orden_trabajo',
    entidadId: parsed.data.id,
    datosNuevos: { estado: 'completada', importe_total: total, proximo_mantenimiento_km: prox.km },
  });

  if (prox.fecha && actual.vehiculo_id) {
    const { data: vehData } = await supabase
      .from('vehiculo')
      .select('marca, modelo, cliente:cliente_id(nombre, email), empresa:empresa_id(nombre)')
      .eq('id', actual.vehiculo_id)
      .maybeSingle();
    const veh = vehData as any;
    if (veh?.cliente?.email) {
      void enviarRecordatorioMantenimiento({
        vehiculo_id: actual.vehiculo_id,
        cliente_email: veh.cliente.email,
        cliente_nombre: veh.cliente.nombre || 'Cliente',
        vehiculo_descripcion: [veh.marca, veh.modelo].filter(Boolean).join(' ') || 'vehiculo',
        proximo_mantenimiento: prox.fecha,
        establecimiento_nombre: veh.empresa?.nombre || 'Establecimiento',
        fecha_objetivo: new Date().toISOString().slice(0, 10),
      }).catch((e: unknown) => console.warn('[completarOrden] notif fallo:', e));
    }
  }
  revalidatePath('/ordenes');
  revalidatePath('/ordenes/' + parsed.data.id);
  revalidatePath('/vehiculos/' + actual.vehiculo_id);
  return { ok: true, data: { id: parsed.data.id } };
}

export async function anularOrden(input: unknown): Promise<Result<{ id: string }>> {
  const parsed = anularOrdenSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos invalidos' };

  const ses = await getSesion();
  if (!ses.ok) return ses;

  const rl = await checkRateLimit({ clave: buildClave(['orden:anular', ses.userId]), max: 10, ventanaSegundos: 60 });
  if (!rl.ok) return { ok: false, error: 'Demasiadas operaciones. Reintenta en ' + rl.retryAfterSeconds + 's.' };

  const supabase = await createClient();

  const { data: actual } = await supabase
    .from('orden_trabajo')
    .select('id, estado, observaciones, vehiculo_id')
    .eq('id', parsed.data.id)
    .eq('empresa_id', ses.empresaId)
    .maybeSingle();
  if (!actual) return { ok: false, error: 'Orden no encontrada' };
  if (actual.estado === 'anulada') return { ok: false, error: 'La orden ya esta anulada' };

  const marca = '[ANULADA ' + new Date().toISOString().slice(0, 10) + ']' + (parsed.data.motivo ? ' ' + parsed.data.motivo : '');
  const obsNuevas = actual.observaciones ? actual.observaciones + '\n' + marca : marca;

  const { error } = await supabase
    .from('orden_trabajo')
    .update({ estado: 'anulada', observaciones: obsNuevas })
    .eq('id', parsed.data.id);
  if (error) return { ok: false, error: error.message };

  await auditLog({
    usuarioId: ses.userId,
    empresaId: ses.empresaId,
    accion: 'eliminar',
    entidad: 'orden_trabajo',
    entidadId: parsed.data.id,
    datosNuevos: { estado: 'anulada', motivo: parsed.data.motivo ?? null },
  });

  revalidatePath('/ordenes');
  revalidatePath('/ordenes/' + parsed.data.id);
  revalidatePath('/vehiculos/' + actual.vehiculo_id);
  return { ok: true, data: { id: parsed.data.id } };
}

export async function eliminarOrdenBorrador(input: unknown): Promise<Result<{ id: string }>> {
  const parsed = ordenIdSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos invalidos' };

  const ses = await getSesion();
  if (!ses.ok) return ses;

  const rl = await checkRateLimit({ clave: buildClave(['orden:eliminar', ses.userId]), max: 10, ventanaSegundos: 60 });
  if (!rl.ok) return { ok: false, error: 'Demasiadas operaciones. Reintenta en ' + rl.retryAfterSeconds + 's.' };

  const supabase = await createClient();

  const { data: actual } = await supabase
    .from('orden_trabajo')
    .select('id, estado, vehiculo_id')
    .eq('id', parsed.data.id)
    .eq('empresa_id', ses.empresaId)
    .maybeSingle();
  if (!actual) return { ok: false, error: 'Orden no encontrada' };
  if (actual.estado !== 'borrador') return { ok: false, error: 'Solo se puede eliminar una orden en borrador' };

  const { error } = await supabase.from('orden_trabajo').delete().eq('id', parsed.data.id);
  if (error) return { ok: false, error: error.message };

  await auditLog({
    usuarioId: ses.userId,
    empresaId: ses.empresaId,
    accion: 'eliminar',
    entidad: 'orden_trabajo',
    entidadId: parsed.data.id,
  });

  revalidatePath('/ordenes');
  revalidatePath('/vehiculos/' + actual.vehiculo_id);
  return { ok: true, data: { id: parsed.data.id } };
}