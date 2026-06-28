# Keaes Workspace Next

Primary Next.js app for Keaes Workspace staff tools, admin workflows, and migrated student assessments.

## Local Development

```bash
cd apps/workspace-next
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

## Migration Scope

This app is now the primary implementation for:

- Staff login and dashboard
- Test Admin catalog, assignment links, results, and test inventory
- Staff Management
- Hours Cross-Check
- Migrated English Literacy, Math Olympiad, SPIP, and Starter Progress tests

Legacy static pages remain in the repository as rollback fallbacks until one real production verification cycle is complete.

## Production Deployment

Netlify builds the Next app from this directory using the root `netlify.toml`:

```toml
[build]
  base = "apps/workspace-next"
  command = "npm run build"
  publish = ".next"
```

Set these environment variables in Netlify:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Verification

Use `docs/production-verification-checklist.md` before retiring any legacy static page.
