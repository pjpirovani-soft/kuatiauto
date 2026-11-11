import Link from 'next/link';
import { IconChartBar, IconUsers, IconBox, IconTool, IconArrowLeft } from '@tabler/icons-react';
import {
  obtenerVentasMensuales,
  obtenerProductividadMecanicos,
  obtenerTopProductos,
  obtenerTopServicios,
} from '@/lib/reportes-actions';

function formatearGs(n: number): string {
  return 'Gs. ' + n.toLocaleString('es-PY');
}

export default async function ReportesPage() {
  const [ventas, productividad, topProductos, topServicios] = await Promise.all([
    obtenerVentasMensuales(),
    obtenerProductividadMecanicos(),
    obtenerTopProductos(),
    obtenerTopServicios(),
  ]);

  return (
    <div className='max-w-6xl mx-auto space-y-8'>
      <header>
        <Link href='/dashboard' className='inline-flex items-center gap-1 text-sm text-kuati-grafito/60 hover:text-kuati-petroleo transition-colors mb-2'>
          <IconArrowLeft size={16} /> Volver al panel
        </Link>
        <h1 className='text-3xl font-bold text-kuati-petroleo'>Reportes</h1>
        <p className='text-kuati-grafito/70 text-sm mt-1'>Métricas de tu lubricentro.</p>
      </header>

      {/* Ventas Mensuales */}
      <section className='bg-kuati-blanco rounded-xl border border-kuati-borde p-6 shadow-sm'>
        <h2 className='text-xl font-bold text-kuati-petroleo mb-4 flex items-center gap-2'>
          <IconChartBar size={20} /> Ventas mensuales
        </h2>
        {ventas.ok && ventas.data.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead className='bg-kuati-fondo border-b border-kuati-borde'>
                <tr>
                  <th className='px-4 py-3 text-left font-semibold'>Mes</th>
                  <th className='px-4 py-3 text-right font-semibold'>Órdenes</th>
                  <th className='px-4 py-3 text-right font-semibold'>Total facturado</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-kuati-borde'>
                {ventas.data.map((v) => (
                  <tr key={v.mes}>
                    <td className='px-4 py-2 font-mono'>{v.mes}</td>
                    <td className='px-4 py-2 text-right'>{v.cantidad}</td>
                    <td className='px-4 py-2 text-right font-semibold text-kuati-petroleo'>{formatearGs(v.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className='text-sm text-kuati-grafito/60'>No hay ventas registradas todavía.</p>
        )}
      </section>

      {/* Productividad por Mecánico */}
      <section className='bg-kuati-blanco rounded-xl border border-kuati-borde p-6 shadow-sm'>
        <h2 className='text-xl font-bold text-kuati-petroleo mb-4 flex items-center gap-2'>
          <IconUsers size={20} /> Productividad por mecánico
        </h2>
        {productividad.ok && productividad.data.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead className='bg-kuati-fondo border-b border-kuati-borde'>
                <tr>
                  <th className='px-4 py-3 text-left font-semibold'>Mecánico</th>
                  <th className='px-4 py-3 text-right font-semibold'>Órdenes completadas</th>
                  <th className='px-4 py-3 text-right font-semibold'>Total facturado</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-kuati-borde'>
                {productividad.data.map((p) => (
                  <tr key={p.nombre}>
                    <td className='px-4 py-2 font-medium'>{p.nombre}</td>
                    <td className='px-4 py-2 text-right'>{p.completadas}</td>
                    <td className='px-4 py-2 text-right font-semibold text-kuati-petroleo'>{formatearGs(p.total_facturado)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className='text-sm text-kuati-grafito/60'>No hay órdenes con mecánico asignado todavía.</p>
        )}
      </section>

      {/* Top Productos + Top Servicios */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <section className='bg-kuati-blanco rounded-xl border border-kuati-borde p-6 shadow-sm'>
          <h2 className='text-xl font-bold text-kuati-petroleo mb-4 flex items-center gap-2'>
            <IconBox size={20} /> Top 5 productos
          </h2>
          {topProductos.ok && topProductos.data.length > 0 ? (
            <ul className='space-y-2'>
              {topProductos.data.map((p, i) => (
                <li key={p.nombre} className='flex items-center justify-between text-sm border-b border-kuati-borde pb-2'>
                  <span className='flex items-center gap-2'>
                    <span className='font-bold text-kuati-lima'>{i + 1}.</span>
                    <span>{p.nombre}</span>
                  </span>
                  <span className='text-kuati-grafito/70 font-semibold'>{p.cantidad} u.</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-sm text-kuati-grafito/60'>No hay productos vendidos todavía.</p>
          )}
        </section>

        <section className='bg-kuati-blanco rounded-xl border border-kuati-borde p-6 shadow-sm'>
          <h2 className='text-xl font-bold text-kuati-petroleo mb-4 flex items-center gap-2'>
            <IconTool size={20} /> Top 5 servicios
          </h2>
          {topServicios.ok && topServicios.data.length > 0 ? (
            <ul className='space-y-2'>
              {topServicios.data.map((s, i) => (
                <li key={s.nombre} className='flex items-center justify-between text-sm border-b border-kuati-borde pb-2'>
                  <span className='flex items-center gap-2'>
                    <span className='font-bold text-kuati-lima'>{i + 1}.</span>
                    <span>{s.nombre}</span>
                  </span>
                  <span className='text-kuati-grafito/70 font-semibold'>{s.cantidad} vece(s)</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-sm text-kuati-grafito/60'>No hay servicios realizados todavía.</p>
          )}
        </section>
      </div>
    </div>
  );
}