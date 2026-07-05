-- Add self-service staff personal details.
-- Run this patch in existing Supabase projects.

alter table public.staff_users add column if not exists first_name text;
alter table public.staff_users add column if not exists last_name text;
alter table public.staff_users add column if not exists date_of_birth date;
alter table public.staff_users add column if not exists gender text;
alter table public.staff_users add column if not exists tel text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.staff_users'::regclass
      and conname = 'staff_users_gender_check'
  ) then
    alter table public.staff_users
      add constraint staff_users_gender_check check (gender is null or gender in ('female', 'male', 'other', 'prefer_not_to_say'));
  end if;
end $$;

create or replace function public.get_staff_profile()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'id', s.id,
    'email', s.email,
    'branch', coalesce(s.branch, ''),
    'display_name', s.display_name,
    'firstName', coalesce(s.first_name, ''),
    'lastName', coalesce(s.last_name, ''),
    'dateOfBirth', coalesce(s.date_of_birth::text, ''),
    'gender', coalesce(s.gender, ''),
    'tel', coalesce(s.tel, ''),
    'role', s.role,
    'isSuperAdmin', s.role = 'super_admin',
    'permissions', coalesce((
      select jsonb_agg(p.feature_key order by p.feature_key)
      from staff_permissions p
      where p.staff_id = s.id
    ), '[]'::jsonb)
  )
  from staff_users s
  where s.id = auth.uid()
    and s.deleted_at is null;
$$;

create or replace function public.update_own_staff_profile(p_first_name text, p_last_name text, p_date_of_birth date, p_gender text, p_tel text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  clean_first_name text := trim(coalesce(p_first_name, ''));
  clean_last_name text := trim(coalesce(p_last_name, ''));
  clean_gender text := nullif(lower(trim(coalesce(p_gender, ''))), '');
  clean_tel text := nullif(trim(coalesce(p_tel, '')), '');
begin
  if not is_staff() then
    raise exception 'Not authorized';
  end if;

  if clean_first_name = '' then
    raise exception 'First name is required';
  end if;

  if clean_last_name = '' then
    raise exception 'Last name is required';
  end if;

  if p_date_of_birth is null then
    raise exception 'Date of birth is required';
  end if;

  if clean_gender is not null and clean_gender not in ('female', 'male', 'other', 'prefer_not_to_say') then
    raise exception 'Invalid gender';
  end if;

  update staff_users
  set first_name = clean_first_name,
      last_name = clean_last_name,
      date_of_birth = p_date_of_birth,
      gender = clean_gender,
      tel = clean_tel,
      display_name = concat_ws(' ', clean_first_name, clean_last_name)
  where id = auth.uid()
    and deleted_at is null;

  return (
    select jsonb_build_object(
      'id', s.id,
      'email', s.email,
      'branch', coalesce(s.branch, ''),
      'display_name', s.display_name,
      'firstName', coalesce(s.first_name, ''),
      'lastName', coalesce(s.last_name, ''),
      'dateOfBirth', coalesce(s.date_of_birth::text, ''),
      'gender', coalesce(s.gender, ''),
      'tel', coalesce(s.tel, ''),
      'role', s.role,
      'isSuperAdmin', s.role = 'super_admin',
      'permissions', coalesce((
        select jsonb_agg(p.feature_key order by p.feature_key)
        from staff_permissions p
        where p.staff_id = s.id
      ), '[]'::jsonb)
    )
    from staff_users s
    where s.id = auth.uid()
      and s.deleted_at is null
  );
end;
$$;

grant execute on function public.update_own_staff_profile(text, text, date, text, text) to authenticated;
