-- SPIP Year 8 Math: remove Q25 method fields and grade only the final answer.
update public.test_questions
set
  answer_key = '{"source":"mathMultiPart","id":"spip-y8m-q25","points":3,"display":"3.94 m2","parts":[{"id":"answer","accepted":["3.94","3.94 m2","3.94 m²"],"points":3}]}'::jsonb,
  points = 3
where id = 'spip-y8m-q25'
  and test_id = 'spip-year-8-math-pre';
