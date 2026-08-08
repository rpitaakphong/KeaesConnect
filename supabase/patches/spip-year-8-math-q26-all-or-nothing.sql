-- Make Question 26 all-or-nothing: only a completed regular pentagon earns 2 marks.

update public.test_questions
set answer_key = jsonb_set(
  answer_key,
  '{display}',
  to_jsonb('Complete regular pentagon with 6 cm sides and 108 degree angles (2 marks or 0)'::text)
)
where id = 'spip-y8m-q26'
  and test_id = 'spip-year-8-math-pre';

create or replace function public.spip_y8_math_geometry_details(p_question_id text, p_answer_key jsonb, p_answers jsonb default '{}'::jsonb)
returns jsonb language plpgsql stable as $$
declare
  response jsonb := coalesce(p_answers->p_question_id, '{}'::jsonb);
  segments jsonb := coalesce(response->'segments', '[]'::jsonb);
  variant text := p_answer_key->>'variant';
  tolerance numeric := coalesce((p_answer_key->>'endpointTolerance')::numeric, 0.035);
  triangle jsonb := p_answer_key->'triangle';
  a jsonb; b jsonb; c jsonb;
  target_start text; target_end text; segment text;
  ratio numeric; vertex integer; step integer; correct boolean := false;
  midpoint_ab text; midpoint_ac text; midpoint_bc text;
  target_sets text[][];
  set_pair text[]; matches integer;
  first_segment text; second_segment text; third_segment text;
  given_a text; given_b text; given_c text;
  y_scale numeric; base_length numeric; side_tolerance numeric; angle_tolerance numeric; close_tolerance numeric;
  partial_correct boolean := false; full_correct boolean := false; sides_correct boolean := false; angles_correct boolean := false; connected boolean := false; closes_shape boolean := false;
begin
  if variant = 'trianglePartition' then
    if jsonb_array_length(segments) <> (case when p_answer_key->>'partition' = 'trapeziumTriangle' then 1 else 2 end) then
      return jsonb_build_object('parts', jsonb_build_array(jsonb_build_object('id',p_answer_key->>'partition','score',0,'possible',1,'correct',false)));
    end if;
    a := triangle->0; b := triangle->1; c := triangle->2;
    if p_answer_key->>'partition' = 'trapeziumTriangle' then
      segment := segments->>0;
      for vertex in 0..2 loop
        for step in 1..coalesce((p_answer_key->>'subdivisions')::integer,6)-1 loop
          ratio := step::numeric / coalesce((p_answer_key->>'subdivisions')::numeric,6);
          if vertex = 0 then target_start := spip_math_interpolate(a,b,ratio); target_end := spip_math_interpolate(a,c,ratio);
          elsif vertex = 1 then target_start := spip_math_interpolate(b,a,ratio); target_end := spip_math_interpolate(b,c,ratio);
          else target_start := spip_math_interpolate(c,a,ratio); target_end := spip_math_interpolate(c,b,ratio); end if;
          if spip_math_same_segment(segment,target_start,target_end,tolerance) then correct := true; end if;
        end loop;
      end loop;
    else
      midpoint_ab := spip_math_interpolate(a,b,0.5); midpoint_ac := spip_math_interpolate(a,c,0.5); midpoint_bc := spip_math_interpolate(b,c,0.5);
      target_sets := array[
        array[midpoint_ab||';'||midpoint_ac, midpoint_ab||';'||midpoint_bc],
        array[midpoint_ab||';'||midpoint_ac, midpoint_ac||';'||midpoint_bc],
        array[midpoint_ab||';'||midpoint_bc, midpoint_ac||';'||midpoint_bc]
      ];
      foreach set_pair slice 1 in array target_sets loop
        matches := 0;
        foreach target_start in array set_pair loop
          if exists (select 1 from jsonb_array_elements_text(segments) s(value) where spip_math_same_segment(s.value,split_part(target_start,';',1),split_part(target_start,';',2),tolerance)) then matches := matches + 1; end if;
        end loop;
        if matches = 2 then correct := true; end if;
      end loop;
    end if;
    return jsonb_build_object('parts',jsonb_build_array(jsonb_build_object('id',p_answer_key->>'partition','score',case when correct then 1 else 0 end,'possible',1,'correct',correct,'segmentCount',jsonb_array_length(segments))));
  elsif variant = 'coordinateLine' then
    if jsonb_array_length(segments) = 1 then
      correct := spip_math_same_segment(segments->>0,(p_answer_key->'start'->>'x')||','||(p_answer_key->'start'->>'y'),(p_answer_key->'end'->>'x')||','||(p_answer_key->'end'->>'y'),tolerance);
    end if;
    return jsonb_build_object('parts',jsonb_build_array(jsonb_build_object('id','line','score',case when correct then 1 else 0 end,'possible',1,'correct',correct,'fullGridCoverage',correct,'xPositionCorrect',correct)));
  end if;

  given_a := (p_answer_key->'givenVertices'->0->>'x')||','||(p_answer_key->'givenVertices'->0->>'y');
  given_b := (p_answer_key->'givenVertices'->1->>'x')||','||(p_answer_key->'givenVertices'->1->>'y');
  given_c := (p_answer_key->'givenVertices'->2->>'x')||','||(p_answer_key->'givenVertices'->2->>'y');
  y_scale := (p_answer_key->>'aspectRatio')::numeric; side_tolerance := (p_answer_key->>'sideTolerance')::numeric;
  angle_tolerance := (p_answer_key->>'angleToleranceDegrees')::numeric; close_tolerance := (p_answer_key->>'closeTolerance')::numeric;
  base_length := spip_math_distance(given_a,given_b,y_scale);
  if jsonb_array_length(segments) > 0 then
    first_segment := segments->>0;
    partial_correct := spip_math_distance(split_part(first_segment,';',1),given_c) <= close_tolerance
      and abs(spip_math_distance(split_part(first_segment,';',1),split_part(first_segment,';',2),y_scale)-base_length) <= side_tolerance
      and abs(spip_math_angle(given_b,given_c,split_part(first_segment,';',2),y_scale)-108) <= angle_tolerance;
  end if;
  if jsonb_array_length(segments) = 3 then
    first_segment := segments->>0; second_segment := segments->>1; third_segment := segments->>2;
    connected := spip_math_distance(split_part(first_segment,';',2),split_part(second_segment,';',1)) <= close_tolerance and spip_math_distance(split_part(second_segment,';',2),split_part(third_segment,';',1)) <= close_tolerance;
    sides_correct := abs(spip_math_distance(split_part(first_segment,';',1),split_part(first_segment,';',2),y_scale)-base_length) <= side_tolerance
      and abs(spip_math_distance(split_part(second_segment,';',1),split_part(second_segment,';',2),y_scale)-base_length) <= side_tolerance
      and abs(spip_math_distance(split_part(third_segment,';',1),split_part(third_segment,';',2),y_scale)-base_length) <= side_tolerance;
    angles_correct := abs(spip_math_angle(split_part(first_segment,';',1),split_part(first_segment,';',2),split_part(second_segment,';',2),y_scale)-108) <= angle_tolerance
      and abs(spip_math_angle(split_part(second_segment,';',1),split_part(second_segment,';',2),split_part(third_segment,';',2),y_scale)-108) <= angle_tolerance;
    closes_shape := spip_math_distance(split_part(third_segment,';',2),given_a) <= close_tolerance;
    full_correct := partial_correct and connected and sides_correct and angles_correct and closes_shape;
  end if;
  return jsonb_build_object('parts',jsonb_build_array(
    jsonb_build_object('id','complete-pentagon','score',case when full_correct then 2 else 0 end,'possible',2,'correct',full_correct,'firstSideCorrect',partial_correct,'connected',connected,'allSidesCorrect',sides_correct,'internalAnglesCorrect',angles_correct,'closesShape',closes_shape)
  ));
end;
$$;
