insert into public.tests (id, title, subject, level, status, total_points, app_path)
values
  ('cie-igcse-combined-science-paper-1-core', 'CIE IGCSE Combined Science Paper 1 Core', 'Combined Science', 'Core', 'active', 40, '/tests/cie-igcse-combined-science-paper-1-core/start'),
  ('cie-igcse-combined-science-paper-2-extended', 'CIE IGCSE Combined Science Paper 2 Extended', 'Combined Science', 'Extended', 'active', 40, '/tests/cie-igcse-combined-science-paper-2-extended/start')
on conflict (id) do update set
  title = excluded.title,
  subject = excluded.subject,
  level = excluded.level,
  status = excluded.status,
  total_points = excluded.total_points,
  app_path = excluded.app_path;

update public.tests
set status = 'inactive'
where id in (
  'cie-igcse-combined-science-physics-paper-1-core',
  'cie-igcse-combined-science-physics-paper-2-extended'
);

with answer_rows as (
  select
    'cie-igcse-combined-science-paper-1-core'::text as test_id,
    'cie-igcse-combined-science-p1'::text as question_id_prefix,
    array[
      'C', 'C', 'B', 'A', 'C', 'C', 'D', 'B', 'B', 'B',
      'A', 'C', 'D', 'A', 'A', 'B', 'B', 'C', 'A', 'D',
      'C', 'D', 'A', 'A', 'B', 'C', 'D', 'C', 'B', 'C',
      'D', 'A', 'B', 'C', 'B', 'A', 'D', 'A', 'A', 'A'
    ]::text[] as answers
  union all
  select
    'cie-igcse-combined-science-paper-2-extended'::text as test_id,
    'cie-igcse-combined-science-p2'::text as question_id_prefix,
    array[
      'C', 'C', 'C', 'A', 'D', 'D', 'B', 'B', 'A', 'A',
      'C', 'B', 'A', 'C', 'C', 'A', 'B', 'B', 'D', 'B',
      'A', 'D', 'C', 'D', 'A', 'D', 'D', 'C', 'B', 'D',
      'C', 'B', 'C', 'D', 'B', 'D', 'C', 'A', 'B', 'A'
    ]::text[] as answers
),
expanded_answers as (
  select
    answer_rows.test_id,
    answer_rows.question_id_prefix,
    answers.answer,
    answers.position::integer
  from answer_rows
  cross join unnest(answer_rows.answers) with ordinality as answers(answer, position)
)
insert into public.test_questions (id, test_id, part, prompt, answer_key, transcript_ref, points, position)
select
  format('%s-q%s', question_id_prefix, position),
  test_id,
  case
    when position between 1 and 13 then 'Biology Questions 1-13'
    when position between 14 and 27 then 'Chemistry Questions 14-27'
    else 'Physics Questions 28-40'
  end,
  format('Question %s', position),
  jsonb_build_object(
    'source', 'questionMap',
    'accepted', jsonb_build_array(answer),
    'display', answer,
    'status', 'official'
  ),
  null,
  1,
  position
from expanded_answers
on conflict (id) do update set
  test_id = excluded.test_id,
  part = excluded.part,
  prompt = excluded.prompt,
  answer_key = excluded.answer_key,
  transcript_ref = excluded.transcript_ref,
  points = excluded.points,
  position = excluded.position;
