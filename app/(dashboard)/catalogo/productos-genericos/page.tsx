import Link from 'next/link';
import { listarProductosGenericos } from '@/lib/genericos-actions';
import { IconArrowLeft, IconBox } from '@tabler/icons-react';

export default async function ProductosGenericosPage() {
  const res = await listarProductosGenericos();
  const productos = res.ok ? res.data : [];

  return (
    <div className='max-w-4xl mx-auto'>
      <header className='mb-6'>
        <Link href='/catalogo' className='inline-flex items-center gap-1 text-sm text-kuati-grafito/60 hover:text-kuati-petroleo transition-colors mb-2'>
          <IconArrowLeft size={16} /> Volver al catálogo
        </Link>
        <h1 className='text-3xl font-bold text-kuati-petroleo flex items-center gap-2'>
          Productos genéricos
          <span className='text-sm bg-kuati-petroleo/10 text-kuati-petroleo px-2 py-1 rounded'>[G]</span>
        </h1>
        <p className='text-kuati-grafito/70 text-sm mt-1'>
          Los productos estándar de KuatiAuto. No podés editarlos, pero podés usarlos en tus órdenes.
        </p>
      </header>

      {productos.length === 0 ? (
        <div className='bg-kuati-blanco rounded-xl border border-kuati-borde p-8 text-center'>
          <p className='text-kuati-grafito/60'>No hay productos genéricos cargados todavía.</p>
        </div>
      ) : (
        <div className='bg-kuati-blanco rounded-xl border border-kuati-borde overflow-hidden shadow-sm'>
          <table className='w-full text-sm text-left'>
            <thead className='bg-kuati-fondo text-kuati-grafito border-b border-kuati-borde'>
              <tr>
                <th className='px-6 py-4 font-semibold'>Nombre</th>
                <th className='px-6 py-4 font-semibold'>Marca</th>
                <th className='px-6 py-4 font-semibold'>Tipo</th>
                <th className='px-6 py-4 font-semibold'>Viscosidad</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-kuati-borde'>
              {productos.map((p) => (
                <tr key={p.id} className='hover:bg-kuati-fondo/50 transition-colors'>
                  <td className='px-6 py-4 font-medium text-kuati-petroleo'>
                    <span className='text-xs text-kuati-petroleo/60 mr-2'>[G]</span>
                    {p.nombre}
                  </td>
                  <td className='px-6 py-4 text-kuati-grafito/80'>{p.marca ?? '—'}</td>
                  <td className='px-6 py-4 text-kuati-grafito/80'>{p.tipo ?? '—'}</td>
                  <td className='px-6 py-4 text-kuati-grafito/80'>{p.viscosidad ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}