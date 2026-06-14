-- Run in Supabase SQL editor
create table public.waitlist (
  id         uuid default gen_random_uuid() primary key,
  email      text not null unique,
  created_at timestamptz default now()
);

-- Only the service role key can insert (used server-side in api/waitlist.js)
-- Anon/public users cannot read or write directly
alter table public.waitlist enable row level security;
-- No policies added = only service_role can access (bypasses RLS by default)
