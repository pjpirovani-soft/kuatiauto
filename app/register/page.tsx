'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/brand/Logo';
import { register } from '@/lib/auth-actions';
import { IconEye, IconEyeOff, IconLoader2 } from '@tabler/icons-react';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const result = await register(formData);
    if (result?.error) setError(result.error);
    if (result?.success) setSuccess(result.success);
    setLoading(false);
  }

  return (
    <main className='min-h-screen flex items-center justify-center bg-kuati-petroleo p-4'>
      <div className='w-full max-w-md bg-kuati-blanco rounded-xl shadow-xl p-8 border border-kuati-borde'>
        <div className='text-center mb-8'>
          <Logo variant='horizontal' theme='light' priority className='h-12 w-auto mx-auto mb-4' />
          <h1 className='text-3xl font-bold text-kuati-petroleo mb-2'>Crear cuenta</h1>
          <p className='text-kuati-grafito/70'>Registrate para gestionar tu lubricentro.</p>
        </div>

        <form action={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-semibold text-kuati-grafito mb-1.5' htmlFor='nombre'>
              Nombre
            </label>
            <input
              id='nombre'
              name='nombre'
              type='text'
              required
              maxLength={100}
              className='w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all'
              placeholder='Tu nombre completo'
            />
          </div>
          <div>
            <label className='block text-sm font-semibold text-kuati-grafito mb-1.5' htmlFor='email'>
              Email
            </label>
            <input
              id='email'
              name='email'
              type='email'
              required
              className='w-full border border-kuati-borde rounded-lg px-4 py-2.5 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all'
              placeholder='tu@email.com'
            />
          </div>
          <div>
            <label className='block text-sm font-semibold text-kuati-grafito mb-1.5' htmlFor='password'>
              Contraseña
            </label>
            <div className='relative'>
              <input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                className='w-full border border-kuati-borde rounded-lg px-4 py-2.5 pr-10 text-kuati-grafito focus:outline-none focus:ring-2 focus:ring-kuati-lima focus:border-transparent transition-all'
                placeholder='••••••••'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-kuati-grafito/50 hover:text-kuati-grafito transition-colors'
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
              </button>
            </div>
            <p className='text-xs text-kuati-grafito/50 mt-1'>Mínimo 6 caracteres.</p>
          </div>

          {error && <p className='text-red-600 text-sm font-medium'>{error}</p>}
          {success && <p className='text-green-700 text-sm font-medium'>{success}</p>}

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-kuati-petroleo text-kuati-blanco font-semibold py-2.5 rounded-lg hover:bg-kuati-petroleo/90 disabled:opacity-70 transition-colors flex items-center justify-center gap-2'
          >
            {loading && <IconLoader2 size={18} className='animate-spin' />}
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className='text-sm text-center text-kuati-grafito/70 mt-6'>
          ¿Ya tenés cuenta?{' '}
          <Link href='/login' className='text-kuati-petroleo font-semibold hover:underline'>
            Iniciá sesión
          </Link>
        </p>
      </div>
    </main>
  );
}


