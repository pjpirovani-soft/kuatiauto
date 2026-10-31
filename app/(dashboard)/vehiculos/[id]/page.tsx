import Link from 'next/link';
import { notFound } from 'next/navigation';
import VehiculoForm from '@/components/VehiculoForm';
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
        <Link href="/vehiculos" className="text-sm text-gray-600 hover:text-black underline">
          ← Volver a vehículos
        </Link>
        <h1 className="text-3xl font-bold mt-2">
          {vehiculo.marca} {vehiculo.modelo}
        </h1>
      </header>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <VehiculoForm modo="editar" clientes={clientes} initialData={vehiculo} />
      </div>
    </div>
  );
}