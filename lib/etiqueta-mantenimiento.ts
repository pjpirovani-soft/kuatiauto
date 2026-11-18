// lib/etiqueta-mantenimiento.ts
// Helper para armar los datos de la etiqueta de mantenimiento.
// No es server action: es una funcion pura que recibe el cliente de Supabase.

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

export type DatosEtiqueta = {
  vehiculo: {
    marca: string;
    modelo: string;
    anio: number | null;
    patente: string | null;
    km_actual: number | null;
  };
  empresa: {
    nombre: string;
    direccion: string | null;
    telefono: string | null;
  };
  ultimo_mantenimiento: {
    fecha: string | null;
    km_servicio: number | null;
    numero_orden: number | null;
    servicios: string[];
    proximo_mantenimiento_fecha: string | null;
    proximo_mantenimiento_km: number | null;
  } | null;
  cliente: {
    nombre: string;
    email: string | null;
    telefono: string | null;
  } | null;
  token_publico: string | null;
};

export async function obtenerDatosEtiqueta(
  supabase: SupabaseClient<Database>,
  vehiculoId: string,
  empresaId: string
): Promise<DatosEtiqueta | null> {
  const { data: vehiculo } = await supabase
    .from('vehiculo')
    .select('id, marca, modelo, anio, patente, km_actual, token_publico, cliente:cliente_id(nombre, email, telefono)')
    .eq('id', vehiculoId)
    .eq('empresa_id', empresaId)
    .maybeSingle();
  if (!vehiculo) return null;

  const { data: empresa } = await supabase
    .from('empresa')
    .select('nombre, direccion, telefono')
    .eq('id', empresaId)
    .maybeSingle();
  if (!empresa) return null;

  const { data: orden } = await supabase
    .from('orden_trabajo')
    .select(`
      fecha, km_servicio, numero_orden,
      proximo_mantenimiento_fecha, proximo_mantenimiento_km,
      orden_servicio(servicio_global:servicio_global_id(nombre), servicio_empresa:servicio_empresa_id(nombre))
    `)
    .eq('vehiculo_id', vehiculoId)
    .eq('empresa_id', empresaId)
    .eq('estado', 'completada')
    .order('fecha', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const servicios: string[] = [];
  if (orden) {
    const o = orden as any;
    for (const line of o.orden_servicio ?? []) {
      const n = line.servicio_global?.nombre ?? line.servicio_empresa?.nombre;
      if (n) servicios.push(n);
    }
  }

  const cli = (vehiculo as any).cliente;

  return {
    vehiculo: {
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      anio: vehiculo.anio ?? null,
      patente: vehiculo.patente ?? null,
      km_actual: vehiculo.km_actual ?? null,
    },
    empresa: {
      nombre: empresa.nombre,
      direccion: empresa.direccion ?? null,
      telefono: empresa.telefono ?? null,
    },
    ultimo_mantenimiento: orden
      ? {
          fecha: orden.fecha ?? null,
          km_servicio: orden.km_servicio ?? null,
          numero_orden: orden.numero_orden ?? null,
          servicios,
          proximo_mantenimiento_fecha: orden.proximo_mantenimiento_fecha ?? null,
          proximo_mantenimiento_km: orden.proximo_mantenimiento_km ?? null,
        }
      : null,
    cliente: cli
      ? { nombre: cli.nombre, email: cli.email ?? null, telefono: cli.telefono ?? null }
      : null,
    token_publico: vehiculo.token_publico ?? null,
  };
}