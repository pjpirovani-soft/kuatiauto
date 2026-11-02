import Link from 'next/link';
import VehiculoForm from '@/components/VehiculoForm';
import { listarClientes } from '@/lib/clientes-actions';
import { IconArrowLeft, IconPlus } from '@tabler/icons-react';

type Cliente = { id: string; nombre: string };

export default async function NuevoVehiculoPage() {
  const res = await listarClientes();
  const clientes: Cliente[] = res.ok ? (res.data as Cliente[]) : [];

  return (
    <div className='max-w-4xl mx-auto'>
      <header className='mb-6'>
        <Link href='/vehiculos' className='inline-flex items-center gap-1 text-sm text-kuati-grafito/60 hover:text-kuati-petroleo transition-colors mb-2'>
          <IconArrowLeft size={16} /> Volver a vehículos
        </Link>
        <h1 className='text-3xl font-bold text-kuati-petroleo'>Nuevo vehículo</h1>
      </header>

      {clientes.length === 0 ? (
        <div className='bg-kuati-blanco rounded-xl border border-kuati-borde p-12 text-center space-y-4 shadow-sm'>
          <p className='text-kuati-grafito/70'>Necesitás cargar al menos un cliente antes de agregar vehículos.</p>
          <Link
            href='/clientes/nuevo'
            className='inline-flex items-center gap-2 bg-kuati-petroleo text-kuati-blanco px-6 py-2.5 rounded-lg hover:bg-kuati-petroleo/90 transition-colors'
          >
            <IconPlus size={18} />
            Crear cliente
          </Link>
        </div>
      ) : (
        <div className='bg-kuati-blanco rounded-xl border border-kuati-borde p-6 md:p-8 shadow-sm'>
          <VehiculoForm modo='crear' clientes={clientes} />
        </div>
      )}
    </div>
  );
}
