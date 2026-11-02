import Link from "next/link";
import { notFound } from "next/navigation";
import { obtenerServicioGlobalAdmin } from "@/lib/admin-actions";
import { ServicioGlobalForm } from "@/components/ServicioGlobalForm";

export const dynamic = "force-dynamic";

export default async function EditarServicioGlobalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await obtenerServicioGlobalAdmin(id);

  if (!res.ok) {
    if (res.notFound) notFound();
    return (
      <div className="max-w-6xl mx-auto">
        <Link href="/admin/catalogo/servicios" className="text-sm text-blue-700 hover:underline">
          Volver a Servicios
        </Link>
        <h1 className="text-3xl font-bold mt-2 mb-6">Editar servicio</h1>
        <p className="text-red-600">Error: {res.error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/admin/catalogo/servicios" className="text-sm text-blue-700 hover:underline">
        Volver a Servicios
      </Link>
      <h1 className="text-3xl font-bold mt-2 mb-6">Editar servicio</h1>
      <ServicioGlobalForm modo="editar" initialData={res.data} />
    </div>
  );
}