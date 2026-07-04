update test_questions
set part = 'Part 1 - Rhyming Words'
where id in ('el1-q1', 'el1-q2', 'el1-q3', 'el1-q4', 'el1-q5');

update test_questions
set part = 'Part 1 - Homophones'
where id in ('el2-q1', 'el2-q2', 'el2-q3', 'el2-q4', 'el2-q5');
