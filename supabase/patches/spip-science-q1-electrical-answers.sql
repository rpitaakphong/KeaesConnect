update test_questions
set answer_key = '{"source":"mathMultiPart","display":"copper: electrical conductor; graphite: electrical conductor; plastic, rubber, wood: electrical insulator","parts":[{"id":"copper","accepted":["conductor","electrical conductor","a conductor","an electrical conductor"],"points":0.6},{"id":"graphite","accepted":["conductor","electrical conductor","a conductor","an electrical conductor"],"points":0.6},{"id":"plastic","accepted":["insulator","electrical insulator","an insulator","an electrical insulator"],"points":0.6},{"id":"rubber","accepted":["insulator","electrical insulator","an insulator","an electrical insulator"],"points":0.6},{"id":"wood","accepted":["insulator","electrical insulator","an insulator","an electrical insulator"],"points":0.6}],"scoreThresholds":[{"minCorrect":5,"points":3},{"minCorrect":3,"points":2},{"minCorrect":1,"points":1}]}'::jsonb
where id = 'spip-y7s-q1'
  and test_id = 'spip-year-7-science-pre';

with candidates as (
  select
    aa.id,
    aa.attempt_id,
    aa.awarded_points as previous_points
  from attempt_answers aa
  join test_attempts ta on ta.id = aa.attempt_id
  where aa.question_id = 'spip-y7s-q1'
    and ta.test_id = 'spip-year-7-science-pre'
    and aa.awarded_points < 3
    and aa.response ~* 'copper:[[:space:]]*((a|an)[[:space:]]+)?electrical[[:space:]]+conductor'
    and aa.response ~* 'graphite:[[:space:]]*((a|an)[[:space:]]+)?electrical[[:space:]]+conductor'
    and aa.response ~* 'plastic:[[:space:]]*((a|an)[[:space:]]+)?electrical[[:space:]]+insulator'
    and aa.response ~* 'rubber:[[:space:]]*((a|an)[[:space:]]+)?electrical[[:space:]]+insulator'
    and aa.response ~* 'wood:[[:space:]]*((a|an)[[:space:]]+)?electrical[[:space:]]+insulator'
),
corrected as (
  update attempt_answers aa
  set
    correct_answer = 'copper: electrical conductor; graphite: electrical conductor; plastic, rubber, wood: electrical insulator',
    is_correct = true,
    awarded_points = 3,
    possible_points = 3,
    grading_details = '{"parts":[{"id":"copper","score":0.6,"possible":0.6,"correct":true},{"id":"graphite","score":0.6,"possible":0.6,"correct":true},{"id":"plastic","score":0.6,"possible":0.6,"correct":true},{"id":"rubber","score":0.6,"possible":0.6,"correct":true},{"id":"wood","score":0.6,"possible":0.6,"correct":true}]}'::jsonb
  from candidates c
  where aa.id = c.id
  returning aa.attempt_id, c.previous_points
),
deltas as (
  select attempt_id, sum(3 - previous_points) as score_delta
  from corrected
  group by attempt_id
)
update test_attempts ta
set
  score_total = ta.score_total + d.score_delta,
  score_percent = case
    when ta.score_possible = 0 then 0
    else round(((ta.score_total + d.score_delta) / ta.score_possible) * 100)::int
  end
from deltas d
where ta.id = d.attempt_id;
