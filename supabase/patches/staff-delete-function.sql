-- Soft-delete staff users without breaking historical staff references.
-- Run this patch in existing Supabase projects, then redeploy manage-staff-user.

alter table public.staff_users add column if not exists deleted_at timestamptz;
alter table public.staff_users add column if not exists deleted_by uuid references public.staff_users(id);

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from staff_users
    where id = auth.uid()
      and deleted_at is null
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from staff_users
    where id = auth.uid()
      and role = 'super_admin'
      and deleted_at is null
  );
$$;

create or replace function public.has_staff_permission(p_feature_key text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from staff_users
    where id = auth.uid()
      and role = 'super_admin'
      and deleted_at is null
  )
  or exists (
    select 1
    from staff_permissions p
    join staff_users s on s.id = p.staff_id
    where p.staff_id = auth.uid()
      and p.feature_key = p_feature_key
      and s.deleted_at is null
  );
$$;

drop policy if exists "staff can read own permissions" on public.staff_permissions;
create policy "staff can read own permissions" on public.staff_permissions for select using ((staff_id = auth.uid() and is_staff()) or is_super_admin());

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

create or replace function public.list_staff_users()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not is_super_admin() then
    raise exception 'Not authorized';
  end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', s.id,
      'email', s.email,
      'branch', coalesce(s.branch, ''),
      'display_name', s.display_name,
      'role', s.role,
      'isSuperAdmin', s.role = 'super_admin',
      'created_at', s.created_at,
      'permissions', coalesce((
        select jsonb_agg(p.feature_key order by p.feature_key)
        from staff_permissions p
        where p.staff_id = s.id
      ), '[]'::jsonb)
    ) order by s.created_at desc)
    from staff_users s
    where s.deleted_at is null
  ), '[]'::jsonb);
end;
$$;

create or replace function public.update_staff_access(p_staff_id uuid, p_role text, p_permissions text[], p_branch text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  clean_branch text := lower(trim(coalesce(p_branch, '')));
  clean_role text := lower(trim(coalesce(p_role, 'staff')));
  clean_permissions text[];
  super_admin_count int;
begin
  if not is_super_admin() then
    raise exception 'Not authorized';
  end if;

  if clean_role = 'admin' then
    clean_role := 'super_admin';
  end if;

  if clean_role not in ('staff', 'super_admin') then
    raise exception 'Invalid role';
  end if;

  if clean_branch not in ('ram', 'ekamai') then
    raise exception 'Branch is required';
  end if;

  if not exists (select 1 from staff_users where id = p_staff_id and deleted_at is null) then
    raise exception 'Staff user not found';
  end if;

  select count(*) into super_admin_count
  from staff_users
  where role = 'super_admin'
    and deleted_at is null
    and id <> p_staff_id;

  if p_staff_id = auth.uid() and clean_role <> 'super_admin' and super_admin_count = 0 then
    raise exception 'Cannot remove the last Super Admin';
  end if;

  clean_permissions := array(
    select distinct permission
    from unnest(coalesce(p_permissions, array[]::text[])) permission
    where permission in (
      'dashboard',
      'test_catalog',
      'generate_links',
      'view_results',
      'view_reports',
      'hours_cross_check',
      'staff_management'
    )
    order by permission
  );

  update staff_users
  set branch = clean_branch,
      role = clean_role
  where id = p_staff_id;

  delete from staff_permissions
  where staff_id = p_staff_id;

  if clean_role = 'staff' then
    insert into staff_permissions (staff_id, feature_key, granted_by)
    select p_staff_id, permission, auth.uid()
    from unnest(clean_permissions) permission
    on conflict (staff_id, feature_key) do update set
      granted_by = excluded.granted_by,
      granted_at = now();
  end if;

  return (
    select jsonb_build_object(
      'id', s.id,
      'email', s.email,
      'branch', coalesce(s.branch, ''),
      'display_name', s.display_name,
      'role', s.role,
      'isSuperAdmin', s.role = 'super_admin',
      'permissions', coalesce((
        select jsonb_agg(p.feature_key order by p.feature_key)
        from staff_permissions p
        where p.staff_id = s.id
      ), '[]'::jsonb)
    )
    from staff_users s
    where s.id = p_staff_id
      and s.deleted_at is null
  );
end;
$$;

create or replace function public.create_test_assignment(p_test_id text)
returns table(id uuid, test_id text, assignment_token text, branch text, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  staff_branch text;
begin
  perform require_staff_permission('generate_links');
  select staff_users.branch into staff_branch
  from staff_users
  where staff_users.id = auth.uid()
    and staff_users.deleted_at is null;

  if staff_branch is null or staff_branch not in ('ram', 'ekamai') then
    raise exception 'Choose your staff branch before generating test links.';
  end if;

  if not exists (select 1 from tests where tests.id = p_test_id and tests.status = 'active') then
    raise exception 'Cannot create assignment for inactive or missing test %', p_test_id;
  end if;
  return query
    insert into test_assignments (test_id, branch, created_by)
    values (p_test_id, staff_branch, auth.uid())
    returning test_assignments.id, test_assignments.test_id, test_assignments.assignment_token, test_assignments.branch, test_assignments.created_at;
end;
$$;
