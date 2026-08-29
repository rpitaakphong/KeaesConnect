begin;

create or replace function public.response_display(
  p_question_id text,
  p_answer_key jsonb,
  p_response text
)
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
  if p_response is null or p_response = '' then
    return 'No answer';
  end if;

  if p_answer_key->>'source' in ('mathMultiPart', 'conceptGroups', 'dependent') then
    response_json := p_response::jsonb;
    if response_json = '{}'::jsonb then
      return 'No answer';
    end if;
    if jsonb_typeof(response_json) = 'string' then
      return coalesce(response_json #>> '{}', 'No answer');
    end if;

    for part_key in
      select value
      from jsonb_array_elements(coalesce(p_answer_key->'parts', p_answer_key->'fields', '[]'::jsonb))
    loop
      part_id := case
        when jsonb_typeof(part_key) = 'string' then part_key #>> '{}'
        else part_key->>'id'
      end;
      raw_json := response_json->part_id;
      if raw_json is null then
        raw_text := '';
      elsif jsonb_typeof(raw_json) = 'array' then
        select coalesce(string_agg(value, ', '), '')
        into raw_text
        from jsonb_array_elements_text(raw_json) response(value);
      else
        raw_text := response_json->>part_id;
      end if;
      if coalesce(raw_text, '') <> '' then
        items := array_append(items, part_id || ': ' || raw_text);
      end if;
    end loop;

    if array_length(items, 1) is null then
      select coalesce(string_agg(key || ': ' || (value #>> '{}'), '; '), 'No answer')
      into raw_text
      from jsonb_each(response_json);
      return raw_text;
    end if;
    return array_to_string(items, '; ');
  elsif p_answer_key->>'source' in (
    'rayDiagram',
    'diagramAnnotation',
    'geometryConstruction',
    'biologicalDrawing',
    'practicalGraph',
    'virtualMeasurement',
    'tallyTable',
    'histogram'
  ) then
    response_json := p_response::jsonb;
    if response_json = '{}'::jsonb then
      return 'No answer';
    end if;
    return case p_answer_key->>'source'
      when 'biologicalDrawing' then 'Biological drawing recorded'
      when 'practicalGraph' then 'Graph response recorded'
      when 'virtualMeasurement' then 'Virtual measurements recorded'
      when 'tallyTable' then 'Tally table completed'
      when 'histogram' then 'Histogram completed'
      when 'geometryConstruction' then 'Geometry construction recorded'
      else initcap(coalesce(p_answer_key->>'variant', 'diagram')) || ' annotation recorded'
    end;
  elsif p_answer_key->>'source' = 'choices' then
    return upper(p_response);
  end if;

  return p_response;
end;
$$;

commit;
