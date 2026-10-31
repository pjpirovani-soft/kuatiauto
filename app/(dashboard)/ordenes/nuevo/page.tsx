import Link from "next/link";
import NuevaOrdenClient from "@/components/NuevaOrdenClient";
import { listarVehiculosEmpresa } from "@/lib/vehiculos-actions";
import { listarClientes } from "@/lib/clientes-actions";
import { createClient } from "@/lib/supabase/server";

type VehiculoRow = {
  id: string;
  marca: string | null;
  modelo: string | null;
  patente: string | null;
  cliente_id: string | null;
};

type ClienteRow = { id: string; nombre: string | null };
type ServicioRow = { id: string; nombre: string | null };

export default async function NuevaOrdenPage({
  searchParams,
}: {
  searchParams: Promise<{ vehiculo_id?: string | string[] }>;
}) {
  const sp = await searchParams;
  const vehiculoIdInicial = typeof sp.vehiculo_id === "string" ? sp.vehiculo_id : undefined;
  const supabase = await createClient();

  const [vehRes, cliRes, servGlobalRes, servEmpresaRes, prodGlobalRes, prodEmpresaRes] = await Promise.all([
    listarVehiculosEmpresa(),
    listarClientes(),
    supabase.from("servicio_global").select("id, nombre").order("nombre"),
    supabase.from("servicio_empresa").select("id, nombre").order("nombre"),
    supabase.from("producto_global").select("id, nombre").order("nombre"),
    supabase.from("producto_empresa").select("id, nombre").order("nombre"),
  ]);

  const vehiculosRaw: VehiculoRow[] = vehRes.ok ? (vehRes.data as VehiculoRow[]) : [];
  const clientes: ClienteRow[] = cliRes.ok ? (cliRes.data as ClienteRow[]) : [];
  const clientePorId = new Map(clientes.map((c) => [c.id, c.nombre ?? "(sin nombre)"]));

  const vehiculos = vehiculosRaw.map((v) => {
    const partes = [v.marca, v.modelo].filter(Boolean).join(" ") || "(vehículo)";
    const patente = v.patente ? ` — ${v.patente}` : "";
    const clienteNombre = v.cliente_id ? clientePorId.get(v.cliente_id) : null;
    const clienteSuffix = clienteNombre ? ` (${clienteNombre})` : "";
    return { id: v.id, etiqueta: `${partes}${patente}${clienteSuffix}` };
  });

  function mapearOpciones(globalRes: any, empresaRes: any) {
    const globales = (globalRes?.data ?? []) as ServicioRow[];
    const empresas = (empresaRes?.data ?? []) as ServicioRow[];
    return [
      ...globales.map((r) => ({ id: r.id, nombre: r.nombre ?? "(sin nombre)", origen: "global" as const })),
      ...empresas.map((r) => ({ id: r.id, nombre: r.nombre ?? "(sin nombre)", origen: "empresa" as const })),
    ];
  }

  const servicioOpciones = mapearOpciones(servGlobalRes, servEmpresaRes);
  const productoOpciones = mapearOpciones(prodGlobalRes, prodEmpresaRes);

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-6">
        <Link href="/ordenes" className="text-sm text-gray-600 hover:text-black underline">← Volver a órdenes</Link>
        <h1 className="text-3xl font-bold mt-2">Nueva orden</h1>
      </header>

      {vehiculos.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center space-y-3">
          <p className="text-gray-600">Necesitás cargar al menos un vehículo antes de crear órdenes.</p>
          <Link href="/vehiculos/nuevo" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 inline-block">
            Crear vehículo
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <NuevaOrdenClient vehiculos={vehiculos} servicioOpciones={servicioOpciones} productoOpciones={productoOpciones} vehiculoIdInicial={vehiculoIdInicial} />
        </div>
      )}
    </div>
  );
}