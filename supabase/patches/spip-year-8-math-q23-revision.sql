-- SPIP Year 8 Math: remove Q23 working-based grading.
update public.test_questions
set
  answer_key = '{"source":"mathMultiPart","id":"spip-y8m-q23","points":2,"display":"4.1","parts":[{"id":"answer","accepted":["4.1","4.10"],"points":2}]}'::jsonb,
  points = 2
where id = 'spip-y8m-q23'
  and test_id = 'spip-year-8-math-pre';
