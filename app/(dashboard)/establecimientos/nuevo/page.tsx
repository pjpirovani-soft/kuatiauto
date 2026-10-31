import Link from "next/link";
import EstablecimientoForm from "@/components/EstablecimientoForm";

export default function NuevoEstablecimientoPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-6">
        <Link href="/establecimientos" className="text-sm text-gray-600 hover:text-black underline">← Establecimientos</Link>
        <h1 className="text-3xl font-bold mt-2">Nuevo establecimiento</h1>
      </header>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <EstablecimientoForm modo="crear" />
      </div>
    </div>
  );
}
