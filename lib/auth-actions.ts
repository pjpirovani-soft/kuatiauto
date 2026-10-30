'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { checkRateLimit, buildClave } from '@/lib/rate-limit';

const authSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
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
  redirect('/dashboard');
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
