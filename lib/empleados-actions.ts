'use server';

import { createClient } from '@/lib/supabase/server';

export type Empleado = {
  id: string;
  nombre: string | null;
  email: string;
};

export async function listarEmpleadosEmpresa(): Promise<{ ok: true; data: Empleado[] } | { ok: false; error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'No autenticado' };

  const { data: usuario } = await supabase
    .from('usuario')
    .select('empresa_id')
    .eq('id', user.id)
    .maybeSingle();

  if (!usuario?.empresa_id) return { ok: false, error: 'Sin empresa' };

  const { data, error } = await supabase
    .from('usuario')
    .select('id, nombre, email, rol')
    .eq('empresa_id', usuario.empresa_id)
    .in('rol', ['propietario', 'empleado'])
    .eq('activo', true)
    .order('nombre');

  if (error) return { ok: false, error: error.message };

  return {
    ok: true,
    data: (data ?? []).map((u) => ({
      id: u.id,
      nombre: u.nombre,
      email: u.email,
    })),
  };
}