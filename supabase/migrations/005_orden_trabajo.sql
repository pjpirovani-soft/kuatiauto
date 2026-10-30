-- 005_orden_trabajo.sql
-- F5a: gestión — orden de trabajo + servicios + productos usados.
-- RLS se habilita en 011_rls_policies.sql.

create table if not exists orden_trabajo (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references empresa(id) on delete cascade,
  vehiculo_id uuid not null references vehiculo(id) on delete cascade,
  fecha date not null default current_date,
  km_servicio integer not null check (km_servicio >= 0),
  observaciones text,
  importe_total numeric(12,2),
  proximo_mantenimiento_fecha date,
  proximo_mantenimiento_km integer,
  estado text not null default 'borrador' check (estado in ('borrador','completada','anulada')),
  creado_por uuid references usuario(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orden_empresa on orden_trabajo(empresa_id);
create index if not exists idx_orden_vehiculo on orden_trabajo(vehiculo_id);
create index if not exists idx_orden_fecha on orden_trabajo(empresa_id, fecha desc);
create index if not exists idx_orden_proximo on orden_trabajo(empresa_id, proximo_mantenimiento_fecha);

drop trigger if exists trg_orden_updated_at on orden_trabajo;
create trigger trg_orden_updated_at before update on orden_trabajo
  for each row execute function set_updated_at();

-- Orden_servicio: N:M entre orden y servicio (global o local).
-- El servicio_id puede referenciar servicio_global o servicio_empresa.
-- Se valida en server action que el servicio pertenezca a la empresa o sea global.
create table if not exists orden_servicio (
  id uuid primary key default gen_random_uuid(),
  orden_id uuid not null references orden_trabajo(id) on delete cascade,
  servicio_global_id uuid,
  servicio_empresa_id uuid,
  precio numeric(12,2),
  created_at timestamptz not null default now(),
  check (servicio_global_id is not null or servicio_empresa_id is not null)
);

create index if not exists idx_orden_servicio_orden on orden_servicio(orden_id);

-- Orden_producto: N:M entre orden y producto (global o local).
create table if not exists orden_producto (
  id uuid primary key default gen_random_uuid(),
  orden_id uuid not null references orden_trabajo(id) on delete cascade,
  producto_global_id uuid,
  producto_empresa_id uuid,
  cantidad numeric(10,2) not null default 1 check (cantidad > 0),
  precio_unitario numeric(12,2),
  created_at timestamptz not null default now(),
  check (producto_global_id is not null or producto_empresa_id is not null)
);

create index if not exists idx_orden_producto_orden on orden_producto(orden_id);

-- Nota: las FKs a servicio_global, servicio_empresa, producto_global y producto_empresa
-- se agregan en la migración 005b (catálogo) o en 006, cuando esas tablas existan.
-- En esta migración solo se crean las columnas, sin FK, para evitar dependencia circular.