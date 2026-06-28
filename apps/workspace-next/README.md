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

Legacy static pages have been removed from the working tree. Rollback uses git history or a previous Netlify deploy.

## Production Deployment

Netlify builds the Next app using the root `netlify.toml`. The command changes into this app directory explicitly so the deploy works even when Netlify's UI base directory is `/`:

```toml
[build]
  command = "cd apps/workspace-next && npm run build"
  publish = "apps/workspace-next/.next"
```

Set these environment variables in Netlify:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Verification

Use `docs/production-verification-checklist.md` before promoting a production release.
