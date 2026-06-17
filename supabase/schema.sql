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
  created_by uuid references staff_users(id),
  created_at timestamptz not null default now()
);

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
  ('english-literacy-1', 'English Literacy Level 1', 'English', 'English Literacy 1', 'active', 30, '/apps/english-literacy/level-1/index.html'),
  ('english-literacy-2', 'English Literacy Level 2', 'English', 'English Literacy 2', 'active', 30, '/apps/english-literacy/level-2/index.html'),
  ('english-literacy-3', 'English Literacy Level 3', 'English', 'English Literacy 3', 'active', 30, '/apps/english-literacy/level-3/index.html'),
  ('english-literacy-4', 'English Literacy Level 4', 'English', 'English Literacy 4', 'active', 30, '/apps/english-literacy/level-4/index.html'),
  ('english-literacy-5', 'English Literacy Level 5', 'English', 'English Literacy 5', 'active', 30, '/apps/english-literacy/level-5/index.html'),
  ('math-olympiad-1', 'Math Olympiad Level 1', 'Math', 'Math Olympiad 1', 'active', 30, '/apps/math-olympiad/level-1/index.html'),
  ('math-olympiad-2', 'Math Olympiad Level 2', 'Math', 'Math Olympiad 2', 'active', 30, '/apps/math-olympiad/level-2/index.html'),
  ('math-olympiad-3', 'Math Olympiad Level 3', 'Math', 'Math Olympiad 3', 'active', 30, '/apps/math-olympiad/level-3/index.html'),
  ('math-olympiad-4', 'Math Olympiad Level 4', 'Math', 'Math Olympiad 4', 'active', 30, '/apps/math-olympiad/level-4/index.html'),
  ('math-olympiad-5', 'Math Olympiad Level 5', 'Math', 'Math Olympiad 5', 'active', 30, '/apps/math-olympiad/level-5/index.html'),
  ('math-olympiad-6', 'Math Olympiad Level 6', 'Math', 'Math Olympiad 6', 'active', 30, '/apps/math-olympiad/level-6/index.html')
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

insert into test_questions (id, test_id, part, prompt, answer_key, transcript_ref, points, position)
values
  ('mo1-q1', 'math-olympiad-1', 'Part I', 'What are the missing numbers?', '{"source":"mathMultiPart","display":"5, 7, 9","parts":[{"id":"a","accepted":["5"],"points":0.34},{"id":"b","accepted":["7"],"points":0.33},{"id":"c","accepted":["9"],"points":0.33}]}', null, 1, 1),
  ('mo1-q2', 'math-olympiad-1', 'Part I', 'Complete the number bond.', '{"source":"mathMultiPart","display":"3, 1","parts":[{"id":"top","accepted":["3"],"points":0.5},{"id":"bottom","accepted":["1"],"points":0.5}]}', null, 1, 2),
  ('mo1-q3', 'math-olympiad-1', 'Part I', 'There are 5 oranges. Add 3 more oranges.', '{"source":"mathMultiPart","display":"8, 8","parts":[{"id":"equation","accepted":["8"],"points":1},{"id":"total","accepted":["8"],"points":1}]}', null, 2, 3),
  ('mo1-q4', 'math-olympiad-1', 'Part I', 'There are 5 cakes. 2 cakes are burnt.', '{"source":"mathMultiPart","display":"3, 3","parts":[{"id":"equation","accepted":["3"],"points":1},{"id":"left","accepted":["3"],"points":1}]}', null, 2, 4),
  ('mo1-q5', 'math-olympiad-1', 'Part I', 'Colour the shapes that match the name Square.', '{"source":"mathMultiPart","display":"upright square and tilted square","parts":[{"id":"selected","accepted":["upright-square","tilted-square"],"points":2,"normalizer":"set"}]}', null, 2, 5),
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
  ('mo3-q13', 'math-olympiad-3', 'Part III', 'Find the equivalent time.', '{"source":"mathMultiPart","display":"3 h 10 min, 1 h 55 min","parts":[{"id":"a","accepted":["3 h 10 min","3h10min","3 10"],"points":1},{"id":"b","accepted":["1 h 55 min","1h55min","1 55"],"points":1}]}', null, 2, 13),
  ('mo3-q14', 'math-olympiad-3', 'Part III', 'Choose the line that is parallel to the one shown.', '{"source":"mathMultiPart","display":"parallel","parts":[{"id":"answer","accepted":["parallel"],"points":1}]}', null, 1, 14),
  ('mo3-q15', 'math-olympiad-3', 'Part III', 'Find the perimeter of the figure.', '{"source":"mathMultiPart","display":"51","parts":[{"id":"answer","accepted":["51","51 cm"],"points":2}]}', null, 2, 15),
  ('mo4-q1', 'math-olympiad-4', 'Part I', 'Write the following in numerals.', '{"source":"mathMultiPart","display":"12009, 63045","parts":[{"id":"a","accepted":["12009"],"points":0.5},{"id":"b","accepted":["63045"],"points":0.5}]}', null, 1, 1),
  ('mo4-q2', 'math-olympiad-4', 'Part I', 'Fill in the blanks.', '{"source":"mathMultiPart","display":"560, 9700, 13000","parts":[{"id":"a","accepted":["560"],"points":0.67},{"id":"b","accepted":["9700"],"points":0.67},{"id":"c","accepted":["13000"],"points":0.66}]}', null, 2, 2),
  ('mo4-q3', 'math-olympiad-4', 'Part I', 'Multiply the following.', '{"source":"mathMultiPart","display":"1230, 1512","parts":[{"id":"a","accepted":["1230"],"points":0.5},{"id":"b","accepted":["1512"],"points":0.5}]}', null, 1, 3),
  ('mo4-q4', 'math-olympiad-4', 'Part I', 'Christine and David have stickers. Christine has 5 times as many as David. David has 172 stickers.', '{"source":"mathMultiPart","display":"860, 1032","parts":[{"id":"a","accepted":["860"],"points":1},{"id":"b","accepted":["1032"],"points":1}]}', null, 2, 4),
  ('mo4-q5', 'math-olympiad-4', 'Part I', 'Complete the table for Shuli, James, and Ken, then answer the questions.', '{"source":"mathMultiPart","display":"Shuli: 9 y 6 m, 146 cm, 39 kg; James: 10 y 1 m, 151 cm, 42 kg; Ken: 8 y 8 m, 138 cm, 37 kg; 7 months, 10 months, 13 cm, 2 kg, 435 cm, 118 kg","parts":[{"id":"shuli_age","accepted":["9 y 6 m","9 yr 6 mth","9 years 6 months","9y 6m"],"points":0.2},{"id":"shuli_height","accepted":["146 cm","146"],"points":0.2},{"id":"shuli_mass","accepted":["39 kg","39"],"points":0.2},{"id":"james_age","accepted":["10 y 1 m","10 yr 1 mth","10 years 1 month","10y 1m"],"points":0.2},{"id":"james_height","accepted":["151 cm","151"],"points":0.2},{"id":"james_mass","accepted":["42 kg","42"],"points":0.2},{"id":"ken_age","accepted":["8 y 8 m","8 yr 8 mth","8 years 8 months","8y 8m"],"points":0.2},{"id":"ken_height","accepted":["138 cm","138"],"points":0.2},{"id":"ken_mass","accepted":["37 kg","37"],"points":0.2},{"id":"a","accepted":["7 months","7 mth","7"],"points":0.2},{"id":"b","accepted":["10 months","10 mth","10"],"points":0.2},{"id":"c","accepted":["13 cm","13"],"points":0.2},{"id":"d","accepted":["2 kg","2"],"points":0.2},{"id":"e","accepted":["435 cm","435"],"points":0.2},{"id":"f","accepted":["118 kg","118"],"points":0.2}]}', null, 3, 5),
  ('mo4-q6', 'math-olympiad-4', 'Part II', 'The line graph shows shirts sold from Monday to Saturday.', '{"source":"mathMultiPart","display":"35, Monday, 10, 600, 90","parts":[{"id":"a","accepted":["35"],"points":0.6},{"id":"b","accepted":["Monday","Mon"],"points":0.6},{"id":"c","accepted":["10"],"points":0.6},{"id":"d","accepted":["600","$600"],"points":0.6},{"id":"e","accepted":["90"],"points":0.6}]}', null, 3, 6),
  ('mo4-q7', 'math-olympiad-4', 'Part II', 'Arrange the fractions from smallest to greatest.', '{"source":"mathMultiPart","display":"1/4, 3/8, 5/12, 5/6; 1/12, 2/3, 7/9, 5/6","parts":[{"id":"a","accepted":["1/4, 3/8, 5/12, 5/6","1/4 3/8 5/12 5/6"],"points":1},{"id":"b","accepted":["1/12, 2/3, 7/9, 5/6","1/12 2/3 7/9 5/6"],"points":1}]}', null, 2, 7),
  ('mo4-q8', 'math-olympiad-4', 'Part II', 'Solve each of the following.', '{"source":"mathMultiPart","display":"5, 12","parts":[{"id":"a","accepted":["5"],"points":1},{"id":"b","accepted":["12"],"points":1}]}', null, 2, 8),
  ('mo4-q9', 'math-olympiad-4', 'Part II', 'Fill in the blanks in the direction table.', '{"source":"mathMultiPart","display":"North, East, 315, 45","parts":[{"id":"a","accepted":["North"],"points":0.5},{"id":"b","accepted":["East"],"points":0.5},{"id":"c","accepted":["315","315°"],"points":0.5},{"id":"d","accepted":["45","45°"],"points":0.5}]}', null, 2, 9),
  ('mo4-q10', 'math-olympiad-4', 'Part II', 'The figure is made up of two squares. Find DE.', '{"source":"mathMultiPart","display":"4","parts":[{"id":"answer","accepted":["4","4 cm"],"points":2}]}', null, 2, 10),
  ('mo4-q11', 'math-olympiad-4', 'Part III', 'Fill in the blanks with the missing decimals.', '{"source":"mathMultiPart","display":"0.008, 0.06","parts":[{"id":"a","accepted":["0.008"],"points":1},{"id":"b","accepted":["0.06"],"points":1}]}', null, 2, 11),
  ('mo4-q12', 'math-olympiad-4', 'Part III', 'Jim cycled from his home to the market and then to his school.', '{"source":"mathMultiPart","display":"13.13","parts":[{"id":"answer","accepted":["13.13","13 13/100"],"points":2}]}', null, 2, 12),
  ('mo4-q13', 'math-olympiad-4', 'Part III', 'Write down the times using the 12-hour and 24-hour clocks.', '{"source":"mathMultiPart","display":"10:45, 22:45, 1:35 a.m., 1:35 p.m.","parts":[{"id":"a","accepted":["10:45","10.45"],"points":0.5,"normalizer":"time"},{"id":"b","accepted":["22:45","22.45"],"points":0.5,"normalizer":"time"},{"id":"c","accepted":["1:35 a.m.","1.35 a.m.","1:35 am"],"points":0.5,"normalizer":"time"},{"id":"d","accepted":["1:35 p.m.","1.35 p.m.","1:35 pm"],"points":0.5,"normalizer":"time"}]}', null, 2, 13),
  ('mo4-q14', 'math-olympiad-4', 'Part III', 'Find the perimeter and area of the figure.', '{"source":"mathMultiPart","display":"48 cm, 199 cm2","parts":[{"id":"a","accepted":["48 cm","48"],"points":1},{"id":"b","accepted":["199 cm2","199 cm²","199"],"points":1}]}', null, 2, 14),
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

insert into test_questions (id, test_id, part, prompt, answer_key, transcript_ref, position)
values
  ('el2-q1', 'english-literacy-2', 'Part A - Homophones', 'I (eight / ate) a lot for breakfast today.', '{"source":"questionMap","accepted":["ate"],"display":"ate"}', null, 1),
  ('el2-q2', 'english-literacy-2', 'Part A - Homophones', 'Mr. Smith is an (I / eye) doctor.', '{"source":"questionMap","accepted":["eye"],"display":"eye"}', null, 2),
  ('el2-q3', 'english-literacy-2', 'Part A - Homophones', 'Vic is spending his (week / weak) in the province.', '{"source":"questionMap","accepted":["week"],"display":"week"}', null, 3),
  ('el2-q4', 'english-literacy-2', 'Part A - Homophones', 'I can''t (wait / weight) to see you.', '{"source":"questionMap","accepted":["wait"],"display":"wait"}', null, 4),
  ('el2-q5', 'english-literacy-2', 'Part A - Homophones', 'My mom bought (too / two) shirts for me.', '{"source":"questionMap","accepted":["two"],"display":"two"}', null, 5),
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
      'correct', is_part_correct
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
