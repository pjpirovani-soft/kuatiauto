-- 018_establecimiento_publico.sql
-- E4a: endurecer GRANT de anon en establecimiento_publico.
-- Hallazgo H-E4a-1: anon tenia GRANT ALL (INSERT/UPDATE/DELETE) sin justificacion.
-- RLS ya bloquea escritura, pero se aplica menor privilegio (D-F4-2).

revoke all on establecimiento_publico from anon;
grant select on establecimiento_publico to anon;
