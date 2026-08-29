begin;

update public.tests
set total_points = 79
where id = 'spip-year-8-english-pre';

update public.test_questions
set
  points = 10,
  answer_key = jsonb_set(
    jsonb_set(answer_key, '{points}', '10'::jsonb, true),
    '{display}',
    to_jsonb('10-mark scaled B2 writing rubric'::text),
    true
  )
where test_id = 'spip-year-8-english-pre'
  and id in ('spip-y8e-w1', 'spip-y8e-w2');

commit;
