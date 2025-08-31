-- migration: fix function search path for security
-- description: fixes the search path for handle_updated_at function to be immutable

-- recreate the function with immutable search path
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;
