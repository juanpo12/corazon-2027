-- Entradas Corazón a Corazón 2027
-- Pegar todo este archivo en Supabase → SQL Editor → New query → Run.
-- Se puede volver a correr sin romper nada.
-- Todo lleva el prefijo cac_ para no chocar con otras tablas que ya existan en el proyecto.

create table if not exists cac_orders (
  id uuid primary key default gen_random_uuid(),
  -- clave secreta del link "Mis entradas" (solo la tiene el comprador)
  access_token text not null unique default replace(gen_random_uuid()::text, '-', ''),
  buyer_name text not null,
  email text not null,
  quantity int not null check (quantity between 1 and 20),
  unit_price numeric(12, 2) not null,
  total numeric(12, 2) not null,
  -- pending: esperando pago · paid: pagado, entradas emitidas · refunded: devuelto o contracargo, entradas anuladas
  status text not null default 'pending' check (status in ('pending', 'paid', 'refunded')),
  mp_preference_id text,
  mp_payment_id text,
  mp_status text,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  email_sent_at timestamptz
);

create index if not exists cac_orders_status_idx on cac_orders (status);
create index if not exists cac_orders_email_idx on cac_orders (lower(email));

create table if not exists cac_tickets (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references cac_orders (id) on delete cascade,
  -- número de entrada dentro de la compra (1 de 4, 2 de 4…)
  seq int not null,
  -- lo que va dentro del QR: 128 bits aleatorios, imposible de adivinar
  code text not null unique default replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', ''),
  created_at timestamptz not null default now(),
  unique (order_id, seq)
);

-- Un ingreso por entrada por día (la entrada vale para todos los días del evento)
create table if not exists cac_checkins (
  id bigint generated always as identity primary key,
  ticket_id uuid not null references cac_tickets (id) on delete cascade,
  day date not null,
  at timestamptz not null default now(),
  unique (ticket_id, day)
);

-- Nadie entra a las tablas desde el navegador: solo el servidor de la web, con la clave secreta.
alter table cac_orders enable row level security;
alter table cac_tickets enable row level security;
alter table cac_checkins enable row level security;

-- Marca la compra como pagada y emite sus entradas en un solo paso.
-- Devuelve true solo la primera vez (si Mercado Pago avisa dos veces, no se duplican entradas).
create or replace function cac_mark_order_paid(p_order uuid, p_payment text, p_mp_status text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_qty int;
begin
  update cac_orders
     set status = 'paid', mp_payment_id = p_payment, mp_status = p_mp_status, paid_at = now()
   where id = p_order and status = 'pending'
  returning quantity into v_qty;

  if v_qty is null then
    return false;
  end if;

  insert into cac_tickets (order_id, seq)
  select p_order, g from generate_series(1, v_qty) g;

  return true;
end;
$$;

revoke all on function cac_mark_order_paid(uuid, text, text) from public, anon, authenticated;
grant execute on function cac_mark_order_paid(uuid, text, text) to service_role;
