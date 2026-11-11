'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export type VentaMensual = { mes: string; total: number; cantidad: number };
export type ProductividadMecanico = { nombre: string; completadas: number; total_facturado: number };
export type TopItem = { nombre: string; cantidad: number; total_facturado: number };

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

async function getEmpresaId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('usuario').select('empresa_id').eq('id', user.id).maybeSingle();
  return data?.empresa_id ?? null;
}

export async function obtenerVentasMensuales(): Promise<Result<VentaMensual[]>> {
  const empresaId = await getEmpresaId();
  if (!empresaId) return { ok: false, error: 'Sin empresa' };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('orden_trabajo')
    .select('fecha, importe_total')
    .eq('empresa_id', empresaId)
    .eq('estado', 'completada')
    .not('importe_total', 'is', null)
    .order('fecha', { ascending: false })
    .limit(500);

  if (error) return { ok: false, error: error.message };

  const porMes = new Map<string, { total: number; cantidad: number }>();
  for (const o of data ?? []) {
    const mes = (o.fecha ?? '').slice(0, 7); // YYYY-MM
    if (!mes) continue;
    const prev = porMes.get(mes) ?? { total: 0, cantidad: 0 };
    porMes.set(mes, {
      total: prev.total + Number(o.importe_total ?? 0),
      cantidad: prev.cantidad + 1,
    });
  }

  const ventas: VentaMensual[] = Array.from(porMes.entries())
    .map(([mes, v]) => ({ mes, total: v.total, cantidad: v.cantidad }))
    .sort((a, b) => a.mes.localeCompare(b.mes));

  return { ok: true, data: ventas };
}

export async function obtenerProductividadMecanicos(): Promise<Result<ProductividadMecanico[]>> {
  const empresaId = await getEmpresaId();
  if (!empresaId) return { ok: false, error: 'Sin empresa' };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('orden_trabajo')
    .select('empleado_id, importe_total, empleado:empleado_id(nombre, email)')
    .eq('empresa_id', empresaId)
    .eq('estado', 'completada')
    .not('empleado_id', 'is', null);

  if (error) return { ok: false, error: error.message };

  const porEmpleado = new Map<string, { nombre: string; completadas: number; total_facturado: number }>();
  for (const o of data ?? []) {
    const emp = (o as any).empleado;
    const nombre = emp?.nombre ?? emp?.email ?? 'Sin nombre';
    const prev = porEmpleado.get(o.empleado_id!) ?? { nombre, completadas: 0, total_facturado: 0 };
    porEmpleado.set(o.empleado_id!, {
      nombre,
      completadas: prev.completadas + 1,
      total_facturado: prev.total_facturado + Number(o.importe_total ?? 0),
    });
  }

  const result: ProductividadMecanico[] = Array.from(porEmpleado.values())
    .sort((a, b) => b.completadas - a.completadas);

  return { ok: true, data: result };
}

export async function obtenerTopProductos(): Promise<Result<TopItem[]>> {
  const empresaId = await getEmpresaId();
  if (!empresaId) return { ok: false, error: 'Sin empresa' };

  const supabase = await createClient();
  // Traer ordenes completadas de la empresa
  const { data: ordenes, error: errO } = await supabase
    .from('orden_trabajo')
    .select('id')
    .eq('empresa_id', empresaId)
    .eq('estado', 'completada')
    .limit(200);

  if (errO) return { ok: false, error: errO.message };
  const ordenIds = (ordenes ?? []).map((o) => o.id);
  if (ordenIds.length === 0) return { ok: true, data: [] };

  const { data, error } = await supabase
    .from('orden_producto')
    .select('cantidad, precio_unitario, producto_global:producto_global_id(nombre), producto_empresa:producto_empresa_id(nombre)')
    .in('orden_id', ordenIds);

  if (error) return { ok: false, error: error.message };

  const porProducto = new Map<string, { nombre: string; cantidad: number; total_facturado: number }>();
  for (const p of data ?? []) {
    const pg = (p as any).producto_global;
    const pe = (p as any).producto_empresa;
    const nombre = pg?.nombre ?? pe?.nombre ?? 'Producto desconocido';
    const prev = porProducto.get(nombre) ?? { nombre, cantidad: 0, total_facturado: 0 };
    porProducto.set(nombre, {
      nombre,
      cantidad: prev.cantidad + Number(p.cantidad ?? 0),
      total_facturado: prev.total_facturado + (Number(p.cantidad ?? 0) * Number(p.precio_unitario ?? 0)),
    });
  }

  const result: TopItem[] = Array.from(porProducto.values())
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);

  return { ok: true, data: result };
}

export async function obtenerTopServicios(): Promise<Result<TopItem[]>> {
  const empresaId = await getEmpresaId();
  if (!empresaId) return { ok: false, error: 'Sin empresa' };

  const supabase = await createClient();
  const { data: ordenes, error: errO } = await supabase
    .from('orden_trabajo')
    .select('id')
    .eq('empresa_id', empresaId)
    .eq('estado', 'completada')
    .limit(200);

  if (errO) return { ok: false, error: errO.message };
  const ordenIds = (ordenes ?? []).map((o) => o.id);
  if (ordenIds.length === 0) return { ok: true, data: [] };

  const { data, error } = await supabase
    .from('orden_servicio')
    .select('precio, servicio_global:servicio_global_id(nombre), servicio_empresa:servicio_empresa_id(nombre)')
    .in('orden_id', ordenIds);

  if (error) return { ok: false, error: error.message };

  const porServicio = new Map<string, { nombre: string; cantidad: number; total_facturado: number }>();
  for (const s of data ?? []) {
    const sg = (s as any).servicio_global;
    const se = (s as any).servicio_empresa;
    const nombre = sg?.nombre ?? se?.nombre ?? 'Servicio desconocido';
    const prev = porServicio.get(nombre) ?? { nombre, cantidad: 0, total_facturado: 0 };
    porServicio.set(nombre, {
      nombre,
      cantidad: prev.cantidad + 1,
      total_facturado: prev.total_facturado + Number(s.precio ?? 0),
    });
  }

  const result: TopItem[] = Array.from(porServicio.values())
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);

  return { ok: true, data: result };
}