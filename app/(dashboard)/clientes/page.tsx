import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { listarClientes } from '@/lib/clientes-actions';
import { IconPlus, IconUser, IconMail, IconPhone } from '@tabler/icons-react';

export default async function ClientesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const result = await listarClientes();
  if (!result.ok) {
    return <div className='p-8 text-red-600'>Error cargando clientes: {result.error}</div>;
  }

  const clientes = result.data as Array<{ id: string; nombre: string; email: string | null; telefono: string | null }>;

  return (
    <main className='max-w-5xl mx-auto'>
      <header className='flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-kuati-petroleo'>Mis clientes</h1>
          <p className='text-kuati-grafito/70 text-sm'>Gestioná tu cartera de clientes.</p>
        </div>
        <Link 
          href='/clientes/nuevo' 
          className='inline-flex items-center justify-center gap-2 bg-kuati-petroleo text-kuati-blanco px-4 py-2 rounded-lg hover:bg-kuati-petroleo/90 text-sm font-semibold transition-colors shadow-md'
        >
          <IconPlus size={18} />
          Nuevo cliente
        </Link>
      </header>

      {clientes.length === 0 ? (
        <div className='bg-kuati-blanco rounded-xl border border-kuati-borde p-12 text-center text-kuati-grafito/70 shadow-sm'>
          <p>Todavía no tenés clientes cargados.</p>
          <Link href='/clientes/nuevo' className='text-kuati-petroleo font-semibold hover:underline mt-4 inline-block'>
            Crear el primero
          </Link>
        </div>
      ) : (
        <>
          {/* VISTA ESCRITORIO: Tabla */}
          <div className='hidden md:block bg-kuati-blanco rounded-xl border border-kuati-borde overflow-hidden shadow-sm'>
            <table className='w-full text-left'>
              <thead className='bg-kuati-fondo border-b border-kuati-borde text-sm text-kuati-grafito'>
                <tr>
                  <th className='px-6 py-4 font-semibold'>Nombre</th>
                  <th className='px-6 py-4 font-semibold'>Email</th>
                  <th className='px-6 py-4 font-semibold'>Teléfono</th>
                  <th className='px-6 py-4 font-semibold text-right'>Acciones</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-kuati-borde'>
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className='hover:bg-kuati-fondo/50 transition-colors'>
                    <td className='px-6 py-4 font-medium text-kuati-petroleo'>{cliente.nombre}</td>
                    <td className='px-6 py-4 text-kuati-grafito/80'>{cliente.email ?? '-'}</td>
                    <td className='px-6 py-4 text-kuati-grafito/80'>{cliente.telefono ?? '-'}</td>
                    <td className='px-6 py-4 text-right'>
                      <Link href={`/clientes/${cliente.id}`} className='text-kuati-petroleo font-semibold hover:text-kuati-lima transition-colors text-sm'>
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* VISTA CELULAR: Tarjetas */}
          <div className='grid md:hidden gap-4'>
            {clientes.map((cliente) => (
              <div key={cliente.id} className='bg-kuati-blanco rounded-xl border border-kuati-borde p-5 shadow-sm flex flex-col gap-3'>
                <div className='flex items-center gap-3 border-b border-kuati-borde pb-3'>
                  <div className='w-10 h-10 bg-kuati-petroleo/5 rounded-full flex items-center justify-center text-kuati-petroleo'>
                    <IconUser size={20} />
                  </div>
                  <h3 className='font-bold text-kuati-petroleo text-lg'>{cliente.nombre}</h3>
                </div>
                <div className='space-y-1 text-sm text-kuati-grafito/80'>
                  <p className='flex items-center gap-2'>
                    <IconMail size={16} className='text-kuati-grafito/50' />
                    {cliente.email ?? 'Sin email'}
                  </p>
                  <p className='flex items-center gap-2'>
                    <IconPhone size={16} className='text-kuati-grafito/50' />
                    {cliente.telefono ?? 'Sin teléfono'}
                  </p>
                </div>
                <div className='pt-2 flex justify-end'>
                  <Link 
                    href={`/clientes/${cliente.id}`} 
                    className='text-kuati-petroleo font-bold text-sm bg-kuati-fondo px-4 py-2 rounded-lg hover:bg-kuati-borde transition-colors'
                  >
                    Editar cliente
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
