'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { auditLog } from '@/lib/audit';
import { checkRateLimit, buildClave } from '@/lib/rate-limit';
import { vehiculoSchema, vehiculoIdSchema } from '@/lib/schemas/vehiculoSchema';
import { z } from 'zod';

type Result<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

async function getEmpresaId(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from('usuario').select('empresa_id').eq('id', user.id).maybeSingle();
    return data?.empresa_id ?? null;
  } catch {
    return null;
  }
}

const listarPorClienteSchema = z.object({ cliente_id: z.string().uuid('Cliente invalido') });

export async function listarVehiculos(input: unknown): Promise<Result<unknown[]>> {
  const parsed = listarPorClienteSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos invalidos' };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('vehiculo')
    .select('id, cliente_id, marca, modelo, anio, patente, km_actual, notas, activo, created_at, cliente:cliente_id(nombre)')
    .eq('activo', true)
    .eq('cliente_id', parsed.data.cliente_id)
    .order('created_at', { ascending: false });
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: data ?? [] };
}

export async function listarVehiculosEmpresa(): Promise<Result<unknown[]>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'No autenticado' };

  const empresaId = await getEmpresaId();
  if (!empresaId) return { ok: false, error: 'Sin empresa asociada' };

  const { data, error } = await supabase
    .from('vehiculo')
    .select('id, cliente_id, marca, modelo, anio, patente, km_actual, notas, activo, created_at, cliente:cliente_id(nombre)')
    .eq('activo', true)
    .eq('empresa_id', empresaId)
    .order('created_at', { ascending: false });
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: data ?? [] };
}
export async function crearVehiculo(input: unknown): Promise<Result<{ id: string }>> {
  const parsed = vehiculoSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos invalidos' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'No autenticado' };

  const empresaId = await getEmpresaId();
  if (!empresaId) return { ok: false, error: 'Sin empresa asociada' };

  const rl = await checkRateLimit({ clave: buildClave(['vehiculo:crear', user.id]), max: 20, ventanaSegundos: 60 });
  if (!rl.ok) return { ok: false, error: 'Demasiadas operaciones. Reintenta en ' + rl.retryAfterSeconds + 's.' };

  const { data, error } = await supabase
    .from('vehiculo')
    .insert({
      empresa_id: empresaId,
      cliente_id: parsed.data.cliente_id,
      marca: parsed.data.marca,
      modelo: parsed.data.modelo,
      anio: parsed.data.anio ?? null,
      patente: parsed.data.patente ?? null,
      km_actual: parsed.data.km_actual,
      notas: parsed.data.notas ?? null,
    })
    .select('id')
    .single();
  if (error) return { ok: false, error: error.message };

  await auditLog({
    usuarioId: user.id,
    empresaId,
    accion: 'crear',
    entidad: 'vehiculo',
    entidadId: data.id,
    datosNuevos: { marca: parsed.data.marca, modelo: parsed.data.modelo, cliente_id: parsed.data.cliente_id },
  });

  revalidatePath('/vehiculos');
  revalidatePath('/clientes/' + parsed.data.cliente_id);
  return { ok: true, data: { id: data.id } };
}

export async function editarVehiculo(input: unknown): Promise<Result<{ id: string }>> {
  const parsed = vehiculoIdSchema.and(vehiculoSchema).safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos invalidos' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'No autenticado' };

  const empresaId = await getEmpresaId();
  if (!empresaId) return { ok: false, error: 'Sin empresa asociada' };

  const rl = await checkRateLimit({ clave: buildClave(['vehiculo:editar', user.id]), max: 30, ventanaSegundos: 60 });
  if (!rl.ok) return { ok: false, error: 'Demasiadas operaciones. Reintenta en ' + rl.retryAfterSeconds + 's.' };

  const { error } = await supabase
    .from('vehiculo')
    .update({
      cliente_id: parsed.data.cliente_id,
      marca: parsed.data.marca,
      modelo: parsed.data.modelo,
      anio: parsed.data.anio ?? null,
      patente: parsed.data.patente ?? null,
      km_actual: parsed.data.km_actual,
      notas: parsed.data.notas ?? null,
    })
    .eq('id', parsed.data.id);
  if (error) return { ok: false, error: error.message };

  await auditLog({
    usuarioId: user.id,
    empresaId,
    accion: 'editar',
    entidad: 'vehiculo',
    entidadId: parsed.data.id,
    datosNuevos: { marca: parsed.data.marca, modelo: parsed.data.modelo },
  });

  revalidatePath('/vehiculos');
  return { ok: true, data: { id: parsed.data.id } };
}

export async function eliminarVehiculo(input: unknown): Promise<Result<{ id: string }>> {
  const parsed = vehiculoIdSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos invalidos' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'No autenticado' };

  const empresaId = await getEmpresaId();
  if (!empresaId) return { ok: false, error: 'Sin empresa asociada' };

  const rl = await checkRateLimit({ clave: buildClave(['vehiculo:eliminar', user.id]), max: 10, ventanaSegundos: 60 });
  if (!rl.ok) return { ok: false, error: 'Demasiadas operaciones. Reintenta en ' + rl.retryAfterSeconds + 's.' };

  const { error } = await supabase
    .from('vehiculo')
    .update({ activo: false })
    .eq('id', parsed.data.id);
  if (error) return { ok: false, error: error.message };

  await auditLog({
    usuarioId: user.id,
    empresaId,
    accion: 'eliminar',
    entidad: 'vehiculo',
    entidadId: parsed.data.id,
  });

  revalidatePath('/vehiculos');
  return { ok: true, data: { id: parsed.data.id } };
}
