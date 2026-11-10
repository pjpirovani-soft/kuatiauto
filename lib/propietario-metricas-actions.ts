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
  const { data: { user } } = await supabase.auth.getUser();
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

export type VehiculoProximo = {
  id: string;
  marca: string | null;
  modelo: string | null;
  patente: string | null;
  cliente_nombre: string | null;
  proximo_mantenimiento_fecha: string | null;
  proximo_mantenimiento_km: number | null;
  km_actual: number | null;
  estado_alerta: 'vencido' | 'proximo';
};

type ResultadoProximos = { ok: true; data: VehiculoProximo[] } | { ok: false; error: string };

export async function obtenerVehiculosProximos(): Promise<ResultadoProximos> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: usuario } = await supabase
    .from('usuario')
    .select('empresa_id')
    .eq('id', user.id)
    .maybeSingle();

  if (!usuario || !usuario.empresa_id) {
    return { ok: false, error: 'No tenes una empresa activa' };
  }

  const empresaId = usuario.empresa_id;

  // 1. Traer todos los vehículos de la empresa con su cliente
  const { data: vehiculos, error: errVeh } = await supabase
    .from('vehiculo')
    .select('id, marca, modelo, patente, km_actual, cliente:cliente_id(nombre)')
    .eq('empresa_id', empresaId);

  if (errVeh) return { ok: false, error: errVeh.message };
  if (!vehiculos || vehiculos.length === 0) return { ok: true, data: [] };

  // 2. Traer la última orden completada de cada vehículo
  const vehiculoIds = vehiculos.map((v) => v.id);

  const { data: ordenes, error: errOrd } = await supabase
    .from('orden_trabajo')
    .select('vehiculo_id, proximo_mantenimiento_fecha, proximo_mantenimiento_km')
    .eq('empresa_id', empresaId)
    .eq('estado', 'completada')
    .in('vehiculo_id', vehiculoIds)
    .not('proximo_mantenimiento_fecha', 'is', null)
    .order('fecha', { ascending: false });

  if (errOrd) return { ok: false, error: errOrd.message };

  // 3. Agrupar por vehiculo_id y quedarnos con la orden más reciente
  const ultimaPorVehiculo = new Map<string, { fecha: string | null; km: number | null }>();
  for (const o of ordenes ?? []) {
    if (!ultimaPorVehiculo.has(o.vehiculo_id)) {
      ultimaPorVehiculo.set(o.vehiculo_id, {
        fecha: o.proximo_mantenimiento_fecha,
        km: o.proximo_mantenimiento_km,
      });
    }
  }

  // 4. Calcular estado de alerta
  const hoy = new Date();
  const en30dias = new Date(hoy.getTime() + 30 * 24 * 60 * 60 * 1000);
  const hoyStr = hoy.toISOString().slice(0, 10);
  const en30Str = en30dias.toISOString().slice(0, 10);

  const proximos: VehiculoProximo[] = [];
  for (const v of vehiculos) {
    const ultima = ultimaPorVehiculo.get(v.id);
    if (!ultima || !ultima.fecha) continue;

    const kmActual = Number(v.km_actual ?? 0);
    const proxKm = ultima.km;
    const proxFecha = ultima.fecha;

    let estado: 'vencido' | 'proximo' | null = null;
    if (proxFecha <= hoyStr) estado = 'vencido';
    else if (proxKm && kmActual >= proxKm - 1000) estado = 'vencido';
    else if (proxFecha <= en30Str) estado = 'proximo';
    else if (proxKm && kmActual >= proxKm - 2000) estado = 'proximo';

    if (!estado) continue;

    const c = (v as any).cliente;
    proximos.push({
      id: v.id,
      marca: v.marca,
      modelo: v.modelo,
      patente: v.patente,
      cliente_nombre: c?.nombre ?? null,
      proximo_mantenimiento_fecha: proxFecha,
      proximo_mantenimiento_km: proxKm,
      km_actual: kmActual,
      estado_alerta: estado,
    });
  }

  // Ordenar por fecha ascendente (los más urgentes primero)
  proximos.sort((a, b) => (a.proximo_mantenimiento_fecha ?? '').localeCompare(b.proximo_mantenimiento_fecha ?? ''));

  return { ok: true, data: proximos };
}