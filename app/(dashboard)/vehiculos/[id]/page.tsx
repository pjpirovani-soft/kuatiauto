import Link from 'next/link';
import { notFound } from 'next/navigation';
import VehiculoForm from '@/components/VehiculoForm';
import ProponerHistorialForm from '@/components/ProponerHistorialForm';
import { listarClientes } from '@/lib/clientes-actions';
import { createClient } from '@/lib/supabase/server';

type Cliente = { id: string; nombre: string };

export default async function VehiculoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: vehiculo } = await supabase
    .from('vehiculo')
    .select('id, cliente_id, marca, modelo, anio, patente, km_actual, notas, activo')
    .eq('id', id)
    .eq('activo', true)
    .maybeSingle();

  if (!vehiculo) notFound();

  const res = await listarClientes();
  const clientes: Cliente[] = res.ok ? (res.data as Cliente[]) : [];

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-6">
        <Link href="/vehiculos" className="text-sm text-kuati-grafito/80 hover:text-kuati-petroleo underline">
          Volver a vehículos
        </Link>
        <h1 className="text-3xl font-bold mt-2">
          {vehiculo.marca} {vehiculo.modelo}
        </h1>
        <div className="mt-3">
          <Link href={"/ordenes/nuevo?vehiculo_id=" + vehiculo.id} className="text-sm bg-kuati-petroleo text-kuati-blanco px-4 py-2 rounded hover:bg-kuati-petroleo/90 inline-block">
            Nueva orden para este vehículo
          </Link>
        </div>
      </header>

      <div className="bg-kuati-blanco rounded-xl border border-kuati-borde p-6">
        <VehiculoForm modo="editar" clientes={clientes} initialData={vehiculo} />
      </div>

      <div className="bg-kuati-blanco rounded-xl border border-kuati-borde p-6 mt-6">
        <ProponerHistorialForm vehiculoId={vehiculo.id} />
      </div>
    </div>
  );
}
