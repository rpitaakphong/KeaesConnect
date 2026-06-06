# Keaes Workspace Employee Portal

Static workspace for Keaes learning resources, quizzes, exams, and student performance review.

## Structure

```text
login.html
dashboard.html
netlify.toml

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
- `apps/starter-listening/`: student details landing page and full Starter Progress Test.

## Deploy

WP7 deploys Keaes Workspace as a static Netlify site backed by Supabase.

### Netlify setup

1. In Netlify, create a new site from GitHub repository `rpitaakphong/KeaesCampus`.
2. Use these build settings:
   - Production branch: `main`
   - Base directory: repository root
   - Build command: leave empty
   - Publish directory: `.`
3. Netlify reads `netlify.toml` to:
   - publish from the repository root
   - redirect `/` and `/index.html` to `/login.html`
   - keep HTML pages uncached so interface updates appear immediately
4. After deploy, open the Netlify URL and confirm `/` redirects to `/login.html`.

### Domain and DNS

Use Netlify DNS for the production domain.

1. Add or register the chosen domain in Netlify.
2. Set the Netlify site as the primary domain.
3. Enable Netlify automatic HTTPS.
4. Keep the default `.netlify.app` URL as the fallback/staging reference.

### Production verification

After every production deploy:

1. Open `/login.html` and sign in with a Supabase staff account.
2. Confirm logged-out `/dashboard.html` redirects to login.
3. Open Test Admin and generate a `starter-progress-test` assignment link.
4. Open the student link in a separate browser or device.
5. Submit the full test and confirm the result appears in Test Admin.

### Supabase note

The browser uses the public Supabase anon key in `assets/js/supabase-config.js`. This is expected for a Supabase frontend. Data protection depends on the RLS policies and RPC functions in `supabase/schema.sql`; rerun that SQL before production if the schema has changed.
