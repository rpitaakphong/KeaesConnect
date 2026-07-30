-- CIE IGCSE Combined Science 0653/06 Alternative to Practical specimen paper.
-- Idempotent: safe to reapply after the base schema and earlier CIE patches.

insert into public.tests (id, title, subject, level, status, total_points, app_path)
values (
  'cie-igcse-combined-science-paper-6-alternative-to-practical',
  'CIE IGCSE Combined Science Paper 6 Alternative to Practical',
  'Combined Science',
  'Alternative to Practical',
  'active',
  40,
  '/tests/cie-igcse-combined-science-paper-6-alternative-to-practical/start'
)
on conflict (id) do update set
  title = excluded.title,
  subject = excluded.subject,
  level = excluded.level,
  status = excluded.status,
  total_points = excluded.total_points,
  app_path = excluded.app_path;

insert into public.test_questions (id, test_id, part, prompt, answer_key, transcript_ref, points, position)
values
  ('cie-igcse-cs-p6-q1a', 'cie-igcse-combined-science-paper-6-alternative-to-practical', 'Biology Questions 1-2', '(a) Make a large biological drawing of the cut surface of the apple shown in Fig. 1.1.',
   '{"source":"biologicalDrawing","id":"cie-igcse-cs-p6-q1a","points":3,"display":"Large smooth outline; five star-like core sections with pip details","status":"official"}'::jsonb, null, 3, 1),
  ('cie-igcse-cs-p6-q1bi', 'cie-igcse-combined-science-paper-6-alternative-to-practical', 'Biology Questions 1-2', '(b)(i) Record the volume of apple juice remaining in the syringe in experiment 3.',
   '{"source":"mathMultiPart","id":"cie-igcse-cs-p6-q1bi","points":1,"display":"1.4 cm3","status":"official","parts":[{"id":"remaining","accepted":["1.4","1.4 cm3"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 2),
  ('cie-igcse-cs-p6-q1bii', 'cie-igcse-combined-science-paper-6-alternative-to-practical', 'Biology Questions 1-2', '(b)(ii) Calculate the volume of apple juice added to the DCPIP in experiment 3.',
   '{"source":"dependent","id":"cie-igcse-cs-p6-q1bii","points":1,"display":"8.6 cm3 (ECF from (b)(i))","status":"official","rule":{"type":"subtractFrom","sourceQuestionId":"cie-igcse-cs-p6-q1bi","sourceField":"remaining","minuend":10,"tolerance":0.05}}'::jsonb, null, 1, 3),
  ('cie-igcse-cs-p6-q1biii', 'cie-igcse-combined-science-paper-6-alternative-to-practical', 'Biology Questions 1-2', '(b)(iii) Calculate the average volume of apple juice added.',
   '{"source":"dependent","id":"cie-igcse-cs-p6-q1biii","points":1,"display":"8.9 cm3 (ECF from (b)(ii))","status":"official","rule":{"type":"mean","sourceQuestionId":"cie-igcse-cs-p6-q1bii","fixedValues":[8.7,8.5],"decimalPlaces":1,"tolerance":0.05,"accepted":["8.9"]}}'::jsonb, null, 1, 4),
  ('cie-igcse-cs-p6-q1biv', 'cie-igcse-combined-science-paper-6-alternative-to-practical', 'Biology Questions 1-2', '(b)(iv) Suggest why the student repeats the experiment.',
   '{"source":"mathMultiPart","id":"cie-igcse-cs-p6-q1biv","points":1,"display":"Minimise random error by averaging, or identify anomalous results","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["minimise","random","error"],["reduce","random","error"],["identify","anomal"],["spot","anomal"],["average","reliable"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 1, 5),
  ('cie-igcse-cs-p6-q2', 'cie-igcse-combined-science-paper-6-alternative-to-practical', 'Biology Questions 1-2', 'Plan an investigation to determine the relationship between light intensity and the volume of oxygen gas produced by an aquatic plant.',
   '{"source":"mathMultiPart","id":"cie-igcse-cs-p6-q2","points":7,"display":"One valid point from each category, then two additional distinct points","status":"official","scoringStrategy":"investigationPlan","parts":[
     {"id":"apparatus","accepted":[],"keywords":[["lamp"],["light","source"],["led"]],"points":1,"normalizer":"keywords","reviewRecommended":false,"category":"apparatus"},
     {"id":"apparatus","accepted":[],"keywords":[["gas","syringe"],["measuring","cylinder"]],"points":1,"normalizer":"keywords","reviewRecommended":false,"category":"apparatus"},
     {"id":"apparatus","accepted":[],"keywords":[["stopwatch"],["timer"],["ruler"],["light","meter"]],"points":1,"normalizer":"keywords","reviewRecommended":false,"category":"apparatus"},
     {"id":"method","accepted":[],"keywords":[["plant","light","oxygen"],["place","lamp","plant"],["collect","gas"]],"points":1,"normalizer":"keywords","reviewRecommended":false,"category":"method"},
     {"id":"method","accepted":[],"keywords":[["water","electric","keep","away"],["water","electric","dry"],["hot","lamp","heat","shield"],["hot","lamp","glove"],["hot","lamp","do not touch"]],"points":1,"normalizer":"keywords","reviewRecommended":false,"category":"method"},
     {"id":"measurements","accepted":[],"keywords":[["vary","distance"],["change","distance"],["vary","brightness"],["change","brightness"],["number","lamp"],["light","intensity","record"]],"points":1,"normalizer":"keywords","reviewRecommended":false,"category":"measurements"},
     {"id":"measurements","accepted":[],"keywords":[["volume","gas"],["volume","oxygen"],["water","displacement"]],"points":1,"normalizer":"keywords","reviewRecommended":false,"category":"measurements"},
     {"id":"controls","accepted":[],"keywords":[["carbon dioxide"],["co2","concentration"]],"points":1,"normalizer":"keywords","reviewRecommended":false,"category":"controls"},
     {"id":"controls","accepted":[],"keywords":[["temperature","water"],["water","temperature"]],"points":1,"normalizer":"keywords","reviewRecommended":false,"category":"controls"},
     {"id":"controls","accepted":[],"keywords":[["wavelength"],["colour","light"],["same","plant"],["time","same"]],"points":1,"normalizer":"keywords","reviewRecommended":false,"category":"controls"},
     {"id":"processing","accepted":[],"keywords":[["volume","time"],["volume","per","second"],["rate","oxygen"]],"points":1,"normalizer":"keywords","reviewRecommended":false,"category":"processing"},
     {"id":"processing","accepted":[],"keywords":[["repeat","anomal"],["repeat","mean"],["repeat","average"]],"points":1,"normalizer":"keywords","reviewRecommended":false,"category":"processing"},
     {"id":"processing","accepted":[],"keywords":[["graph","volume","light","intensity"],["plot","volume","intensity"]],"points":1,"normalizer":"keywords","reviewRecommended":false,"category":"processing"}
   ]}'::jsonb, null, 7, 6),

  ('cie-igcse-cs-p6-q3ai', 'cie-igcse-combined-science-paper-6-alternative-to-practical', 'Chemistry Question 3', '(a)(i) Identify the gas that gives a squeaky pop with a lighted splint.',
   '{"source":"mathMultiPart","id":"cie-igcse-cs-p6-q3ai","points":1,"display":"hydrogen","status":"official","parts":[{"id":"answer","accepted":["hydrogen","h2"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 7),
  ('cie-igcse-cs-p6-q3aii', 'cie-igcse-combined-science-paper-6-alternative-to-practical', 'Chemistry Question 3', '(a)(ii) Suggest one observation that shows the reaction is faster.',
   '{"source":"mathMultiPart","id":"cie-igcse-cs-p6-q3aii","points":1,"display":"More rapid fizzing, or the solid disappears more quickly","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["fizz","more"],["bubble","faster"],["effervescence","more"],["solid","disappear","faster"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 1, 8),
  ('cie-igcse-cs-p6-q3aiii', 'cie-igcse-combined-science-paper-6-alternative-to-practical', 'Chemistry Question 3', '(a)(iii) Suggest both possible identities of the cation produced from metal F.',
   '{"source":"mathMultiPart","id":"cie-igcse-cs-p6-q3aiii","points":1,"display":"zinc ions and calcium ions","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["zinc","calcium"],["zn","ca"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 1, 9),
  ('cie-igcse-cs-p6-q3bi', 'cie-igcse-combined-science-paper-6-alternative-to-practical', 'Chemistry Question 3', '(b)(i) Record the stopwatch readings for 5 cm3 and 25 cm3 of gas.',
   '{"source":"mathMultiPart","id":"cie-igcse-cs-p6-q3bi","points":2,"display":"10 s; 57 s","status":"official","parts":[{"id":"first","accepted":["10","10 s","10 seconds"],"points":1,"normalizer":"text"},{"id":"last","accepted":["57","57 s","57 seconds"],"points":1,"normalizer":"text"}]}'::jsonb, null, 2, 10),
  ('cie-igcse-cs-p6-q3bii', 'cie-igcse-combined-science-paper-6-alternative-to-practical', 'Chemistry Question 3', '(b)(ii) State the independent variable and dependent variable.',
   '{"source":"mathMultiPart","id":"cie-igcse-cs-p6-q3bii","points":1,"display":"volume of gas collected; time taken","status":"official","parts":[{"id":"independent","accepted":[],"keywords":[["volume","gas"]],"points":1,"normalizer":"keywords","reviewRecommended":false},{"id":"dependent","accepted":[],"keywords":[["time","taken"],["time"]],"points":1,"normalizer":"keywords","reviewRecommended":false}],"scoreThresholds":[{"minCorrect":2,"points":1}]}'::jsonb, null, 1, 11),
  ('cie-igcse-cs-p6-q3biiiiv', 'cie-igcse-combined-science-paper-6-alternative-to-practical', 'Chemistry Question 3', '(b)(iii)-(iv) Plot volume of gas against time and draw a line of best fit.',
   '{"source":"practicalGraph","id":"cie-igcse-cs-p6-q3biiiiv","points":4,"display":"Correct axes, scale, five points and best-fit line","status":"official","sourceQuestionId":"cie-igcse-cs-p6-q3bi","sourceFields":{"first":"first","last":"last"},"fixedXValues":[10,22,34,46,57],"yValues":[5,10,15,20,25],"correctAxes":{"xQuantity":"time taken","xUnit":"s","yQuantity":"volume of gas collected","yUnit":"cm3"},"pointTolerance":0.025}'::jsonb, null, 4, 12),
  ('cie-igcse-cs-p6-q3bv', 'cie-igcse-combined-science-paper-6-alternative-to-practical', 'Chemistry Question 3', '(b)(v) Describe the relationship between volume of gas collected and time taken.',
   '{"source":"mathMultiPart","id":"cie-igcse-cs-p6-q3bv","points":1,"display":"As volume increases, time taken increases","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["volume","increase","time","increase"],["more","gas","longer","time"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 1, 13),
  ('cie-igcse-cs-p6-q3bvi', 'cie-igcse-combined-science-paper-6-alternative-to-practical', 'Chemistry Question 3', '(b)(vi) Suggest one source of error in measuring the time.',
   '{"source":"mathMultiPart","id":"cie-igcse-cs-p6-q3bvi","points":1,"display":"Watching volume and stopwatch together, or delay starting the stopwatch","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["look","volume","stopwatch","same","time"],["reaction","start","stopwatch","delay"],["human","reaction","time"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 1, 14),
  ('cie-igcse-cs-p6-q3bvii', 'cie-igcse-combined-science-paper-6-alternative-to-practical', 'Chemistry Question 3', '(b)(vii) Suggest one way to measure gas volume more accurately.',
   '{"source":"mathMultiPart","id":"cie-igcse-cs-p6-q3bvii","points":1,"display":"Use a gas syringe, or mix separated reactants inside the stoppered tube","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["gas","syringe"],["reactants","separate","stopper"],["mix","inside","stoppered"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 1, 15),

  ('cie-igcse-cs-p6-q4ai', 'cie-igcse-combined-science-paper-6-alternative-to-practical', 'Physics Question 4', '(a)(i) Draw a double-headed arrow to show length L and label it L.',
   '{"source":"diagramAnnotation","id":"cie-igcse-cs-p6-q4ai","variant":"doubleArrow","points":1,"display":"Double-headed length arrow labelled L","status":"official","geometry":{"variant":"doubleArrow","start":{"x":0.11,"y":0.18},"end":{"x":0.94,"y":0.18},"endpointTolerance":0.1,"labelRegion":{"minX":0.42,"maxX":0.64,"minY":0.24,"maxY":0.58},"label":"L"}}'::jsonb, null, 1, 16),
  ('cie-igcse-cs-p6-q4aii', 'cie-igcse-combined-science-paper-6-alternative-to-practical', 'Physics Question 4', '(a)(ii) Measure width w and thickness t to the nearest 0.1 cm.',
   '{"source":"virtualMeasurement","id":"cie-igcse-cs-p6-q4aii","points":2,"display":"w = 2.5 cm; t = 0.5 cm","status":"official","measurements":[{"id":"w","expected":2.5,"tolerance":0.15,"calibration":3.5,"unit":"cm"},{"id":"t","expected":0.5,"tolerance":0.1,"calibration":1.1,"unit":"cm"}]}'::jsonb, null, 2, 17),
  ('cie-igcse-cs-p6-q4aiii', 'cie-igcse-combined-science-paper-6-alternative-to-practical', 'Physics Question 4', '(a)(iii) State why measurements should not be recorded to the nearest 0.01 cm.',
   '{"source":"mathMultiPart","id":"cie-igcse-cs-p6-q4aiii","points":1,"display":"The ruler has a precision or smallest division of 0.1 cm","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["ruler","precision","0.1"],["smallest","division","0.1"],["millimetre","division"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 1, 18),
  ('cie-igcse-cs-p6-q4aiv', 'cie-igcse-combined-science-paper-6-alternative-to-practical', 'Physics Question 4', '(a)(iv) Calculate volume V = L x w x t.',
   '{"source":"dependent","id":"cie-igcse-cs-p6-q4aiv","points":1,"display":"125 cm3 (ECF)","status":"official","rule":{"type":"product","factors":[{"value":100},{"sourceQuestionId":"cie-igcse-cs-p6-q4aii","measurementId":"w","measurementCalibration":3.5},{"sourceQuestionId":"cie-igcse-cs-p6-q4aii","measurementId":"t","measurementCalibration":1.1}],"tolerance":0.6}}'::jsonb, null, 1, 19),
  ('cie-igcse-cs-p6-q4bi', 'cie-igcse-combined-science-paper-6-alternative-to-practical', 'Physics Question 4', '(b)(i) Calculate distance x1.',
   '{"source":"mathMultiPart","id":"cie-igcse-cs-p6-q4bi","points":1,"display":"7.1 cm","status":"official","parts":[{"id":"answer","accepted":["7.1","7.1 cm"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 20),
  ('cie-igcse-cs-p6-q4bii', 'cie-igcse-combined-science-paper-6-alternative-to-practical', 'Physics Question 4', '(b)(ii) Calculate distance x2.',
   '{"source":"mathMultiPart","id":"cie-igcse-cs-p6-q4bii","points":1,"display":"14.2 cm","status":"official","parts":[{"id":"answer","accepted":["14.2","14.2 cm"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 21),
  ('cie-igcse-cs-p6-q4biii', 'cie-igcse-combined-science-paper-6-alternative-to-practical', 'Physics Question 4', '(b)(iii) Calculate mass M = 5(x1 + x2).',
   '{"source":"dependent","id":"cie-igcse-cs-p6-q4biii","points":1,"display":"106.5 g (106, 107 and 110 accepted; ECF)","status":"official","rule":{"type":"scaledSum","sourceQuestionIds":["cie-igcse-cs-p6-q4bi","cie-igcse-cs-p6-q4bii"],"multiplier":5,"tolerance":0.6,"accepted":["106","107","110"]}}'::jsonb, null, 1, 22),
  ('cie-igcse-cs-p6-q4ci', 'cie-igcse-combined-science-paper-6-alternative-to-practical', 'Physics Question 4', '(c)(i) Name the apparatus shown in Fig. 4.4.',
   '{"source":"mathMultiPart","id":"cie-igcse-cs-p6-q4ci","points":1,"display":"electronic balance / top-pan balance","status":"official","parts":[{"id":"answer","accepted":["balance","electronic balance","top pan balance","top-pan balance"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 23),
  ('cie-igcse-cs-p6-q4cii', 'cie-igcse-combined-science-paper-6-alternative-to-practical', 'Physics Question 4', '(c)(ii) State the type of error shown.',
   '{"source":"mathMultiPart","id":"cie-igcse-cs-p6-q4cii","points":1,"display":"zero / systematic / calibration error","status":"official","parts":[{"id":"answer","accepted":["zero error","systematic error","calibration error","zero","systematic","calibration"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 24),
  ('cie-igcse-cs-p6-q4d', 'cie-igcse-combined-science-paper-6-alternative-to-practical', 'Physics Question 4', '(d) Calculate density to two significant figures and give the unit.',
   '{"source":"dependent","id":"cie-igcse-cs-p6-q4d","points":3,"display":"0.85 g/cm3 (ECF)","status":"official","rule":{"type":"density","massQuestionId":"cie-igcse-cs-p6-q4biii","volumeQuestionId":"cie-igcse-cs-p6-q4aiv","valueField":"value","unitField":"unit","significantFigures":2,"unitAccepted":["g/cm3","g cm-3","g/cm³","g cm⁻³"],"tolerance":0.005}}'::jsonb, null, 3, 25)
on conflict (id) do update set
  test_id = excluded.test_id,
  part = excluded.part,
  prompt = excluded.prompt,
  answer_key = excluded.answer_key,
  transcript_ref = excluded.transcript_ref,
  points = excluded.points,
  position = excluded.position;

delete from public.test_questions
where test_id = 'cie-igcse-combined-science-paper-6-alternative-to-practical'
  and id not in (
    'cie-igcse-cs-p6-q1a', 'cie-igcse-cs-p6-q1bi', 'cie-igcse-cs-p6-q1bii', 'cie-igcse-cs-p6-q1biii', 'cie-igcse-cs-p6-q1biv', 'cie-igcse-cs-p6-q2',
    'cie-igcse-cs-p6-q3ai', 'cie-igcse-cs-p6-q3aii', 'cie-igcse-cs-p6-q3aiii', 'cie-igcse-cs-p6-q3bi', 'cie-igcse-cs-p6-q3bii', 'cie-igcse-cs-p6-q3biiiiv', 'cie-igcse-cs-p6-q3bv', 'cie-igcse-cs-p6-q3bvi', 'cie-igcse-cs-p6-q3bvii',
    'cie-igcse-cs-p6-q4ai', 'cie-igcse-cs-p6-q4aii', 'cie-igcse-cs-p6-q4aiii', 'cie-igcse-cs-p6-q4aiv', 'cie-igcse-cs-p6-q4bi', 'cie-igcse-cs-p6-q4bii', 'cie-igcse-cs-p6-q4biii', 'cie-igcse-cs-p6-q4ci', 'cie-igcse-cs-p6-q4cii', 'cie-igcse-cs-p6-q4d'
  );

create or replace function p6_answer_number(p_answers jsonb, p_question_id text, p_field text default 'answer')
returns numeric
language plpgsql
immutable
as $$
declare
  value_json jsonb := p_answers->p_question_id;
  value_text text;
  numeric_text text;
begin
  if value_json is null then return null; end if;
  if jsonb_typeof(value_json) = 'string' then
    value_text := value_json #>> '{}';
  else
    value_text := value_json->>p_field;
  end if;
  numeric_text := substring(replace(coalesce(value_text, ''), ',', '') from '-?[0-9]+[.]?[0-9]*');
  if numeric_text is null or numeric_text = '' then return null; end if;
  return numeric_text::numeric;
exception when invalid_text_representation then
  return null;
end;
$$;

create or replace function p6_measurement_value(p_answers jsonb, p_question_id text, p_measurement_id text, p_calibration numeric)
returns numeric
language plpgsql
immutable
as $$
declare
  response jsonb := coalesce(p_answers->p_question_id, '{}'::jsonb);
  start_x numeric := ray_coordinate(response->>(p_measurement_id || 'Start'), 1);
  start_y numeric := ray_coordinate(response->>(p_measurement_id || 'Start'), 2);
  end_x numeric := ray_coordinate(response->>(p_measurement_id || 'End'), 1);
  end_y numeric := ray_coordinate(response->>(p_measurement_id || 'End'), 2);
begin
  if start_x is null or start_y is null or end_x is null or end_y is null then return null; end if;
  return sqrt(power(start_x - end_x, 2) + power(start_y - end_y, 2)) * p_calibration;
end;
$$;

create or replace function p6_dependent_details(p_question_id text, p_answer_key jsonb, p_answers jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  rule jsonb := p_answer_key->'rule';
  rule_type text := rule->>'type';
  response jsonb := coalesce(p_answers->p_question_id, '""'::jsonb);
  response_value numeric := p6_answer_number(p_answers, p_question_id, case when rule_type = 'density' then rule->>'valueField' else 'answer' end);
  expected numeric;
  source_value numeric;
  factor jsonb;
  source_id_text text;
  factor_value numeric;
  possible numeric := question_points(p_answer_key);
  tolerance numeric := coalesce((rule->>'tolerance')::numeric, 0.05);
  is_correct boolean := false;
  sum_value numeric := 0;
  unit_text text;
  unit_correct boolean := false;
  significant_correct boolean := false;
  calculation_correct boolean := false;
  rounded_expected numeric;
  significant_count integer := 0;
  clean_digits text;
begin
  if rule_type = 'subtractFrom' then
    source_value := p6_answer_number(p_answers, rule->>'sourceQuestionId', coalesce(rule->>'sourceField', 'answer'));
    if source_value is not null then expected := (rule->>'minuend')::numeric - source_value; end if;
  elsif rule_type = 'mean' then
    source_value := p6_answer_number(p_answers, rule->>'sourceQuestionId', coalesce(rule->>'sourceField', 'answer'));
    if source_value is not null then
      select (coalesce(sum(value::numeric), 0) + source_value) / (count(*) + 1)
      into expected
      from jsonb_array_elements_text(rule->'fixedValues') as fixed(value);
      if rule ? 'decimalPlaces' then expected := round(expected, (rule->>'decimalPlaces')::integer); end if;
    end if;
  elsif rule_type = 'product' then
    expected := 1;
    for factor in select value from jsonb_array_elements(rule->'factors')
    loop
      if factor ? 'value' then
        factor_value := (factor->>'value')::numeric;
      elsif factor ? 'measurementId' then
        factor_value := p6_measurement_value(
          p_answers,
          factor->>'sourceQuestionId',
          factor->>'measurementId',
          coalesce((factor->>'measurementCalibration')::numeric, 1)
        );
      else
        factor_value := p6_answer_number(p_answers, factor->>'sourceQuestionId', coalesce(factor->>'sourceField', 'answer'));
      end if;
      if factor_value is null then expected := null; exit; end if;
      expected := expected * factor_value;
    end loop;
  elsif rule_type = 'scaledSum' then
    for source_id_text in select value from jsonb_array_elements_text(rule->'sourceQuestionIds')
    loop
      factor_value := p6_answer_number(p_answers, source_id_text, 'answer');
      if factor_value is null then expected := null; exit; end if;
      sum_value := sum_value + factor_value;
      expected := sum_value * (rule->>'multiplier')::numeric;
    end loop;
  elsif rule_type = 'density' then
    source_value := p6_answer_number(p_answers, rule->>'massQuestionId', 'answer');
    factor_value := p6_answer_number(p_answers, rule->>'volumeQuestionId', 'answer');
    if source_value is not null and factor_value is not null and factor_value <> 0 then expected := source_value / factor_value; end if;
    if expected is not null then
      rounded_expected := round(expected, (rule->>'significantFigures')::integer - ceil(log(10, abs(expected)))::integer);
    end if;
    calculation_correct := response_value is not null and expected is not null and (
      abs(response_value - expected) <= tolerance or abs(response_value - rounded_expected) <= tolerance
    );
    clean_digits := regexp_replace(coalesce(response->>(rule->>'valueField'), ''), '[^0-9.]', '', 'g');
    clean_digits := regexp_replace(clean_digits, '^0*[.]?0*', '');
    significant_count := length(replace(clean_digits, '.', ''));
    significant_correct := response_value is not null and rounded_expected is not null and
      abs(response_value - rounded_expected) <= tolerance and significant_count = (rule->>'significantFigures')::integer;
    unit_text := coalesce(response->>(rule->>'unitField'), '');
    unit_correct := exists (
      select 1 from jsonb_array_elements_text(rule->'unitAccepted') accepted(value)
      where normalize_math_answer(value, 'text') = normalize_math_answer(unit_text, 'text')
    );
    return jsonb_build_object('parts', jsonb_build_array(
      jsonb_build_object('id', 'calculation', 'score', case when calculation_correct then 1 else 0 end, 'possible', 1, 'correct', calculation_correct, 'expected', expected),
      jsonb_build_object('id', 'significant-figures', 'score', case when significant_correct then 1 else 0 end, 'possible', 1, 'correct', significant_correct, 'expected', rounded_expected),
      jsonb_build_object('id', 'unit', 'score', case when unit_correct then 1 else 0 end, 'possible', 1, 'correct', unit_correct, 'response', unit_text)
    ));
  end if;

  is_correct := response_value is not null and expected is not null and abs(response_value - expected) <= tolerance;
  if not is_correct and rule ? 'accepted' then
    is_correct := exists (
      select 1 from jsonb_array_elements_text(rule->'accepted') accepted(value)
      where normalize_math_answer(value, 'text') = normalize_math_answer(
        case when jsonb_typeof(response) = 'string' then response #>> '{}' else response->>'answer' end,
        'text'
      )
    );
  end if;
  return jsonb_build_object('parts', jsonb_build_array(
    jsonb_build_object('id', 'answer', 'score', case when is_correct then possible else 0 end, 'possible', possible, 'correct', is_correct, 'expected', expected, 'ecf', expected is not null)
  ));
end;
$$;

create or replace function p6_virtual_measurement_details(p_question_id text, p_answer_key jsonb, p_answers jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  measurement jsonb;
  measured numeric;
  is_correct boolean;
  items jsonb := '[]'::jsonb;
begin
  for measurement in select value from jsonb_array_elements(p_answer_key->'measurements')
  loop
    measured := p6_measurement_value(p_answers, p_question_id, measurement->>'id', (measurement->>'calibration')::numeric);
    is_correct := measured is not null and abs(measured - (measurement->>'expected')::numeric) <= (measurement->>'tolerance')::numeric;
    items := items || jsonb_build_array(jsonb_build_object(
      'id', measurement->>'id', 'score', case when is_correct then 1 else 0 end, 'possible', 1,
      'correct', is_correct, 'measured', measured, 'expected', (measurement->>'expected')::numeric, 'unit', measurement->>'unit'
    ));
  end loop;
  return jsonb_build_object('parts', items);
end;
$$;

create or replace function p6_double_arrow_details(p_question_id text, p_answer_key jsonb, p_answers jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  response jsonb := coalesce(p_answers->p_question_id, '{}'::jsonb);
  geometry jsonb := p_answer_key->'geometry';
  sx numeric := ray_coordinate(response->>'start', 1);
  sy numeric := ray_coordinate(response->>'start', 2);
  ex numeric := ray_coordinate(response->>'end', 1);
  ey numeric := ray_coordinate(response->>'end', 2);
  lx numeric := ray_coordinate(response->>'label', 1);
  ly numeric := ray_coordinate(response->>'label', 2);
  tolerance numeric := (geometry->>'endpointTolerance')::numeric;
  endpoints_correct boolean;
  label_correct boolean;
  is_correct boolean;
begin
  endpoints_correct := sx is not null and sy is not null and ex is not null and ey is not null and (
    (
      sqrt(power(sx - (geometry->'start'->>'x')::numeric, 2) + power(sy - (geometry->'start'->>'y')::numeric, 2)) <= tolerance and
      sqrt(power(ex - (geometry->'end'->>'x')::numeric, 2) + power(ey - (geometry->'end'->>'y')::numeric, 2)) <= tolerance
    ) or (
      sqrt(power(sx - (geometry->'end'->>'x')::numeric, 2) + power(sy - (geometry->'end'->>'y')::numeric, 2)) <= tolerance and
      sqrt(power(ex - (geometry->'start'->>'x')::numeric, 2) + power(ey - (geometry->'start'->>'y')::numeric, 2)) <= tolerance
    )
  );
  label_correct := lx is not null and ly is not null and
    lx between (geometry->'labelRegion'->>'minX')::numeric and (geometry->'labelRegion'->>'maxX')::numeric and
    ly between (geometry->'labelRegion'->>'minY')::numeric and (geometry->'labelRegion'->>'maxY')::numeric;
  is_correct := endpoints_correct and label_correct;
  return jsonb_build_object('parts', jsonb_build_array(jsonb_build_object(
    'id', 'doubleArrow', 'score', case when is_correct then 1 else 0 end, 'possible', 1, 'correct', is_correct,
    'endpointsCorrect', endpoints_correct, 'labelCorrect', label_correct
  )));
end;
$$;

create or replace function p6_practical_graph_details(p_question_id text, p_answer_key jsonb, p_answers jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  response jsonb := coalesce(p_answers->p_question_id, '{}'::jsonb);
  source_id text := p_answer_key->>'sourceQuestionId';
  x_max numeric := nullif(response->>'xMax', '')::numeric;
  y_max numeric := nullif(response->>'yMax', '')::numeric;
  first_x numeric := p6_answer_number(p_answers, source_id, p_answer_key->'sourceFields'->>'first');
  last_x numeric := p6_answer_number(p_answers, source_id, p_answer_key->'sourceFields'->>'last');
  x_values numeric[] := array[]::numeric[];
  y_values numeric[] := array[]::numeric[];
  i integer;
  expected_x numeric;
  expected_y numeric;
  entered_x numeric;
  entered_y numeric;
  axes_correct boolean;
  scale_correct boolean;
  points_correct boolean := true;
  line_correct boolean := false;
  line_start_x numeric := ray_coordinate(response->>'lineStart', 1);
  line_start_y numeric := ray_coordinate(response->>'lineStart', 2);
  line_end_x numeric := ray_coordinate(response->>'lineEnd', 1);
  line_end_y numeric := ray_coordinate(response->>'lineEnd', 2);
  first_expected_x numeric;
  first_expected_y numeric;
  last_expected_x numeric;
  last_expected_y numeric;
  tolerance numeric := (p_answer_key->>'pointTolerance')::numeric;
begin
  select array_agg(value::numeric order by ordinality) into x_values
  from jsonb_array_elements_text(p_answer_key->'fixedXValues') with ordinality fixed(value, ordinality);
  select array_agg(value::numeric order by ordinality) into y_values
  from jsonb_array_elements_text(p_answer_key->'yValues') with ordinality fixed(value, ordinality);
  if first_x is not null then x_values[1] := first_x; end if;
  if last_x is not null then x_values[array_length(x_values, 1)] := last_x; end if;

  axes_correct :=
    normalize_math_answer(response->>'xQuantity', 'text') = normalize_math_answer(p_answer_key->'correctAxes'->>'xQuantity', 'text') and
    normalize_math_answer(response->>'xUnit', 'text') = normalize_math_answer(p_answer_key->'correctAxes'->>'xUnit', 'text') and
    normalize_math_answer(response->>'yQuantity', 'text') = normalize_math_answer(p_answer_key->'correctAxes'->>'yQuantity', 'text') and
    normalize_math_answer(response->>'yUnit', 'text') = normalize_math_answer(p_answer_key->'correctAxes'->>'yUnit', 'text');
  scale_correct := x_max is not null and y_max is not null and
    x_max >= (select max(value) from unnest(x_values) values(value)) and
    y_max >= (select max(value) from unnest(y_values) values(value)) and
    (select max(value) from unnest(x_values) values(value)) / x_max > 0.5 and
    (select max(value) from unnest(y_values) values(value)) / y_max > 0.5;

  if not scale_correct then points_correct := false; end if;
  for i in 1..array_length(x_values, 1)
  loop
    expected_x := 0.13 + (x_values[i] / x_max) * (0.95 - 0.13);
    expected_y := 0.87 - (y_values[i] / y_max) * (0.87 - 0.07);
    entered_x := ray_coordinate(response->>('p' || (i - 1)), 1);
    entered_y := ray_coordinate(response->>('p' || (i - 1)), 2);
    if entered_x is null or entered_y is null or sqrt(power(entered_x - expected_x, 2) + power(entered_y - expected_y, 2)) > tolerance then
      points_correct := false;
    end if;
    if i = 1 then first_expected_x := expected_x; first_expected_y := expected_y; end if;
    if i = array_length(x_values, 1) then last_expected_x := expected_x; last_expected_y := expected_y; end if;
  end loop;
  line_correct := points_correct and line_start_x is not null and line_start_y is not null and line_end_x is not null and line_end_y is not null and
    line_start_x < line_end_x and line_start_y > line_end_y and
    annotation_segment_distance(first_expected_x, first_expected_y, line_start_x, line_start_y, line_end_x, line_end_y) <= 0.055 and
    annotation_segment_distance(last_expected_x, last_expected_y, line_start_x, line_start_y, line_end_x, line_end_y) <= 0.055;
  return jsonb_build_object('parts', jsonb_build_array(
    jsonb_build_object('id', 'axes', 'score', case when axes_correct then 1 else 0 end, 'possible', 1, 'correct', axes_correct),
    jsonb_build_object('id', 'scale', 'score', case when scale_correct then 1 else 0 end, 'possible', 1, 'correct', scale_correct),
    jsonb_build_object('id', 'plots', 'score', case when points_correct then 1 else 0 end, 'possible', 1, 'correct', points_correct, 'ecfTimes', to_jsonb(x_values)),
    jsonb_build_object('id', 'best-fit-line', 'score', case when line_correct then 1 else 0 end, 'possible', 1, 'correct', line_correct)
  ));
exception when invalid_text_representation or division_by_zero then
  return jsonb_build_object('parts', jsonb_build_array(
    jsonb_build_object('id', 'axes', 'score', 0, 'possible', 1, 'correct', false),
    jsonb_build_object('id', 'scale', 'score', 0, 'possible', 1, 'correct', false),
    jsonb_build_object('id', 'plots', 'score', 0, 'possible', 1, 'correct', false),
    jsonb_build_object('id', 'best-fit-line', 'score', 0, 'possible', 1, 'correct', false)
  ));
end;
$$;

create or replace function p6_biological_drawing_details(p_question_id text, p_answer_key jsonb, p_answers jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  response jsonb := coalesce(p_answers->p_question_id, '{}'::jsonb);
  stroke_text text;
  mode text;
  point_text text;
  point_count integer;
  total_points integer := 0;
  outline_count integer := 0;
  core_count integer := 0;
  pip_count integer := 0;
  min_x numeric;
  max_x numeric;
  min_y numeric;
  max_y numeric;
  area numeric;
  largest_area numeric := 0;
  largest_points integer := 0;
  largest_closed boolean := false;
  largest_smoothness numeric := 999;
  cx numeric;
  cy numeric;
  radius numeric;
  path_length numeric;
  sector integer;
  core_sectors integer[] := array[]::integer[];
  size_correct boolean;
  quality_correct boolean;
  detail_correct boolean;
begin
  for stroke_text in select value from jsonb_array_elements_text(coalesce(response->'strokes', '[]'::jsonb)) strokes(value)
  loop
    mode := split_part(stroke_text, ':', 1);
    select count(*), min(ray_coordinate(value, 1)), max(ray_coordinate(value, 1)), min(ray_coordinate(value, 2)), max(ray_coordinate(value, 2)),
           avg(ray_coordinate(value, 1)), avg(ray_coordinate(value, 2))
    into point_count, min_x, max_x, min_y, max_y, cx, cy
    from string_to_table(split_part(stroke_text, ':', 2), ';') points(value)
    where ray_coordinate(value, 1) is not null and ray_coordinate(value, 2) is not null;
    total_points := total_points + point_count;
    if mode = 'outline' then
      outline_count := outline_count + 1;
      area := coalesce((max_x - min_x) * (max_y - min_y), 0);
      if area > largest_area then
        largest_area := area;
        largest_points := point_count;
        largest_closed := sqrt(
          power(ray_coordinate(split_part(split_part(stroke_text, ':', 2), ';', 1), 1) - ray_coordinate(reverse(split_part(reverse(split_part(stroke_text, ':', 2)), ';', 1)), 1), 2) +
          power(ray_coordinate(split_part(split_part(stroke_text, ':', 2), ';', 1), 2) - ray_coordinate(reverse(split_part(reverse(split_part(stroke_text, ':', 2)), ';', 1)), 2), 2)
        ) <= 0.09;
        select coalesce(sum(sqrt(power(x - prior_x, 2) + power(y - prior_y, 2))), 0), avg(sqrt(power(x - cx, 2) + power(y - cy, 2)))
        into path_length, radius
        from (
          select ray_coordinate(value, 1) x, ray_coordinate(value, 2) y,
                 lag(ray_coordinate(value, 1)) over (order by ordinality) prior_x,
                 lag(ray_coordinate(value, 2)) over (order by ordinality) prior_y
          from string_to_table(split_part(stroke_text, ':', 2), ';') with ordinality points(value, ordinality)
        ) path;
        largest_smoothness := case when radius > 0 then path_length / (2 * pi() * radius) else 999 end;
      end if;
    elsif mode = 'core' then
      core_count := core_count + 1;
      sector := mod(floor(((atan2((cy - 0.5)::double precision, (cx - 0.5)::double precision) + pi()) / (2 * pi())) * 5)::integer, 5);
      if not sector = any(core_sectors) then core_sectors := array_append(core_sectors, sector); end if;
    elsif mode = 'pip' then
      pip_count := pip_count + 1;
    end if;
  end loop;
  size_correct := largest_area > 0.5;
  quality_correct := largest_points >= 18 and largest_closed and largest_smoothness <= 2.7 and outline_count <= 3 and total_points <= 900;
  detail_correct := core_count >= 5 and pip_count >= 2 and coalesce(array_length(core_sectors, 1), 0) >= 4;
  return jsonb_build_object('parts', jsonb_build_array(
    jsonb_build_object('id', 'size', 'score', case when size_correct then 1 else 0 end, 'possible', 1, 'correct', size_correct, 'occupiesMoreThanHalf', size_correct),
    jsonb_build_object('id', 'quality', 'score', case when quality_correct then 1 else 0 end, 'possible', 1, 'correct', quality_correct, 'outlineClosed', largest_closed, 'outlineSmooth', largest_smoothness <= 2.7, 'noDenseShading', outline_count <= 3 and total_points <= 900),
    jsonb_build_object('id', 'detail', 'score', case when detail_correct then 1 else 0 end, 'possible', 1, 'correct', detail_correct, 'coreSections', core_count, 'pipDetails', pip_count)
  ));
end;
$$;

create or replace function answer_response(p_answer_key jsonb, p_answers jsonb)
returns text
language plpgsql
stable
as $$
declare
  source_name text := p_answer_key->>'source';
begin
  if source_name = 'questionMap' then return coalesce(p_answers->>(p_answer_key->>'id'), '');
  elsif source_name in ('aiGrade', 'aiSplitGrade') then return coalesce(p_answers->>(p_answer_key->>'id'), '');
  elsif source_name in ('mathMultiPart', 'rayDiagram', 'diagramAnnotation', 'biologicalDrawing', 'practicalGraph', 'virtualMeasurement', 'dependent') then
    return coalesce((p_answers->(p_answer_key->>'id'))::text, '');
  elsif source_name = 'connections' then return coalesce(p_answers->'connections'->>(p_answer_key->>'object'), '');
  elsif source_name = 'textAnswers' then return coalesce(p_answers->'textAnswers'->>(p_answer_key->>'id'), '');
  elsif source_name = 'choices' then return coalesce(p_answers->'choices'->>(p_answer_key->>'id'), '');
  elsif source_name = 'colours' then return coalesce(p_answers->'colours'->>(p_answer_key->>'region'), '');
  elsif source_name = 'rwAnswers' then return coalesce(p_answers->'rwAnswers'->>(p_answer_key->>'id'), '');
  end if;
  return '';
end;
$$;

create or replace function answer_score(p_question_id text, p_answer_key jsonb, p_response text, p_answers jsonb default '{}'::jsonb)
returns numeric
language plpgsql
stable
as $$
declare
  source_name text := p_answer_key->>'source';
  possible numeric := question_points(p_answer_key);
  raw_score numeric := 0;
  details jsonb;
  correct_count integer := 0;
  category_count integer := 0;
begin
  if source_name = 'questionMap' then
    return case when normalize_answer(p_response) in (select normalize_answer(value) from jsonb_array_elements_text(p_answer_key->'accepted') accepted(value)) then possible else 0 end;
  elsif source_name in ('aiGrade', 'aiSplitGrade') then
    return least(greatest(coalesce((p_answers->'aiGrades'->p_question_id->>'score')::numeric, 0), 0), possible);
  elsif source_name = 'mathMultiPart' then
    details := math_part_scores(p_question_id, p_answer_key, p_answers);
    if p_answer_key->>'scoringStrategy' = 'investigationPlan' then
      select count(distinct key_part.value->>'category'), count(*)
      into category_count, correct_count
      from jsonb_array_elements(p_answer_key->'parts') with ordinality key_part(value, ordinality)
      join jsonb_array_elements(details->'parts') with ordinality scored(value, ordinality) using (ordinality)
      where coalesce((scored.value->>'correct')::boolean, false);
      raw_score := case when category_count < 5 then category_count else 5 + least(2, greatest(0, correct_count - 5)) end;
      return least(raw_score, possible);
    elsif p_answer_key ? 'scoreThresholds' then
      select count(*) into correct_count from jsonb_array_elements(details->'parts') parts(value) where coalesce((value->>'correct')::boolean, false);
      select coalesce(max((value->>'points')::numeric), 0) into raw_score
      from jsonb_array_elements(p_answer_key->'scoreThresholds') thresholds(value)
      where correct_count >= coalesce((value->>'minCorrect')::integer, 0);
      return least(raw_score, possible);
    end if;
  elsif source_name = 'rayDiagram' then details := ray_diagram_details(p_question_id, p_answer_key, p_answers);
  elsif source_name = 'diagramAnnotation' then
    details := case when p_answer_key->>'variant' = 'doubleArrow'
      then p6_double_arrow_details(p_question_id, p_answer_key, p_answers)
      else diagram_annotation_details(p_question_id, p_answer_key, p_answers) end;
  elsif source_name = 'biologicalDrawing' then details := p6_biological_drawing_details(p_question_id, p_answer_key, p_answers);
  elsif source_name = 'practicalGraph' then details := p6_practical_graph_details(p_question_id, p_answer_key, p_answers);
  elsif source_name = 'virtualMeasurement' then details := p6_virtual_measurement_details(p_question_id, p_answer_key, p_answers);
  elsif source_name = 'dependent' then details := p6_dependent_details(p_question_id, p_answer_key, p_answers);
  elsif source_name = 'connections' then return case when p_response = p_answer_key->>'target' then possible else 0 end;
  elsif source_name in ('textAnswers', 'rwAnswers') then
    return case when normalize_answer(p_response) in (select normalize_answer(value) from jsonb_array_elements_text(p_answer_key->'accepted') accepted(value)) then possible else 0 end;
  elsif source_name = 'choices' then return case when p_response = p_answer_key->>'correct' then possible else 0 end;
  elsif source_name = 'colours' then return case when lower(p_response) = lower(p_answer_key->>'colour') then possible else 0 end;
  else return 0;
  end if;
  select coalesce(sum((value->>'score')::numeric), 0) into raw_score from jsonb_array_elements(coalesce(details->'parts', '[]'::jsonb)) parts(value);
  return least(greatest(raw_score, 0), possible);
end;
$$;

create or replace function grading_details(p_question_id text, p_answer_key jsonb, p_answers jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
as $$
begin
  if p_answer_key->>'source' in ('aiGrade', 'aiSplitGrade') then return coalesce(p_answers->'aiGrades'->p_question_id, '{}'::jsonb);
  elsif p_answer_key->>'source' = 'mathMultiPart' then return math_part_scores(p_question_id, p_answer_key, p_answers);
  elsif p_answer_key->>'source' = 'rayDiagram' then return ray_diagram_details(p_question_id, p_answer_key, p_answers);
  elsif p_answer_key->>'source' = 'diagramAnnotation' then
    return case when p_answer_key->>'variant' = 'doubleArrow'
      then p6_double_arrow_details(p_question_id, p_answer_key, p_answers)
      else diagram_annotation_details(p_question_id, p_answer_key, p_answers) end;
  elsif p_answer_key->>'source' = 'biologicalDrawing' then return p6_biological_drawing_details(p_question_id, p_answer_key, p_answers);
  elsif p_answer_key->>'source' = 'practicalGraph' then return p6_practical_graph_details(p_question_id, p_answer_key, p_answers);
  elsif p_answer_key->>'source' = 'virtualMeasurement' then return p6_virtual_measurement_details(p_question_id, p_answer_key, p_answers);
  elsif p_answer_key->>'source' = 'dependent' then return p6_dependent_details(p_question_id, p_answer_key, p_answers);
  end if;
  return '{}'::jsonb;
end;
$$;

create or replace function response_display(p_question_id text, p_answer_key jsonb, p_response text)
returns text
language plpgsql
stable
as $$
declare
  response_json jsonb;
  part_key jsonb;
  part_id text;
  raw_json jsonb;
  raw_text text;
  items text[] := array[]::text[];
begin
  if p_response is null or p_response = '' then return 'No answer'; end if;
  if p_answer_key->>'source' in ('mathMultiPart', 'dependent') then
    response_json := p_response::jsonb;
    if response_json = '{}'::jsonb then return 'No answer'; end if;
    if jsonb_typeof(response_json) = 'string' then return coalesce(response_json #>> '{}', 'No answer'); end if;
    for part_key in select value from jsonb_array_elements(coalesce(p_answer_key->'parts', '[]'::jsonb))
    loop
      part_id := part_key->>'id';
      raw_json := response_json->part_id;
      if raw_json is null then raw_text := '';
      elsif jsonb_typeof(raw_json) = 'array' then select coalesce(string_agg(value, ', '), '') into raw_text from jsonb_array_elements_text(raw_json) response(value);
      else raw_text := response_json->>part_id;
      end if;
      if coalesce(raw_text, '') <> '' then items := array_append(items, part_id || ': ' || raw_text); end if;
    end loop;
    if array_length(items, 1) is null then
      select coalesce(string_agg(key || ': ' || value #>> '{}', '; '), 'No answer') into raw_text from jsonb_each(response_json);
      return raw_text;
    end if;
    return array_to_string(items, '; ');
  elsif p_answer_key->>'source' in ('rayDiagram', 'diagramAnnotation', 'biologicalDrawing', 'practicalGraph', 'virtualMeasurement') then
    response_json := p_response::jsonb;
    if response_json = '{}'::jsonb then return 'No answer'; end if;
    return case p_answer_key->>'source'
      when 'biologicalDrawing' then 'Biological drawing recorded'
      when 'practicalGraph' then 'Graph response recorded'
      when 'virtualMeasurement' then 'Virtual measurements recorded'
      else initcap(coalesce(p_answer_key->>'variant', 'diagram')) || ' annotation recorded'
    end;
  elsif p_answer_key->>'source' = 'choices' then return upper(p_response);
  end if;
  return p_response;
end;
$$;
