-- Create settings table
create table if not exists public.settings (
  key text primary key,
  value text,
  created_at timestamptz default now(),
  updated_at timestamptz
);

-- Create social_links table
create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz
);

-- Create footer_links table
create table if not exists public.footer_links (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  label text not null,
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz
);

-- Create contact_submissions table to store messages from /contact
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text,
  created_at timestamptz default now(),
  seen boolean default false
);

-- Sample seed for social_links
insert into public.social_links (provider, url, sort_order)
values
('linkedin', 'https://linkedin.com/in/your-profile', 1),
('facebook', 'https://facebook.com/your-page', 2),
('github', 'https://github.com/your-profile', 3)
on conflict do nothing;

-- Sample seed for footer_links
insert into public.footer_links (section, label, url, sort_order)
values
('Company', 'About', '/about', 1),
('Company', 'Contact', '/contact', 2),
('Resources', 'CV', '/CV_TrinhBaLam.pdf', 1),
('Social', 'LinkedIn', 'https://linkedin.com/in/your-profile', 1)
on conflict do nothing;

-- Sample settings
insert into public.settings (key, value) values
('projects_filters_enabled', 'true')
on conflict (key) do nothing;

-- Optional sample projects seed (only insert if projects table exists)
-- Adjust fields if your projects table schema differs
insert into public.projects (id, title, category, description, image_url, link, featured, sort_order, technologies, metrics)
select gen_random_uuid(), 'Website Redesign', 'Web', 'A full website redesign for a client', 'https://placehold.co/600x400', 'https://example.com', true, 1, array['React','Tailwind'], '[{"label":"Users","value":"10k"}]'::jsonb
where exists (select 1 from pg_tables where schemaname='public' and tablename='projects');

insert into public.projects (id, title, category, description, image_url, link, featured, sort_order, technologies)
select gen_random_uuid(), 'Mobile App', 'Mobile', 'Design and build a cross-platform mobile app', 'https://placehold.co/600x400', null, false, 2, array['React Native']
where exists (select 1 from pg_tables where schemaname='public' and tablename='projects');

-- grant minimal select/insert/delete permissions to anon/public if required (skip if using Row Level Security and Supabase policies)
-- grant select on public.social_links to public;
-- grant select on public.footer_links to public;
-- grant insert on public.contact_submissions to public;

-- End of migration
