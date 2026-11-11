import Link from "next/link";
import { notFound } from "next/navigation";
import EditarOrdenClient from "@/components/EditarOrdenClient";
import BotonImprimir from "@/components/BotonImprimir";
import { obtenerOrden } from "@/lib/ordenes-actions";
import { listarVehiculosEmpresa } from "@/lib/vehiculos-actions";
import { listarClientes } from "@/lib/clientes-actions";
import { listarEmpleadosEmpresa } from "@/lib/empleados-actions";
import { createClient } from "@/lib/supabase/server";

type OrdenRow = {
  id: string;
  vehiculo_id: string;
  fecha: string;
  km_servicio: number;
  observaciones: string | null;
  estado: string;
  importe_total: number | null;
  proximo_mantenimiento_fecha: string | null;
  proximo_mantenimiento_km: number | null;
  numero_orden: number | null;
  orden_servicio: {
    id: string;
    servicio_global_id: string | null;
    servicio_empresa_id: string | null;
    precio: number | null;
  }[];
  orden_producto: {
    id: string;
    producto_global_id: string | null;
    producto_empresa_id: string | null;
    cantidad: number;
    precio_unitario: number | null;
  }[];
};

type VehiculoRow = {
  id: string;
  marca: string | null;
  modelo: string | null;
  patente: string | null;
  cliente_id: string | null;
};

type ClienteRow = { id: string; nombre: string | null };
type CatalogoRow = { id: string; nombre: string | null; intervalo_km_sugerido?: number | null; intervalo_meses_sugerido?: number | null };

function precioStr(n: number | null): string {
  return n === null || n === undefined ? "" : String(n);
}

export default async function OrdenDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const ordenRes = await obtenerOrden({ id });
  if (!ordenRes.ok) notFound();
  const orden = ordenRes.data as OrdenRow;
  if (!orden) notFound();

  const supabase = await createClient();

  const servGlobalIds = Array.from(new Set(orden.orden_servicio.map((s) => s.servicio_global_id).filter(Boolean) as string[]));
  const servEmpresaIds = Array.from(new Set(orden.orden_servicio.map((s) => s.servicio_empresa_id).filter(Boolean) as string[]));
  const prodGlobalIds = Array.from(new Set(orden.orden_producto.map((p) => p.producto_global_id).filter(Boolean) as string[]));
  const prodEmpresaIds = Array.from(new Set(orden.orden_producto.map((p) => p.producto_empresa_id).filter(Boolean) as string[]));

  const [vehRes, cliRes, empRes, servGlobalRes, servEmpresaRes, prodGlobalRes, prodEmpresaRes] = await Promise.all([
    listarVehiculosEmpresa(),
    listarClientes(),
    listarEmpleadosEmpresa(),
    supabase.from("servicio_global").select("id, nombre, intervalo_km_sugerido, intervalo_meses_sugerido"),
    supabase.from("servicio_empresa").select("id, nombre"),
    supabase.from("producto_global").select("id, nombre"),
    supabase.from("producto_empresa").select("id, nombre"),
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

  function mapearOpciones(globalData: CatalogoRow[], empresaData: CatalogoRow[]) {
    return [
      ...globalData.map((r) => ({ id: r.id, nombre: r.nombre ?? "(sin nombre)", origen: "global" as const })),
      ...empresaData.map((r) => ({ id: r.id, nombre: r.nombre ?? "(sin nombre)", origen: "empresa" as const })),
    ];
  }

  const servicioOpciones = mapearOpciones(
    (servGlobalRes?.data ?? []) as CatalogoRow[],
    (servEmpresaRes?.data ?? []) as CatalogoRow[],
  );
  const productoOpciones = mapearOpciones(
    (prodGlobalRes?.data ?? []) as CatalogoRow[],
    (prodEmpresaRes?.data ?? []) as CatalogoRow[],
  );

  const initialData = {
    id: orden.id,
    vehiculo_id: orden.vehiculo_id,
    fecha: orden.fecha,
    km_servicio: String(orden.km_servicio),
    observaciones: orden.observaciones ?? "",
    estado: orden.estado,
    servicios: orden.orden_servicio.map((s, i) => ({
      key: `s-${i}-${s.id}`,
      servicio_global_id: s.servicio_global_id,
      servicio_empresa_id: s.servicio_empresa_id,
      precio: precioStr(s.precio),
    })),
    productos: orden.orden_producto.map((p, i) => ({
      key: `p-${i}-${p.id}`,
      producto_global_id: p.producto_global_id,
      producto_empresa_id: p.producto_empresa_id,
      cantidad: String(p.cantidad),
      precio_unitario: precioStr(p.precio_unitario),
    })),
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-6">
        <Link href="/ordenes" className="text-sm text-gray-600 hover:text-black underline">← Volver a órdenes</Link>
        <h1 className="text-3xl font-bold mt-2">Orden #{String(orden.numero_orden ?? 0).padStart(4, "0")}</h1>
        <p className="text-sm text-gray-600">
          Estado: <span className="font-mono">{orden.estado}</span>
          {orden.importe_total !== null && (
            <> · Importe total: ${orden.importe_total.toFixed(2)}</>
          )}
          {orden.proximo_mantenimiento_fecha && (
            <> · Próximo mantenimiento: {orden.proximo_mantenimiento_fecha}</>
          )}
          {orden.proximo_mantenimiento_km !== null && (
            <> · {orden.proximo_mantenimiento_km} km</>
          )}
        </p>
      </header>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <EditarOrdenClient
          id={orden.id}
          estado={orden.estado}
          initialData={initialData}
          vehiculos={vehiculos}
          servicioOpciones={servicioOpciones}
          productoOpciones={productoOpciones}
        />
      </div>
    </div>
  );
}
