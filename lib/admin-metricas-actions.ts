'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function obtenerMetricasAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Verificar rol (opcional pero recomendado)
  const { data: usuario } = await supabase.from('usuario').select('rol').eq('id', user.id).single();
  if (usuario?.rol !== 'admin_general') {
    return { ok: false, error: 'No autorizado' };
  }

  const [empresasRes, usuariosRes, ordenesRes, vehiculosRes] = await Promise.all([
    supabase.from('empresa').select('*', { count: 'exact', head: true }),
    supabase.from('usuario').select('rol', { count: 'exact' }),
    supabase.from('orden_trabajo').select('*', { count: 'exact', head: true }),
    supabase.from('vehiculo').select('*', { count: 'exact', head: true }),
  ]);

  // Contar usuarios por rol
  const usuariosPorRol = (usuariosRes.data || []).reduce((acc: Record<string, number>, u) => {
    acc[u.rol] = (acc[u.rol] || 0) + 1;
    return acc;
  }, {});

  return {
    ok: true,
    data: {
      empresas: empresasRes.count || 0,
      usuarios: usuariosRes.count || 0,
      usuariosPorRol,
      ordenes: ordenesRes.count || 0,
      vehiculos: vehiculosRes.count || 0,
    },
  };
}
