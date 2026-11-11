import { obtenerContadoresAdmin } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const res = await obtenerContadoresAdmin();
  if (!res.ok) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Panel de administración</h1>
        <p className="text-red-700">Error: {res.error}</p>
      </div>
    );
  }

  const { empresas, usuarios, establecimientosPublicados, ordenes } = res.data;

  const cards = [
    { label: "Empresas", valor: empresas },
    { label: "Usuarios", valor: usuarios },
    { label: "Establecimientos publicados", valor: establecimientosPublicados },
    { label: "Órdenes", valor: ordenes },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Panel de administración</h1>
      <p className="text-sm text-kuati-grafito/80 mb-6">Vista global del sistema. Solo admin_general.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-kuati-blanco p-6 rounded-xl border border-kuati-borde">
            <p className="text-sm text-kuati-grafito/80">{c.label}</p>
            <p className="text-3xl font-bold mt-2">{c.valor}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
