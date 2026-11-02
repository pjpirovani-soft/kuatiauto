'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function obtenerMetricasPropietario() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: usuario } = await supabase
    .from('usuario')
    .select('empresa_id, rol')
    .eq('id', user.id)
    .single();

  if (!usuario || !usuario.empresa_id) {
    return { ok: false, error: 'No tenés una empresa activa' };
  }

  const [clientesRes, vehiculosRes, ordenesRes] = await Promise.all([
    supabase.from('cliente').select('*', { count: 'exact', head: true }),
    supabase.from('vehiculo').select('*', { count: 'exact', head: true }),
    supabase.from('orden_trabajo').select('*', { count: 'exact', head: true }),
  ]);

  return {
    ok: true,
    data: {
      clientes: clientesRes.count || 0,
      vehiculos: vehiculosRes.count || 0,
      ordenes: ordenesRes.count || 0,
    },
  };
}
