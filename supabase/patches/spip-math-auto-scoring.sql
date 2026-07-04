update test_questions
set answer_key = '{"source":"mathMultiPart","display":"2 left, 4 up","parts":[{"id":"dx","accepted":["-2"],"points":0.5},{"id":"dy","accepted":["4"],"points":0.5}]}'::jsonb
where id = 'spip-y7m-q2';

update test_questions
set answer_key = '{"source":"mathMultiPart","display":"16.5 kg","parts":[{"id":"answer","accepted":["16.5 kg","16.5","16.5kg","16 1/2 kg"],"points":1}]}'::jsonb
where id = 'spip-y7m-q7';

update test_questions
set answer_key = '{"source":"mathMultiPart","display":"A, B","parts":[{"id":"selected","accepted":["a,b"],"points":2}]}'::jsonb
where id = 'spip-y7m-q9';

update test_questions
set answer_key = '{"source":"mathMultiPart","display":"multiple of 4 -> unlikely; 4 digits -> impossible; odd -> even chance","parts":[{"id":"matches","accepted":["digits4:impossible,odd:even","odd:even,digits4:impossible"],"points":2}]}'::jsonb
where id = 'spip-y7m-q14';

update test_questions
set answer_key = '{"source":"mathMultiPart","display":"390 - 26 = 364","parts":[{"id":"answer","accepted":[],"normalizer":"keywords","keywords":[["390","26","364"]],"points":2,"reviewRecommended":false}]}'::jsonb
where id = 'spip-y7m-q24';

update test_questions
set answer_key = '{"source":"mathMultiPart","display":"No, because 6/8 = 3/4","parts":[{"id":"answer","accepted":[],"normalizer":"keywords","keywords":[["no","6/8","3/4"],["no","equal"],["no","same"]],"points":2,"reviewRecommended":false}]}'::jsonb
where id = 'spip-y7m-q27';

update test_questions
set answer_key = '{"source":"mathMultiPart","display":"Correct reflected shape","parts":[{"id":"cells","accepted":["5-1,6-1,6-2,7-2,7-3,7-4"],"points":2}]}'::jsonb
where id = 'spip-y7m-q30';
