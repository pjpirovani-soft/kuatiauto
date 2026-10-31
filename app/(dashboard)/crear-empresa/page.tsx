import { EmpresaForm } from '@/components/EmpresaForm';
import { crearEmpresa } from '@/lib/empresa-actions';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function CrearEmpresaPage() {
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

  if (usuario?.empresa_id) {
    redirect('/clientes');
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/clientes" className="text-gray-500 hover:text-black text-sm">
            Volver a clientes
          </Link>
        </div>
        <EmpresaForm action={crearEmpresa} />
      </div>
    </main>
  );
}