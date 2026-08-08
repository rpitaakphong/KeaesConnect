-- SPIP Year 8 Math: synchronize Q10 wording and remove Q16 working-based grading.
update public.test_questions
set prompt = 'Find the order of rotational symmetry for each of these two-dimensional shapes. The first one has been done for you.'
where id = 'spip-y8m-q10'
  and test_id = 'spip-year-8-math-pre';

update public.test_questions
set
  answer_key = '{"source":"mathMultiPart","id":"spip-y8m-q16","points":2,"display":"150 cm2","parts":[{"id":"answer","accepted":["150","150 cm2","150 cm²"],"points":2}]}'::jsonb,
  points = 2
where id = 'spip-y8m-q16'
  and test_id = 'spip-year-8-math-pre';
