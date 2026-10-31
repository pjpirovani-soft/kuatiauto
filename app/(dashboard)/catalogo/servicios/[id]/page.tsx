import Link from "next/link";
import { notFound } from "next/navigation";
import ServicioEmpresaForm from "@/components/ServicioEmpresaForm";
import { obtenerServicioEmpresa } from "@/lib/servicios-empresa-actions";

type ServicioRow = {
  id: string;
  nombre: string;
  descripcion: string | null;
};

export default async function EditarServicioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await obtenerServicioEmpresa({ id });
  if (!res.ok) notFound();
  const servicio = res.data as ServicioRow;
  if (!servicio) notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-6">
        <Link href="/catalogo/servicios" className="text-sm text-gray-600 hover:text-black underline">← Servicios</Link>
        <h1 className="text-3xl font-bold mt-2">Editar servicio</h1>
      </header>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ServicioEmpresaForm
          modo="editar"
          initialData={{
            id: servicio.id,
            nombre: servicio.nombre,
            descripcion: servicio.descripcion ?? "",
          }}
        />
      </div>
    </div>
  );
}