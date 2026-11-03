'use client';

import { useActionState } from 'react';
import { actualizarNombre, cambiarPassword, type ActionResult } from '@/lib/perfil-actions';

type FormState = ActionResult | null;

async function nombreAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return actualizarNombre(String(formData.get('nombre') ?? ''));
}

async function passwordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const actual = String(formData.get('passwordActual') ?? '');
  const nueva = String(formData.get('passwordNueva') ?? '');
  const confirmar = String(formData.get('passwordConfirmar') ?? '');
  if (nueva !== confirmar) {
    return { ok: false, error: 'Las contraseñas nuevas no coinciden' };
  }
  return cambiarPassword(actual, nueva);
}

function Feedback({ state }: { state: FormState }) {
  if (!state) return null;
  if (state.ok) {
    return (
      <p className='text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2'>
        Guardado correctamente.
      </p>
    );
  }
  return (
    <p className='text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2'>
      {state.error}
    </p>
  );
}

export default function PerfilForm({ nombreInicial }: { nombreInicial: string }) {
  const [nombreState, nombreFormAction, nombrePending] = useActionState(nombreAction, null);
  const [passState, passFormAction, passPending] = useActionState(passwordAction, null);

  return (
    <div className='space-y-6'>
      <form
        action={nombreFormAction}
        className='bg-kuati-blanco rounded-xl border border-kuati-borde p-6 md:p-8 shadow-sm space-y-4'
      >
        <h2 className='text-sm font-semibold uppercase tracking-wide text-kuati-grafito/50'>
          Nombre
        </h2>
        <div>
          <label htmlFor='nombre' className='block text-sm font-medium text-kuati-grafito mb-1'>
            Nombre completo
          </label>
          <input
            id='nombre'
            name='nombre'
            type='text'
            defaultValue={nombreInicial}
            required
            minLength={2}
            maxLength={80}
            disabled={nombrePending}
            className='w-full px-3 py-2 border border-kuati-borde rounded-md focus:outline-none focus:ring-2 focus:ring-kuati-lima disabled:bg-gray-50'
          />
        </div>
        <Feedback state={nombreState} />
        <div className='flex justify-end'>
          <button
            type='submit'
            disabled={nombrePending}
            className='px-4 py-2 bg-kuati-petroleo text-kuati-blanco rounded-md hover:bg-kuati-petroleo/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            {nombrePending ? 'Guardando...' : 'Guardar nombre'}
          </button>
        </div>
      </form>

      <form
        action={passFormAction}
        className='bg-kuati-blanco rounded-xl border border-kuati-borde p-6 md:p-8 shadow-sm space-y-4'
      >
        <h2 className='text-sm font-semibold uppercase tracking-wide text-kuati-grafito/50'>
          Contraseña
        </h2>
        <div>
          <label
            htmlFor='passwordActual'
            className='block text-sm font-medium text-kuati-grafito mb-1'
          >
            Contraseña actual
          </label>
          <input
            id='passwordActual'
            name='passwordActual'
            type='password'
            required
            autoComplete='current-password'
            disabled={passPending}
            className='w-full px-3 py-2 border border-kuati-borde rounded-md focus:outline-none focus:ring-2 focus:ring-kuati-lima disabled:bg-gray-50'
          />
        </div>
        <div>
          <label
            htmlFor='passwordNueva'
            className='block text-sm font-medium text-kuati-grafito mb-1'
          >
            Contraseña nueva (mín. 8 caracteres)
          </label>
          <input
            id='passwordNueva'
            name='passwordNueva'
            type='password'
            required
            minLength={8}
            maxLength={72}
            autoComplete='new-password'
            disabled={passPending}
            className='w-full px-3 py-2 border border-kuati-borde rounded-md focus:outline-none focus:ring-2 focus:ring-kuati-lima disabled:bg-gray-50'
          />
        </div>
        <div>
          <label
            htmlFor='passwordConfirmar'
            className='block text-sm font-medium text-kuati-grafito mb-1'
          >
            Confirmar contraseña nueva
          </label>
          <input
            id='passwordConfirmar'
            name='passwordConfirmar'
            type='password'
            required
            minLength={8}
            maxLength={72}
            autoComplete='new-password'
            disabled={passPending}
            className='w-full px-3 py-2 border border-kuati-borde rounded-md focus:outline-none focus:ring-2 focus:ring-kuati-lima disabled:bg-gray-50'
          />
        </div>
        <Feedback state={passState} />
        <div className='flex justify-end'>
          <button
            type='submit'
            disabled={passPending}
            className='px-4 py-2 bg-kuati-petroleo text-kuati-blanco rounded-md hover:bg-kuati-petroleo/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            {passPending ? 'Cambiando...' : 'Cambiar contraseña'}
          </button>
        </div>
      </form>
    </div>
  );
}