-- Register the English pre-test for later staff activation.
begin;

-- Preserve spelling, punctuation and case where the English test assesses them.
create or replace function public.normalize_math_answer(value text, mode text default 'text')
returns text
language sql
immutable
as $$
  select case
    when mode = 'englishExact' then
      btrim(regexp_replace(translate(coalesce(value, ''), '‘’“”', concat(chr(39), chr(39), chr(34), chr(34))), '[[:space:]]+', ' ', 'g'))
    when mode = 'englishText' then
      lower(btrim(regexp_replace(translate(coalesce(value, ''), '‘’“”', concat(chr(39), chr(39), chr(34), chr(34))), '[[:space:]]+', ' ', 'g')))
    when mode = 'time' then btrim(regexp_replace(regexp_replace(lower(coalesce(value, '')), '[\.\s]+', ':', 'g'), '[^0-9:]+', '', 'g'), ':')
    else btrim(regexp_replace(lower(coalesce(value, '')), '[^a-z0-9+]+', ' ', 'g'))
  end;
$$;

insert into public.tests (id, title, subject, level, status, total_points, app_path)
values ('ks2-year-3-english-pre-test', 'KS2 Year 3 English Pre-Test', 'English', 'Key Stage 2 · Year 3', 'inactive', 20, '/tests/ks2-year-3-english-pre-test/start')
on conflict (id) do nothing;

insert into public.test_questions (id, test_id, part, prompt, answer_key, points, position)
values
  ('ks2-y3-eng-pre-q1', 'ks2-year-3-english-pre-test', 'Part I', 'Write a synonym for the underlined word. The boys were ravenous because they missed breakfast.', $key${"source":"mathMultiPart","id":"ks2-y3-eng-pre-q1","points":1,"mode":"auto","display":"hungry / starving / famished","parts":[{"id":"answer","accepted":["hungry","starving","famished"],"points":1,"normalizer":"englishText"}]}$key$::jsonb, 1, 1),
  ('ks2-y3-eng-pre-q2', 'ks2-year-3-english-pre-test', 'Part I', 'Write the meaning of the underlined word with a prefix. It is impossible to live on the moon.', $key${"source":"mathMultiPart","id":"ks2-y3-eng-pre-q2","points":1,"mode":"auto","display":"not possible","parts":[{"id":"answer","accepted":["not possible"],"points":1,"normalizer":"englishText"}]}$key$::jsonb, 1, 2),
  ('ks2-y3-eng-pre-q3', 'ks2-year-3-english-pre-test', 'Part I', 'Change the underlined adjective to an adverb by adding a suffix. The hungry boy ate his lunch.', $key${"source":"mathMultiPart","id":"ks2-y3-eng-pre-q3","points":1,"mode":"auto","display":"hungrily","parts":[{"id":"answer","accepted":["hungrily"],"points":1,"normalizer":"englishText"}]}$key$::jsonb, 1, 3),
  ('ks2-y3-eng-pre-q4', 'ks2-year-3-english-pre-test', 'Part II', 'Select the correct homophone. The weather / whether was perfect for a picnic.', $key${"source":"mathMultiPart","id":"ks2-y3-eng-pre-q4","points":1,"mode":"auto","display":"weather","parts":[{"id":"answer","accepted":["weather"],"points":1,"normalizer":"englishText"}]}$key$::jsonb, 1, 4),
  ('ks2-y3-eng-pre-q5', 'ks2-year-3-english-pre-test', 'Part II', 'Select the misspelled word. The shirt cost fourty dollars because it was satin.', $key${"source":"mathMultiPart","id":"ks2-y3-eng-pre-q5","points":1,"mode":"auto","display":"fourty","parts":[{"id":"answer","accepted":["fourty"],"points":1,"normalizer":"englishText"}]}$key$::jsonb, 1, 5),
  ('ks2-y3-eng-pre-q6', 'ks2-year-3-english-pre-test', 'Part II', 'Use an apostrophe to write the contraction of will not.', $key${"source":"mathMultiPart","id":"ks2-y3-eng-pre-q6","points":1,"mode":"auto","display":"won’t","parts":[{"id":"answer","accepted":["won’t"],"points":1,"normalizer":"englishText"}]}$key$::jsonb, 1, 6),
  ('ks2-y3-eng-pre-q7', 'ks2-year-3-english-pre-test', 'Part II', 'Select the correct use of an apostrophe to show singular possession. The horse’s / horses’ stable was in the barn.', $key${"source":"mathMultiPart","id":"ks2-y3-eng-pre-q7","points":1,"mode":"auto","display":"horse’s","parts":[{"id":"answer","accepted":["horse’s"],"points":1,"normalizer":"englishText"}]}$key$::jsonb, 1, 7),
  ('ks2-y3-eng-pre-q8', 'ks2-year-3-english-pre-test', 'Part II', 'Select the word that is spelled incorrectly and write the correct form.', $key${"source":"mathMultiPart","id":"ks2-y3-eng-pre-q8","points":1,"mode":"auto","display":"inpossible → impossible","parts":[{"id":"selected","accepted":["inpossible"],"points":1,"normalizer":"englishText"},{"id":"correction","accepted":["impossible"],"points":1,"normalizer":"englishText"}],"scoreThresholds":[{"minCorrect":2,"points":1}]}$key$::jsonb, 1, 8),
  ('ks2-y3-eng-pre-q9', 'ks2-year-3-english-pre-test', 'Part III', 'Select the adjectives. Behind the empty park was a huge field.', $key${"source":"mathMultiPart","id":"ks2-y3-eng-pre-q9","points":1,"mode":"auto","display":"empty, huge","parts":[{"id":"selected","accepted":["empty","huge"],"points":1,"normalizer":"set"}]}$key$::jsonb, 1, 9),
  ('ks2-y3-eng-pre-q10', 'ks2-year-3-english-pre-test', 'Part III', 'Is the underlined word an adjective, verb or noun? The class went on a trip to see a play at the theatre.', $key${"source":"mathMultiPart","id":"ks2-y3-eng-pre-q10","points":1,"mode":"auto","display":"noun","parts":[{"id":"answer","accepted":["noun"],"points":1,"normalizer":"englishText"}]}$key$::jsonb, 1, 10),
  ('ks2-y3-eng-pre-q11', 'ks2-year-3-english-pre-test', 'Part III', 'Write the three main parts of a story in order.', $key${"source":"mathMultiPart","id":"ks2-y3-eng-pre-q11","points":1,"mode":"auto","display":"beginning, middle, end","parts":[{"id":"first","accepted":["beginning"],"points":1,"normalizer":"englishText"},{"id":"second","accepted":["middle"],"points":1,"normalizer":"englishText"},{"id":"third","accepted":["end"],"points":1,"normalizer":"englishText"}],"scoreThresholds":[{"minCorrect":3,"points":1}]}$key$::jsonb, 1, 11),
  ('ks2-y3-eng-pre-q12', 'ks2-year-3-english-pre-test', 'Part IV', 'Correct the spelling and punctuation mistakes. I couldnt carry the heavey box.', $key${"source":"mathMultiPart","id":"ks2-y3-eng-pre-q12","points":1,"mode":"auto","display":"couldn’t, heavy","parts":[{"id":"first","accepted":["couldn’t"],"points":1,"normalizer":"englishText"},{"id":"second","accepted":["heavy"],"points":1,"normalizer":"englishText"}],"scoreThresholds":[{"minCorrect":2,"points":1}]}$key$::jsonb, 1, 12),
  ('ks2-y3-eng-pre-q13', 'ks2-year-3-english-pre-test', 'Part IV', 'Rewrite the sentence and correct the punctuation and capitalization mistakes. The family went to paris on their holiday', $key${"source":"mathMultiPart","id":"ks2-y3-eng-pre-q13","points":1,"mode":"auto","display":"The family went to Paris on their holiday.","parts":[{"id":"answer","accepted":["The family went to Paris on their holiday."],"points":1,"normalizer":"englishExact"}]}$key$::jsonb, 1, 13),
  ('ks2-y3-eng-pre-q14', 'ks2-year-3-english-pre-test', 'Part IV', 'Write the correct conjunction in the blank. My mom was angry ___ I broke her vase.', $key${"source":"mathMultiPart","id":"ks2-y3-eng-pre-q14","points":1,"mode":"auto","display":"because","parts":[{"id":"answer","accepted":["because"],"points":1,"normalizer":"englishText"}]}$key$::jsonb, 1, 14),
  ('ks2-y3-eng-pre-q15', 'ks2-year-3-english-pre-test', 'Part IV', 'Select the verb. The boys played football in the park.', $key${"source":"mathMultiPart","id":"ks2-y3-eng-pre-q15","points":1,"mode":"auto","display":"played","parts":[{"id":"answer","accepted":["played"],"points":1,"normalizer":"englishText"}]}$key$::jsonb, 1, 15),
  ('ks2-y3-eng-pre-q16', 'ks2-year-3-english-pre-test', 'Part IV', 'Complete the sentence using has or have. The birds ___ been singing all morning.', $key${"source":"mathMultiPart","id":"ks2-y3-eng-pre-q16","points":1,"mode":"auto","display":"have","parts":[{"id":"answer","accepted":["have"],"points":1,"normalizer":"englishText"}]}$key$::jsonb, 1, 16),
  ('ks2-y3-eng-pre-q17', 'ks2-year-3-english-pre-test', 'Part IV', 'Select the common noun. He walked along the river.', $key${"source":"mathMultiPart","id":"ks2-y3-eng-pre-q17","points":1,"mode":"auto","display":"river","parts":[{"id":"answer","accepted":["river"],"points":1,"normalizer":"englishText"}]}$key$::jsonb, 1, 17),
  ('ks2-y3-eng-pre-q18', 'ks2-year-3-english-pre-test', 'Part IV', 'Complete the sentence with a preposition. The train rushed ___ the tunnel.', $key${"source":"mathMultiPart","id":"ks2-y3-eng-pre-q18","points":1,"mode":"auto","display":"into / through","parts":[{"id":"answer","accepted":["into","through"],"points":1,"normalizer":"englishText"}]}$key$::jsonb, 1, 18),
  ('ks2-y3-eng-pre-q19', 'ks2-year-3-english-pre-test', 'Part V', 'Rewrite the sentence with speech marks to show direct speech. Stop that! shouted Jacob.', $key${"source":"mathMultiPart","id":"ks2-y3-eng-pre-q19","points":1,"mode":"auto","display":"“Stop that!” shouted Jacob.","parts":[{"id":"answer","accepted":["“Stop that!” shouted Jacob.","‘Stop that!’ shouted Jacob."],"points":1,"normalizer":"englishExact"}]}$key$::jsonb, 1, 19),
  ('ks2-y3-eng-pre-q20', 'ks2-year-3-english-pre-test', 'Part V', 'Select where the commas belong. The girl has long curly black hair.', $key${"source":"mathMultiPart","id":"ks2-y3-eng-pre-q20","points":1,"mode":"auto","display":"The girl has long, curly, black hair.","parts":[{"id":"selected","accepted":["long","curly"],"points":1,"normalizer":"set"}]}$key$::jsonb, 1, 20)
on conflict (id) do nothing;

do $$
begin
  if (select count(*) from public.test_questions where test_id = 'ks2-year-3-english-pre-test') <> 20
    or (select sum(points) from public.test_questions where test_id = 'ks2-year-3-english-pre-test') <> 20 then
    raise exception 'Expected 20 Year 3 English pre-test questions worth 20 marks';
  end if;
end;
$$;

commit;
