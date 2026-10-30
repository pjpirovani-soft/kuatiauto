-- 006_stock_movimiento.sql
-- F5a: gestión — inventario y movimientos de stock.
-- RLS se habilita en 011_rls_policies.sql.

-- Producto local de la empresa (para stock). El catálogo global se crea en F5b.
-- Aquí se crea producto_empresa porque stock_movimiento lo referencia.
create table if not exists producto_empresa (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references empresa(id) on delete cascade,
  nombre text not null,
  marca text,
  tipo text,
  viscosidad text,
  unidad text not null default 'unidad',
  stock_actual numeric(10,2) not null default 0,
  stock_minimo numeric(10,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_producto_empresa on producto_empresa(empresa_id);

drop trigger if exists trg_producto_empresa_updated_at on producto_empresa;
create trigger trg_producto_empresa_updated_at before update on producto_empresa
  for each row execute function set_updated_at();

-- Movimientos de stock: entradas, salidas, ajustes.
create table if not exists stock_movimiento (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references empresa(id) on delete cascade,
  producto_empresa_id uuid not null references producto_empresa(id) on delete cascade,
  tipo text not null check (tipo in ('entrada','salida','ajuste')),
  cantidad numeric(10,2) not null check (cantidad > 0),
  motivo text,
  orden_id uuid references orden_trabajo(id) on delete set null,
  creado_por uuid references usuario(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_stock_empresa on stock_movimiento(empresa_id);
create index if not exists idx_stock_producto on stock_movimiento(producto_empresa_id);
create index if not exists idx_stock_fecha on stock_movimiento(empresa_id, created_at desc);

-- Trigger: actualizar stock_actual en producto_empresa al insertar movimiento
create or replace function actualizar_stock()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.tipo = 'entrada' then
    update producto_empresa set stock_actual = stock_actual + new.cantidad where id = new.producto_empresa_id;
  elsif new.tipo = 'salida' then
    update producto_empresa set stock_actual = stock_actual - new.cantidad where id = new.producto_empresa_id;
  elsif new.tipo = 'ajuste' then
    update producto_empresa set stock_actual = new.cantidad where id = new.producto_empresa_id;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_stock_movimiento on stock_movimiento;
create trigger trg_stock_movimiento after insert on stock_movimiento
  for each row execute function actualizar_stock();