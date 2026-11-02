-- Migración 023: Revocar cleanup_rate_limit de authenticated
-- Ref: `supabase db advisors --type security` ejecutado el 2026-11-02.
--
-- cleanup_rate_limit es una función de mantenimiento que solo debería
-- ser llamada desde un cron/service_role. Ningún usuario logueado la necesita.
--
-- NO se revoca actualizar_stock de authenticated porque es un trigger que se
-- ejecuta cuando un usuario logueado crea/edita una orden con productos.
-- Su WARN queda aceptado como deuda técnica (ver ADR-009).

revoke execute on function public.cleanup_rate_limit() from authenticated;