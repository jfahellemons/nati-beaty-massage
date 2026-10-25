-- Client reviews, moderated by Nataly before they appear on the website.
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 60),
  service_slug text not null,
  rating smallint not null check (rating between 1 and 5),
  text text not null check (char_length(text) between 20 and 800),
  consent_publish boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  approved_at timestamptz
);

create index if not exists reviews_approved_idx
  on public.reviews (approved_at desc)
  where status = 'approved';

-- The website writes and moderates with the service-role key (server only).
-- Anonymous/public access may only read approved reviews.
alter table public.reviews enable row level security;

drop policy if exists "Public can read approved reviews" on public.reviews;
create policy "Public can read approved reviews"
  on public.reviews for select
  to anon, authenticated
  using (status = 'approved' and consent_publish);
