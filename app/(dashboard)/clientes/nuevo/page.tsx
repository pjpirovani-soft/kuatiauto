import { ClienteForm } from '@/components/ClienteForm';
import { crearCliente } from '@/lib/clientes-actions';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';

export default function NuevoClientePage() {
  return (
    <div className='max-w-2xl mx-auto'>
      <header className='mb-6'>
        <Link href='/clientes' className='inline-flex items-center gap-1 text-sm text-kuati-grafito/60 hover:text-kuati-petroleo transition-colors mb-2'>
          <IconArrowLeft size={16} /> Volver a clientes
        </Link>
        <h1 className='text-3xl font-bold text-kuati-petroleo'>Nuevo cliente</h1>
      </header>
      <ClienteForm action={crearCliente} title='Nuevo cliente' />
    </div>
  );
}
