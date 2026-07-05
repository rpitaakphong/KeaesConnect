create extension if not exists pgcrypto;

create table if not exists staff_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  role text not null default 'staff' check (role in ('staff', 'admin')),
  created_at timestamptz not null default now()
);

do $$
declare
  constraint_name text;
begin
  select conname into constraint_name
  from pg_constraint
  where conrelid = 'public.staff_users'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) like '%role%';

  if constraint_name is not null then
    execute format('alter table staff_users drop constraint %I', constraint_name);
  end if;
end $$;

update staff_users
set role = 'super_admin'
where role = 'admin';

alter table staff_users
  alter column role set default 'staff',
  add constraint staff_users_role_check check (role in ('staff', 'super_admin'));

alter table staff_users add column if not exists branch text;
alter table staff_users add column if not exists deleted_at timestamptz;
alter table staff_users add column if not exists deleted_by uuid references staff_users(id);
alter table staff_users add column if not exists first_name text;
alter table staff_users add column if not exists last_name text;
alter table staff_users add column if not exists date_of_birth date;
alter table staff_users add column if not exists gender text;
alter table staff_users add column if not exists tel text;

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
    where conrelid = 'public.staff_users'::regclass
      and conname = 'staff_users_gender_check'
  ) then
    alter table staff_users
      add constraint staff_users_gender_check check (gender is null or gender in ('female', 'male', 'other', 'prefer_not_to_say'));
  end if;
end $$;

create table if not exists staff_permissions (
  staff_id uuid not null references staff_users(id) on delete cascade,
  feature_key text not null check (feature_key in (
    'dashboard',
    'test_catalog',
    'generate_links',
    'view_results',
    'view_reports',
    'hours_cross_check',
    'staff_management'
  )),
  granted_by uuid references staff_users(id),
  granted_at timestamptz not null default now(),
  primary key (staff_id, feature_key)
);

do $$
declare
  permission_constraint_name text;
begin
  select conname into permission_constraint_name
  from pg_constraint
  where conrelid = 'public.staff_permissions'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) like '%feature_key%';

  if permission_constraint_name is not null then
    execute format('alter table staff_permissions drop constraint %I', permission_constraint_name);
  end if;
end $$;

alter table staff_permissions
  add constraint staff_permissions_feature_key_check check (feature_key in (
    'dashboard',
    'test_catalog',
    'generate_links',
    'view_results',
    'view_reports',
    'hours_cross_check',
    'staff_management'
  ));

create table if not exists tests (
  id text primary key,
  title text not null,
  subject text not null,
  level text not null,
  status text not null default 'active' check (status in ('active', 'inactive')),
  total_points int not null default 20,
  created_at timestamptz not null default now()
);

alter table tests add column if not exists app_path text not null default '/tests/starter-progress-listening/start';

create table if not exists test_questions (
  id text primary key,
  test_id text not null references tests(id) on delete cascade,
  part text not null,
  prompt text not null,
  answer_key jsonb not null,
  transcript_ref text,
  points numeric not null default 1,
  position int not null
);

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  nickname text not null,
  date_of_birth date not null,
  created_at timestamptz not null default now()
);

create table if not exists test_assignments (
  id uuid primary key default gen_random_uuid(),
  test_id text not null references tests(id),
  assignment_token text not null unique default replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', ''),
  status text not null default 'active' check (status in ('active', 'closed', 'expired')),
  branch text,
  created_by uuid references staff_users(id),
  created_at timestamptz not null default now()
);

alter table test_assignments add column if not exists branch text;

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

create table if not exists test_attempts (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references test_assignments(id),
  student_id uuid not null references students(id),
  test_id text not null references tests(id),
  test_date date not null,
  score_total numeric not null,
  score_possible numeric not null,
  score_percent int not null,
  submitted_at timestamptz not null default now()
);

create table if not exists attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references test_attempts(id) on delete cascade,
  question_id text not null references test_questions(id),
  part text not null,
  prompt text not null,
  response text not null,
  correct_answer text not null,
  is_correct boolean not null,
  awarded_points numeric not null default 0,
  possible_points numeric not null default 1,
  grading_details jsonb not null default '{}'::jsonb,
  transcript_ref text,
  position int not null
);

drop function if exists list_admin_results();
drop function if exists get_admin_result(uuid);
drop function if exists create_test_assignment(text);
drop function if exists get_assignment(text);
drop function if exists update_staff_access(uuid, text, text[]);
drop function if exists update_staff_access(uuid, text, text[], text);
drop view if exists admin_attempt_results;

alter table test_questions alter column points type numeric using points::numeric;
alter table test_attempts alter column score_total type numeric using score_total::numeric;
alter table test_attempts alter column score_possible type numeric using score_possible::numeric;
alter table attempt_answers add column if not exists awarded_points numeric not null default 0;
alter table attempt_answers add column if not exists possible_points numeric not null default 1;
alter table attempt_answers add column if not exists grading_details jsonb not null default '{}'::jsonb;
update attempt_answers
set awarded_points = possible_points
where is_correct = true
  and awarded_points = 0
  and grading_details = '{}'::jsonb;

alter table staff_users enable row level security;
alter table staff_permissions enable row level security;
alter table tests enable row level security;
alter table test_questions enable row level security;
alter table students enable row level security;
alter table test_assignments enable row level security;
alter table test_attempts enable row level security;
alter table attempt_answers enable row level security;

create or replace function is_staff()
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

create or replace function is_super_admin()
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

create or replace function has_staff_permission(p_feature_key text)
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

create or replace function require_staff_permission(p_feature_key text)
returns void
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not has_staff_permission(p_feature_key) then
    raise exception 'Not authorized for %', p_feature_key;
  end if;
end;
$$;

drop policy if exists "staff can read tests" on tests;
create policy "staff can read tests" on tests for select using (has_staff_permission('test_catalog') or has_staff_permission('generate_links'));

drop policy if exists "staff can read questions" on test_questions;
create policy "staff can read questions" on test_questions for select using (has_staff_permission('test_catalog') or has_staff_permission('generate_links'));

drop policy if exists "staff can read students" on students;
create policy "staff can read students" on students for select using (has_staff_permission('view_results') or has_staff_permission('view_reports'));

drop policy if exists "staff can read assignments" on test_assignments;
create policy "staff can read assignments" on test_assignments for select using (has_staff_permission('generate_links') or has_staff_permission('view_results') or has_staff_permission('view_reports'));

drop policy if exists "staff can read attempts" on test_attempts;
create policy "staff can read attempts" on test_attempts for select using (has_staff_permission('view_results') or has_staff_permission('view_reports'));

drop policy if exists "staff can read answers" on attempt_answers;
create policy "staff can read answers" on attempt_answers for select using (has_staff_permission('view_results') or has_staff_permission('view_reports'));

drop policy if exists "staff can read own permissions" on staff_permissions;
create policy "staff can read own permissions" on staff_permissions for select using ((staff_id = auth.uid() and is_staff()) or is_super_admin());

insert into tests (id, title, subject, level, status, total_points, app_path)
values
  ('starter-progress-listening', 'Starter Progress Listening', 'English', 'Cambridge Starters', 'active', 20, '/tests/starter-progress-listening/start'),
  ('starter-progress-reading-writing', 'Starter Progress Reading & Writing', 'English', 'Cambridge Starters', 'active', 25, '/tests/starter-progress-reading-writing/start'),
  ('english-literacy-1', 'English Literacy Level 1', 'English', 'English Literacy 1', 'active', 30, '/tests/english-literacy-1/start'),
  ('english-literacy-2', 'English Literacy Level 2', 'English', 'English Literacy 2', 'active', 30, '/tests/english-literacy-2/start'),
  ('english-literacy-3', 'English Literacy Level 3', 'English', 'English Literacy 3', 'active', 30, '/tests/english-literacy-3/start'),
  ('english-literacy-4', 'English Literacy Level 4', 'English', 'English Literacy 4', 'active', 30, '/tests/english-literacy-4/start'),
  ('english-literacy-5', 'English Literacy Level 5', 'English', 'English Literacy 5', 'active', 30, '/tests/english-literacy-5/start'),
  ('math-olympiad-1', 'Math Olympiad Level 1', 'Math', 'Math Olympiad 1', 'active', 30, '/tests/math-olympiad-1/start'),
  ('math-olympiad-2', 'Math Olympiad Level 2', 'Math', 'Math Olympiad 2', 'active', 30, '/tests/math-olympiad-2/start'),
  ('math-olympiad-3', 'Math Olympiad Level 3', 'Math', 'Math Olympiad 3', 'active', 30, '/tests/math-olympiad-3/start'),
  ('math-olympiad-4', 'Math Olympiad Level 4', 'Math', 'Math Olympiad 4', 'active', 30, '/tests/math-olympiad-4/start'),
  ('math-olympiad-5', 'Math Olympiad Level 5', 'Math', 'Math Olympiad 5', 'active', 30, '/tests/math-olympiad-5/start'),
  ('math-olympiad-6', 'Math Olympiad Level 6', 'Math', 'Math Olympiad 6', 'active', 30, '/tests/math-olympiad-6/start'),
  ('spip-year-7-english-pre', 'SPIP Year 7 English Pre-test', 'English', 'SPIP Year 7', 'active', 50, '/tests/spip-year-7-english-pre/start'),
  ('spip-year-7-math-pre', 'SPIP Year 7 Math Pre-test', 'Math', 'SPIP Year 7', 'active', 40, '/tests/spip-year-7-math-pre/start'),
  ('spip-year-7-science-pre', 'SPIP Year 7 Science Pre-test', 'Science', 'SPIP Year 7', 'active', 50, '/tests/spip-year-7-science-pre/start'),
  ('summer-english-level-1-pretest', 'Summer English Level 1 Pre-test', 'English', 'Summer English Level 1', 'active', 30, '/tests/summer-english-level-1-pretest/start'),
  ('summer-english-level-2-pretest', 'Summer English Level 2 Pre-test', 'English', 'Summer English Level 2', 'active', 30, '/tests/summer-english-level-2-pretest/start'),
  ('summer-english-level-3-pretest', 'Summer English Level 3 Pre-test', 'English', 'Summer English Level 3', 'active', 30, '/tests/summer-english-level-3-pretest/start')
on conflict (id) do update set
  title = excluded.title,
  subject = excluded.subject,
  level = excluded.level,
  status = excluded.status,
  total_points = excluded.total_points,
  app_path = excluded.app_path;

insert into test_questions (id, test_id, part, prompt, answer_key, transcript_ref, points, position)
values
  ('starter-listening-part1', 'starter-progress-listening', 'Listening Part 1', 'Put each object in the correct place in the room.', '{"source":"mathMultiPart","display":"clock: between the two pictures; book: under the small table; phone: mat; camera: cupboard; shell: table next to the robot","parts":[{"id":"clock","accepted":["between-pictures"],"points":1},{"id":"book","accepted":["under-table"],"points":1},{"id":"phone","accepted":["rug"],"points":1},{"id":"camera","accepted":["cupboard"],"points":1},{"id":"shell","accepted":["robot"],"points":1}],"status":"registry"}', null, 5, 1),
  ('starter-listening-part2', 'starter-progress-listening', 'Listening Part 2', 'Listen and write the answers.', '{"source":"mathMultiPart","display":"1 Alex; 2 eight; 3 three; 4 socks; 5 twelve","parts":[{"id":"p2q1","accepted":["Alex"],"points":1},{"id":"p2q2","accepted":["8","eight","class 8","class eight"],"points":1},{"id":"p2q3","accepted":["3","three"],"points":1},{"id":"p2q4","accepted":["Socks"],"points":1},{"id":"p2q5","accepted":["12","twelve"],"points":1}],"status":"registry"}', null, 5, 2),
  ('starter-listening-p3q1', 'starter-progress-listening', 'Listening Part 3', 'Which is May?', '{"source":"questionMap","accepted":["a"],"display":"A","status":"registry"}', null, 1, 3),
  ('starter-listening-p3q2', 'starter-progress-listening', 'Listening Part 3', 'Which is Nick''s favourite ice-cream?', '{"source":"questionMap","accepted":["b"],"display":"B","status":"registry"}', null, 1, 4),
  ('starter-listening-p3q3', 'starter-progress-listening', 'Listening Part 3', 'What is Ben doing?', '{"source":"questionMap","accepted":["b"],"display":"B","status":"registry"}', null, 1, 5),
  ('starter-listening-p3q4', 'starter-progress-listening', 'Listening Part 3', 'Where is Kim''s doll?', '{"source":"questionMap","accepted":["c"],"display":"C","status":"registry"}', null, 1, 6),
  ('starter-listening-p3q5', 'starter-progress-listening', 'Listening Part 3', 'What is Dad doing?', '{"source":"questionMap","accepted":["a"],"display":"A","status":"registry"}', null, 1, 7),
  ('starter-listening-part4', 'starter-progress-listening', 'Listening Part 4', 'Colour the picture.', '{"source":"mathMultiPart","display":"bird on man''s head: pink; bird in tree: yellow; flying bird: green; bird near house: brown; bird between flowers: red","parts":[{"id":"man-bird","accepted":["#f472b6"],"points":1},{"id":"tree-bird","accepted":["#facc15"],"points":1},{"id":"flying-bird","accepted":["#22c55e"],"points":1},{"id":"standing-bird","accepted":["#8b5a2b"],"points":1},{"id":"flower-bird","accepted":["#ef4444"],"points":1}],"status":"registry"}', null, 5, 8),
  ('starter-rw-p1q1', 'starter-progress-reading-writing', 'Reading & Writing Part 1', 'This is a lizard.', '{"source":"questionMap","accepted":["false"],"display":"false","status":"registry"}', null, 1, 1),
  ('starter-rw-p1q2', 'starter-progress-reading-writing', 'Reading & Writing Part 1', 'This is a bike.', '{"source":"questionMap","accepted":["true"],"display":"true","status":"registry"}', null, 1, 2),
  ('starter-rw-p1q3', 'starter-progress-reading-writing', 'Reading & Writing Part 1', 'This is a pineapple.', '{"source":"questionMap","accepted":["true"],"display":"true","status":"registry"}', null, 1, 3),
  ('starter-rw-p1q4', 'starter-progress-reading-writing', 'Reading & Writing Part 1', 'This is a television.', '{"source":"questionMap","accepted":["false"],"display":"false","status":"registry"}', null, 1, 4),
  ('starter-rw-p1q5', 'starter-progress-reading-writing', 'Reading & Writing Part 1', 'This is a guitar.', '{"source":"questionMap","accepted":["true"],"display":"true","status":"registry"}', null, 1, 5),
  ('starter-rw-p2q1', 'starter-progress-reading-writing', 'Reading & Writing Part 2', 'There are two children in the sea.', '{"source":"questionMap","accepted":["yes"],"display":"yes","status":"registry"}', null, 1, 6),
  ('starter-rw-p2q2', 'starter-progress-reading-writing', 'Reading & Writing Part 2', 'The duck is walking behind the two elephants.', '{"source":"questionMap","accepted":["yes"],"display":"yes","status":"registry"}', null, 1, 7),
  ('starter-rw-p2q3', 'starter-progress-reading-writing', 'Reading & Writing Part 2', 'The girls are playing with a ball.', '{"source":"questionMap","accepted":["no"],"display":"no","status":"registry"}', null, 1, 8),
  ('starter-rw-p2q4', 'starter-progress-reading-writing', 'Reading & Writing Part 2', 'The woman in the boat has got a camera.', '{"source":"questionMap","accepted":["yes"],"display":"yes","status":"registry"}', null, 1, 9),
  ('starter-rw-p2q5', 'starter-progress-reading-writing', 'Reading & Writing Part 2', 'The crocodile is eating a coconut.', '{"source":"questionMap","accepted":["no"],"display":"no","status":"registry"}', null, 1, 10),
  ('starter-rw-p3q1', 'starter-progress-reading-writing', 'Reading & Writing Part 3', 'Write the word.', '{"source":"questionMap","accepted":["jeans"],"display":"jeans","status":"registry"}', null, 1, 11),
  ('starter-rw-p3q2', 'starter-progress-reading-writing', 'Reading & Writing Part 3', 'Write the word.', '{"source":"questionMap","accepted":["shoes"],"display":"shoes","status":"registry"}', null, 1, 12),
  ('starter-rw-p3q3', 'starter-progress-reading-writing', 'Reading & Writing Part 3', 'Write the word.', '{"source":"questionMap","accepted":["jacket"],"display":"jacket","status":"registry"}', null, 1, 13),
  ('starter-rw-p3q4', 'starter-progress-reading-writing', 'Reading & Writing Part 3', 'Write the word.', '{"source":"questionMap","accepted":["handbag"],"display":"handbag","status":"registry"}', null, 1, 14),
  ('starter-rw-p3q5', 'starter-progress-reading-writing', 'Reading & Writing Part 3', 'Write the word.', '{"source":"questionMap","accepted":["trousers"],"display":"trousers","status":"registry"}', null, 1, 15),
  ('starter-rw-p4q1', 'starter-progress-reading-writing', 'Reading & Writing Part 4', 'Long _____ on my head.', '{"source":"questionMap","accepted":["hair"],"display":"hair","status":"registry"}', null, 1, 16),
  ('starter-rw-p4q2', 'starter-progress-reading-writing', 'Reading & Writing Part 4', 'I do not live in a _____ or a garden.', '{"source":"questionMap","accepted":["house"],"display":"house","status":"registry"}', null, 1, 17),
  ('starter-rw-p4q3', 'starter-progress-reading-writing', 'Reading & Writing Part 4', 'I like eating _____ and apples.', '{"source":"questionMap","accepted":["carrots"],"display":"carrots","status":"registry"}', null, 1, 18),
  ('starter-rw-p4q4', 'starter-progress-reading-writing', 'Reading & Writing Part 4', 'I drink _____.', '{"source":"questionMap","accepted":["water"],"display":"water","status":"registry"}', null, 1, 19),
  ('starter-rw-p4q5', 'starter-progress-reading-writing', 'Reading & Writing Part 4', 'A woman, a _____ or a child can ride me.', '{"source":"questionMap","accepted":["man"],"display":"man","status":"registry"}', null, 1, 20),
  ('starter-rw-p5q1', 'starter-progress-reading-writing', 'Reading & Writing Part 5', 'What is the teacher drawing? a ...', '{"source":"questionMap","accepted":["fish"],"display":"fish","status":"registry"}', null, 1, 21),
  ('starter-rw-p5q2', 'starter-progress-reading-writing', 'Reading & Writing Part 5', 'Who is holding the cat? a ...', '{"source":"questionMap","accepted":["girl"],"display":"girl","status":"registry"}', null, 1, 22),
  ('starter-rw-p5q3', 'starter-progress-reading-writing', 'Reading & Writing Part 5', 'What is the teacher doing now?', '{"source":"questionMap","accepted":["writing"],"display":"writing","status":"registry"}', null, 1, 23),
  ('starter-rw-p5q4', 'starter-progress-reading-writing', 'Reading & Writing Part 5', 'Where is the cat now? at the ...', '{"source":"questionMap","accepted":["window"],"display":"window","status":"registry"}', null, 1, 24),
  ('starter-rw-p5q5', 'starter-progress-reading-writing', 'Reading & Writing Part 5', 'How many children are looking at the cat?', '{"source":"questionMap","accepted":["three"],"display":"three","status":"registry"}', null, 1, 25)
on conflict (id) do update set
  test_id = excluded.test_id,
  part = excluded.part,
  prompt = excluded.prompt,
  answer_key = excluded.answer_key,
  transcript_ref = excluded.transcript_ref,
  points = excluded.points,
  position = excluded.position;

insert into test_questions (id, test_id, part, prompt, answer_key, transcript_ref, points, position)
values
  ('spip-y7e-l1', 'spip-year-7-english-pre', 'Listening Part 1', 'What did the girl buy on her shopping trip?', '{"source":"rwAnswers","accepted":["b"],"display":"B","status":"official"}', null, 1, 1),
  ('spip-y7e-l2', 'spip-year-7-english-pre', 'Listening Part 1', 'Why did the plane leave late?', '{"source":"rwAnswers","accepted":["b"],"display":"B","status":"official"}', null, 1, 2),
  ('spip-y7e-l3', 'spip-year-7-english-pre', 'Listening Part 1', 'What activity does the woman want to book for the weekend?', '{"source":"rwAnswers","accepted":["a"],"display":"A","status":"official"}', null, 1, 3),
  ('spip-y7e-l4', 'spip-year-7-english-pre', 'Listening Part 1', 'Which cake will the girl order?', '{"source":"rwAnswers","accepted":["c"],"display":"C","status":"official"}', null, 1, 4),
  ('spip-y7e-l5', 'spip-year-7-english-pre', 'Listening Part 1', 'How much must customers spend to get a free gift?', '{"source":"rwAnswers","accepted":["b"],"display":"B","status":"official"}', null, 1, 5),
  ('spip-y7e-l6', 'spip-year-7-english-pre', 'Listening Part 1', 'What did the family do on Sunday?', '{"source":"rwAnswers","accepted":["b"],"display":"B","status":"official"}', null, 1, 6),
  ('spip-y7e-l7', 'spip-year-7-english-pre', 'Listening Part 1', 'Which programme is on first?', '{"source":"rwAnswers","accepted":["c"],"display":"C","status":"official"}', null, 1, 7),
  ('spip-y7e-l8', 'spip-year-7-english-pre', 'Listening Part 2', 'What does the girl say about the new clothes shop?', '{"source":"rwAnswers","accepted":["a"],"display":"A","status":"official"}', null, 1, 8),
  ('spip-y7e-l9', 'spip-year-7-english-pre', 'Listening Part 2', 'How would the pop band''s website be better?', '{"source":"rwAnswers","accepted":["b"],"display":"B","status":"official"}', null, 1, 9),
  ('spip-y7e-l10', 'spip-year-7-english-pre', 'Listening Part 2', 'How does the woman feel about winning an art competition?', '{"source":"rwAnswers","accepted":["c"],"display":"C","status":"official"}', null, 1, 10),
  ('spip-y7e-l11', 'spip-year-7-english-pre', 'Listening Part 2', 'What does the girl think about her flatmate?', '{"source":"rwAnswers","accepted":["a"],"display":"A","status":"official"}', null, 1, 11),
  ('spip-y7e-l12', 'spip-year-7-english-pre', 'Listening Part 2', 'Why do the friends agree their football team lost?', '{"source":"rwAnswers","accepted":["a"],"display":"A","status":"official"}', null, 1, 12),
  ('spip-y7e-l13', 'spip-year-7-english-pre', 'Listening Part 2', 'What does the boy want the girl to do after the tennis match?', '{"source":"rwAnswers","accepted":["a"],"display":"A","status":"official"}', null, 1, 13),
  ('spip-y7e-l14', 'spip-year-7-english-pre', 'Listening Part 3', 'In the National Gardens, the thing that attracted most people was the', '{"source":"rwAnswers","accepted":["waterfall","waterfalls","waterfal","fantastic waterfall","fantastic waterfalls","fantastic waterfal","a waterfall","an waterfall","the waterfall","a fantastic waterfall","an fantastic waterfall","the fantastic waterfall"],"display":"waterfall","status":"official"}', null, 1, 14),
  ('spip-y7e-l15', 'spip-year-7-english-pre', 'Listening Part 3', 'Electronic armbands kept the blank away.', '{"source":"rwAnswers","accepted":["shark","sharks","a shark","an shark","the shark"],"display":"shark","status":"official"}', null, 1, 15),
  ('spip-y7e-l16', 'spip-year-7-english-pre', 'Listening Part 3', 'Anita almost fell off a', '{"source":"rwAnswers","accepted":["horse","a horse","an horse","her horse","the horse"],"display":"horse","status":"official"}', null, 1, 16),
  ('spip-y7e-l17', 'spip-year-7-english-pre', 'Listening Part 3', 'In the capital city, Anita saw a blank in a theatre.', '{"source":"rwAnswers","accepted":["musical","musical show","musical play","a musical","an musical","the musical","a musical show","an musical show","the musical show","a musical play","an musical play","the musical play"],"display":"musical","status":"official"}', null, 1, 17),
  ('spip-y7e-l18', 'spip-year-7-english-pre', 'Listening Part 3', 'Anita enjoyed visiting a farm where blank is produced.', '{"source":"rwAnswers","accepted":["sugar","suger"],"display":"sugar","status":"official"}', null, 1, 18),
  ('spip-y7e-l19', 'spip-year-7-english-pre', 'Listening Part 3', 'Anita bought some blank as gifts.', '{"source":"rwAnswers","accepted":["ring","rings","some ring","some rings"],"display":"rings","status":"official"}', null, 1, 19),
  ('spip-y7e-l20', 'spip-year-7-english-pre', 'Listening Part 4', 'Vicky first went in for competitions because', '{"source":"rwAnswers","accepted":["c"],"display":"C","status":"official"}', null, 1, 20),
  ('spip-y7e-l21', 'spip-year-7-english-pre', 'Listening Part 4', 'As a teenager, Vicky''s training involved', '{"source":"rwAnswers","accepted":["a"],"display":"A","status":"official"}', null, 1, 21),
  ('spip-y7e-l22', 'spip-year-7-english-pre', 'Listening Part 4', 'What did Vicky find hard about her training programme?', '{"source":"rwAnswers","accepted":["b"],"display":"B","status":"official"}', null, 1, 22),
  ('spip-y7e-l23', 'spip-year-7-english-pre', 'Listening Part 4', 'What helped Vicky to do well in the national finals?', '{"source":"rwAnswers","accepted":["a"],"display":"A","status":"official"}', null, 1, 23),
  ('spip-y7e-l24', 'spip-year-7-english-pre', 'Listening Part 4', 'As a swimming coach, Vicky thinks she is best at teaching people', '{"source":"rwAnswers","accepted":["a"],"display":"A","status":"official"}', null, 1, 24),
  ('spip-y7e-l25', 'spip-year-7-english-pre', 'Listening Part 4', 'Why has Vicky started doing long-distance swimming?', '{"source":"rwAnswers","accepted":["c"],"display":"C","status":"official"}', null, 1, 25),
  ('spip-y7e-r1', 'spip-year-7-english-pre', 'Reading Part 1', 'Choose the sentence that best matches the notice.', '{"source":"rwAnswers","accepted":["a"],"display":"A","status":"official"}', null, 1, 26),
  ('spip-y7e-r2', 'spip-year-7-english-pre', 'Reading Part 1', 'Adam is telling Rachel to', '{"source":"rwAnswers","accepted":["c"],"display":"C","status":"official"}', null, 1, 27),
  ('spip-y7e-r3', 'spip-year-7-english-pre', 'Reading Part 1', 'Choose the sentence that best matches the laboratory notice.', '{"source":"rwAnswers","accepted":["c"],"display":"C","status":"official"}', null, 1, 28),
  ('spip-y7e-r4', 'spip-year-7-english-pre', 'Reading Part 1', 'Choose the sentence that best matches Tom''s message to Jane.', '{"source":"rwAnswers","accepted":["b"],"display":"B","status":"official"}', null, 1, 29),
  ('spip-y7e-r5', 'spip-year-7-english-pre', 'Reading Part 1', 'Choose the sentence that best matches the Careers Centre notice.', '{"source":"rwAnswers","accepted":["a"],"display":"A","status":"official"}', null, 1, 30),
  ('spip-y7e-r6', 'spip-year-7-english-pre', 'Reading Part 2', 'Jenny wants locally-produced traditional food, somewhere convenient to eat, and a market near local attractions.', '{"source":"rwAnswers","accepted":["f"],"display":"F","status":"official"}', null, 1, 31),
  ('spip-y7e-r7', 'spip-year-7-english-pre', 'Reading Part 2', 'Matt wants reasonably priced clothes, something hot to eat, and rare recordings by different bands.', '{"source":"rwAnswers","accepted":["g"],"display":"G","status":"official"}', null, 1, 32),
  ('spip-y7e-r8', 'spip-year-7-english-pre', 'Reading Part 2', 'Sammie wants to visit after spending the day in the city, photograph a historic place, and buy a painting by an unknown artist.', '{"source":"rwAnswers","accepted":["b"],"display":"B","status":"official"}', null, 1, 33),
  ('spip-y7e-r9', 'spip-year-7-english-pre', 'Reading Part 2', 'Alexia wants a special necklace for her grandmother, to spend the whole day at the market, and to stay inside.', '{"source":"rwAnswers","accepted":["c"],"display":"C","status":"official"}', null, 1, 34),
  ('spip-y7e-r10', 'spip-year-7-english-pre', 'Reading Part 2', 'Ella wants objects from other countries, a second-hand book for the journey home, and a snack.', '{"source":"rwAnswers","accepted":["h"],"display":"H","status":"official"}', null, 1, 35),
  ('spip-y7e-r11', 'spip-year-7-english-pre', 'Reading Part 3', 'Peter enjoys mountain biking because', '{"source":"rwAnswers","accepted":["c"],"display":"C","status":"official"}', null, 1, 36),
  ('spip-y7e-r12', 'spip-year-7-english-pre', 'Reading Part 3', 'What does Peter say about cycling during his childhood?', '{"source":"rwAnswers","accepted":["c"],"display":"C","status":"official"}', null, 1, 37),
  ('spip-y7e-r13', 'spip-year-7-english-pre', 'Reading Part 3', 'Peter says he returned to cycling after several years', '{"source":"rwAnswers","accepted":["d"],"display":"D","status":"official"}', null, 1, 38),
  ('spip-y7e-r14', 'spip-year-7-english-pre', 'Reading Part 3', 'How does Peter feel about cycling now?', '{"source":"rwAnswers","accepted":["a"],"display":"A","status":"official"}', null, 1, 39),
  ('spip-y7e-r15', 'spip-year-7-english-pre', 'Reading Part 3', 'What would be a good introduction to this article?', '{"source":"rwAnswers","accepted":["b"],"display":"B","status":"official"}', null, 1, 40),
  ('spip-y7e-r16', 'spip-year-7-english-pre', 'Reading Part 4', 'A new life, gap 16', '{"source":"rwAnswers","accepted":["g"],"display":"G","status":"official"}', null, 1, 41),
  ('spip-y7e-r17', 'spip-year-7-english-pre', 'Reading Part 4', 'A new life, gap 17', '{"source":"rwAnswers","accepted":["e"],"display":"E","status":"official"}', null, 1, 42),
  ('spip-y7e-r18', 'spip-year-7-english-pre', 'Reading Part 4', 'A new life, gap 18', '{"source":"rwAnswers","accepted":["f"],"display":"F","status":"official"}', null, 1, 43),
  ('spip-y7e-r19', 'spip-year-7-english-pre', 'Reading Part 4', 'A new life, gap 19', '{"source":"rwAnswers","accepted":["b"],"display":"B","status":"official"}', null, 1, 44),
  ('spip-y7e-r20', 'spip-year-7-english-pre', 'Reading Part 4', 'A new life, gap 20', '{"source":"rwAnswers","accepted":["d"],"display":"D","status":"official"}', null, 1, 45),
  ('spip-y7e-w1', 'spip-year-7-english-pre', 'Writing', 'Write a card to Jo apologising for not being able to go to the birthday party, explaining why you cannot go, and saying what present you are sending.', '{"source":"aiGrade","display":"5-mark writing rubric: apology, reason, present, and language/format/word count","status":"writing_rubric"}', null, 5, 46)
on conflict (id) do update set
  test_id = excluded.test_id,
  part = excluded.part,
  prompt = excluded.prompt,
  answer_key = excluded.answer_key,
  transcript_ref = excluded.transcript_ref,
  points = excluded.points,
  position = excluded.position;

insert into test_questions (id, test_id, part, prompt, answer_key, transcript_ref, points, position)
values
  ('spip-y7m-q1', 'spip-year-7-math-pre', 'Questions 1-6', 'Join pairs of decimals to make 1.', '{"source":"mathMultiPart","display":"0.62+0.38; 0.25+0.75; 0.19+0.81; 0.56+0.44","parts":[{"id":"p1","accepted":["0.62 + 0.38","0.38 + 0.62","0.62,0.38","0.38,0.62"],"points":0.5},{"id":"p2","accepted":["0.25 + 0.75","0.75 + 0.25","0.25,0.75","0.75,0.25"],"points":0.5},{"id":"p3","accepted":["0.19 + 0.81","0.81 + 0.19","0.19,0.81","0.81,0.19"],"points":0.5},{"id":"p4","accepted":["0.56 + 0.44","0.44 + 0.56","0.56,0.44","0.44,0.56"],"points":0.5}]}', null, 2, 1),
  ('spip-y7m-q2', 'spip-year-7-math-pre', 'Questions 1-6', 'Translate triangle A by 4 squares up and 2 squares left.', '{"source":"mathMultiPart","display":"2 left, 4 up","parts":[{"id":"dx","accepted":["-2"],"points":0.5},{"id":"dy","accepted":["4"],"points":0.5}]}', null, 1, 2),
  ('spip-y7m-q3', 'spip-year-7-math-pre', 'Questions 1-6', 'Draw a ring around the largest number in each pair.', '{"source":"mathMultiPart","display":"9810; half a million; 15 060; 25; -271","parts":[{"id":"r1","accepted":["9810"],"points":0.4},{"id":"r2","accepted":["half a million","500000","500,000"],"points":0.4},{"id":"r3","accepted":["15060","15 060","15,060"],"points":0.4},{"id":"r4","accepted":["25"],"points":0.4},{"id":"r5","accepted":["-271"],"points":0.4}]}', null, 2, 3),
  ('spip-y7m-q4', 'spip-year-7-math-pre', 'Questions 1-6', 'Write in figures: three hundredths.', '{"source":"mathMultiPart","display":"0.03","parts":[{"id":"answer","accepted":["0.03",".03","3/100"],"points":1}]}', null, 1, 4),
  ('spip-y7m-q5', 'spip-year-7-math-pre', 'Questions 1-6', 'Calculate 6.8 + 17.38.', '{"source":"mathMultiPart","display":"24.18","parts":[{"id":"answer","accepted":["24.18"],"points":1}]}', null, 1, 5),
  ('spip-y7m-q6', 'spip-year-7-math-pre', 'Questions 1-6', 'Write 1085 thousandths as a decimal.', '{"source":"mathMultiPart","display":"1.085","parts":[{"id":"answer","accepted":["1.085"],"points":1}]}', null, 1, 6),
  ('spip-y7m-q7', 'spip-year-7-math-pre', 'Questions 7-14', 'The digital scale shows 16 500 g. Show this mass on the kg scale.', '{"source":"mathMultiPart","display":"16.5 kg","parts":[{"id":"answer","accepted":["16.5 kg","16.5","16.5kg","16 1/2 kg"],"points":1}]}', null, 1, 7),
  ('spip-y7m-q8', 'spip-year-7-math-pre', 'Questions 7-14', 'The table shows the times for a race. Who was the third fastest runner and what was their time?', '{"source":"mathMultiPart","display":"Manjit, 14.5 seconds","parts":[{"id":"name","accepted":["manjit"],"points":1},{"id":"time","accepted":["14.5","14.50"],"points":1}]}', null, 2, 8),
  ('spip-y7m-q9', 'spip-year-7-math-pre', 'Questions 7-14', 'Tick the two patterns that can be made with the stamp.', '{"source":"mathMultiPart","display":"A, B","parts":[{"id":"selected","accepted":["a,b"],"points":2}]}', null, 2, 9),
  ('spip-y7m-q10', 'spip-year-7-math-pre', 'Questions 7-14', 'In the number 485 136, what is the value of the 4?', '{"source":"mathMultiPart","display":"400 000","parts":[{"id":"answer","accepted":["400000","400,000","four hundred thousand"],"points":1}]}', null, 1, 10),
  ('spip-y7m-q11', 'spip-year-7-math-pre', 'Questions 7-14', 'A train leaves at 08:00 and the journey takes 7 hours. Write the start and finish times.', '{"source":"mathMultiPart","display":"8 am; 3 pm","parts":[{"id":"start","accepted":["8 am","8am","08:00","8:00"],"points":1},{"id":"finish","accepted":["3 pm","3pm","15:00","3:00 pm"],"points":1}]}', null, 2, 11),
  ('spip-y7m-q12', 'spip-year-7-math-pre', 'Questions 7-14', 'Fill in the missing numbers.', '{"source":"mathMultiPart","display":"270; 5.5","parts":[{"id":"a","accepted":["270"],"points":0.5},{"id":"b","accepted":["5.5","5 1/2","11/2"],"points":0.5}]}', null, 1, 12),
  ('spip-y7m-q13', 'spip-year-7-math-pre', 'Questions 7-14', 'Write the missing digits in the boxes.', '{"source":"mathMultiPart","display":"1; 9; 3; 7","parts":[{"id":"a","accepted":["1"],"points":0.5},{"id":"b","accepted":["9"],"points":0.5},{"id":"c","accepted":["3"],"points":0.5},{"id":"d","accepted":["7"],"points":0.5}]}', null, 2, 13),
  ('spip-y7m-q14', 'spip-year-7-math-pre', 'Questions 7-14', 'Draw a line to match each statement to its likelihood.', '{"source":"mathMultiPart","display":"multiple of 4 -> unlikely; 4 digits -> impossible; odd -> even chance","parts":[{"id":"matches","accepted":["digits4:impossible,odd:even","odd:even,digits4:impossible"],"points":2}]}', null, 2, 14),
  ('spip-y7m-q15', 'spip-year-7-math-pre', 'Questions 15-21', 'Write the missing numbers.', '{"source":"mathMultiPart","display":"1500; 100","parts":[{"id":"a","accepted":["1500","1,500"],"points":1},{"id":"b","accepted":["100"],"points":1}]}', null, 2, 15),
  ('spip-y7m-q16', 'spip-year-7-math-pre', 'Questions 15-21', 'What is 25% of 56?', '{"source":"mathMultiPart","display":"14","parts":[{"id":"answer","accepted":["14"],"points":1}]}', null, 1, 16),
  ('spip-y7m-q17', 'spip-year-7-math-pre', 'Questions 15-21', 'The sports club table shows pupils attending activities. Which pupils attended all three activities?', '{"source":"mathMultiPart","display":"Rajiv, Hassan, Youssef","parts":[{"id":"selected","accepted":["hassan,rajiv,youssef","hassan,youssef,rajiv","rajiv,hassan,youssef","rajiv,youssef,hassan","youssef,hassan,rajiv","youssef,rajiv,hassan"],"points":2}]}', null, 2, 17),
  ('spip-y7m-q18', 'spip-year-7-math-pre', 'Questions 15-21', 'Write the time shown on the clock, then write the time 2 hours 15 minutes later.', '{"source":"mathMultiPart","display":"10:47; 13:02","parts":[{"id":"a","accepted":["10:47","10.47"],"points":1},{"id":"b","accepted":["13:02","1:02 pm","1.02 pm"],"points":1}]}', null, 2, 18),
  ('spip-y7m-q19', 'spip-year-7-math-pre', 'Questions 15-21', 'Write the missing numbers in the multiplication grid.', '{"source":"mathMultiPart","display":"1.2; 0.4; 2.4; 2.8","parts":[{"id":"a","accepted":["1.2"],"points":0.5},{"id":"b","accepted":["0.4"],"points":0.5},{"id":"c","accepted":["2.4"],"points":0.5},{"id":"d","accepted":["2.8"],"points":0.5}]}', null, 2, 19),
  ('spip-y7m-q20', 'spip-year-7-math-pre', 'Questions 15-21', 'Write the missing numbers in the sequence.', '{"source":"mathMultiPart","display":"255; -45","parts":[{"id":"a","accepted":["255"],"points":1},{"id":"b","accepted":["-45"],"points":1}]}', null, 2, 20),
  ('spip-y7m-q21', 'spip-year-7-math-pre', 'Questions 15-21', 'Find the missing angles.', '{"source":"mathMultiPart","display":"33; 158","parts":[{"id":"a","accepted":["33","32","34"],"points":1},{"id":"b","accepted":["158","158 degrees"],"points":1}]}', null, 2, 21),
  ('spip-y7m-q22', 'spip-year-7-math-pre', 'Questions 22-30', 'Write in the missing digits to make the calculation correct.', '{"source":"mathMultiPart","display":"3.58 + 2.05 = 5.63","parts":[{"id":"top","accepted":["5"],"points":0.34},{"id":"bottomLeft","accepted":["2"],"points":0.33},{"id":"bottomRight","accepted":["5"],"points":0.33}]}', null, 1, 22),
  ('spip-y7m-q23', 'spip-year-7-math-pre', 'Questions 22-30', 'Write the missing number in each box.', '{"source":"mathMultiPart","display":"7450.3; 603.19","parts":[{"id":"a","accepted":["7450.3","7,450.3"],"points":1},{"id":"b","accepted":["603.19"],"points":1}]}', null, 2, 23),
  ('spip-y7m-q24', 'spip-year-7-math-pre', 'Questions 22-30', 'Use 26 x 15 = 390 to show how to work out 26 x 14.', '{"source":"mathMultiPart","display":"390 - 26 = 364","parts":[{"id":"answer","accepted":[],"normalizer":"keywords","keywords":[["390","26","364"]],"points":2,"reviewRecommended":false}]}', null, 2, 24),
  ('spip-y7m-q25', 'spip-year-7-math-pre', 'Questions 22-30', 'Put these values in order from smallest to largest: 0.65, 2/3, 0.57, 3/5.', '{"source":"mathMultiPart","display":"0.57, 3/5, 0.65, 2/3","parts":[{"id":"a","accepted":["0.57"],"points":0.25},{"id":"b","accepted":["3/5","0.6"],"points":0.25},{"id":"c","accepted":["0.65"],"points":0.25},{"id":"d","accepted":["2/3","0.666","0.667"],"points":0.25}]}', null, 1, 25),
  ('spip-y7m-q26', 'spip-year-7-math-pre', 'Questions 22-30', 'Write three numbers with a mode of 6 and a mean of 7.', '{"source":"mathMultiPart","display":"6, 6, 9","parts":[{"id":"a","accepted":["6"],"points":0.67},{"id":"b","accepted":["6"],"points":0.67},{"id":"c","accepted":["9"],"points":0.66}]}', null, 2, 26),
  ('spip-y7m-q27', 'spip-year-7-math-pre', 'Questions 22-30', 'Yuri says that 6/8 is larger than 3/4. Is Yuri correct? Use a calculation to explain.', '{"source":"mathMultiPart","display":"No, because 6/8 = 3/4","parts":[{"id":"answer","accepted":[],"normalizer":"keywords","keywords":[["no","6/8","3/4"],["no","equal"],["no","same"]],"points":2,"reviewRecommended":false}]}', null, 2, 27),
  ('spip-y7m-q28', 'spip-year-7-math-pre', 'Questions 22-30', 'Finn counts in steps of 0.3 starting at 1. What is the 10th number he says?', '{"source":"mathMultiPart","display":"3.7","parts":[{"id":"answer","accepted":["3.7"],"points":1}]}', null, 1, 28),
  ('spip-y7m-q29', 'spip-year-7-math-pre', 'Questions 22-30', 'Write 8/5 as a mixed number.', '{"source":"mathMultiPart","display":"1 3/5","parts":[{"id":"answer","accepted":["1 3/5","1.6","8/5"],"points":1}]}', null, 1, 29),
  ('spip-y7m-q30', 'spip-year-7-math-pre', 'Questions 22-30', 'Reflect the shaded shape in the mirror line.', '{"source":"mathMultiPart","display":"Correct reflected shape","parts":[{"id":"cells","accepted":["5-1,6-1,6-2,7-2,7-3,7-4"],"points":2}]}', null, 2, 30)
on conflict (id) do update set
  test_id = excluded.test_id,
  part = excluded.part,
  prompt = excluded.prompt,
  answer_key = excluded.answer_key,
  transcript_ref = excluded.transcript_ref,
  points = excluded.points,
  position = excluded.position;

insert into test_questions (id, test_id, part, prompt, answer_key, transcript_ref, points, position)
values
  ('spip-y7s-q1', 'spip-year-7-science-pre', 'Questions 1-4', 'Question 1: Some materials are electrical conductors and others are electrical insulators. Complete the table about these materials.', '{"source":"mathMultiPart","display":"copper: conductor; graphite: conductor; plastic, rubber, wood: insulator","parts":[{"id":"copper","accepted":["conductor"],"points":0.6},{"id":"graphite","accepted":["conductor"],"points":0.6},{"id":"plastic","accepted":["insulator"],"points":0.6},{"id":"rubber","accepted":["insulator"],"points":0.6},{"id":"wood","accepted":["insulator"],"points":0.6}],"scoreThresholds":[{"minCorrect":5,"points":3},{"minCorrect":3,"points":2},{"minCorrect":1,"points":1}]}', null, 3, 1),
  ('spip-y7s-q2', 'spip-year-7-science-pre', 'Questions 1-4', 'Question 2: Label the organs on the diagram of a human body.', '{"source":"mathMultiPart","display":"brain; heart; lung; stomach; kidney; small intestine","parts":[{"id":"brain","accepted":["brain"],"points":0.5},{"id":"heart","accepted":["heart"],"points":0.5},{"id":"kidney","accepted":["kidney","kidneys"],"points":0.5},{"id":"lungs","accepted":["lung","lungs"],"points":0.5},{"id":"stomach","accepted":["stomach"],"points":0.5},{"id":"intestines","accepted":["intestine","intestines","small intestine"],"points":0.5}],"scoreThresholds":[{"minCorrect":6,"points":3},{"minCorrect":4,"points":2},{"minCorrect":2,"points":1}]}', null, 3, 2),
  ('spip-y7s-q3', 'spip-year-7-science-pre', 'Questions 1-4', 'Question 3: Mike is exploring electrical circuits. The lamps are very dim. What can he do to make the lamps brighter?', '{"source":"mathMultiPart","display":"add another cell","parts":[{"id":"answer","accepted":["add another cell"],"points":1}]}', null, 1, 3),
  ('spip-y7s-q4a', 'spip-year-7-science-pre', 'Questions 1-4', 'Question 4(a): Blessy keeps the temperature of the water for each solid the same. Explain why.', '{"source":"mathMultiPart","display":"So it is a fair test because temperature affects how much solid dissolves.","parts":[{"id":"answer","accepted":[],"points":1,"normalizer":"keywords","keywords":[["fair","test"],["temperature","affect","dissolv"],["same","compare"],["hotter","dissolv"],["colder","dissolv"],["different","amount"]],"reviewRecommended":true}],"status":"reviewRecommended"}', null, 1, 4),
  ('spip-y7s-q4b', 'spip-year-7-science-pre', 'Questions 1-4', 'Question 4(b): Blessy thinks it is a good idea to repeat her investigation. Explain why.', '{"source":"mathMultiPart","display":"Repeating makes the results more reliable and helps check for mistakes.","parts":[{"id":"answer","accepted":[],"points":1,"normalizer":"keywords","keywords":[["reliable"],["accurate"],["check","mistake"],["average"]],"reviewRecommended":true}],"status":"reviewRecommended"}', null, 1, 5),
  ('spip-y7s-q4c', 'spip-year-7-science-pre', 'Questions 1-4', 'Question 4(c): Blessy has started to draw a bar chart of the results. Complete the bar chart. Include the scale on the y-axis, label on the y-axis, and the other three bars and their labels.', '{"source":"mathMultiPart","display":"scale 10, 20, 30; fertiliser 30 g; salt 8 g; baking powder 5 g","parts":[{"id":"scale_top","accepted":["30","30 g"],"points":0.25},{"id":"scale_middle","accepted":["20","20 g"],"points":0.25},{"id":"scale_bottom","accepted":["10","10 g"],"points":0.25},{"id":"solid_4","accepted":["fertiliser","fertilizer"],"points":0.25},{"id":"fertiliser","accepted":["30","30 g"],"points":0.5},{"id":"solid_5","accepted":["salt"],"points":0.25},{"id":"salt","accepted":["8","8 g"],"points":0.5},{"id":"solid_6","accepted":["baking powder"],"points":0.25},{"id":"baking_powder","accepted":["5","5 g"],"points":0.5}],"status":"reviewRecommended"}', null, 3, 6),
  ('spip-y7s-q4d', 'spip-year-7-science-pre', 'Questions 1-4', 'Question 4(d): Which solid is the most soluble in water?', '{"source":"mathMultiPart","display":"fertiliser","parts":[{"id":"answer","accepted":["fertiliser","fertilizer"],"points":1}]}', null, 1, 7),
  ('spip-y7s-q5a', 'spip-year-7-science-pre', 'Questions 5-8', 'Question 5(a): Use the information to draw a food chain. Draw arrows between the boxes to show the direction of energy flow.', '{"source":"mathMultiPart","display":"leaf -> caterpillar -> bird -> snake -> owl","parts":[{"id":"pos1","accepted":["leaf"],"points":0.4},{"id":"pos2","accepted":["caterpillar"],"points":0.4},{"id":"pos3","accepted":["bird"],"points":0.4},{"id":"pos4","accepted":["snake"],"points":0.4},{"id":"pos5","accepted":["owl"],"points":0.4}]}', null, 2, 8),
  ('spip-y7s-q5b', 'spip-year-7-science-pre', 'Questions 5-8', 'Question 5(b): Which living thing is the producer in this food chain?', '{"source":"mathMultiPart","display":"leaf","parts":[{"id":"answer","accepted":["leaf","plant","the leaf","tree"],"points":1}]}', null, 1, 9),
  ('spip-y7s-q6a', 'spip-year-7-science-pre', 'Questions 5-8', 'Question 6(a): Yuri wants to separate a mixture of salt, sand and water. What dissolves in stage B?', '{"source":"mathMultiPart","display":"salt","parts":[{"id":"answer","accepted":["salt"],"points":1}]}', null, 1, 10),
  ('spip-y7s-q6b', 'spip-year-7-science-pre', 'Questions 5-8', 'Question 6(b): What is substance X?', '{"source":"mathMultiPart","display":"salt","parts":[{"id":"answer","accepted":["salt","wet salt"],"points":1}]}', null, 1, 11),
  ('spip-y7s-q7a', 'spip-year-7-science-pre', 'Questions 5-8', 'Question 7(a): Complete Lily''s sentences. Choose from: centimetres, kilograms, newtons, seconds.', '{"source":"mathMultiPart","display":"Mass: kilograms; Weight: newtons; Force: newtons","parts":[{"id":"mass","accepted":["kilograms","kg"],"points":1},{"id":"weight","accepted":["newtons","newton"],"points":1},{"id":"force","accepted":["newtons","newton"],"points":1}]}', null, 3, 12),
  ('spip-y7s-q7b', 'spip-year-7-science-pre', 'Questions 5-8', 'Question 7(b): Choose the arrow that shows the direction of the force of gravity on Lily.', '{"source":"mathMultiPart","display":"down","parts":[{"id":"answer","accepted":["down"],"points":1}]}', null, 1, 13),
  ('spip-y7s-q8a', 'spip-year-7-science-pre', 'Questions 5-8', 'Question 8(a): Only one solid can be separated from water by filtration. Which one?', '{"source":"mathMultiPart","display":"C","parts":[{"id":"answer","accepted":["C"],"points":1}]}', null, 1, 14),
  ('spip-y7s-q8b', 'spip-year-7-science-pre', 'Questions 5-8', 'Question 8(b): There is a reversible change when solid A is added to water. Describe how you could reverse this change.', '{"source":"mathMultiPart","display":"Heat it, evaporate the water, or leave it in the Sun to get the solid back.","parts":[{"id":"answer","accepted":[],"points":1,"normalizer":"keywords","keywords":[["evaporat"],["heat"],["sun"],["water","solid"],["crystal"]],"reviewRecommended":true}],"status":"reviewRecommended"}', null, 1, 15),
  ('spip-y7s-q8c', 'spip-year-7-science-pre', 'Questions 5-8', 'Question 8(c): Two of the solids have an irreversible change when added to water. Write the letter of one of these solids. Explain how you can tell from the results.', '{"source":"mathMultiPart","display":"D because it fizzes/forms gas, or E because the temperature changes/gets colder.","parts":[{"id":"letter","accepted":["D","E"],"points":1},{"id":"explanation","accepted":[],"points":1,"normalizer":"keywords","keywords":[["fizz"],["gas"],["bubble"],["colder"],["temperature","change"]],"reviewRecommended":true}],"status":"reviewRecommended"}', null, 2, 16),
  ('spip-y7s-q9a', 'spip-year-7-science-pre', 'Questions 9-12', 'Question 9(a): Mike must use the heart machine to stay alive. Explain what the heart machine does.', '{"source":"mathMultiPart","display":"It does the work of the heart: it pumps blood around the body, supplying oxygen and food/nutrients to organs.","parts":[{"id":"answer","accepted":[],"points":1,"normalizer":"keywords","keywords":[["does","heart"],["place","heart"],["instead","heart"],["takes","heart"],["heart","normally"]],"reviewRecommended":true},{"id":"answer","accepted":[],"points":1,"normalizer":"keywords","keywords":[["pump","blood"],["circulat","blood"]],"reviewRecommended":true},{"id":"answer","accepted":[],"points":1,"normalizer":"keywords","keywords":[["oxygen"]],"reviewRecommended":true},{"id":"answer","accepted":[],"points":1,"normalizer":"keywords","keywords":[["food"],["nutrient"]],"reviewRecommended":true},{"id":"answer","accepted":[],"points":1,"normalizer":"keywords","keywords":[["organ"],["around","body"],["body"]],"reviewRecommended":true}],"status":"reviewRecommended"}', null, 2, 17),
  ('spip-y7s-q9b', 'spip-year-7-science-pre', 'Questions 9-12', 'Question 9(b): Mike takes the extra heart machine with him when he goes outside. Explain why Mike needs an extra heart machine.', '{"source":"mathMultiPart","display":"In case the first heart machine or its batteries stop working or break.","parts":[{"id":"answer","accepted":[],"points":1,"normalizer":"keywords","keywords":[["break"],["stop","work"],["fail"],["backup"],["spare"],["battery"]],"reviewRecommended":true}],"status":"reviewRecommended"}', null, 1, 18),
  ('spip-y7s-q10', 'spip-year-7-science-pre', 'Questions 9-12', 'Question 10: Draw a line from the statement to the correct explanation.', '{"source":"mathMultiPart","display":"A rollercoaster is able to climb up the hill because its movement gives it the energy to get to the top of the hill.","parts":[{"id":"climb","accepted":["movement energy"],"points":1}]}', null, 1, 19),
  ('spip-y7s-q11a', 'spip-year-7-science-pre', 'Questions 9-12', 'Question 11(a): Glass, plastic and metal can be recycled. Write down the name of another material that can be recycled.', '{"source":"mathMultiPart","display":"paper, card/cardboard, cloth, books, magazines, batteries, or ink cartridges","parts":[{"id":"answer","accepted":["paper","cardboard","card","cloth","book","books","magazine","magazines","clothes","battery","batteries","ink cartridge","ink cartridges"],"points":1}]}', null, 1, 20),
  ('spip-y7s-q11b', 'spip-year-7-science-pre', 'Questions 9-12', 'Question 11(b): Complete the sentences about why the diaper cannot be recycled and how to reduce waste in the environment.', '{"source":"mathMultiPart","display":"It is dirty, toxic, or contains microbes; use a washable/reusable diaper, or compost a biodegradable one.","parts":[{"id":"cannot_recycle","accepted":[],"points":1,"normalizer":"keywords","keywords":[["dirty"],["waste"],["soiled"],["toxic"],["microbe"],["mixed","material"],["cannot","recycle"],["used"]],"reviewRecommended":true},{"id":"reduce_waste","accepted":[],"points":1,"normalizer":"keywords","keywords":[["reuse"],["wash"],["cloth"],["reusable"],["compost"],["biodegrad"]],"reviewRecommended":true}],"status":"reviewRecommended"}', null, 2, 21),
  ('spip-y7s-q12a', 'spip-year-7-science-pre', 'Questions 9-12', 'Question 12(a): Complete the sentences about sugar water. Choose from: insoluble, soluble, solution, sugar, water.', '{"source":"mathMultiPart","display":"solvent: water; solute: sugar; sugar is soluble","parts":[{"id":"solvent","accepted":["water"],"points":0.67},{"id":"solute","accepted":["sugar","soluble"],"points":0.67},{"id":"soluble","accepted":["soluble"],"points":0.66}]}', null, 2, 22),
  ('spip-y7s-q12b', 'spip-year-7-science-pre', 'Questions 9-12', 'Question 12(b): When sugar dissolves in water, is the sugar still in the water?', '{"source":"mathMultiPart","display":"yes","parts":[{"id":"answer","accepted":["yes"],"points":1}]}', null, 1, 23),
  ('spip-y7s-q13a', 'spip-year-7-science-pre', 'Questions 13-16', 'Question 13(a): Pierre is testing which materials are electrical conductors. Put each instruction letter in the correct order.', '{"source":"mathMultiPart","display":"D, A, C, B","parts":[{"id":"pos1","accepted":["D"],"points":0.5},{"id":"pos2","accepted":["A"],"points":0.5},{"id":"pos3","accepted":["C"],"points":0.5},{"id":"pos4","accepted":["B"],"points":0.5}]}', null, 2, 24),
  ('spip-y7s-q13b', 'spip-year-7-science-pre', 'Questions 13-16', 'Question 13(b): Pierre thinks one of his results is incorrect. He wants to test this material again. Which material does he test again?', '{"source":"mathMultiPart","display":"steel","parts":[{"id":"answer","accepted":["steel"],"points":1}]}', null, 1, 25),
  ('spip-y7s-q13c', 'spip-year-7-science-pre', 'Questions 13-16', 'Question 13(c): Pierre makes a conclusion from his results. What conclusion does Pierre make?', '{"source":"mathMultiPart","display":"Metals conduct electricity and non-metals do not.","parts":[{"id":"answer","accepted":[],"points":1,"normalizer":"keywords","keywords":[["metal","conduct"],["non","metal","not"],["plastic","stone","not"],["iron","lead","copper"]],"reviewRecommended":true}],"status":"reviewRecommended"}', null, 1, 26),
  ('spip-y7s-q14a', 'spip-year-7-science-pre', 'Questions 13-16', 'Question 14(a): Aiko measures the volume of water collected from each tap. Write down the name of the apparatus she uses.', '{"source":"mathMultiPart","display":"measuring cylinder","parts":[{"id":"answer","accepted":["measuring cylinder","measuring cylinders","graduated cylinder"],"points":1}]}', null, 1, 27),
  ('spip-y7s-q14b', 'spip-year-7-science-pre', 'Questions 13-16', 'Question 14(b): Aiko writes down the results. Complete her table of results.', '{"source":"mathMultiPart","display":"tap 1: 0.0 cm3; tap 2: 1.8 cm3; tap 3: 2.9 cm3; tap 4: 3.8 cm3; tap 5: 3.3 cm3","parts":[{"id":"tap1_volume","accepted":["0.0","0","0.0 cm3","0 cm3"],"points":0.33},{"id":"tap2_number","accepted":["2","tap 2"],"points":0.33},{"id":"tap3_volume","accepted":["2.9","2.9 cm3"],"points":0.33},{"id":"tap4_number","accepted":["4","tap 4"],"points":0.33},{"id":"tap4_volume","accepted":["3.8","3.8 cm3"],"points":0.34},{"id":"tap5_volume","accepted":["3.3","3.3 cm3"],"points":0.34}],"scoreThresholds":[{"minCorrect":6,"points":2},{"minCorrect":4,"points":1}]}', null, 2, 28),
  ('spip-y7s-q14c', 'spip-year-7-science-pre', 'Questions 13-16', 'Question 14(c): There are drips from all the taps. One of the results is wrong. Circle the result that is wrong. Explain your answer.', '{"source":"mathMultiPart","display":"tap 1, because all taps drip but tap 1 has 0.0 cm3/no volume of water collected.","parts":[{"id":"choice","accepted":["tap 1"],"points":0.5},{"id":"explanation","accepted":[],"points":0.5,"normalizer":"keywords","keywords":[["all","tap","drip"],["0"],["no","water"],["no","volume"],["nothing","collected"],["other","volume"]],"reviewRecommended":true}],"status":"reviewRecommended"}', null, 1, 29),
  ('spip-y7s-q15a', 'spip-year-7-science-pre', 'Questions 13-16', 'Question 15(a): Complete the sentence: When the toy bounces up, the upward force is _____ than the downward force.', '{"source":"mathMultiPart","display":"greater","parts":[{"id":"answer","accepted":["greater","larger","more","bigger","stronger"],"points":1}]}', null, 1, 30),
  ('spip-y7s-q15b', 'spip-year-7-science-pre', 'Questions 13-16', 'Question 15(b): What does Jamila do to make the toy bounce faster?', '{"source":"mathMultiPart","display":"push on the spring more often","parts":[{"id":"answer","accepted":["push on the spring more often"],"points":1}]}', null, 1, 31),
  ('spip-y7s-q16a', 'spip-year-7-science-pre', 'Questions 13-16', 'Question 16(a): Chen cannot use a sieve to separate the mixture of sand and copper sulfate. Explain why.', '{"source":"mathMultiPart","display":"The particles are too small or similar size, so both solids would pass through the sieve.","parts":[{"id":"answer","accepted":[],"points":1,"normalizer":"keywords","keywords":[["particle","small"],["same","size"],["both","pass"],["powder"]],"reviewRecommended":true}],"status":"reviewRecommended"}', null, 1, 32),
  ('spip-y7s-q16b', 'spip-year-7-science-pre', 'Questions 13-16', 'Question 16(b): What substance does the residue contain?', '{"source":"mathMultiPart","display":"sand","parts":[{"id":"answer","accepted":["sand"],"points":1}]}', null, 1, 33),
  ('spip-y7s-q16c', 'spip-year-7-science-pre', 'Questions 13-16', 'Question 16(c): What is the name of the filtrate?', '{"source":"mathMultiPart","display":"copper sulfate solution","parts":[{"id":"answer","accepted":["copper sulfate solution","copper sulphate solution","copper sulfate","copper sulphate","blue solution"],"points":1}]}', null, 1, 34),
  ('spip-y7s-q16d', 'spip-year-7-science-pre', 'Questions 13-16', 'Question 16(d): What colour is the filtrate?', '{"source":"mathMultiPart","display":"blue","parts":[{"id":"answer","accepted":["blue"],"points":1}]}', null, 1, 35)
on conflict (id) do update set
  test_id = excluded.test_id,
  part = excluded.part,
  prompt = excluded.prompt,
  answer_key = excluded.answer_key,
  transcript_ref = excluded.transcript_ref,
  points = excluded.points,
  position = excluded.position;


insert into test_questions (id, test_id, part, prompt, answer_key, transcript_ref, points, position)
values
  ('mo1-q1', 'math-olympiad-1', 'Part I', 'What are the missing numbers?', '{"source":"mathMultiPart","display":"5, 7, 9","parts":[{"id":"a","accepted":["5"],"points":0.34},{"id":"b","accepted":["7"],"points":0.33},{"id":"c","accepted":["9"],"points":0.33}]}', null, 1, 1),
  ('mo1-q2', 'math-olympiad-1', 'Part I', 'Complete the number bond.', '{"source":"mathMultiPart","display":"3, 1","parts":[{"id":"top","accepted":["3"],"points":0.5},{"id":"bottom","accepted":["1"],"points":0.5}]}', null, 1, 2),
  ('mo1-q3', 'math-olympiad-1', 'Part I', 'There are 5 oranges. Add 3 more oranges.', '{"source":"mathMultiPart","display":"8, 8","parts":[{"id":"equation","accepted":["8"],"points":1},{"id":"total","accepted":["8"],"points":1}]}', null, 2, 3),
  ('mo1-q4', 'math-olympiad-1', 'Part I', 'There are 5 cakes. 2 cakes are burnt.', '{"source":"mathMultiPart","display":"3, 3","parts":[{"id":"equation","accepted":["3"],"points":1},{"id":"left","accepted":["3"],"points":1}]}', null, 2, 4),
  ('mo1-q5', 'math-olympiad-1', 'Part I', 'Choose the shape that matches the name: Square.', '{"source":"mathMultiPart","display":"Square","parts":[{"id":"answer","accepted":["upright-square"],"points":2,"normalizer":"text"}]}', null, 2, 5),
  ('mo1-q6', 'math-olympiad-1', 'Part II', 'Which triangle is 5th from the left? Which triangle is 3rd from the right?', '{"source":"mathMultiPart","display":"E, D","parts":[{"id":"a","accepted":["E"],"points":1},{"id":"b","accepted":["D"],"points":1}]}', null, 2, 6),
  ('mo1-q7', 'math-olympiad-1', 'Part II', 'Siti has 14 beads. She buys 2 more beads. How many beads does she have now?', '{"source":"mathMultiPart","display":"14 + 2 = 16; 16 beads","parts":[{"id":"first","accepted":["14"],"points":0.4},{"id":"operator","accepted":["+"],"points":0.4},{"id":"second","accepted":["2"],"points":0.4},{"id":"result","accepted":["16"],"points":0.4},{"id":"final","accepted":["16"],"points":0.4}]}', null, 2, 7),
  ('mo1-q8', 'math-olympiad-1', 'Part II', 'Compare the lengths of the pencils.', '{"source":"mathMultiPart","display":"B, A","parts":[{"id":"a","accepted":["B"],"points":1},{"id":"b","accepted":["A"],"points":1}]}', null, 2, 8),
  ('mo1-q9', 'math-olympiad-1', 'Part II', '1 more than 5 and 1 less than 7.', '{"source":"mathMultiPart","display":"6, 6","parts":[{"id":"a","accepted":["6"],"points":1},{"id":"b","accepted":["6"],"points":1}]}', null, 2, 9),
  ('mo1-q10', 'math-olympiad-1', 'Part II', 'The graph shows the books on Meiling''s bookshelf.', '{"source":"mathMultiPart","display":"7; English Literature and Bedtime story; 3; 17","parts":[{"id":"a","accepted":["7"],"points":0.75},{"id":"b1","accepted":["English Literature","English"],"points":0.38},{"id":"b2","accepted":["Bedtime story","Bedtime"],"points":0.37},{"id":"c","accepted":["3"],"points":0.75},{"id":"d","accepted":["17"],"points":0.75}]}', null, 3, 10),
  ('mo1-q11', 'math-olympiad-1', 'Part III', 'Subtract using base-ten blocks.', '{"source":"mathMultiPart","display":"4, 14, 24","parts":[{"id":"a","accepted":["4"],"points":0.67},{"id":"b","accepted":["14"],"points":0.67},{"id":"c","accepted":["24"],"points":0.66}]}', null, 2, 11),
  ('mo1-q12', 'math-olympiad-1', 'Part III', 'There are groups of 4 triangles.', '{"source":"mathMultiPart","display":"2, 8","parts":[{"id":"groups","accepted":["2"],"points":1},{"id":"total","accepted":["8"],"points":1}]}', null, 2, 12),
  ('mo1-q13', 'math-olympiad-1', 'Part III', 'Share 6 pears equally among 2 children.', '{"source":"mathMultiPart","display":"3","parts":[{"id":"each","accepted":["3"],"points":2}]}', null, 2, 13),
  ('mo1-q14', 'math-olympiad-1', 'Part III', 'Uncle Tam and family came to visit at what time?', '{"source":"mathMultiPart","display":"10:30","parts":[{"id":"time","accepted":["10:30","10.30","10 30"],"points":2,"normalizer":"time"}]}', null, 2, 14),
  ('mo1-q15', 'math-olympiad-1', 'Part III', 'Subtract.', '{"source":"mathMultiPart","display":"14, 14, 46, 46","parts":[{"id":"a1","accepted":["14"],"points":0.75},{"id":"a2","accepted":["14"],"points":0.75},{"id":"b1","accepted":["46"],"points":0.75},{"id":"b2","accepted":["46"],"points":0.75}]}', null, 3, 15)
on conflict (id) do update set
  test_id = excluded.test_id,
  part = excluded.part,
  prompt = excluded.prompt,
  answer_key = excluded.answer_key,
  transcript_ref = excluded.transcript_ref,
  points = excluded.points,
  position = excluded.position;

insert into test_questions (id, test_id, part, prompt, answer_key, transcript_ref, points, position)
values
  ('mo2-q1', 'math-olympiad-2', 'Part I', 'Write the following in numerals.', '{"source":"mathMultiPart","display":"682, 970","parts":[{"id":"a","accepted":["682"],"points":1},{"id":"b","accepted":["970"],"points":1}]}', null, 2, 1),
  ('mo2-q2', 'math-olympiad-2', 'Part I', 'Cheryl had 923 marbles. She gave 53 of the marbles to Norman. How many marbles did Cheryl have left?', '{"source":"mathMultiPart","display":"870","parts":[{"id":"answer","accepted":["870"],"points":1}]}', null, 1, 2),
  ('mo2-q3', 'math-olympiad-2', 'Part I', 'Hui En sold 156 muffins during a school carnival. Latifah sold 308 muffins. How many more muffins did Latifah sell?', '{"source":"mathMultiPart","display":"152","parts":[{"id":"answer","accepted":["152"],"points":2}]}', null, 2, 3),
  ('mo2-q4', 'math-olympiad-2', 'Part I', 'Subtract.', '{"source":"mathMultiPart","display":"267, 477","parts":[{"id":"a","accepted":["267"],"points":1},{"id":"b","accepted":["477"],"points":1}]}', null, 2, 4),
  ('mo2-q5', 'math-olympiad-2', 'Part I', 'Mr Chen had 771 oranges at his fruit stall. He sold 345 oranges in the afternoon. How many oranges did he have left?', '{"source":"mathMultiPart","display":"426","parts":[{"id":"answer","accepted":["426"],"points":2}]}', null, 2, 5),
  ('mo2-q6', 'math-olympiad-2', 'Part II', 'There are 8 flowers on each stalk. There are 3 stalks.', '{"source":"mathMultiPart","display":"24, 24","parts":[{"id":"a","accepted":["24"],"points":1},{"id":"b","accepted":["24"],"points":1}]}', null, 2, 6),
  ('mo2-q7', 'math-olympiad-2', 'Part II', 'Divide.', '{"source":"mathMultiPart","display":"8, 9, 6, 6, 9, 10","parts":[{"id":"a","accepted":["8"],"points":0.5},{"id":"b","accepted":["9"],"points":0.5},{"id":"c","accepted":["6"],"points":0.5},{"id":"d","accepted":["6"],"points":0.5},{"id":"e","accepted":["9"],"points":0.5},{"id":"f","accepted":["10"],"points":0.5}]}', null, 3, 7),
  ('mo2-q8', 'math-olympiad-2', 'Part II', 'Pencil A is 6 cm. Pencil B is 11 cm.', '{"source":"mathMultiPart","display":"A, 5","parts":[{"id":"a","accepted":["A","Pencil A"],"points":1},{"id":"b","accepted":["5","5 cm"],"points":1}]}', null, 2, 8),
  ('mo2-q9', 'math-olympiad-2', 'Part II', 'The total mass of a table and a chair is 22 kg. The mass of the chair is 10 kg. What is the mass of the table?', '{"source":"mathMultiPart","display":"12","parts":[{"id":"answer","accepted":["12","12 kg"],"points":2}]}', null, 2, 9),
  ('mo2-q10', 'math-olympiad-2', 'Part II', 'Mrs Lee left the house with $120. She had $70 left after buying groceries. How much did her groceries cost?', '{"source":"mathMultiPart","display":"50","parts":[{"id":"answer","accepted":["50","$50"],"points":2}]}', null, 2, 10),
  ('mo2-q11', 'math-olympiad-2', 'Part III', 'Circle the figures shown that are one-quarter shaded.', '{"source":"mathMultiPart","display":"b-c","parts":[{"id":"answer","accepted":["b-c"],"points":1}]}', null, 1, 11),
  ('mo2-q12', 'math-olympiad-2', 'Part III', 'Fill in the blanks with the correct time.', '{"source":"mathMultiPart","display":"9.00 p.m., 4.30 p.m.","parts":[{"id":"a","accepted":["9.00 p.m.","9:00 pm","9 pm"],"points":1,"normalizer":"time"},{"id":"b","accepted":["4.30 p.m.","4:30 pm","4.30 pm"],"points":1,"normalizer":"time"}]}', null, 2, 12),
  ('mo2-q13', 'math-olympiad-2', 'Part III', 'Container A holds ___ water than Container B.', '{"source":"mathMultiPart","display":"less","parts":[{"id":"answer","accepted":["less"],"points":2}]}', null, 2, 13),
  ('mo2-q14', 'math-olympiad-2', 'Part III', 'The pictograph shows pupils'' favourite colours.', '{"source":"mathMultiPart","display":"4, 3, 2, red, yellow, 21","parts":[{"id":"a","accepted":["4"],"points":0.5},{"id":"b","accepted":["3"],"points":0.5},{"id":"c","accepted":["2"],"points":0.5},{"id":"d","accepted":["red"],"points":0.5},{"id":"e","accepted":["yellow"],"points":0.5},{"id":"f","accepted":["21"],"points":0.5}]}', null, 3, 14),
  ('mo2-q15', 'math-olympiad-2', 'Part III', 'Name the shape of each shaded face.', '{"source":"mathMultiPart","display":"rectangle, triangle","parts":[{"id":"a","accepted":["rectangle"],"points":1},{"id":"b","accepted":["triangle"],"points":1}]}', null, 2, 15),
  ('mo3-q1', 'math-olympiad-3', 'Part I', 'Fill in the blanks.', '{"source":"mathMultiPart","display":"7000, 800","parts":[{"id":"a","accepted":["7000"],"points":0.5},{"id":"b","accepted":["800"],"points":0.5}]}', null, 1, 1),
  ('mo3-q2', 'math-olympiad-3', 'Part I', 'Mr Ravi gave $3985 to his wife and $468 to his son. He was left with $2790.', '{"source":"mathMultiPart","display":"3517, 7243","parts":[{"id":"a","accepted":["3517","$3517"],"points":1},{"id":"b","accepted":["7243","$7243"],"points":1}]}', null, 2, 2),
  ('mo3-q3', 'math-olympiad-3', 'Part I', 'Multiply the following.', '{"source":"mathMultiPart","display":"498, 665, 768, 261","parts":[{"id":"a","accepted":["498"],"points":0.75},{"id":"b","accepted":["665"],"points":0.75},{"id":"c","accepted":["768"],"points":0.75},{"id":"d","accepted":["261"],"points":0.75}]}', null, 3, 3),
  ('mo3-q4', 'math-olympiad-3', 'Part I', 'Fill in the blanks.', '{"source":"mathMultiPart","display":"4, 5, 6, 10","parts":[{"id":"a","accepted":["4"],"points":0.5},{"id":"b","accepted":["5"],"points":0.5},{"id":"c","accepted":["6"],"points":0.5},{"id":"d","accepted":["10"],"points":0.5}]}', null, 2, 4),
  ('mo3-q5', 'math-olympiad-3', 'Part I', '3 boxes contained 35 buttons each. The buttons were sewn equally onto 7 shirts. How many buttons were sewn on each shirt?', '{"source":"mathMultiPart","display":"15","parts":[{"id":"answer","accepted":["15"],"points":2}]}', null, 2, 5),
  ('mo3-q6', 'math-olympiad-3', 'Part II', 'A dress costs $45.85. It costs $9.60 less than a coat.', '{"source":"mathMultiPart","display":"55.45, 101.30","parts":[{"id":"a","accepted":["55.45","$55.45"],"points":1},{"id":"b","accepted":["101.30","101.3","$101.30","$101.3"],"points":1}]}', null, 2, 6),
  ('mo3-q7', 'math-olympiad-3', 'Part II', 'Convert the following to centimetres or metres.', '{"source":"mathMultiPart","display":"620, 3150","parts":[{"id":"a","accepted":["620"],"points":1},{"id":"b","accepted":["3150"],"points":1}]}', null, 2, 7),
  ('mo3-q8', 'math-olympiad-3', 'Part II', 'Jack is 1 m 46 cm tall. His father is 27 cm taller than he.', '{"source":"mathMultiPart","display":"1 m 73 cm, 3 m 19 cm","parts":[{"id":"a","accepted":["1 m 73 cm","1m73cm","173 cm"],"points":1},{"id":"b","accepted":["3 m 19 cm","3m19cm","319 cm"],"points":1}]}', null, 2, 8),
  ('mo3-q9', 'math-olympiad-3', 'Part II', 'The total mass of 6 apples and a durian is 2 kg 400 g. The mass of the durian is 1 kg 500 g. The apples are of the same mass.', '{"source":"mathMultiPart","display":"900 g, 150 g","parts":[{"id":"a","accepted":["900 g","900g"],"points":1},{"id":"b","accepted":["150 g","150g"],"points":1}]}', null, 2, 9),
  ('mo3-q10', 'math-olympiad-3', 'Part II', 'A mug can hold 1200 ml of water. If the mug can hold 6 times as much water as a cup, how much water can the cup hold?', '{"source":"mathMultiPart","display":"200 ml","parts":[{"id":"answer","accepted":["200 ml","200ml","200"],"points":2}]}', null, 2, 10),
  ('mo3-q11', 'math-olympiad-3', 'Part III', 'The bar graph shows the number of books five pupils read in a year.', '{"source":"mathMultiPart","display":"15, Betty, Mike, 625, 120","parts":[{"id":"a","accepted":["15"],"points":0.6},{"id":"b","accepted":["Betty"],"points":0.6},{"id":"c","accepted":["Mike"],"points":0.6},{"id":"d","accepted":["625"],"points":0.6},{"id":"e","accepted":["120"],"points":0.6}]}', null, 3, 11),
  ('mo3-q12', 'math-olympiad-3', 'Part III', 'Fill in the blanks to make 1 whole.', '{"source":"mathMultiPart","display":"1/5, 1/10","parts":[{"id":"a","accepted":["1/5"],"points":1},{"id":"b","accepted":["1/10"],"points":1}]}', null, 2, 12),
  ('mo3-q13', 'math-olympiad-3', 'Part III', 'Find the equivalent time.', '{"source":"mathMultiPart","display":"3, 10, 1, 55","parts":[{"id":"a_hours","accepted":["3"],"points":0.5},{"id":"a_minutes","accepted":["10"],"points":0.5},{"id":"b_hours","accepted":["1"],"points":0.5},{"id":"b_minutes","accepted":["55"],"points":0.5}]}', null, 2, 13),
  ('mo3-q14', 'math-olympiad-3', 'Part III', 'Choose the line that is parallel to the one shown.', '{"source":"mathMultiPart","display":"parallel","parts":[{"id":"answer","accepted":["parallel"],"points":1}]}', null, 1, 14),
  ('mo3-q15', 'math-olympiad-3', 'Part III', 'Find the perimeter of the figure.', '{"source":"mathMultiPart","display":"51","parts":[{"id":"answer","accepted":["51","51 cm"],"points":2}]}', null, 2, 15),
  ('mo4-q1', 'math-olympiad-4', 'Part I', 'Write the following in numerals.', '{"source":"mathMultiPart","display":"12009, 63045","parts":[{"id":"a","accepted":["12009"],"points":0.5},{"id":"b","accepted":["63045"],"points":0.5}]}', null, 1, 1),
  ('mo4-q2', 'math-olympiad-4', 'Part I', 'Fill in the blanks.', '{"source":"mathMultiPart","display":"560, 9700, 13000","parts":[{"id":"a","accepted":["560"],"points":0.67},{"id":"b","accepted":["9700"],"points":0.67},{"id":"c","accepted":["13000"],"points":0.66}]}', null, 2, 2),
  ('mo4-q3', 'math-olympiad-4', 'Part I', 'Multiply the following.', '{"source":"mathMultiPart","display":"1230, 1512","parts":[{"id":"a","accepted":["1230"],"points":0.5},{"id":"b","accepted":["1512"],"points":0.5}]}', null, 1, 3),
  ('mo4-q4', 'math-olympiad-4', 'Part I', 'Christine and David have stickers. Christine has 5 times as many as David. David has 172 stickers.', '{"source":"mathMultiPart","display":"860, 1032","parts":[{"id":"a","accepted":["860"],"points":1},{"id":"b","accepted":["1032"],"points":1}]}', null, 2, 4),
  ('mo4-q5', 'math-olympiad-4', 'Part I', 'Complete the table for Shuli, James, and Ken, then answer the questions.', '{"source":"mathMultiPart","display":"Shuli: 9 y 6 m, 146 cm, 39 kg; James: 10 y 1 m, 151 cm, 42 kg; Ken: 8 y 8 m, 138 cm, 37 kg; 7 months, 10 months, 13 cm, 2 kg, 435 cm, 118 kg","parts":[{"id":"shuli_age","accepted":["9 y 6 m","9 yr 6 mth","9 years 6 months","9y 6m"],"points":0.2},{"id":"shuli_height","accepted":["146 cm","146"],"points":0.2},{"id":"shuli_mass","accepted":["39 kg","39"],"points":0.2},{"id":"james_age","accepted":["10 y 1 m","10 yr 1 mth","10 years 1 month","10y 1m"],"points":0.2},{"id":"james_height","accepted":["151 cm","151"],"points":0.2},{"id":"james_mass","accepted":["42 kg","42"],"points":0.2},{"id":"ken_age","accepted":["8 y 8 m","8 yr 8 mth","8 years 8 months","8y 8m"],"points":0.2},{"id":"ken_height","accepted":["138 cm","138"],"points":0.2},{"id":"ken_mass","accepted":["37 kg","37"],"points":0.2},{"id":"a","accepted":["7 months","7 mth","7"],"points":0.2},{"id":"b","accepted":["10 months","10 mth","10"],"points":0.2},{"id":"c","accepted":["13 cm","13"],"points":0.2},{"id":"d","accepted":["2 kg","2"],"points":0.2},{"id":"e","accepted":["435 cm","435"],"points":0.2},{"id":"f","accepted":["118 kg","118"],"points":0.2}]}', null, 3, 5),
  ('mo4-q6', 'math-olympiad-4', 'Part II', 'The line graph shows shirts sold from Monday to Saturday.', '{"source":"mathMultiPart","display":"35, Monday, 10, 600, 90","parts":[{"id":"a","accepted":["35"],"points":0.6},{"id":"b","accepted":["Monday","Mon"],"points":0.6},{"id":"c","accepted":["10"],"points":0.6},{"id":"d","accepted":["600","$600"],"points":0.6},{"id":"e","accepted":["90"],"points":0.6}]}', null, 3, 6),
  ('mo4-q7', 'math-olympiad-4', 'Part II', 'Arrange the fractions from smallest to greatest.', '{"source":"mathMultiPart","display":"2, 3, 1, 4, 4, 1, 2, 3","parts":[{"id":"a_3_8","accepted":["2"],"points":0.25},{"id":"a_5_12","accepted":["3"],"points":0.25},{"id":"a_1_4","accepted":["1"],"points":0.25},{"id":"a_5_6","accepted":["4"],"points":0.25},{"id":"b_5_6","accepted":["4"],"points":0.25},{"id":"b_1_12","accepted":["1"],"points":0.25},{"id":"b_2_3","accepted":["2"],"points":0.25},{"id":"b_7_9","accepted":["3"],"points":0.25}]}', null, 2, 7),
  ('mo4-q8', 'math-olympiad-4', 'Part II', 'Solve each of the following.', '{"source":"mathMultiPart","display":"5, 12","parts":[{"id":"a","accepted":["5"],"points":1},{"id":"b","accepted":["12"],"points":1}]}', null, 2, 8),
  ('mo4-q9', 'math-olympiad-4', 'Part II', 'Fill in the blanks in the direction table.', '{"source":"mathMultiPart","display":"North, East, 315, 45","parts":[{"id":"a","accepted":["North"],"points":0.5},{"id":"b","accepted":["East"],"points":0.5},{"id":"c","accepted":["315","315°"],"points":0.5},{"id":"d","accepted":["45","45°"],"points":0.5}]}', null, 2, 9),
  ('mo4-q10', 'math-olympiad-4', 'Part II', 'The figure is made up of two squares. Find DE.', '{"source":"mathMultiPart","display":"4","parts":[{"id":"answer","accepted":["4","4 cm"],"points":2}]}', null, 2, 10),
  ('mo4-q11', 'math-olympiad-4', 'Part III', 'Fill in the blanks with the missing decimals.', '{"source":"mathMultiPart","display":"0.008, 0.06","parts":[{"id":"a","accepted":["0.008"],"points":1},{"id":"b","accepted":["0.06"],"points":1}]}', null, 2, 11),
  ('mo4-q12', 'math-olympiad-4', 'Part III', 'Jim cycled from his home to the market and then to his school.', '{"source":"mathMultiPart","display":"13.13","parts":[{"id":"answer","accepted":["13.13","13 13/100"],"points":2}]}', null, 2, 12),
  ('mo4-q13', 'math-olympiad-4', 'Part III', 'Write down the times using the 12-hour and 24-hour clocks.', '{"source":"mathMultiPart","display":"10:45, 22:45, 1:35 a.m., 1:35 p.m.","parts":[{"id":"a","accepted":["10:45","10.45"],"points":0.5,"normalizer":"time"},{"id":"b","accepted":["22:45","22.45"],"points":0.5,"normalizer":"time"},{"id":"c","accepted":["1:35 a.m.","1.35 a.m.","1:35 am"],"points":0.5,"normalizer":"time"},{"id":"d","accepted":["1:35 p.m.","1.35 p.m.","1:35 pm"],"points":0.5,"normalizer":"time"}]}', null, 2, 13),
  ('mo4-q14', 'math-olympiad-4', 'Part III', 'Find the perimeter and area of the figure.', '{"source":"mathMultiPart","display":"48 cm, 119 cm2","parts":[{"id":"a","accepted":["48 cm","48"],"points":1},{"id":"b","accepted":["119 cm2","119 cm²","119"],"points":1}]}', null, 2, 14),
  ('mo4-q15', 'math-olympiad-4', 'Part III', 'Complete the other half of each symmetric figure.', '{"source":"mathMultiPart","display":"correct","parts":[{"id":"answer","accepted":["correct"],"points":2}]}', null, 2, 15),
  ('mo5-q1', 'math-olympiad-5', 'Part I', 'Write the following in words.', '{"source":"mathMultiPart","display":"three million two thousand, four million eighteen thousand","parts":[{"id":"a","accepted":["three million two thousand"],"points":1},{"id":"b","accepted":["four million eighteen thousand"],"points":1}]}', null, 2, 1),
  ('mo5-q2', 'math-olympiad-5', 'Part I', 'Calculate the following.', '{"source":"mathMultiPart","display":"30, 49, 22, 55, 12, 35","parts":[{"id":"a","accepted":["30"],"points":0.5},{"id":"b","accepted":["49"],"points":0.5},{"id":"c","accepted":["22"],"points":0.5},{"id":"d","accepted":["55"],"points":0.5},{"id":"e","accepted":["12"],"points":0.5},{"id":"f","accepted":["35"],"points":0.5}]}', null, 3, 2),
  ('mo5-q3', 'math-olympiad-5', 'Part I', 'Divide the following.', '{"source":"mathMultiPart","display":"3, 3, 70","parts":[{"id":"a","accepted":["3"],"points":0.67},{"id":"b","accepted":["3"],"points":0.67},{"id":"c","accepted":["70"],"points":0.66}]}', null, 2, 3),
  ('mo5-q4', 'math-olympiad-5', 'Part I', 'Mr Siva bought 132 packets of balloons from a shop. There were 9 balloons in each packet. How many balloons did he buy altogether?', '{"source":"mathMultiPart","display":"1188","parts":[{"id":"answer","accepted":["1188"],"points":1}]}', null, 1, 4),
  ('mo5-q5', 'math-olympiad-5', 'Part I', 'The diagram shows a rectangle. Find the perimeter and area.', '{"source":"mathMultiPart","display":"3 1/4 cm, 21/32 cm2","parts":[{"id":"a","accepted":["3 1/4 cm","3.25 cm","13/4 cm","3 1/4","3.25","13/4"],"points":1},{"id":"b","accepted":["21/32 cm2","21/32 cm²","21/32"],"points":1}]}', null, 2, 5),
  ('mo5-q6', 'math-olympiad-5', 'Part II', 'Find the shaded area of the rectangle.', '{"source":"mathMultiPart","display":"120 cm2","parts":[{"id":"answer","accepted":["120 cm2","120 cm²","120"],"points":2}]}', null, 2, 6),
  ('mo5-q7', 'math-olympiad-5', 'Part II', 'Fill in the blanks.', '{"source":"mathMultiPart","display":"75, 12","parts":[{"id":"a","accepted":["75"],"points":0.5},{"id":"b","accepted":["12"],"points":0.5}]}', null, 1, 7),
  ('mo5-q8', 'math-olympiad-5', 'Part II', 'Hakim can write 25 cards in 150 min. How long will he take to write 27 cards?', '{"source":"mathMultiPart","display":"162","parts":[{"id":"answer","accepted":["162","162 min"],"points":2}]}', null, 2, 8),
  ('mo5-q9', 'math-olympiad-5', 'Part II', 'Find the unknown marked angles.', '{"source":"mathMultiPart","display":"22, 125","parts":[{"id":"a","accepted":["22","22°"],"points":1},{"id":"b","accepted":["125","125°"],"points":1}]}', null, 2, 9),
  ('mo5-q10', 'math-olympiad-5', 'Part II', 'Divide the following.', '{"source":"mathMultiPart","display":"4.54, 0.291, 1.54, 1.9","parts":[{"id":"a","accepted":["4.54"],"points":0.75},{"id":"b","accepted":["0.291"],"points":0.75},{"id":"c","accepted":["1.54"],"points":0.75},{"id":"d","accepted":["1.9"],"points":0.75}]}', null, 3, 10),
  ('mo5-q11', 'math-olympiad-5', 'Part III', 'There are 75 animals at a pet show. 18 are dogs, 36 are cats and the rest are rabbits.', '{"source":"mathMultiPart","display":"48%, 28%","parts":[{"id":"a","accepted":["48%","48"],"points":1},{"id":"b","accepted":["28%","28"],"points":1}]}', null, 2, 11),
  ('mo5-q12', 'math-olympiad-5', 'Part III', 'Jean has 2 bottles of 1.5 l milk to be divided equally into 6 cups. What is the volume in each cup? Express your answer in ml.', '{"source":"mathMultiPart","display":"500 ml","parts":[{"id":"answer","accepted":["500 ml","500ml","500"],"points":2}]}', null, 2, 12),
  ('mo5-q13', 'math-olympiad-5', 'Part III', 'The figure is not drawn to scale. Find ∠a and ∠b.', '{"source":"mathMultiPart","display":"35, 40","parts":[{"id":"a","accepted":["35","35°"],"points":1},{"id":"b","accepted":["40","40°"],"points":1}]}', null, 2, 13),
  ('mo5-q14', 'math-olympiad-5', 'Part III', 'The trapezium is not drawn to scale. Find the unknown marked angle.', '{"source":"mathMultiPart","display":"120","parts":[{"id":"b","accepted":["120","120°"],"points":2}]}', null, 2, 14),
  ('mo5-q15', 'math-olympiad-5', 'Part III', 'Find the height of the cuboid. Volume = 672 cm³, length = 12 cm, width = 8 cm.', '{"source":"mathMultiPart","display":"7","parts":[{"id":"answer","accepted":["7","7 cm"],"points":2}]}', null, 2, 15),
  ('mo6-q1', 'math-olympiad-6', 'Part I', 'Simplify the following expressions.', '{"source":"mathMultiPart","display":"9d, 3m, 7n, 8p, k + 2, 5g + 9","parts":[{"id":"a","accepted":["9d"],"points":0.34},{"id":"b","accepted":["3m"],"points":0.34},{"id":"c","accepted":["7n"],"points":0.33},{"id":"d","accepted":["8p"],"points":0.33},{"id":"e","accepted":["k + 2","k+2"],"points":0.33},{"id":"f","accepted":["5g + 9","5g+9"],"points":0.33}]}', null, 2, 1),
  ('mo6-q2', 'math-olympiad-6', 'Part I', 'Find the values of the following expressions when n = 3.', '{"source":"mathMultiPart","display":"1, 2, 3, 13","parts":[{"id":"a","accepted":["1"],"points":0.5},{"id":"b","accepted":["2"],"points":0.5},{"id":"c","accepted":["3"],"points":0.5},{"id":"d","accepted":["13"],"points":0.5}]}', null, 2, 2),
  ('mo6-q3', 'math-olympiad-6', 'Part I', 'ABCG is a rhombus. ACDE is a rectangle and CGE is a diagonal of the rectangle. Find ∠ABC.', '{"source":"mathMultiPart","display":"72","parts":[{"id":"answer","accepted":["72","72°"],"points":2}]}', null, 2, 3),
  ('mo6-q4', 'math-olympiad-6', 'Part I', 'ABCD is a trapezium in which AD // BC and EC = ED. Find ∠EDC.', '{"source":"mathMultiPart","display":"43","parts":[{"id":"answer","accepted":["43","43°"],"points":2}]}', null, 2, 4),
  ('mo6-q5', 'math-olympiad-6', 'Part I', 'How many faces and edges are there in the solid below?', '{"source":"mathMultiPart","display":"6, 12","parts":[{"id":"faces","accepted":["6"],"points":1},{"id":"edges","accepted":["12"],"points":1}]}', null, 2, 5),
  ('mo6-q6', 'math-olympiad-6', 'Part II', 'Identify the solid that can be formed from the net shown below, then find the surface area of the solid.', '{"source":"mathMultiPart","display":"triangular prism, 104","parts":[{"id":"a","accepted":["triangular prism"],"points":1},{"id":"b","accepted":["104","104 cm2","104 cm²"],"points":1}]}', null, 2, 6),
  ('mo6-q7', 'math-olympiad-6', 'Part II', 'The table shows the length of 3 pieces of ribbon. Ribbon A is 2 3/4 cm, Ribbon B is 9 5/12 cm, and Ribbon C is 10 3/4 cm. Express answers as fractions in their simplest form.', '{"source":"mathMultiPart","display":"12 1/6 cm, 22 11/12 cm","parts":[{"id":"a","accepted":["12 1/6 cm","12 1/6","73/6 cm","73/6"],"points":1},{"id":"b","accepted":["22 11/12 cm","22 11/12","275/12 cm","275/12"],"points":1}]}', null, 2, 7),
  ('mo6-q8', 'math-olympiad-6', 'Part II', 'The figure below shows a rectangular carpet. Find the perimeter of the carpet as a fraction in cm.', '{"source":"mathMultiPart","display":"136 4/15 cm","parts":[{"id":"answer","accepted":["136 4/15 cm","136 4/15","2044/15 cm","2044/15"],"points":2}]}', null, 2, 8),
  ('mo6-q9', 'math-olympiad-6', 'Part II', 'Fill in the blanks.', '{"source":"mathMultiPart","display":"51, 25, 40","parts":[{"id":"a","accepted":["51"],"points":1},{"id":"b1","accepted":["25"],"points":0.5},{"id":"b2","accepted":["40"],"points":0.5}]}', null, 2, 9),
  ('mo6-q10', 'math-olympiad-6', 'Part II', 'Aminah bought a dress for $18. The usual price of the dress was $20. What was the percentage discount Aminah received?', '{"source":"mathMultiPart","display":"10%","parts":[{"id":"answer","accepted":["10%","10"],"points":2}]}', null, 2, 10),
  ('mo6-q11', 'math-olympiad-6', 'Part III', 'The distance of PQ to the distance of QR was in the ratio 1 : 2. Jack took 2 h to cycle from P to Q. From Q to R, he increased his average speed by 5 km/h.', '{"source":"mathMultiPart","display":"12 h, 15 km/h","parts":[{"id":"a","accepted":["12 h","12"],"points":1},{"id":"b","accepted":["15 km/h","15 kmh","15"],"points":1}]}', null, 2, 11),
  ('mo6-q12', 'math-olympiad-6', 'Part III', 'Find the area of the three-quarter circle. Take π = 3.14. Give your answer correct to the nearest whole number.', '{"source":"mathMultiPart","display":"191","parts":[{"id":"answer","accepted":["191","191 cm2","191 cm²"],"points":2}]}', null, 2, 12),
  ('mo6-q13', 'math-olympiad-6', 'Part III', 'The bar graph shows the number of pupils who visited the school library from Monday to Friday.', '{"source":"mathMultiPart","display":"50, 66.67%, 190, 1250","parts":[{"id":"a","accepted":["50"],"points":0.5},{"id":"b","accepted":["66.67%","66.67","66 2/3%","66 2/3"],"points":0.5},{"id":"c","accepted":["190"],"points":0.5},{"id":"d","accepted":["1250"],"points":0.5}]}', null, 2, 13),
  ('mo6-q14', 'math-olympiad-6', 'Part III', 'The figure shows a rectangular tank that was filled up to 1/3 of its height with 7.2 litres of oil. Find the height of the tank and how many more litres of oil are needed to fill the tank to its brim. 1 litre = 1000 cm³.', '{"source":"mathMultiPart","display":"36 cm, 14.4 l","parts":[{"id":"a","accepted":["36 cm","36"],"points":1},{"id":"b","accepted":["14.4 l","14.4 litres","14.4 liters","14.4"],"points":1}]}', null, 2, 14),
  ('mo6-q15', 'math-olympiad-6', 'Part III', 'The average score of 3 tests that Jeffery took was 65 marks. He scored 85 marks for Mathematics. His English score was 12/17 of his Mathematics score. How many marks did Jeffery score for the last test?', '{"source":"mathMultiPart","display":"50","parts":[{"id":"answer","accepted":["50"],"points":2}]}', null, 2, 15)
on conflict (id) do update set
  test_id = excluded.test_id,
  part = excluded.part,
  prompt = excluded.prompt,
  answer_key = excluded.answer_key,
  transcript_ref = excluded.transcript_ref,
  points = excluded.points,
  position = excluded.position;

insert into test_questions (id, test_id, part, prompt, answer_key, transcript_ref, position)
values
  ('el1-q1', 'english-literacy-1', 'Part 1 - Rhyming Words', 'Boat', '{"source":"questionMap","accepted":["coat"],"display":"coat"}', null, 1),
  ('el1-q2', 'english-literacy-1', 'Part 1 - Rhyming Words', 'Glad', '{"source":"questionMap","accepted":["sad"],"display":"sad"}', null, 2),
  ('el1-q3', 'english-literacy-1', 'Part 1 - Rhyming Words', 'Cage', '{"source":"questionMap","accepted":["page"],"display":"page"}', null, 3),
  ('el1-q4', 'english-literacy-1', 'Part 1 - Rhyming Words', 'Wish', '{"source":"questionMap","accepted":["fish"],"display":"fish"}', null, 4),
  ('el1-q5', 'english-literacy-1', 'Part 1 - Rhyming Words', 'Play', '{"source":"questionMap","accepted":["bay"],"display":"bay"}', null, 5),
  ('el1-q6', 'english-literacy-1', 'Part 2 - Picture Naming', 'Name the picture for question 6.', '{"source":"questionMap","accepted":["truck"],"display":"truck"}', null, 6),
  ('el1-q7', 'english-literacy-1', 'Part 2 - Picture Naming', 'Name the picture for question 7.', '{"source":"questionMap","accepted":["crab"],"display":"crab"}', null, 7),
  ('el1-q8', 'english-literacy-1', 'Part 2 - Picture Naming', 'Name the picture for question 8.', '{"source":"questionMap","accepted":["flag"],"display":"flag"}', null, 8),
  ('el1-q9', 'english-literacy-1', 'Part 2 - Picture Naming', 'Name the picture for question 9.', '{"source":"questionMap","accepted":["glue"],"display":"glue"}', null, 9),
  ('el1-q10', 'english-literacy-1', 'Part 2 - Picture Naming', 'Name the picture for question 10.', '{"source":"questionMap","accepted":["oven"],"display":"oven"}', null, 10),
  ('el1-q11', 'english-literacy-1', 'Part 2 - Picture Naming', 'Name the picture for question 11.', '{"source":"questionMap","accepted":["clock"],"display":"clock"}', null, 11),
  ('el1-q12', 'english-literacy-1', 'Part 2 - Picture Naming', 'Name the picture for question 12.', '{"source":"questionMap","accepted":["crown"],"display":"crown"}', null, 12),
  ('el1-q13', 'english-literacy-1', 'Part 2 - Picture Naming', 'Name the picture for question 13.', '{"source":"questionMap","accepted":["broom"],"display":"broom"}', null, 13),
  ('el1-q14', 'english-literacy-1', 'Part 2 - Picture Naming', 'Name the picture for question 14.', '{"source":"questionMap","accepted":["frog"],"display":"frog"}', null, 14),
  ('el1-q15', 'english-literacy-1', 'Part 2 - Picture Naming', 'Name the picture for question 15.', '{"source":"questionMap","accepted":["spoon"],"display":"spoon"}', null, 15),
  ('el1-q16', 'english-literacy-1', 'Part 3 - Odd One Out', 'Choose the odd one out: star, cloud, car.', '{"source":"questionMap","accepted":["cloud"],"display":"cloud"}', null, 16),
  ('el1-q17', 'english-literacy-1', 'Part 3 - Odd One Out', 'Choose the odd one out: coin, toys, boy.', '{"source":"questionMap","accepted":["coin"],"display":"coin"}', null, 17),
  ('el1-q18', 'english-literacy-1', 'Part 3 - Odd One Out', 'Choose the odd one out: glass, grass, boat.', '{"source":"questionMap","accepted":["boat"],"display":"boat"}', null, 18),
  ('el1-q19', 'english-literacy-1', 'Part 3 - Odd One Out', 'Choose the odd one out: mouse, house, dog.', '{"source":"questionMap","accepted":["dog"],"display":"dog"}', null, 19),
  ('el1-q20', 'english-literacy-1', 'Part 3 - Odd One Out', 'Choose the odd one out: honey, bee, money.', '{"source":"questionMap","accepted":["bee"],"display":"bee"}', null, 20),
  ('el1-q21', 'english-literacy-1', 'Part 4 - Missing Letters', 'sup __ market', '{"source":"questionMap","accepted":["er"],"display":"er"}', null, 21),
  ('el1-q22', 'english-literacy-1', 'Part 4 - Missing Letters', '__ agonfly', '{"source":"questionMap","accepted":["dr"],"display":"dr"}', null, 22),
  ('el1-q23', 'english-literacy-1', 'Part 4 - Missing Letters', 'rainb __', '{"source":"questionMap","accepted":["ow"],"display":"ow"}', null, 23),
  ('el1-q24', 'english-literacy-1', 'Part 4 - Missing Letters', 'bestfr __ nd', '{"source":"questionMap","accepted":["ie"],"display":"ie"}', null, 24),
  ('el1-q25', 'english-literacy-1', 'Part 4 - Missing Letters', 'bedr __ m', '{"source":"questionMap","accepted":["oo"],"display":"oo"}', null, 25),
  ('el1-q26', 'english-literacy-1', 'Part 5 - Reading True or False', 'It is New Year''s Day.', '{"source":"questionMap","accepted":["false"],"display":"false"}', null, 26),
  ('el1-q27', 'english-literacy-1', 'Part 5 - Reading True or False', 'Marla and Tio are playing in the park.', '{"source":"questionMap","accepted":["false"],"display":"false"}', null, 27),
  ('el1-q28', 'english-literacy-1', 'Part 5 - Reading True or False', 'Their parents are watching TV.', '{"source":"questionMap","accepted":["true"],"display":"true"}', null, 28),
  ('el1-q29', 'english-literacy-1', 'Part 5 - Reading True or False', 'The children are planting flowers.', '{"source":"questionMap","accepted":["false"],"display":"false"}', null, 29),
  ('el1-q30', 'english-literacy-1', 'Part 5 - Reading True or False', 'Their teachers said trees provide home for birds.', '{"source":"questionMap","accepted":["true"],"display":"true"}', null, 30)
on conflict (id) do update set
  test_id = excluded.test_id,
  part = excluded.part,
  prompt = excluded.prompt,
  answer_key = excluded.answer_key,
  transcript_ref = excluded.transcript_ref,
  position = excluded.position;

insert into test_questions (id, test_id, part, prompt, answer_key, transcript_ref, position)
values
  ('el2-q1', 'english-literacy-2', 'Part 1 - Homophones', 'I (eight / ate) a lot for breakfast today.', '{"source":"questionMap","accepted":["ate"],"display":"ate"}', null, 1),
  ('el2-q2', 'english-literacy-2', 'Part 1 - Homophones', 'Mr. Smith is an (I / eye) doctor.', '{"source":"questionMap","accepted":["eye"],"display":"eye"}', null, 2),
  ('el2-q3', 'english-literacy-2', 'Part 1 - Homophones', 'Vic is spending his (week / weak) in the province.', '{"source":"questionMap","accepted":["week"],"display":"week"}', null, 3),
  ('el2-q4', 'english-literacy-2', 'Part 1 - Homophones', 'I can''t (wait / weight) to see you.', '{"source":"questionMap","accepted":["wait"],"display":"wait"}', null, 4),
  ('el2-q5', 'english-literacy-2', 'Part 1 - Homophones', 'My mom bought (too / two) shirts for me.', '{"source":"questionMap","accepted":["two"],"display":"two"}', null, 5),
  ('el2-q6', 'english-literacy-2', 'Part 2 - Plurals', 'Truck', '{"source":"questionMap","accepted":["trucks"],"display":"trucks"}', null, 6),
  ('el2-q7', 'english-literacy-2', 'Part 2 - Plurals', 'Box', '{"source":"questionMap","accepted":["boxes"],"display":"boxes"}', null, 7),
  ('el2-q8', 'english-literacy-2', 'Part 2 - Plurals', 'Tomato', '{"source":"questionMap","accepted":["tomatoes"],"display":"tomatoes"}', null, 8),
  ('el2-q9', 'english-literacy-2', 'Part 2 - Plurals', 'Key', '{"source":"questionMap","accepted":["keys"],"display":"keys"}', null, 9),
  ('el2-q10', 'english-literacy-2', 'Part 3 - Syllables', 'Effect', '{"source":"questionMap","accepted":["ef/fect","ef fect"],"display":"ef/fect"}', null, 10),
  ('el2-q11', 'english-literacy-2', 'Part 3 - Syllables', 'Faster', '{"source":"questionMap","accepted":["fast/er","fast er"],"display":"fast/er"}', null, 11),
  ('el2-q12', 'english-literacy-2', 'Part 3 - Syllables', 'Happens', '{"source":"questionMap","accepted":["hap/pens","hap pens"],"display":"hap/pens"}', null, 12),
  ('el2-q13', 'english-literacy-2', 'Part 3 - Syllables', 'Beautiful', '{"source":"questionMap","accepted":["beau/ti/ful","beau ti ful"],"display":"beau/ti/ful"}', null, 13),
  ('el2-q14', 'english-literacy-2', 'Part 3 - Syllables', 'Light', '{"source":"questionMap","accepted":["light"],"display":"light"}', null, 14),
  ('el2-q15', 'english-literacy-2', 'Part 3 - Syllables', 'Elephant', '{"source":"questionMap","accepted":["el/e/phant","el e phant"],"display":"el/e/phant"}', null, 15),
  ('el2-q16', 'english-literacy-2', 'Part 4 - Pronouns', 'The boys are over there. Can you see (they / them)?', '{"source":"questionMap","accepted":["them"],"display":"them"}', null, 16),
  ('el2-q17', 'english-literacy-2', 'Part 4 - Pronouns', 'Listen to (him / he)!', '{"source":"questionMap","accepted":["him"],"display":"him"}', null, 17),
  ('el2-q18', 'english-literacy-2', 'Part 4 - Pronouns', 'Look at (she / her). She''s very pretty.', '{"source":"questionMap","accepted":["her"],"display":"her"}', null, 18),
  ('el2-q19', 'english-literacy-2', 'Part 4 - Pronouns', 'Can you tell (we / us) your name?', '{"source":"questionMap","accepted":["us"],"display":"us"}', null, 19),
  ('el2-q20', 'english-literacy-2', 'Part 4 - Pronouns', 'Please help (I / me).', '{"source":"questionMap","accepted":["me"],"display":"me"}', null, 20),
  ('el2-q21', 'english-literacy-2', 'Part 5 - Reading Comprehension', 'What did the lady give to Rima?', '{"source":"aiSplitGrade","display":"The lady gave Rima saplings and seeds of flower plants."}', null, 21),
  ('el2-q22', 'english-literacy-2', 'Part 5 - Reading Comprehension', 'What did she do with the seeds?', '{"source":"aiSplitGrade","display":"Rima planted the saplings/seeds and sowed or watered them."}', null, 22),
  ('el2-q23', 'english-literacy-2', 'Part 5 - Reading Comprehension', 'How did Rima put up a small flower shop?', '{"source":"aiSplitGrade","display":"She saved or earned money from selling flowers."}', null, 23),
  ('el2-q24', 'english-literacy-2', 'Part 5 - Reading Comprehension', 'Why did she call it green gold?', '{"source":"aiSplitGrade","display":"The plants or flowers helped her earn money or improve her life."}', null, 24),
  ('el2-q25', 'english-literacy-2', 'Part 6 - Sentence Order', 'She saved enough money to open a small flower shop in the market.', '{"source":"questionMap","accepted":["5"],"display":"5"}', null, 25),
  ('el2-q26', 'english-literacy-2', 'Part 6 - Sentence Order', 'She thanked the lady who gave her the green gold.', '{"source":"questionMap","accepted":["6"],"display":"6"}', null, 26),
  ('el2-q27', 'english-literacy-2', 'Part 6 - Sentence Order', 'She watered the plants.', '{"source":"questionMap","accepted":["3"],"display":"3"}', null, 27),
  ('el2-q28', 'english-literacy-2', 'Part 6 - Sentence Order', 'Rima went to her small hut and dug the ground then she planted seeds.', '{"source":"questionMap","accepted":["2"],"display":"2"}', null, 28),
  ('el2-q29', 'english-literacy-2', 'Part 6 - Sentence Order', 'A lady gave her seeds and told her to plant it.', '{"source":"questionMap","accepted":["1"],"display":"1"}', null, 29),
  ('el2-q30', 'english-literacy-2', 'Part 6 - Sentence Order', 'Flowers bloomed and people bought flowers.', '{"source":"questionMap","accepted":["4"],"display":"4"}', null, 30)
on conflict (id) do update set
  test_id = excluded.test_id,
  part = excluded.part,
  prompt = excluded.prompt,
  answer_key = excluded.answer_key,
  transcript_ref = excluded.transcript_ref,
  position = excluded.position;

insert into test_questions (id, test_id, part, prompt, answer_key, transcript_ref, position)
values
  ('el3-q1', 'english-literacy-3', 'Part I - Synonyms', 'I like this song. It makes me at ease.', '{"source":"questionMap","accepted":["comfortable"],"display":"comfortable"}', null, 1),
  ('el3-q2', 'english-literacy-3', 'Part I - Synonyms', 'The ground is moist this morning.', '{"source":"questionMap","accepted":["wet"],"display":"wet"}', null, 2),
  ('el3-q3', 'english-literacy-3', 'Part I - Synonyms', 'The bullies at school irritate me.', '{"source":"questionMap","accepted":["annoy"],"display":"annoy"}', null, 3),
  ('el3-q4', 'english-literacy-3', 'Part I - Synonyms', 'The school is close to our house.', '{"source":"questionMap","accepted":["near"],"display":"near"}', null, 4),
  ('el3-q5', 'english-literacy-3', 'Part I - Synonyms', 'We can predict the weather.', '{"source":"questionMap","accepted":["forecast"],"display":"forecast"}', null, 5),
  ('el3-q6', 'english-literacy-3', 'Part II - Adjective or Adverb', 'Charlotte made a delicious salad.', '{"source":"questionMap","accepted":["adjective"],"display":"adjective"}', null, 6),
  ('el3-q7', 'english-literacy-3', 'Part II - Adjective or Adverb', 'Amy speaks softly.', '{"source":"questionMap","accepted":["adverb"],"display":"adverb"}', null, 7),
  ('el3-q8', 'english-literacy-3', 'Part II - Adjective or Adverb', 'The grumpy lady never smiles.', '{"source":"questionMap","accepted":["adjective"],"display":"adjective"}', null, 8),
  ('el3-q9', 'english-literacy-3', 'Part II - Adjective or Adverb', 'Jessie narrated a funny story.', '{"source":"questionMap","accepted":["adjective"],"display":"adjective"}', null, 9),
  ('el3-q10', 'english-literacy-3', 'Part II - Adjective or Adverb', 'Joe left the party happily.', '{"source":"questionMap","accepted":["adverb"],"display":"adverb"}', null, 10),
  ('el3-q11', 'english-literacy-3', 'Part III - Plurals', 'Mouse', '{"source":"questionMap","accepted":["mice"],"display":"mice"}', null, 11),
  ('el3-q12', 'english-literacy-3', 'Part III - Plurals', 'House', '{"source":"questionMap","accepted":["houses"],"display":"houses"}', null, 12),
  ('el3-q13', 'english-literacy-3', 'Part III - Plurals', 'Fairy', '{"source":"questionMap","accepted":["fairies"],"display":"fairies"}', null, 13),
  ('el3-q14', 'english-literacy-3', 'Part III - Plurals', 'Shelf', '{"source":"questionMap","accepted":["shelves"],"display":"shelves"}', null, 14),
  ('el3-q15', 'english-literacy-3', 'Part III - Plurals', 'Sheep', '{"source":"questionMap","accepted":["sheep"],"display":"sheep"}', null, 15),
  ('el3-q16', 'english-literacy-3', 'Part IV - Subjects', 'The boys are playing in the park.', '{"source":"questionMap","accepted":["the boys","boys"],"display":"the boys"}', null, 16),
  ('el3-q17', 'english-literacy-3', 'Part IV - Subjects', 'Ravi is drinking juice.', '{"source":"questionMap","accepted":["ravi"],"display":"Ravi"}', null, 17),
  ('el3-q18', 'english-literacy-3', 'Part IV - Subjects', 'The Eiffel Tower is amazing.', '{"source":"questionMap","accepted":["the eiffel tower","eiffel tower"],"display":"the Eiffel Tower"}', null, 18),
  ('el3-q19', 'english-literacy-3', 'Part IV - Subjects', 'He is a clever but lazy boy.', '{"source":"questionMap","accepted":["he"],"display":"he"}', null, 19),
  ('el3-q20', 'english-literacy-3', 'Part IV - Subjects', 'The parrot was sitting on the branch of the tree.', '{"source":"questionMap","accepted":["the parrot","parrot"],"display":"the parrot"}', null, 20),
  ('el3-q21', 'english-literacy-3', 'Part V - Reading True or False', 'Coca Cola was invented in June, 1886.', '{"source":"questionMap","accepted":["false"],"display":"false"}', null, 21),
  ('el3-q22', 'english-literacy-3', 'Part V - Reading True or False', 'Dr. John Pemberton is a pharmacist.', '{"source":"questionMap","accepted":["true"],"display":"true"}', null, 22),
  ('el3-q23', 'english-literacy-3', 'Part V - Reading True or False', 'Dr. Pemberton used a four-legged brass kettle to make the soft drink.', '{"source":"questionMap","accepted":["false"],"display":"false"}', null, 23),
  ('el3-q24', 'english-literacy-3', 'Part V - Reading True or False', 'Frank Robinson is a librarian.', '{"source":"questionMap","accepted":["false"],"display":"false"}', null, 24),
  ('el3-q25', 'english-literacy-3', 'Part V - Reading True or False', 'Mr. Robinson has bad penmanship.', '{"source":"questionMap","accepted":["false"],"display":"false"}', null, 25),
  ('el3-q26', 'english-literacy-3', 'Part V - Reading Comprehension', 'Who invented Coca Cola?', '{"source":"aiSplitGrade","display":"John Pemberton"}', null, 26),
  ('el3-q27', 'english-literacy-3', 'Part V - Reading Comprehension', 'Who made the famous logo of Coca Cola?', '{"source":"aiSplitGrade","display":"Frank Robinson"}', null, 27),
  ('el3-q28', 'english-literacy-3', 'Part V - Reading Comprehension', 'Where was Coca Cola first sold to the public?', '{"source":"aiSplitGrade","display":"at the soda fountain in Jacob''s Pharmacy in Atlanta"}', null, 28),
  ('el3-q29', 'english-literacy-3', 'Part V - Reading Comprehension', 'When was Coca Cola first sold to the public?', '{"source":"aiSplitGrade","display":"May 8, 1886"}', null, 29),
  ('el3-q30', 'english-literacy-3', 'Part V - Reading Comprehension', 'How much was the sales for the first year of Coca Cola?', '{"source":"aiSplitGrade","display":"about $50"}', null, 30)
on conflict (id) do update set
  test_id = excluded.test_id,
  part = excluded.part,
  prompt = excluded.prompt,
  answer_key = excluded.answer_key,
  transcript_ref = excluded.transcript_ref,
  position = excluded.position;

insert into test_questions (id, test_id, part, prompt, answer_key, transcript_ref, position)
values
  ('el4-q1', 'english-literacy-4', 'Part I - Homophones', 'When Sami pulled the bird''s (tail / tale), it flapped its wings.', '{"source":"questionMap","accepted":["tail"],"display":"tail"}', null, 1),
  ('el4-q2', 'english-literacy-4', 'Part I - Homophones', 'Please (right / write) down the following information.', '{"source":"questionMap","accepted":["write"],"display":"write"}', null, 2),
  ('el4-q3', 'english-literacy-4', 'Part I - Homophones', 'The (whole / hole) family will be attending the reunion.', '{"source":"questionMap","accepted":["whole"],"display":"whole"}', null, 3),
  ('el4-q4', 'english-literacy-4', 'Part I - Homophones', 'We must try our best to (caste / cast) away all our prejudices.', '{"source":"questionMap","accepted":["cast"],"display":"cast"}', null, 4),
  ('el4-q5', 'english-literacy-4', 'Part I - Homophones', 'The time is half (passed / past) ten.', '{"source":"questionMap","accepted":["past"],"display":"past"}', null, 5),
  ('el4-q6', 'english-literacy-4', 'Part II - Word Box', 'She can ___ the gift nicely.', '{"source":"questionMap","accepted":["wrap"],"display":"wrap"}', null, 6),
  ('el4-q7', 'english-literacy-4', 'Part II - Word Box', 'The little girl has a ___ attitude.', '{"source":"questionMap","accepted":["pleasant"],"display":"pleasant"}', null, 7),
  ('el4-q8', 'english-literacy-4', 'Part II - Word Box', 'He will give me a ___ on my birthday.', '{"source":"questionMap","accepted":["present"],"display":"present"}', null, 8),
  ('el4-q9', 'english-literacy-4', 'Part II - Word Box', 'I love to ___ butter on my bread.', '{"source":"questionMap","accepted":["spread"],"display":"spread"}', null, 9),
  ('el4-q10', 'english-literacy-4', 'Part II - Word Box', 'This perfume has a good ___.', '{"source":"questionMap","accepted":["scent"],"display":"scent"}', null, 10),
  ('el4-q11', 'english-literacy-4', 'Part III - Fact or Opinion', 'Spring is the most beautiful season of all.', '{"source":"questionMap","accepted":["opinion"],"display":"opinion"}', null, 11),
  ('el4-q12', 'english-literacy-4', 'Part III - Fact or Opinion', 'Your birthday comes only one day a year.', '{"source":"questionMap","accepted":["fact"],"display":"fact"}', null, 12),
  ('el4-q13', 'english-literacy-4', 'Part III - Fact or Opinion', 'April is a month with 30 days.', '{"source":"questionMap","accepted":["fact"],"display":"fact"}', null, 13),
  ('el4-q14', 'english-literacy-4', 'Part III - Fact or Opinion', 'Some families eat turkey on Thanksgiving.', '{"source":"questionMap","accepted":["fact"],"display":"fact"}', null, 14),
  ('el4-q15', 'english-literacy-4', 'Part III - Fact or Opinion', 'Everyone should make Valentine''s Day cards.', '{"source":"questionMap","accepted":["opinion"],"display":"opinion"}', null, 15),
  ('el4-q16', 'english-literacy-4', 'Part IV - Past Tense', 'We ___ the research together last time. (do)', '{"source":"questionMap","accepted":["did"],"display":"did"}', null, 16),
  ('el4-q17', 'english-literacy-4', 'Part IV - Past Tense', 'When he ___ from work, his wife ___. (come back / sleep)', '{"source":"questionMap","accepted":["came back / was sleeping","came back was sleeping"],"display":"came back / was sleeping"}', null, 17),
  ('el4-q18', 'english-literacy-4', 'Part IV - Past Tense', 'Andrew ___ his last weekend with his parents on the farm. (spend)', '{"source":"questionMap","accepted":["spent"],"display":"spent"}', null, 18),
  ('el4-q19', 'english-literacy-4', 'Part IV - Past Tense', 'Tom ___ the fence in the garden when his friend ___. (paint / drop by)', '{"source":"questionMap","accepted":["was painting / dropped by","was painting dropped by"],"display":"was painting / dropped by"}', null, 19),
  ('el4-q20', 'english-literacy-4', 'Part IV - Past Tense', 'My mother ___ a lot of sweets when she ___ in the supermarket. (buy / be)', '{"source":"questionMap","accepted":["bought / was","bought was"],"display":"bought / was"}', null, 20),
  ('el4-q21', 'english-literacy-4', 'Part V - Reading True or False', 'Dolphins are aquatic mammals.', '{"source":"questionMap","accepted":["true"],"display":"true"}', null, 21),
  ('el4-q22', 'english-literacy-4', 'Part V - Reading True or False', 'There are 30 different species of dolphins that have been recognized.', '{"source":"questionMap","accepted":["false"],"display":"false"}', null, 22),
  ('el4-q23', 'english-literacy-4', 'Part V - Reading True or False', 'Dolphins are intelligent and curious.', '{"source":"questionMap","accepted":["true"],"display":"true"}', null, 23),
  ('el4-q24', 'english-literacy-4', 'Part V - Reading True or False', 'Four species of dolphins live in the river.', '{"source":"questionMap","accepted":["true"],"display":"true"}', null, 24),
  ('el4-q25', 'english-literacy-4', 'Part V - Reading True or False', 'The skin of the dolphin is not sensitive to human touch.', '{"source":"questionMap","accepted":["false"],"display":"false"}', null, 25),
  ('el4-q26', 'english-literacy-4', 'Part V - Reading Comprehension', 'How many species of dolphins are marine dolphins?', '{"source":"aiSplitGrade","display":"32 species of dolphins are marine dolphins."}', null, 26),
  ('el4-q27', 'english-literacy-4', 'Part V - Reading Comprehension', 'What is the color of the dolphin''s body?', '{"source":"aiSplitGrade","display":"The dolphin''s body is grayish blue."}', null, 27),
  ('el4-q28', 'english-literacy-4', 'Part V - Reading Comprehension', 'How high can a dolphin leap in the air?', '{"source":"aiSplitGrade","display":"A dolphin can leap up to 30 feet in the air."}', null, 28),
  ('el4-q29', 'english-literacy-4', 'Part V - Reading Comprehension', 'What is the average life span for a dolphin in the wild?', '{"source":"aiSplitGrade","display":"The average lifespan is 17 years."}', null, 29),
  ('el4-q30', 'english-literacy-4', 'Part V - Reading Comprehension', 'Why are the dolphins at risk?', '{"source":"aiSplitGrade","display":"Dolphins are at risk because of habitat destruction, food problems, pollutants, fishing nets, boats, injuries, or death."}', null, 30)
on conflict (id) do update set
  test_id = excluded.test_id,
  part = excluded.part,
  prompt = excluded.prompt,
  answer_key = excluded.answer_key,
  transcript_ref = excluded.transcript_ref,
  position = excluded.position;

insert into test_questions (id, test_id, part, prompt, answer_key, transcript_ref, position)
values
  ('el5-q1', 'english-literacy-5', 'Part I - Correct Spelling', 'Choose the correctly spelled word: experiment, experement, iksperement, expirement.', '{"source":"questionMap","accepted":["experiment"],"display":"experiment"}', null, 1),
  ('el5-q2', 'english-literacy-5', 'Part I - Correct Spelling', 'Choose the correctly spelled word: sphaggetti, spaghetti, sphagheti, spagethie.', '{"source":"questionMap","accepted":["spaghetti"],"display":"spaghetti"}', null, 2),
  ('el5-q3', 'english-literacy-5', 'Part I - Correct Spelling', 'Choose the correctly spelled word: beleve, bileive, believe, belive.', '{"source":"questionMap","accepted":["believe"],"display":"believe"}', null, 3),
  ('el5-q4', 'english-literacy-5', 'Part I - Correct Spelling', 'Choose the correctly spelled word: business, buseness, businesse, bussiness.', '{"source":"questionMap","accepted":["business"],"display":"business"}', null, 4),
  ('el5-q5', 'english-literacy-5', 'Part I - Correct Spelling', 'Choose the correctly spelled word: article, artecle, arteckle, artickel.', '{"source":"questionMap","accepted":["article"],"display":"article"}', null, 5),
  ('el5-q6', 'english-literacy-5', 'Part II - Appropriate Word', 'My best friend is very (thoughtfully / thoughtful).', '{"source":"questionMap","accepted":["thoughtful"],"display":"thoughtful"}', null, 6),
  ('el5-q7', 'english-literacy-5', 'Part II - Appropriate Word', 'This problem is very (complication / complicated).', '{"source":"questionMap","accepted":["complicated"],"display":"complicated"}', null, 7),
  ('el5-q8', 'english-literacy-5', 'Part II - Appropriate Word', 'The reporter said the news (briefly / brief).', '{"source":"questionMap","accepted":["briefly"],"display":"briefly"}', null, 8),
  ('el5-q9', 'english-literacy-5', 'Part II - Appropriate Word', 'Julie is a (talentful / talented) girl.', '{"source":"questionMap","accepted":["talented"],"display":"talented"}', null, 9),
  ('el5-q10', 'english-literacy-5', 'Part II - Appropriate Word', 'Ballet dancers move (graceful / gracefully).', '{"source":"questionMap","accepted":["gracefully"],"display":"gracefully"}', null, 10),
  ('el5-q11', 'english-literacy-5', 'Part III - Active or Passive Voice', 'My wallet was lost in the bus station.', '{"source":"questionMap","accepted":["p","passive"],"display":"passive"}', null, 11),
  ('el5-q12', 'english-literacy-5', 'Part III - Active or Passive Voice', 'Sara writes a biography of a famous actress.', '{"source":"questionMap","accepted":["a","active"],"display":"active"}', null, 12),
  ('el5-q13', 'english-literacy-5', 'Part III - Active or Passive Voice', 'The mechanic fixed the broken engine.', '{"source":"questionMap","accepted":["a","active"],"display":"active"}', null, 13),
  ('el5-q14', 'english-literacy-5', 'Part III - Active or Passive Voice', 'This shop is owned by my father.', '{"source":"questionMap","accepted":["p","passive"],"display":"passive"}', null, 14),
  ('el5-q15', 'english-literacy-5', 'Part III - Active or Passive Voice', 'The baby spilled the milk on the floor.', '{"source":"questionMap","accepted":["a","active"],"display":"active"}', null, 15),
  ('el5-q16', 'english-literacy-5', 'Part IV - Odd One Out', 'Choose the word that does not belong: beauty, character, attitude, manner.', '{"source":"questionMap","accepted":["beauty"],"display":"beauty"}', null, 16),
  ('el5-q17', 'english-literacy-5', 'Part IV - Odd One Out', 'Choose the word that does not belong: produce, remove, create, invent.', '{"source":"questionMap","accepted":["remove"],"display":"remove"}', null, 17),
  ('el5-q18', 'english-literacy-5', 'Part IV - Odd One Out', 'Choose the word that does not belong: fresh, new, different, current.', '{"source":"questionMap","accepted":["different"],"display":"different"}', null, 18),
  ('el5-q19', 'english-literacy-5', 'Part IV - Odd One Out', 'Choose the word that does not belong: true, real, fake, genuine.', '{"source":"questionMap","accepted":["fake"],"display":"fake"}', null, 19),
  ('el5-q20', 'english-literacy-5', 'Part IV - Odd One Out', 'Choose the word that does not belong: strange, ordinary, normal, common.', '{"source":"questionMap","accepted":["strange"],"display":"strange"}', null, 20),
  ('el5-q21', 'english-literacy-5', 'Part V - Adjective Forms', 'Spending your free time reading is far ___ than spending it watching TV. (good)', '{"source":"questionMap","accepted":["better"],"display":"better"}', null, 21),
  ('el5-q22', 'english-literacy-5', 'Part V - Adjective Forms', 'February is the ___ month in Chicago. (cold)', '{"source":"questionMap","accepted":["coldest"],"display":"coldest"}', null, 22),
  ('el5-q23', 'english-literacy-5', 'Part V - Adjective Forms', 'My friend is ___ than yours. (fabulous)', '{"source":"questionMap","accepted":["more fabulous"],"display":"more fabulous"}', null, 23),
  ('el5-q24', 'english-literacy-5', 'Part V - Adjective Forms', 'Gulliver''s Travels is the ___ book that I''ve ever read. (interesting)', '{"source":"questionMap","accepted":["most interesting"],"display":"most interesting"}', null, 24),
  ('el5-q25', 'english-literacy-5', 'Part V - Adjective Forms', 'You are the ___ person I know. (kind)', '{"source":"questionMap","accepted":["kindest"],"display":"kindest"}', null, 25),
  ('el5-q26', 'english-literacy-5', 'Part VI - Reading Comprehension', 'Describe how an elephant seal''s movements are different on land than in the water.', '{"source":"aiSplitGrade","display":"On land, an elephant seal is clumsy and has difficulty moving; in water, it moves easily and gracefully."}', null, 26),
  ('el5-q27', 'english-literacy-5', 'Part VI - Reading Comprehension', 'Why do male elephant seals arrive on land before females during the breeding season?', '{"source":"aiSplitGrade","display":"Males arrive first to fight for dominance and decide which males will have large harems of females."}', null, 27),
  ('el5-q28', 'english-literacy-5', 'Part VI - Reading Comprehension', 'Describe two reasons why elephant seals come on land.', '{"source":"aiSplitGrade","display":"Elephant seals come on land to breed and give birth, and to molt."}', null, 28),
  ('el5-q29', 'english-literacy-5', 'Part VI - Reading Comprehension', 'How does an elephant seal obtain its food? What foods are part of its diet?', '{"source":"aiSplitGrade","display":"An elephant seal obtains food by diving to hunt. It eats squid, octopus, and fish."}', null, 29),
  ('el5-q30', 'english-literacy-5', 'Part VI - Reading Comprehension', 'Are elephant seals in danger of becoming extinct today? Why or why not?', '{"source":"aiSplitGrade","display":"Elephant seals are not in danger of becoming extinct today because laws protect their populations."}', null, 30)
on conflict (id) do update set
  test_id = excluded.test_id,
  part = excluded.part,
  prompt = excluded.prompt,
  answer_key = excluded.answer_key,
  transcript_ref = excluded.transcript_ref,
  position = excluded.position;

insert into test_questions (id, test_id, part, prompt, answer_key, transcript_ref, position)
values
  ('sel1-q1', 'summer-english-level-1-pretest', 'Part I - Odd One Out', 'little, tiny, huge, small', '{"source":"questionMap","accepted":["huge"],"display":"huge","status":"draft_inferred"}', null, 1),
  ('sel1-q2', 'summer-english-level-1-pretest', 'Part I - Odd One Out', 'steady, fast, rapid, quick', '{"source":"questionMap","accepted":["steady"],"display":"steady","status":"draft_inferred"}', null, 2),
  ('sel1-q3', 'summer-english-level-1-pretest', 'Part I - Odd One Out', 'jolly, joyful, glad, unhappy', '{"source":"questionMap","accepted":["unhappy"],"display":"unhappy","status":"draft_inferred"}', null, 3),
  ('sel1-q4', 'summer-english-level-1-pretest', 'Part I - Odd One Out', 'freezing, snowy, warm, chilly', '{"source":"questionMap","accepted":["warm"],"display":"warm","status":"draft_inferred"}', null, 4),
  ('sel1-q5', 'summer-english-level-1-pretest', 'Part I - Odd One Out', 'noisy, quiet, deafening, loud', '{"source":"questionMap","accepted":["quiet"],"display":"quiet","status":"draft_inferred"}', null, 5),
  ('sel1-q6', 'summer-english-level-1-pretest', 'Part II - Alphabetical Order', 'numbers, teach, loud, grand', '{"source":"questionMap","accepted":["grand"],"display":"grand","status":"draft_inferred"}', null, 6),
  ('sel1-q7', 'summer-english-level-1-pretest', 'Part II - Alphabetical Order', 'seen, bright, sight, truth', '{"source":"questionMap","accepted":["bright"],"display":"bright","status":"draft_inferred"}', null, 7),
  ('sel1-q8', 'summer-english-level-1-pretest', 'Part II - Alphabetical Order', 'mot, light, stick, clap', '{"source":"questionMap","accepted":["clap"],"display":"clap","status":"draft_inferred"}', null, 8),
  ('sel1-q9', 'summer-english-level-1-pretest', 'Part II - Alphabetical Order', 'rule, rope, rake, ruler', '{"source":"questionMap","accepted":["rake"],"display":"rake","status":"draft_inferred"}', null, 9),
  ('sel1-q10', 'summer-english-level-1-pretest', 'Part II - Alphabetical Order', 'speak, spark, spam, spear', '{"source":"questionMap","accepted":["spam"],"display":"spam","status":"draft_inferred"}', null, 10),
  ('sel1-q11', 'summer-english-level-1-pretest', 'Part III - Sentence Order', 'Mike was invited to Lee''s birthday celebration.', '{"source":"questionMap","accepted":["1"],"display":"1","status":"draft_inferred"}', null, 11),
  ('sel1-q12', 'summer-english-level-1-pretest', 'Part III - Sentence Order', 'Lee''s dad took Mike home.', '{"source":"questionMap","accepted":["5"],"display":"5","status":"draft_inferred"}', null, 12),
  ('sel1-q13', 'summer-english-level-1-pretest', 'Part III - Sentence Order', 'Mike came to Lee''s house at 10.30 am.', '{"source":"questionMap","accepted":["2"],"display":"2","status":"draft_inferred"}', null, 13),
  ('sel1-q14', 'summer-english-level-1-pretest', 'Part III - Sentence Order', 'He ate a lot of cake and three hotdogs.', '{"source":"questionMap","accepted":["3"],"display":"3","status":"draft_inferred"}', null, 14),
  ('sel1-q15', 'summer-english-level-1-pretest', 'Part III - Sentence Order', 'After eating too much, he felt sick.', '{"source":"questionMap","accepted":["4"],"display":"4","status":"draft_inferred"}', null, 15),
  ('sel1-q16', 'summer-english-level-1-pretest', 'Part IV - Vocabulary Match', 'Fetch', '{"source":"questionMap","accepted":["to get something and bring it back"],"display":"b","status":"draft_inferred"}', null, 16),
  ('sel1-q17', 'summer-english-level-1-pretest', 'Part IV - Vocabulary Match', 'Mud', '{"source":"questionMap","accepted":["wet dirt"],"display":"d","status":"draft_inferred"}', null, 17),
  ('sel1-q18', 'summer-english-level-1-pretest', 'Part IV - Vocabulary Match', 'Puddle', '{"source":"questionMap","accepted":["a little pool of water"],"display":"a","status":"draft_inferred"}', null, 18),
  ('sel1-q19', 'summer-english-level-1-pretest', 'Part IV - Vocabulary Match', 'Drag', '{"source":"questionMap","accepted":["to pull"],"display":"e","status":"draft_inferred"}', null, 19),
  ('sel1-q20', 'summer-english-level-1-pretest', 'Part IV - Vocabulary Match', 'Rinse', '{"source":"questionMap","accepted":["to use water to get soap off"],"display":"c","status":"draft_inferred"}', null, 20),
  ('sel1-q21', 'summer-english-level-1-pretest', 'Part V - Homophones', 'My mother has a long ___.', '{"source":"questionMap","accepted":["hair"],"display":"hair","status":"draft_inferred"}', null, 21),
  ('sel1-q22', 'summer-english-level-1-pretest', 'Part V - Homophones', 'I can ___ my name in French.', '{"source":"questionMap","accepted":["write"],"display":"write","status":"draft_inferred"}', null, 22),
  ('sel1-q23', 'summer-english-level-1-pretest', 'Part V - Homophones', '___ do you live?', '{"source":"questionMap","accepted":["Where"],"display":"Where","status":"draft_inferred"}', null, 23),
  ('sel1-q24', 'summer-english-level-1-pretest', 'Part V - Homophones', 'I''ve got a ___, an apple and an orange.', '{"source":"questionMap","accepted":["pear"],"display":"pear","status":"draft_inferred"}', null, 24),
  ('sel1-q25', 'summer-english-level-1-pretest', 'Part V - Homophones', 'Sheila ate a ___ of cake.', '{"source":"questionMap","accepted":["piece"],"display":"piece","status":"draft_inferred"}', null, 25),
  ('sel1-q26', 'summer-english-level-1-pretest', 'Part VI - Reading Comprehension', 'How long was Tanya supposed to practice the piano?', '{"source":"questionMap","accepted":["1 hour"],"display":"c","status":"draft_inferred"}', null, 26),
  ('sel1-q27', 'summer-english-level-1-pretest', 'Part VI - Reading Comprehension', 'Instead of practicing, sometimes Tanya...', '{"source":"questionMap","accepted":["daydreamed"],"display":"c","status":"draft_inferred"}', null, 27),
  ('sel1-q28', 'summer-english-level-1-pretest', 'Part VI - Reading Comprehension', 'Who reminded Tanya she must practice until supper is ready?', '{"source":"questionMap","accepted":["Mom"],"display":"a","status":"draft_inferred"}', null, 28),
  ('sel1-q29', 'summer-english-level-1-pretest', 'Part VI - Reading Comprehension', 'Who took Tanya to the music store?', '{"source":"questionMap","accepted":["Grandma"],"display":"c","status":"draft_inferred"}', null, 29),
  ('sel1-q30', 'summer-english-level-1-pretest', 'Part VI - Reading Comprehension', 'Why does Tanya like the drums?', '{"source":"questionMap","accepted":["Drums are part of the marching band"],"display":"a","status":"draft_inferred"}', null, 30),
  ('sel2-q1', 'summer-english-level-2-pretest', 'Part I - Onomatopoeia', 'My brother likes to ___ his knuckles.', '{"source":"questionMap","accepted":["crack"],"display":"crack","status":"draft_inferred"}', null, 1),
  ('sel2-q2', 'summer-english-level-2-pretest', 'Part I - Onomatopoeia', 'The kitten ___ softly as it rubbed against my legs.', '{"source":"questionMap","accepted":["purred"],"display":"purred","status":"draft_inferred"}', null, 2),
  ('sel2-q3', 'summer-english-level-2-pretest', 'Part I - Onomatopoeia', 'The moth ___ in through the open window.', '{"source":"questionMap","accepted":["fluttered"],"display":"fluttered","status":"draft_inferred"}', null, 3),
  ('sel2-q4', 'summer-english-level-2-pretest', 'Part I - Onomatopoeia', 'The speeding car ___ right past us.', '{"source":"questionMap","accepted":["zoomed"],"display":"zoomed","status":"draft_inferred"}', null, 4),
  ('sel2-q5', 'summer-english-level-2-pretest', 'Part I - Onomatopoeia', 'The milkshake was too thick to ___ through a straw, so I asked for a spoon.', '{"source":"questionMap","accepted":["slurp"],"display":"slurp","status":"draft_inferred"}', null, 5),
  ('sel2-q6', 'summer-english-level-2-pretest', 'Part II - Vocabulary Match', 'Errand', '{"source":"questionMap","accepted":["a trip to deliver a message or to do a particular thing"],"display":"c","status":"draft_inferred"}', null, 6),
  ('sel2-q7', 'summer-english-level-2-pretest', 'Part II - Vocabulary Match', 'Gruff', '{"source":"questionMap","accepted":["rough or rude"],"display":"a","status":"draft_inferred"}', null, 7),
  ('sel2-q8', 'summer-english-level-2-pretest', 'Part II - Vocabulary Match', 'Burly', '{"source":"questionMap","accepted":["strong"],"display":"e","status":"draft_inferred"}', null, 8),
  ('sel2-q9', 'summer-english-level-2-pretest', 'Part II - Vocabulary Match', 'Array', '{"source":"questionMap","accepted":["an impressive display"],"display":"b","status":"draft_inferred"}', null, 9),
  ('sel2-q10', 'summer-english-level-2-pretest', 'Part II - Vocabulary Match', 'Wharf', '{"source":"questionMap","accepted":["a dock"],"display":"d","status":"draft_inferred"}', null, 10),
  ('sel2-q11', 'summer-english-level-2-pretest', 'Part III - Past Tense', 'Last week I ___ (go) horseback riding.', '{"source":"questionMap","accepted":["went"],"display":"went","status":"draft_inferred"}', null, 11),
  ('sel2-q12', 'summer-english-level-2-pretest', 'Part III - Past Tense', 'We ___ (lose) the championship game.', '{"source":"questionMap","accepted":["lost"],"display":"lost","status":"draft_inferred"}', null, 12),
  ('sel2-q13', 'summer-english-level-2-pretest', 'Part III - Past Tense', 'Josh ___ (tear) his knee ligaments during practice.', '{"source":"questionMap","accepted":["tore"],"display":"tore","status":"draft_inferred"}', null, 13),
  ('sel2-q14', 'summer-english-level-2-pretest', 'Part III - Past Tense', 'The boys ___ (eat) their supper without complaint.', '{"source":"questionMap","accepted":["ate"],"display":"ate","status":"draft_inferred"}', null, 14),
  ('sel2-q15', 'summer-english-level-2-pretest', 'Part III - Past Tense', 'Beverly was ___ (sting) by the wasp.', '{"source":"questionMap","accepted":["stung"],"display":"stung","status":"draft_inferred"}', null, 15),
  ('sel2-q16', 'summer-english-level-2-pretest', 'Part IV - Pronoun Rewrite', 'Grandma''s pictures tell stories about Grandma''s life.', '{"source":"aiSplitGrade","display":"They tell stories about her life.","status":"draft_inferred"}', null, 16),
  ('sel2-q17', 'summer-english-level-2-pretest', 'Part IV - Pronoun Rewrite', 'Sarah gave a picture to Wally and Mike.', '{"source":"aiSplitGrade","display":"She gave a picture to them.","status":"draft_inferred"}', null, 17),
  ('sel2-q18', 'summer-english-level-2-pretest', 'Part IV - Pronoun Rewrite', 'Harry and I played boardgames with Mark.', '{"source":"aiSplitGrade","display":"We played boardgames with him.","status":"draft_inferred"}', null, 18),
  ('sel2-q19', 'summer-english-level-2-pretest', 'Part IV - Pronoun Rewrite', 'The chopping board is on the table.', '{"source":"aiSplitGrade","display":"It is on the table.","status":"draft_inferred"}', null, 19),
  ('sel2-q20', 'summer-english-level-2-pretest', 'Part IV - Pronoun Rewrite', 'Thea and Ann are looking for the English book.', '{"source":"aiSplitGrade","display":"They are looking for the English book.","status":"draft_inferred"}', null, 20),
  ('sel2-q21', 'summer-english-level-2-pretest', 'Part V - Fact or Opinion', 'Trees produce oxygen.', '{"source":"questionMap","accepted":["F"],"display":"F","status":"draft_inferred"}', null, 21),
  ('sel2-q22', 'summer-english-level-2-pretest', 'Part V - Fact or Opinion', 'Football is a fun sport.', '{"source":"questionMap","accepted":["O"],"display":"O","status":"draft_inferred"}', null, 22),
  ('sel2-q23', 'summer-english-level-2-pretest', 'Part V - Fact or Opinion', 'Ice hockey is played with sticks and a puck.', '{"source":"questionMap","accepted":["F"],"display":"F","status":"draft_inferred"}', null, 23),
  ('sel2-q24', 'summer-english-level-2-pretest', 'Part V - Fact or Opinion', 'Thailand''s capital is Bangkok.', '{"source":"questionMap","accepted":["F"],"display":"F","status":"draft_inferred"}', null, 24),
  ('sel2-q25', 'summer-english-level-2-pretest', 'Part V - Fact or Opinion', 'Dogs are the best pet animals in the world.', '{"source":"questionMap","accepted":["O"],"display":"O","status":"draft_inferred"}', null, 25),
  ('sel2-q26', 'summer-english-level-2-pretest', 'Part VI - Reading Comprehension', 'What do drops of water turn into?', '{"source":"aiSplitGrade","display":"water vapor","status":"draft_inferred"}', null, 26),
  ('sel2-q27', 'summer-english-level-2-pretest', 'Part VI - Reading Comprehension', 'What are two ways clouds get their names?', '{"source":"aiSplitGrade","display":"Clouds get their names by where they are found in the sky and by their shape.","status":"draft_inferred"}', null, 27),
  ('sel2-q28', 'summer-english-level-2-pretest', 'Part VI - Reading Comprehension', 'What kind of clouds are high clouds?', '{"source":"aiSplitGrade","display":"Cirrus clouds are high clouds.","status":"draft_inferred"}', null, 28),
  ('sel2-q29', 'summer-english-level-2-pretest', 'Part VI - Reading Comprehension', 'What clouds look like giant cotton balls?', '{"source":"aiSplitGrade","display":"Cumulus clouds look like giant cotton balls.","status":"draft_inferred"}', null, 29),
  ('sel2-q30', 'summer-english-level-2-pretest', 'Part VI - Reading Comprehension', 'What causes droplets of water to fall to Earth?', '{"source":"aiSplitGrade","display":"Gravity causes droplets of water to fall to Earth.","status":"draft_inferred"}', null, 30),
  ('sel3-q1', 'summer-english-level-3-pretest', 'Part I - Prefixes and Suffixes', 'I can''t answer this question. It is ___ (possible).', '{"source":"questionMap","accepted":["impossible"],"display":"impossible","status":"draft_inferred"}', null, 1),
  ('sel3-q2', 'summer-english-level-3-pretest', 'Part I - Prefixes and Suffixes', 'Our science ___ is very young. (teach)', '{"source":"questionMap","accepted":["teacher"],"display":"teacher","status":"draft_inferred"}', null, 2),
  ('sel3-q3', 'summer-english-level-3-pretest', 'Part I - Prefixes and Suffixes', 'Paul never waits in the queues. He is too ___ (patient).', '{"source":"questionMap","accepted":["impatient"],"display":"impatient","status":"draft_inferred"}', null, 3),
  ('sel3-q4', 'summer-english-level-3-pretest', 'Part I - Prefixes and Suffixes', 'That was a great film. It was really ___ (enjoy).', '{"source":"questionMap","accepted":["enjoyable"],"display":"enjoyable","status":"draft_inferred"}', null, 4),
  ('sel3-q5', 'summer-english-level-3-pretest', 'Part I - Prefixes and Suffixes', 'If you have a haircut, it will change your ___ (appear).', '{"source":"questionMap","accepted":["appearance"],"display":"appearance","status":"draft_inferred"}', null, 5),
  ('sel3-q6', 'summer-english-level-3-pretest', 'Part I - Prefixes and Suffixes', 'When you ___ this paragraph, make it shorter. (write)', '{"source":"questionMap","accepted":["rewrite"],"display":"rewrite","status":"draft_inferred"}', null, 6),
  ('sel3-q7', 'summer-english-level-3-pretest', 'Part I - Prefixes and Suffixes', 'I like this town. The people are very ___ (friend).', '{"source":"questionMap","accepted":["friendly"],"display":"friendly","status":"draft_inferred"}', null, 7),
  ('sel3-q8', 'summer-english-level-3-pretest', 'Part I - Prefixes and Suffixes', 'Kate started crying because she was so ___ (happy).', '{"source":"questionMap","accepted":["unhappy"],"display":"unhappy","status":"draft_inferred"}', null, 8),
  ('sel3-q9', 'summer-english-level-3-pretest', 'Part II - Word Meaning', 'The word suffice means...', '{"source":"questionMap","accepted":["enough"],"display":"a","status":"draft_inferred"}', null, 9),
  ('sel3-q10', 'summer-english-level-3-pretest', 'Part II - Word Meaning', 'Something that is collapsible is...', '{"source":"questionMap","accepted":["able to be broken down or folded up"],"display":"c","status":"draft_inferred"}', null, 10),
  ('sel3-q11', 'summer-english-level-3-pretest', 'Part II - Word Meaning', 'What do you do if you make ends meet?', '{"source":"questionMap","accepted":["have just enough money to get by"],"display":"d","status":"draft_inferred"}', null, 11),
  ('sel3-q12', 'summer-english-level-3-pretest', 'Part II - Word Meaning', 'A place that is dank is...', '{"source":"questionMap","accepted":["damp and chilly"],"display":"d","status":"draft_inferred"}', null, 12),
  ('sel3-q13', 'summer-english-level-3-pretest', 'Part II - Word Meaning', 'The word vigor means...', '{"source":"questionMap","accepted":["energy and strength"],"display":"c","status":"draft_inferred"}', null, 13),
  ('sel3-q14', 'summer-english-level-3-pretest', 'Part II - Word Meaning', 'If you are summoned to the office, that means you are...', '{"source":"questionMap","accepted":["called to appear"],"display":"c","status":"draft_inferred"}', null, 14),
  ('sel3-q15', 'summer-english-level-3-pretest', 'Part II - Word Meaning', 'The word gratitude means...', '{"source":"questionMap","accepted":["appreciation"],"display":"d","status":"draft_inferred"}', null, 15),
  ('sel3-q16', 'summer-english-level-3-pretest', 'Part III - Fact or Opinion', 'The United States is the greatest country in the world.', '{"source":"questionMap","accepted":["O"],"display":"O","status":"draft_inferred"}', null, 16),
  ('sel3-q17', 'summer-english-level-3-pretest', 'Part III - Fact or Opinion', 'The Mariana Trench is the deepest place in the ocean.', '{"source":"questionMap","accepted":["F"],"display":"F","status":"draft_inferred"}', null, 17),
  ('sel3-q18', 'summer-english-level-3-pretest', 'Part III - Fact or Opinion', 'Carnivores are meat eaters.', '{"source":"questionMap","accepted":["F"],"display":"F","status":"draft_inferred"}', null, 18),
  ('sel3-q19', 'summer-english-level-3-pretest', 'Part III - Fact or Opinion', 'All dinosaurs are extinct.', '{"source":"questionMap","accepted":["F"],"display":"F","status":"draft_inferred"}', null, 19),
  ('sel3-q20', 'summer-english-level-3-pretest', 'Part III - Fact or Opinion', 'Basketball is more interesting than football.', '{"source":"questionMap","accepted":["O"],"display":"O","status":"draft_inferred"}', null, 20),
  ('sel3-q21', 'summer-english-level-3-pretest', 'Part IV - Verb Agreement', 'All of the dogs in the neighborhood ___ barking.', '{"source":"questionMap","accepted":["were"],"display":"were","status":"draft_inferred"}', null, 21),
  ('sel3-q22', 'summer-english-level-3-pretest', 'Part IV - Verb Agreement', 'My friends and my mother ___ each other.', '{"source":"questionMap","accepted":["like"],"display":"like","status":"draft_inferred"}', null, 22),
  ('sel3-q23', 'summer-english-level-3-pretest', 'Part IV - Verb Agreement', 'Fifty dollars ___ a lot to pay for a dinner.', '{"source":"questionMap","accepted":["is"],"display":"is","status":"draft_inferred"}', null, 23),
  ('sel3-q24', 'summer-english-level-3-pretest', 'Part IV - Verb Agreement', 'Six people ___ in a small house.', '{"source":"questionMap","accepted":["live"],"display":"live","status":"draft_inferred"}', null, 24),
  ('sel3-q25', 'summer-english-level-3-pretest', 'Part IV - Verb Agreement', 'Mathematics ___ a very difficult subject.', '{"source":"questionMap","accepted":["is"],"display":"is","status":"draft_inferred"}', null, 25),
  ('sel3-q26', 'summer-english-level-3-pretest', 'Part V - Reading Comprehension', 'What is the goal of Tetris?', '{"source":"questionMap","accepted":["To make complete lines"],"display":"c","status":"draft_inferred"}', null, 26),
  ('sel3-q27', 'summer-english-level-3-pretest', 'Part V - Reading Comprehension', 'After which is Tetris named?', '{"source":"questionMap","accepted":["Tennis"],"display":"d","status":"draft_inferred"}', null, 27),
  ('sel3-q28', 'summer-english-level-3-pretest', 'Part V - Reading Comprehension', 'Which event happened first?', '{"source":"questionMap","accepted":["Tetris was played with letters instead of blocks"],"display":"a","status":"draft_inferred"}', null, 28),
  ('sel3-q29', 'summer-english-level-3-pretest', 'Part V - Reading Comprehension', 'What is the main idea of the second paragraph?', '{"source":"questionMap","accepted":["To explain how Tetris is played"],"display":"b","status":"draft_inferred"}', null, 29),
  ('sel3-q30', 'summer-english-level-3-pretest', 'Part V - Reading Comprehension', 'According to Dr. Richard Haier, which is true about Tetris?', '{"source":"questionMap","accepted":["Tetris boosts mental activity"],"display":"c","status":"draft_inferred"}', null, 30)
on conflict (id) do update set
  test_id = excluded.test_id,
  part = excluded.part,
  prompt = excluded.prompt,
  answer_key = excluded.answer_key,
  transcript_ref = excluded.transcript_ref,
  position = excluded.position;

create or replace function normalize_answer(value text)
returns text
language sql
immutable
as $$
  select btrim(regexp_replace(lower(coalesce(value, '')), '[^a-z0-9]+', ' ', 'g'));
$$;

create or replace function normalize_math_answer(value text, mode text default 'text')
returns text
language sql
immutable
as $$
  select case
    when mode = 'time' then btrim(regexp_replace(regexp_replace(lower(coalesce(value, '')), '[\.\s]+', ':', 'g'), '[^0-9:]+', '', 'g'), ':')
    else btrim(regexp_replace(lower(coalesce(value, '')), '[^a-z0-9+]+', ' ', 'g'))
  end;
$$;

create or replace function math_part_scores(p_question_id text, p_answer_key jsonb, p_answers jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  part_key jsonb;
  part_id text;
  mode text;
  possible numeric;
  raw_json jsonb;
  raw_text text;
  raw_norm text;
  expected_norm text;
  is_part_correct boolean;
  items jsonb := '[]'::jsonb;
begin
  for part_key in select value from jsonb_array_elements(coalesce(p_answer_key->'parts', '[]'::jsonb))
  loop
    part_id := part_key->>'id';
    mode := coalesce(part_key->>'normalizer', 'text');
    possible := coalesce((part_key->>'points')::numeric, 0);
    is_part_correct := false;
    raw_text := '';
    raw_norm := '';

    if mode = 'set' then
      raw_json := coalesce(p_answers->p_question_id->part_id, '[]'::jsonb);
      if jsonb_typeof(raw_json) <> 'array' then
        raw_json := '[]'::jsonb;
      end if;

      select coalesce(string_agg(normalize_math_answer(value, 'text'), ',' order by normalize_math_answer(value, 'text')), '')
      into raw_norm
      from jsonb_array_elements_text(raw_json) as response(value);

      select coalesce(string_agg(normalize_math_answer(value, 'text'), ',' order by normalize_math_answer(value, 'text')), '')
      into expected_norm
      from jsonb_array_elements_text(coalesce(part_key->'accepted', '[]'::jsonb)) as accepted(value);

      select coalesce(string_agg(value, ', ' order by value), '')
      into raw_text
      from jsonb_array_elements_text(raw_json) as response(value);

      is_part_correct := raw_norm <> '' and raw_norm = expected_norm;
    elsif mode = 'keywords' then
      raw_text := coalesce(p_answers->p_question_id->>part_id, '');
      raw_norm := normalize_math_answer(raw_text, 'text');
      is_part_correct := raw_norm <> '' and exists (
        select 1
        from jsonb_array_elements(coalesce(part_key->'keywords', '[]'::jsonb)) as keyword_groups(group_value)
        where not exists (
          select 1
          from jsonb_array_elements_text(keyword_groups.group_value) as words(word)
          where position(normalize_math_answer(words.word, 'text') in raw_norm) = 0
        )
      );
    elsif mode = 'arrowDown' then
      raw_text := coalesce(p_answers->p_question_id->>part_id, '');
      raw_norm := normalize_math_answer(raw_text, 'text');
      is_part_correct := raw_norm = 'down';
    else
      raw_text := coalesce(p_answers->p_question_id->>part_id, '');
      raw_norm := normalize_math_answer(raw_text, mode);
      is_part_correct := raw_norm <> '' and exists (
        select 1
        from jsonb_array_elements_text(coalesce(part_key->'accepted', '[]'::jsonb)) as accepted(value)
        where normalize_math_answer(value, mode) = raw_norm
      );
    end if;

    items := items || jsonb_build_array(jsonb_build_object(
      'id', part_id,
      'response', raw_text,
      'score', case when is_part_correct then possible else 0 end,
      'possible', possible,
      'correct', is_part_correct,
      'normalizer', mode,
      'reviewRecommended', coalesce((part_key->>'reviewRecommended')::boolean, mode in ('keywords', 'arrowDown'))
    ));
  end loop;

  return jsonb_build_object('parts', items);
end;
$$;

create or replace function answer_response(p_answer_key jsonb, p_answers jsonb)
returns text
language plpgsql
stable
as $$
declare
  source_name text := p_answer_key->>'source';
begin
  if source_name = 'questionMap' then
    return coalesce(p_answers->>(p_answer_key->>'id'), '');
  elsif source_name = 'aiGrade' then
    return coalesce(p_answers->>(p_answer_key->>'id'), '');
  elsif source_name = 'aiSplitGrade' then
    return coalesce(p_answers->>(p_answer_key->>'id'), '');
  elsif source_name = 'mathMultiPart' then
    return coalesce((p_answers->(p_answer_key->>'id'))::text, '');
  elsif source_name = 'connections' then
    return coalesce(p_answers->'connections'->>(p_answer_key->>'object'), '');
  elsif source_name = 'textAnswers' then
    return coalesce(p_answers->'textAnswers'->>(p_answer_key->>'id'), '');
  elsif source_name = 'choices' then
    return coalesce(p_answers->'choices'->>(p_answer_key->>'id'), '');
  elsif source_name = 'colours' then
    return coalesce(p_answers->'colours'->>(p_answer_key->>'region'), '');
  elsif source_name = 'rwAnswers' then
    return coalesce(p_answers->'rwAnswers'->>(p_answer_key->>'id'), '');
  end if;
  return '';
end;
$$;

create or replace function question_points(p_answer_key jsonb)
returns numeric
language sql
immutable
as $$
  select coalesce(nullif(p_answer_key->>'points', '')::numeric, 1);
$$;

create or replace function answer_score(p_question_id text, p_answer_key jsonb, p_response text, p_answers jsonb default '{}'::jsonb)
returns numeric
language plpgsql
stable
as $$
declare
  source_name text := p_answer_key->>'source';
  possible numeric := question_points(p_answer_key);
  raw_score numeric := 0;
  math_details jsonb;
  correct_count integer := 0;
begin
  if source_name = 'questionMap' then
    if normalize_answer(p_response) in (
      select normalize_answer(value) from jsonb_array_elements_text(p_answer_key->'accepted') as accepted(value)
    ) then
      return possible;
    end if;
    return 0;
  elsif source_name = 'aiGrade' then
    raw_score := coalesce((p_answers->'aiGrades'->p_question_id->>'score')::numeric, 0);
    return least(greatest(raw_score, 0), possible);
  elsif source_name = 'aiSplitGrade' then
    raw_score := coalesce((p_answers->'aiGrades'->p_question_id->>'score')::numeric, 0);
    return least(greatest(raw_score, 0), possible);
  elsif source_name = 'mathMultiPart' then
    math_details := math_part_scores(p_question_id, p_answer_key, p_answers);
    if p_answer_key ? 'scoreThresholds' then
      select count(*)
      into correct_count
      from jsonb_array_elements(coalesce(math_details->'parts', '[]'::jsonb)) as parts(value)
      where coalesce((value->>'correct')::boolean, false);

      select coalesce(max((value->>'points')::numeric), 0)
      into raw_score
      from jsonb_array_elements(coalesce(p_answer_key->'scoreThresholds', '[]'::jsonb)) as thresholds(value)
      where correct_count >= coalesce((value->>'minCorrect')::integer, 0);

      return least(greatest(raw_score, 0), possible);
    end if;
    select coalesce(sum((value->>'score')::numeric), 0)
    into raw_score
    from jsonb_array_elements(coalesce(math_details->'parts', '[]'::jsonb)) as parts(value);
    return least(greatest(raw_score, 0), possible);
  elsif source_name = 'connections' then
    return case when p_response = p_answer_key->>'target' then possible else 0 end;
  elsif source_name = 'textAnswers' then
    if normalize_answer(p_response) in (
      select normalize_answer(value) from jsonb_array_elements_text(p_answer_key->'accepted') as accepted(value)
    ) then
      return possible;
    end if;
    return 0;
  elsif source_name = 'choices' then
    return case when p_response = p_answer_key->>'correct' then possible else 0 end;
  elsif source_name = 'colours' then
    return case when lower(p_response) = lower(p_answer_key->>'colour') then possible else 0 end;
  elsif source_name = 'rwAnswers' then
    if normalize_answer(p_response) in (
      select normalize_answer(value) from jsonb_array_elements_text(p_answer_key->'accepted') as accepted(value)
    ) then
      return possible;
    end if;
    return 0;
  end if;
  return 0;
end;
$$;

create or replace function is_correct_answer(p_question_id text, p_answer_key jsonb, p_response text, p_answers jsonb default '{}'::jsonb)
returns boolean
language plpgsql
stable
as $$
begin
  return answer_score(p_question_id, p_answer_key, p_response, p_answers) >= question_points(p_answer_key);
end;
$$;

create or replace function grading_details(p_question_id text, p_answer_key jsonb, p_answers jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
as $$
begin
  if p_answer_key->>'source' in ('aiGrade', 'aiSplitGrade') then
    return coalesce(p_answers->'aiGrades'->p_question_id, '{}'::jsonb);
  elsif p_answer_key->>'source' = 'mathMultiPart' then
    return math_part_scores(p_question_id, p_answer_key, p_answers);
  end if;
  return '{}'::jsonb;
end;
$$;

create or replace function response_display(p_question_id text, p_answer_key jsonb, p_response text)
returns text
language plpgsql
stable
as $$
declare
  response_json jsonb;
  part_key jsonb;
  part_id text;
  raw_json jsonb;
  raw_text text;
  items text[] := array[]::text[];
begin
  if p_response is null or p_response = '' then
    return 'No answer';
  end if;
  if p_answer_key->>'source' = 'mathMultiPart' then
    response_json := p_response::jsonb;
    if response_json = '{}'::jsonb then
      return 'No answer';
    end if;
    for part_key in select value from jsonb_array_elements(coalesce(p_answer_key->'parts', '[]'::jsonb))
    loop
      part_id := part_key->>'id';
      raw_json := response_json->part_id;
      if raw_json is null then
        raw_text := '';
      elsif jsonb_typeof(raw_json) = 'array' then
        select coalesce(string_agg(value, ', ' order by value), '')
        into raw_text
        from jsonb_array_elements_text(raw_json) as response(value);
      else
        raw_text := response_json->>part_id;
      end if;
      if coalesce(raw_text, '') <> '' then
        items := array_append(items, part_id || ': ' || raw_text);
      end if;
    end loop;
    if array_length(items, 1) is null then
      return 'No answer';
    end if;
    return array_to_string(items, '; ');
  end if;
  if p_answer_key->>'source' = 'choices' then
    return upper(p_response);
  end if;
  if p_answer_key->>'source' = 'colours' then
    return case lower(p_response)
      when '#ef4444' then 'red'
      when '#f97316' then 'orange'
      when '#facc15' then 'yellow'
      when '#22c55e' then 'green'
      when '#38bdf8' then 'blue'
      when '#a855f7' then 'purple'
      when '#f472b6' then 'pink'
      when '#8b5a2b' then 'brown'
      else p_response
    end;
  end if;
  return p_response;
end;
$$;

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

create or replace function update_own_staff_profile(p_first_name text, p_last_name text, p_date_of_birth date, p_gender text, p_tel text)
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
    where s.deleted_at is null
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

create or replace function submit_attempt(p_assignment_token text, p_student jsonb, p_answers jsonb)
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
  where assignment_token = p_assignment_token and status = 'active';

  if assignment_row.id is null then
    raise exception 'Invalid or inactive assignment';
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
      answer_response(q.answer_key || jsonb_build_object('id', q.id, 'points', q.points), p_answers) as response_value
    from test_questions q
    where q.test_id = assignment_row.test_id
  ),
  scored_display as (
    select
      *,
      answer_score(id, answer_key_with_meta, response_value, p_answers) as awarded,
      question_points(answer_key_with_meta) as possible,
      is_correct_answer(id, answer_key_with_meta, response_value, p_answers) as correct,
      response_display(id, answer_key, response_value) as response_text
    from scored
  )
  select coalesce(sum(possible), 0), coalesce(sum(awarded), 0)
  into v_possible, v_total
  from scored_display;

  insert into test_attempts (assignment_id, student_id, test_id, test_date, score_total, score_possible, score_percent)
  values (
    assignment_row.id,
    v_student_id,
    assignment_row.test_id,
    coalesce((p_student->>'testDate')::date, current_date),
    v_total,
    v_possible,
    case when v_possible = 0 then 0 else round((v_total::numeric / v_possible::numeric) * 100)::int end
  )
  returning id into v_attempt_id;

  insert into attempt_answers (attempt_id, question_id, part, prompt, response, correct_answer, is_correct, awarded_points, possible_points, grading_details, transcript_ref, position)
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
      answer_response(q.answer_key || jsonb_build_object('id', q.id, 'points', q.points), p_answers) as response_value,
      answer_score(q.id, q.answer_key || jsonb_build_object('id', q.id, 'points', q.points), answer_response(q.answer_key || jsonb_build_object('id', q.id, 'points', q.points), p_answers), p_answers) as awarded,
      question_points(q.answer_key || jsonb_build_object('id', q.id, 'points', q.points)) as possible,
      is_correct_answer(q.id, q.answer_key || jsonb_build_object('id', q.id, 'points', q.points), answer_response(q.answer_key || jsonb_build_object('id', q.id, 'points', q.points), p_answers), p_answers) as correct,
      grading_details(q.id, q.answer_key || jsonb_build_object('id', q.id, 'points', q.points), p_answers) as details,
      response_display(q.id, q.answer_key, answer_response(q.answer_key || jsonb_build_object('id', q.id, 'points', q.points), p_answers)) as response_text
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

  return jsonb_build_object(
    'attemptId', v_attempt_id,
    'total', v_total,
    'possible', v_possible,
    'sections', coalesce(sections, '{}'::jsonb)
  );
end;
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

grant usage on schema public to anon, authenticated;
grant execute on function get_assignment(text) to anon, authenticated;
grant execute on function submit_attempt(text, jsonb, jsonb) to anon, authenticated;
grant execute on function create_test_assignment(text) to authenticated;
grant execute on function get_staff_profile() to authenticated;
grant execute on function update_own_staff_profile(text, text, date, text, text) to authenticated;
grant execute on function list_staff_users() to authenticated;
grant execute on function update_staff_access(uuid, text, text[], text) to authenticated;
grant execute on function list_admin_results() to authenticated;
grant execute on function get_admin_result(uuid) to authenticated;
grant select on tests to authenticated;
grant select on admin_attempt_results to authenticated;
