-- migration: create profiles table with rls policies and trigger
-- description: creates a profiles table to store extended user data with automatic profile creation on signup

-- create profiles table
create table public.profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  first_name text,
  avatar_url text,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- add table comment
comment on table public.profiles is 'stores extended user profile information linked to auth.users';

-- enable row level security
alter table public.profiles enable row level security;

-- create index on user_id for better performance with rls policies
create index profiles_user_id_idx on public.profiles(user_id);

-- create rls policies for authenticated users

-- policy for selecting profiles (users can only see their own profile)
create policy "users can view own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = user_id);

-- policy for inserting profiles (users can only insert their own profile)
create policy "users can insert own profile"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = user_id);

-- policy for updating profiles (users can only update their own profile)
create policy "users can update own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

-- policy for deleting profiles (users can only delete their own profile)
create policy "users can delete own profile"
on public.profiles
for delete
to authenticated
using ((select auth.uid()) = user_id);

-- create function to handle new user profile creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- create trigger to automatically create profile when user signs up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- create trigger to automatically update updated_at timestamp
create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();
