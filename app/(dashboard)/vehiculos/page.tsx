import Link from 'next/link';
import { listarVehiculosEmpresa } from '@/lib/vehiculos-actions';

type Vehiculo = {
  id: string;
  marca: string;
  modelo: string;
  anio: number | null;
  patente: string | null;
  km_actual: number | null;
};

export default async function VehiculosPage() {
  const res = await listarVehiculosEmpresa();
  const vehiculos: Vehiculo[] = res.ok ? (res.data as Vehiculo[]) : [];

  return (
    <div className="max-w-4xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Vehículos</h1>
        <Link
          href="/vehiculos/nuevo"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Nuevo vehículo
        </Link>
      </header>

      {!res.ok && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">
          {res.error}
        </div>
      )}

      {vehiculos.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-600">
          Todavía no hay vehículos cargados.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3">Vehículo</th>
                <th className="px-4 py-3">Año</th>
                <th className="px-4 py-3">Patente</th>
                <th className="px-4 py-3">Km</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {vehiculos.map((v) => (
                <tr key={v.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium">
                    {v.marca} {v.modelo}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{v.anio ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{v.patente ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {v.km_actual != null ? v.km_actual.toLocaleString('es-PY') : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/vehiculos/${v.id}`}
                      className="text-gray-600 hover:text-black underline"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}