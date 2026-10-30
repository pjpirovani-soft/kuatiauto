'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { clienteSchema } from '@/lib/schema';

export async function crearCliente(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'No autorizado' };

  const data = Object.fromEntries(formData);
  const parsed = clienteSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase.from('clientes').insert({
    ...parsed.data,
    user_id: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath('/dashboard/clientes');
  redirect('/dashboard/clientes');
}

export async function editarCliente(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'No autorizado' };

  const data = Object.fromEntries(formData);
  const parsed = clienteSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from('clientes')
    .update(parsed.data)
    .eq('id', id)
    .eq('user_id', user.id); // RLS extra

  if (error) return { error: error.message };

  revalidatePath('/dashboard/clientes');
  redirect('/dashboard/clientes');
}

export async function borrarCliente(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'No autorizado' };

  const { error } = await supabase.from('clientes').delete().eq('id', id).eq('user_id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/dashboard/clientes');
  return { success: true };
}
