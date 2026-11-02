import Link from "next/link";
import { notFound } from "next/navigation";
import { obtenerProductoGlobalAdmin } from "@/lib/admin-actions";
import { ProductoGlobalForm } from "@/components/ProductoGlobalForm";

export const dynamic = "force-dynamic";

export default async function EditarProductoGlobalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await obtenerProductoGlobalAdmin(id);

  if (!res.ok) {
    if (res.notFound) notFound();
    return (
      <div className="max-w-6xl mx-auto">
        <Link href="/admin/catalogo/productos" className="text-sm text-blue-700 hover:underline">
          Volver a Productos
        </Link>
        <h1 className="text-3xl font-bold mt-2 mb-6">Editar producto</h1>
        <p className="text-red-600">Error: {res.error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/admin/catalogo/productos" className="text-sm text-blue-700 hover:underline">
        Volver a Productos
      </Link>
      <h1 className="text-3xl font-bold mt-2 mb-6">Editar producto</h1>
      <ProductoGlobalForm modo="editar" initialData={res.data} />
    </div>
  );
}