'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IconCalendar, IconCar, IconCash, IconRoad } from '@tabler/icons-react';
import SwipeableCard from './SwipeableCard';
import { completarOrden, anularOrden } from '@/lib/ordenes-actions';

type Props = {
  orden: {
    id: string;
    fecha: string;
    estado: string;
    numero_orden: number | null;
    km_servicio: number;
    importe_total: number | null;
    vehiculo_id: string;
  };
  vehEtiqueta: string;
};

function badgeEstado(estado: string): string {
  switch (estado) {
    case "borrador": return "bg-gray-100 text-gray-700 border-gray-200";
    case "en_curso": return "bg-blue-50 text-blue-700 border-blue-200";
    case "completada": return "bg-kuati-lima/20 text-kuati-petroleo border-kuati-lima/50";
    case "anulada": return "bg-red-50 text-red-700 border-red-200";
    default: return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

export default function TarjetaOrdenSwipeable({ orden, vehEtiqueta }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCompletar = () => {
    if (!confirm('¿Marcar esta orden como completada?')) return;
    startTransition(async () => {
      const res = await completarOrden({ id: orden.id });
      if (!res.ok) alert(res.error);
      else router.refresh();
    });
  };

  const handleAnular = () => {
    if (!confirm('¿Anular esta orden?')) return;
    startTransition(async () => {
      const res = await anularOrden({ id: orden.id, motivo: null });
      if (!res.ok) alert(res.error);
      else router.refresh();
    });
  };

  return (
    <SwipeableCard
      leftAction={{
        label: 'Completar',
        color: 'bg-green-600',
        onAction: handleCompletar,
      }}
      rightAction={{
        label: 'Anular',
        color: 'bg-amber-600',
        onAction: handleAnular,
      }}
    >
      <div className='p-5 flex flex-col gap-3'>
        <div className='flex items-center justify-between border-b border-kuati-borde pb-3'>
          <div className='flex items-center gap-2 text-kuati-grafito font-mono font-semibold'>
            <span className='text-kuati-petroleo font-bold'>#{String(orden.numero_orden ?? 0).padStart(4, '0')}</span>
            <span className='text-kuati-grafito/50'>·</span>
            <IconCalendar size={16} className='text-kuati-grafito/50' aria-hidden='true' />
            {orden.fecha}
          </div>
          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${badgeEstado(orden.estado)}`}>
            {orden.estado.replace('_', ' ')}
          </span>
        </div>

        <div className='space-y-1.5 text-sm text-kuati-grafito/80'>
          <p className='flex items-center gap-2'>
            <IconCar size={16} className='text-kuati-grafito/50' aria-hidden='true' />
            <span className='font-medium text-kuati-petroleo'>{vehEtiqueta}</span>
          </p>
          <p className='flex items-center gap-2'>
            <IconRoad size={16} className='text-kuati-grafito/50' aria-hidden='true' />
            {orden.km_servicio.toLocaleString('es-PY')} km
          </p>
          <p className='flex items-center gap-2'>
            <IconCash size={16} className='text-kuati-grafito/50' aria-hidden='true' />
            {orden.importe_total !== null ? `Gs. ${orden.importe_total.toLocaleString('es-PY')}` : 'Sin importe'}
          </p>
        </div>

        <div className='pt-2 flex justify-end'>
          <Link
            href={`/ordenes/${orden.id}`}
            className='btn-press text-kuati-petroleo font-bold text-sm bg-kuati-fondo px-4 py-2 rounded-lg hover:bg-kuati-borde transition-colors'
          >
            Ver orden
          </Link>
        </div>
      </div>
    </SwipeableCard>
  );
}