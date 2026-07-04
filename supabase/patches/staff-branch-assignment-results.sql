-- Add staff branch metadata to assignment creation and admin result reporting.
-- Existing staff and assignments remain nullable legacy rows until edited or recreated.

alter table staff_users add column if not exists branch text;
alter table test_assignments add column if not exists branch text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.staff_users'::regclass
      and conname = 'staff_users_branch_check'
  ) then
    alter table staff_users
      add constraint staff_users_branch_check check (branch is null or branch in ('ram', 'ekamai'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.test_assignments'::regclass
      and conname = 'test_assignments_branch_check'
  ) then
    alter table test_assignments
      add constraint test_assignments_branch_check check (branch is null or branch in ('ram', 'ekamai'));
  end if;
end $$;

drop function if exists list_admin_results();
drop function if exists get_admin_result(uuid);
drop function if exists create_test_assignment(text);
drop function if exists get_assignment(text);
drop function if exists update_staff_access(uuid, text, text[]);
drop function if exists update_staff_access(uuid, text, text[], text);
drop view if exists admin_attempt_results;

create or replace function get_staff_profile()
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
  where s.id = auth.uid();
$$;

create or replace function list_staff_users()
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
  ), '[]'::jsonb);
end;
$$;

create or replace function update_staff_access(p_staff_id uuid, p_role text, p_permissions text[], p_branch text)
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

  if not exists (select 1 from staff_users where id = p_staff_id) then
    raise exception 'Staff user not found';
  end if;

  select count(*) into super_admin_count
  from staff_users
  where role = 'super_admin'
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
  );
end;
$$;

create or replace function create_test_assignment(p_test_id text)
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
  where staff_users.id = auth.uid();

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

create or replace function get_assignment(p_token text)
returns table(assignment_id uuid, assignment_token text, test_id text, title text, subject text, level text, status text, branch text)
language sql
stable
security definer
set search_path = public
as $$
  select a.id, a.assignment_token, t.id, t.title, t.subject, t.level, a.status, coalesce(a.branch, '')
  from test_assignments a
  join tests t on t.id = a.test_id
  where a.assignment_token = p_token and a.status = 'active' and t.status = 'active'
  limit 1;
$$;

create or replace view admin_attempt_results as
select
  a.id as attempt_id,
  a.test_id,
  coalesce(ta.branch, '') as branch,
  ta.created_by,
  creator.email as created_by_email,
  creator.display_name as created_by_name,
  t.title as test_title,
  t.subject,
  t.level,
  s.full_name,
  s.nickname,
  s.date_of_birth,
  a.test_date,
  a.score_total,
  a.score_possible,
  a.score_percent,
  a.submitted_at,
  (
    select jsonb_agg(jsonb_build_object('part', part, 'total', awarded_total, 'possible', possible_total) order by part)
    from (
      select part, sum(awarded_points) as awarded_total, sum(possible_points) as possible_total
      from attempt_answers
      where attempt_id = a.id
      group by part
    ) part_scores
  ) as part_scores,
  (
    select jsonb_agg(jsonb_build_object(
      'part', part,
      'prompt', prompt,
      'response', response,
      'correctAnswer', correct_answer,
      'correct', is_correct,
      'score', awarded_points,
      'possible', possible_points,
      'gradingDetails', grading_details,
      'transcript', transcript_ref
    ) order by position)
    from attempt_answers
    where attempt_id = a.id
  ) as answers
from test_attempts a
join test_assignments ta on ta.id = a.assignment_id
join tests t on t.id = a.test_id
join students s on s.id = a.student_id
left join staff_users creator on creator.id = ta.created_by
where has_staff_permission('view_results') or has_staff_permission('view_reports');

create or replace function list_admin_results()
returns setof admin_attempt_results
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  perform require_staff_permission('view_results');
  return query
    select *
    from admin_attempt_results
    order by submitted_at desc;
end;
$$;

create or replace function get_admin_result(p_attempt_id uuid)
returns setof admin_attempt_results
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  perform require_staff_permission('view_reports');
  return query
    select *
    from admin_attempt_results
    where attempt_id = p_attempt_id;
end;
$$;

grant execute on function get_assignment(text) to anon, authenticated;
grant execute on function create_test_assignment(text) to authenticated;
grant execute on function get_staff_profile() to authenticated;
grant execute on function list_staff_users() to authenticated;
grant execute on function update_staff_access(uuid, text, text[], text) to authenticated;
grant execute on function list_admin_results() to authenticated;
grant execute on function get_admin_result(uuid) to authenticated;
grant select on admin_attempt_results to authenticated;
