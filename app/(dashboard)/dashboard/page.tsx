import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { IconUsers, IconCar, IconPlus } from '@tabler/icons-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: usuario } = await supabase
    .from('usuario')
    .select('empresa_id, rol')
    .eq('id', user.id)
    .maybeSingle();

  const tieneEmpresa = Boolean(usuario?.empresa_id);

  return (
    <div className='max-w-4xl mx-auto'>
      <header className='flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-kuati-petroleo'>Panel Principal</h1>
          <p className='text-kuati-grafito/70 text-sm'>Sesión iniciada como {user.email}</p>
        </div>
      </header>

      <div className='bg-kuati-blanco rounded-xl border border-kuati-borde p-6 md:p-8 text-center shadow-sm'>
        {tieneEmpresa ? (
          <div className='space-y-6'>
            <div className='max-w-md mx-auto'>
              <h2 className='text-xl font-bold text-kuati-petroleo mb-2'>¡Bienvenido!</h2>
              <p className='text-kuati-grafito/70'>
                Gestioná los clientes y vehículos de tu lubricentro desde un solo lugar.
              </p>
            </div>
            
            <div className='flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto'>
              <Link
                href='/clientes'
                className='flex-1 flex items-center justify-center gap-2 bg-kuati-petroleo text-kuati-blanco px-6 py-3 rounded-lg font-semibold hover:bg-kuati-petroleo/90 transition-colors shadow-md'
              >
                <IconUsers size={20} />
                Gestionar clientes
              </Link>
              <Link
                href='/vehiculos'
                className='flex-1 flex items-center justify-center gap-2 bg-kuati-lima text-kuati-petroleo px-6 py-3 rounded-lg font-bold hover:bg-kuati-lima/90 transition-colors shadow-[0_0_15px_rgba(163,217,0,0.3)] hover:shadow-[0_0_20px_rgba(163,217,0,0.5)]'
              >
                <IconCar size={20} />
                Ver vehículos
              </Link>
            </div>
          </div>
        ) : (
          <div className='space-y-6'>
            <div className='max-w-md mx-auto'>
              <h2 className='text-xl font-bold text-kuati-petroleo mb-2'>Empecemos</h2>
              <p className='text-kuati-grafito/70'>
                Todavía no tenés una empresa creada. Creala para empezar a gestionar tu lubricentro.
              </p>
            </div>
            <Link
              href='/crear-empresa'
              className='inline-flex items-center gap-2 bg-kuati-petroleo text-kuati-blanco px-8 py-3 rounded-lg font-semibold hover:bg-kuati-petroleo/90 transition-colors shadow-md'
            >
              <IconPlus size={20} />
              Crear empresa
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
