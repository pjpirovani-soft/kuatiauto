import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import EtiquetaMantenimiento from '@/components/vehiculos/EtiquetaMantenimiento';
import type { DatosEtiqueta } from '@/lib/etiqueta-mantenimiento';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = await createClient();
  const { data } = await supabase.rpc('obtener_vehiculo_publico', { p_token: token });
  const d = data as any;
  if (!d) return { title: 'Ficha no encontrada' };
  const prox = d.ultimo_mantenimiento?.proximo_mantenimiento_fecha;
  return {
    title: `${d.vehiculo.marca} ${d.vehiculo.modelo} - ${d.empresa.nombre}`,
    description: prox ? `Proximo mantenimiento: ${prox}` : 'Ficha de mantenimiento',
  };
}

export default async function FichaPublicaPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('obtener_vehiculo_publico', { p_token: token });
  if (error || !data) notFound();

  const d = data as any;
  const datos: DatosEtiqueta = {
    vehiculo: {
      marca: d.vehiculo.marca,
      modelo: d.vehiculo.modelo,
      anio: d.vehiculo.anio ?? null,
      patente: d.vehiculo.patente,
      km_actual: d.vehiculo.km_actual ?? null,
    },
    empresa: {
      nombre: d.empresa.nombre,
      direccion: d.empresa.direccion ?? null,
      telefono: d.empresa.telefono ?? null,
    },
    ultimo_mantenimiento: d.ultimo_mantenimiento ?? null,
    cliente: null,
    token_publico: token,
  };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-md">
        <EtiquetaMantenimiento
          id="etiqueta-publica"
          datos={datos}
          appUrl={appUrl}
        />
      </div>
    </main>
  );
}