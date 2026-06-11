create extension if not exists pgcrypto;

create table if not exists staff_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  role text not null default 'staff' check (role in ('staff', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists tests (
  id text primary key,
  title text not null,
  subject text not null,
  level text not null,
  status text not null default 'active' check (status in ('active', 'inactive')),
  total_points int not null default 20,
  created_at timestamptz not null default now()
);

alter table tests add column if not exists app_path text not null default '/apps/starter-listening/index.html';

create table if not exists test_questions (
  id text primary key,
  test_id text not null references tests(id) on delete cascade,
  part text not null,
  prompt text not null,
  answer_key jsonb not null,
  transcript_ref text,
  points int not null default 1,
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
  created_by uuid references staff_users(id),
  created_at timestamptz not null default now()
);

create table if not exists test_attempts (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references test_assignments(id),
  student_id uuid not null references students(id),
  test_id text not null references tests(id),
  test_date date not null,
  score_total int not null,
  score_possible int not null,
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
  transcript_ref text,
  position int not null
);

alter table staff_users enable row level security;
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
  );
$$;

drop policy if exists "staff can read tests" on tests;
create policy "staff can read tests" on tests for select using (is_staff());

drop policy if exists "staff can read questions" on test_questions;
create policy "staff can read questions" on test_questions for select using (is_staff());

drop policy if exists "staff can read students" on students;
create policy "staff can read students" on students for select using (is_staff());

drop policy if exists "staff can read assignments" on test_assignments;
create policy "staff can read assignments" on test_assignments for select using (is_staff());

drop policy if exists "staff can read attempts" on test_attempts;
create policy "staff can read attempts" on test_attempts for select using (is_staff());

drop policy if exists "staff can read answers" on attempt_answers;
create policy "staff can read answers" on attempt_answers for select using (is_staff());

insert into tests (id, title, subject, level, status, total_points, app_path)
values
  ('starter-progress-listening', 'Starter Progress Listening', 'English', 'Cambridge Starters', 'inactive', 20, '/apps/starter-listening/index.html'),
  ('starter-progress-test', 'Starter Progress Test', 'English', 'Cambridge Starters', 'active', 45, '/apps/starter-listening/index.html'),
  ('english-literacy-1', 'English Literacy Level 1', 'English', 'English Literacy 1', 'active', 30, '/apps/english-literacy/level-1/index.html')
on conflict (id) do update set
  title = excluded.title,
  subject = excluded.subject,
  level = excluded.level,
  status = excluded.status,
  total_points = excluded.total_points,
  app_path = excluded.app_path;

insert into test_questions (id, test_id, part, prompt, answer_key, transcript_ref, position)
values
  ('p1q1', 'starter-progress-test', 'Listening Part 1', 'Put the clock between the two pictures.', '{"source":"connections","object":"clock","target":"between-pictures","display":"Clock -> between the two pictures"}', '00:01:19', 1),
  ('p1q2', 'starter-progress-test', 'Listening Part 1', 'Put the book under the small table.', '{"source":"connections","object":"book","target":"under-table","display":"Book -> under the small table"}', '00:01:29', 2),
  ('p1q3', 'starter-progress-test', 'Listening Part 1', 'Put the phone on the mat.', '{"source":"connections","object":"phone","target":"rug","display":"Phone -> mat"}', '00:01:45', 3),
  ('p1q4', 'starter-progress-test', 'Listening Part 1', 'Put the camera in the cupboard.', '{"source":"connections","object":"camera","target":"cupboard","display":"Camera -> cupboard"}', '00:02:12', 4),
  ('p1q5', 'starter-progress-test', 'Listening Part 1', 'Put the shell on the table next to the robot.', '{"source":"connections","object":"shell","target":"robot","display":"Shell -> table next to the robot"}', '00:02:28', 5),
  ('p2q1', 'starter-progress-test', 'Listening Part 2', 'What is Lucy''s friend''s name?', '{"source":"textAnswers","accepted":["alex"],"display":"Alex"}', '00:05:19', 6),
  ('p2q2', 'starter-progress-test', 'Listening Part 2', 'Which class are the two children in at school?', '{"source":"textAnswers","accepted":["8","eight","class 8","class eight"],"display":"8 / eight"}', '00:05:50', 7),
  ('p2q3', 'starter-progress-test', 'Listening Part 2', 'How many dogs are there at Lucy''s house?', '{"source":"textAnswers","accepted":["3","three"],"display":"3 / three"}', '00:06:15', 8),
  ('p2q4', 'starter-progress-test', 'Listening Part 2', 'What''s the name of Lucy''s favourite dog?', '{"source":"textAnswers","accepted":["socks"],"display":"Socks"}', '00:06:42', 9),
  ('p2q5', 'starter-progress-test', 'Listening Part 2', 'How many fish has Lucy''s friend got?', '{"source":"textAnswers","accepted":["12","twelve"],"display":"12 / twelve"}', '00:07:32', 10),
  ('p3q1', 'starter-progress-test', 'Listening Part 3', 'Which is May?', '{"source":"choices","correct":"a","display":"A"}', '00:10:34', 11),
  ('p3q2', 'starter-progress-test', 'Listening Part 3', 'Which is Nick''s favourite ice-cream?', '{"source":"choices","correct":"b","display":"B"}', '00:11:03', 12),
  ('p3q3', 'starter-progress-test', 'Listening Part 3', 'What''s Ben doing?', '{"source":"choices","correct":"b","display":"B"}', '00:11:34', 13),
  ('p3q4', 'starter-progress-test', 'Listening Part 3', 'Where''s Kim''s doll?', '{"source":"choices","correct":"c","display":"C"}', '00:11:56', 14),
  ('p3q5', 'starter-progress-test', 'Listening Part 3', 'What''s Dad doing?', '{"source":"choices","correct":"a","display":"A"}', '00:12:22', 15),
  ('p4q1', 'starter-progress-test', 'Listening Part 4', 'Bird on the man''s head', '{"source":"colours","region":"man-bird","colour":"#f472b6","display":"pink"}', '00:15:35', 16),
  ('p4q2', 'starter-progress-test', 'Listening Part 4', 'Bird in the tree', '{"source":"colours","region":"tree-bird","colour":"#facc15","display":"yellow"}', '00:16:05', 17),
  ('p4q3', 'starter-progress-test', 'Listening Part 4', 'Bird next to the plane', '{"source":"colours","region":"flying-bird","colour":"#22c55e","display":"green"}', '00:16:29', 18),
  ('p4q4', 'starter-progress-test', 'Listening Part 4', 'Bird in front of the door', '{"source":"colours","region":"standing-bird","colour":"#8b5a2b","display":"brown"}', '00:17:05', 19),
  ('p4q5', 'starter-progress-test', 'Listening Part 4', 'Bird between the flowers', '{"source":"colours","region":"flower-bird","colour":"#ef4444","display":"red"}', '00:17:54', 20),
  ('rw1q1', 'starter-progress-test', 'Reading & Writing Part 1', 'This is a lizard.', '{"source":"rwAnswers","accepted":["cross","x"],"display":"cross"}', null, 21),
  ('rw1q2', 'starter-progress-test', 'Reading & Writing Part 1', 'This is a bike.', '{"source":"rwAnswers","accepted":["tick","check"],"display":"tick"}', null, 22),
  ('rw1q3', 'starter-progress-test', 'Reading & Writing Part 1', 'This is a pineapple.', '{"source":"rwAnswers","accepted":["tick","check"],"display":"tick"}', null, 23),
  ('rw1q4', 'starter-progress-test', 'Reading & Writing Part 1', 'This is a television.', '{"source":"rwAnswers","accepted":["cross","x"],"display":"cross"}', null, 24),
  ('rw1q5', 'starter-progress-test', 'Reading & Writing Part 1', 'This is a guitar.', '{"source":"rwAnswers","accepted":["tick","check"],"display":"tick"}', null, 25),
  ('rw2q1', 'starter-progress-test', 'Reading & Writing Part 2', 'There are two children in the sea.', '{"source":"rwAnswers","accepted":["yes"],"display":"yes"}', null, 26),
  ('rw2q2', 'starter-progress-test', 'Reading & Writing Part 2', 'The duck is walking behind the two elephants.', '{"source":"rwAnswers","accepted":["yes"],"display":"yes"}', null, 27),
  ('rw2q3', 'starter-progress-test', 'Reading & Writing Part 2', 'The girls are playing with a ball.', '{"source":"rwAnswers","accepted":["no"],"display":"no"}', null, 28),
  ('rw2q4', 'starter-progress-test', 'Reading & Writing Part 2', 'The woman in the boat has got a camera.', '{"source":"rwAnswers","accepted":["yes"],"display":"yes"}', null, 29),
  ('rw2q5', 'starter-progress-test', 'Reading & Writing Part 2', 'The crocodile is eating a coconut.', '{"source":"rwAnswers","accepted":["no"],"display":"no"}', null, 30),
  ('rw3q1', 'starter-progress-test', 'Reading & Writing Part 3', 'Blue trousers', '{"source":"rwAnswers","accepted":["jeans"],"display":"jeans"}', null, 31),
  ('rw3q2', 'starter-progress-test', 'Reading & Writing Part 3', 'Purple shoes', '{"source":"rwAnswers","accepted":["shoes"],"display":"shoes"}', null, 32),
  ('rw3q3', 'starter-progress-test', 'Reading & Writing Part 3', 'Green jacket', '{"source":"rwAnswers","accepted":["jacket"],"display":"jacket"}', null, 33),
  ('rw3q4', 'starter-progress-test', 'Reading & Writing Part 3', 'Handbag', '{"source":"rwAnswers","accepted":["handbag","bag"],"display":"handbag"}', null, 34),
  ('rw3q5', 'starter-progress-test', 'Reading & Writing Part 3', 'Green trousers', '{"source":"rwAnswers","accepted":["trousers"],"display":"trousers"}', null, 35),
  ('rw4q1', 'starter-progress-test', 'Reading & Writing Part 4', 'Long _____ on my head.', '{"source":"rwAnswers","accepted":["hair"],"display":"hair"}', null, 36),
  ('rw4q2', 'starter-progress-test', 'Reading & Writing Part 4', 'I don''t live in a _____ or a garden.', '{"source":"rwAnswers","accepted":["house"],"display":"house"}', null, 37),
  ('rw4q3', 'starter-progress-test', 'Reading & Writing Part 4', 'I like eating _____ and apples.', '{"source":"rwAnswers","accepted":["carrots"],"display":"carrots"}', null, 38),
  ('rw4q4', 'starter-progress-test', 'Reading & Writing Part 4', 'I drink _____.', '{"source":"rwAnswers","accepted":["water"],"display":"water"}', null, 39),
  ('rw4q5', 'starter-progress-test', 'Reading & Writing Part 4', 'A woman, a _____ or a child can ride me.', '{"source":"rwAnswers","accepted":["man"],"display":"man"}', null, 40),
  ('rw5q1', 'starter-progress-test', 'Reading & Writing Part 5', 'What is the teacher drawing?', '{"source":"rwAnswers","accepted":["fish"],"display":"fish"}', null, 41),
  ('rw5q2', 'starter-progress-test', 'Reading & Writing Part 5', 'Who is holding the cat?', '{"source":"rwAnswers","accepted":["girl"],"display":"girl"}', null, 42),
  ('rw5q3', 'starter-progress-test', 'Reading & Writing Part 5', 'What is the teacher doing now?', '{"source":"rwAnswers","accepted":["writing"],"display":"writing"}', null, 43),
  ('rw5q4', 'starter-progress-test', 'Reading & Writing Part 5', 'Where is the cat now?', '{"source":"rwAnswers","accepted":["window"],"display":"window"}', null, 44),
  ('rw5q5', 'starter-progress-test', 'Reading & Writing Part 5', 'How many children are looking at the cat?', '{"source":"rwAnswers","accepted":["2","two"],"display":"two"}', null, 45)
on conflict (id) do update set
  test_id = excluded.test_id,
  part = excluded.part,
  prompt = excluded.prompt,
  answer_key = excluded.answer_key,
  transcript_ref = excluded.transcript_ref,
  position = excluded.position;

insert into test_questions (id, test_id, part, prompt, answer_key, transcript_ref, position)
values
  ('el1-q1', 'english-literacy-1', 'Part A - Rhyming Words', 'Boat', '{"source":"questionMap","accepted":["coat"],"display":"coat"}', null, 1),
  ('el1-q2', 'english-literacy-1', 'Part A - Rhyming Words', 'Glad', '{"source":"questionMap","accepted":["sad"],"display":"sad"}', null, 2),
  ('el1-q3', 'english-literacy-1', 'Part A - Rhyming Words', 'Cage', '{"source":"questionMap","accepted":["page"],"display":"page"}', null, 3),
  ('el1-q4', 'english-literacy-1', 'Part A - Rhyming Words', 'Wish', '{"source":"questionMap","accepted":["fish"],"display":"fish"}', null, 4),
  ('el1-q5', 'english-literacy-1', 'Part A - Rhyming Words', 'Play', '{"source":"questionMap","accepted":["bay"],"display":"bay"}', null, 5),
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

create or replace function normalize_answer(value text)
returns text
language sql
immutable
as $$
  select btrim(regexp_replace(lower(coalesce(value, '')), '[^a-z0-9]+', ' ', 'g'));
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

create or replace function is_correct_answer(p_question_id text, p_answer_key jsonb, p_response text)
returns boolean
language plpgsql
stable
as $$
declare
  source_name text := p_answer_key->>'source';
begin
  if source_name = 'questionMap' then
    return normalize_answer(p_response) in (
      select normalize_answer(value) from jsonb_array_elements_text(p_answer_key->'accepted') as accepted(value)
    );
  elsif source_name = 'connections' then
    return p_response = p_answer_key->>'target';
  elsif source_name = 'textAnswers' then
    return normalize_answer(p_response) in (
      select normalize_answer(value) from jsonb_array_elements_text(p_answer_key->'accepted') as accepted(value)
    );
  elsif source_name = 'choices' then
    return p_response = p_answer_key->>'correct';
  elsif source_name = 'colours' then
    return lower(p_response) = lower(p_answer_key->>'colour');
  elsif source_name = 'rwAnswers' then
    return normalize_answer(p_response) in (
      select normalize_answer(value) from jsonb_array_elements_text(p_answer_key->'accepted') as accepted(value)
    );
  end if;
  return false;
end;
$$;

create or replace function response_display(p_question_id text, p_answer_key jsonb, p_response text)
returns text
language plpgsql
stable
as $$
begin
  if p_response is null or p_response = '' then
    return 'No answer';
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
  select to_jsonb(s) from staff_users s where s.id = auth.uid();
$$;

create or replace function create_test_assignment(p_test_id text)
returns table(id uuid, test_id text, assignment_token text, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_staff() then
    raise exception 'Not authorized';
  end if;
  return query
    insert into test_assignments (test_id, created_by)
    values (p_test_id, auth.uid())
    returning test_assignments.id, test_assignments.test_id, test_assignments.assignment_token, test_assignments.created_at;
end;
$$;

create or replace function get_assignment(p_token text)
returns table(assignment_id uuid, assignment_token text, test_id text, title text, subject text, level text, status text)
language sql
stable
security definer
set search_path = public
as $$
  select a.id, a.assignment_token, t.id, t.title, t.subject, t.level, a.status
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
  v_possible int;
  v_total int;
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
      answer_response(q.answer_key || jsonb_build_object('id', q.id), p_answers) as response_value
    from test_questions q
    where q.test_id = assignment_row.test_id
  ),
  scored_display as (
    select
      *,
      is_correct_answer(id, answer_key, response_value) as correct,
      response_display(id, answer_key, response_value) as response_text
    from scored
  )
  select count(*), count(*) filter (where correct)
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

  insert into attempt_answers (attempt_id, question_id, part, prompt, response, correct_answer, is_correct, transcript_ref, position)
  select
    v_attempt_id,
    id,
    part,
    prompt,
    response_text,
    answer_key->>'display',
    correct,
    transcript_ref,
    position
  from (
    select
      q.*,
      answer_response(q.answer_key || jsonb_build_object('id', q.id), p_answers) as response_value,
      is_correct_answer(q.id, q.answer_key, answer_response(q.answer_key || jsonb_build_object('id', q.id), p_answers)) as correct,
      response_display(q.id, q.answer_key, answer_response(q.answer_key || jsonb_build_object('id', q.id), p_answers)) as response_text
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
    select jsonb_agg(jsonb_build_object('part', part, 'total', correct_count, 'possible', possible_count) order by part)
    from (
      select part, count(*) filter (where is_correct) as correct_count, count(*) as possible_count
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
      'transcript', transcript_ref
    ) order by position)
    from attempt_answers
    where attempt_id = a.id
  ) as answers
from test_attempts a
join tests t on t.id = a.test_id
join students s on s.id = a.student_id
where is_staff();

grant usage on schema public to anon, authenticated;
grant execute on function get_assignment(text) to anon, authenticated;
grant execute on function submit_attempt(text, jsonb, jsonb) to anon, authenticated;
grant execute on function create_test_assignment(text) to authenticated;
grant execute on function get_staff_profile() to authenticated;
grant select on tests to authenticated;
grant select on admin_attempt_results to authenticated;
