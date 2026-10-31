import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

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
    <div className="max-w-4xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Panel</h1>
          <p className="text-gray-600 text-sm">Sesión iniciada como {user.email}</p>
        </div>
      </header>

      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center space-y-4">
        {tieneEmpresa ? (
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/clientes"
              className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 inline-block"
            >
              Gestionar clientes
            </Link>
            <Link
              href="/vehiculos"
              className="border border-gray-300 px-6 py-3 rounded hover:bg-gray-100 inline-block"
            >
              Ver vehículos
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-600">Todavía no tenés una empresa creada.</p>
            <Link
              href="/crear-empresa"
              className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 inline-block"
            >
              Crear empresa
            </Link>
          </>
        )}
      </div>
    </div>
  );
}