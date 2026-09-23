-- Expose the saved question id in admin result answers so the app can resolve
-- full multiple-choice labels from its TestDefinition registry.
-- Idempotent: safe to apply repeatedly.

create or replace view public.admin_attempt_results as
select
  a.id as attempt_id,
  a.test_id,
  coalesce(ta.branch, '') as branch,
  ta.created_by,
  creator.email as created_by_email,
  creator.display_name as created_by_name,
  t.title as test_title,
  t.subject,
  t.level,
  s.full_name,
  s.nickname,
  s.date_of_birth,
  a.test_date,
  a.score_total,
  a.score_possible,
  a.score_percent,
  a.submitted_at,
  (
    select jsonb_agg(jsonb_build_object('part', part, 'total', awarded_total, 'possible', possible_total) order by part)
    from (
      select part, sum(awarded_points) as awarded_total, sum(possible_points) as possible_total
      from public.attempt_answers
      where attempt_id = a.id
      group by part
    ) part_scores
  ) as part_scores,
  (
    select jsonb_agg(jsonb_build_object(
      'questionId', question_id,
      'part', part,
      'prompt', prompt,
      'response', response,
      'correctAnswer', correct_answer,
      'correct', is_correct,
      'score', awarded_points,
      'possible', possible_points,
      'gradingDetails', grading_details,
      'transcript', transcript_ref
    ) order by position)
    from public.attempt_answers
    where attempt_id = a.id
  ) as answers
from public.test_attempts a
join public.test_assignments ta on ta.id = a.assignment_id
join public.tests t on t.id = a.test_id
join public.students s on s.id = a.student_id
left join public.staff_users creator on creator.id = ta.created_by
where public.has_staff_permission('view_results') or public.has_staff_permission('view_reports');

grant select on public.admin_attempt_results to authenticated;
