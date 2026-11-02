-- Migración 022: Fix de Advisors de Seguridad (WARN)
-- Ref: `supabase db advisors --type security` ejecutado el 2026-11-02.
--
-- 1. set_updated_at: agregar search_path fijo (lint 0011).
-- 2. Revocar EXECUTE de anon en funciones internas que NO se llaman
--    desde flujos anónimos (login, register, reset SÍ usan check_rate_limit
--    como anon, por eso NO se revoca).
--
-- NOTA: check_rate_limit NO se revoca de anon porque auth-actions.ts lo llama
-- antes de signInWithPassword/signUp (usuario aún no autenticado).

-- 1. Fix set_updated_at (search_path mutable)
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 2. Revocar EXECUTE de anon en funciones internas (seguras)
revoke execute on function public.cleanup_rate_limit() from anon;
revoke execute on function public.actualizar_stock() from anon;
revoke execute on function public.crear_empresa_con_establecimiento(text, text, text, text) from anon;

-- Revocar también de PUBLIC (por si el grant original fue a PUBLIC)
revoke execute on function public.cleanup_rate_limit() from public;
revoke execute on function public.actualizar_stock() from public;
revoke execute on function public.crear_empresa_con_establecimiento(text, text, text, text) from public;