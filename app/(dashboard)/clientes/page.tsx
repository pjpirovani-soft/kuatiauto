import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { borrarCliente } from '@/lib/cliente-actions';

export default async function ClientesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: clientes, error } = await supabase
    .from('clientes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-8 text-red-600">Error cargando clientes: {error.message}</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Mis clientes</h1>
            <p className="text-gray-600 text-sm">Gestioná tu cartera de clientes.</p>
          </div>
          <Link
            href="/dashboard/clientes/nuevo"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
          >
            + Nuevo cliente
          </Link>
        </header>

        {clientes && clientes.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
            <p>Todavía no tenés clientes cargados.</p>
            <Link
              href="/dashboard/clientes/nuevo"
              className="text-blue-600 hover:underline mt-4 inline-block"
            >
              Crear el primero
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                <tr>
                  <th className="px-6 py-3 font-medium">Nombre</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Teléfono</th>
                  <th className="px-6 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clientes?.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{cliente.nombre}</td>
                    <td className="px-6 py-4 text-gray-600">{cliente.email}</td>
                    <td className="px-6 py-4 text-gray-600">{cliente.telefono || '-'}</td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link
                        href={`/dashboard/clientes/${cliente.id}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Editar
                      </Link>
                      <form
                        action={async () => {
                          'use server';
                          await borrarCliente(cliente.id);
                        }}
                        className="inline"
                      >
                        <button type="submit" className="text-red-600 hover:underline text-sm">
                          Borrar
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6">
          <Link href="/dashboard" className="text-gray-500 hover:text-black text-sm">
            ← Volver al panel
          </Link>
        </div>
      </div>
    </main>
  );
}
