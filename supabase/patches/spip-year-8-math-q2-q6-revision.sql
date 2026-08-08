-- SPIP Year 8 Math: remove Q2 working-based grading and clarify Q6 instructions.
update public.test_questions
set
  prompt = 'A formula used in science is v = u + at. Work out v when u = 7, a = 5 and t = 9.',
  answer_key = '{"source":"mathMultiPart","id":"spip-y8m-q2","points":2,"display":"52","parts":[{"id":"answer","accepted":["52","52.0"],"points":2}]}'::jsonb,
  points = 2
where id = 'spip-y8m-q2'
  and test_id = 'spip-year-8-math-pre';

update public.test_questions
set prompt = 'The scale shows measurements in kilograms. Write down scale reading (kg) and measurement (g).'
where id = 'spip-y8m-q6'
  and test_id = 'spip-year-8-math-pre';
