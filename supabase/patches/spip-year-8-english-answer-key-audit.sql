begin;

-- Audited against Cambridge's official B2 First sample answer keys.
update tests
set status = 'active', total_points = 99
where id = 'spip-year-8-english-pre';

-- Keep every grammatically valid official answer and reject spelling mistakes.
with audited_keys(id, accepted, display) as (
  values
    ('spip-y8e-r9', '["where"]'::jsonb, 'where'),
    ('spip-y8e-r10', '["so"]'::jsonb, 'so'),
    ('spip-y8e-r11', '["myself"]'::jsonb, 'myself'),
    ('spip-y8e-r12', '["in"]'::jsonb, 'in'),
    ('spip-y8e-r13', '["which","that"]'::jsonb, 'which / that'),
    ('spip-y8e-r14', '["out","on","at"]'::jsonb, 'out / on / at'),
    ('spip-y8e-r15', '["from"]'::jsonb, 'from'),
    ('spip-y8e-r16', '["any"]'::jsonb, 'any')
)
update test_questions question
set answer_key = jsonb_build_object(
  'source', 'rwAnswers',
  'id', question.id,
  'accepted', audited_keys.accepted,
  'display', audited_keys.display,
  'status', 'official'
)
from audited_keys
where question.id = audited_keys.id
  and question.test_id = 'spip-year-8-english-pre';

-- The supplied keyword SAID must not be changed.
update test_questions
set answer_key = '{"source":"rwAnswers","id":"spip-y8e-r29","accepted":["is said to be","are said to be"],"display":"is / are said to be","status":"official"}'::jsonb
where id = 'spip-y8e-r29'
  and test_id = 'spip-year-8-english-pre';

commit;
