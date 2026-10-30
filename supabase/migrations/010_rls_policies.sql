-- 010_rls_policies.sql
-- F5c: Row Level Security en todas las tablas.
-- Las políticas implementan el modelo de F3 (ARCHITECTURE.md sección Multiempresa).

-- Helper: obtener empresa_id del usuario actual.
create or replace function current_empresa_id()
returns uuid
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select empresa_id from usuario where id = auth.uid();
$$;

-- Helper: verificar si el usuario es admin_general.
create or replace function is_admin_general()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (select 1 from usuario where id = auth.uid() and rol = 'admin_general');
$$;

-- ============================================================
-- EMPRESA
-- ============================================================
alter table empresa enable row level security;

drop policy if exists empresa_select on empresa;
create policy empresa_select on empresa for select
  using (id = current_empresa_id() or is_admin_general());

drop policy if exists empresa_update on empresa;
create policy empresa_update on empresa for update
  using (id = current_empresa_id() or is_admin_general());

-- INSERT solo vía función SECURITY DEFINER (crear_empresa_con_establecimiento).
-- DELETE solo admin_general (soft delete = update activa=false).
drop policy if exists empresa_delete on empresa;
create policy empresa_delete on empresa for delete
  using (is_admin_general());

-- ============================================================
-- ESTABLECIMIENTO
-- ============================================================
alter table establecimiento enable row level security;

drop policy if exists establecimiento_select on establecimiento;
create policy establecimiento_select on establecimiento for select
  using (empresa_id = current_empresa_id());

drop policy if exists establecimiento_insert on establecimiento;
create policy establecimiento_insert on establecimiento for insert
  with check (empresa_id = current_empresa_id());

drop policy if exists establecimiento_update on establecimiento;
create policy establecimiento_update on establecimiento for update
  using (empresa_id = current_empresa_id());

drop policy if exists establecimiento_delete on establecimiento;
create policy establecimiento_delete on establecimiento for delete
  using (empresa_id = current_empresa_id());

-- ============================================================
-- USUARIO
-- ============================================================
alter table usuario enable row level security;

drop policy if exists usuario_select on usuario;
create policy usuario_select on usuario for select
  using (id = auth.uid() or empresa_id = current_empresa_id() or is_admin_general());

drop policy if exists usuario_update on usuario;
create policy usuario_update on usuario for update
  using (id = auth.uid() or empresa_id = current_empresa_id());

-- INSERT vía trigger handle_new_user (SECURITY DEFINER).
drop policy if exists usuario_delete on usuario;
create policy usuario_delete on usuario for delete
  using (is_admin_general());

-- ============================================================
-- CLIENTE
-- ============================================================
alter table cliente enable row level security;

drop policy if exists cliente_select on cliente;
create policy cliente_select on cliente for select
  using (empresa_id = current_empresa_id());

drop policy if exists cliente_insert on cliente;
create policy cliente_insert on cliente for insert
  with check (empresa_id = current_empresa_id());

drop policy if exists cliente_update on cliente;
create policy cliente_update on cliente for update
  using (empresa_id = current_empresa_id());

drop policy if exists cliente_delete on cliente;
create policy cliente_delete on cliente for delete
  using (empresa_id = current_empresa_id());

-- ============================================================
-- VEHICULO
-- ============================================================
alter table vehiculo enable row level security;

drop policy if exists vehiculo_select on vehiculo;
create policy vehiculo_select on vehiculo for select
  using (empresa_id = current_empresa_id());

drop policy if exists vehiculo_insert on vehiculo;
create policy vehiculo_insert on vehiculo for insert
  with check (empresa_id = current_empresa_id());

drop policy if exists vehiculo_update on vehiculo;
create policy vehiculo_update on vehiculo for update
  using (empresa_id = current_empresa_id());

drop policy if exists vehiculo_delete on vehiculo;
create policy vehiculo_delete on vehiculo for delete
  using (empresa_id = current_empresa_id());

-- Vehiculo_identidad: acceso vía join con vehiculo (hereda RLS del vehiculo).
alter table vehiculo_identidad enable row level security;

drop policy if exists vehiculo_identidad_select on vehiculo_identidad;
create policy vehiculo_identidad_select on vehiculo_identidad for select
  using (exists (select 1 from vehiculo where vehiculo.id = vehiculo_identidad.vehiculo_id and vehiculo.empresa_id = current_empresa_id()));

-- ============================================================
-- ORDEN_TRABAJO
-- ============================================================
alter table orden_trabajo enable row level security;

drop policy if exists orden_trabajo_select on orden_trabajo;
create policy orden_trabajo_select on orden_trabajo for select
  using (empresa_id = current_empresa_id());

drop policy if exists orden_trabajo_insert on orden_trabajo;
create policy orden_trabajo_insert on orden_trabajo for insert
  with check (empresa_id = current_empresa_id());

drop policy if exists orden_trabajo_update on orden_trabajo;
create policy orden_trabajo_update on orden_trabajo for update
  using (empresa_id = current_empresa_id());

drop policy if exists orden_trabajo_delete on orden_trabajo;
create policy orden_trabajo_delete on orden_trabajo for delete
  using (empresa_id = current_empresa_id());

-- ============================================================
-- ORDEN_SERVICIO
-- ============================================================
alter table orden_servicio enable row level security;

drop policy if exists orden_servicio_select on orden_servicio;
create policy orden_servicio_select on orden_servicio for select
  using (exists (select 1 from orden_trabajo where orden_trabajo.id = orden_servicio.orden_id and orden_trabajo.empresa_id = current_empresa_id()));

drop policy if exists orden_servicio_insert on orden_servicio;
create policy orden_servicio_insert on orden_servicio for insert
  with check (exists (select 1 from orden_trabajo where orden_trabajo.id = orden_servicio.orden_id and orden_trabajo.empresa_id = current_empresa_id()));

drop policy if exists orden_servicio_delete on orden_servicio;
create policy orden_servicio_delete on orden_servicio for delete
  using (exists (select 1 from orden_trabajo where orden_trabajo.id = orden_servicio.orden_id and orden_trabajo.empresa_id = current_empresa_id()));

-- ============================================================
-- ORDEN_PRODUCTO
-- ============================================================
alter table orden_producto enable row level security;

drop policy if exists orden_producto_select on orden_producto;
create policy orden_producto_select on orden_producto for select
  using (exists (select 1 from orden_trabajo where orden_trabajo.id = orden_producto.orden_id and orden_trabajo.empresa_id = current_empresa_id()));

drop policy if exists orden_producto_insert on orden_producto;
create policy orden_producto_insert on orden_producto for insert
  with check (exists (select 1 from orden_trabajo where orden_trabajo.id = orden_producto.orden_id and orden_trabajo.empresa_id = current_empresa_id()));

drop policy if exists orden_producto_delete on orden_producto;
create policy orden_producto_delete on orden_producto for delete
  using (exists (select 1 from orden_trabajo where orden_trabajo.id = orden_producto.orden_id and orden_trabajo.empresa_id = current_empresa_id()));

-- ============================================================
-- PRODUCTO_EMPRESA
-- ============================================================
alter table producto_empresa enable row level security;

drop policy if exists producto_empresa_select on producto_empresa;
create policy producto_empresa_select on producto_empresa for select
  using (empresa_id = current_empresa_id());

drop policy if exists producto_empresa_insert on producto_empresa;
create policy producto_empresa_insert on producto_empresa for insert
  with check (empresa_id = current_empresa_id());

drop policy if exists producto_empresa_update on producto_empresa;
create policy producto_empresa_update on producto_empresa for update
  using (empresa_id = current_empresa_id());

drop policy if exists producto_empresa_delete on producto_empresa;
create policy producto_empresa_delete on producto_empresa for delete
  using (empresa_id = current_empresa_id());

-- ============================================================
-- STOCK_MOVIMIENTO
-- ============================================================
alter table stock_movimiento enable row level security;

drop policy if exists stock_movimiento_select on stock_movimiento;
create policy stock_movimiento_select on stock_movimiento for select
  using (empresa_id = current_empresa_id());

drop policy if exists stock_movimiento_insert on stock_movimiento;
create policy stock_movimiento_insert on stock_movimiento for insert
  with check (empresa_id = current_empresa_id());

drop policy if exists stock_movimiento_delete on stock_movimiento;
create policy stock_movimiento_delete on stock_movimiento for delete
  using (empresa_id = current_empresa_id());

-- ============================================================
-- CATÁLOGO GLOBAL (lectura para todos, escritura solo admin_general)
-- ============================================================
alter table fabricante enable row level security;
drop policy if exists fabricante_select on fabricante;
create policy fabricante_select on fabricante for select using (true);
drop policy if exists fabricante_all_admin on fabricante;
create policy fabricante_all_admin on fabricante for all using (is_admin_general()) with check (is_admin_general());

alter table marca enable row level security;
drop policy if exists marca_select on marca;
create policy marca_select on marca for select using (true);
drop policy if exists marca_all_admin on marca;
create policy marca_all_admin on marca for all using (is_admin_general()) with check (is_admin_general());

alter table modelo enable row level security;
drop policy if exists modelo_select on modelo;
create policy modelo_select on modelo for select using (true);
drop policy if exists modelo_all_admin on modelo;
create policy modelo_all_admin on modelo for all using (is_admin_general()) with check (is_admin_general());

alter table version enable row level security;
drop policy if exists version_select on version;
create policy version_select on version for select using (true);
drop policy if exists version_all_admin on version;
create policy version_all_admin on version for all using (is_admin_general()) with check (is_admin_general());

alter table motorizacion enable row level security;
drop policy if exists motorizacion_select on motorizacion;
create policy motorizacion_select on motorizacion for select using (true);
drop policy if exists motorizacion_all_admin on motorizacion;
create policy motorizacion_all_admin on motorizacion for all using (is_admin_general()) with check (is_admin_general());

alter table especificacion_lubricante enable row level security;
drop policy if exists especificacion_select on especificacion_lubricante;
create policy especificacion_select on especificacion_lubricante for select using (true);
drop policy if exists especificacion_all_admin on especificacion_lubricante;
create policy especificacion_all_admin on especificacion_lubricante for all using (is_admin_general()) with check (is_admin_general());

alter table servicio_global enable row level security;
drop policy if exists servicio_global_select on servicio_global;
create policy servicio_global_select on servicio_global for select using (true);
drop policy if exists servicio_global_all_admin on servicio_global;
create policy servicio_global_all_admin on servicio_global for all using (is_admin_general()) with check (is_admin_general());

alter table producto_global enable row level security;
drop policy if exists producto_global_select on producto_global;
create policy producto_global_select on producto_global for select using (true);
drop policy if exists producto_global_all_admin on producto_global;
create policy producto_global_all_admin on producto_global for all using (is_admin_general()) with check (is_admin_general());

-- ============================================================
-- SERVICIO_EMPRESA (por empresa)
-- ============================================================
alter table servicio_empresa enable row level security;

drop policy if exists servicio_empresa_select on servicio_empresa;
create policy servicio_empresa_select on servicio_empresa for select
  using (empresa_id = current_empresa_id());

drop policy if exists servicio_empresa_insert on servicio_empresa;
create policy servicio_empresa_insert on servicio_empresa for insert
  with check (empresa_id = current_empresa_id());

drop policy if exists servicio_empresa_update on servicio_empresa;
create policy servicio_empresa_update on servicio_empresa for update
  using (empresa_id = current_empresa_id());

drop policy if exists servicio_empresa_delete on servicio_empresa;
create policy servicio_empresa_delete on servicio_empresa for delete
  using (empresa_id = current_empresa_id());

-- ============================================================
-- DIRECTORIO (público lectura, propietario/admin escritura)
-- ============================================================
alter table establecimiento_publico enable row level security;

drop policy if exists directorio_select on establecimiento_publico;
create policy directorio_select on establecimiento_publico for select
  using (publicado = true or empresa_id = current_empresa_id() or is_admin_general());

drop policy if exists directorio_insert on establecimiento_publico;
create policy directorio_insert on establecimiento_publico for insert
  with check (empresa_id = current_empresa_id() or is_admin_general());

drop policy if exists directorio_update on establecimiento_publico;
create policy directorio_update on establecimiento_publico for update
  using (empresa_id = current_empresa_id() or is_admin_general());

drop policy if exists directorio_delete on establecimiento_publico;
create policy directorio_delete on establecimiento_publico for delete
  using (empresa_id = current_empresa_id() or is_admin_general());

-- ============================================================
-- PORTAL (conductor)
-- ============================================================
alter table conductor enable row level security;

drop policy if exists conductor_select on conductor;
create policy conductor_select on conductor for select
  using (id = auth.uid() or is_admin_general());

drop policy if exists conductor_update on conductor;
create policy conductor_update on conductor for update
  using (id = auth.uid());

-- INSERT vía trigger handle_new_conductor (SECURITY DEFINER).
drop policy if exists conductor_delete on conductor;
create policy conductor_delete on conductor for delete
  using (is_admin_general());

alter table vehiculo_conductor enable row level security;

drop policy if exists vehiculo_conductor_select on vehiculo_conductor;
create policy vehiculo_conductor_select on vehiculo_conductor for select
  using (conductor_id = auth.uid());

drop policy if exists vehiculo_conductor_insert on vehiculo_conductor;
create policy vehiculo_conductor_insert on vehiculo_conductor for insert
  with check (conductor_id = auth.uid());

drop policy if exists vehiculo_conductor_update on vehiculo_conductor;
create policy vehiculo_conductor_update on vehiculo_conductor for update
  using (conductor_id = auth.uid());

drop policy if exists vehiculo_conductor_delete on vehiculo_conductor;
create policy vehiculo_conductor_delete on vehiculo_conductor for delete
  using (conductor_id = auth.uid());

alter table historial_compartido enable row level security;

drop policy if exists historial_select on historial_compartido;
create policy historial_select on historial_compartido for select
  using (conductor_id = auth.uid() or empresa_id = current_empresa_id());

drop policy if exists historial_insert on historial_compartido;
create policy historial_insert on historial_compartido for insert
  with check (conductor_id = auth.uid());

drop policy if exists historial_update on historial_compartido;
create policy historial_update on historial_compartido for update
  using (conductor_id = auth.uid());

drop policy if exists historial_delete on historial_compartido;
create policy historial_delete on historial_compartido for delete
  using (conductor_id = auth.uid() or is_admin_general());

-- ============================================================
-- AUDIT_LOG y RATE_LIMIT
-- ============================================================
alter table audit_log enable row level security;

drop policy if exists audit_log_select on audit_log;
create policy audit_log_select on audit_log for select
  using (is_admin_general());

-- INSERT vía server action con service_role (nunca cliente).

alter table rate_limit enable row level security;

-- Sin políticas: solo service_role y SECURITY DEFINER pueden acceder.
-- Los usuarios normales no leen ni escriben directamente.