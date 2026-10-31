import Link from "next/link";
import { notFound } from "next/navigation";
import EstablecimientoForm, { type EstablecimientoData, type Publico } from "@/components/EstablecimientoForm";
import PublicarButton from "@/components/PublicarButton";
import { obtenerEstablecimiento } from "@/lib/establecimiento-actions";

function normalizarPublico(p: EstablecimientoData["establecimiento_publico"]): Publico | null {
  if (!p) return null;
  if (Array.isArray(p)) return p[0] ?? null;
  return p;
}

export const dynamic = "force-dynamic";

export default async function EditarEstablecimientoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await obtenerEstablecimiento({ id });
  if (!res.ok) notFound();

  const est = res.data as EstablecimientoData;
  const pub = normalizarPublico(est.establecimiento_publico);

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-6">
        <Link href="/establecimientos" className="text-sm text-gray-600 hover:text-black underline">← Establecimientos</Link>
        <h1 className="text-3xl font-bold mt-2">{est.nombre}</h1>
        {pub && (
          <div className="mt-3">
            <PublicarButton establecimientoPublicoId={pub.id} publicado={pub.publicado} />
          </div>
        )}
      </header>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <EstablecimientoForm modo="editar" initialData={est} />
      </div>
    </div>
  );
}
