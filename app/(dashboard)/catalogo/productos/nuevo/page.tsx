import Link from "next/link";
import ProductoEmpresaForm from "@/components/ProductoEmpresaForm";

export default function NuevoProductoPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-6">
        <Link href="/catalogo/productos" className="text-sm text-gray-600 hover:text-black underline">← Productos</Link>
        <h1 className="text-3xl font-bold mt-2">Nuevo producto</h1>
      </header>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ProductoEmpresaForm modo="crear" />
      </div>
    </div>
  );
}