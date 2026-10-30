import { ClienteForm } from '@/components/ClienteForm';
import { editarCliente } from '@/lib/cliente-actions';
import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';

export default async function EditarClientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: cliente } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!cliente) notFound();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard/clientes" className="text-gray-500 hover:text-black text-sm">
            ← Volver a clientes
          </Link>
        </div>
        <ClienteForm
          action={editarCliente.bind(null, cliente.id)}
          title="Editar cliente"
          initialData={{
            id: cliente.id,
            nombre: cliente.nombre,
            email: cliente.email,
            telefono: cliente.telefono || '',
            notas: cliente.notas || '',
          }}
        />
      </div>
    </main>
  );
}
