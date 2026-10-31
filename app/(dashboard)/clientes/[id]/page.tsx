import { ClienteForm } from '@/components/ClienteForm';
import { editarCliente } from '@/lib/clientes-actions';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function EditarClientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: cliente, error } = await supabase
    .from('cliente')
    .select('id, nombre, email, telefono, notas')
    .eq('id', id)
    .maybeSingle();

  if (error || !cliente) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-red-600">Cliente no encontrado.</p>
          <Link href="/dashboard/clientes" className="text-blue-600 hover:underline text-sm">Volver</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard/clientes" className="text-gray-500 hover:text-black text-sm">
            Volver a clientes
          </Link>
        </div>
        <ClienteForm
          action={editarCliente}
          title="Editar cliente"
          initialData={{
            id: cliente.id,
            nombre: cliente.nombre,
            email: cliente.email,
            telefono: cliente.telefono,
            notas: cliente.notas,
          }}
        />
      </div>
    </main>
  );
}
