-- 001_clientes.sql
-- Tabla clientes con RLS (cada usuario ve solo sus clientes).

create table if not exists public.clientes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nombre text not null,
  email text not null,
  telefono text,
  notas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.clientes enable row level security;

drop policy if exists "clientes_select_own" on public.clientes;
create policy "clientes_select_own" on public.clientes
  for select using (auth.uid() = user_id);

drop policy if exists "clientes_insert_own" on public.clientes;
create policy "clientes_insert_own" on public.clientes
  for insert with check (auth.uid() = user_id);

drop policy if exists "clientes_update_own" on public.clientes;
create policy "clientes_update_own" on public.clientes
  for update using (auth.uid() = user_id);

drop policy if exists "clientes_delete_own" on public.clientes;
create policy "clientes_delete_own" on public.clientes
  for delete using (auth.uid() = user_id);

create index if not exists clientes_user_id_idx on public.clientes(user_id);