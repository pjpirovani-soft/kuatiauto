import Link from "next/link";
import { ProductoGlobalForm } from "@/components/ProductoGlobalForm";

export const dynamic = "force-dynamic";

export default function NuevoProductoGlobalPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/admin/catalogo/productos" className="text-sm text-blue-700 hover:underline">
        Volver a Productos
      </Link>
      <h1 className="text-3xl font-bold mt-2 mb-6">Nuevo producto global</h1>
      <ProductoGlobalForm modo="crear" />
    </div>
  );
}