# Project History

> Historical note: this file records the original static-site work packages. The active production app is now `apps/workspace-next`; legacy static pages have been removed from the working tree.

Record date: 2026-06-07

## Work Package History

### WP1: Interactive Listening HTML

Built the first interactive version of the listening test from the PDF/artwork. Included Listening Parts 1-4, navigation, saved answer state, examples, review flow, and interactions like line drawing, text inputs, image choices, and coloring.

### WP2: Exam-Mode Audio

Added the MP3 as exam audio. Replaced normal audio controls with a single Start listening exam button. Audio plays continuously with no pause, seek, replay, or part-jump controls.

### WP3: Transcript, Answer Key, Scoring

Added transcript-derived answer key and scoring for the 20 listening questions. Implemented score summary, per-part results, correction display, accepted answer variants, and review after submission.

### WP4: Admin Dashboard And Mock Assignment Flow

Created the first Test Admin dashboard. Added student info intake, mock assignment/result flow using localStorage, admin result table, and result details. Later split the student landing page from the actual test page.

### WP5: Supabase Database Integration

Replaced localStorage mock persistence with Supabase. Added real staff login, assignment generation, assignment-token student links, backend scoring/submission RPC flow, and shared admin result display across devices.

### WP6: Full Starter Progress Test

Expanded the test from Listening-only to the full Starter Progress Test:

- Listening: 20 points
- Reading & Writing: 25 points
- Total: 45 points

Added `reading-writing.html`, native HTML question interfaces, cropped illustration assets, combined scoring/submission, and Supabase seed/scoring support for all 45 questions.

### WP7: Production Deployment Setup

Prepared deployment to Netlify:

- Added `netlify.toml`
- Redirected `/` and `/index.html` to `/login.html`
- Added HTML no-cache and security headers
- Updated README with Netlify, DNS, domain, and production verification steps
- Pushed deployment config to `main`

Current state: the repo-side Netlify setup is done and deployed, but final domain/name configuration is managed in the Netlify dashboard.
