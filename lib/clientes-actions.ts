'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { auditLog } from '@/lib/audit';
import { checkRateLimit, buildClave } from '@/lib/rate-limit';
import { clienteSchema, clienteIdSchema } from '@/lib/schemas/clienteSchema';

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

export async function listarClientes(): Promise<Result<unknown[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cliente')
    .select('id, nombre, telefono, email, notas, activo, created_at')
    .eq('activo', true)
    .order('nombre', { ascending: true });
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: data ?? [] };
}

export async function crearCliente(input: unknown): Promise<Result<{ id: string }>> {
  const parsed = clienteSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos invalidos' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'No autenticado' };

  const empresaId = await getEmpresaId();
  if (!empresaId) return { ok: false, error: 'Sin empresa asociada' };

  const rl = await checkRateLimit({ clave: buildClave(['cliente:crear', user.id]), max: 20, ventanaSegundos: 60 });
  if (!rl.ok) return { ok: false, error: 'Demasiadas operaciones. Reintenta en ' + rl.retryAfterSeconds + 's.' };

  const { data, error } = await supabase
    .from('cliente')
    .insert({
      empresa_id: empresaId,
      nombre: parsed.data.nombre,
      telefono: parsed.data.telefono ?? null,
      email: parsed.data.email || null,
      notas: parsed.data.notas ?? null,
    })
    .select('id')
    .single();
  if (error) return { ok: false, error: error.message };

  await auditLog({
    usuarioId: user.id,
    empresaId,
    accion: 'crear',
    entidad: 'cliente',
    entidadId: data.id,
    datosNuevos: { nombre: parsed.data.nombre },
  });

  revalidatePath('/dashboard/clientes');
  return { ok: true, data: { id: data.id } };
}

export async function editarCliente(input: unknown): Promise<Result<{ id: string }>> {
  const parsed = clienteIdSchema.and(clienteSchema).safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos invalidos' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'No autenticado' };

  const empresaId = await getEmpresaId();
  if (!empresaId) return { ok: false, error: 'Sin empresa asociada' };

  const rl = await checkRateLimit({ clave: buildClave(['cliente:editar', user.id]), max: 30, ventanaSegundos: 60 });
  if (!rl.ok) return { ok: false, error: 'Demasiadas operaciones. Reintenta en ' + rl.retryAfterSeconds + 's.' };

  const { error } = await supabase
    .from('cliente')
    .update({
      nombre: parsed.data.nombre,
      telefono: parsed.data.telefono ?? null,
      email: parsed.data.email || null,
      notas: parsed.data.notas ?? null,
    })
    .eq('id', parsed.data.id);
  if (error) return { ok: false, error: error.message };

  await auditLog({
    usuarioId: user.id,
    empresaId,
    accion: 'editar',
    entidad: 'cliente',
    entidadId: parsed.data.id,
    datosNuevos: { nombre: parsed.data.nombre },
  });

  revalidatePath('/dashboard/clientes');
  return { ok: true, data: { id: parsed.data.id } };
}

export async function eliminarCliente(input: unknown): Promise<Result<{ id: string }>> {
  const parsed = clienteIdSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos invalidos' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'No autenticado' };

  const empresaId = await getEmpresaId();
  if (!empresaId) return { ok: false, error: 'Sin empresa asociada' };

  const rl = await checkRateLimit({ clave: buildClave(['cliente:eliminar', user.id]), max: 10, ventanaSegundos: 60 });
  if (!rl.ok) return { ok: false, error: 'Demasiadas operaciones. Reintenta en ' + rl.retryAfterSeconds + 's.' };

  const { error } = await supabase
    .from('cliente')
    .update({ activo: false })
    .eq('id', parsed.data.id);
  if (error) return { ok: false, error: error.message };

  await auditLog({
    usuarioId: user.id,
    empresaId,
    accion: 'eliminar',
    entidad: 'cliente',
    entidadId: parsed.data.id,
  });

  revalidatePath('/dashboard/clientes');
  return { ok: true, data: { id: parsed.data.id } };
}
