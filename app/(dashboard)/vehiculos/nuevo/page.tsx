import Link from 'next/link';
import VehiculoForm from '@/components/VehiculoForm';
import { listarClientes } from '@/lib/clientes-actions';

type Cliente = { id: string; nombre: string };

export default async function NuevoVehiculoPage() {
  const res = await listarClientes();
  const clientes: Cliente[] = res.ok ? (res.data as Cliente[]) : [];

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-6">
        <Link href="/vehiculos" className="text-sm text-gray-600 hover:text-black underline">
          ← Volver a vehículos
        </Link>
        <h1 className="text-3xl font-bold mt-2">Nuevo vehículo</h1>
      </header>

      {clientes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center space-y-3">
          <p className="text-gray-600">Necesitás cargar al menos un cliente antes de agregar vehículos.</p>
          <Link
            href="/clientes/nuevo"
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 inline-block"
          >
            Crear cliente
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <VehiculoForm modo="crear" clientes={clientes} />
        </div>
      )}
    </div>
  );
}