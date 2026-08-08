begin;

insert into tests (id, title, subject, level, status, total_points, app_path)
values (
  'spip-year-8-english-pre',
  'SPIP Year 8 English Pre-test',
  'English',
  'SPIP Year 8',
  'inactive',
  99,
  '/tests/spip-year-8-english-pre/start'
)
on conflict (id) do update set
  title = excluded.title,
  subject = excluded.subject,
  level = excluded.level,
  status = 'inactive',
  total_points = excluded.total_points,
  app_path = excluded.app_path;

delete from test_questions where test_id = 'spip-year-8-english-pre';

insert into test_questions (id, test_id, part, prompt, answer_key, transcript_ref, points, position)
values
  ('spip-y8e-r1-8', 'spip-year-8-english-pre', 'Reading Part 1', 'Complete gaps 1-8 in What is genealogy?', '{"source":"mathMultiPart","id":"spip-y8e-r1-8","points":8,"display":"1 B; 2 C; 3 B; 4 D; 5 C; 6 A; 7 D; 8 B (provisional)","status":"draft_inferred","parts":[{"id":"gap1","accepted":["b"],"points":1},{"id":"gap2","accepted":["c"],"points":1},{"id":"gap3","accepted":["b"],"points":1},{"id":"gap4","accepted":["d"],"points":1},{"id":"gap5","accepted":["c"],"points":1},{"id":"gap6","accepted":["a"],"points":1},{"id":"gap7","accepted":["d"],"points":1},{"id":"gap8","accepted":["b"],"points":1}]}', null, 8, 1),
  ('spip-y8e-r9', 'spip-year-8-english-pre', 'Reading Part 2', 'The Le Mans race track in France was (9) _____ I first saw some guys doing motorbike stunts.', '{"source":"rwAnswers","id":"spip-y8e-r9","accepted":["where"],"display":"where","status":"draft_inferred"}', null, 1, 2),
  ('spip-y8e-r10', 'spip-year-8-english-pre', 'Reading Part 2', 'I was (10) _____ impressed I went straight home.', '{"source":"rwAnswers","id":"spip-y8e-r10","accepted":["so"],"display":"so","status":"draft_inferred"}', null, 1, 3),
  ('spip-y8e-r11', 'spip-year-8-english-pre', 'Reading Part 2', 'I taught (11) _____ to do the same.', '{"source":"rwAnswers","id":"spip-y8e-r11","accepted":["myself"],"display":"myself","status":"draft_inferred"}', null, 1, 4),
  ('spip-y8e-r12', 'spip-year-8-english-pre', 'Reading Part 2', 'I have a degree (12) _____ mechanical engineering.', '{"source":"rwAnswers","id":"spip-y8e-r12","accepted":["in"],"display":"in","status":"draft_inferred"}', null, 1, 5),
  ('spip-y8e-r13', 'spip-year-8-english-pre', 'Reading Part 2', 'I look at the physics (13) _____ lies behind each stunt.', '{"source":"rwAnswers","id":"spip-y8e-r13","accepted":["which","that"],"display":"which / that","status":"draft_inferred"}', null, 1, 6),
  ('spip-y8e-r14', 'spip-year-8-english-pre', 'Reading Part 2', 'I have to work (14) _____ every stunt I do.', '{"source":"rwAnswers","id":"spip-y8e-r14","accepted":["out"],"display":"out","status":"draft_inferred"}', null, 1, 7),
  ('spip-y8e-r15', 'spip-year-8-english-pre', 'Reading Part 2', 'Apart (15) _____ some minor mechanical problem, nothing ever goes wrong.', '{"source":"rwAnswers","id":"spip-y8e-r15","accepted":["from"],"display":"from","status":"draft_inferred"}', null, 1, 8),
  ('spip-y8e-r16', 'spip-year-8-english-pre', 'Reading Part 2', 'I never feel in (16) _____ kind of danger.', '{"source":"rwAnswers","id":"spip-y8e-r16","accepted":["any"],"display":"any","status":"draft_inferred"}', null, 1, 9),
  ('spip-y8e-r17', 'spip-year-8-english-pre', 'Reading Part 3', 'PRODUCT', '{"source":"rwAnswers","id":"spip-y8e-r17","accepted":["producer"],"display":"producer","status":"draft_inferred"}', null, 1, 10),
  ('spip-y8e-r18', 'spip-year-8-english-pre', 'Reading Part 3', 'ILL', '{"source":"rwAnswers","id":"spip-y8e-r18","accepted":["illness","illnesses"],"display":"illness / illnesses","status":"draft_inferred"}', null, 1, 11),
  ('spip-y8e-r19', 'spip-year-8-english-pre', 'Reading Part 3', 'EFFECT', '{"source":"rwAnswers","id":"spip-y8e-r19","accepted":["effective"],"display":"effective","status":"draft_inferred"}', null, 1, 12),
  ('spip-y8e-r20', 'spip-year-8-english-pre', 'Reading Part 3', 'SCIENCE', '{"source":"rwAnswers","id":"spip-y8e-r20","accepted":["scientists"],"display":"scientists","status":"draft_inferred"}', null, 1, 13),
  ('spip-y8e-r21', 'spip-year-8-english-pre', 'Reading Part 3', 'ADD', '{"source":"rwAnswers","id":"spip-y8e-r21","accepted":["addition"],"display":"addition","status":"draft_inferred"}', null, 1, 14),
  ('spip-y8e-r22', 'spip-year-8-english-pre', 'Reading Part 3', 'PRESS', '{"source":"rwAnswers","id":"spip-y8e-r22","accepted":["pressure"],"display":"pressure","status":"draft_inferred"}', null, 1, 15),
  ('spip-y8e-r23', 'spip-year-8-english-pre', 'Reading Part 3', 'ADVANTAGE', '{"source":"rwAnswers","id":"spip-y8e-r23","accepted":["disadvantage"],"display":"disadvantage","status":"draft_inferred"}', null, 1, 16),
  ('spip-y8e-r24', 'spip-year-8-english-pre', 'Reading Part 3', 'SPICE', '{"source":"rwAnswers","id":"spip-y8e-r24","accepted":["spicy"],"display":"spicy","status":"draft_inferred"}', null, 1, 17),
  ('spip-y8e-r25', 'spip-year-8-english-pre', 'Reading Part 4', 'Joan was in favour of visiting the museum. Joan thought it would be _____ to the museum.', '{"source":"rwAnswers","id":"spip-y8e-r25","accepted":["a good idea to go"],"display":"a good idea to go","status":"draft_inferred"}', null, 1, 18),
  ('spip-y8e-r26', 'spip-year-8-english-pre', 'Reading Part 4', 'Arthur has the talent to become a concert pianist. Arthur is so _____ could become a concert pianist.', '{"source":"rwAnswers","id":"spip-y8e-r26","accepted":["talented that he"],"display":"talented that he","status":"draft_inferred"}', null, 1, 19),
  ('spip-y8e-r27', 'spip-year-8-english-pre', 'Reading Part 4', 'Do you know when the match starts, Sally? asked Mary. Mary asked Sally _____ time the match started.', '{"source":"rwAnswers","id":"spip-y8e-r27","accepted":["if she knew what"],"display":"if she knew what","status":"draft_inferred"}', null, 1, 20),
  ('spip-y8e-r28', 'spip-year-8-english-pre', 'Reading Part 4', 'I knocked for ages at Ruth''s door but I got no reply. I _____ knocking at Ruth''s door but I got no reply.', '{"source":"rwAnswers","id":"spip-y8e-r28","accepted":["spent a long time"],"display":"spent a long time","status":"draft_inferred"}', null, 1, 21),
  ('spip-y8e-r29', 'spip-year-8-english-pre', 'Reading Part 4', 'Everyone says that the band is planning a world tour next year. The band _____ planning a world tour next year.', '{"source":"rwAnswers","id":"spip-y8e-r29","accepted":["is said to be"],"display":"is said to be","status":"draft_inferred"}', null, 1, 22),
  ('spip-y8e-r30', 'spip-year-8-english-pre', 'Reading Part 4', 'I would prefer not to cancel the meeting. I would rather _____ the meeting.', '{"source":"rwAnswers","id":"spip-y8e-r30","accepted":["not call off"],"display":"not call off","status":"draft_inferred"}', null, 1, 23),
  ('spip-y8e-r31', 'spip-year-8-english-pre', 'Reading Part 5', 'In the first paragraph, what is Caitlin''s main point about the island?', '{"source":"rwAnswers","id":"spip-y8e-r31","accepted":["c"],"display":"C","status":"draft_inferred"}', null, 1, 24),
  ('spip-y8e-r32', 'spip-year-8-english-pre', 'Reading Part 5', 'What does Caitlin suggest about her father?', '{"source":"rwAnswers","id":"spip-y8e-r32","accepted":["d"],"display":"D","status":"draft_inferred"}', null, 1, 25),
  ('spip-y8e-r33', 'spip-year-8-english-pre', 'Reading Part 5', 'Why does Caitlin emphasise her feelings of discomfort?', '{"source":"rwAnswers","id":"spip-y8e-r33","accepted":["c"],"display":"C","status":"draft_inferred"}', null, 1, 26),
  ('spip-y8e-r34', 'spip-year-8-english-pre', 'Reading Part 5', 'What is Caitlin''s purpose in describing the island?', '{"source":"rwAnswers","id":"spip-y8e-r34","accepted":["a"],"display":"A","status":"draft_inferred"}', null, 1, 27),
  ('spip-y8e-r35', 'spip-year-8-english-pre', 'Reading Part 5', 'What does because of that refer to?', '{"source":"rwAnswers","id":"spip-y8e-r35","accepted":["d"],"display":"D","status":"draft_inferred"}', null, 1, 28),
  ('spip-y8e-r36', 'spip-year-8-english-pre', 'Reading Part 5', 'What do we learn about Caitlin''s reactions to the boy?', '{"source":"rwAnswers","id":"spip-y8e-r36","accepted":["c"],"display":"C","status":"draft_inferred"}', null, 1, 29),
  ('spip-y8e-w1', 'spip-year-8-english-pre', 'Writing Part 1', 'Write the mandatory environmental essay in 140-190 words.', '{"source":"aiGrade","id":"spip-y8e-w1","points":20,"display":"20-mark B2 writing rubric","status":"writing_rubric"}', null, 20, 30),
  ('spip-y8e-w2', 'spip-year-8-english-pre', 'Writing Part 2', 'Choose and complete one 140-190 word writing task.', '{"source":"aiGrade","id":"spip-y8e-w2","points":20,"display":"20-mark B2 writing rubric","status":"writing_rubric"}', null, 20, 31),
  ('spip-y8e-l1', 'spip-year-8-english-pre', 'Listening Part 1', 'Why is the speaker calling?', '{"source":"rwAnswers","id":"spip-y8e-l1","accepted":[],"display":"Pending official listening key","status":"pending_official_key"}', null, 1, 32),
  ('spip-y8e-l2', 'spip-year-8-english-pre', 'Listening Part 1', 'What should the water-sports centre do?', '{"source":"rwAnswers","id":"spip-y8e-l2","accepted":[],"display":"Pending official listening key","status":"pending_official_key"}', null, 1, 33),
  ('spip-y8e-l3', 'spip-year-8-english-pre', 'Listening Part 1', 'What annoys the tennis player most about interviewers?', '{"source":"rwAnswers","id":"spip-y8e-l3","accepted":[],"display":"Pending official listening key","status":"pending_official_key"}', null, 1, 34),
  ('spip-y8e-l4', 'spip-year-8-english-pre', 'Listening Part 1', 'What is the poet doing?', '{"source":"rwAnswers","id":"spip-y8e-l4","accepted":[],"display":"Pending official listening key","status":"pending_official_key"}', null, 1, 35),
  ('spip-y8e-l5', 'spip-year-8-english-pre', 'Listening Part 1', 'What did the woman think of the TV programme?', '{"source":"rwAnswers","id":"spip-y8e-l5","accepted":[],"display":"Pending official listening key","status":"pending_official_key"}', null, 1, 36),
  ('spip-y8e-l6', 'spip-year-8-english-pre', 'Listening Part 1', 'How does the girl feel about the ice-hockey game?', '{"source":"rwAnswers","id":"spip-y8e-l6","accepted":[],"display":"Pending official listening key","status":"pending_official_key"}', null, 1, 37),
  ('spip-y8e-l7', 'spip-year-8-english-pre', 'Listening Part 1', 'What do both friends like about the restaurant?', '{"source":"rwAnswers","id":"spip-y8e-l7","accepted":[],"display":"Pending official listening key","status":"pending_official_key"}', null, 1, 38),
  ('spip-y8e-l8', 'spip-year-8-english-pre', 'Listening Part 1', 'What type of information is the man giving?', '{"source":"rwAnswers","id":"spip-y8e-l8","accepted":[],"display":"Pending official listening key","status":"pending_official_key"}', null, 1, 39),
  ('spip-y8e-l9', 'spip-year-8-english-pre', 'Listening Part 2', 'What first interested Angela in the spectacled bear?', '{"source":"rwAnswers","id":"spip-y8e-l9","accepted":[],"display":"Pending official listening key","status":"pending_official_key"}', null, 1, 40),
  ('spip-y8e-l10', 'spip-year-8-english-pre', 'Listening Part 2', 'Where else can the bear markings be found?', '{"source":"rwAnswers","id":"spip-y8e-l10","accepted":[],"display":"Pending official listening key","status":"pending_official_key"}', null, 1, 41),
  ('spip-y8e-l11', 'spip-year-8-english-pre', 'Listening Part 2', 'In what areas of Argentina have bears been seen?', '{"source":"rwAnswers","id":"spip-y8e-l11","accepted":[],"display":"Pending official listening key","status":"pending_official_key"}', null, 1, 42),
  ('spip-y8e-l12', 'spip-year-8-english-pre', 'Listening Part 2', 'Where do the bears usually live?', '{"source":"rwAnswers","id":"spip-y8e-l12","accepted":[],"display":"Pending official listening key","status":"pending_official_key"}', null, 1, 43),
  ('spip-y8e-l13', 'spip-year-8-english-pre', 'Listening Part 2', 'When do spectacled bears behave differently?', '{"source":"rwAnswers","id":"spip-y8e-l13","accepted":[],"display":"Pending official listening key","status":"pending_official_key"}', null, 1, 44),
  ('spip-y8e-l14', 'spip-year-8-english-pre', 'Listening Part 2', 'What is the biggest danger to spectacled bears?', '{"source":"rwAnswers","id":"spip-y8e-l14","accepted":[],"display":"Pending official listening key","status":"pending_official_key"}', null, 1, 45),
  ('spip-y8e-l15', 'spip-year-8-english-pre', 'Listening Part 2', 'What do spectacled bears eat with tree bark?', '{"source":"rwAnswers","id":"spip-y8e-l15","accepted":[],"display":"Pending official listening key","status":"pending_official_key"}', null, 1, 46),
  ('spip-y8e-l16', 'spip-year-8-english-pre', 'Listening Part 2', 'What do bears make when they climb trees?', '{"source":"rwAnswers","id":"spip-y8e-l16","accepted":[],"display":"Pending official listening key","status":"pending_official_key"}', null, 1, 47),
  ('spip-y8e-l17', 'spip-year-8-english-pre', 'Listening Part 2', 'What meat do the bears prefer?', '{"source":"rwAnswers","id":"spip-y8e-l17","accepted":[],"display":"Pending official listening key","status":"pending_official_key"}', null, 1, 48),
  ('spip-y8e-l18', 'spip-year-8-english-pre', 'Listening Part 2', 'What amusing item did one man produce?', '{"source":"rwAnswers","id":"spip-y8e-l18","accepted":[],"display":"Pending official listening key","status":"pending_official_key"}', null, 1, 49),
  ('spip-y8e-l19-23', 'spip-year-8-english-pre', 'Listening Part 3', 'Match Speakers 1-5 to options A-H.', '{"source":"mathMultiPart","id":"spip-y8e-l19-23","points":5,"display":"Pending official listening key","status":"pending_official_key","parts":[{"id":"speaker1","accepted":[],"points":1},{"id":"speaker2","accepted":[],"points":1},{"id":"speaker3","accepted":[],"points":1},{"id":"speaker4","accepted":[],"points":1},{"id":"speaker5","accepted":[],"points":1}]}', null, 5, 50);

commit;
