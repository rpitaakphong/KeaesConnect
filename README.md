# Keaes Workspace Employee Portal

Static workspace for Keaes learning resources, quizzes, exams, and student performance review.

## Structure

```text
login.html
dashboard.html

assets/
  css/
    base.css
    portal.css
  js/
    portal.js

apps/
  admin-tests/
  starter-listening/

supabase/
  schema.sql
```

## Run Locally

Open `login.html` in a browser.

For a local server:

```bash
cd "/Users/pitaakphong/Documents/New project"
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/login.html`.

## Supabase Backend

WP5 uses Supabase for staff authentication, test assignments, student submissions, scoring, and admin results.

Run `supabase/schema.sql` in your Supabase project, then add your project URL and anon key to `assets/js/supabase-config.js`.

## Current Tools

- `apps/admin-tests/`: admin test dashboard and Supabase assignment flow.
- `apps/starter-listening/`: student details landing page and Starter Progress Listening exam.

## Deploy

Upload the site contents and use `login.html` as the staff workspace entry point.
