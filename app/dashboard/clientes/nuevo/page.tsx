import { ClienteForm } from '@/components/ClienteForm';
import { crearCliente } from '@/lib/cliente-actions';
import Link from 'next/link';

export default function NuevoClientePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard/clientes" className="text-gray-500 hover:text-black text-sm">
            ← Volver a clientes
          </Link>
        </div>
        <ClienteForm action={crearCliente} title="Nuevo cliente" />
      </div>
    </main>
  );
}
