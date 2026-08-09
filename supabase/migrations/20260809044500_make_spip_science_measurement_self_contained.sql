create or replace function public.spip_science_virtual_details(p_question_id text, p_answer_key jsonb, p_answers jsonb default '{}'::jsonb)
returns jsonb language plpgsql stable as $$
declare
  response jsonb := coalesce(p_answers->p_question_id, '{}'::jsonb);
  measurement jsonb;
  measured numeric;
  measurement_correct boolean;
  measurement_items jsonb := '[]'::jsonb;
  base_details jsonb;
  all_correct boolean;
begin
  for measurement in select value from jsonb_array_elements(coalesce(p_answer_key->'measurements', '[]'::jsonb))
  loop
    measured := spip_math_distance(
      response->>((measurement->>'id') || 'Start'),
      response->>((measurement->>'id') || 'End')
    ) * coalesce((measurement->>'calibration')::numeric, 1);
    measurement_correct := measured is not null
      and abs(measured - (measurement->>'expected')::numeric) <= (measurement->>'tolerance')::numeric;
    measurement_items := measurement_items || jsonb_build_array(jsonb_build_object(
      'id', measurement->>'id',
      'score', case when measurement_correct then 1 else 0 end,
      'possible', 1,
      'correct', measurement_correct,
      'measured', measured,
      'expected', (measurement->>'expected')::numeric,
      'unit', measurement->>'unit'
    ));
  end loop;
  base_details := jsonb_build_object('parts', measurement_items);
  if p_answer_key->>'scoringStrategy' <> 'allCorrect' then return base_details; end if;
  select coalesce(bool_and(coalesce((value->>'correct')::boolean, false)), false)
  into all_correct
  from jsonb_array_elements(coalesce(base_details->'parts', '[]'::jsonb)) parts(value);
  return jsonb_build_object('parts', jsonb_build_array(jsonb_build_object(
    'id', 'all-measurements',
    'score', case when all_correct then question_points(p_answer_key) else 0 end,
    'possible', question_points(p_answer_key),
    'correct', all_correct,
    'measurements', base_details->'parts'
  )));
end;
$$;
