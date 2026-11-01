'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { checkRateLimit, buildClave } from '@/lib/rate-limit';

const authSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  nombre: z.string().max(100, 'El nombre no puede superar 100 caracteres').optional(),
});

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = Object.fromEntries(formData);
  const parsed = authSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const rl = await checkRateLimit({ clave: buildClave(['login', parsed.data.email]), max: 5, ventanaSegundos: 60 });
  if (!rl.ok) return { error: 'Demasiados intentos. Intentá de nuevo en ' + rl.retryAfterSeconds + 's.' };

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) return { error: error.message };

  revalidatePath('/', 'layout');
  
  // Redirigir según el rol del usuario
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: usuario } = await supabase
      .from('usuario')
      .select('rol, empresa_id')
      .eq('id', user.id)
      .maybeSingle();
    if (usuario?.rol === 'admin_general') {
      redirect('/admin');
    }
    const { data: conductor } = await supabase.from('conductor').select('id').eq('id', user.id).maybeSingle();
    if (conductor) {
      redirect('/mi-garage');
    }
    if (!usuario?.empresa_id) {
      redirect('/crear-empresa');
    }
  }
  
  redirect('/clientes');
}

export async function register(formData: FormData) {
  const supabase = await createClient();

  const data = Object.fromEntries(formData);
  const parsed = authSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const rl = await checkRateLimit({ clave: buildClave(['register', parsed.data.email]), max: 3, ventanaSegundos: 60 });
  if (!rl.ok) return { error: 'Demasiados intentos. Intentá de nuevo en ' + rl.retryAfterSeconds + 's.' };

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) return { error: error.message };

  return { success: 'Revisa tu email para confirmar la cuenta (si esta habilitado).' };
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const data = Object.fromEntries(formData);
  const emailSchema = z.object({ email: z.string().email('Email inválido') });
  const parsed = emailSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const rl = await checkRateLimit({ clave: buildClave(['reset', parsed.data.email]), max: 3, ventanaSegundos: 60 });
  if (!rl.ok) return { error: 'Demasiados intentos. Intentá de nuevo en ' + rl.retryAfterSeconds + 's.' };
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/login` : undefined,
  });
  if (error) return { error: error.message };
  return { success: 'Revisá tu email para restablecer la contraseña.' };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

export async function registerConductor(formData: FormData) {
  const supabase = await createClient();
  const data = Object.fromEntries(formData);
  const parsed = authSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const rl = await checkRateLimit({ clave: buildClave(['register_conductor', parsed.data.email]), max: 3, ventanaSegundos: 60 });
  if (!rl.ok) return { error: 'Demasiados intentos. Intentá de nuevo en ' + rl.retryAfterSeconds + 's.' };
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { tipo: 'conductor', nombre: parsed.data.nombre } }
  });
  if (error) return { error: error.message };
  return { success: 'Revisa tu email para confirmar la cuenta.' };
}