import Link from 'next/link';
import { listarProductosEmpresa } from '@/lib/productos-empresa-actions';
import { IconPlus, IconArrowLeft, IconBox, IconAlertTriangle } from '@tabler/icons-react';

type ProductoRow = {
  id: string;
  nombre: string;
  marca: string | null;
  tipo: string | null;
  viscosidad: string | null;
  unidad: string;
  stock_actual: number;
  stock_minimo: number;
};

export default async function ProductosPage() {
  const res = await listarProductosEmpresa();
  const productos: ProductoRow[] = res.ok ? (res.data as ProductoRow[]) : [];

  return (
    <div className='max-w-5xl mx-auto'>
      <header className='flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4'>
        <div>
          <Link href='/catalogo' className='inline-flex items-center gap-1 text-sm text-kuati-grafito/60 hover:text-kuati-petroleo transition-colors mb-2'>
            <IconArrowLeft size={16} /> Volver al catálogo
          </Link>
          <h1 className='text-3xl font-bold text-kuati-petroleo'>Productos</h1>
        </div>
        <Link 
          href='/catalogo/productos/nuevo' 
          className='inline-flex items-center justify-center gap-2 bg-kuati-petroleo text-kuati-blanco px-4 py-2 rounded-lg hover:bg-kuati-petroleo/90 text-sm font-semibold transition-colors shadow-md'
        >
          <IconPlus size={18} />
          Nuevo producto
        </Link>
      </header>

      {productos.length === 0 ? (
        <div className='bg-kuati-blanco rounded-xl border border-kuati-borde p-12 text-center text-kuati-grafito/70 shadow-sm space-y-4'>
          <p>Todavía no cargaste productos propios. Los productos globales siguen disponibles en las órdenes.</p>
          <Link href='/catalogo/productos/nuevo' className='inline-flex items-center gap-2 bg-kuati-petroleo text-kuati-blanco px-6 py-2 rounded-lg hover:bg-kuati-petroleo/90 transition-colors'>
            Crear el primero
          </Link>
        </div>
      ) : (
        <>
          {/* VISTA ESCRITORIO: Tabla */}
          <div className='hidden md:block bg-kuati-blanco rounded-xl border border-kuati-borde overflow-hidden shadow-sm'>
            <table className='w-full text-sm text-left'>
              <thead className='bg-kuati-fondo text-kuati-grafito border-b border-kuati-borde'>
                <tr>
                  <th className='px-6 py-4 font-semibold'>Nombre</th>
                  <th className='px-6 py-4 font-semibold'>Marca / Tipo</th>
                  <th className='px-6 py-4 font-semibold'>Visc.</th>
                  <th className='px-6 py-4 font-semibold'>Unidad</th>
                  <th className='px-6 py-4 font-semibold'>Stock</th>
                  <th className='px-6 py-4 font-semibold text-right'>Acción</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-kuati-borde'>
                {productos.map((p) => {
                  const bajo = p.stock_actual <= p.stock_minimo;
                  return (
                    <tr key={p.id} className='hover:bg-kuati-fondo/50 transition-colors'>
                      <td className='px-6 py-4 font-medium text-kuati-petroleo'>{p.nombre}</td>
                      <td className='px-6 py-4 text-kuati-grafito/80'>
                        {p.marca ?? '—'} {p.tipo ? `(${p.tipo})` : ''}
                      </td>
                      <td className='px-6 py-4 text-kuati-grafito/80'>{p.viscosidad ?? '—'}</td>
                      <td className='px-6 py-4 text-kuati-grafito/80'>{p.unidad}</td>
                      <td className='px-6 py-4'>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border ${bajo ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                          {bajo && <IconAlertTriangle size={12} />}
                          {p.stock_actual} / min {p.stock_minimo}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <Link href={`/catalogo/productos/${p.id}`} className='text-kuati-petroleo font-semibold hover:text-kuati-lima transition-colors text-sm'>
                          Editar
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
            {productos.map((p) => {
              const bajo = p.stock_actual <= p.stock_minimo;
              return (
                <div key={p.id} className='bg-kuati-blanco rounded-xl border border-kuati-borde p-5 shadow-sm flex flex-col gap-3'>
                  <div className='flex items-center justify-between border-b border-kuati-borde pb-3'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-kuati-petroleo/5 rounded-full flex items-center justify-center text-kuati-petroleo'>
                        <IconBox size={20} />
                      </div>
                      <h3 className='font-bold text-kuati-petroleo text-lg'>{p.nombre}</h3>
                    </div>
                  </div>
                  
                  <div className='grid grid-cols-2 gap-2 text-sm text-kuati-grafito/80'>
                    <p>Marca: <span className='font-medium text-kuati-petroleo'>{p.marca ?? '—'}</span></p>
                    <p>Tipo: <span className='font-medium text-kuati-petroleo'>{p.tipo ?? '—'}</span></p>
                    <p>Visc: <span className='font-medium text-kuati-petroleo'>{p.viscosidad ?? '—'}</span></p>
                    <p>Unidad: <span className='font-medium text-kuati-petroleo'>{p.unidad}</span></p>
                  </div>

                  <div className={`p-2 rounded-lg text-sm font-medium flex items-center gap-2 ${bajo ? 'bg-red-50 text-red-700' : 'bg-kuati-fondo text-kuati-grafito'}`}>
                    {bajo && <IconAlertTriangle size={16} />}
                    Stock: {p.stock_actual} (Mínimo: {p.stock_minimo})
                  </div>

                  <div className='pt-2 flex justify-end'>
                    <Link 
                      href={`/catalogo/productos/${p.id}`} 
                      className='text-kuati-petroleo font-bold text-sm bg-kuati-fondo px-4 py-2 rounded-lg hover:bg-kuati-borde transition-colors'
                    >
                      Editar producto
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
