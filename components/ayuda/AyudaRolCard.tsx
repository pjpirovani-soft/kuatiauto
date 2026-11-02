import Link from 'next/link';
import { IconBuildingStore, IconCar, IconShieldCheck, IconArrowRight } from '@tabler/icons-react';
import type { AyudaRolCardData } from '@/lib/ayuda/types';

const ICONS = {
  propietario: IconBuildingStore,
  conductor: IconCar,
  admin: IconShieldCheck,
};

type Props = {
  data: AyudaRolCardData;
};

export default function AyudaRolCard({ data }: Props) {
  const Icon = ICONS[data.icon];
  const destacado = data.destacado;
  return (
    <Link
      href={data.href}
      className={[
        'group block rounded-xl border p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg',
        destacado
          ? 'bg-kuati-petroleo text-kuati-blanco border-kuati-petroleo shadow-md'
          : 'bg-kuati-blanco text-kuati-grafito border-kuati-borde shadow-sm',
      ].join(' ')}
    >
      <div
        className={[
          'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
          destacado ? 'bg-kuati-blanco/20' : 'bg-kuati-lima/20',
        ].join(' ')}
      >
        <Icon size={24} className={destacado ? 'text-kuati-lima' : 'text-kuati-petroleo'} />
      </div>

      <h3 className={'text-xl font-bold mb-2 ' + (destacado ? 'text-kuati-blanco' : 'text-kuati-petroleo')}>
        {data.titulo}
      </h3>

      <p
        className={
          'text-sm leading-relaxed mb-4 ' +
          (destacado ? 'text-kuati-blanco/80' : 'text-kuati-grafito/70')
        }
      >
        {data.descripcion}
      </p>

      <span
        className={
          'inline-flex items-center gap-1 text-sm font-semibold transition-transform group-hover:translate-x-1 ' +
          (destacado ? 'text-kuati-lima' : 'text-kuati-petroleo')
        }
      >
        Ver guía
        <IconArrowRight size={16} />
      </span>
    </Link>
  );
}