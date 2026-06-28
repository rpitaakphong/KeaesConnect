# Production Verification Checklist

Use this checklist on the Netlify deploy preview or production deployment before deleting any legacy static fallback pages.

## Deploy Preview

- Confirm `/` redirects to `/login`.
- Confirm `/login`, `/dashboard`, `/admin/tests`, `/admin/test-inventory`, `/admin/staff`, and `/admin/hours-cross-check` load.
- Confirm no primary navigation points to `/login.html`.
- Confirm `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are configured in Netlify.

## Staff Access

- Log out and confirm unauthenticated staff pages are blocked or redirected to login.
- Log in as a non-super-admin and confirm `/admin/staff` is denied.
- Log in as a super admin and confirm staff list loads.
- Create one test staff account with a temporary password.
- Edit that account role and permissions, then refresh and confirm the saved values.
- Confirm a staff user with `hours_cross_check` can open Hours Cross-Check.
- Confirm a staff user without `hours_cross_check` is blocked from Hours Cross-Check.

## Test Submissions

Generate and submit one real assignment from each family:

- English Literacy
- Math Olympiad
- SPIP English, Math, or Science
- Starter Progress Listening
- Starter Progress Reading & Writing

After each submission:

- Confirm Review and Submit is the only submit path.
- Confirm the result appears in Test Admin.
- Confirm possible points match the registered test total.
- Spot-check answers and part scores in the admin result report.

## Hours Cross-Check

- Upload Teach and Go CSV plus class-list CSV and confirm teacher review loads.
- Upload Teach and Go XLS/XLSX plus class-list CSV and confirm teacher review loads.
- During large-file processing, confirm the page remains responsive and the processing overlay stays visible.
- Save teacher-name mappings, reload, and confirm selections persist.
- Confirm Synthesis, Overview, Teachers, Courses, Sessions, Data Quality, and Teacher Names tabs render.
- Download teacher CSV, course CSV, session CSV, data-quality CSV, and combined JSON report.

## Rollback And Legacy Policy

- Keep legacy static files in git during this verification cycle.
- If production verification fails, roll back to the previous Netlify deploy or revert the deployment commit.
- Delete legacy static fallback pages only in a separate cleanup commit after this checklist passes.
