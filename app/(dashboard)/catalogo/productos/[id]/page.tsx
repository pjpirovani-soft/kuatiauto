import Link from "next/link";
import { notFound } from "next/navigation";
import ProductoEmpresaForm from "@/components/ProductoEmpresaForm";
import { obtenerProductoEmpresa } from "@/lib/productos-empresa-actions";

type ProductoRow = {
  id: string;
  nombre: string;
  marca: string | null;
  tipo: string | null;
  viscosidad: string | null;
  unidad: string;
  stock_actual: number;
  stock_minimo: number;
};

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await obtenerProductoEmpresa({ id });
  if (!res.ok) notFound();
  const p = res.data as ProductoRow;
  if (!p) notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-6">
        <Link href="/catalogo/productos" className="text-sm text-gray-600 hover:text-black underline">← Productos</Link>
        <h1 className="text-3xl font-bold mt-2">Editar producto</h1>
      </header>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ProductoEmpresaForm
          modo="editar"
          initialData={{
            id: p.id,
            nombre: p.nombre,
            marca: p.marca ?? "",
            tipo: p.tipo ?? "",
            viscosidad: p.viscosidad ?? "",
            unidad: p.unidad,
            stock_actual: String(p.stock_actual),
            stock_minimo: String(p.stock_minimo),
          }}
        />
      </div>
    </div>
  );
}