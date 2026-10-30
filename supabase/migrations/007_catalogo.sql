-- 007_catalogo.sql
-- F5b: catálogo automotriz completo + servicios/productos globales.
-- RLS se habilita en 011_rls_policies.sql.

-- Fabricantes (ej. Toyota, Ford, Chevrolet)
create table if not exists fabricante (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  pais_origen text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_fabricante_nombre on fabricante(nombre);

-- Marcas (ej. Toyota, Lexus; una marca pertenece a un fabricante)
create table if not exists marca (
  id uuid primary key default gen_random_uuid(),
  fabricante_id uuid not null references fabricante(id) on delete cascade,
  nombre text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (fabricante_id, nombre)
);

create index if not exists idx_marca_fabricante on marca(fabricante_id);

-- Modelos (ej. Corolla, Hilux; un modelo pertenece a una marca)
create table if not exists modelo (
  id uuid primary key default gen_random_uuid(),
  marca_id uuid not null references marca(id) on delete cascade,
  nombre text not null,
  anio_desde integer,
  anio_hasta integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (marca_id, nombre, anio_desde)
);

create index if not exists idx_modelo_marca on modelo(marca_id);

-- Versiones / variantes (ej. Corolla XEI 2.0 CVT)
create table if not exists version (
  id uuid primary key default gen_random_uuid(),
  modelo_id uuid not null references modelo(id) on delete cascade,
  nombre text not null,
  anio integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_version_modelo on version(modelo_id);

-- Motorizaciones (ej. 2.0 nafta, 1.6 diesel)
create table if not exists motorizacion (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references version(id) on delete cascade,
  cilindrada_cc integer,
  combustible text check (combustible in ('nafta','diesel','gnc','glp','electrico','hibrido','otro')),
  potencia_hp integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_motorizacion_version on motorizacion(version_id);

-- Especificaciones de lubricantes (la información crítica del catálogo)
-- Cada dato debe tener fuente, fecha y estado de validación.
create table if not exists especificacion_lubricante (
  id uuid primary key default gen_random_uuid(),
  motorizacion_id uuid not null references motorizacion(id) on delete cascade,
  viscosidad_sae text,
  clasificacion_api text,
  clasificacion_acea text,
  aprobacion_fabricante text,
  capacidad_litros numeric(5,2),
  intervalo_km_normal integer,
  intervalo_meses_normal integer,
  intervalo_km_severo integer,
  intervalo_meses_severo integer,
  fuente text,
  fecha_consulta date,
  estado_validacion text not null default 'pendiente' check (estado_validacion in ('pendiente','verificado','disputado')),
  verificado_por uuid references usuario(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_especificacion_motorizacion on especificacion_lubricante(motorizacion_id);
create index if not exists idx_especificacion_estado on especificacion_lubricante(estado_validacion);

-- Servicios globales (catálogo administrado por admin_general)
create table if not exists servicio_global (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  descripcion text,
  intervalo_meses_sugerido integer,
  intervalo_km_sugerido integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Servicios locales (por empresa)
create table if not exists servicio_empresa (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references empresa(id) on delete cascade,
  nombre text not null,
  descripcion text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_servicio_empresa on servicio_empresa(empresa_id);

-- Productos globales (catálogo administrado por admin_general)
create table if not exists producto_global (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  marca text,
  tipo text,
  viscosidad text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Triggers updated_at para todas las tablas de catálogo
drop trigger if exists trg_fabricante_updated_at on fabricante;
create trigger trg_fabricante_updated_at before update on fabricante for each row execute function set_updated_at();

drop trigger if exists trg_marca_updated_at on marca;
create trigger trg_marca_updated_at before update on marca for each row execute function set_updated_at();

drop trigger if exists trg_modelo_updated_at on modelo;
create trigger trg_modelo_updated_at before update on modelo for each row execute function set_updated_at();

drop trigger if exists trg_version_updated_at on version;
create trigger trg_version_updated_at before update on version for each row execute function set_updated_at();

drop trigger if exists trg_motorizacion_updated_at on motorizacion;
create trigger trg_motorizacion_updated_at before update on motorizacion for each row execute function set_updated_at();

drop trigger if exists trg_especificacion_updated_at on especificacion_lubricante;
create trigger trg_especificacion_updated_at before update on especificacion_lubricante for each row execute function set_updated_at();

drop trigger if exists trg_servicio_global_updated_at on servicio_global;
create trigger trg_servicio_global_updated_at before update on servicio_global for each row execute function set_updated_at();

drop trigger if exists trg_servicio_empresa_updated_at on servicio_empresa;
create trigger trg_servicio_empresa_updated_at before update on servicio_empresa for each row execute function set_updated_at();

drop trigger if exists trg_producto_global_updated_at on producto_global;
create trigger trg_producto_global_updated_at before update on producto_global for each row execute function set_updated_at();

-- FKs pendientes de la migración 005: orden_servicio y orden_producto
alter table orden_servicio
  add constraint fk_orden_servicio_global foreign key (servicio_global_id) references servicio_global(id) on delete set null;

alter table orden_servicio
  add constraint fk_orden_servicio_empresa foreign key (servicio_empresa_id) references servicio_empresa(id) on delete set null;

alter table orden_producto
  add constraint fk_orden_producto_global foreign key (producto_global_id) references producto_global(id) on delete set null;

alter table orden_producto
  add constraint fk_orden_producto_empresa foreign key (producto_empresa_id) references producto_empresa(id) on delete set null;