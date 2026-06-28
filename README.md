# Keaes Workspace

Keaes Workspace is now served by the Next.js app in `apps/workspace-next`.

## Active App

- Staff login: `/login`
- Staff dashboard: `/dashboard`
- Test Admin: `/admin/tests`
- Test inventory: `/admin/test-inventory`
- Staff Management: `/admin/staff`
- Hours Cross-Check: `/admin/hours-cross-check`
- Student tests: `/tests/[testId]/start` and `/tests/[testId]/take`

## Local Development

```bash
cd apps/workspace-next
cp .env.example .env.local
npm install
npm run dev -- --port 3000
```

Open `http://localhost:3000`.

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Verification

Before production cleanup or deploy promotion, run:

```bash
cd apps/workspace-next
npm run lint
npm run typecheck
npm run build
```

Then follow `apps/workspace-next/docs/production-verification-checklist.md`.

## Deployment

Netlify builds the Next app from `apps/workspace-next` using the root `netlify.toml`.

Legacy static pages have been removed from the working tree. Rollback uses git history or a previous Netlify deploy.

## Supabase

Supabase SQL and Edge Function setup lives in `supabase/`. The seed data now points at the Next routes.
