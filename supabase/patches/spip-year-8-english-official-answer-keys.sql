begin;

update tests
set status = 'active', total_points = 79
where id = 'spip-year-8-english-pre';

update test_questions
set answer_key = '{"source":"mathMultiPart","id":"spip-y8e-r1-8","points":8,"display":"1 B; 2 C; 3 B; 4 D; 5 C; 6 A; 7 D; 8 B","status":"official","parts":[{"id":"gap1","accepted":["b"],"points":1},{"id":"gap2","accepted":["c"],"points":1},{"id":"gap3","accepted":["b"],"points":1},{"id":"gap4","accepted":["d"],"points":1},{"id":"gap5","accepted":["c"],"points":1},{"id":"gap6","accepted":["a"],"points":1},{"id":"gap7","accepted":["d"],"points":1},{"id":"gap8","accepted":["b"],"points":1}]}'::jsonb
where id = 'spip-y8e-r1-8' and test_id = 'spip-year-8-english-pre';

with official_keys(id, accepted, display) as (
  values
    ('spip-y8e-r9', '["where"]'::jsonb, 'where'),
    ('spip-y8e-r10', '["so"]'::jsonb, 'so'),
    ('spip-y8e-r11', '["myself"]'::jsonb, 'myself'),
    ('spip-y8e-r12', '["in"]'::jsonb, 'in'),
    ('spip-y8e-r13', '["which","that"]'::jsonb, 'which / that'),
    ('spip-y8e-r14', '["out","on","at"]'::jsonb, 'out / on / at'),
    ('spip-y8e-r15', '["from"]'::jsonb, 'from'),
    ('spip-y8e-r16', '["any"]'::jsonb, 'any'),
    ('spip-y8e-r17', '["producer","produser"]'::jsonb, 'producer'),
    ('spip-y8e-r18', '["illness","illnesses","illnes","illneses"]'::jsonb, 'illness / illnesses'),
    ('spip-y8e-r19', '["effective","efective","effectve"]'::jsonb, 'effective'),
    ('spip-y8e-r20', '["scientists","scientsts","scientits"]'::jsonb, 'scientists'),
    ('spip-y8e-r21', '["addition","adition"]'::jsonb, 'addition'),
    ('spip-y8e-r22', '["pressure","presure"]'::jsonb, 'pressure'),
    ('spip-y8e-r23', '["disadvantage","disadvantge"]'::jsonb, 'disadvantage'),
    ('spip-y8e-r24', '["spicy","spicey"]'::jsonb, 'spicy'),
    ('spip-y8e-r25', '["a good idea to go"]'::jsonb, 'a good idea to go'),
    ('spip-y8e-r26', '["talented that he","talanted that he"]'::jsonb, 'talented that he'),
    ('spip-y8e-r27', '["if she knew what","if she knew the","if she new what","if she new the"]'::jsonb, 'if she knew what / if she knew the'),
    ('spip-y8e-r28', '["spent a long time","took a long time","was a long time","spnet a long time"]'::jsonb, 'spent / took / was a long time'),
    ('spip-y8e-r29', '["is said to be","are said to be"]'::jsonb, 'is / are said to be'),
    ('spip-y8e-r30', '["not call off","not call of","you didn''t call off","you did not call off","we didn''t call off","we did not call off"]'::jsonb, 'not call off / you or we didn''t call off'),
    ('spip-y8e-r31', '["c"]'::jsonb, 'C'),
    ('spip-y8e-r32', '["d"]'::jsonb, 'D'),
    ('spip-y8e-r33', '["c"]'::jsonb, 'C'),
    ('spip-y8e-r34', '["a"]'::jsonb, 'A'),
    ('spip-y8e-r35', '["d"]'::jsonb, 'D'),
    ('spip-y8e-r36', '["c"]'::jsonb, 'C'),
    ('spip-y8e-l1', '["b"]'::jsonb, 'B'),
    ('spip-y8e-l2', '["b"]'::jsonb, 'B'),
    ('spip-y8e-l3', '["a"]'::jsonb, 'A'),
    ('spip-y8e-l4', '["c"]'::jsonb, 'C'),
    ('spip-y8e-l5', '["c"]'::jsonb, 'C'),
    ('spip-y8e-l6', '["a"]'::jsonb, 'A'),
    ('spip-y8e-l7', '["a"]'::jsonb, 'A'),
    ('spip-y8e-l8', '["a"]'::jsonb, 'A'),
    ('spip-y8e-l9', '["name","great name"]'::jsonb, '(great) name'),
    ('spip-y8e-l10', '["chest","chset"]'::jsonb, 'chest'),
    ('spip-y8e-l11', '["northern","northen","nothern"]'::jsonb, 'northern'),
    ('spip-y8e-l12', '["forests","forrests"]'::jsonb, 'forests'),
    ('spip-y8e-l13', '["winter","the winter","wintre"]'::jsonb, '(the) winter'),
    ('spip-y8e-l14', '["human","humans","the human","the humans","some human","some humans","humens"]'::jsonb, '(the / some) human(s)'),
    ('spip-y8e-l15', '["berries","beries","berrys"]'::jsonb, 'berries'),
    ('spip-y8e-l16', '["platform","a platform","platfrom"]'::jsonb, '(a) platform'),
    ('spip-y8e-l17', '["mice","small mice","little mice"]'::jsonb, '(small / little) mice'),
    ('spip-y8e-l18', '["diary","funny diary","dairy"]'::jsonb, '(funny) diary')
)
update test_questions question
set answer_key = jsonb_build_object(
  'source', 'rwAnswers',
  'id', question.id,
  'accepted', official_keys.accepted,
  'display', official_keys.display,
  'status', 'official'
)
from official_keys
where question.id = official_keys.id
  and question.test_id = 'spip-year-8-english-pre';

update test_questions
set answer_key = '{"source":"mathMultiPart","id":"spip-y8e-l19-23","points":5,"display":"19 G; 20 B; 21 A; 22 H; 23 F","status":"official","parts":[{"id":"speaker1","accepted":["g"],"points":1},{"id":"speaker2","accepted":["b"],"points":1},{"id":"speaker3","accepted":["a"],"points":1},{"id":"speaker4","accepted":["h"],"points":1},{"id":"speaker5","accepted":["f"],"points":1}]}'::jsonb
where id = 'spip-y8e-l19-23' and test_id = 'spip-year-8-english-pre';

commit;
