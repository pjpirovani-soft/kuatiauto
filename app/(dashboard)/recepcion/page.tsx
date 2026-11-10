import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';
import { createClient } from '@/lib/supabase/server';
import { listarClientes } from '@/lib/clientes-actions';
import { listarVehiculosEmpresa } from '@/lib/vehiculos-actions';
import RecepcionWizard from '@/components/recepcion/RecepcionWizard';

export type ClienteRecepcion = {
  id: string;
  nombre: string;
  telefono: string | null;
};

export type VehiculoRecepcion = {
  id: string;
  cliente_id: string;
  marca: string | null;
  modelo: string | null;
  patente: string | null;
  anio: number | null;
  km_actual: number | null;
};

export type ServicioRecepcion = {
  id: string;
  nombre: string;
  origen: 'global' | 'empresa';
  precio: number | null;
  intervalo_km_sugerido?: number | null;
  intervalo_meses_sugerido?: number | null;
};

export type ProductoRecepcion = {
  id: string;
  nombre: string;
  origen: 'global' | 'empresa';
  precio: number | null;
};

export default async function RecepcionPage() {
  const supabase = await createClient();

  const [clientesRes, vehiculosRes, servGlobalRes, servEmpresaRes, prodGlobalRes, prodEmpresaRes] =
    await Promise.all([
      listarClientes(),
      listarVehiculosEmpresa(),
      supabase.from('servicio_global').select('id, nombre, intervalo_km_sugerido, intervalo_meses_sugerido').order('nombre'),
      supabase.from('servicio_empresa').select('id, nombre').order('nombre'),
      supabase.from('producto_global').select('id, nombre').order('nombre'),
      supabase.from('producto_empresa').select('id, nombre').order('nombre'),
    ]);

  const clientes: ClienteRecepcion[] = clientesRes.ok
    ? (clientesRes.data as ClienteRecepcion[])
    : [];
  const vehiculos: VehiculoRecepcion[] = vehiculosRes.ok
    ? (vehiculosRes.data as VehiculoRecepcion[])
    : [];

  const servicios: ServicioRecepcion[] = [
    ...((servGlobalRes.data ?? []) as { id: string; nombre: string; intervalo_km_sugerido?: number | null; intervalo_meses_sugerido?: number | null }[]).map((s) => ({
      id: s.id,
      nombre: s.nombre,
      origen: 'global' as const,
      precio: null,
      intervalo_km_sugerido: s.intervalo_km_sugerido,
      intervalo_meses_sugerido: s.intervalo_meses_sugerido,
    })),
    ...((servEmpresaRes.data ?? []) as { id: string; nombre: string }[]).map((s) => ({
      id: s.id,
      nombre: s.nombre,
      origen: 'empresa' as const,
      precio: null,
    })),
  ];

  const productos: ProductoRecepcion[] = [
    ...((prodGlobalRes.data ?? []) as { id: string; nombre: string }[]).map((p) => ({
      id: p.id,
      nombre: p.nombre,
      origen: 'global' as const,
      precio: null,
    })),
    ...((prodEmpresaRes.data ?? []) as { id: string; nombre: string }[]).map((p) => ({
      id: p.id,
      nombre: p.nombre,
      origen: 'empresa' as const,
      precio: null,
    })),
  ];

  return (
    <div className='max-w-4xl mx-auto'>
      <header className='mb-6'>
        <Link
          href='/dashboard'
          className='inline-flex items-center gap-1 text-sm text-kuati-grafito/60 hover:text-kuati-petroleo transition-colors mb-2'
        >
          <IconArrowLeft size={16} /> Volver al panel
        </Link>
        <h1 className='text-3xl font-bold text-kuati-petroleo'>Recepción rápida</h1>
        <p className='text-kuati-grafito/70 text-sm mt-1'>
          Cliente → Vehículo → Servicio en una sola pantalla.
        </p>
      </header>

      <RecepcionWizard
        clientes={clientes}
        vehiculos={vehiculos}
        servicios={servicios}
        productos={productos}
      />
    </div>
  );
}