update test_questions
set answer_key = '{"source":"questionMap","accepted":["false"],"display":"false","status":"registry"}'::jsonb
where id = 'starter-rw-p1q1';

update test_questions
set answer_key = '{"source":"questionMap","accepted":["true"],"display":"true","status":"registry"}'::jsonb
where id = 'starter-rw-p1q2';

update test_questions
set answer_key = '{"source":"questionMap","accepted":["true"],"display":"true","status":"registry"}'::jsonb
where id = 'starter-rw-p1q3';

update test_questions
set answer_key = '{"source":"questionMap","accepted":["false"],"display":"false","status":"registry"}'::jsonb
where id = 'starter-rw-p1q4';

update test_questions
set answer_key = '{"source":"questionMap","accepted":["true"],"display":"true","status":"registry"}'::jsonb
where id = 'starter-rw-p1q5';

update test_questions
set prompt = 'Write the word.'
where id in (
  'starter-rw-p3q1',
  'starter-rw-p3q2',
  'starter-rw-p3q3',
  'starter-rw-p3q4',
  'starter-rw-p3q5'
);

update test_questions
set answer_key = '{"source":"questionMap","accepted":["three"],"display":"three","status":"registry"}'::jsonb
where id = 'starter-rw-p5q5';
