begin;

insert into public.tests (id, title, subject, level, status, total_points, app_path)
values ('spip-year-8-science-pre', 'SPIP Year 8 Science Pre-test', 'Science', 'SPIP Year 8', 'active', 50, '/tests/spip-year-8-science-pre/start')
on conflict (id) do update set
  title = excluded.title,
  subject = excluded.subject,
  level = excluded.level,
  status = excluded.status,
  total_points = excluded.total_points,
  app_path = excluded.app_path;

insert into public.test_questions (id, test_id, part, prompt, answer_key, transcript_ref, points, position)
values
('spip-y8s-q1a','spip-year-8-science-pre','Questions 1-4','(a) Describe two adaptations shown in the drawing that enable the bat to fly.',$json${"source":"conceptGroups","id":"spip-y8s-q1a","points":2,"display":"Any two: webbed forelimbs/wings; smooth surface; large surface area","fields":["adaptation1","adaptation2"],"concepts":[{"id":"wings","keywords":[["wing"],["webbed","forelimb"]],"points":1},{"id":"smooth","keywords":[["smooth"]],"points":1},{"id":"large-area","keywords":[["large","surface"],["large","wing"],["wide","wing"]],"points":1}]}$json$::jsonb,null,2,1),
('spip-y8s-q1b','spip-year-8-science-pre','Questions 1-4','(b) The bat''s mouth is adapted to catch and eat large insects. Suggest how the mouth is adapted.',$json${"source":"conceptGroups","id":"spip-y8s-q1b","points":1,"display":"Large/wide mouth; pointed, sharp or many teeth; long/large tongue","fields":["answer"],"concepts":[{"id":"large-mouth","keywords":[["large","mouth"],["wide","mouth"]],"points":1},{"id":"teeth","keywords":[["sharp","teeth"],["pointed","teeth"],["many","teeth"]],"points":1},{"id":"tongue","keywords":[["long","tongue"],["large","tongue"]],"points":1}]}$json$::jsonb,null,1,2),
('spip-y8s-q2a','spip-year-8-science-pre','Questions 1-4','(a) Match each scooter part to the material used to make it.',$json${"source":"mathMultiPart","id":"spip-y8s-q2a","points":2,"display":"Frame: steel; tyre: rubber","parts":[{"id":"frame","accepted":["steel"],"points":1},{"id":"tyre","accepted":["rubber"],"points":1}]}$json$::jsonb,null,2,3),
('spip-y8s-q2b','spip-year-8-science-pre','Questions 1-4','(b) Some scooters have a frame made of aluminium. Write down two properties of aluminium that make it useful for making the frame.',$json${"source":"conceptGroups","id":"spip-y8s-q2b","points":2,"display":"Any two: strong, lightweight/low density, shiny, malleable, rigid/not brittle, does not corrode","fields":["property1","property2"],"concepts":[{"id":"strong","keywords":[["strong"]],"points":1},{"id":"lightweight","keywords":[["lightweight"],["low","density"]],"points":1},{"id":"shiny","keywords":[["shiny"]],"points":1},{"id":"malleable","keywords":[["malleable"]],"points":1},{"id":"rigid","keywords":[["rigid"],["not","brittle"]],"points":1},{"id":"corrosion","keywords":[["does not","corrode"],["doesn't","corrode"],["not","rust"],["does not","rust"]],"points":1}]}$json$::jsonb,null,2,4),
('spip-y8s-q3a','spip-year-8-science-pre','Questions 1-4','(a) Why does the Sun appear to move in the sky during the day?',$json${"source":"conceptGroups","id":"spip-y8s-q3a","points":1,"display":"The Earth moves/rotates/spins (not orbiting the Sun)","fields":["answer"],"concepts":[{"id":"rotation","keywords":[["earth","rotat"],["earth","spin"],["earth","move"]],"excludedTerms":["orbit","around the sun","round the sun"],"points":1}]}$json$::jsonb,null,1,5),
('spip-y8s-q3b','spip-year-8-science-pre','Questions 1-4','(b) Why is the position of the Sun in the summer sky different from its position in the winter sky?',$json${"source":"mathMultiPart","id":"spip-y8s-q3b","points":1,"display":"The Earth has a tilted axis","parts":[{"id":"answer","accepted":["earth tilted"],"points":1}]}$json$::jsonb,null,1,6),
('spip-y8s-q4a','spip-year-8-science-pre','Questions 1-4','(a) Why did Louis Pasteur boil the broth at the beginning of the experiment?',$json${"source":"conceptGroups","id":"spip-y8s-q4a","points":1,"display":"To kill/destroy microorganisms, microbes or bacteria; or sterilise the broth","fields":["answer"],"concepts":[{"id":"sterilise","keywords":[["kill","microorgan"],["kill","microbe"],["kill","bacteria"],["destroy","microorgan"],["destroy","microbe"],["destroy","bacteria"],["sterilis"],["steriliz"]],"points":1}]}$json$::jsonb,null,1,7),
('spip-y8s-q4b','spip-year-8-science-pre','Questions 1-4','(b) Why did no microorganisms grow in step B?',$json${"source":"conceptGroups","id":"spip-y8s-q4b","points":1,"display":"Microorganisms were caught in the bend or could not get into the broth","fields":["answer"],"concepts":[{"id":"blocked","keywords":[["microorgan","caught","bend"],["bacteria","caught","bend"],["microbe","caught","bend"],["microorgan","not reach","broth"],["bacteria","not reach","broth"],["microbe","not reach","broth"],["microorgan","could not","reach"],["bacteria","could not","reach"],["microbe","could not","reach"],["microorgan","couldn't","broth"],["bacteria","couldn't","broth"],["microbe","couldn't","broth"],["microorgan","not","get","broth"],["bacteria","not","get","broth"],["microbe","not","get","broth"]],"points":1}]}$json$::jsonb,null,1,8),
('spip-y8s-q5a','spip-year-8-science-pre','Questions 5-8','(a) What is the name of apparatus X?',$json${"source":"mathMultiPart","id":"spip-y8s-q5a","points":1,"display":"thermometer","parts":[{"id":"answer","accepted":["thermometer","a thermometer"],"points":1}]}$json$::jsonb,null,1,9),
('spip-y8s-q5bi','spip-year-8-science-pre','Questions 5-8','(b)(i) The table shows Oliver''s results. Describe the pattern in these results after the first two minutes.',$json${"source":"conceptGroups","id":"spip-y8s-q5bi","points":1,"display":"The temperature increases as heating time increases","fields":["answer"],"concepts":[{"id":"increase","keywords":[["temperature","increase","time"],["gets","hotter","time"]],"points":1}]}$json$::jsonb,null,1,10),
('spip-y8s-q5bii','spip-year-8-science-pre','Questions 5-8','(b)(ii) Which result does not fit this pattern?',$json${"source":"mathMultiPart","id":"spip-y8s-q5bii","points":1,"display":"50°C","parts":[{"id":"answer","accepted":["50","50 c","50°c"],"points":1}]}$json$::jsonb,null,1,11),
('spip-y8s-q5c','spip-year-8-science-pre','Questions 5-8','(c) Complete the sentences about the particles during heating.',$json${"source":"mathMultiPart","id":"spip-y8s-q5c","points":2,"display":"solid to liquid; energy; faster/apart","parts":[{"id":"from","accepted":["solid","a solid"],"points":1},{"id":"to","accepted":["liquid","a liquid"],"points":1},{"id":"gain","accepted":["energy","heat energy","thermal energy"],"points":1},{"id":"move","accepted":["faster","further apart","apart","more quickly","quicker"],"points":1}],"markGroups":[{"id":"state-change","partIds":["from","to"],"minCorrect":2,"points":1},{"id":"particles","partIds":["gain","move"],"minCorrect":2,"points":1}]}$json$::jsonb,null,2,12),
('spip-y8s-q6','spip-year-8-science-pre','Questions 5-8','The Earth is made of several layers. The diagram shows the different layers of the Earth. Complete the sentences about the structure of the Earth.',$json${"source":"mathMultiPart","id":"spip-y8s-q6","points":4,"display":"core; magma; lava; igneous","parts":[{"id":"centre","accepted":["core","the core","inner core","outer core","the inner core","the outer core"],"points":1},{"id":"mantle","accepted":["magma"],"points":1},{"id":"erupts","accepted":["lava"],"points":1},{"id":"rock","accepted":["igneous","igneous rock","basalt","granite","pumice"],"points":1}]}$json$::jsonb,null,4,13),
('spip-y8s-q7a','spip-year-8-science-pre','Questions 5-8','(a) A 100 N driving force acts forwards and a 60 N force acts backwards. What happens to the truck?',$json${"source":"mathMultiPart","id":"spip-y8s-q7a","points":1,"display":"speeds up","parts":[{"id":"answer","accepted":["speeds up"],"points":1}]}$json$::jsonb,null,1,14),
('spip-y8s-q7b','spip-year-8-science-pre','Questions 5-8','(b) Name the 60 N force acting against the driving force.',$json${"source":"mathMultiPart","id":"spip-y8s-q7b","points":1,"display":"friction / air resistance / resistance / drag","parts":[{"id":"answer","accepted":["friction","air resistance","resistance","drag"],"points":1}]}$json$::jsonb,null,1,15),
('spip-y8s-q7ci','spip-year-8-science-pre','Questions 5-8','(c)(i) Draw one arrow on or next to the truck to show its weight.',$json${"source":"diagramAnnotation","id":"spip-y8s-q7ci","points":1,"display":"One downward arrow on or next to the truck","variant":"directionArrow","geometry":{"variant":"directionArrow","region":{"minX":0.04,"maxX":0.96,"minY":0.08,"maxY":0.95},"direction":"down","angleToleranceDegrees":28,"minLength":0.08}}$json$::jsonb,null,1,16),
('spip-y8s-q7cii','spip-year-8-science-pre','Questions 5-8','(c)(ii) The weight of the truck is increased. What does gravity do to the truck?',$json${"source":"mathMultiPart","id":"spip-y8s-q7cii","points":1,"display":"moves it downwards","parts":[{"id":"answer","accepted":["moves it downwards"],"points":1}]}$json$::jsonb,null,1,17),
('spip-y8s-q8a','spip-year-8-science-pre','Questions 5-8','(a) Measure the length of the three seeds in millimetres. Put each length in the box below the seed.',$json${"source":"virtualMeasurement","id":"spip-y8s-q8a","points":1,"display":"19-20 mm; 18-19 mm; 20-21 mm","measurements":[{"id":"seed1","label":"Seed 1","unit":"mm","expected":19.5,"tolerance":0.55,"calibration":28.4,"start":{"x":0.17,"y":0.24},"end":{"x":0.17,"y":0.93}},{"id":"seed2","label":"Seed 2","unit":"mm","expected":18.5,"tolerance":0.55,"calibration":28.4,"start":{"x":0.41,"y":0.27},"end":{"x":0.41,"y":0.93}},{"id":"seed3","label":"Seed 3","unit":"mm","expected":20.5,"tolerance":0.55,"calibration":28.4,"start":{"x":0.69,"y":0.21},"end":{"x":0.69,"y":0.93}}],"scoringStrategy":"allCorrect"}$json$::jsonb,null,1,18),
('spip-y8s-q8b','spip-year-8-science-pre','Questions 5-8','(b) Add the three measured seeds to the tally chart and complete the affected totals.',$json${"source":"tallyTable","id":"spip-y8s-q8b","points":3,"display":"ECF totals: 16-17 = 12; 18-19 = 17 or 18; 20-21 = 9 or 10","sourceQuestionId":"spip-y8s-q8a","bins":[{"id":"14-15","label":"14-15","min":14,"max":15,"baseCount":6,"editable":false},{"id":"16-17","label":"16-17","min":16,"max":17,"baseCount":12,"editable":true},{"id":"18-19","label":"18-19","min":18,"max":19,"baseCount":16,"editable":true},{"id":"20-21","label":"20-21","min":20,"max":21,"baseCount":8,"editable":true},{"id":"22-23","label":"22-23","min":22,"max":23,"baseCount":5,"editable":false}],"measurementIds":["seed1","seed2","seed3"],"measurementCalibrations":{"seed1":28.4,"seed2":28.4,"seed3":28.4}}$json$::jsonb,null,3,19),
('spip-y8s-q8c','spip-year-8-science-pre','Questions 5-8','(c) Use the tally chart to complete the histogram on the grid. Label the y-axis. The x-axis has been done for you.',$json${"source":"histogram","id":"spip-y8s-q8c","points":3,"display":"Y-axis: total number of seeds; bars follow the completed tally totals","sourceQuestionId":"spip-y8s-q8b","categories":[{"id":"14-15","label":"14-15","fixedValue":6},{"id":"16-17","label":"16-17"},{"id":"18-19","label":"18-19"},{"id":"20-21","label":"20-21"},{"id":"22-23","label":"22-23","fixedValue":5}],"yMaxOptions":[20,25,30],"axisKeywords":[["number","seed"],["total","seed"],["frequency"]]}$json$::jsonb,null,3,20),
('spip-y8s-q9a','spip-year-8-science-pre','Questions 9-12','(a) Which is the best description of a solution with a pH of 5?',$json${"source":"mathMultiPart","id":"spip-y8s-q9a","points":1,"display":"weakly acidic","parts":[{"id":"answer","accepted":["weakly acidic"],"points":1}]}$json$::jsonb,null,1,21),
('spip-y8s-q9b','spip-year-8-science-pre','Questions 9-12','(b) What is the pH of a neutral solution?',$json${"source":"mathMultiPart","id":"spip-y8s-q9b","points":1,"display":"7","parts":[{"id":"answer","accepted":["7","pH 7"],"points":1}]}$json$::jsonb,null,1,22),
('spip-y8s-q10a','spip-year-8-science-pre','Questions 9-12','(a) To which group of vertebrates do ostriches belong?',$json${"source":"mathMultiPart","id":"spip-y8s-q10a","points":1,"display":"birds / Aves","parts":[{"id":"answer","accepted":["bird","birds","aves","avian","avians"],"points":1}]}$json$::jsonb,null,1,23),
('spip-y8s-q10b','spip-year-8-science-pre','Questions 9-12','(b) Use the drawing to give two reasons for your answer to part (a).',$json${"source":"conceptGroups","id":"spip-y8s-q10b","points":2,"display":"Any two: feathers; beak/bill; wings","fields":["reason1","reason2"],"concepts":[{"id":"feathers","keywords":[["feather"]],"points":1},{"id":"beak","keywords":[["beak"],["bill"]],"points":1},{"id":"wings","keywords":[["wing"]],"points":1}],"dependency":{"questionId":"spip-y8s-q10a","accepted":["bird","birds","aves","avian","avians"]}}$json$::jsonb,null,2,24),
('spip-y8s-q11','spip-year-8-science-pre','Questions 9-12','Match each type of energy to its description.',$json${"source":"mathMultiPart","id":"spip-y8s-q11","points":3,"display":"chemical-food/fuel; elastic-changed shape; gravitational-position; thermal-temperature difference; kinetic-moving","parts":[{"id":"chemical","accepted":["food or fuel"],"points":1},{"id":"elastic","accepted":["changed shape"],"points":1},{"id":"gravitational","accepted":["position"],"points":1},{"id":"thermal","accepted":["temperature difference"],"points":1},{"id":"kinetic","accepted":["moving"],"points":1}],"scoreThresholds":[{"minCorrect":5,"points":3},{"minCorrect":3,"points":2},{"minCorrect":1,"points":1}]}$json$::jsonb,null,3,25),
('spip-y8s-q12a','spip-year-8-science-pre','Questions 9-12','(a) How many of the four statements about friction are true?',$json${"source":"mathMultiPart","id":"spip-y8s-q12a","points":1,"display":"4","parts":[{"id":"answer","accepted":["4"],"points":1}]}$json$::jsonb,null,1,26),
('spip-y8s-q12b','spip-year-8-science-pre','Questions 9-12','(b) Ice skates have thin blades. There is a layer of water between the thin blade and the ice. Explain how this layer of water helps the skater.',$json${"source":"conceptGroups","id":"spip-y8s-q12b","points":2,"display":"Water reduces friction/acts as a lubricant, so the skater can go faster","fields":["answer"],"concepts":[{"id":"lubrication","keywords":[["reduce","friction"],["less","friction"],["lubric"]],"points":1},{"id":"movement","keywords":[["move","faster"],["go","faster"],["skate","faster"],["travel","faster"]],"points":1}]}$json$::jsonb,null,2,27),
('spip-y8s-q13','spip-year-8-science-pre','Questions 13-15','Complete the ocean food chain from top predator to producer. Sunlight is shown below the final box.',$json${"source":"mathMultiPart","id":"spip-y8s-q13","points":2,"display":"killer whale -> dolphin -> fish -> crustacean -> phytoplankton -> sunlight","parts":[{"id":"position1","accepted":["killer whale"],"points":1},{"id":"position2","accepted":["dolphin"],"points":1},{"id":"position3","accepted":["fish"],"points":1},{"id":"position4","accepted":["crustacean"],"points":1},{"id":"position5","accepted":["phytoplankton"],"points":1}],"markGroups":[{"id":"ends","partIds":["position1","position5"],"minCorrect":2,"points":1}],"sequenceGroups":[{"id":"predator-sequence","partIds":["position1","position2","position3","position4","position5"],"acceptedSequence":["dolphin","fish","crustacean"],"points":1}]}$json$::jsonb,null,2,28),
('spip-y8s-q14','spip-year-8-science-pre','Questions 13-15','Write two differences between metals and non-metals, other than melting and boiling points.',$json${"source":"conceptGroups","id":"spip-y8s-q14","points":2,"display":"Any two valid comparisons of heat/electrical conductivity, strength, hardness, ductility, density, malleability, flexibility or sonority","fields":["difference1","difference2"],"concepts":[{"id":"heat-conductivity","keywords":[["metal","conduct","heat","non metal"],["metal","heat","conductor","non metal"]],"points":1},{"id":"electrical-conductivity","keywords":[["metal","conduct","electric","non metal"],["metal","electrical","conductor","non metal"]],"points":1},{"id":"strength","keywords":[["metal","strong","non metal","weak"],["metal","strong","non metal","not"]],"points":1},{"id":"hardness","keywords":[["metal","hard","non metal","soft"],["metal","hard","non metal","not"]],"points":1},{"id":"ductility","keywords":[["metal","ductile","non metal"],["metal","wire","non metal"]],"points":1},{"id":"density","keywords":[["metal","density","non metal"]],"points":1},{"id":"malleability","keywords":[["metal","malleable","non metal"],["metal","shape","non metal","brittle"]],"points":1},{"id":"flexibility","keywords":[["metal","flexible","non metal"]],"points":1},{"id":"sonority","keywords":[["metal","sonorous","non metal"],["metal","ring","non metal"]],"points":1}]}$json$::jsonb,null,2,29),
('spip-y8s-q15a','spip-year-8-science-pre','Questions 13-15','(a) Which planet has the largest orbit?',$json${"source":"mathMultiPart","id":"spip-y8s-q15a","points":1,"display":"Saturn","parts":[{"id":"answer","accepted":["saturn"],"points":1}]}$json$::jsonb,null,1,30),
('spip-y8s-q15b','spip-year-8-science-pre','Questions 13-15','(b) Which planet takes the shortest time to orbit the Sun?',$json${"source":"mathMultiPart","id":"spip-y8s-q15b","points":1,"display":"Mercury","parts":[{"id":"answer","accepted":["mercury"],"points":1}]}$json$::jsonb,null,1,31),
('spip-y8s-q15ci','spip-year-8-science-pre','Questions 13-15','(c)(i) Chen has a weight of 600 N on Earth. Estimate Chen''s weight on Mercury. Circle the correct answer.',$json${"source":"mathMultiPart","id":"spip-y8s-q15ci","points":1,"display":"230 N","parts":[{"id":"answer","accepted":["230 N"],"points":1}]}$json$::jsonb,null,1,32),
('spip-y8s-q15cii','spip-year-8-science-pre','Questions 13-15','(c)(ii) Chen''s friend has a mass of 50 kg on Earth. What is his mass on Venus?',$json${"source":"mathMultiPart","id":"spip-y8s-q15cii","points":1,"display":"50 kg","parts":[{"id":"answer","accepted":["50","50 kg","50kg"],"points":1}]}$json$::jsonb,null,1,33)
on conflict (id) do update set
  test_id = excluded.test_id,
  part = excluded.part,
  prompt = excluded.prompt,
  answer_key = excluded.answer_key,
  transcript_ref = excluded.transcript_ref,
  points = excluded.points,
  position = excluded.position;

delete from public.test_questions
where test_id = 'spip-year-8-science-pre'
  and id not in (
    select 'spip-y8s-' || suffix
    from unnest(array[
      'q1a','q1b','q2a','q2b','q3a','q3b','q4a','q4b','q5a','q5bi','q5bii','q5c','q6',
      'q7a','q7b','q7ci','q7cii','q8a','q8b','q8c','q9a','q9b','q10a','q10b','q11',
      'q12a','q12b','q13','q14','q15a','q15b','q15ci','q15cii'
    ]) suffix
  );

create or replace function public.spip_science_concept_details(p_question_id text, p_answer_key jsonb, p_answers jsonb default '{}'::jsonb)
returns jsonb language plpgsql stable as $$
declare
  response_json jsonb := coalesce(p_answers->p_question_id, '""'::jsonb);
  response_text text := '';
  response_norm text;
  field_id text;
  concept jsonb;
  concept_correct boolean;
  excluded boolean;
  dependency jsonb := p_answer_key->'dependency';
  dependency_json jsonb;
  dependency_text text := '';
  dependency_met boolean := true;
  items jsonb := '[]'::jsonb;
begin
  if jsonb_typeof(response_json) = 'string' then
    response_text := coalesce(response_json #>> '{}', '');
  else
    for field_id in select value from jsonb_array_elements_text(coalesce(p_answer_key->'fields', '[]'::jsonb)) loop
      response_text := response_text || ' ' || coalesce(response_json->>field_id, '');
    end loop;
  end if;
  response_norm := normalize_math_answer(response_text, 'text');

  if dependency is not null then
    dependency_json := coalesce(p_answers->(dependency->>'questionId'), '""'::jsonb);
    dependency_text := case when jsonb_typeof(dependency_json) = 'string'
      then coalesce(dependency_json #>> '{}', '')
      else coalesce(dependency_json->>'answer', '') end;
    dependency_met := exists (
      select 1 from jsonb_array_elements_text(coalesce(dependency->'accepted', '[]'::jsonb)) accepted(value)
      where normalize_math_answer(accepted.value, 'text') = normalize_math_answer(dependency_text, 'text')
    );
  end if;

  for concept in select value from jsonb_array_elements(coalesce(p_answer_key->'concepts', '[]'::jsonb)) loop
    excluded := exists (
      select 1 from jsonb_array_elements_text(coalesce(concept->'excludedTerms', '[]'::jsonb)) excluded_term(value)
      where position(normalize_math_answer(excluded_term.value, 'text') in response_norm) > 0
    );
    concept_correct := dependency_met and not excluded and response_norm <> '' and exists (
      select 1
      from jsonb_array_elements(coalesce(concept->'keywords', '[]'::jsonb)) groups(value)
      where not exists (
        select 1 from jsonb_array_elements_text(groups.value) words(word)
        where position(normalize_math_answer(words.word, 'text') in response_norm) = 0
      )
    );
    items := items || jsonb_build_array(jsonb_build_object(
      'id', concept->>'id',
      'score', case when concept_correct then (concept->>'points')::numeric else 0 end,
      'possible', (concept->>'points')::numeric,
      'correct', concept_correct,
      'dependencyMet', dependency_met,
      'excluded', excluded
    ));
  end loop;
  return jsonb_build_object('parts', items);
end;
$$;

create or replace function public.spip_science_direction_arrow_details(p_question_id text, p_answer_key jsonb, p_answers jsonb default '{}'::jsonb)
returns jsonb language plpgsql stable as $$
declare
  response jsonb := coalesce(p_answers->p_question_id, '{}'::jsonb);
  start_value text := response->>'start';
  end_value text := response->>'end';
  sx numeric := spip_math_point(start_value, 1);
  sy numeric := spip_math_point(start_value, 2);
  ex numeric := spip_math_point(end_value, 1);
  ey numeric := spip_math_point(end_value, 2);
  geometry jsonb := p_answer_key->'geometry';
  midpoint_x numeric;
  midpoint_y numeric;
  arrow_length numeric;
  arrow_angle numeric;
  region_correct boolean := false;
  direction_correct boolean := false;
  length_correct boolean := false;
  correct boolean := false;
begin
  if sx is not null and sy is not null and ex is not null and ey is not null then
    midpoint_x := (sx + ex) / 2;
    midpoint_y := (sy + ey) / 2;
    arrow_length := sqrt(power(ex - sx, 2) + power(ey - sy, 2));
    arrow_angle := degrees(atan2(ey - sy, ex - sx));
    region_correct := midpoint_x between (geometry->'region'->>'minX')::numeric and (geometry->'region'->>'maxX')::numeric
      and midpoint_y between (geometry->'region'->>'minY')::numeric and (geometry->'region'->>'maxY')::numeric;
    direction_correct := abs(arrow_angle - 90) <= (geometry->>'angleToleranceDegrees')::numeric;
    length_correct := arrow_length >= (geometry->>'minLength')::numeric;
    correct := region_correct and direction_correct and length_correct;
  end if;
  return jsonb_build_object('parts', jsonb_build_array(jsonb_build_object(
    'id', 'directionArrow',
    'score', case when correct then 1 else 0 end,
    'possible', 1,
    'correct', correct,
    'regionCorrect', region_correct,
    'directionCorrect', direction_correct,
    'lengthCorrect', length_correct
  )));
end;
$$;

create or replace function public.spip_science_virtual_details(p_question_id text, p_answer_key jsonb, p_answers jsonb default '{}'::jsonb)
returns jsonb language plpgsql stable as $$
declare
  base_details jsonb := p6_virtual_measurement_details(p_question_id, p_answer_key, p_answers);
  all_correct boolean;
begin
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

create or replace function public.spip_science_tally_details(p_question_id text, p_answer_key jsonb, p_answers jsonb default '{}'::jsonb)
returns jsonb language plpgsql stable as $$
declare
  response jsonb := coalesce(p_answers->p_question_id, '{}'::jsonb);
  source_response jsonb := coalesce(p_answers->(p_answer_key->>'sourceQuestionId'), '{}'::jsonb);
  bin jsonb;
  measurement_id text;
  calibration numeric;
  measured numeric;
  extra_count integer;
  expected_total integer;
  entered_extra numeric;
  entered_total numeric;
  correct boolean;
  items jsonb := '[]'::jsonb;
begin
  for bin in select value from jsonb_array_elements(coalesce(p_answer_key->'bins', '[]'::jsonb))
  loop
    if not coalesce((bin->>'editable')::boolean, false) then continue; end if;
    extra_count := 0;
    for measurement_id in select value from jsonb_array_elements_text(coalesce(p_answer_key->'measurementIds', '[]'::jsonb))
    loop
      calibration := coalesce((p_answer_key->'measurementCalibrations'->>measurement_id)::numeric, 1);
      measured := spip_math_distance(source_response->>(measurement_id || 'Start'), source_response->>(measurement_id || 'End')) * calibration;
      if measured is not null and round(measured) between (bin->>'min')::integer and (bin->>'max')::integer then
        extra_count := extra_count + 1;
      end if;
    end loop;
    expected_total := (bin->>'baseCount')::integer + extra_count;
    entered_extra := spip_math_numeric_value(response->>((bin->>'id') || 'Tally'));
    entered_total := spip_math_numeric_value(response->>((bin->>'id') || 'Total'));
    correct := entered_extra = extra_count and entered_total = expected_total;
    items := items || jsonb_build_array(jsonb_build_object(
      'id', bin->>'id',
      'score', case when correct then 1 else 0 end,
      'possible', 1,
      'correct', correct,
      'expectedExtra', extra_count,
      'expectedTotal', expected_total
    ));
  end loop;
  return jsonb_build_object('parts', items);
end;
$$;

create or replace function public.spip_science_histogram_details(p_question_id text, p_answer_key jsonb, p_answers jsonb default '{}'::jsonb)
returns jsonb language plpgsql stable as $$
declare
  response jsonb := coalesce(p_answers->p_question_id, '{}'::jsonb);
  source_response jsonb := coalesce(p_answers->(p_answer_key->>'sourceQuestionId'), '{}'::jsonb);
  category jsonb;
  expected_value numeric;
  entered_value numeric;
  largest numeric := 0;
  y_max numeric := spip_math_numeric_value(response->>'yMax');
  y_label text := normalize_math_answer(response->>'yLabel', 'text');
  axis_label_correct boolean := false;
  scale_correct boolean := false;
  axis_correct boolean := false;
  editable_count integer := 0;
  correct_bars integer := 0;
  bar_score integer := 0;
  expected jsonb := '[]'::jsonb;
begin
  axis_label_correct := y_label <> '' and exists (
    select 1 from jsonb_array_elements(coalesce(p_answer_key->'axisKeywords', '[]'::jsonb)) groups(value)
    where not exists (
      select 1 from jsonb_array_elements_text(groups.value) words(word)
      where position(normalize_math_answer(words.word, 'text') in y_label) = 0
    )
  );

  for category in select value from jsonb_array_elements(coalesce(p_answer_key->'categories', '[]'::jsonb))
  loop
    if category ? 'fixedValue' then expected_value := (category->>'fixedValue')::numeric;
    else expected_value := spip_math_numeric_value(source_response->>((category->>'id') || 'Total')); end if;
    expected := expected || jsonb_build_array(expected_value);
    if expected_value is not null then largest := greatest(largest, expected_value); end if;
    if not (category ? 'fixedValue') then
      editable_count := editable_count + 1;
      entered_value := spip_math_numeric_value(response->>('bar-' || (category->>'id')));
      if entered_value is not null and expected_value is not null and abs(entered_value - expected_value) < 0.01 then
        correct_bars := correct_bars + 1;
      end if;
    end if;
  end loop;

  scale_correct := y_max is not null and y_max >= largest and largest / nullif(y_max, 0) > 0.5;
  axis_correct := axis_label_correct and scale_correct;
  bar_score := case when correct_bars = editable_count and editable_count > 0 then 2 when correct_bars >= 1 then 1 else 0 end;
  return jsonb_build_object('parts', jsonb_build_array(
    jsonb_build_object('id', 'y-axis', 'score', case when axis_correct then 1 else 0 end, 'possible', 1, 'correct', axis_correct, 'axisLabelCorrect', axis_label_correct, 'scaleCorrect', scale_correct, 'yMax', y_max),
    jsonb_build_object('id', 'bars', 'score', bar_score, 'possible', 2, 'correct', bar_score = 2, 'correctBars', correct_bars, 'expected', expected)
  ));
end;
$$;

create or replace function public.spip_sequence_group_matches(p_response jsonb, p_group jsonb)
returns boolean language plpgsql immutable as $$
declare
  responses text[];
  expected text[];
  start_index integer;
  offset_index integer;
  matched boolean;
begin
  select array_agg(normalize_math_answer(coalesce(p_response->>ids.value, ''), 'text') order by ids.ordinality)
  into responses
  from jsonb_array_elements_text(coalesce(p_group->'partIds', '[]'::jsonb)) with ordinality ids(value, ordinality);

  select array_agg(normalize_math_answer(values.value, 'text') order by values.ordinality)
  into expected
  from jsonb_array_elements_text(coalesce(p_group->'acceptedSequence', '[]'::jsonb)) with ordinality values(value, ordinality);

  if coalesce(array_length(expected, 1), 0) = 0
    or coalesce(array_length(responses, 1), 0) < array_length(expected, 1) then
    return false;
  end if;

  for start_index in 1..(array_length(responses, 1) - array_length(expected, 1) + 1) loop
    matched := true;
    for offset_index in 1..array_length(expected, 1) loop
      if responses[start_index + offset_index - 1] <> expected[offset_index] then
        matched := false;
        exit;
      end if;
    end loop;
    if matched then return true; end if;
  end loop;
  return false;
end;
$$;

create or replace function public.answer_response(p_answer_key jsonb, p_answers jsonb)
returns text language plpgsql stable as $$
declare source_name text := p_answer_key->>'source';
begin
  if source_name='questionMap' then return coalesce(p_answers->>(p_answer_key->>'id'),'');
  elsif source_name in ('aiGrade','aiSplitGrade') then return coalesce(p_answers->>(p_answer_key->>'id'),'');
  elsif source_name in ('mathMultiPart','conceptGroups','rayDiagram','diagramAnnotation','geometryConstruction','biologicalDrawing','practicalGraph','virtualMeasurement','tallyTable','histogram','dependent') then return coalesce((p_answers->(p_answer_key->>'id'))::text,'');
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
  source_name text := p_answer_key->>'source';
  possible numeric := question_points(p_answer_key);
  raw_score numeric := 0;
  details jsonb;
  correct_count integer := 0;
  category_count integer := 0;
  group_key jsonb;
  group_correct integer;
begin
  if source_name='questionMap' then return case when normalize_answer(p_response) in (select normalize_answer(value) from jsonb_array_elements_text(p_answer_key->'accepted') accepted(value)) then possible else 0 end;
  elsif source_name in ('aiGrade','aiSplitGrade') then return least(greatest(coalesce((p_answers->'aiGrades'->p_question_id->>'score')::numeric,0),0),possible);
  elsif source_name='mathMultiPart' then
    details := math_part_scores(p_question_id,p_answer_key,p_answers);
    if p_answer_key->>'scoringStrategy'='investigationPlan' then
      select count(distinct key_part.value->>'category'),count(*) into category_count,correct_count from jsonb_array_elements(p_answer_key->'parts') with ordinality key_part(value,ordinality) join jsonb_array_elements(details->'parts') with ordinality scored(value,ordinality) using(ordinality) where coalesce((scored.value->>'correct')::boolean,false);
      return least(case when category_count<5 then category_count else 5+least(2,greatest(0,correct_count-5)) end,possible);
    elsif p_answer_key->>'scoringStrategy'='highestCorrect' then
      select coalesce(max((value->>'possible')::numeric),0) into raw_score from jsonb_array_elements(details->'parts') parts(value) where coalesce((value->>'correct')::boolean,false);
      return least(raw_score,possible);
    elsif p_answer_key ? 'sequenceGroups' then
      raw_score := 0;
      if p_answer_key ? 'markGroups' then
        for group_key in select value from jsonb_array_elements(p_answer_key->'markGroups') loop
          select count(*) into group_correct
          from jsonb_array_elements(details->'parts') scored(value)
          where coalesce((scored.value->>'correct')::boolean,false)
            and scored.value->>'id' in (select value from jsonb_array_elements_text(group_key->'partIds'));
          if group_correct >= (group_key->>'minCorrect')::integer then raw_score := raw_score + (group_key->>'points')::numeric; end if;
        end loop;
      end if;
      for group_key in select value from jsonb_array_elements(p_answer_key->'sequenceGroups') loop
        if spip_sequence_group_matches(coalesce(p_answers->p_question_id, '{}'::jsonb), group_key) then
          raw_score := raw_score + (group_key->>'points')::numeric;
        end if;
      end loop;
      return least(raw_score, possible);
    elsif p_answer_key ? 'markGroups' then
      raw_score := 0;
      for group_key in select value from jsonb_array_elements(p_answer_key->'markGroups') loop
        select count(*) into group_correct
        from jsonb_array_elements(details->'parts') scored(value)
        where coalesce((scored.value->>'correct')::boolean,false)
          and scored.value->>'id' in (select value from jsonb_array_elements_text(group_key->'partIds'));
        if group_correct >= (group_key->>'minCorrect')::integer then raw_score := raw_score + (group_key->>'points')::numeric; end if;
      end loop;
      return least(raw_score, possible);
    elsif p_answer_key ? 'scoreThresholds' then
      select count(*) into correct_count from jsonb_array_elements(details->'parts') parts(value) where coalesce((value->>'correct')::boolean,false);
      select coalesce(max((value->>'points')::numeric),0) into raw_score from jsonb_array_elements(p_answer_key->'scoreThresholds') thresholds(value) where correct_count>=coalesce((value->>'minCorrect')::integer,0);
      return least(raw_score,possible);
    end if;
  elsif source_name='conceptGroups' then details := spip_science_concept_details(p_question_id,p_answer_key,p_answers);
  elsif source_name='geometryConstruction' then details := spip_y8_math_geometry_details(p_question_id,p_answer_key,p_answers);
  elsif source_name='rayDiagram' then
    execute 'select public.ray_diagram_details($1,$2,$3)' into details using p_question_id,p_answer_key,p_answers;
  elsif source_name='diagramAnnotation' then
    if p_answer_key->>'variant'='directionArrow' then
      details := spip_science_direction_arrow_details(p_question_id,p_answer_key,p_answers);
    elsif p_answer_key->>'variant'='doubleArrow' then
      execute 'select public.p6_double_arrow_details($1,$2,$3)' into details using p_question_id,p_answer_key,p_answers;
    else
      execute 'select public.diagram_annotation_details($1,$2,$3)' into details using p_question_id,p_answer_key,p_answers;
    end if;
  elsif source_name='biologicalDrawing' then
    execute 'select public.p6_biological_drawing_details($1,$2,$3)' into details using p_question_id,p_answer_key,p_answers;
  elsif source_name='practicalGraph' then
    execute 'select public.p6_practical_graph_details($1,$2,$3)' into details using p_question_id,p_answer_key,p_answers;
  elsif source_name='virtualMeasurement' then details := spip_science_virtual_details(p_question_id,p_answer_key,p_answers);
  elsif source_name='tallyTable' then details := spip_science_tally_details(p_question_id,p_answer_key,p_answers);
  elsif source_name='histogram' then details := spip_science_histogram_details(p_question_id,p_answer_key,p_answers);
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
declare details jsonb;
begin
  if p_answer_key->>'source' in ('aiGrade','aiSplitGrade') then return coalesce(p_answers->'aiGrades'->p_question_id,'{}'::jsonb);
  elsif p_answer_key->>'source'='mathMultiPart' then return math_part_scores(p_question_id,p_answer_key,p_answers);
  elsif p_answer_key->>'source'='conceptGroups' then return spip_science_concept_details(p_question_id,p_answer_key,p_answers);
  elsif p_answer_key->>'source'='geometryConstruction' then return spip_y8_math_geometry_details(p_question_id,p_answer_key,p_answers);
  elsif p_answer_key->>'source'='rayDiagram' then
    execute 'select public.ray_diagram_details($1,$2,$3)' into details using p_question_id,p_answer_key,p_answers;
    return details;
  elsif p_answer_key->>'source'='diagramAnnotation' then
    if p_answer_key->>'variant'='directionArrow' then
      return spip_science_direction_arrow_details(p_question_id,p_answer_key,p_answers);
    elsif p_answer_key->>'variant'='doubleArrow' then
      execute 'select public.p6_double_arrow_details($1,$2,$3)' into details using p_question_id,p_answer_key,p_answers;
    else
      execute 'select public.diagram_annotation_details($1,$2,$3)' into details using p_question_id,p_answer_key,p_answers;
    end if;
    return details;
  elsif p_answer_key->>'source'='biologicalDrawing' then
    execute 'select public.p6_biological_drawing_details($1,$2,$3)' into details using p_question_id,p_answer_key,p_answers;
    return details;
  elsif p_answer_key->>'source'='practicalGraph' then
    execute 'select public.p6_practical_graph_details($1,$2,$3)' into details using p_question_id,p_answer_key,p_answers;
    return details;
  elsif p_answer_key->>'source'='virtualMeasurement' then return spip_science_virtual_details(p_question_id,p_answer_key,p_answers);
  elsif p_answer_key->>'source'='tallyTable' then return spip_science_tally_details(p_question_id,p_answer_key,p_answers);
  elsif p_answer_key->>'source'='histogram' then return spip_science_histogram_details(p_question_id,p_answer_key,p_answers);
  elsif p_answer_key->>'source'='dependent' then return spip_y8_math_dependent_details(p_question_id,p_answer_key,p_answers); end if;
  return '{}'::jsonb;
end;
$$;

create or replace function public.response_display(p_question_id text, p_answer_key jsonb, p_response text)
returns text language plpgsql stable as $$
declare response_json jsonb; part_key jsonb; part_id text; raw_json jsonb; raw_text text; items text[] := array[]::text[];
begin
  if p_response is null or p_response='' then return 'No answer'; end if;
  if p_answer_key->>'source' in ('mathMultiPart','conceptGroups','dependent') then
    response_json := p_response::jsonb;
    if response_json='{}'::jsonb then return 'No answer'; end if;
    if jsonb_typeof(response_json)='string' then return coalesce(response_json #>> '{}','No answer'); end if;
    for part_key in select value from jsonb_array_elements(coalesce(p_answer_key->'parts',p_answer_key->'fields','[]'::jsonb)) loop
      part_id := case when jsonb_typeof(part_key)='string' then part_key #>> '{}' else part_key->>'id' end;
      raw_json := response_json->part_id;
      if raw_json is null then raw_text := ''; elsif jsonb_typeof(raw_json)='array' then select coalesce(string_agg(value,', '),'') into raw_text from jsonb_array_elements_text(raw_json) response(value); else raw_text := response_json->>part_id; end if;
      if coalesce(raw_text,'')<>'' then items := array_append(items,part_id||': '||raw_text); end if;
    end loop;
    if array_length(items,1) is null then select coalesce(string_agg(key||': '||value #>> '{}','; '),'No answer') into raw_text from jsonb_each(response_json); return raw_text; end if;
    return array_to_string(items,'; ');
  elsif p_answer_key->>'source' in ('rayDiagram','diagramAnnotation','geometryConstruction','biologicalDrawing','practicalGraph','virtualMeasurement','tallyTable','histogram') then
    response_json := p_response::jsonb;
    if response_json='{}'::jsonb then return 'No answer'; end if;
    return case p_answer_key->>'source'
      when 'biologicalDrawing' then 'Biological drawing recorded'
      when 'practicalGraph' then 'Graph response recorded'
      when 'virtualMeasurement' then 'Virtual measurements recorded'
      when 'tallyTable' then 'Tally table completed'
      when 'histogram' then 'Histogram completed'
      when 'geometryConstruction' then 'Geometry construction recorded'
      else initcap(coalesce(p_answer_key->>'variant','diagram'))||' annotation recorded' end;
  elsif p_answer_key->>'source'='choices' then return upper(p_response); end if;
  return p_response;
end;
$$;

commit;
