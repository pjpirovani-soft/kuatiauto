'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const ROLES_VALIDOS = ['propietario', 'conductor', 'admin_general', 'empleado'] as const;
export type Rol = (typeof ROLES_VALIDOS)[number];

export type Perfil = {
  id: string;
  email: string;
  nombre: string;
  rol: Rol;
  empresa_id: string | null;
};

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Lee el perfil del usuario autenticado.
 * - email: de auth.getUser() (fuente unica, no de usuario.email redundante)
 * - nombre/rol/empresa_id: de tabla usuario
 * - Devuelve null si no hay sesion (la page redirige a /login)
 */
export async function obtenerPerfil(): Promise<Perfil | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: usuario } = await supabase
    .from('usuario')
    .select('nombre, rol, empresa_id')
    .eq('id', user.id)
    .maybeSingle();

  const rolRaw = (usuario?.rol as string | undefined) ?? 'empleado';
  const rol: Rol = (ROLES_VALIDOS as readonly string[]).includes(rolRaw)
    ? (rolRaw as Rol)
    : 'empleado';

  return {
    id: user.id,
    email: user.email ?? '',
    nombre: (usuario?.nombre as string | null) ?? '',
    rol,
    empresa_id: (usuario?.empresa_id as string | null) ?? null,
  };
}

const nombreSchema = z
  .string()
  .trim()
  .min(2, 'El nombre debe tener al menos 2 caracteres')
  .max(80, 'El nombre no puede superar 80 caracteres');

export async function actualizarNombre(nombre: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'No autenticado' };

  const parsed = nombreSchema.safeParse(nombre);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from('usuario')
    .update({ nombre: parsed.data })
    .eq('id', user.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath('/perfil');
  revalidatePath('/', 'layout');
  return { ok: true };
}

const passwordSchema = z
  .string()
  .min(8, 'La contraseña nueva debe tener al menos 8 caracteres')
  .max(72, 'La contraseña no puede superar 72 caracteres');

export async function cambiarPassword(
  passwordActual: string,
  passwordNueva: string,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'No autenticado' };
  if (!user.email) return { ok: false, error: 'Usuario sin email' };

  const parsed = passwordSchema.safeParse(passwordNueva);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  if (passwordActual === passwordNueva) {
    return { ok: false, error: 'La contraseña nueva debe ser distinta a la actual' };
  }

  const { error: reAuthError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: passwordActual,
  });
  if (reAuthError) {
    return { ok: false, error: 'La contraseña actual no es correcta' };
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data });
  if (error) return { ok: false, error: error.message };

  return { ok: true };
}