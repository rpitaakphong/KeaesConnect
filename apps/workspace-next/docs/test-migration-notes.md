# Next.js Test Migration Notes

## Current status

The shared Next.js test runner is now the primary implementation for these registered tests:

| Test ID | Title | Points | Status |
| --- | --- | ---: | --- |
| `english-literacy-1` | English Literacy Level 1 | 30 | active |
| `english-literacy-2` | English Literacy Level 2 | 30 | active |
| `english-literacy-3` | English Literacy Level 3 | 30 | active |
| `english-literacy-4` | English Literacy Level 4 | 30 | active |
| `english-literacy-5` | English Literacy Level 5 | 30 | active |
| `math-olympiad-1` | Math Olympiad Level 1 | 30 | active |
| `math-olympiad-2` | Math Olympiad Level 2 | 30 | active |
| `math-olympiad-3` | Math Olympiad Level 3 | 30 | active |
| `math-olympiad-4` | Math Olympiad Level 4 | 30 | active |
| `math-olympiad-5` | Math Olympiad Level 5 | 30 | active |
| `math-olympiad-6` | Math Olympiad Level 6 | 30 | active |
| `spip-year-7-english-pre` | SPIP Year 7 English Pre-test | 50 | active |
| `spip-year-7-math-pre` | SPIP Year 7 Math Pre-test | 40 | active |
| `spip-year-7-science-pre` | SPIP Year 7 Science Pre-test | 50 | active |
| `starter-progress-listening` | Starter Progress Listening | 20 | active |
| `starter-progress-reading-writing` | Starter Progress Reading & Writing | 25 | active |

The registry source of truth is `apps/workspace-next/src/features/tests/content/registry.ts`.
The admin inventory page is available at `/admin/test-inventory`.

## Asset locations

- English Literacy assets: `apps/workspace-next/public/test-assets/english-literacy/`
- Math Olympiad assets: `apps/workspace-next/public/test-assets/math-olympiad/`
- SPIP English assets: `apps/workspace-next/public/test-assets/spip/year-7-english-pre/`
- SPIP Math assets: `apps/workspace-next/public/test-assets/spip/year-7-math-pre/`
- SPIP Science assets: `apps/workspace-next/public/test-assets/spip/year-7-science-pre/`
- Starter Listening assets: `apps/workspace-next/public/test-assets/starter-listening/`
- Starter Reading & Writing assets: `apps/workspace-next/public/test-assets/starter-reading-writing/`

## Shared interaction cleanup

- Story sections can use `storyLayout: "heroImage"` for large centered image-first layouts.
- Image-overlay interactions use `ImageOverlay` and `ImageOverlayBoard` from `apps/workspace-next/src/features/tests/components/test-interactions.tsx`.
- Compact image and letter choices are handled in `QuestionRenderer` with shared grid classes.

## Staff tool migration

- Staff login and dashboard are handled by Next.js at `/login` and `/dashboard`.
- Test Admin is handled by Next.js at `/admin/tests`.
- Staff Management is handled by Next.js at `/admin/staff`.
- Hours Cross-Check is handled by Next.js at `/admin/hours-cross-check`.
- The static student dashboard mockup remains deferred because it is not connected to the staff/test workflow yet.

## Known caveats

- Starter Reading & Writing answer content should get a final teacher review before production grading is treated as official.
- Some SPIP Math and Science items still have bespoke interaction components because their UI rules are exam-specific.
- A full browser automation suite has not been added yet; current verification is lint, typecheck, manual smoke testing, and targeted browser checks.
- Supabase submission should be spot-checked with a real assignment before retiring legacy fallbacks.

## Legacy fallback pages

Keep these static pages until one full production verification cycle is complete:

- `apps/starter-listening/test.html`, replaced by `/tests/starter-progress-listening`
- `apps/starter-listening/reading-writing.html`, replaced by `/tests/starter-progress-reading-writing`
- `apps/admin-tests/staff.html`, replaced by `/admin/staff`
- `tools/hours-cross-check/index.html`, replaced by `/admin/hours-cross-check`
- `login.html`, replaced by `/login`

Do not delete the fallback pages until production submissions, reporting, audio behavior, and review-submit flows have all been verified.
