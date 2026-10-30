-- 013_notificaciones.sql
-- F11: notificaciones y automatizaciones (stub + mocks en código; tabla real).
-- RLS se habilita en esta misma migración (010 ya está cerrada).
-- Reutiliza: set_updated_at() (F5a), current_empresa_id() y is_admin_general() (F5c).

-- Registro de cada intento de envío de notificación.
-- Una fila por (empresa, destinatario, evento). idempotency_key evita duplicados.
create table if not exists notificacion_log (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references empresa(id) on delete cascade,
  destinatario_email text not null,
  tipo text not null,
  evento_ref uuid,
  idempotency_key text not null unique,
  estado text not null default 'pendiente'
    check (estado in ('pendiente','enviado','fallido','reintentando')),
  intentos int not null default 0,
  ultimo_error text,
  enviado_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_notificacion_log_empresa_created
  on notificacion_log (empresa_id, created_at desc);

create index if not exists idx_notificacion_log_estado_created
  on notificacion_log (estado, created_at);

drop trigger if exists trg_notificacion_log_updated_at on notificacion_log;
create trigger trg_notificacion_log_updated_at
  before update on notificacion_log
  for each row execute function set_updated_at();

-- RLS
alter table notificacion_log enable row level security;

-- SELECT: usuarios de la empresa, o admin_general.
drop policy if exists notificacion_log_select on notificacion_log;
create policy notificacion_log_select on notificacion_log
  for select
  using (empresa_id = current_empresa_id() or is_admin_general());

-- INSERT/UPDATE/DELETE: sin políticas para authenticated.
-- Solo service_role (server-side, server actions) puede escribir.
-- Esto es intencional: el cliente nunca inserta notificaciones directamente.