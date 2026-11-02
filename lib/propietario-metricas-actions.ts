'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export type MetricasPropietario = {
  clientes: number;
  vehiculos: number;
  ordenesCompletadasMes: number;
  ordenesPendientes: number;
};

export type UltimaOrden = {
  id: string;
  fecha: string;
  estado: 'borrador' | 'completada' | 'anulada';
  importe_total: number | null;
  vehiculo_patente: string | null;
  vehiculo_marca: string | null;
  vehiculo_modelo: string | null;
  cliente_nombre: string | null;
};

type ResultadoMetricas =
  | { ok: true; data: MetricasPropietario; ultimasOrdenes: UltimaOrden[] }
  | { ok: false; error: string };

export async function obtenerMetricasPropietario(): Promise<ResultadoMetricas> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: usuario } = await supabase
    .from('usuario')
    .select('empresa_id, rol')
    .eq('id', user.id)
    .single();

  if (!usuario || !usuario.empresa_id) {
    return { ok: false, error: 'No tenes una empresa activa' };
  }

  const empresaId = usuario.empresa_id;
  const ahora = new Date();
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
    .toISOString()
    .slice(0, 10);

  const [clientesRes, vehiculosRes, completadasRes, pendientesRes, ultimasRes] =
    await Promise.all([
      supabase.from('cliente').select('*', { count: 'exact', head: true }).eq('empresa_id', empresaId),
      supabase.from('vehiculo').select('*', { count: 'exact', head: true }).eq('empresa_id', empresaId),
      supabase
        .from('orden_trabajo')
        .select('*', { count: 'exact', head: true })
        .eq('empresa_id', empresaId)
        .eq('estado', 'completada')
        .gte('fecha', inicioMes),
      supabase
        .from('orden_trabajo')
        .select('*', { count: 'exact', head: true })
        .eq('empresa_id', empresaId)
        .eq('estado', 'borrador'),
      supabase
        .from('orden_trabajo')
        .select('id, fecha, estado, importe_total, vehiculo(patente, marca, modelo, cliente(nombre))')
        .eq('empresa_id', empresaId)
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

  const ultimasOrdenes: UltimaOrden[] = (ultimasRes.data ?? []).map((o) => {
    const v = (o as { vehiculo?: { patente?: string; marca?: string; modelo?: string; cliente?: { nombre?: string } } }).vehiculo;
    return {
      id: o.id,
      fecha: o.fecha,
      estado: o.estado as UltimaOrden['estado'],
      importe_total: o.importe_total,
      vehiculo_patente: v?.patente ?? null,
      vehiculo_marca: v?.marca ?? null,
      vehiculo_modelo: v?.modelo ?? null,
      cliente_nombre: v?.cliente?.nombre ?? null,
    };
  });

  return {
    ok: true,
    data: {
      clientes: clientesRes.count ?? 0,
      vehiculos: vehiculosRes.count ?? 0,
      ordenesCompletadasMes: completadasRes.count ?? 0,
      ordenesPendientes: pendientesRes.count ?? 0,
    },
    ultimasOrdenes,
  };
}