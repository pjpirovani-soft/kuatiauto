import { IconCheck } from '@tabler/icons-react';
import type { Step } from './RecepcionWizard';

type Props = {
  paso: Step;
};

const PASOS: { num: Step; label: string }[] = [
  { num: 1, label: 'Cliente' },
  { num: 2, label: 'Vehículo' },
  { num: 3, label: 'Servicio' },
];

export default function PasoIndicador({ paso }: Props) {
  return (
    <div className='bg-kuati-blanco rounded-xl border border-kuati-borde p-4 shadow-sm'>
      <ol className='flex items-center justify-between gap-2'>
        {PASOS.map((p, idx) => {
          const completado = paso > p.num;
          const actual = paso === p.num;
          return (
            <li key={p.num} className='flex items-center gap-2 flex-1'>
              <div
                className={[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors shrink-0',
                  completado
                    ? 'bg-kuati-lima text-kuati-petroleo'
                    : actual
                      ? 'bg-kuati-petroleo text-kuati-blanco'
                      : 'bg-kuati-fondo text-kuati-grafito/50 border border-kuati-borde',
                ].join(' ')}
              >
                {completado ? <IconCheck size={16} /> : p.num}
              </div>
              <span
                className={[
                  'text-sm font-medium transition-colors',
                  actual ? 'text-kuati-petroleo' : 'text-kuati-grafito/60',
                ].join(' ')}
              >
                {p.label}
              </span>
              {idx < PASOS.length - 1 && (
                <div
                  className={[
                    'h-0.5 flex-1 mx-2 rounded transition-colors',
                    paso > p.num ? 'bg-kuati-lima' : 'bg-kuati-borde',
                  ].join(' ')}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}