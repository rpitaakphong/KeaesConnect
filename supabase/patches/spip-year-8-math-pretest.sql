-- SPIP Year 8 Math Pre-test: official 2018 Stage 7 Paper 2 content and scoring.
insert into public.tests (id, title, subject, level, status, total_points, app_path)
values ('spip-year-8-math-pre', 'SPIP Year 8 Math Pre-test', 'Math', 'SPIP Year 8', 'active', 45, '/tests/spip-year-8-math-pre/start')
on conflict (id) do update set
  title = excluded.title,
  subject = excluded.subject,
  level = excluded.level,
  status = excluded.status,
  total_points = excluded.total_points,
  app_path = excluded.app_path;

delete from public.test_questions where test_id = 'spip-year-8-math-pre';

insert into public.test_questions (id, test_id, part, prompt, answer_key, transcript_ref, points, position) values
('spip-y8m-q1a','spip-year-8-math-pre','Questions 1-7','(a) Write down a multiple of 12 from the list.','{"source":"mathMultiPart","id":"spip-y8m-q1a","points":1,"display":"48","parts":[{"id":"answer","accepted":["48"],"points":1}]}'::jsonb,null,1,1),
('spip-y8m-q1b','spip-year-8-math-pre','Questions 1-7','(b) Write down a prime number from the list.','{"source":"mathMultiPart","id":"spip-y8m-q1b","points":1,"display":"19","parts":[{"id":"answer","accepted":["19"],"points":1}]}'::jsonb,null,1,2),
('spip-y8m-q1c','spip-year-8-math-pre','Questions 1-7','(c) Write down a square number from the list.','{"source":"mathMultiPart","id":"spip-y8m-q1c","points":1,"display":"25","parts":[{"id":"answer","accepted":["25"],"points":1}]}'::jsonb,null,1,3),
('spip-y8m-q2','spip-year-8-math-pre','Questions 1-7','A formula used in science is v = u + at. Work out v when u = 7, a = 5 and t = 9.','{"source":"mathMultiPart","id":"spip-y8m-q2","points":2,"display":"52","parts":[{"id":"answer","accepted":["52","52.0"],"points":2}]}'::jsonb,null,2,4),
('spip-y8m-q3','spip-year-8-math-pre','Questions 1-7','Find the number of 14-seat buses needed for 47 students.','{"source":"mathMultiPart","id":"spip-y8m-q3","points":1,"display":"4 buses","parts":[{"id":"answer","accepted":["4","4 buses"],"points":1}]}'::jsonb,null,1,5),
('spip-y8m-q4a','spip-year-8-math-pre','Questions 1-7','(a) Name the smallest and largest estimates.','{"source":"mathMultiPart","id":"spip-y8m-q4a","points":1,"display":"Hassan; Jamila","scoreThresholds":[{"minCorrect":2,"points":1}],"parts":[{"id":"smallest","accepted":["hassan","h"],"points":1},{"id":"largest","accepted":["jamila","j"],"points":1}]}'::jsonb,null,1,6),
('spip-y8m-q4b','spip-year-8-math-pre','Questions 1-7','(b) Name the person whose estimate is closest to 0.68 kg.','{"source":"mathMultiPart","id":"spip-y8m-q4b","points":1,"display":"Anastasia","parts":[{"id":"answer","accepted":["anastasia"],"points":1}]}'::jsonb,null,1,7),
('spip-y8m-q5a','spip-year-8-math-pre','Questions 1-7','(a) Divide the triangle into a trapezium and equilateral triangle.','{"source":"geometryConstruction","id":"spip-y8m-q5a","points":1,"display":"Correct triangle partition","variant":"trianglePartition","partition":"trapeziumTriangle","triangle":[{"x":0.087,"y":0.473},{"x":0.863,"y":0.024},{"x":0.863,"y":0.923}],"subdivisions":6,"endpointTolerance":0.035}'::jsonb,null,1,8),
('spip-y8m-q5b','spip-year-8-math-pre','Questions 1-7','(b) Divide the triangle into a rhombus and two equilateral triangles.','{"source":"geometryConstruction","id":"spip-y8m-q5b","points":1,"display":"Correct rhombus and triangle partition","variant":"trianglePartition","partition":"rhombusTwoTriangles","triangle":[{"x":0.087,"y":0.473},{"x":0.863,"y":0.024},{"x":0.863,"y":0.923}],"endpointTolerance":0.035}'::jsonb,null,1,9),
('spip-y8m-q6','spip-year-8-math-pre','Questions 1-7','The scale shows measurements in kilograms. Write down scale reading (kg) and measurement (g).','{"source":"dependent","id":"spip-y8m-q6","points":2,"display":"0.65 kg = 650 g","rule":{"type":"fieldConversion","sourceField":"reading","targetField":"grams","multiplier":1000,"sourceAccepted":["0.65",".65"],"fullCreditAccepted":["650"],"tolerance":0.01}}'::jsonb,null,2,10),
('spip-y8m-q7','spip-year-8-math-pre','Questions 1-7','Name the solid with 5 faces, 9 edges and 6 vertices.','{"source":"mathMultiPart","id":"spip-y8m-q7","points":1,"display":"Triangular prism","parts":[{"id":"answer","accepted":["triangular prism","triangle prism","trianglar prism"],"points":1}]}'::jsonb,null,1,11),
('spip-y8m-q8a','spip-year-8-math-pre','Questions 8-14','(a) Write down the range of marks.','{"source":"mathMultiPart","id":"spip-y8m-q8a","points":1,"display":"6","parts":[{"id":"answer","accepted":["6"],"points":1}]}'::jsonb,null,1,12),
('spip-y8m-q8b','spip-year-8-math-pre','Questions 8-14','(b) Find the total number of students.','{"source":"mathMultiPart","id":"spip-y8m-q8b","points":1,"display":"31","parts":[{"id":"answer","accepted":["31"],"points":1}]}'::jsonb,null,1,13),
('spip-y8m-q8c','spip-year-8-math-pre','Questions 8-14','(c) Find the median mark.','{"source":"mathMultiPart","id":"spip-y8m-q8c","points":1,"display":"8","parts":[{"id":"answer","accepted":["8"],"points":1}]}'::jsonb,null,1,14),
('spip-y8m-q9','spip-year-8-math-pre','Questions 8-14','Complete the missing digits in the subtraction.','{"source":"mathMultiPart","id":"spip-y8m-q9","points":2,"display":"42.33 - 14.39 = 27.94","scoreThresholds":[{"minCorrect":2,"points":1},{"minCorrect":3,"points":2}],"parts":[{"id":"top","accepted":["4"],"points":1},{"id":"middle","accepted":["3"],"points":1},{"id":"bottom","accepted":["4"],"points":1}]}'::jsonb,null,2,15),
('spip-y8m-q10','spip-year-8-math-pre','Questions 8-14','Find the order of rotational symmetry for each of these two-dimensional shapes. The first one has been done for you.','{"source":"mathMultiPart","id":"spip-y8m-q10","points":2,"display":"1; 6; 3","scoreThresholds":[{"minCorrect":2,"points":1},{"minCorrect":3,"points":2}],"parts":[{"id":"shape2","accepted":["1"],"points":1},{"id":"shape3","accepted":["6"],"points":1},{"id":"shape4","accepted":["3"],"points":1}]}'::jsonb,null,2,16),
('spip-y8m-q11','spip-year-8-math-pre','Questions 8-14','Find the orange juice in 10 litres mixed in the ratio 3:1.','{"source":"mathMultiPart","id":"spip-y8m-q11","points":2,"display":"7.5 litres","scoringStrategy":"highestCorrect","parts":[{"id":"working","accepted":[],"normalizer":"keywords","keywords":[["10","4"],["2.5"],["3/4","10"]],"points":1,"reviewRecommended":false},{"id":"answer","accepted":["7.5","7.5 litres","7.5l","7 1/2"],"points":2}]}'::jsonb,null,2,17),
('spip-y8m-q12','spip-year-8-math-pre','Questions 8-14','Draw the line x = 2.','{"source":"geometryConstruction","id":"spip-y8m-q12","points":1,"display":"Vertical line x = 2 across the grid","variant":"coordinateLine","start":{"x":0.685,"y":0.091},"end":{"x":0.685,"y":0.831},"endpointTolerance":0.025}'::jsonb,null,1,18),
('spip-y8m-q13','spip-year-8-math-pre','Questions 8-14','Explain why class 7P did not do better than 7T.','{"source":"mathMultiPart","id":"spip-y8m-q13","points":1,"display":"7T has the higher mean","parts":[{"id":"answer","accepted":[],"normalizer":"keywords","keywords":[["7t","higher","mean"],["7t","4","average"],["7p","less consistent"],["range","not","better"]],"points":1,"reviewRecommended":true}]}'::jsonb,null,1,19),
('spip-y8m-q14','spip-year-8-math-pre','Questions 8-14','Complete the train journey table.','{"source":"mathMultiPart","id":"spip-y8m-q14","points":2,"display":"4 hours 30 minutes; 21:40","parts":[{"id":"duration","accepted":["4 hours 30 minutes","4 h 30 min","4hr30min","270 minutes","4.5 hours"],"points":1},{"id":"departure","accepted":["21:40","2140","21.40","9:40 pm","9.40 pm"],"normalizer":"time","points":1}]}'::jsonb,null,2,20),
('spip-y8m-q15','spip-year-8-math-pre','Questions 15-21','Select the survey questions relevant to comparing sports time by gender.','{"source":"mathMultiPart","id":"spip-y8m-q15","points":1,"display":"Gender and weekly sports hours","parts":[{"id":"selected","accepted":["gender","hours"],"normalizer":"set","points":1}]}'::jsonb,null,1,21),
('spip-y8m-q16','spip-year-8-math-pre','Questions 15-21','Find the surface area of a cube with side 5 cm.','{"source":"mathMultiPart","id":"spip-y8m-q16","points":2,"display":"150 cm2","parts":[{"id":"answer","accepted":["150","150 cm2","150 cm²"],"points":2}]}'::jsonb,null,2,22),
('spip-y8m-q17','spip-year-8-math-pre','Questions 15-21','Find vertex D of rectangle ABCD.','{"source":"mathMultiPart","id":"spip-y8m-q17","points":1,"display":"(1, 2)","scoreThresholds":[{"minCorrect":2,"points":1}],"parts":[{"id":"x","accepted":["1"],"points":1},{"id":"y","accepted":["2"],"points":1}]}'::jsonb,null,1,23),
('spip-y8m-q18','spip-year-8-math-pre','Questions 15-21','Decide whether Aiko must have the larger number and explain.','{"source":"mathMultiPart","id":"spip-y8m-q18","points":1,"display":"No, with a valid counterexample or range","scoreThresholds":[{"minCorrect":2,"points":1}],"parts":[{"id":"decision","accepted":["no"],"points":1},{"id":"reason","accepted":[],"normalizer":"keywords","keywords":[["1568","1900"],["1500","1900"],["aiko","1500"],["1850","1950","1500","2500"]],"points":1,"reviewRecommended":true}]}'::jsonb,null,1,24),
('spip-y8m-q19','spip-year-8-math-pre','Questions 15-21','Complete the units for the two time formulas.','{"source":"mathMultiPart","id":"spip-y8m-q19","points":1,"display":"days; weeks","scoreThresholds":[{"minCorrect":2,"points":1}],"parts":[{"id":"first","accepted":["days","day"],"points":1},{"id":"second","accepted":["weeks","week"],"points":1}]}'::jsonb,null,1,25),
('spip-y8m-q20','spip-year-8-math-pre','Questions 15-21','Find angle COD.','{"source":"mathMultiPart","id":"spip-y8m-q20","points":1,"display":"50 degrees","parts":[{"id":"answer","accepted":["50","50°","50 degrees"],"points":1}]}'::jsonb,null,1,26),
('spip-y8m-q21','spip-year-8-math-pre','Questions 15-21','Complete the statements about the red and green dice.','{"source":"mathMultiPart","id":"spip-y8m-q21","points":1,"display":"green; green","scoreThresholds":[{"minCorrect":2,"points":1}],"parts":[{"id":"even","accepted":["green"],"points":1},{"id":"impossible","accepted":["green"],"points":1}]}'::jsonb,null,1,27),
('spip-y8m-q22','spip-year-8-math-pre','Questions 22-27','Find the perimeter expression.','{"source":"mathMultiPart","id":"spip-y8m-q22","points":1,"display":"4q + 2p","parts":[{"id":"answer","accepted":["4q+2p","2p+4q","2(p+2q)","q+q+q+q+p+p"],"normalizer":"linearExpression","points":1}]}'::jsonb,null,1,28),
('spip-y8m-q23','spip-year-8-math-pre','Questions 22-27','Find the mean of 3, 4, 5, 2.5 and 6.','{"source":"mathMultiPart","id":"spip-y8m-q23","points":2,"display":"4.1","parts":[{"id":"answer","accepted":["4.1","4.10"],"points":2}]}'::jsonb,null,2,29),
('spip-y8m-q24','spip-year-8-math-pre','Questions 22-27','Show that the percentage of women owning bicycles is less than the percentage of men.','{"source":"mathMultiPart","id":"spip-y8m-q24","points":2,"display":"Women 71.42%; men 73.33%","parts":[{"id":"women","accepted":["71","71%","71.4","71.42","71.43","0.71","0.714","0.7142"],"points":1},{"id":"men","accepted":["73","73%","73.3","73.33","0.73","0.733","0.7333"],"points":1}]}'::jsonb,null,2,30),
('spip-y8m-q25','spip-year-8-math-pre','Questions 22-27','Find the area remaining after removing the rectangle.','{"source":"mathMultiPart","id":"spip-y8m-q25","points":3,"display":"3.94 m2","parts":[{"id":"answer","accepted":["3.94","3.94 m2","3.94 m²"],"points":3}]}'::jsonb,null,3,31),
('spip-y8m-q26','spip-year-8-math-pre','Questions 22-27','The diagram shows two sides of a regular pentagon. Draw three more straight lines to complete the pentagon.','{"source":"geometryConstruction","id":"spip-y8m-q26","points":2,"display":"Complete regular pentagon with 6 cm sides and 108 degree angles (2 marks or 0)","variant":"regularPentagon","givenVertices":[{"x":0.176,"y":0.07},{"x":0.679,"y":0.07},{"x":0.835,"y":0.622}],"aspectRatio":0.867,"sideTolerance":0.008,"angleToleranceDegrees":1,"closeTolerance":0.025}'::jsonb,null,2,32),
('spip-y8m-q27','spip-year-8-math-pre','Questions 22-27','Find the difference between 7/10 and 5/8 as a decimal.','{"source":"mathMultiPart","id":"spip-y8m-q27","points":1,"display":"0.075","parts":[{"id":"answer","accepted":["0.075",".075","-0.075","-.075"],"points":1}]}'::jsonb,null,1,33);

create or replace function public.spip_math_point(p_value text, p_axis integer)
returns numeric language sql immutable as $$
  select case when btrim(split_part(coalesce(p_value, ''), ',', p_axis)) ~ '^-?([0-9]+([.][0-9]*)?|[.][0-9]+)$'
    then btrim(split_part(p_value, ',', p_axis))::numeric else null end;
$$;

create or replace function public.spip_math_numeric_value(p_value text)
returns numeric language plpgsql immutable as $$
declare matched text;
begin
  matched := substring(replace(coalesce(p_value,''),',','') from '-?([0-9]+([.][0-9]*)?|[.][0-9]+)');
  return case when matched is null then null else matched::numeric end;
end;
$$;

create or replace function public.spip_math_distance(p_left text, p_right text, p_y_scale numeric default 1)
returns numeric language sql immutable as $$
  select sqrt(power(spip_math_point(p_left, 1) - spip_math_point(p_right, 1), 2) + power((spip_math_point(p_left, 2) - spip_math_point(p_right, 2)) * p_y_scale, 2));
$$;

create or replace function public.spip_math_same_segment(p_segment text, p_start text, p_end text, p_tolerance numeric)
returns boolean language sql immutable as $$
  select case when position(';' in coalesce(p_segment, '')) = 0 then false else
    (spip_math_distance(split_part(p_segment, ';', 1), p_start) <= p_tolerance and spip_math_distance(split_part(p_segment, ';', 2), p_end) <= p_tolerance)
    or (spip_math_distance(split_part(p_segment, ';', 1), p_end) <= p_tolerance and spip_math_distance(split_part(p_segment, ';', 2), p_start) <= p_tolerance) end;
$$;

create or replace function public.spip_math_interpolate(p_start jsonb, p_end jsonb, p_ratio numeric)
returns text language sql immutable as $$
  select ((p_start->>'x')::numeric + ((p_end->>'x')::numeric - (p_start->>'x')::numeric) * p_ratio)::text || ',' ||
    ((p_start->>'y')::numeric + ((p_end->>'y')::numeric - (p_start->>'y')::numeric) * p_ratio)::text;
$$;

create or replace function public.spip_math_angle(p_previous text, p_vertex text, p_next text, p_y_scale numeric)
returns numeric language plpgsql immutable as $$
declare
  ax double precision := (spip_math_point(p_previous,1) - spip_math_point(p_vertex,1))::double precision;
  ay double precision := ((spip_math_point(p_previous,2) - spip_math_point(p_vertex,2)) * p_y_scale)::double precision;
  bx_value double precision := (spip_math_point(p_next,1) - spip_math_point(p_vertex,1))::double precision;
  by_value double precision := ((spip_math_point(p_next,2) - spip_math_point(p_vertex,2)) * p_y_scale)::double precision;
  denominator double precision;
begin
  denominator := sqrt(ax*ax + ay*ay) * sqrt(bx_value*bx_value + by_value*by_value);
  if denominator = 0 then return 0; end if;
  return degrees(acos(greatest(-1::double precision, least(1::double precision, (ax*bx_value + ay*by_value) / denominator))))::numeric;
end;
$$;

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

create or replace function public.spip_y8_math_dependent_details(p_question_id text, p_answer_key jsonb, p_answers jsonb default '{}'::jsonb)
returns jsonb language plpgsql stable as $$
declare
  response jsonb := coalesce(p_answers->p_question_id,'{}'::jsonb);
  rule jsonb := p_answer_key->'rule';
  source_value numeric; target_value numeric; multiplier numeric; tolerance numeric;
  source_correct boolean := false; conversion_correct boolean := false; full_correct boolean := false;
begin
  if rule->>'type' <> 'fieldConversion' then return p6_dependent_details(p_question_id,p_answer_key,p_answers); end if;
  source_value := spip_math_numeric_value(response->>(rule->>'sourceField'));
  target_value := spip_math_numeric_value(response->>(rule->>'targetField'));
  multiplier := (rule->>'multiplier')::numeric; tolerance := coalesce((rule->>'tolerance')::numeric,0.001);
  source_correct := source_value is not null and exists (select 1 from jsonb_array_elements_text(coalesce(rule->'sourceAccepted','[]'::jsonb)) a(value) where abs(source_value-a.value::numeric)<=tolerance);
  full_correct := target_value is not null and exists (select 1 from jsonb_array_elements_text(rule->'fullCreditAccepted') a(value) where abs(target_value-a.value::numeric)<=tolerance);
  conversion_correct := full_correct or (source_value is not null and target_value is not null and abs(target_value-source_value*multiplier)<=tolerance);
  return jsonb_build_object('parts',jsonb_build_array(
    jsonb_build_object('id','conversion','score',case when source_correct or conversion_correct then 1 else 0 end,'possible',1,'correct',source_correct or conversion_correct),
    jsonb_build_object('id','final-answer','score',case when full_correct then 1 else 0 end,'possible',1,'correct',full_correct)
  ));
end;
$$;

create or replace function public.spip_linear_signature(p_value text)
returns text language plpgsql immutable as $$
declare
  clean text := lower(regexp_replace(coalesce(p_value,''),'\s+','','g'));
  term text; sign_value numeric; coefficient numeric; p_total numeric := 0; q_total numeric := 0; constant_total numeric := 0;
begin
  clean := replace(replace(clean,'×','*'),'·','*');
  clean := replace(clean,'2(p+2q)','2p+4q');
  clean := replace(clean,'2(2q+p)','4q+2p');
  clean := replace(clean,'(', ''); clean := replace(clean,')',''); clean := replace(clean,'*','');
  clean := regexp_replace(clean,'-','+-','g');
  for term in select value from regexp_split_to_table(clean,'\+') value where value <> '' loop
    sign_value := case when left(term,1)='-' then -1 else 1 end;
    term := ltrim(term,'-');
    if term ~ '^[0-9.]*p$' then coefficient := coalesce(nullif(regexp_replace(term,'p$',''),''),'1')::numeric; p_total := p_total + sign_value*coefficient;
    elsif term ~ '^[0-9.]*q$' then coefficient := coalesce(nullif(regexp_replace(term,'q$',''),''),'1')::numeric; q_total := q_total + sign_value*coefficient;
    elsif term ~ '^[0-9.]+$' then constant_total := constant_total + sign_value*term::numeric;
    else return null; end if;
  end loop;
  return constant_total::text||'|'||p_total::text||'|'||q_total::text;
end;
$$;

create or replace function public.math_part_scores(p_question_id text, p_answer_key jsonb, p_answers jsonb default '{}'::jsonb)
returns jsonb language plpgsql stable as $$
declare
  part_key jsonb; part_id text; mode text; possible numeric; raw_json jsonb; raw_text text; raw_norm text; expected_norm text; is_part_correct boolean; items jsonb := '[]'::jsonb;
begin
  for part_key in select value from jsonb_array_elements(coalesce(p_answer_key->'parts','[]'::jsonb)) loop
    part_id := part_key->>'id'; mode := coalesce(part_key->>'normalizer','text'); possible := coalesce((part_key->>'points')::numeric,0);
    is_part_correct := false; raw_text := ''; raw_norm := '';
    if mode in ('set','contains') then
      raw_json := coalesce(p_answers->p_question_id->part_id,'[]'::jsonb); if jsonb_typeof(raw_json)<>'array' then raw_json := '[]'::jsonb; end if;
      select coalesce(string_agg(normalize_math_answer(value,'text'),',' order by normalize_math_answer(value,'text')),'') into raw_norm from jsonb_array_elements_text(raw_json) response(value);
      select coalesce(string_agg(normalize_math_answer(value,'text'),',' order by normalize_math_answer(value,'text')),'') into expected_norm from jsonb_array_elements_text(coalesce(part_key->'accepted','[]'::jsonb)) accepted(value);
      select coalesce(string_agg(value,', ' order by value),'') into raw_text from jsonb_array_elements_text(raw_json) response(value);
      if mode='contains' then
        is_part_correct := exists(select 1 from jsonb_array_elements_text(raw_json) response(value) cross join jsonb_array_elements_text(coalesce(part_key->'accepted','[]'::jsonb)) accepted(value) where normalize_math_answer(response.value,'text')=normalize_math_answer(accepted.value,'text'));
      else is_part_correct := raw_norm<>'' and raw_norm=expected_norm; end if;
    else
      raw_text := case when part_id='answer' and jsonb_typeof(p_answers->p_question_id)='string' then coalesce(p_answers->>p_question_id,'') else coalesce(p_answers->p_question_id->>part_id,'') end;
      if mode='keywords' then
        raw_norm := normalize_math_answer(raw_text,'text');
        is_part_correct := raw_norm<>'' and exists(select 1 from jsonb_array_elements(coalesce(part_key->'keywords','[]'::jsonb)) groups(value) where not exists(select 1 from jsonb_array_elements_text(groups.value) words(word) where position(normalize_math_answer(words.word,'text') in raw_norm)=0));
      elsif mode='arrowDown' then is_part_correct := normalize_math_answer(raw_text,'text')='down';
      elsif mode='linearExpression' then
        is_part_correct := spip_linear_signature(raw_text) is not null and exists(select 1 from jsonb_array_elements_text(coalesce(part_key->'accepted','[]'::jsonb)) accepted(value) where spip_linear_signature(accepted.value)=spip_linear_signature(raw_text));
      else
        raw_norm := normalize_math_answer(raw_text,mode);
        is_part_correct := raw_norm<>'' and exists(select 1 from jsonb_array_elements_text(coalesce(part_key->'accepted','[]'::jsonb)) accepted(value) where normalize_math_answer(accepted.value,mode)=raw_norm);
      end if;
    end if;
    items := items || jsonb_build_array(jsonb_build_object('id',part_id,'response',raw_text,'score',case when is_part_correct then possible else 0 end,'possible',possible,'correct',is_part_correct,'normalizer',mode,'reviewRecommended',coalesce((part_key->>'reviewRecommended')::boolean,mode in ('keywords','arrowDown'))));
  end loop;
  return jsonb_build_object('parts',items);
end;
$$;

create or replace function public.answer_response(p_answer_key jsonb, p_answers jsonb)
returns text language plpgsql stable as $$
declare source_name text := p_answer_key->>'source';
begin
  if source_name='questionMap' then return coalesce(p_answers->>(p_answer_key->>'id'),'');
  elsif source_name in ('aiGrade','aiSplitGrade') then return coalesce(p_answers->>(p_answer_key->>'id'),'');
  elsif source_name in ('mathMultiPart','rayDiagram','diagramAnnotation','geometryConstruction','biologicalDrawing','practicalGraph','virtualMeasurement','dependent') then return coalesce((p_answers->(p_answer_key->>'id'))::text,'');
  elsif source_name='connections' then return coalesce(p_answers->'connections'->>(p_answer_key->>'object'),'');
  elsif source_name='textAnswers' then return coalesce(p_answers->'textAnswers'->>(p_answer_key->>'id'),'');
  elsif source_name='choices' then return coalesce(p_answers->'choices'->>(p_answer_key->>'id'),'');
  elsif source_name='colours' then return coalesce(p_answers->'colours'->>(p_answer_key->>'region'),'');
  elsif source_name='rwAnswers' then return coalesce(p_answers->'rwAnswers'->>(p_answer_key->>'id'),''); end if;
  return '';
end;
$$;

create or replace function public.answer_score(p_question_id text, p_answer_key jsonb, p_response text, p_answers jsonb default '{}'::jsonb)
returns numeric language plpgsql stable as $$
declare
  source_name text := p_answer_key->>'source'; possible numeric := question_points(p_answer_key); raw_score numeric := 0; details jsonb; correct_count integer := 0; category_count integer := 0;
begin
  if source_name='questionMap' then return case when normalize_answer(p_response) in (select normalize_answer(value) from jsonb_array_elements_text(p_answer_key->'accepted') accepted(value)) then possible else 0 end;
  elsif source_name in ('aiGrade','aiSplitGrade') then return least(greatest(coalesce((p_answers->'aiGrades'->p_question_id->>'score')::numeric,0),0),possible);
  elsif source_name='mathMultiPart' then
    details := math_part_scores(p_question_id,p_answer_key,p_answers);
    if p_answer_key->>'scoringStrategy'='investigationPlan' then
      select count(distinct key_part.value->>'category'),count(*) into category_count,correct_count from jsonb_array_elements(p_answer_key->'parts') with ordinality key_part(value,ordinality) join jsonb_array_elements(details->'parts') with ordinality scored(value,ordinality) using(ordinality) where coalesce((scored.value->>'correct')::boolean,false);
      return least(case when category_count<5 then category_count else 5+least(2,greatest(0,correct_count-5)) end,possible);
    elsif p_answer_key->>'scoringStrategy'='highestCorrect' then
      select coalesce(max((value->>'possible')::numeric),0) into raw_score from jsonb_array_elements(details->'parts') parts(value) where coalesce((value->>'correct')::boolean,false); return least(raw_score,possible);
    elsif p_answer_key ? 'scoreThresholds' then
      select count(*) into correct_count from jsonb_array_elements(details->'parts') parts(value) where coalesce((value->>'correct')::boolean,false);
      select coalesce(max((value->>'points')::numeric),0) into raw_score from jsonb_array_elements(p_answer_key->'scoreThresholds') thresholds(value) where correct_count>=coalesce((value->>'minCorrect')::integer,0); return least(raw_score,possible);
    end if;
  elsif source_name='geometryConstruction' then details := spip_y8_math_geometry_details(p_question_id,p_answer_key,p_answers);
  elsif source_name='rayDiagram' then details := ray_diagram_details(p_question_id,p_answer_key,p_answers);
  elsif source_name='diagramAnnotation' then details := case when p_answer_key->>'variant'='doubleArrow' then p6_double_arrow_details(p_question_id,p_answer_key,p_answers) else diagram_annotation_details(p_question_id,p_answer_key,p_answers) end;
  elsif source_name='biologicalDrawing' then details := p6_biological_drawing_details(p_question_id,p_answer_key,p_answers);
  elsif source_name='practicalGraph' then details := p6_practical_graph_details(p_question_id,p_answer_key,p_answers);
  elsif source_name='virtualMeasurement' then details := p6_virtual_measurement_details(p_question_id,p_answer_key,p_answers);
  elsif source_name='dependent' then details := spip_y8_math_dependent_details(p_question_id,p_answer_key,p_answers);
  elsif source_name='connections' then return case when p_response=p_answer_key->>'target' then possible else 0 end;
  elsif source_name in ('textAnswers','rwAnswers') then return case when normalize_answer(p_response) in (select normalize_answer(value) from jsonb_array_elements_text(p_answer_key->'accepted') accepted(value)) then possible else 0 end;
  elsif source_name='choices' then return case when p_response=p_answer_key->>'correct' then possible else 0 end;
  elsif source_name='colours' then return case when lower(p_response)=lower(p_answer_key->>'colour') then possible else 0 end;
  else return 0; end if;
  select coalesce(sum((value->>'score')::numeric),0) into raw_score from jsonb_array_elements(coalesce(details->'parts','[]'::jsonb)) parts(value);
  return least(greatest(raw_score,0),possible);
end;
$$;

create or replace function public.grading_details(p_question_id text, p_answer_key jsonb, p_answers jsonb default '{}'::jsonb)
returns jsonb language plpgsql stable as $$
begin
  if p_answer_key->>'source' in ('aiGrade','aiSplitGrade') then return coalesce(p_answers->'aiGrades'->p_question_id,'{}'::jsonb);
  elsif p_answer_key->>'source'='mathMultiPart' then return math_part_scores(p_question_id,p_answer_key,p_answers);
  elsif p_answer_key->>'source'='geometryConstruction' then return spip_y8_math_geometry_details(p_question_id,p_answer_key,p_answers);
  elsif p_answer_key->>'source'='rayDiagram' then return ray_diagram_details(p_question_id,p_answer_key,p_answers);
  elsif p_answer_key->>'source'='diagramAnnotation' then return case when p_answer_key->>'variant'='doubleArrow' then p6_double_arrow_details(p_question_id,p_answer_key,p_answers) else diagram_annotation_details(p_question_id,p_answer_key,p_answers) end;
  elsif p_answer_key->>'source'='biologicalDrawing' then return p6_biological_drawing_details(p_question_id,p_answer_key,p_answers);
  elsif p_answer_key->>'source'='practicalGraph' then return p6_practical_graph_details(p_question_id,p_answer_key,p_answers);
  elsif p_answer_key->>'source'='virtualMeasurement' then return p6_virtual_measurement_details(p_question_id,p_answer_key,p_answers);
  elsif p_answer_key->>'source'='dependent' then return spip_y8_math_dependent_details(p_question_id,p_answer_key,p_answers); end if;
  return '{}'::jsonb;
end;
$$;

create or replace function public.response_display(p_question_id text, p_answer_key jsonb, p_response text)
returns text language plpgsql stable as $$
declare response_json jsonb; part_key jsonb; part_id text; raw_json jsonb; raw_text text; items text[] := array[]::text[];
begin
  if p_response is null or p_response='' then return 'No answer'; end if;
  if p_answer_key->>'source' in ('mathMultiPart','dependent') then
    response_json := p_response::jsonb; if response_json='{}'::jsonb then return 'No answer'; end if; if jsonb_typeof(response_json)='string' then return coalesce(response_json #>> '{}','No answer'); end if;
    for part_key in select value from jsonb_array_elements(coalesce(p_answer_key->'parts','[]'::jsonb)) loop
      part_id := part_key->>'id'; raw_json := response_json->part_id;
      if raw_json is null then raw_text := ''; elsif jsonb_typeof(raw_json)='array' then select coalesce(string_agg(value,', '),'') into raw_text from jsonb_array_elements_text(raw_json) response(value); else raw_text := response_json->>part_id; end if;
      if coalesce(raw_text,'')<>'' then items := array_append(items,part_id||': '||raw_text); end if;
    end loop;
    if array_length(items,1) is null then select coalesce(string_agg(key||': '||(value #>> '{}'),'; '),'No answer') into raw_text from jsonb_each(response_json); return raw_text; end if;
    return array_to_string(items,'; ');
  elsif p_answer_key->>'source' in ('rayDiagram','diagramAnnotation','geometryConstruction','biologicalDrawing','practicalGraph','virtualMeasurement') then
    response_json := p_response::jsonb; if response_json='{}'::jsonb then return 'No answer'; end if;
    return case p_answer_key->>'source' when 'biologicalDrawing' then 'Biological drawing recorded' when 'practicalGraph' then 'Graph response recorded' when 'virtualMeasurement' then 'Virtual measurements recorded' when 'geometryConstruction' then 'Geometry construction recorded' else initcap(coalesce(p_answer_key->>'variant','diagram'))||' annotation recorded' end;
  elsif p_answer_key->>'source'='choices' then return upper(p_response); end if;
  return p_response;
end;
$$;
