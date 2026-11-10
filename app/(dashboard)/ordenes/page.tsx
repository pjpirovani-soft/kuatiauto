import Link from "next/link";
import { listarOrdenesEmpresa } from "@/lib/ordenes-actions";
import { listarVehiculosEmpresa } from "@/lib/vehiculos-actions";
import { listarClientes } from "@/lib/clientes-actions";
import { IconPlus, IconCar, IconCalendar, IconCash, IconRoad } from '@tabler/icons-react';

type OrdenRow = {
  id: string;
  vehiculo_id: string;
  fecha: string;
  km_servicio: number;
  observaciones: string | null;
  importe_total: number | null;
  estado: string;
  created_at: string;
  numero_orden: number | null;
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
    case "borrador": return "bg-gray-100 text-gray-700 border-gray-200";
    case "en_curso": return "bg-blue-50 text-blue-700 border-blue-200";
    case "completada": return "bg-kuati-lima/20 text-kuati-petroleo border-kuati-lima/50";
    case "anulada": return "bg-red-50 text-red-700 border-red-200";
    default: return "bg-gray-100 text-gray-700 border-gray-200";
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
    <div className='max-w-6xl mx-auto'>
      <header className='flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-kuati-petroleo'>Órdenes</h1>
        </div>
        <Link 
          href='/ordenes/nuevo' 
          className='inline-flex items-center justify-center gap-2 bg-kuati-petroleo text-kuati-blanco px-4 py-2 rounded-lg hover:bg-kuati-petroleo/90 text-sm font-semibold transition-colors shadow-md'
        >
          <IconPlus size={18} />
          Nueva orden
        </Link>
      </header>

      {ordenes.length === 0 ? (
        <div className='bg-kuati-blanco rounded-xl border border-kuati-borde p-12 text-center space-y-4 shadow-sm'>
          <p className='text-kuati-grafito/70'>Todavía no hay órdenes cargadas.</p>
          <Link href='/ordenes/nuevo' className='inline-flex items-center gap-2 bg-kuati-petroleo text-kuati-blanco px-6 py-2 rounded-lg hover:bg-kuati-petroleo/90 transition-colors'>
            Crear la primera orden
          </Link>
        </div>
      ) : (
        <>
          {/* VISTA ESCRITORIO: Tabla */}
          <div className='hidden md:block bg-kuati-blanco rounded-xl border border-kuati-borde overflow-hidden shadow-sm'>
            <table className='w-full text-sm text-left'>
              <thead className='bg-kuati-fondo text-kuati-grafito border-b border-kuati-borde'>
                <tr>
                  <th className='px-6 py-4 font-semibold'>Nº</th>
                  <th className='px-6 py-4 font-semibold'>Fecha</th>
                  <th className='px-6 py-4 font-semibold'>Vehículo</th>
                  <th className='px-6 py-4 font-semibold'>Km</th>
                  <th className='px-6 py-4 font-semibold'>Estado</th>
                  <th className='px-6 py-4 font-semibold'>Importe</th>
                  <th className='px-6 py-4 font-semibold text-right'>Acción</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-kuati-borde'>
                {ordenes.map((o) => {
                  const vehEtiqueta = etiquetaPorVehiculo.get(o.vehiculo_id) ?? "(vehículo desconocido)";
                  return (
                    <tr key={o.id} className='hover:bg-kuati-fondo/50 transition-colors'>
                      <td className='px-6 py-4 font-mono font-bold text-kuati-petroleo'>#{String(o.numero_orden ?? 0).padStart(4, '0')}</td>
                      <td className='px-6 py-4 font-mono text-kuati-grafito'>{o.fecha}</td>
                      <td className='px-6 py-4 text-kuati-grafito'>{vehEtiqueta}</td>
                      <td className='px-6 py-4 text-kuati-grafito'>{o.km_servicio.toLocaleString('es-PY')}</td>
                      <td className='px-6 py-4'>
                        <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold border ${badgeEstado(o.estado)}`}>
                          {o.estado.replace('_', ' ')}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-kuati-grafito'>{o.importe_total !== null ? `Gs. ${o.importe_total.toLocaleString('es-PY')}` : '—'}</td>
                      <td className='px-6 py-4 text-right'>
                        <Link href={`/ordenes/${o.id}`} className='text-kuati-petroleo font-semibold hover:text-kuati-lima transition-colors text-sm'>
                          Ver
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* VISTA CELULAR: Tarjetas */}
          <div className='grid md:hidden gap-4'>
            {ordenes.map((o) => {
              const vehEtiqueta = etiquetaPorVehiculo.get(o.vehiculo_id) ?? "(vehículo desconocido)";
              return (
                <div key={o.id} className='bg-kuati-blanco rounded-xl border border-kuati-borde p-5 shadow-sm flex flex-col gap-3'>
                  <div className='flex items-center justify-between border-b border-kuati-borde pb-3'>
                    <div className='flex items-center gap-2 text-kuati-grafito font-mono font-semibold'>
                      <span className='text-kuati-petroleo font-bold'>#{String(o.numero_orden ?? 0).padStart(4, '0')}</span>
                      <span className='text-kuati-grafito/50'>·</span>
                      <IconCalendar size={16} className='text-kuati-grafito/50' />
                      {o.fecha}
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${badgeEstado(o.estado)}`}>
                      {o.estado.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className='space-y-1.5 text-sm text-kuati-grafito/80'>
                    <p className='flex items-center gap-2'>
                      <IconCar size={16} className='text-kuati-grafito/50' />
                      <span className='font-medium text-kuati-petroleo'>{vehEtiqueta}</span>
                    </p>
                    <p className='flex items-center gap-2'>
                      <IconRoad size={16} className='text-kuati-grafito/50' />
                      {o.km_servicio.toLocaleString('es-PY')} km
                    </p>
                    <p className='flex items-center gap-2'>
                      <IconCash size={16} className='text-kuati-grafito/50' />
                      {o.importe_total !== null ? `Gs. ${o.importe_total.toLocaleString('es-PY')}` : 'Sin importe'}
                    </p>
                  </div>
                  
                  <div className='pt-2 flex justify-end'>
                    <Link 
                      href={`/ordenes/${o.id}`} 
                      className='text-kuati-petroleo font-bold text-sm bg-kuati-fondo px-4 py-2 rounded-lg hover:bg-kuati-borde transition-colors'
                    >
                      Ver orden
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
