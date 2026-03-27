alter table public.store_settings
  add column if not exists whatsapp_number text not null default '5517991755566',
  add column if not exists instagram_url text not null default 'https://www.instagram.com/laismoda_fitness',
  add column if not exists store_tagline text not null default 'Moda fitness com atitude',
  add column if not exists categories text[] not null default '{"Conjuntos", "Tops", "Shorts", "Leggings", "Bodys", "Acessórios"}'::text[];
