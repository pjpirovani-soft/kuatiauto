import Link from "next/link";
import ServicioEmpresaForm from "@/components/ServicioEmpresaForm";

export default function NuevoServicioPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-6">
        <Link href="/catalogo/servicios" className="text-sm text-gray-600 hover:text-black underline">← Servicios</Link>
        <h1 className="text-3xl font-bold mt-2">Nuevo servicio</h1>
      </header>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ServicioEmpresaForm modo="crear" />
      </div>
    </div>
  );
}