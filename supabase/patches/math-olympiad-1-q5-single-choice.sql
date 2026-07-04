update test_questions
set
  prompt = 'Choose the shape that matches the name: Square.',
  answer_key = '{"source":"mathMultiPart","display":"Square","parts":[{"id":"answer","accepted":["upright-square"],"points":2,"normalizer":"text"}]}'::jsonb
where id = 'mo1-q5';
