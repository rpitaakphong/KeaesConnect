-- Fix active-test smoke scoring rows without resetting existing assignments or attempts.

insert into test_questions (id, test_id, part, prompt, answer_key, transcript_ref, points, position)
values
  ('starter-listening-part1', 'starter-progress-listening', 'Listening Part 1', 'Put each object in the correct place in the room.', '{"source":"mathMultiPart","display":"clock: between the two pictures; book: under the small table; phone: mat; camera: cupboard; shell: table next to the robot","parts":[{"id":"clock","accepted":["between-pictures"],"points":1},{"id":"book","accepted":["under-table"],"points":1},{"id":"phone","accepted":["rug"],"points":1},{"id":"camera","accepted":["cupboard"],"points":1},{"id":"shell","accepted":["robot"],"points":1}],"status":"registry"}'::jsonb, null, 5, 1),
  ('starter-listening-part2', 'starter-progress-listening', 'Listening Part 2', 'Listen and write the answers.', '{"source":"mathMultiPart","display":"1 Alex; 2 eight; 3 three; 4 socks; 5 twelve","parts":[{"id":"p2q1","accepted":["Alex"],"points":1},{"id":"p2q2","accepted":["8","eight","class 8","class eight"],"points":1},{"id":"p2q3","accepted":["3","three"],"points":1},{"id":"p2q4","accepted":["Socks"],"points":1},{"id":"p2q5","accepted":["12","twelve"],"points":1}],"status":"registry"}'::jsonb, null, 5, 2),
  ('starter-listening-p3q1', 'starter-progress-listening', 'Listening Part 3', 'Which is May?', '{"source":"questionMap","accepted":["a"],"display":"A","status":"registry"}'::jsonb, null, 1, 3),
  ('starter-listening-p3q2', 'starter-progress-listening', 'Listening Part 3', 'Which is Nick''s favourite ice-cream?', '{"source":"questionMap","accepted":["b"],"display":"B","status":"registry"}'::jsonb, null, 1, 4),
  ('starter-listening-p3q3', 'starter-progress-listening', 'Listening Part 3', 'What is Ben doing?', '{"source":"questionMap","accepted":["b"],"display":"B","status":"registry"}'::jsonb, null, 1, 5),
  ('starter-listening-p3q4', 'starter-progress-listening', 'Listening Part 3', 'Where is Kim''s doll?', '{"source":"questionMap","accepted":["c"],"display":"C","status":"registry"}'::jsonb, null, 1, 6),
  ('starter-listening-p3q5', 'starter-progress-listening', 'Listening Part 3', 'What is Dad doing?', '{"source":"questionMap","accepted":["a"],"display":"A","status":"registry"}'::jsonb, null, 1, 7),
  ('starter-listening-part4', 'starter-progress-listening', 'Listening Part 4', 'Colour the picture.', '{"source":"mathMultiPart","display":"bird on man''s head: pink; bird in tree: yellow; flying bird: green; bird near house: brown; bird between flowers: red","parts":[{"id":"man-bird","accepted":["#f472b6"],"points":1},{"id":"tree-bird","accepted":["#facc15"],"points":1},{"id":"flying-bird","accepted":["#22c55e"],"points":1},{"id":"standing-bird","accepted":["#8b5a2b"],"points":1},{"id":"flower-bird","accepted":["#ef4444"],"points":1}],"status":"registry"}'::jsonb, null, 5, 8),
  ('starter-rw-p1q1', 'starter-progress-reading-writing', 'Reading & Writing Part 1', 'This is a lizard.', '{"source":"questionMap","accepted":["cross"],"display":"cross","status":"registry"}'::jsonb, null, 1, 1),
  ('starter-rw-p1q2', 'starter-progress-reading-writing', 'Reading & Writing Part 1', 'This is a bike.', '{"source":"questionMap","accepted":["tick"],"display":"tick","status":"registry"}'::jsonb, null, 1, 2),
  ('starter-rw-p1q3', 'starter-progress-reading-writing', 'Reading & Writing Part 1', 'This is a pineapple.', '{"source":"questionMap","accepted":["tick"],"display":"tick","status":"registry"}'::jsonb, null, 1, 3),
  ('starter-rw-p1q4', 'starter-progress-reading-writing', 'Reading & Writing Part 1', 'This is a television.', '{"source":"questionMap","accepted":["cross"],"display":"cross","status":"registry"}'::jsonb, null, 1, 4),
  ('starter-rw-p1q5', 'starter-progress-reading-writing', 'Reading & Writing Part 1', 'This is a guitar.', '{"source":"questionMap","accepted":["tick"],"display":"tick","status":"registry"}'::jsonb, null, 1, 5),
  ('starter-rw-p2q1', 'starter-progress-reading-writing', 'Reading & Writing Part 2', 'There are two children in the sea.', '{"source":"questionMap","accepted":["yes"],"display":"yes","status":"registry"}'::jsonb, null, 1, 6),
  ('starter-rw-p2q2', 'starter-progress-reading-writing', 'Reading & Writing Part 2', 'The duck is walking behind the two elephants.', '{"source":"questionMap","accepted":["yes"],"display":"yes","status":"registry"}'::jsonb, null, 1, 7),
  ('starter-rw-p2q3', 'starter-progress-reading-writing', 'Reading & Writing Part 2', 'The girls are playing with a ball.', '{"source":"questionMap","accepted":["no"],"display":"no","status":"registry"}'::jsonb, null, 1, 8),
  ('starter-rw-p2q4', 'starter-progress-reading-writing', 'Reading & Writing Part 2', 'The woman in the boat has got a camera.', '{"source":"questionMap","accepted":["yes"],"display":"yes","status":"registry"}'::jsonb, null, 1, 9),
  ('starter-rw-p2q5', 'starter-progress-reading-writing', 'Reading & Writing Part 2', 'The crocodile is eating a coconut.', '{"source":"questionMap","accepted":["no"],"display":"no","status":"registry"}'::jsonb, null, 1, 10),
  ('starter-rw-p3q1', 'starter-progress-reading-writing', 'Reading & Writing Part 3', 'Blue trousers', '{"source":"questionMap","accepted":["jeans"],"display":"jeans","status":"registry"}'::jsonb, null, 1, 11),
  ('starter-rw-p3q2', 'starter-progress-reading-writing', 'Reading & Writing Part 3', 'Purple shoes', '{"source":"questionMap","accepted":["shoes"],"display":"shoes","status":"registry"}'::jsonb, null, 1, 12),
  ('starter-rw-p3q3', 'starter-progress-reading-writing', 'Reading & Writing Part 3', 'Green jacket', '{"source":"questionMap","accepted":["jacket"],"display":"jacket","status":"registry"}'::jsonb, null, 1, 13),
  ('starter-rw-p3q4', 'starter-progress-reading-writing', 'Reading & Writing Part 3', 'Handbag', '{"source":"questionMap","accepted":["handbag"],"display":"handbag","status":"registry"}'::jsonb, null, 1, 14),
  ('starter-rw-p3q5', 'starter-progress-reading-writing', 'Reading & Writing Part 3', 'Green trousers', '{"source":"questionMap","accepted":["trousers"],"display":"trousers","status":"registry"}'::jsonb, null, 1, 15),
  ('starter-rw-p4q1', 'starter-progress-reading-writing', 'Reading & Writing Part 4', 'Long _____ on my head.', '{"source":"questionMap","accepted":["hair"],"display":"hair","status":"registry"}'::jsonb, null, 1, 16),
  ('starter-rw-p4q2', 'starter-progress-reading-writing', 'Reading & Writing Part 4', 'I do not live in a _____ or a garden.', '{"source":"questionMap","accepted":["house"],"display":"house","status":"registry"}'::jsonb, null, 1, 17),
  ('starter-rw-p4q3', 'starter-progress-reading-writing', 'Reading & Writing Part 4', 'I like eating _____ and apples.', '{"source":"questionMap","accepted":["carrots"],"display":"carrots","status":"registry"}'::jsonb, null, 1, 18),
  ('starter-rw-p4q4', 'starter-progress-reading-writing', 'Reading & Writing Part 4', 'I drink _____.', '{"source":"questionMap","accepted":["water"],"display":"water","status":"registry"}'::jsonb, null, 1, 19),
  ('starter-rw-p4q5', 'starter-progress-reading-writing', 'Reading & Writing Part 4', 'A woman, a _____ or a child can ride me.', '{"source":"questionMap","accepted":["man"],"display":"man","status":"registry"}'::jsonb, null, 1, 20),
  ('starter-rw-p5q1', 'starter-progress-reading-writing', 'Reading & Writing Part 5', 'What is the teacher drawing? a ...', '{"source":"questionMap","accepted":["fish"],"display":"fish","status":"registry"}'::jsonb, null, 1, 21),
  ('starter-rw-p5q2', 'starter-progress-reading-writing', 'Reading & Writing Part 5', 'Who is holding the cat? a ...', '{"source":"questionMap","accepted":["girl"],"display":"girl","status":"registry"}'::jsonb, null, 1, 22),
  ('starter-rw-p5q3', 'starter-progress-reading-writing', 'Reading & Writing Part 5', 'What is the teacher doing now?', '{"source":"questionMap","accepted":["writing"],"display":"writing","status":"registry"}'::jsonb, null, 1, 23),
  ('starter-rw-p5q4', 'starter-progress-reading-writing', 'Reading & Writing Part 5', 'Where is the cat now? at the ...', '{"source":"questionMap","accepted":["window"],"display":"window","status":"registry"}'::jsonb, null, 1, 24),
  ('starter-rw-p5q5', 'starter-progress-reading-writing', 'Reading & Writing Part 5', 'How many children are looking at the cat?', '{"source":"questionMap","accepted":["two"],"display":"two","status":"registry"}'::jsonb, null, 1, 25)
on conflict (id) do update set
  test_id = excluded.test_id,
  part = excluded.part,
  prompt = excluded.prompt,
  answer_key = excluded.answer_key,
  transcript_ref = excluded.transcript_ref,
  points = excluded.points,
  position = excluded.position;

update test_questions
set answer_key = '{"source":"mathMultiPart","display":"3, 10, 1, 55","parts":[{"id":"a_hours","accepted":["3"],"points":0.5},{"id":"a_minutes","accepted":["10"],"points":0.5},{"id":"b_hours","accepted":["1"],"points":0.5},{"id":"b_minutes","accepted":["55"],"points":0.5}]}'::jsonb
where id = 'mo3-q13';

update test_questions
set answer_key = '{"source":"mathMultiPart","display":"2, 3, 1, 4, 4, 1, 2, 3","parts":[{"id":"a_3_8","accepted":["2"],"points":0.25},{"id":"a_5_12","accepted":["3"],"points":0.25},{"id":"a_1_4","accepted":["1"],"points":0.25},{"id":"a_5_6","accepted":["4"],"points":0.25},{"id":"b_5_6","accepted":["4"],"points":0.25},{"id":"b_1_12","accepted":["1"],"points":0.25},{"id":"b_2_3","accepted":["2"],"points":0.25},{"id":"b_7_9","accepted":["3"],"points":0.25}]}'::jsonb
where id = 'mo4-q7';

update test_questions
set answer_key = '{"source":"mathMultiPart","display":"48 cm, 119 cm2","parts":[{"id":"a","accepted":["48 cm","48"],"points":1},{"id":"b","accepted":["119 cm2","119 cm²","119"],"points":1}]}'::jsonb
where id = 'mo4-q14';
