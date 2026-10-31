import Link from "next/link";
import { listarOrdenesEmpresa } from "@/lib/ordenes-actions";
import { listarVehiculosEmpresa } from "@/lib/vehiculos-actions";
import { listarClientes } from "@/lib/clientes-actions";

type OrdenRow = {
  id: string;
  vehiculo_id: string;
  fecha: string;
  km_servicio: number;
  observaciones: string | null;
  importe_total: number | null;
  estado: string;
  created_at: string;
};

type VehiculoRow = {
  id: string;
  marca: string | null;
  modelo: string | null;
  patente: string | null;
  cliente_id: string | null;
};

type ClienteRow = { id: string; nombre: string | null };

function badgeEstado(estado: string): string {
  switch (estado) {
    case "borrador": return "bg-gray-100 text-gray-800";
    case "en_curso": return "bg-blue-100 text-blue-800";
    case "completada": return "bg-green-100 text-green-800";
    case "anulada": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

export default async function OrdenesPage() {
  const [ordenesRes, vehRes, cliRes] = await Promise.all([
    listarOrdenesEmpresa(),
    listarVehiculosEmpresa(),
    listarClientes(),
  ]);

  const ordenes: OrdenRow[] = ordenesRes.ok ? (ordenesRes.data as OrdenRow[]) : [];
  const vehiculos: VehiculoRow[] = vehRes.ok ? (vehRes.data as VehiculoRow[]) : [];
  const clientes: ClienteRow[] = cliRes.ok ? (cliRes.data as ClienteRow[]) : [];

  const clientePorId = new Map(clientes.map((c) => [c.id, c.nombre ?? "(sin nombre)"]));
  const etiquetaPorVehiculo = new Map(
    vehiculos.map((v) => {
      const partes = [v.marca, v.modelo].filter(Boolean).join(" ") || "(vehículo)";
      const patente = v.patente ? ` — ${v.patente}` : "";
      const clienteNombre = v.cliente_id ? clientePorId.get(v.cliente_id) : null;
      const clienteSuffix = clienteNombre ? ` (${clienteNombre})` : "";
      return [v.id, `${partes}${patente}${clienteSuffix}`];
    }),
  );

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-black underline">← Panel</Link>
          <h1 className="text-3xl font-bold mt-2">Órdenes</h1>
        </div>
        <Link href="/ordenes/nuevo" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          Nueva orden
        </Link>
      </header>

      {ordenes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center space-y-3">
          <p className="text-gray-600">Todavía no hay órdenes cargadas.</p>
          <Link href="/ordenes/nuevo" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 inline-block">
            Crear la primera orden
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Fecha</th>
                <th className="px-4 py-2 font-medium">Vehículo</th>
                <th className="px-4 py-2 font-medium">Km</th>
                <th className="px-4 py-2 font-medium">Estado</th>
                <th className="px-4 py-2 font-medium">Importe</th>
                <th className="px-4 py-2 font-medium">Observaciones</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((o) => {
                const vehEtiqueta = etiquetaPorVehiculo.get(o.vehiculo_id) ?? "(vehículo desconocido)";
                const obs = o.observaciones && o.observaciones.length > 60
                  ? o.observaciones.slice(0, 60) + "…"
                  : (o.observaciones ?? "");
                return (
                  <tr key={o.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 font-mono">{o.fecha}</td>
                    <td className="px-4 py-2">{vehEtiqueta}</td>
                    <td className="px-4 py-2">{o.km_servicio}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono ${badgeEstado(o.estado)}`}>
                        {o.estado}
                      </span>
                    </td>
                    <td className="px-4 py-2">{o.importe_total !== null ? `$${o.importe_total.toFixed(2)}` : "—"}</td>
                    <td className="px-4 py-2 text-gray-600">{obs}</td>
                    <td className="px-4 py-2 text-right">
                      <Link href={`/ordenes/${o.id}`} className="text-blue-600 hover:underline">Ver</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}