update test_questions
set prompt = 'Write in the missing numbers: 560 + ___ = 830; ___ + 2.3 = 7.8.'
where id = 'spip-y7m-q12'
  and test_id = 'spip-year-7-math-pre';

update test_questions
set
  prompt = 'Complete the calculations: 30 × 50 = ___; 500 × 40 = ___.',
  answer_key = '{"source":"mathMultiPart","display":"1500; 20 000","parts":[{"id":"a","accepted":["1500","1,500"],"points":1},{"id":"b","accepted":["20000","20,000","20 000"],"points":1}]}'::jsonb
where id = 'spip-y7m-q15'
  and test_id = 'spip-year-7-math-pre';
