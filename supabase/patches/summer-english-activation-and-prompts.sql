-- Upsert Summer English tests and sync prompt text used in production result rows.
-- This patch is for existing Supabase projects. Fresh resets use supabase/schema.sql.

insert into public.tests (id, title, subject, level, status, total_points, app_path)
values
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

insert into public.test_questions (id, test_id, part, prompt, answer_key, transcript_ref, points, position)
values
  ('sel1-q1', 'summer-english-level-1-pretest', 'Part I - Odd One Out', 'little, tiny, huge, small', '{"source":"questionMap","accepted":["huge"],"display":"huge","status":"draft_inferred"}', null, 1, 1),
  ('sel1-q2', 'summer-english-level-1-pretest', 'Part I - Odd One Out', 'steady, fast, rapid, quick', '{"source":"questionMap","accepted":["steady"],"display":"steady","status":"draft_inferred"}', null, 1, 2),
  ('sel1-q3', 'summer-english-level-1-pretest', 'Part I - Odd One Out', 'jolly, joyful, glad, unhappy', '{"source":"questionMap","accepted":["unhappy"],"display":"unhappy","status":"draft_inferred"}', null, 1, 3),
  ('sel1-q4', 'summer-english-level-1-pretest', 'Part I - Odd One Out', 'freezing, snowy, warm, chilly', '{"source":"questionMap","accepted":["warm"],"display":"warm","status":"draft_inferred"}', null, 1, 4),
  ('sel1-q5', 'summer-english-level-1-pretest', 'Part I - Odd One Out', 'noisy, quiet, deafening, loud', '{"source":"questionMap","accepted":["quiet"],"display":"quiet","status":"draft_inferred"}', null, 1, 5),
  ('sel1-q6', 'summer-english-level-1-pretest', 'Part II - Alphabetical Order', 'numbers, teach, loud, grand', '{"source":"questionMap","accepted":["grand"],"display":"grand","status":"draft_inferred"}', null, 1, 6),
  ('sel1-q7', 'summer-english-level-1-pretest', 'Part II - Alphabetical Order', 'seen, bright, sight, truth', '{"source":"questionMap","accepted":["bright"],"display":"bright","status":"draft_inferred"}', null, 1, 7),
  ('sel1-q8', 'summer-english-level-1-pretest', 'Part II - Alphabetical Order', 'mot, light, stick, clap', '{"source":"questionMap","accepted":["clap"],"display":"clap","status":"draft_inferred"}', null, 1, 8),
  ('sel1-q9', 'summer-english-level-1-pretest', 'Part II - Alphabetical Order', 'rule, rope, rake, ruler', '{"source":"questionMap","accepted":["rake"],"display":"rake","status":"draft_inferred"}', null, 1, 9),
  ('sel1-q10', 'summer-english-level-1-pretest', 'Part II - Alphabetical Order', 'speak, spark, spam, spear', '{"source":"questionMap","accepted":["spam"],"display":"spam","status":"draft_inferred"}', null, 1, 10),
  ('sel1-q11', 'summer-english-level-1-pretest', 'Part III - Sentence Order', 'Mike was invited to Lee''s birthday celebration.', '{"source":"questionMap","accepted":["1"],"display":"1","status":"draft_inferred"}', null, 1, 11),
  ('sel1-q12', 'summer-english-level-1-pretest', 'Part III - Sentence Order', 'Lee''s dad took Mike home.', '{"source":"questionMap","accepted":["5"],"display":"5","status":"draft_inferred"}', null, 1, 12),
  ('sel1-q13', 'summer-english-level-1-pretest', 'Part III - Sentence Order', 'Mike came to Lee''s house at 10.30 am.', '{"source":"questionMap","accepted":["2"],"display":"2","status":"draft_inferred"}', null, 1, 13),
  ('sel1-q14', 'summer-english-level-1-pretest', 'Part III - Sentence Order', 'He ate a lot of cake and three hotdogs.', '{"source":"questionMap","accepted":["3"],"display":"3","status":"draft_inferred"}', null, 1, 14),
  ('sel1-q15', 'summer-english-level-1-pretest', 'Part III - Sentence Order', 'After eating too much, he felt sick.', '{"source":"questionMap","accepted":["4"],"display":"4","status":"draft_inferred"}', null, 1, 15),
  ('sel1-q16', 'summer-english-level-1-pretest', 'Part IV - Vocabulary Match', 'Fetch', '{"source":"questionMap","accepted":["to get something and bring it back"],"display":"b","status":"draft_inferred"}', null, 1, 16),
  ('sel1-q17', 'summer-english-level-1-pretest', 'Part IV - Vocabulary Match', 'Mud', '{"source":"questionMap","accepted":["wet dirt"],"display":"d","status":"draft_inferred"}', null, 1, 17),
  ('sel1-q18', 'summer-english-level-1-pretest', 'Part IV - Vocabulary Match', 'Puddle', '{"source":"questionMap","accepted":["a little pool of water"],"display":"a","status":"draft_inferred"}', null, 1, 18),
  ('sel1-q19', 'summer-english-level-1-pretest', 'Part IV - Vocabulary Match', 'Drag', '{"source":"questionMap","accepted":["to pull"],"display":"e","status":"draft_inferred"}', null, 1, 19),
  ('sel1-q20', 'summer-english-level-1-pretest', 'Part IV - Vocabulary Match', 'Rinse', '{"source":"questionMap","accepted":["to use water to get soap off"],"display":"c","status":"draft_inferred"}', null, 1, 20),
  ('sel1-q21', 'summer-english-level-1-pretest', 'Part V - Homophones', 'My mother has a long ___.', '{"source":"questionMap","accepted":["hair"],"display":"hair","status":"draft_inferred"}', null, 1, 21),
  ('sel1-q22', 'summer-english-level-1-pretest', 'Part V - Homophones', 'I can ___ my name in French.', '{"source":"questionMap","accepted":["write"],"display":"write","status":"draft_inferred"}', null, 1, 22),
  ('sel1-q23', 'summer-english-level-1-pretest', 'Part V - Homophones', '___ do you live?', '{"source":"questionMap","accepted":["Where"],"display":"Where","status":"draft_inferred"}', null, 1, 23),
  ('sel1-q24', 'summer-english-level-1-pretest', 'Part V - Homophones', 'I''ve got a ___, an apple and an orange.', '{"source":"questionMap","accepted":["pear"],"display":"pear","status":"draft_inferred"}', null, 1, 24),
  ('sel1-q25', 'summer-english-level-1-pretest', 'Part V - Homophones', 'Sheila ate a ___ of cake.', '{"source":"questionMap","accepted":["piece"],"display":"piece","status":"draft_inferred"}', null, 1, 25),
  ('sel1-q26', 'summer-english-level-1-pretest', 'Part VI - Reading Comprehension', 'How long was Tanya supposed to practice the piano?', '{"source":"questionMap","accepted":["1 hour"],"display":"c","status":"draft_inferred"}', null, 1, 26),
  ('sel1-q27', 'summer-english-level-1-pretest', 'Part VI - Reading Comprehension', 'Instead of practicing, sometimes Tanya...', '{"source":"questionMap","accepted":["daydreamed"],"display":"c","status":"draft_inferred"}', null, 1, 27),
  ('sel1-q28', 'summer-english-level-1-pretest', 'Part VI - Reading Comprehension', 'Who reminded Tanya she must practice until supper is ready?', '{"source":"questionMap","accepted":["Mom"],"display":"a","status":"draft_inferred"}', null, 1, 28),
  ('sel1-q29', 'summer-english-level-1-pretest', 'Part VI - Reading Comprehension', 'Who took Tanya to the music store?', '{"source":"questionMap","accepted":["Grandma"],"display":"c","status":"draft_inferred"}', null, 1, 29),
  ('sel1-q30', 'summer-english-level-1-pretest', 'Part VI - Reading Comprehension', 'Why does Tanya like the drums?', '{"source":"questionMap","accepted":["Drums are part of the marching band"],"display":"a","status":"draft_inferred"}', null, 1, 30),
  ('sel2-q1', 'summer-english-level-2-pretest', 'Part I - Onomatopoeia', 'My brother likes to ___ his knuckles.', '{"source":"questionMap","accepted":["crack"],"display":"crack","status":"draft_inferred"}', null, 1, 1),
  ('sel2-q2', 'summer-english-level-2-pretest', 'Part I - Onomatopoeia', 'The kitten ___ softly as it rubbed against my legs.', '{"source":"questionMap","accepted":["purred"],"display":"purred","status":"draft_inferred"}', null, 1, 2),
  ('sel2-q3', 'summer-english-level-2-pretest', 'Part I - Onomatopoeia', 'The moth ___ in through the open window.', '{"source":"questionMap","accepted":["fluttered"],"display":"fluttered","status":"draft_inferred"}', null, 1, 3),
  ('sel2-q4', 'summer-english-level-2-pretest', 'Part I - Onomatopoeia', 'The speeding car ___ right past us.', '{"source":"questionMap","accepted":["zoomed"],"display":"zoomed","status":"draft_inferred"}', null, 1, 4),
  ('sel2-q5', 'summer-english-level-2-pretest', 'Part I - Onomatopoeia', 'The milkshake was too thick to ___ through a straw, so I asked for a spoon.', '{"source":"questionMap","accepted":["slurp"],"display":"slurp","status":"draft_inferred"}', null, 1, 5),
  ('sel2-q6', 'summer-english-level-2-pretest', 'Part II - Vocabulary Match', 'Errand', '{"source":"questionMap","accepted":["a trip to deliver a message or to do a particular thing"],"display":"c","status":"draft_inferred"}', null, 1, 6),
  ('sel2-q7', 'summer-english-level-2-pretest', 'Part II - Vocabulary Match', 'Gruff', '{"source":"questionMap","accepted":["rough or rude"],"display":"a","status":"draft_inferred"}', null, 1, 7),
  ('sel2-q8', 'summer-english-level-2-pretest', 'Part II - Vocabulary Match', 'Burly', '{"source":"questionMap","accepted":["strong"],"display":"e","status":"draft_inferred"}', null, 1, 8),
  ('sel2-q9', 'summer-english-level-2-pretest', 'Part II - Vocabulary Match', 'Array', '{"source":"questionMap","accepted":["an impressive display"],"display":"b","status":"draft_inferred"}', null, 1, 9),
  ('sel2-q10', 'summer-english-level-2-pretest', 'Part II - Vocabulary Match', 'Wharf', '{"source":"questionMap","accepted":["a dock"],"display":"d","status":"draft_inferred"}', null, 1, 10),
  ('sel2-q11', 'summer-english-level-2-pretest', 'Part III - Past Tense', 'Last week I ___ (go) horseback riding.', '{"source":"questionMap","accepted":["went"],"display":"went","status":"draft_inferred"}', null, 1, 11),
  ('sel2-q12', 'summer-english-level-2-pretest', 'Part III - Past Tense', 'We ___ (lose) the championship game.', '{"source":"questionMap","accepted":["lost"],"display":"lost","status":"draft_inferred"}', null, 1, 12),
  ('sel2-q13', 'summer-english-level-2-pretest', 'Part III - Past Tense', 'Josh ___ (tear) his knee ligaments during practice.', '{"source":"questionMap","accepted":["tore"],"display":"tore","status":"draft_inferred"}', null, 1, 13),
  ('sel2-q14', 'summer-english-level-2-pretest', 'Part III - Past Tense', 'The boys ___ (eat) their supper without complaint.', '{"source":"questionMap","accepted":["ate"],"display":"ate","status":"draft_inferred"}', null, 1, 14),
  ('sel2-q15', 'summer-english-level-2-pretest', 'Part III - Past Tense', 'Beverly was ___ (sting) by the wasp.', '{"source":"questionMap","accepted":["stung"],"display":"stung","status":"draft_inferred"}', null, 1, 15),
  ('sel2-q16', 'summer-english-level-2-pretest', 'Part IV - Pronoun Rewrite', 'Grandma''s pictures tell stories about Grandma''s life.', '{"source":"aiSplitGrade","display":"They tell stories about her life.","status":"draft_inferred"}', null, 1, 16),
  ('sel2-q17', 'summer-english-level-2-pretest', 'Part IV - Pronoun Rewrite', 'Sarah gave a picture to Wally and Mike.', '{"source":"aiSplitGrade","display":"She gave a picture to them.","status":"draft_inferred"}', null, 1, 17),
  ('sel2-q18', 'summer-english-level-2-pretest', 'Part IV - Pronoun Rewrite', 'Harry and I played boardgames with Mark.', '{"source":"aiSplitGrade","display":"We played boardgames with him.","status":"draft_inferred"}', null, 1, 18),
  ('sel2-q19', 'summer-english-level-2-pretest', 'Part IV - Pronoun Rewrite', 'The chopping board is on the table.', '{"source":"aiSplitGrade","display":"It is on the table.","status":"draft_inferred"}', null, 1, 19),
  ('sel2-q20', 'summer-english-level-2-pretest', 'Part IV - Pronoun Rewrite', 'Thea and Ann are looking for the English book.', '{"source":"aiSplitGrade","display":"They are looking for the English book.","status":"draft_inferred"}', null, 1, 20),
  ('sel2-q21', 'summer-english-level-2-pretest', 'Part V - Fact or Opinion', 'Trees produce oxygen.', '{"source":"questionMap","accepted":["F"],"display":"F","status":"draft_inferred"}', null, 1, 21),
  ('sel2-q22', 'summer-english-level-2-pretest', 'Part V - Fact or Opinion', 'Football is a fun sport.', '{"source":"questionMap","accepted":["O"],"display":"O","status":"draft_inferred"}', null, 1, 22),
  ('sel2-q23', 'summer-english-level-2-pretest', 'Part V - Fact or Opinion', 'Ice hockey is played with sticks and a puck.', '{"source":"questionMap","accepted":["F"],"display":"F","status":"draft_inferred"}', null, 1, 23),
  ('sel2-q24', 'summer-english-level-2-pretest', 'Part V - Fact or Opinion', 'Thailand''s capital is Bangkok.', '{"source":"questionMap","accepted":["F"],"display":"F","status":"draft_inferred"}', null, 1, 24),
  ('sel2-q25', 'summer-english-level-2-pretest', 'Part V - Fact or Opinion', 'Dogs are the best pet animals in the world.', '{"source":"questionMap","accepted":["O"],"display":"O","status":"draft_inferred"}', null, 1, 25),
  ('sel2-q26', 'summer-english-level-2-pretest', 'Part VI - Reading Comprehension', 'What do drops of water turn into?', '{"source":"aiSplitGrade","display":"water vapor","status":"draft_inferred"}', null, 1, 26),
  ('sel2-q27', 'summer-english-level-2-pretest', 'Part VI - Reading Comprehension', 'What are two ways clouds get their names?', '{"source":"aiSplitGrade","display":"Clouds get their names by where they are found in the sky and by their shape.","status":"draft_inferred"}', null, 1, 27),
  ('sel2-q28', 'summer-english-level-2-pretest', 'Part VI - Reading Comprehension', 'What kind of clouds are high clouds?', '{"source":"aiSplitGrade","display":"Cirrus clouds are high clouds.","status":"draft_inferred"}', null, 1, 28),
  ('sel2-q29', 'summer-english-level-2-pretest', 'Part VI - Reading Comprehension', 'What clouds look like giant cotton balls?', '{"source":"aiSplitGrade","display":"Cumulus clouds look like giant cotton balls.","status":"draft_inferred"}', null, 1, 29),
  ('sel2-q30', 'summer-english-level-2-pretest', 'Part VI - Reading Comprehension', 'What causes droplets of water to fall to Earth?', '{"source":"aiSplitGrade","display":"Gravity causes droplets of water to fall to Earth.","status":"draft_inferred"}', null, 1, 30),
  ('sel3-q1', 'summer-english-level-3-pretest', 'Part I - Prefixes and Suffixes', 'I can''t answer this question. It is ___ (possible).', '{"source":"questionMap","accepted":["impossible"],"display":"impossible","status":"draft_inferred"}', null, 1, 1),
  ('sel3-q2', 'summer-english-level-3-pretest', 'Part I - Prefixes and Suffixes', 'Our science ___ is very young. (teach)', '{"source":"questionMap","accepted":["teacher"],"display":"teacher","status":"draft_inferred"}', null, 1, 2),
  ('sel3-q3', 'summer-english-level-3-pretest', 'Part I - Prefixes and Suffixes', 'Paul never waits in the queues. He is too ___ (patient).', '{"source":"questionMap","accepted":["impatient"],"display":"impatient","status":"draft_inferred"}', null, 1, 3),
  ('sel3-q4', 'summer-english-level-3-pretest', 'Part I - Prefixes and Suffixes', 'That was a great film. It was really ___ (enjoy).', '{"source":"questionMap","accepted":["enjoyable"],"display":"enjoyable","status":"draft_inferred"}', null, 1, 4),
  ('sel3-q5', 'summer-english-level-3-pretest', 'Part I - Prefixes and Suffixes', 'If you have a haircut, it will change your ___ (appear).', '{"source":"questionMap","accepted":["appearance"],"display":"appearance","status":"draft_inferred"}', null, 1, 5),
  ('sel3-q6', 'summer-english-level-3-pretest', 'Part I - Prefixes and Suffixes', 'When you ___ this paragraph, make it shorter. (write)', '{"source":"questionMap","accepted":["rewrite"],"display":"rewrite","status":"draft_inferred"}', null, 1, 6),
  ('sel3-q7', 'summer-english-level-3-pretest', 'Part I - Prefixes and Suffixes', 'I like this town. The people are very ___ (friend).', '{"source":"questionMap","accepted":["friendly"],"display":"friendly","status":"draft_inferred"}', null, 1, 7),
  ('sel3-q8', 'summer-english-level-3-pretest', 'Part I - Prefixes and Suffixes', 'Kate started crying because she was so ___ (happy).', '{"source":"questionMap","accepted":["unhappy"],"display":"unhappy","status":"draft_inferred"}', null, 1, 8),
  ('sel3-q9', 'summer-english-level-3-pretest', 'Part II - Word Meaning', 'The word suffice means...', '{"source":"questionMap","accepted":["enough"],"display":"a","status":"draft_inferred"}', null, 1, 9),
  ('sel3-q10', 'summer-english-level-3-pretest', 'Part II - Word Meaning', 'Something that is collapsible is...', '{"source":"questionMap","accepted":["able to be broken down or folded up"],"display":"c","status":"draft_inferred"}', null, 1, 10),
  ('sel3-q11', 'summer-english-level-3-pretest', 'Part II - Word Meaning', 'What do you do if you make ends meet?', '{"source":"questionMap","accepted":["have just enough money to get by"],"display":"d","status":"draft_inferred"}', null, 1, 11),
  ('sel3-q12', 'summer-english-level-3-pretest', 'Part II - Word Meaning', 'A place that is dank is...', '{"source":"questionMap","accepted":["damp and chilly"],"display":"d","status":"draft_inferred"}', null, 1, 12),
  ('sel3-q13', 'summer-english-level-3-pretest', 'Part II - Word Meaning', 'The word vigor means...', '{"source":"questionMap","accepted":["energy and strength"],"display":"c","status":"draft_inferred"}', null, 1, 13),
  ('sel3-q14', 'summer-english-level-3-pretest', 'Part II - Word Meaning', 'If you are summoned to the office, that means you are...', '{"source":"questionMap","accepted":["called to appear"],"display":"c","status":"draft_inferred"}', null, 1, 14),
  ('sel3-q15', 'summer-english-level-3-pretest', 'Part II - Word Meaning', 'The word gratitude means...', '{"source":"questionMap","accepted":["appreciation"],"display":"d","status":"draft_inferred"}', null, 1, 15),
  ('sel3-q16', 'summer-english-level-3-pretest', 'Part III - Fact or Opinion', 'The United States is the greatest country in the world.', '{"source":"questionMap","accepted":["O"],"display":"O","status":"draft_inferred"}', null, 1, 16),
  ('sel3-q17', 'summer-english-level-3-pretest', 'Part III - Fact or Opinion', 'The Mariana Trench is the deepest place in the ocean.', '{"source":"questionMap","accepted":["F"],"display":"F","status":"draft_inferred"}', null, 1, 17),
  ('sel3-q18', 'summer-english-level-3-pretest', 'Part III - Fact or Opinion', 'Carnivores are meat eaters.', '{"source":"questionMap","accepted":["F"],"display":"F","status":"draft_inferred"}', null, 1, 18),
  ('sel3-q19', 'summer-english-level-3-pretest', 'Part III - Fact or Opinion', 'All dinosaurs are extinct.', '{"source":"questionMap","accepted":["F"],"display":"F","status":"draft_inferred"}', null, 1, 19),
  ('sel3-q20', 'summer-english-level-3-pretest', 'Part III - Fact or Opinion', 'Basketball is more interesting than football.', '{"source":"questionMap","accepted":["O"],"display":"O","status":"draft_inferred"}', null, 1, 20),
  ('sel3-q21', 'summer-english-level-3-pretest', 'Part IV - Verb Agreement', 'All of the dogs in the neighborhood ___ barking.', '{"source":"questionMap","accepted":["were"],"display":"were","status":"draft_inferred"}', null, 1, 21),
  ('sel3-q22', 'summer-english-level-3-pretest', 'Part IV - Verb Agreement', 'My friends and my mother ___ each other.', '{"source":"questionMap","accepted":["like"],"display":"like","status":"draft_inferred"}', null, 1, 22),
  ('sel3-q23', 'summer-english-level-3-pretest', 'Part IV - Verb Agreement', 'Fifty dollars ___ a lot to pay for a dinner.', '{"source":"questionMap","accepted":["is"],"display":"is","status":"draft_inferred"}', null, 1, 23),
  ('sel3-q24', 'summer-english-level-3-pretest', 'Part IV - Verb Agreement', 'Six people ___ in a small house.', '{"source":"questionMap","accepted":["live"],"display":"live","status":"draft_inferred"}', null, 1, 24),
  ('sel3-q25', 'summer-english-level-3-pretest', 'Part IV - Verb Agreement', 'Mathematics ___ a very difficult subject.', '{"source":"questionMap","accepted":["is"],"display":"is","status":"draft_inferred"}', null, 1, 25),
  ('sel3-q26', 'summer-english-level-3-pretest', 'Part V - Reading Comprehension', 'What is the goal of Tetris?', '{"source":"questionMap","accepted":["To make complete lines"],"display":"c","status":"draft_inferred"}', null, 1, 26),
  ('sel3-q27', 'summer-english-level-3-pretest', 'Part V - Reading Comprehension', 'After which is Tetris named?', '{"source":"questionMap","accepted":["Tennis"],"display":"d","status":"draft_inferred"}', null, 1, 27),
  ('sel3-q28', 'summer-english-level-3-pretest', 'Part V - Reading Comprehension', 'Which event happened first?', '{"source":"questionMap","accepted":["Tetris was played with letters instead of blocks"],"display":"a","status":"draft_inferred"}', null, 1, 28),
  ('sel3-q29', 'summer-english-level-3-pretest', 'Part V - Reading Comprehension', 'What is the main idea of the second paragraph?', '{"source":"questionMap","accepted":["To explain how Tetris is played"],"display":"b","status":"draft_inferred"}', null, 1, 29),
  ('sel3-q30', 'summer-english-level-3-pretest', 'Part V - Reading Comprehension', 'According to Dr. Richard Haier, which is true about Tetris?', '{"source":"questionMap","accepted":["Tetris boosts mental activity"],"display":"c","status":"draft_inferred"}', null, 1, 30)
on conflict (id) do update set
  test_id = excluded.test_id,
  part = excluded.part,
  prompt = excluded.prompt,
  answer_key = excluded.answer_key,
  transcript_ref = excluded.transcript_ref,
  points = excluded.points,
  position = excluded.position;

update public.test_questions
set prompt = case id
  when 'sel1-q21' then 'My mother has a long ___.'
  when 'sel1-q22' then 'I can ___ my name in French.'
  when 'sel1-q23' then '___ do you live?'
  when 'sel1-q24' then 'I''ve got a ___, an apple and an orange.'
  when 'sel1-q25' then 'Sheila ate a ___ of cake.'
  when 'sel3-q21' then 'All of the dogs in the neighborhood ___ barking.'
  when 'sel3-q22' then 'My friends and my mother ___ each other.'
  when 'sel3-q23' then 'Fifty dollars ___ a lot to pay for a dinner.'
  when 'sel3-q24' then 'Six people ___ in a small house.'
  when 'sel3-q25' then 'Mathematics ___ a very difficult subject.'
  else prompt
end
where id in (
  'sel1-q21',
  'sel1-q22',
  'sel1-q23',
  'sel1-q24',
  'sel1-q25',
  'sel3-q21',
  'sel3-q22',
  'sel3-q23',
  'sel3-q24',
  'sel3-q25'
);
