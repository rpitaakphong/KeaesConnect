begin;

do $$
declare
  unexpected_rows integer;
begin
  select count(*)
  into unexpected_rows
  from public.attempt_answers aa
  join public.test_attempts ta on ta.id = aa.attempt_id
  where ta.test_id = 'spip-year-8-english-pre'
    and aa.question_id in ('spip-y8e-w1', 'spip-y8e-w2')
    and aa.possible_points not in (10, 20);

  if unexpected_rows > 0 then
    raise exception
      'Cannot rescale SPIP Year 8 English writing: % answer rows have an unexpected possible_points value.',
      unexpected_rows;
  end if;
end;
$$;

create temporary table spip_y8e_writing_rescale_candidates
on commit drop
as
select
  aa.id as answer_id,
  aa.attempt_id,
  aa.question_id,
  aa.awarded_points as previous_awarded_points,
  aa.possible_points as previous_possible_points,
  aa.grading_details as previous_grading_details
from public.attempt_answers aa
join public.test_attempts ta on ta.id = aa.attempt_id
where ta.test_id = 'spip-year-8-english-pre'
  and aa.question_id in ('spip-y8e-w1', 'spip-y8e-w2')
  and aa.possible_points = 20;

create temporary table spip_y8e_writing_rescale_attempts
on commit drop
as
select distinct attempt_id
from spip_y8e_writing_rescale_candidates;

do $$
declare
  answer_count integer;
  attempt_count integer;
begin
  select count(*) into answer_count from spip_y8e_writing_rescale_candidates;
  select count(*) into attempt_count from spip_y8e_writing_rescale_attempts;
  raise notice
    'Rescaling % SPIP Year 8 English writing answers across % historical attempts.',
    answer_count,
    attempt_count;
end;
$$;

update public.attempt_answers aa
set
  awarded_points = candidates.previous_awarded_points / 2,
  possible_points = 10,
  correct_answer = '10-mark scaled B2 writing rubric',
  grading_details = jsonb_set(
    jsonb_set(
      coalesce(candidates.previous_grading_details, '{}'::jsonb),
      '{rawScore}',
      to_jsonb(
        case
          when jsonb_typeof(candidates.previous_grading_details->'rawScore') = 'number'
            then (candidates.previous_grading_details->>'rawScore')::numeric
          when jsonb_typeof(candidates.previous_grading_details->'contentScore') = 'number'
            and jsonb_typeof(candidates.previous_grading_details->'communicativeAchievementScore') = 'number'
            and jsonb_typeof(candidates.previous_grading_details->'organisationScore') = 'number'
            and jsonb_typeof(candidates.previous_grading_details->'languageScore') = 'number'
            then
              (candidates.previous_grading_details->>'contentScore')::numeric
              + (candidates.previous_grading_details->>'communicativeAchievementScore')::numeric
              + (candidates.previous_grading_details->>'organisationScore')::numeric
              + (candidates.previous_grading_details->>'languageScore')::numeric
          else candidates.previous_awarded_points
        end
      ),
      true
    ),
    '{score}',
    to_jsonb(candidates.previous_awarded_points / 2),
    true
  )
from spip_y8e_writing_rescale_candidates candidates
where aa.id = candidates.answer_id;

with recalculated as (
  select
    aa.attempt_id,
    sum(aa.awarded_points) as score_total,
    sum(aa.possible_points) as score_possible
  from public.attempt_answers aa
  join spip_y8e_writing_rescale_attempts affected on affected.attempt_id = aa.attempt_id
  group by aa.attempt_id
)
update public.test_attempts ta
set
  score_total = recalculated.score_total,
  score_possible = recalculated.score_possible,
  score_percent = case
    when recalculated.score_possible = 0 then 0
    else round((recalculated.score_total / recalculated.score_possible) * 100)::integer
  end
from recalculated
where ta.id = recalculated.attempt_id;

do $$
declare
  invalid_rescaled_rows integer;
  changed_criterion_rows integer;
  remaining_legacy_rows integer;
  mismatched_attempt_totals integer;
  unexpected_attempt_maximums integer;
begin
  select count(*)
  into invalid_rescaled_rows
  from spip_y8e_writing_rescale_candidates candidates
  join public.attempt_answers aa on aa.id = candidates.answer_id
  where aa.possible_points <> 10
    or aa.awarded_points <> candidates.previous_awarded_points / 2
    or coalesce((aa.grading_details->>'score')::numeric, -1) <> candidates.previous_awarded_points / 2;

  if invalid_rescaled_rows > 0 then
    raise exception
      'SPIP Year 8 English writing rescale verification failed for % answer rows.',
      invalid_rescaled_rows;
  end if;

  select count(*)
  into changed_criterion_rows
  from spip_y8e_writing_rescale_candidates candidates
  join public.attempt_answers aa on aa.id = candidates.answer_id
  where (aa.grading_details - 'rawScore' - 'score')
    is distinct from (candidates.previous_grading_details - 'rawScore' - 'score');

  if changed_criterion_rows > 0 then
    raise exception
      'SPIP Year 8 English writing criterion details changed unexpectedly for % answer rows.',
      changed_criterion_rows;
  end if;

  select count(*)
  into remaining_legacy_rows
  from public.attempt_answers aa
  join public.test_attempts ta on ta.id = aa.attempt_id
  where ta.test_id = 'spip-year-8-english-pre'
    and aa.question_id in ('spip-y8e-w1', 'spip-y8e-w2')
    and aa.possible_points = 20;

  if remaining_legacy_rows > 0 then
    raise exception
      'SPIP Year 8 English writing still has % legacy 20-point answer rows.',
      remaining_legacy_rows;
  end if;

  select count(*)
  into mismatched_attempt_totals
  from public.test_attempts ta
  join spip_y8e_writing_rescale_attempts affected on affected.attempt_id = ta.id
  join lateral (
    select
      sum(aa.awarded_points) as score_total,
      sum(aa.possible_points) as score_possible
    from public.attempt_answers aa
    where aa.attempt_id = ta.id
  ) answer_totals on true
  where ta.score_total <> answer_totals.score_total
    or ta.score_possible <> answer_totals.score_possible
    or ta.score_percent <> case
      when answer_totals.score_possible = 0 then 0
      else round((answer_totals.score_total / answer_totals.score_possible) * 100)::integer
    end;

  if mismatched_attempt_totals > 0 then
    raise exception
      'SPIP Year 8 English attempt total verification failed for % attempts.',
      mismatched_attempt_totals;
  end if;

  select count(*)
  into unexpected_attempt_maximums
  from public.test_attempts ta
  join spip_y8e_writing_rescale_attempts affected on affected.attempt_id = ta.id
  where ta.score_possible <> 79;

  if unexpected_attempt_maximums > 0 then
    raise exception
      'SPIP Year 8 English rescale produced % attempts whose maximum is not 79.',
      unexpected_attempt_maximums;
  end if;
end;
$$;

commit;
