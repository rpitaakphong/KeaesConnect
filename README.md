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
```

## Run Locally

Open `login.html` in a browser.

For a local server:

```bash
cd "/Users/pitaakphong/Documents/New project"
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/login.html`.

## Prototype Login

The login is a static prototype gate. It accepts any non-empty email and password, stores an employee session in `sessionStorage`, and protects `dashboard.html` visually.

This is not real authentication. Add server-side or hosted identity authentication before using private employee accounts.

## Current Tools

- `apps/admin-tests/`: admin test dashboard and mock assignment flow.
- `apps/starter-listening/`: student details landing page and Starter Progress Listening exam.

## Deploy

Upload the site contents and use `login.html` as the staff workspace entry point.
