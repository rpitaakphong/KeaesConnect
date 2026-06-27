# Keaes Workspace Next.js Migration Plan

## Goal

Move Keaes Workspace from a static multi-page HTML/CSS/JS site to a fully Next.js-supported webapp, with tests rendered through shared layouts, shared question components, shared scoring contracts, and a consistent Supabase integration.

The migration should not be a big-bang rewrite. Existing static tests must keep working while the Next.js app is introduced, then test families can move into the shared engine one by one.

## Current State

### Portal and tools

- `login.html`: staff login through Supabase Auth.
- `dashboard.html`: staff tool launcher with permission-aware cards.
- `apps/admin-tests/`: test catalog, assignment link generation, results review, report/staff management pages.
- `apps/student-dashboard/`: student-facing dashboard.
- `tools/hours-cross-check/`: separate operations tool. This can remain outside the first migration unless we want it in the main workspace shell.

### Test families

- `apps/starter-listening/`: Cambridge Starter Progress Listening plus Reading/Writing. It has bespoke listening interactions, audio playback, drawing/line-matching, colouring, reading/writing review, and Supabase submission.
- `apps/english-literacy/level-1` through `level-5`: mostly bespoke per-level apps with repeated profile, answer persistence, section navigation, scoring, and submission logic.
- `apps/math-olympiad/level-1` through `level-6`: levels 2-6 already use a partial shared data-driven pattern through `apps/math-olympiad/shared/app.js`; level 1 is more bespoke.
- `apps/spip/year-7-english-pre`, `apps/spip/year-7-math-pre`, `apps/spip/year-7-science-pre`: richer pre-test apps with structured configs, image assets, review-required questions, AI/teacher-review-style grading, and Supabase submission.

### Migration checklist

| Test | Content | Assets | Admin Next route | Demo smoke | Real Supabase smoke |
| --- | --- | --- | --- | --- | --- |
| Math Olympiad 2 | Done | Done | Done | Done | Done |
| English Literacy 1 | Done | Done | Done | Done | Pending |
| English Literacy 2 | Done | Done | Done | Done | Done |
| English Literacy 3 | Done | Done | Done | Done | Pending |
| English Literacy 4 | Done | Done | Done | Done | Pending |
| English Literacy 5 | Done | Done | Done | Done | Pending |
| Math Olympiad 1 | Done | N/A | Done | Done | Pending |
| Math Olympiad 3 | Done | N/A | Done | Done | Pending |
| Math Olympiad 4 | Done | Done | Done | Done | Pending |
| Math Olympiad 5 | Done | Done | Done | Done | Pending |
| Math Olympiad 6 | Done | Done | Done | Done | Pending |
| SPIP Year 7 English Pre-test | Done | Done | Done | Done | Pending |
| SPIP Year 7 Math Pre-test | Done | Done | Done | Done | Pending |
| SPIP Year 7 Science Pre-test | Done | Done | Done | Done | Pending |

### Shared backend

- `assets/js/keaes-api.js`: browser Supabase client wrapper for auth, staff profile, catalog, assignments, results, submissions, and AI grading.
- `supabase/schema.sql`: database schema, test catalog, answer keys, assignment flow, answer normalization, server scoring, results APIs, permissions.
- `supabase/functions/grade-english-literacy`: AI grading for short answers.
- `supabase/functions/manage-staff-user`: staff account management.

### Main risk in the current architecture

The problem is not just static HTML. The problem is repeated test infrastructure:

- Student profile collection is duplicated.
- Assignment validation is duplicated.
- Answer persistence is duplicated.
- Section navigation is duplicated.
- Question rendering is duplicated.
- Submission and result normalization are duplicated.
- Scoring logic exists both in client JS and Supabase.
- Each new test risks becoming another custom mini-app.

Next.js should solve this by making tests data-driven and component-driven, not by simply recreating every static page as a React page.

## Target Architecture

### App location

Start with a side-by-side Next.js app:

```text
apps/workspace-next/
  app/
  src/
  public/
  package.json
```

This lets the current static site keep deploying while the Next.js version matures. Once the Next app covers the production routes, promote it to the primary deployment target.

### Target routes

```text
/login
/dashboard
/admin/tests
/admin/tests/results
/admin/tests/results/[attemptId]
/admin/staff
/students
/tests/[testId]/start
/tests/[testId]/take
/tests/[testId]/review
/tests/[testId]/results
/tools/hours-cross-check        optional later
```

Assignment links should become:

```text
/tests/[testId]/start?assignment=[token]
```

The existing static links can redirect into the new app once a test is migrated.

### Source layout

```text
apps/workspace-next/src/
  app/
    login/
    dashboard/
    admin/
    tests/
  components/
    app-shell/
    buttons/
    forms/
    tables/
    feedback/
  features/
    auth/
    admin/
    assignments/
    results/
    tests/
  lib/
    supabase/
    permissions/
    formatting/
    storage/
  test-content/
    english-literacy/
    math-olympiad/
    spip/
    starter-progress/
  styles/
```

## Shared Test Engine

### Core components

The test engine should provide:

- `StudentGate`: validates assignment token, collects student profile, stores profile.
- `TestShell`: common page frame for all tests.
- `TestHeader`: title, student line, progress, timing, submit button.
- `SectionNav`: section/part navigation with answered status.
- `QuestionRenderer`: dispatches each question to the right component.
- `QuestionCard`: shared prompt, marks, instructions, review status.
- `ReviewPanel`: unanswered checks, answer summary, submit confirmation.
- `ResultSummary`: score, section breakdown, corrections, review notes.
- `AudioController`: listening audio playback rules and progress.
- `AssetImage`: consistent image sizing, alt text, and responsive behavior.
- `SubmitDialog`: common final confirmation.

### Question components

Build the shared renderer around question types already present in the repo:

- `singleChoice`: radio choices.
- `multiChoice`: checkbox/set answers.
- `trueFalse`: true/false choices.
- `textInput`: one short text field.
- `multiTextInput`: several answer fields.
- `textArea`: longer written answer.
- `imageChoice`: picture choices.
- `imagePrompt`: image plus input or choices.
- `inlineEquation`: text with embedded input boxes.
- `answerTable`: table with inputs in cells.
- `sequenceBoxes`: sequence/table of missing values.
- `matching`: text/picture matching.
- `pairConnect`: pair decimals or items by selected pairs.
- `hotspotConnect`: Starter listening line matching.
- `colourHotspot`: Starter listening colour regions.
- `audioQuestionSet`: listening sections tied to timestamps.
- `reviewOnly`: drawing, translation, scale-marking, working, or teacher-reviewed answers.
- `aiWritten`: short answer or writing prompt graded by the existing Supabase edge function.

Some specialized interactions can live as plugins under `features/tests/interactions/`, but they should still use the same profile, persistence, progress, review, and submission system.

### Test definition shape

Each test should become a typed object instead of a custom page:

```ts
export type TestDefinition = {
  id: string;
  title: string;
  subject: string;
  level: string;
  totalPoints: number;
  durationMinutes?: number;
  status: "active" | "draft" | "legacy";
  sections: TestSection[];
};

export type TestSection = {
  id: string;
  label: string;
  title: string;
  hint?: string;
  audio?: AudioSpec;
  passage?: PassageSpec;
  questions: TestQuestion[];
};
```

Each `TestQuestion` should include:

- stable `id`
- `type`
- `number`
- `prompt`
- `points`
- optional `instructions`
- optional `assets`
- response schema
- answer key or grading mode
- optional `reviewRequired`

### Answer state shape

Use one answer state model across all tests:

```ts
type TestAnswers = Record<string, unknown>;
```

Examples:

```ts
{
  "mo2-q1": { "a": "682", "b": "970" },
  "el1-q16": "car",
  "starter-p1": { "clock": "between-pictures", "book": "under-table" },
  "spip-y7m-q24": { "answer": "390 - 26 = 364" }
}
```

This keeps the Supabase RPC payload stable and prevents each question type from inventing its own submission format.

## Scoring Strategy

### Source of truth

Supabase should remain the authoritative scorer for submitted attempts:

- RLS stays in Supabase.
- Assignment tokens stay in Supabase.
- `submit_attempt` remains the production submission path.
- AI grading continues through the existing edge function unless replaced intentionally.

### Client scoring

The Next.js app can provide local preview scoring only for demo/dev mode and immediate UI feedback. It should share normalizers with the server where practical, but production results should come back from Supabase after submission.

### Review-required questions

Questions that require teacher review should be first-class:

```ts
grading: {
  mode: "manualReview";
  points: 2;
  displayAnswer: "Teacher verified drawing/working";
}
```

The UI should clearly mark these in:

- the test review screen
- admin result details
- result breakdown
- teacher review workflow later

## Supabase Integration

Replace `assets/js/keaes-api.js` with typed modules:

```text
src/lib/supabase/client.ts
src/features/auth/auth-api.ts
src/features/admin/admin-api.ts
src/features/assignments/assignment-api.ts
src/features/results/results-api.ts
src/features/tests/submission-api.ts
```

Keep the browser anon key model. Secrets should only be used in server routes if a feature genuinely needs privileged backend behavior.

Environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Potential server-only variables later:

```text
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

Do not introduce server-only secrets until the route needs them.

## Migration Phases

### Phase 0: Baseline and inventory

Deliverables:

- Current static app remains deployable.
- Inventory all test routes, assets, question types, answer keys, and scoring paths.
- Mark each test as `legacy`, `candidate`, or `migrated`.

Acceptance criteria:

- Every existing test has a migration owner row in a tracking table.
- No current links are broken.

### Phase 1: Bootstrap Next.js app

Deliverables:

- Create `apps/workspace-next`.
- Add TypeScript, App Router, shared styles, linting, and Supabase client.
- Recreate `/login` and `/dashboard`.
- Keep dashboard cards linking to legacy static pages where not migrated.

Acceptance criteria:

- Staff can log in.
- Staff permissions render the correct dashboard cards.
- Legacy links still work.

### Phase 2: Admin and assignment foundation

Deliverables:

- Rebuild Test Admin in Next.js:
  - catalog list
  - assignment link generation
  - result table
  - result detail view
- Generate assignment links using new route format:

```text
/tests/[testId]/start?assignment=[token]
```

Acceptance criteria:

- Admin can generate links for both legacy and Next tests.
- Result list matches existing static admin behavior.
- Permissions match current `portal.js` behavior.

### Phase 3: Shared test engine pilot

Best pilot: `math-olympiad-2`.

Reason:

- It is already data-driven.
- It has a manageable range of question types.
- It uses the same profile/answer/submission flow as other tests.
- It is less bespoke than Starter Listening.

Deliverables:

- Implement `TestDefinition`, `QuestionRenderer`, `TestShell`, `StudentGate`, `ReviewPanel`, and `ResultSummary`.
- Convert `apps/math-olympiad/level-2/config.js` into typed test content.
- Render it at `/tests/math-olympiad-2/start` and `/tests/math-olympiad-2/take`.

Acceptance criteria:

- Assignment token validation works.
- Student profile collection works.
- Answer persistence works across reloads.
- All Math Olympiad Level 2 questions render correctly.
- Submit flow sends the same shape accepted by Supabase.
- Admin result view receives and displays the submitted attempt.

### Phase 4: Migrate Math Olympiad family

Deliverables:

- Convert levels 1-6 into `test-content/math-olympiad`.
- Reuse shared math question renderers.
- Replace old Math Olympiad static links after each level passes verification.

Acceptance criteria:

- Levels 1-6 use the same shell, profile flow, persistence, review, and submission path.
- Level-specific CSS is reduced to test-content layout hints and assets.

### Phase 5: Migrate English Literacy family

Deliverables:

- Convert levels 1-5.
- Add reusable literacy components:
  - rhyming choice
  - picture naming
  - odd-one-out image choice
  - missing letters
  - reading passage true/false
  - short answer with AI grading

Acceptance criteria:

- AI-graded levels call the existing grading function.
- Demo/local preview still works.
- Result summaries match current behavior.

### Phase 6: Migrate SPIP pre-tests

Deliverables:

- Convert Year 7 English, Math, and Science.
- Add review-first components:
  - image/table prompt
  - manual review answer
  - keyword-assisted written answer
  - visual reference prompt
  - multi-part science/math responses

Acceptance criteria:

- Review-required items are preserved.
- Server answer keys in `supabase/schema.sql` continue to match client question IDs.
- Admin can see which questions need review.

### Phase 7: Migrate Starter Progress Test

Deliverables:

- Convert listening, reading, and writing into the shared engine.
- Add specialized interactions:
  - controlled audio playback
  - line/hotspot matching
  - colour hotspot regions
  - image-choice listening questions
  - reading/writing page sections

Acceptance criteria:

- Audio restrictions match current behavior.
- Listening answer state carries into final submission.
- Reading/Writing and Listening produce one final submitted attempt.
- Score summary matches current production behavior.

### Phase 8: Cutover and cleanup

Deliverables:

- Move production routing to the Next.js app.
- Redirect legacy static URLs to their migrated Next.js equivalents.
- Keep static assets under `public/legacy-assets` or a stable `/assets` path.
- Archive or remove migrated static app code after validation.

Acceptance criteria:

- Existing admin-generated links either still work or redirect correctly.
- Netlify/Vercel production deploy is documented.
- README reflects Next.js local development and deployment.
- No active test depends on duplicated static shell code.

## Route Compatibility Plan

Existing links such as:

```text
/apps/math-olympiad/level-2/index.html?testId=math-olympiad-2&assignment=TOKEN
```

should redirect to:

```text
/tests/math-olympiad-2/start?assignment=TOKEN
```

During migration, Admin should know which tests are `legacy` and which are `next`:

```ts
type TestRuntime = "legacy-static" | "next-shared-engine";
```

The catalog can generate the correct URL per test until all tests are migrated.

## Asset Plan

Current test assets should move only when each test migrates.

Target:

```text
apps/workspace-next/public/test-assets/
  english-literacy/
  math-olympiad/
  spip/
  starter-progress/
```

Rules:

- Keep filenames stable where possible.
- Store asset paths in test definitions.
- Require `alt` text for every instructional image.
- Use responsive image wrappers so diagrams do not break mobile layouts.

## Styling Plan

Start by porting the existing visual system:

- `assets/css/base.css`
- `assets/css/portal.css`
- `assets/css/test-theme.css`

Then convert repeated styles into component-level CSS modules or global layer files:

```text
src/styles/globals.css
src/styles/portal.css
src/styles/test-shell.css
```

Avoid making each test own a full stylesheet. Test-specific style should be limited to:

- diagram sizing
- specialized interaction layout
- asset-specific responsive constraints

## Testing and Verification

For each migrated page:

- Verify login/auth redirects.
- Verify permission gating.
- Verify assignment token validation.
- Verify profile save and answer persistence.
- Verify all question types can be answered.
- Verify submit payload shape.
- Verify Supabase result appears in admin.
- Verify desktop and mobile layout.
- Verify existing static version and Next version produce equivalent scoring for sample answers.

Recommended automated coverage:

- Unit tests for answer normalization and scoring helpers.
- Component tests for question renderers.
- Browser tests for one full assignment submission.
- Snapshot-like fixtures for each test definition.

## Initial Implementation Slice

The first real build should be:

1. Create `apps/workspace-next`.
2. Add `/login` and `/dashboard`.
3. Add typed Supabase client modules.
4. Add `/admin/tests` with catalog and link generation.
5. Add shared test engine skeleton.
6. Convert `math-olympiad-2`.
7. Verify a full assignment flow from admin link generation to submitted result.

This proves the whole architecture before migrating the harder test families.

## Decisions Needed

- Hosting target: keep Netlify or move the Next.js app to Vercel.
- Whether `tools/hours-cross-check` should be migrated into the Next app or remain a separate static tool for now.
- Whether old static routes must remain permanently supported for previously shared assignment links.
- Whether teacher manual review becomes a dedicated workflow in this migration or stays as result detail metadata first.

## Recommended Next Action

Start with Phase 1 and Phase 2 on the existing `codex/next-js-integration` branch. Do not create new static test pages after the shared test engine exists; all new tests should be authored as typed `TestDefinition` content and rendered by the common components.
