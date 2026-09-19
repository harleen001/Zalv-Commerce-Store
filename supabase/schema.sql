-- Zalv storefront schema for Supabase
-- Run this once in Supabase SQL Editor before using the live catalog and orders.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists email text;

-- Backfill email addresses when this schema is applied to an existing project.
update public.profiles as profiles
set email = auth_users.email
from auth.users as auth_users
where profiles.id = auth_users.id
  and (profiles.email is null or profiles.email = '');

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null check (category in ('perfume', 'shoes', 'jackets')),
  description text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  image_url text not null,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  shipping_address text not null,
  city text not null,
  pincode text not null,
  status text not null default 'confirmed'
    check (status in ('confirmed', 'shipped', 'delivered', 'cancelled')),
  payment_method text not null default 'cod'
    check (payment_method = 'cod'),
  total numeric(10, 2) not null check (total >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  size text,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0)
);

-- Keeps existing databases compatible with the size captured at checkout.
alter table public.order_items add column if not exists size text;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.is_admin = true
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "profiles_read_own" on public.profiles;
create policy "profiles_read_own" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
  for select using (true);

drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "orders_customer_insert" on public.orders;
create policy "orders_customer_insert" on public.orders
  for insert with check (auth.uid() = user_id);

drop policy if exists "orders_customer_read" on public.orders;
create policy "orders_customer_read" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "order_items_customer_insert" on public.order_items;
create policy "order_items_customer_insert" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and orders.user_id = auth.uid()
    )
  );

drop policy if exists "order_items_customer_read" on public.order_items;
create policy "order_items_customer_read" on public.order_items
  for select using (
    public.is_admin() or exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and orders.user_id = auth.uid()
    )
  );

insert into public.products (slug, name, category, description, price, image_url, is_featured)
values
  ('noir-01', 'Noir 01', 'perfume', 'A dark, dry composition with cedar, smoke, and skin musk.', 2850, 'perfume', true),
  ('sillage-02', 'Sillage 02', 'perfume', 'Warm amber and crushed spice, built for late evenings.', 3200, 'perfume', true),
  ('mitti-03', 'Mitti 03', 'perfume', 'Earth after rain, green cardamom, and sandalwood.', 2650, 'perfume', false),
  ('salt-04', 'Salt 04', 'perfume', 'A clean mineral scent with citrus peel and vetiver.', 2950, 'perfume', false),
  ('moc-01', 'Moc 01', 'shoes', 'Hand-finished leather moccasins with a soft, grounded line.', 6900, 'boots', true),
  ('derby-02', 'Derby 02', 'shoes', 'A sharper everyday derby in full-grain black leather.', 7800, 'boots', true),
  ('loafer-03', 'Loafer 03', 'shoes', 'A low-profile loafer with a polished edge and quiet weight.', 7350, 'boots', false),
  ('trail-04', 'Trail 04', 'shoes', 'A sturdy ankle boot for long roads and changing weather.', 8900, 'boots', false),
  ('field-01', 'Field 01', 'jackets', 'A structured leather overshirt with a generous, easy fit.', 14800, 'jacket', true),
  ('rider-02', 'Rider 02', 'jackets', 'A pared-back rider jacket with a considered shoulder.', 16900, 'jacket', true),
  ('work-03', 'Work 03', 'jackets', 'A softened work jacket cut from substantial leather.', 15600, 'jacket', false),
  ('flight-04', 'Flight 04', 'jackets', 'A clean flight jacket with a warm, sculptural collar.', 18200, 'jacket', false)
on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  description = excluded.description,
  price = excluded.price,
  image_url = excluded.image_url,
  is_featured = excluded.is_featured;