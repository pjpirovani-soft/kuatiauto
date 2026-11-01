import Link from "next/link";
import VehiculoConductorForm from "@/components/VehiculoConductorForm";

export default function NuevoVehiculoConductorPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-6">
        <Link href="/mi-garage/vehiculos" className="text-sm text-gray-600 hover:underline">← Volver</Link>
        <h1 className="text-3xl font-bold mt-2">Agregar Vehículo</h1>
      </header>
      <div className="bg-white p-6 rounded-xl border"><VehiculoConductorForm /></div>
    </div>
  );
}
