alter table public.products
  add column if not exists slug text,
  add column if not exists images text[] default '{}',
  add column if not exists availability text not null default 'disponivel';

update public.products
set slug = lower(
  trim(
    both '-' from regexp_replace(
      regexp_replace(coalesce(name, ''), '[^a-zA-Z0-9]+', '-', 'g'),
      '-+',
      '-',
      'g'
    )
  )
)
where slug is null;

update public.products
set images = case
  when image_url is not null then array[image_url]
  else '{}'
end
where images is null;

alter table public.products
  alter column slug set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_slug_key'
  ) then
    alter table public.products add constraint products_slug_key unique (slug);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_availability_check'
  ) then
    alter table public.products
      add constraint products_availability_check
      check (availability in ('disponivel', 'encomenda'));
  end if;
end $$;

create table if not exists public.store_settings (
  id text primary key,
  hero_images text[] not null default '{}',
  hero_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.store_settings enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'store_settings'
      and policyname = 'Anyone can view store settings'
  ) then
    create policy "Anyone can view store settings"
      on public.store_settings for select
      using (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'store_settings'
      and policyname = 'Admins can insert store settings'
  ) then
    create policy "Admins can insert store settings"
      on public.store_settings for insert
      with check (public.has_role(auth.uid(), 'admin'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'store_settings'
      and policyname = 'Admins can update store settings'
  ) then
    create policy "Admins can update store settings"
      on public.store_settings for update
      using (public.has_role(auth.uid(), 'admin'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'store_settings'
      and policyname = 'Admins can delete store settings'
  ) then
    create policy "Admins can delete store settings"
      on public.store_settings for delete
      using (public.has_role(auth.uid(), 'admin'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'update_store_settings_updated_at'
  ) then
    create trigger update_store_settings_updated_at
      before update on public.store_settings
      for each row execute function public.update_updated_at_column();
  end if;
end $$;

insert into public.store_settings (id, hero_images, hero_description)
values (
  'main',
  '{}',
  'Roupas fitness com caimento impecavel, visual sofisticado e compra simples pelo WhatsApp.'
)
on conflict (id) do nothing;
