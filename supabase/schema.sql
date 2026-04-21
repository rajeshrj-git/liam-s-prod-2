-- Profiles Table
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  is_admin boolean default false,
  full_name text,
  phone text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  pincode text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using ( true );
create policy "Users can insert their own profile." on public.profiles for insert with check ( auth.uid() = id );
create policy "Users can update own profile." on public.profiles for update using ( auth.uid() = id );

-- Trigger to create profile automatically on signup
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Tables
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text not null,
  category text check (category in ('raw_honey','infused_honey','honeycomb','health_wellness')),
  is_sold BOOLEAN DEFAULT false,
  price numeric not null,
  original_price numeric,
  condition text check (condition in ('premium','organic','natural')),
  weight text,      -- e.g., "500g", "1kg"
  purity text,      -- e.g., "100% Pure", "95% Raw"
  origin text,      -- e.g., "Western Ghats", "Black Forest"
  honey_type text,  -- e.g., "Acacia", "Multifloral"
  color_shade text, -- e.g., "Deep Amber", "Pale Gold"
  harvest_season text, -- e.g., "Spring 2024"
  description text,
  images text[] default '{}',
  is_featured boolean default false,
  is_available boolean default true,
  stock_count integer default 1,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid, -- For public users / auth.users
  product_id uuid references products(id),
  quantity integer not null,
  total_amount numeric not null,
  status text not null default 'Pending', -- Pending, Confirmed, Cancelled
  name text not null,
  address text not null,
  phone text not null,
  delivery_type text not null, -- Home Delivery, Store Pickup
  distance_km integer,
  razorpay_order_id text,
  razorpay_payment_id text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- RLS for products
alter table products enable row level security;
create policy "Public read" on products for select using (true);
create policy "Admin write" on products for all using (auth.role() = 'authenticated');

-- RLS for orders
alter table orders enable row level security;
create policy "Users can see own orders" on orders for select using (auth.uid() = user_id);
create policy "Users can insert own orders" on orders for insert with check (auth.uid() = user_id);
create policy "Admin can do all on orders" on orders for all using (auth.role() = 'authenticated');

-- Storage Setup (Execute this in the SQL Editor)
-- Create bucket for product images if it doesn't exist
insert into storage.buckets (id, name, public) 
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Storage policies for product-images
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'product-images' );

create policy "Admin Upload"
on storage.objects for insert
with check ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );

create policy "Admin Update"
on storage.objects for update
using ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );

create policy "Admin Delete"
on storage.objects for delete
using ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );

