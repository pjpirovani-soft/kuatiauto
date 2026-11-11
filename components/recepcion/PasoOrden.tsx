'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconArrowLeft,
  IconPlus,
  IconTrash,
  IconLoader2,
  IconCheck,
} from '@tabler/icons-react';
import { crearOrden } from '@/lib/ordenes-actions';
import type {
  ClienteRecepcion,
  VehiculoRecepcion,
  ServicioRecepcion,
  ProductoRecepcion,
} from '@/app/(dashboard)/recepcion/page';

type Props = {
  cliente: ClienteRecepcion;
  vehiculo: VehiculoRecepcion;
  servicios: ServicioRecepcion[];
  productos: ProductoRecepcion[];
  onVolver: () => void;
  onCompletado: () => void;
};

type LineaServicio = {
  key: string;
  servicio: ServicioRecepcion;
  precio: string;
};

type LineaProducto = {
  key: string;
  producto: ProductoRecepcion;
  cantidad: string;
  precio: string;
};

export default function PasoOrden({
  cliente,
  vehiculo,
  servicios,
  productos,
  onVolver,
  onCompletado,
}: Props) {
  const router = useRouter();
  const [kmServicio, setKmServicio] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [proximoFecha, setProximoFecha] = useState('');
  const [proximoKm, setProximoKm] = useState('');
  const [fechaTocada, setFechaTocada] = useState(false);
  const [kmTocado, setKmTocado] = useState(false);


  const [lineasServicio, setLineasServicio] = useState<LineaServicio[]>([]);
  const [lineasProducto, setLineasProducto] = useState<LineaProducto[]>([]);

  // Autocompletado (debe estar después de las declaraciones de lineasServicio y lineasProducto)
  useEffect(() => {
    if (lineasServicio.length === 0) return;
    const ultimoServicio = lineasServicio[lineasServicio.length - 1];
    if (ultimoServicio.servicio.origen !== 'global') return;

    const intervaloKm = ultimoServicio.servicio.intervalo_km_sugerido;
    const intervaloMeses = ultimoServicio.servicio.intervalo_meses_sugerido;

    if (intervaloKm && !kmTocado) {
      const nuevoKm = Number(kmServicio || 0) + Number(intervaloKm);
      setProximoKm(String(nuevoKm));
    }

    if (intervaloMeses && !fechaTocada) {
      const base = new Date(); // Usa fecha actual
      base.setUTCMonth(base.getUTCMonth() + Number(intervaloMeses));
      const nuevaFecha = base.toISOString().slice(0, 10);
      setProximoFecha(nuevaFecha);
    }
  }, [lineasServicio, kmServicio, kmTocado, fechaTocada]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [ordenCreada, setOrdenCreada] = useState<{ id: string } | null>(null);

  function agregarServicio() {
    if (servicios.length === 0) return;
    const primero = servicios[0];
    setLineasServicio((prev) => [
      ...prev,
      {
        key: crypto.randomUUID(),
        servicio: primero,
        precio: primero.precio != null ? String(primero.precio) : '',
      },
    ]);
  }

  function agregarProducto() {
    if (productos.length === 0) return;
    const primero = productos[0];
    setLineasProducto((prev) => [
      ...prev,
      {
        key: crypto.randomUUID(),
        producto: primero,
        cantidad: '1',
        precio: primero.precio != null ? String(primero.precio) : '',
      },
    ]);
  }

  function actualizarServicio(key: string, patch: Partial<LineaServicio>) {
    setLineasServicio((prev) =>
      prev.map((l) => (l.key === key ? { ...l, ...patch } : l)),
    );
  }

  function actualizarProducto(key: string, patch: Partial<LineaProducto>) {
    setLineasProducto((prev) =>
      prev.map((l) => (l.key === key ? { ...l, ...patch } : l)),
    );
  }

  function quitarServicio(key: string) {
    setLineasServicio((prev) => prev.filter((l) => l.key !== key));
  }

  function quitarProducto(key: string) {
    setLineasProducto((prev) => prev.filter((l) => l.key !== key));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const serviciosPayload = lineasServicio.map((l) => ({
      servicio_global_id: l.servicio.origen === 'global' ? l.servicio.id : undefined,
      servicio_empresa_id: l.servicio.origen === 'empresa' ? l.servicio.id : undefined,
      precio: l.precio || undefined,
    }));

    const productosPayload = lineasProducto.map((l) => ({
      producto_global_id: l.producto.origen === 'global' ? l.producto.id : undefined,
      producto_empresa_id: l.producto.origen === 'empresa' ? l.producto.id : undefined,
      cantidad: l.cantidad || '1',
      precio_unitario: l.precio || undefined,
    }));

    const payload = {
      vehiculo_id: vehiculo.id,
      km_servicio: kmServicio,
      servicios: serviciosPayload,
      productos: productosPayload,
      observaciones: observaciones || null,
      proximo_mantenimiento_fecha: proximoFecha || null,
      proximo_mantenimiento_km: proximoKm ? Number(proximoKm) : null,
    };

    const res = await crearOrden(payload);
    setPending(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }

    setOrdenCreada({ id: res.data.id });
  }

  if (ordenCreada) {
    return (
      <div className='bg-kuati-blanco rounded-xl border border-kuati-borde p-6 md:p-8 shadow-sm text-center space-y-4'>
        <div className='w-16 h-16 bg-kuati-lima/20 rounded-full flex items-center justify-center mx-auto'>
          <IconCheck size={32} className='text-kuati-petroleo' />
        </div>
        <div>
          <h2 className='text-2xl font-bold text-kuati-petroleo'>Orden creada</h2>
          <p className='text-kuati-grafito/70 text-sm mt-1'>
            Cliente: {cliente.nombre}
          </p>
        </div>
        <div className='flex flex-col sm:flex-row gap-3 justify-center pt-2'>
          <button
            type='button'
            onClick={() => router.push('/ordenes/' + ordenCreada.id)}
            className='inline-flex items-center justify-center gap-2 bg-kuati-petroleo text-kuati-blanco px-6 py-2.5 rounded-lg font-semibold hover:bg-kuati-petroleo/90 transition-colors'
          >
            Ver orden
          </button>
          <button
            type='button'
            onClick={onCompletado}
            className='inline-flex items-center justify-center gap-2 border border-kuati-borde text-kuati-grafito px-6 py-2.5 rounded-lg font-semibold hover:bg-kuati-fondo transition-colors'
          >
            Nueva recepción
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className='bg-kuati-blanco rounded-xl border border-kuati-borde p-6 md:p-8 shadow-sm space-y-6'
    >
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-kuati-petroleo'>Paso 3: Servicio</h2>
        <button
          type='button'
          onClick={onVolver}
          className='inline-flex items-center gap-1 text-sm text-kuati-grafito/60 hover:text-kuati-petroleo transition-colors'
        >
          <IconArrowLeft size={16} /> Volver
        </button>
      </div>

      <div className='bg-kuati-fondo rounded-lg p-3 text-sm text-kuati-grafito/70 space-y-1'>
        <p><span className='font-semibold'>Cliente:</span> {cliente.nombre}</p>
        <p>
          <span className='font-semibold'>Vehículo:</span> {vehiculo.marca ?? '—'}{' '}
          {vehiculo.modelo ?? '—'}
          {vehiculo.patente ? ` (${vehiculo.patente})` : ''}
        </p>
      </div>

      <div>
        <label htmlFor='km_servicio' className='block text-sm font-semibold text-kuati-grafito mb-1.5'>
          Kilometraje actual *
        </label>
        <input
          id='km_servicio'
          type='number'
          min={0}
          required
          value={kmServicio}
          onChange={(e) => setKmServicio(e.target.value)}
          placeholder='120000'
          className='w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-petroleo focus:border-transparent transition-all'
        />
      </div>

      {/* Sección Próximo Mantenimiento */}
      <div className='bg-kuati-fondo rounded-xl border border-kuati-borde p-6 md:p-8 shadow-sm'>
        <div className='flex items-center gap-2 mb-4'>
          <h2 className='text-xl font-bold text-kuati-petroleo'>Próximo mantenimiento</h2>
          <span className='text-xs font-semibold text-kuati-petroleo/60 bg-kuati-petroleo/10 px-2 py-1 rounded'>Sugerido</span>
        </div>
        <p className='text-sm text-kuati-grafito/60 mb-4'>Se completa automáticamente al agregar un servicio. Podés modificarlo si el cliente lo pide.</p>
        
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-semibold text-kuati-grafito mb-1.5'>Fecha</label>
            <input
              type='date'
              className='w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-petroleo focus:border-transparent transition-all'
              value={proximoFecha}
              onChange={(e) => {
                setProximoFecha(e.target.value);
                setFechaTocada(true);
              }}
            />
          </div>
          
          <div>
            <label className='block text-sm font-semibold text-kuati-grafito mb-1.5'>Kilometraje</label>
            <input
              type='number'
              min='0'
              step='1'
              className='w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-petroleo focus:border-transparent transition-all'
              value={proximoKm}
              onChange={(e) => {
                setProximoKm(e.target.value);
                setKmTocado(true);
              }}
              placeholder='Ej. 15000'
            />
          </div>
        </div>
      </div>

      <section>
        <div className='flex items-center justify-between mb-2'>
          <h3 className='font-semibold text-kuati-grafito'>Servicios</h3>
          <button
            type='button'
            onClick={agregarServicio}
            disabled={servicios.length === 0}
            className='inline-flex items-center gap-1 text-sm text-kuati-petroleo hover:underline disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <IconPlus size={16} /> Agregar servicio
          </button>
        </div>
        {lineasServicio.length === 0 ? (
          <p className='text-sm text-kuati-grafito/60 italic'>
            Sin servicios agregados (opcional).
          </p>
        ) : (
          <ul className='space-y-2'>
            {lineasServicio.map((l) => (
              <li key={l.key} className='flex flex-col sm:flex-row gap-2 items-stretch'>
                <select
                  value={l.servicio.id + ':' + l.servicio.origen}
                  onChange={(e) => {
                    const [id, origen] = e.target.value.split(':');
                    const found = servicios.find((s) => s.id === id && s.origen === origen);
                    if (found) actualizarServicio(l.key, { servicio: found });
                  }}
                  className='flex-1 border border-kuati-borde rounded-lg px-3 py-2 text-sm'
                >
                  {servicios.map((s) => (
                    <option key={s.origen + ':' + s.id} value={s.id + ':' + s.origen}>
                      {s.nombre} {s.origen === 'empresa' ? '(propio)' : ''}
                    </option>
                  ))}
                </select>
                <input
                  type='number'
                  step='0.01'
                  min={0}
                  value={l.precio}
                  onChange={(e) => actualizarServicio(l.key, { precio: e.target.value })}
                  placeholder='Precio'
                  className='w-32 border border-kuati-borde rounded-lg px-3 py-2 text-sm'
                />
                <button
                  type='button'
                  onClick={() => quitarServicio(l.key)}
                  className='text-red-600 hover:bg-red-50 rounded-lg p-2'
                  aria-label='Quitar servicio'
                >
                  <IconTrash size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className='flex items-center justify-between mb-2'>
          <h3 className='font-semibold text-kuati-grafito'>Productos</h3>
          <button
            type='button'
            onClick={agregarProducto}
            disabled={productos.length === 0}
            className='inline-flex items-center gap-1 text-sm text-kuati-petroleo hover:underline disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <IconPlus size={16} /> Agregar producto
          </button>
        </div>
        {lineasProducto.length === 0 ? (
          <p className='text-sm text-kuati-grafito/60 italic'>
            Sin productos agregados (opcional).
          </p>
        ) : (
          <ul className='space-y-2'>
            {lineasProducto.map((l) => (
              <li key={l.key} className='flex flex-col sm:flex-row gap-2 items-stretch'>
                <select
                  value={l.producto.id + ':' + l.producto.origen}
                  onChange={(e) => {
                    const [id, origen] = e.target.value.split(':');
                    const found = productos.find((p) => p.id === id && p.origen === origen);
                    if (found) actualizarProducto(l.key, { producto: found });
                  }}
                  className='flex-1 border border-kuati-borde rounded-lg px-3 py-2 text-sm'
                >
                  {productos.map((p) => (
                    <option key={p.origen + ':' + p.id} value={p.id + ':' + p.origen}>
                      {p.nombre} {p.origen === 'empresa' ? '(propio)' : ''}
                    </option>
                  ))}
                </select>
                <input
                  type='number'
                  step='0.01'
                  min={0}
                  value={l.cantidad}
                  onChange={(e) => actualizarProducto(l.key, { cantidad: e.target.value })}
                  placeholder='Cant.'
                  className='w-20 border border-kuati-borde rounded-lg px-3 py-2 text-sm'
                />
                <input
                  type='number'
                  step='0.01'
                  min={0}
                  value={l.precio}
                  onChange={(e) => actualizarProducto(l.key, { precio: e.target.value })}
                  placeholder='Precio unit.'
                  className='w-32 border border-kuati-borde rounded-lg px-3 py-2 text-sm'
                />
                <button
                  type='button'
                  onClick={() => quitarProducto(l.key)}
                  className='text-red-600 hover:bg-red-50 rounded-lg p-2'
                  aria-label='Quitar producto'
                >
                  <IconTrash size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div>
        <label htmlFor='observaciones' className='block text-sm font-semibold text-kuati-grafito mb-1.5'>
          Observaciones
        </label>
        <textarea
          id='observaciones'
          rows={3}
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          maxLength={1000}
          placeholder='Detalles del trabajo...'
          className='w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-petroleo focus:border-transparent transition-all min-h-[100px] resize-y'
        />
      </div>

      {error && (
        <div className='text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3'>{error}</div>
      )}

      <div className='flex flex-col sm:flex-row gap-3 pt-2'>
        <button
          type='submit'
          disabled={pending}
          className='w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-kuati-petroleo text-kuati-blanco px-6 py-2.5 rounded-lg font-semibold hover:bg-kuati-petroleo/90 disabled:opacity-70 transition-colors'
        >
          {pending && <IconLoader2 size={18} className='animate-spin' />}
          {pending ? 'Creando orden...' : 'Crear orden'}
        </button>
      </div>
    </form>
  );
}