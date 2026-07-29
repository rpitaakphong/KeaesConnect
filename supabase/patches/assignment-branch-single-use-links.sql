-- Move branch ownership from staff profiles to individual test assignments.
-- Preserve historical results while closing legacy links that are already used
-- or do not have a valid assignment branch.

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

create or replace function update_own_staff_profile(
  p_first_name text,
  p_last_name text,
  p_date_of_birth date,
  p_gender text,
  p_tel text
)
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

  if clean_gender is not null
    and clean_gender not in ('female', 'male', 'other', 'prefer_not_to_say') then
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

drop function if exists update_staff_access(uuid, text, text[], text);

create or replace function update_staff_access(
  p_staff_id uuid,
  p_role text,
  p_permissions text[]
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
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

  if not exists (
    select 1
    from staff_users
    where id = p_staff_id
      and deleted_at is null
  ) then
    raise exception 'Staff user not found';
  end if;

  select count(*) into super_admin_count
  from staff_users
  where role = 'super_admin'
    and deleted_at is null
    and id <> p_staff_id;

  if p_staff_id = auth.uid()
    and clean_role <> 'super_admin'
    and super_admin_count = 0 then
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
  set role = clean_role
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

drop function if exists create_test_assignment(text);

create or replace function create_test_assignment(p_test_id text, p_branch text)
returns table(
  id uuid,
  test_id text,
  assignment_token text,
  branch text,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  clean_branch text := lower(trim(coalesce(p_branch, '')));
begin
  perform require_staff_permission('generate_links');

  if clean_branch not in ('ram', 'ekamai') then
    raise exception 'Choose Ram or Ekamai before generating a test link.';
  end if;

  if not exists (
    select 1
    from tests
    where tests.id = p_test_id
      and tests.status = 'active'
  ) then
    raise exception 'Cannot create assignment for inactive or missing test %', p_test_id;
  end if;

  return query
    insert into test_assignments (test_id, branch, created_by)
    values (p_test_id, clean_branch, auth.uid())
    returning
      test_assignments.id,
      test_assignments.test_id,
      test_assignments.assignment_token,
      test_assignments.branch,
      test_assignments.created_at;
end;
$$;

update test_assignments assignment
set status = 'closed'
where assignment.status = 'active'
  and (
    assignment.branch is null
    or assignment.branch not in ('ram', 'ekamai')
    or exists (
      select 1
      from test_attempts attempt
      where attempt.assignment_id = assignment.id
    )
  );

create or replace function submit_attempt(
  p_assignment_token text,
  p_student jsonb,
  p_answers jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  assignment_row test_assignments%rowtype;
  v_student_id uuid;
  v_attempt_id uuid;
  v_possible numeric;
  v_total numeric;
  sections jsonb;
begin
  select * into assignment_row
  from test_assignments
  where assignment_token = p_assignment_token
  for update;

  if assignment_row.id is null then
    raise exception 'Invalid or inactive assignment';
  end if;

  if assignment_row.status <> 'active'
    or exists (
      select 1
      from test_attempts
      where assignment_id = assignment_row.id
    ) then
    raise exception 'This test link has already been used.';
  end if;

  if assignment_row.branch is null
    or assignment_row.branch not in ('ram', 'ekamai') then
    raise exception 'This test link does not have a valid branch. Ask staff for a new link.';
  end if;

  insert into students (full_name, nickname, date_of_birth)
  values (
    nullif(trim(p_student->>'fullName'), ''),
    nullif(trim(p_student->>'nickname'), ''),
    (p_student->>'dateOfBirth')::date
  )
  returning id into v_student_id;

  with scored as (
    select
      q.*,
      q.answer_key || jsonb_build_object('id', q.id, 'points', q.points) as answer_key_with_meta,
      answer_response(
        q.answer_key || jsonb_build_object('id', q.id, 'points', q.points),
        p_answers
      ) as response_value
    from test_questions q
    where q.test_id = assignment_row.test_id
  ),
  scored_display as (
    select
      *,
      answer_score(id, answer_key_with_meta, response_value, p_answers) as awarded,
      question_points(answer_key_with_meta) as possible,
      is_correct_answer(
        id,
        answer_key_with_meta,
        response_value,
        p_answers
      ) as correct,
      response_display(id, answer_key, response_value) as response_text
    from scored
  )
  select coalesce(sum(possible), 0), coalesce(sum(awarded), 0)
  into v_possible, v_total
  from scored_display;

  insert into test_attempts (
    assignment_id,
    student_id,
    test_id,
    test_date,
    score_total,
    score_possible,
    score_percent
  )
  values (
    assignment_row.id,
    v_student_id,
    assignment_row.test_id,
    coalesce((p_student->>'testDate')::date, current_date),
    v_total,
    v_possible,
    case
      when v_possible = 0 then 0
      else round((v_total::numeric / v_possible::numeric) * 100)::int
    end
  )
  returning id into v_attempt_id;

  insert into attempt_answers (
    attempt_id,
    question_id,
    part,
    prompt,
    response,
    correct_answer,
    is_correct,
    awarded_points,
    possible_points,
    grading_details,
    transcript_ref,
    position
  )
  select
    v_attempt_id,
    id,
    part,
    prompt,
    response_text,
    answer_key->>'display',
    correct,
    awarded,
    possible,
    details,
    transcript_ref,
    position
  from (
    select
      q.*,
      q.answer_key || jsonb_build_object('id', q.id, 'points', q.points) as answer_key_with_meta,
      answer_response(
        q.answer_key || jsonb_build_object('id', q.id, 'points', q.points),
        p_answers
      ) as response_value,
      answer_score(
        q.id,
        q.answer_key || jsonb_build_object('id', q.id, 'points', q.points),
        answer_response(
          q.answer_key || jsonb_build_object('id', q.id, 'points', q.points),
          p_answers
        ),
        p_answers
      ) as awarded,
      question_points(
        q.answer_key || jsonb_build_object('id', q.id, 'points', q.points)
      ) as possible,
      is_correct_answer(
        q.id,
        q.answer_key || jsonb_build_object('id', q.id, 'points', q.points),
        answer_response(
          q.answer_key || jsonb_build_object('id', q.id, 'points', q.points),
          p_answers
        ),
        p_answers
      ) as correct,
      grading_details(
        q.id,
        q.answer_key || jsonb_build_object('id', q.id, 'points', q.points),
        p_answers
      ) as details,
      response_display(
        q.id,
        q.answer_key,
        answer_response(
          q.answer_key || jsonb_build_object('id', q.id, 'points', q.points),
          p_answers
        )
      ) as response_text
    from test_questions q
    where q.test_id = assignment_row.test_id
  ) scored_rows;

  select jsonb_object_agg(part_key, part_items)
  into sections
  from (
    select
      lower(replace(part, ' ', '')) as part_key,
      jsonb_agg(jsonb_build_object(
        'part', part,
        'prompt', prompt,
        'response', response,
        'correctAnswer', correct_answer,
        'correct', is_correct,
        'score', awarded_points,
        'possible', possible_points,
        'gradingDetails', grading_details,
        'transcript', transcript_ref
      ) order by position) as part_items
    from attempt_answers
    where attempt_answers.attempt_id = v_attempt_id
    group by part
  ) grouped;

  update test_assignments
  set status = 'closed'
  where id = assignment_row.id;

  return jsonb_build_object(
    'attemptId', v_attempt_id,
    'total', v_total,
    'possible', v_possible,
    'sections', coalesce(sections, '{}'::jsonb)
  );
end;
$$;

alter table staff_users
  drop constraint if exists staff_users_branch_check;

alter table staff_users
  drop column if exists branch;

grant execute on function create_test_assignment(text, text) to authenticated;
grant execute on function update_staff_access(uuid, text, text[]) to authenticated;
