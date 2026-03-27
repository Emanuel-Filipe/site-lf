alter table public.products
  add column if not exists size_availability jsonb not null default '{}'::jsonb;

update public.products
set size_availability = (
  select coalesce(
    jsonb_object_agg(size_value, availability),
    '{}'::jsonb
  )
  from unnest(coalesce(sizes, '{}')) as size_value
)
where size_availability = '{}'::jsonb
  and coalesce(array_length(sizes, 1), 0) > 0;
