-- Activate Summer English tests and sync prompt text used in production result rows.
-- This patch is for existing Supabase projects. Fresh resets use supabase/schema.sql.

update public.tests
set status = 'active'
where id in (
  'summer-english-level-1-pretest',
  'summer-english-level-2-pretest',
  'summer-english-level-3-pretest'
);

update public.test_questions
set prompt = case id
  when 'sel1-q21' then 'My mother has a long ___.'
  when 'sel1-q22' then 'I can ___ my name in French.'
  when 'sel1-q23' then '___ do you live?'
  when 'sel1-q24' then 'I''ve got a ___, an apple and an orange.'
  when 'sel1-q25' then 'Sheila ate a ___ of cake.'
  when 'sel3-q21' then 'All of the dogs in the neighborhood ___ barking.'
  when 'sel3-q22' then 'My friends and my mother ___ each other.'
  when 'sel3-q23' then 'Fifty dollars ___ a lot to pay for a dinner.'
  when 'sel3-q24' then 'Six people ___ in a small house.'
  when 'sel3-q25' then 'Mathematics ___ a very difficult subject.'
  else prompt
end
where id in (
  'sel1-q21',
  'sel1-q22',
  'sel1-q23',
  'sel1-q24',
  'sel1-q25',
  'sel3-q21',
  'sel3-q22',
  'sel3-q23',
  'sel3-q24',
  'sel3-q25'
);
