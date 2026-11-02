import Link from "next/link";
import { ServicioGlobalForm } from "@/components/ServicioGlobalForm";

export const dynamic = "force-dynamic";

export default function NuevoServicioGlobalPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/admin/catalogo/servicios" className="text-sm text-blue-700 hover:underline">
        Volver a Servicios
      </Link>
      <h1 className="text-3xl font-bold mt-2 mb-6">Nuevo servicio global</h1>
      <ServicioGlobalForm modo="crear" />
    </div>
  );
}